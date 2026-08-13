// Typed client for the Machine Science backend API.
// Server components use API_URL (internal); the browser uses the /api rewrite.

const SERVER_BASE = process.env.API_URL || "http://localhost:8081";

export type Locale = "az" | "en" | "ru";
export type I18nText = Partial<Record<Locale, string>>;

export interface BoardMember {
  id: number;
  fullName: string;
  title: string | null;
  section: "EDITOR_IN_CHIEF" | "HONORARY" | "BOARD";
  photoUrl: string | null;
  orcidUrl: string | null;
  scopusUrl: string | null;
  email: string | null;
  country: string | null;
}

export interface Issue {
  id: number;
  volume: number | null;
  number: number | null;
  year: number;
  title: string;
  description: string | null;
  coverUrl: string | null;
  fullPdfUrl: string | null;
  doi: string | null;
  slug: string;
  publishedAt: string | null;
}

export interface Metrics {
  views: number;
  abstractViews: number;
  downloads: number;
  citations: number;
}

export interface ArticleSummary {
  id: number;
  title: string;
  doi: string | null;
  subjectArea: string | null;
  keywords: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  publishedAt: string | null;
  issueId: number | null;
  authorNames: string[];
  metrics: Metrics;
}

export interface Author {
  firstName: string;
  lastName: string;
  email: string | null;
  affiliation: string | null;
  country: string | null;
  orcid: string | null;
  corresponding: boolean;
}

export interface ArticleDetail extends Omit<ArticleSummary, "authorNames"> {
  abstractText: string | null;
  keywords: string | null;
  language: string;
  status: string;
  authors: Author[];
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface JournalSettings {
  journalTitle: I18nText;
  tagline: I18nText;
  about: I18nText;
  issnPrint: string | null;
  issnOnline: string | null;
  doiPrefix: string | null;
  publisher: string | null;
  email: string | null;
  phone: string | null;
  address: I18nText;
  indexedIn: string[];
  social: Record<string, string>;
  publicationFee: string | null;
  logoUrl: string | null;
}

export interface ContentPage {
  id: number;
  slug: string;
  title: I18nText;
  body: I18nText;
  sortOrder: number;
}

// ---- /api/v1/home aggregate feed ----------------------------------------
// One request that powers the whole public site. Sub-objects are typed where
// it helps the page builders; anything the backend may extend stays loose.

export interface HeroSlide {
  id?: number;
  imageUrl: string;
  altText: string | null;
  caption: I18nText;
  sortOrder?: number;
}

export interface ScopeTopic {
  id?: number;
  icon: string; // keyed into the icon set: gear|wave|chip|layer|leaf|trend|tool
  title: I18nText;
  description: I18nText;
  sortOrder?: number;
}

export interface AuthorStep {
  stepNo: number;
  title: I18nText;
  body: I18nText;
}

export interface AuthorTerm {
  title: I18nText;
  body: I18nText;
}

export interface Announcement {
  id: number;
  title: I18nText;
  body: I18nText;
  publishedAt: string | null;
  [key: string]: unknown;
}

// Archive/open-call issues extend Issue with the extras the feed adds.
export interface HomeIssue extends Issue {
  numberRoman?: string | null;
  submissionDeadline?: string | null;
}

// settings on the home feed carry two view-model extras (record + ticker rows)
// that the plain /settings endpoint does not.
export type HomeSettings = JournalSettings & {
  record?: Partial<Record<Locale, [string, string][]>>;
  ticker?: Partial<Record<Locale, [string, string][]>>;
};

export interface Home {
  settings: HomeSettings;
  texts: Record<string, I18nText>;
  heroSlides: HeroSlide[];
  scopeTopics: ScopeTopic[];
  authorSteps: AuthorStep[];
  authorTerms: AuthorTerm[];
  board: BoardMember[];
  announcements: Announcement[];
  currentIssue: { issue: Issue; articles: ArticleSummary[] } | null;
  archive: HomeIssue[];
  openCalls: HomeIssue[];
  pages: ContentPage[];
}

async function get<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${SERVER_BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  settings: () => get<JournalSettings>("/api/v1/settings"),
  board: () => get<BoardMember[]>("/api/v1/board"),
  issues: () => get<Issue[]>("/api/v1/issues"),
  issue: (slug: string) =>
    get<{ issue: Issue; articles: ArticleSummary[] }>(`/api/v1/issues/${slug}`),
  articles: (params: { q?: string; issueId?: number; subject?: string; page?: number; size?: number } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && qs.set(k, String(v)));
    return get<Page<ArticleSummary>>(`/api/v1/articles?${qs.toString()}`);
  },
  article: (id: number | string) => get<ArticleDetail>(`/api/v1/articles/${id}`),
  pages: () => get<ContentPage[]>("/api/v1/pages"),
  page: (slug: string) => get<ContentPage>(`/api/v1/pages/${slug}`),
  home: () => get<Home>("/api/v1/home"),
};

export function text(t: I18nText | null | undefined, locale: Locale): string {
  if (!t) return "";
  return t[locale] ?? t.en ?? Object.values(t)[0] ?? "";
}
