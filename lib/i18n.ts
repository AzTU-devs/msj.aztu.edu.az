// UI strings for the site chrome.
//
// The journal publishes in English only. This stays a single typed table
// rather than literals scattered across the pages: one place to correct a
// wording, and a typo in a key is a compile error instead of `undefined`
// rendered into the page.
//
// Backend *content* (hero lede, about, scope topics, announcements, the
// journal record) still comes through `text(field, "en")` against the
// I18nText columns — those keep their az/ru slots in the database, unused.

export interface Strings {
  // ---- navigation ----
  navAbout: string;
  navCurrent: string;
  navScope: string;
  navBoard: string;
  navArchive: string;
  navAuthors: string;
  navContact: string;
  navManuscript: string;
  navOpenAccess: string;
  navAiPolicy: string;
  // ---- header / utility strip ----
  issn: string;
  eIssn: string;
  openAccess: string;
  peerReviewed: string;
  freeOfCharge: string;
  authorSignIn: string;
  submit: string;
  submitManuscript: string;
  searchArticles: string;
  searchTheJournal: string;
  searchPlaceholder: string;
  searchHint: string;
  searchButton: string;
  closeSearch: string;
  menu: string;
  switchTheme: string;
  language: string;
  skipToContent: string;
  primaryNav: string;
  // ---- hero ----
  heroEyebrow: string;
  heroLede: string;
  readCurrentIssue: string;
  publishedSince: string;
  issuesOnline: string;
  costToAuthors: string;
  free: string;
  // ---- shared actions ----
  readMore: string;
  browseArchive: string;
  allSubjectAreas: string;
  theFullBoard: string;
  openTheIssue: string;
  downloadFullIssue: string;
  downloadPdf: string;
  thisIssue: string;
  backToArchive: string;
  // ---- home sections ----
  currentIssue: string;
  issueRecord: string;
  featured: string;
  aboutTheJournal: string;
  aboutTitle: string;
  journalRecord: string;
  indexedIn: string;
  scopeLabel: string;
  scopeTitle: string;
  announcements: string;
  announcementsTitle: string;
  openCall: string;
  openCallTitle: string;
  openCallLede: string;
  callForPapers: string;
  submissionDeadline: string;
  boardLabel: string;
  boardTitle: string;
  archiveLabel: string;
  archiveTitle: string;
  archiveLede: string;
  contactLabel: string;
  contactTitle: string;
  contactLede: string;
  writeToEditors: string;
  // ---- quick actions ----
  qcRead: string;
  qcReadBody: string;
  qcSubmit: string;
  qcSubmitBody: string;
  qcArchive: string;
  qcArchiveBody: string;
  qcAuthors: string;
  qcAuthorsBody: string;
  // ---- record / meta labels ----
  volume: string;
  number: string;
  year: string;
  articles: string;
  article: string;
  published: string;
  pages: string;
  doi: string;
  language_: string;
  licence: string;
  frequency: string;
  twiceAYear: string;
  english: string;
  publisher: string;
  doiPrefix: string;
  issnPrint: string;
  issnOnline: string;
  founded: string;
  boardMembers: string;
  countries: string;
  editorsAndReviewers: string;
  inTotal: string;
  doubleBlind: string;
  peerReview: string;
  charges: string;
  none: string;
  // ---- article page ----
  tableOfContents: string;
  abstract: string;
  keywords: string;
  authorsAndAffiliations: string;
  howToCite: string;
  citation: string;
  copyToClipboard: string;
  copied: string;
  share: string;
  shareByEmail: string;
  copyLink: string;
  fullText: string;
  fullIssuePdf: string;
  articleMetrics: string;
  views: string;
  downloads: string;
  citations: string;
  identifiers: string;
  issue: string;
  correspondingAuthor: string;
  corr: string;
  researchArticle: string;
  licenceNote: string;
  ccLicenceName: string;
  // ---- search ----
  search: string;
  searchResults: string;
  searchTheArchive: string;
  searchLede: string;
  noMatches: string;
  noMatchesBody: string;
  startSearch: string;
  startSearchBody: string;
  searchUnavailable: string;
  searchUnavailableBody: string;
  prev: string;
  next: string;
  resultPages: string;
  // ---- empty / error states ----
  noIssuesYet: string;
  noIssuesYetBody: string;
  boardUnavailable: string;
  boardUnavailableBody: string;
  scopeUnavailable: string;
  scopeUnavailableBody: string;
  issueEmpty: string;
  issueEmptyBody: string;
  notFoundTitle: string;
  notFoundLede: string;
  returnHome: string;
  // ---- footer ----
  theJournal: string;
  aimAndScope: string;
  forAuthors: string;
  authorGuidelines: string;
  publicationEthics: string;
  editorialOffice: string;
  ethics: string;
  contact: string;
  sitemap: string;
  publishedBy: string;
  numbers: string;
  numbersOne: string;
  fullTextPdf: string;
  previousIssue: string;
  nextIssue: string;
  adjacentIssues: string;
  breadcrumb: string;
  home: string;
}

const en: Strings = {
  navAbout: "About",
  navCurrent: "Current Issue",
  navScope: "Scope",
  navBoard: "Editorial Board",
  navArchive: "Archive",
  navAuthors: "Information for Authors",
  navContact: "Contact",
  navManuscript: "Preparation of Manuscript",
  navOpenAccess: "Open access policies",
  navAiPolicy: "AI Policy",

  issn: "ISSN",
  eIssn: "E-ISSN",
  openAccess: "Open access",
  peerReviewed: "Peer reviewed",
  freeOfCharge: "Free of charge",
  authorSignIn: "Author sign-in",
  submit: "Submit",
  submitManuscript: "Submit a manuscript",
  searchArticles: "Search articles",
  searchTheJournal: "Search the journal",
  searchPlaceholder: "Title, author, keyword…",
  searchHint: "Searches every article in the archive — title, authors, keywords.",
  searchButton: "Search",
  closeSearch: "Close search",
  menu: "Menu",
  switchTheme: "Switch colour theme",
  language: "Language",
  skipToContent: "Skip to content",
  primaryNav: "Primary",

  heroEyebrow: "Azerbaijan Technical University · Baku",
  heroLede:
    "An international scientific and technical journal on the theory of mechanisms and machines — published continuously since 2001, peer-reviewed, and free of charge to authors.",
  readCurrentIssue: "Read current issue",
  publishedSince: "Published since",
  issuesOnline: "Issues online",
  costToAuthors: "Cost to authors",
  free: "Free",

  readMore: "Read more about the journal",
  browseArchive: "Browse the archive",
  allSubjectAreas: "All subject areas",
  theFullBoard: "The full board",
  openTheIssue: "Open the issue",
  downloadFullIssue: "Download full issue",
  downloadPdf: "Download PDF",
  thisIssue: "This issue",
  backToArchive: "Browse the archive",

  currentIssue: "Current issue",
  issueRecord: "Issue record",
  featured: "Featured",
  aboutTheJournal: "About the journal",
  aboutTitle: "A quarter-century of machine science",
  journalRecord: "Journal record",
  indexedIn: "Indexed & abstracted in",
  scopeLabel: "Scope",
  scopeTitle: "Where we publish",
  announcements: "Announcements",
  announcementsTitle: "From the editorial office",
  openCall: "Open call for papers",
  openCallTitle: "Submit your research",
  openCallLede:
    "Machine Science is currently accepting manuscripts for the following issues. Submission is free of charge and all papers are peer-reviewed.",
  callForPapers: "Call for papers",
  submissionDeadline: "Submission deadline",
  boardLabel: "Editorial board",
  boardTitle: "Who reviews the work",
  archiveLabel: "Archive",
  archiveTitle: "Every issue, open",
  archiveLede: "All issues are freely available as full-text PDF. No subscription, no author fee.",
  contactLabel: "Contact",
  contactTitle: "Send us<br>your research",
  contactLede:
    "Editorial office of “Machine Science”, Azerbaijan Technical University. Open access questions not answered by our policy are welcome by e-mail.",
  writeToEditors: "Write to the editors",

  qcRead: "Read the current issue",
  qcReadBody: "Every article free to read, download and reuse under CC BY.",
  qcSubmit: "Submit a manuscript",
  qcSubmitBody: "No submission, review or publication charge at any stage.",
  qcArchive: "Browse the archive",
  qcArchiveBody: "Every issue online as full-text PDF.",
  qcAuthors: "Author guidelines",
  qcAuthorsBody: "Manuscript preparation, peer review and the terms of submission.",

  volume: "Volume",
  number: "Number",
  year: "Year",
  articles: "articles",
  article: "article",
  published: "Published",
  pages: "Pages",
  doi: "DOI",
  language_: "Language",
  licence: "Licence",
  frequency: "Frequency",
  twiceAYear: "Two numbers a year",
  english: "English",
  publisher: "Publisher",
  doiPrefix: "DOI prefix",
  issnPrint: "ISSN (print)",
  issnOnline: "E-ISSN (online)",
  founded: "Founded",
  boardMembers: "Board members",
  countries: "countries",
  editorsAndReviewers: "Editors & peer reviewers",
  inTotal: "in total",
  doubleBlind: "Double-blind",
  peerReview: "Peer review",
  charges: "Charges",
  none: "None",

  tableOfContents: "Table of contents",
  abstract: "Abstract",
  keywords: "Keywords",
  authorsAndAffiliations: "Authors & affiliations",
  howToCite: "How to cite",
  citation: "Citation",
  copyToClipboard: "Copy to clipboard",
  copied: "Copied",
  share: "Share",
  shareByEmail: "Share by e-mail",
  copyLink: "Copy link",
  fullText: "Full text",
  fullIssuePdf: "Full issue PDF",
  articleMetrics: "Article metrics",
  views: "Views",
  downloads: "Downloads",
  citations: "Citations",
  identifiers: "Identifiers",
  issue: "Issue",
  correspondingAuthor: "Corresponding author",
  corr: "corr",
  researchArticle: "Research article",
  licenceNote:
    "This is an open-access article distributed under the terms of the {licence}, which permits unrestricted use, distribution and reproduction in any medium, provided the original work is properly cited.",
  ccLicenceName: "Creative Commons Attribution 4.0 licence",

  search: "Search",
  searchResults: "Search results",
  searchTheArchive: "Search the archive",
  searchLede: "Search every article published in Machine Science by title, author or keyword.",
  noMatches: "No matching articles",
  noMatchesBody: "Try a broader term, an author surname, or browse the archive issue by issue.",
  startSearch: "Start with a title, author or keyword",
  startSearchBody:
    "Every article published since 2001 is indexed — search by a paper's title, one of its authors, or a subject keyword.",
  searchUnavailable: "Search is temporarily unavailable",
  searchUnavailableBody: "The article index could not be reached. The archive lists every issue in the meantime.",
  prev: "Prev",
  next: "Next",
  resultPages: "Search results pages",

  noIssuesYet: "No issues have been published yet",
  noIssuesYetBody:
    "Issues appear here the moment the editorial office publishes them. In the meantime, the call for papers is open.",
  boardUnavailable: "The board list is temporarily unavailable",
  boardUnavailableBody:
    "The editorial board is served from the journal's record system. Please try again shortly, or write to the editorial office.",
  scopeUnavailable: "The subject list is being updated",
  scopeUnavailableBody:
    "Machine Science publishes across the theory of mechanisms and machines, mechanical engineering technology, mechatronics, materials and energy. Write to the editors if your topic is not listed.",
  issueEmpty: "This issue is not yet populated",
  issueEmptyBody:
    "Articles appear here as soon as the editorial office publishes them. The full-issue PDF may already be available above.",
  notFoundTitle: "This page is not in the record",
  notFoundLede:
    "The address you followed does not match any page, issue or article in Machine Science. It may have been an old link from before the site was rebuilt.",
  returnHome: "Return to the homepage",

  theJournal: "The journal",
  aimAndScope: "Aim & scope",
  forAuthors: "For authors",
  authorGuidelines: "Information for Authors",
  publicationEthics: "Publication ethics",
  editorialOffice: "Editorial office",
  ethics: "Ethics",
  contact: "Contact",
  sitemap: "Sitemap",
  publishedBy: "Published by",
  numbers: "numbers",
  numbersOne: "number",
  fullTextPdf: "Full-text PDF",
  previousIssue: "← Previous issue",
  nextIssue: "Next issue →",
  adjacentIssues: "Adjacent issues",
  breadcrumb: "Breadcrumb",
  home: "Home",
};

/** The site's UI strings. English is the journal's only publication language. */
export const T: Strings = en;
