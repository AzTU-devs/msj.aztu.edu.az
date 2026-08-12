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
};

export function text(t: I18nText | null | undefined, locale: Locale): string {
  if (!t) return "";
  return t[locale] ?? t.en ?? Object.values(t)[0] ?? "";
}
