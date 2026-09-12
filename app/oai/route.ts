// OAI-PMH 2.0 provider for Machine Science.
//
// Registered with harvesters (OpenAIRE, BASE, CORE, ROAD …) as the repository's
// *base URL*: https://msj.aztu.edu.az/oai
//
// Three things a validator checks before it checks anything else, and each has
// bitten this kind of endpoint before:
//
//  1. The base URL must answer directly. Validators do not follow redirects, so
//     this is a route handler at exactly /oai — no trailing-slash variant, no
//     rewrite, no http→https hop. Register the https URL, because the redirect
//     from http would fail for the same reason.
//  2. The response must be XML, served as text/xml with an explicit charset, on
//     both GET and POST (the spec requires both).
//  3. Every response echoes the request, and errors are *OAI errors inside a
//     200 response*, not HTTP error codes — a 400 reads as a broken repository.
//
// Metadata format is oai_dc, which every harvester understands and which the
// OpenAIRE literature guidelines build on.

import { api, type ArticleDetail, type ArticleSummary, type Issue } from "@/lib/api";
import { JOURNAL_NAME, PUBLISHER, ISSN_ONLINE, ISSN_PRINT, FOUNDED } from "@/lib/journal";
import { SITE_URL } from "@/lib/site";

// Query strings vary per harvest request, and the upstream fetches carry their
// own revalidation — so render per request rather than caching whole responses.
export const dynamic = "force-dynamic";

const REPOSITORY_NAME = `${JOURNAL_NAME} — ${PUBLISHER}`;
const BASE_URL = `${SITE_URL}/oai`;
const ADMIN_EMAIL = "msj@aztu.edu.az";
/** Host part of the OAI identifier scheme: oai:<namespace>:article/<id> */
const NAMESPACE = SITE_URL.replace(/^https?:\/\//, "");
const EARLIEST_DATESTAMP = `${FOUNDED}-01-01`;

/** Records per response before a resumptionToken is issued. */
const PAGE_SIZE = 50;

const VERBS = [
  "Identify",
  "ListMetadataFormats",
  "ListSets",
  "ListIdentifiers",
  "ListRecords",
  "GetRecord",
] as const;
type Verb = (typeof VERBS)[number];

/** Arguments each verb accepts, beyond `verb` itself. */
const ALLOWED_ARGS: Record<Verb, string[]> = {
  Identify: [],
  ListMetadataFormats: ["identifier"],
  ListSets: ["resumptionToken"],
  ListIdentifiers: ["from", "until", "metadataPrefix", "set", "resumptionToken"],
  ListRecords: ["from", "until", "metadataPrefix", "set", "resumptionToken"],
  GetRecord: ["identifier", "metadataPrefix"],
};

// ---------------------------------------------------------------- XML helpers

/** Escapes text for an element body or an attribute value. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    // XML 1.0 forbids most control characters outright; a stray one makes the
    // whole document unparseable, which a harvester reports as a dead repository.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "");
}

function tag(name: string, value: unknown): string {
  const text = String(value ?? "").trim();
  return text ? `    <${name}>${esc(text)}</${name}>\n` : "";
}

function xmlResponse(body: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    status: 200,
    headers: {
      // Explicit charset: some validators reject a bare text/xml.
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** UTC timestamp for responseDate — always second granularity, per the spec. */
function nowUtc(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Our declared granularity is YYYY-MM-DD, so datestamps are dates. */
function datestamp(iso: string | null | undefined): string {
  if (!iso) return EARLIEST_DATESTAMP;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? EARLIEST_DATESTAMP : d.toISOString().slice(0, 10);
}

function envelope(request: { verb?: string; [k: string]: string | undefined }, inner: string): string {
  const attrs = Object.entries(request)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => ` ${k}="${esc(v)}"`)
    .join("");
  return (
    `<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"\n` +
    `         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ ` +
    `http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">\n` +
    `  <responseDate>${nowUtc()}</responseDate>\n` +
    `  <request${attrs}>${esc(BASE_URL)}</request>\n` +
    inner +
    `</OAI-PMH>`
  );
}

type ErrorCode =
  | "badArgument"
  | "badResumptionToken"
  | "badVerb"
  | "cannotDisseminateFormat"
  | "idDoesNotExist"
  | "noRecordsMatch"
  | "noMetadataFormats"
  | "noSetHierarchy";

/**
 * An OAI error. Note the 200 status: the protocol carries its own error channel,
 * and an HTTP 4xx here makes a harvester mark the repository unreachable rather
 * than report the actual problem.
 */
function oaiError(code: ErrorCode, message: string, echo: Record<string, string | undefined> = {}): Response {
  // On badVerb/badArgument the spec says to echo only the base URL.
  const request = code === "badVerb" || code === "badArgument" ? {} : echo;
  return xmlResponse(envelope(request, `  <error code="${code}">${esc(message)}</error>\n`));
}

// ------------------------------------------------------------------ data load

interface Repo {
  articles: ArticleSummary[];
  issues: Issue[];
  issueById: Map<number, Issue>;
}

/**
 * The whole published corpus, in one consistent snapshot.
 *
 * Paged harvesting needs a stable order across requests: if page 2 is computed
 * from a different ordering than page 1, records are silently skipped. The
 * public list endpoint offers no sort parameter, so the snapshot is taken here
 * and sorted by id — and `resumptionToken` then only has to carry an offset.
 */
async function loadRepo(): Promise<Repo> {
  const first = await api.articles({ page: 0, size: 200 });
  const all: ArticleSummary[] = [...first.content];
  for (let p = 1; p < first.totalPages; p++) {
    const next = await api.articles({ page: p, size: 200 });
    all.push(...next.content);
  }

  let issues: Issue[] = [];
  try {
    issues = await api.issues();
  } catch {
    issues = [];
  }

  all.sort((a, b) => a.id - b.id);
  return {
    articles: all,
    issues,
    issueById: new Map(issues.map((i) => [i.id, i])),
  };
}

function identifierFor(id: number): string {
  return `oai:${NAMESPACE}:article/${id}`;
}

/** Parses our identifier back to an article id, or null if it is not ours. */
function idFromIdentifier(identifier: string): number | null {
  const prefix = `oai:${NAMESPACE}:article/`;
  if (!identifier.startsWith(prefix)) return null;
  const raw = Number(identifier.slice(prefix.length));
  return Number.isInteger(raw) && raw > 0 ? raw : null;
}

function setSpecFor(issue: Issue): string {
  return `issue:${issue.slug}`;
}

// ------------------------------------------------------------- record builders

/** `<header>` — shared by ListIdentifiers, ListRecords and GetRecord. */
function headerXml(a: ArticleSummary, repo: Repo, indent = "    "): string {
  const issue = a.issueId != null ? repo.issueById.get(a.issueId) : undefined;
  const sets = issue ? `${indent}  <setSpec>${esc(setSpecFor(issue))}</setSpec>\n` : "";
  return (
    `${indent}<header>\n` +
    `${indent}  <identifier>${esc(identifierFor(a.id))}</identifier>\n` +
    `${indent}  <datestamp>${datestamp(a.publishedAt)}</datestamp>\n` +
    sets +
    `${indent}</header>\n`
  );
}

/**
 * Dublin Core for one article.
 *
 * `detail` carries the abstract, the full author list and the language; when the
 * per-article fetch fails we still emit a valid record from the summary rather
 * than dropping it, because a missing record looks to a harvester like a
 * withdrawn paper.
 */
function dublinCore(a: ArticleSummary, detail: ArticleDetail | null, repo: Repo): string {
  const issue = a.issueId != null ? repo.issueById.get(a.issueId) : undefined;
  const authors = detail?.authors?.length
    ? detail.authors.map((au) => `${au.lastName}, ${au.firstName}`.trim())
    : a.authorNames ?? [];

  const keywords = (a.keywords ?? detail?.keywords ?? "")
    .split(/[;,]/)
    .map((k) => k.trim())
    .filter(Boolean);

  const pages =
    a.pageStart != null
      ? a.pageEnd != null && a.pageEnd !== a.pageStart
        ? `${a.pageStart}-${a.pageEnd}`
        : String(a.pageStart)
      : "";

  const citation = [
    JOURNAL_NAME,
    issue?.volume != null ? `Vol. ${issue.volume}` : "",
    issue?.number != null ? `No. ${issue.number}` : "",
    issue?.year ? `(${issue.year})` : "",
    pages ? `pp. ${pages}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  let out =
    `      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"\n` +
    `                 xmlns:dc="http://purl.org/dc/elements/1.1/"\n` +
    `                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `                 xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ ` +
    `http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\n`;

  const body: string[] = [];
  body.push(tag("dc:title", a.title));
  for (const name of authors) body.push(tag("dc:creator", name));
  for (const k of keywords) body.push(tag("dc:subject", k));
  if (a.subjectArea) body.push(tag("dc:subject", a.subjectArea));
  if (detail?.abstractText) body.push(tag("dc:description", detail.abstractText));
  body.push(tag("dc:publisher", PUBLISHER));
  body.push(tag("dc:date", datestamp(a.publishedAt)));
  body.push(tag("dc:type", "info:eu-repo/semantics/article"));
  body.push(tag("dc:type", "info:eu-repo/semantics/publishedVersion"));
  body.push(tag("dc:format", "application/pdf"));
  body.push(tag("dc:identifier", `${SITE_URL}/articles/${a.id}`));
  if (a.doi) body.push(tag("dc:identifier", `https://doi.org/${a.doi}`));
  if (citation) body.push(tag("dc:identifier", citation));
  body.push(tag("dc:source", `${JOURNAL_NAME}; ISSN ${ISSN_PRINT}; E-ISSN ${ISSN_ONLINE}`));
  body.push(tag("dc:language", detail?.language || "eng"));
  // The access-rights and licence vocabulary OpenAIRE looks for.
  body.push(tag("dc:rights", "info:eu-repo/semantics/openAccess"));
  body.push(tag("dc:rights", "https://creativecommons.org/licenses/by/4.0/"));

  out += body.join("").replace(/^ {4}/gm, "        ");
  out += `      </oai_dc:dc>\n`;
  return out;
}

/** Fetches article details for one page of records, tolerating individual failures. */
async function loadDetails(items: ArticleSummary[]): Promise<Map<number, ArticleDetail | null>> {
  const entries = await Promise.all(
    items.map(async (a): Promise<[number, ArticleDetail | null]> => {
      try {
        return [a.id, await api.article(a.id)];
      } catch {
        return [a.id, null];
      }
    })
  );
  return new Map(entries);
}

// ------------------------------------------------------------ resumption token

interface TokenState {
  o: number; // offset
  p: string; // metadataPrefix
  s?: string; // set
  f?: string; // from
  u?: string; // until
}

function encodeToken(state: TokenState): string {
  return Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
}

function decodeToken(raw: string): TokenState | null {
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as TokenState;
    if (typeof parsed.o !== "number" || parsed.o < 0 || typeof parsed.p !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------- filtering

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function filterArticles(repo: Repo, state: TokenState): ArticleSummary[] {
  let list = repo.articles;

  if (state.s) {
    const issue = repo.issues.find((i) => setSpecFor(i) === state.s);
    if (!issue) return [];
    list = list.filter((a) => a.issueId === issue.id);
  }
  if (state.f) list = list.filter((a) => datestamp(a.publishedAt) >= state.f!);
  if (state.u) list = list.filter((a) => datestamp(a.publishedAt) <= state.u!);

  return list;
}

/** `<resumptionToken>` closing a list response — always emitted on the last page. */
function resumptionXml(state: TokenState, total: number, nextOffset: number): string {
  if (nextOffset >= total) {
    // An empty token with the totals tells the harvester the list is complete.
    return `    <resumptionToken completeListSize="${total}" cursor="${state.o}"/>\n`;
  }
  const token = encodeToken({ ...state, o: nextOffset });
  return (
    `    <resumptionToken completeListSize="${total}" cursor="${state.o}">` +
    `${esc(token)}</resumptionToken>\n`
  );
}

// ---------------------------------------------------------------- verb handlers

function identify(): string {
  return (
    `  <Identify>\n` +
    `    <repositoryName>${esc(REPOSITORY_NAME)}</repositoryName>\n` +
    `    <baseURL>${esc(BASE_URL)}</baseURL>\n` +
    `    <protocolVersion>2.0</protocolVersion>\n` +
    `    <adminEmail>${esc(ADMIN_EMAIL)}</adminEmail>\n` +
    `    <earliestDatestamp>${EARLIEST_DATESTAMP}</earliestDatestamp>\n` +
    `    <deletedRecord>no</deletedRecord>\n` +
    `    <granularity>YYYY-MM-DD</granularity>\n` +
    `    <description>\n` +
    `      <oai-identifier xmlns="http://www.openarchives.org/OAI/2.0/oai-identifier"\n` +
    `                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `                      xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai-identifier ` +
    `http://www.openarchives.org/OAI/2.0/oai-identifier.xsd">\n` +
    `        <scheme>oai</scheme>\n` +
    `        <repositoryIdentifier>${esc(NAMESPACE)}</repositoryIdentifier>\n` +
    `        <delimiter>:</delimiter>\n` +
    `        <sampleIdentifier>${esc(identifierFor(1))}</sampleIdentifier>\n` +
    `      </oai-identifier>\n` +
    `    </description>\n` +
    `  </Identify>\n`
  );
}

function listMetadataFormats(): string {
  return (
    `  <ListMetadataFormats>\n` +
    `    <metadataFormat>\n` +
    `      <metadataPrefix>oai_dc</metadataPrefix>\n` +
    `      <schema>http://www.openarchives.org/OAI/2.0/oai_dc.xsd</schema>\n` +
    `      <metadataNamespace>http://www.openarchives.org/OAI/2.0/oai_dc/</metadataNamespace>\n` +
    `    </metadataFormat>\n` +
    `  </ListMetadataFormats>\n`
  );
}

// --------------------------------------------------------------------- handler

async function handle(url: URL): Promise<Response> {
  const params = url.searchParams;
  const verb = params.get("verb") ?? "";

  if (!verb) return oaiError("badVerb", "The verb argument is missing.");
  if (!VERBS.includes(verb as Verb)) return oaiError("badVerb", `Unsupported verb: ${verb}`);
  const v = verb as Verb;

  // Reject unknown or repeated arguments — a validator tests for this.
  const allowed = new Set([...ALLOWED_ARGS[v], "verb"]);
  for (const key of params.keys()) {
    if (!allowed.has(key)) {
      return oaiError("badArgument", `The argument "${key}" is not allowed for the verb ${v}.`);
    }
    if (params.getAll(key).length > 1) {
      return oaiError("badArgument", `The argument "${key}" was repeated.`);
    }
  }

  const echo: Record<string, string | undefined> = { verb: v };
  for (const key of ALLOWED_ARGS[v]) {
    const value = params.get(key);
    if (value != null) echo[key] = value;
  }

  if (v === "Identify") return xmlResponse(envelope(echo, identify()));

  if (v === "ListMetadataFormats") {
    const identifier = params.get("identifier");
    if (identifier) {
      const id = idFromIdentifier(identifier);
      if (id == null) {
        return oaiError("idDoesNotExist", `Unknown identifier: ${identifier}`, echo);
      }
      try {
        await api.article(id);
      } catch {
        return oaiError("idDoesNotExist", `Unknown identifier: ${identifier}`, echo);
      }
    }
    return xmlResponse(envelope(echo, listMetadataFormats()));
  }

  if (v === "ListSets") {
    const repo = await loadRepo();
    if (repo.issues.length === 0) {
      return oaiError("noSetHierarchy", "This repository does not define sets.", echo);
    }
    const sets = repo.issues
      .map(
        (i) =>
          `    <set>\n` +
          `      <setSpec>${esc(setSpecFor(i))}</setSpec>\n` +
          `      <setName>${esc(i.title)}</setName>\n` +
          `    </set>\n`
      )
      .join("");
    return xmlResponse(envelope(echo, `  <ListSets>\n${sets}  </ListSets>\n`));
  }

  if (v === "GetRecord") {
    const identifier = params.get("identifier");
    const prefix = params.get("metadataPrefix");
    if (!identifier || !prefix) {
      return oaiError("badArgument", "GetRecord requires identifier and metadataPrefix.");
    }
    if (prefix !== "oai_dc") {
      return oaiError("cannotDisseminateFormat", `Unsupported metadataPrefix: ${prefix}`, echo);
    }
    const id = idFromIdentifier(identifier);
    if (id == null) return oaiError("idDoesNotExist", `Unknown identifier: ${identifier}`, echo);

    const repo = await loadRepo();
    const summary = repo.articles.find((a) => a.id === id);
    if (!summary) return oaiError("idDoesNotExist", `Unknown identifier: ${identifier}`, echo);

    let detail: ArticleDetail | null = null;
    try {
      detail = await api.article(id);
    } catch {
      detail = null;
    }

    const record =
      `  <GetRecord>\n` +
      `    <record>\n` +
      headerXml(summary, repo, "      ") +
      `      <metadata>\n` +
      dublinCore(summary, detail, repo) +
      `      </metadata>\n` +
      `    </record>\n` +
      `  </GetRecord>\n`;
    return xmlResponse(envelope(echo, record));
  }

  // ---- ListIdentifiers / ListRecords ----
  const token = params.get("resumptionToken");
  let state: TokenState;

  if (token) {
    // resumptionToken is exclusive: it cannot be combined with other filters.
    for (const key of ["from", "until", "set", "metadataPrefix"]) {
      if (params.get(key) != null) {
        return oaiError("badArgument", "resumptionToken cannot be combined with other arguments.");
      }
    }
    const decoded = decodeToken(token);
    if (!decoded) return oaiError("badResumptionToken", "The resumption token is invalid or expired.", echo);
    state = decoded;
  } else {
    const prefix = params.get("metadataPrefix");
    if (!prefix) return oaiError("badArgument", `${v} requires a metadataPrefix argument.`);
    if (prefix !== "oai_dc") {
      return oaiError("cannotDisseminateFormat", `Unsupported metadataPrefix: ${prefix}`, echo);
    }
    const from = params.get("from") ?? undefined;
    const until = params.get("until") ?? undefined;
    for (const [label, value] of [["from", from], ["until", until]] as const) {
      if (value && !DATE_RE.test(value)) {
        return oaiError("badArgument", `The ${label} argument must be a YYYY-MM-DD date.`);
      }
    }
    state = { o: 0, p: prefix, s: params.get("set") ?? undefined, f: from, u: until };
  }

  const repo = await loadRepo();
  const matched = filterArticles(repo, state);
  if (matched.length === 0) {
    return oaiError("noRecordsMatch", "No records match the request.", echo);
  }
  if (state.o >= matched.length) {
    return oaiError("badResumptionToken", "The resumption token is out of range.", echo);
  }

  const slice = matched.slice(state.o, state.o + PAGE_SIZE);
  const nextOffset = state.o + slice.length;

  if (v === "ListIdentifiers") {
    const headers = slice.map((a) => headerXml(a, repo)).join("");
    return xmlResponse(
      envelope(
        echo,
        `  <ListIdentifiers>\n${headers}${resumptionXml(state, matched.length, nextOffset)}  </ListIdentifiers>\n`
      )
    );
  }

  const details = await loadDetails(slice);
  const records = slice
    .map(
      (a) =>
        `    <record>\n` +
        headerXml(a, repo, "      ") +
        `      <metadata>\n` +
        dublinCore(a, details.get(a.id) ?? null, repo) +
        `      </metadata>\n` +
        `    </record>\n`
    )
    .join("");

  return xmlResponse(
    envelope(
      echo,
      `  <ListRecords>\n${records}${resumptionXml(state, matched.length, nextOffset)}  </ListRecords>\n`
    )
  );
}

export async function GET(request: Request): Promise<Response> {
  try {
    return await handle(new URL(request.url));
  } catch {
    // The backend is unreachable. Answer in-protocol rather than with a 500, so
    // a harvester records a transient failure instead of an invalid repository.
    return xmlResponse(
      envelope({}, `  <error code="badArgument">The repository is temporarily unavailable.</error>\n`)
    );
  }
}

/** OAI-PMH requires POST with application/x-www-form-urlencoded as well as GET. */
export async function POST(request: Request): Promise<Response> {
  try {
    const form = await request.formData();
    const url = new URL(request.url);
    url.search = "";
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") url.searchParams.append(key, value);
    }
    return await handle(url);
  } catch {
    return xmlResponse(
      envelope({}, `  <error code="badArgument">The repository is temporarily unavailable.</error>\n`)
    );
  }
}
