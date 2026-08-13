"use client";
// Author-portal auth + API client (client-side; tokens in localStorage).

// Empty by default → browser calls are same-origin (/api/...) and the Next
// server proxies them to the backend. Set NEXT_PUBLIC_API_URL to call directly.
const BASE = process.env.NEXT_PUBLIC_API_URL || "";
const ACCESS = "msj_author_access";
const REFRESH = "msj_author_refresh";

export const auth = {
  get access() { return typeof window === "undefined" ? null : localStorage.getItem(ACCESS); },
  get refresh() { return typeof window === "undefined" ? null : localStorage.getItem(REFRESH); },
  set(a: string, r: string) { localStorage.setItem(ACCESS, a); localStorage.setItem(REFRESH, r); },
  clear() { localStorage.removeItem(ACCESS); localStorage.removeItem(REFRESH); },
  get isAuthed() { return !!this.access; },
};

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (auth.access) headers.set("Authorization", `Bearer ${auth.access}`);
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 401 && retry && auth.refresh) {
    if (await tryRefresh()) return request<T>(path, init, false);
  }
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { const b = await res.json(); msg = b.message || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: auth.refresh }),
    });
    if (!res.ok) { auth.clear(); return false; }
    const d = await res.json();
    auth.set(d.accessToken, d.refreshToken);
    return true;
  } catch { auth.clear(); return false; }
}

// ---- types ----
export interface Me { id: number; email: string; firstName: string; lastName: string; roles: string[]; }
export interface AuthorInput { firstName: string; lastName: string; email?: string; affiliation?: string; country?: string; orcid?: string; corresponding: boolean; }
export interface SubmissionInput { title: string; abstractText?: string; keywords?: string; subjectArea?: string; language?: string; issueId?: number | null; authors: AuthorInput[]; }
export interface OpenSection { id: number; year: number; number: number | null; numberRoman: string; title: string; submissionDeadline: string | null; }
export interface FileDto { id: number; kind: string; originalName: string; sizeBytes: number | null; contentType: string | null; createdAt: string; }
export interface ReviewForAuthor { recommendation: string; commentsToAuthor: string | null; submittedAt: string; }
export interface StatusEvent { fromStatus: string | null; toStatus: string; comment: string | null; at: string; }
export interface SubmissionSummary { id: number; title: string; status: string; subjectArea: string | null; submittedAt: string | null; updatedAt: string; }
export interface SubmissionDetail extends SubmissionSummary {
  abstractText: string | null; keywords: string | null; language: string; doi: string | null; createdAt: string;
  issueId: number | null; issueTitle: string | null;
  authors: (AuthorInput & {})[]; files: FileDto[]; history: StatusEvent[]; reviews: ReviewForAuthor[]; editorNote: string | null; canEdit: boolean;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const r = await request<{ accessToken: string; refreshToken: string; user: Me }>(
      "/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    auth.set(r.accessToken, r.refreshToken); return r.user;
  },
  register: async (data: { email: string; password: string; firstName: string; lastName: string; affiliation?: string; country?: string; orcid?: string }) => {
    const r = await request<{ accessToken: string; refreshToken: string; user: Me }>(
      "/api/v1/auth/register", { method: "POST", body: JSON.stringify(data) });
    auth.set(r.accessToken, r.refreshToken); return r.user;
  },
  me: () => request<Me>("/api/v1/auth/me"),
  logout: async () => { try { await request("/api/v1/auth/logout", { method: "POST" }); } catch {} auth.clear(); },
};

export const submissions = {
  listMine: () => request<SubmissionSummary[]>("/api/v1/me/submissions"),
  get: (id: number) => request<SubmissionDetail>(`/api/v1/submissions/${id}`),
  create: (input: SubmissionInput) => request<SubmissionDetail>("/api/v1/submissions", { method: "POST", body: JSON.stringify(input) }),
  update: (id: number, input: SubmissionInput) => request<SubmissionDetail>(`/api/v1/submissions/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  submit: (id: number) => request<SubmissionDetail>(`/api/v1/submissions/${id}/submit`, { method: "POST" }),
  uploadFile: async (id: number, file: File, kind = "MANUSCRIPT") => {
    const fd = new FormData(); fd.append("file", file);
    return request<FileDto>(`/api/v1/submissions/${id}/files?kind=${kind}`, { method: "POST", body: fd });
  },
  deleteFile: (id: number, fileId: number) => request<void>(`/api/v1/submissions/${id}/files/${fileId}`, { method: "DELETE" }),
  openSections: () => request<OpenSection[]>("/api/v1/issues/open"),
  fileUrl: (fileId: number) => `${BASE}/api/v1/files/${fileId}/download`,
  openFile: async (fileId: number) => {
    const res = await fetch(`${BASE}/api/v1/files/${fileId}/download`, {
      headers: auth.access ? { Authorization: `Bearer ${auth.access}` } : {},
    });
    if (!res.ok) throw new Error(`Download failed (${res.status})`);
    const url = URL.createObjectURL(await res.blob());
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },
};

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft", SUBMITTED: "Submitted", WITH_EDITOR: "With editor", UNDER_REVIEW: "Under review",
  REVISION_REQUESTED: "Revision requested", RESUBMITTED: "Resubmitted", ACCEPTED: "Accepted",
  REJECTED: "Rejected", COPYEDITING: "Copyediting", IN_PRODUCTION: "In production", PUBLISHED: "Published", WITHDRAWN: "Withdrawn",
};

export const SUBJECT_AREAS = [
  "Machine design", "Mechanics", "Materials Science and Metallurgy", "Mechanical engineering technology",
  "Automation and ICT", "Energy and Environment", "Economics and management",
];
