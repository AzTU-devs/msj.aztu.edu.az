// UI strings, in the journal's two reading languages.
//
// Most of the site's *content* already flows through `text(texts[key], locale)`
// against the backend's I18nText columns, so it switches to Azerbaijani the
// moment an editor fills those in under Admin → Site Labels. What could never
// switch was the chrome — nav labels, button text, section headings, empty
// states — because those are literals in the page files. This is that set.
//
// Deliberately a flat, typed record rather than nested namespaces: `ui.submit`
// reads better at the call site than `ui.buttons.submit`, and a missing key is
// a compile error rather than `undefined` rendered into the page.
//
// This file must stay free of `next/headers` — it is imported by client
// components (the language toggle). Server-side locale resolution lives in
// lib/locale.ts.

export type Locale = "en" | "az";

export const LOCALES: Locale[] = ["en", "az"];
export const DEFAULT_LOCALE: Locale = "en";

/** Cookie the toggle writes and the server reads. */
export const LOCALE_COOKIE = "msj-lang";

export const LOCALE_LABEL: Record<Locale, string> = { en: "EN", az: "AZ" };

/** `lang` attribute + Open Graph locale for each language. */
export const HTML_LANG: Record<Locale, string> = { en: "en", az: "az" };

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

const az: Strings = {
  navAbout: "Haqqında",
  navCurrent: "Cari nömrə",
  navScope: "Əhatə dairəsi",
  navBoard: "Redaksiya heyəti",
  navArchive: "Arxiv",
  navAuthors: "Müəlliflər üçün məlumat",
  navContact: "Əlaqə",
  navManuscript: "Əlyazmanın hazırlanması",
  navOpenAccess: "Açıq giriş siyasəti",
  navAiPolicy: "Süni intellekt siyasəti",

  issn: "ISSN",
  eIssn: "E-ISSN",
  openAccess: "Açıq giriş",
  peerReviewed: "Rəyçi baxışından keçir",
  freeOfCharge: "Ödənişsiz",
  authorSignIn: "Müəllif girişi",
  submit: "Göndər",
  submitManuscript: "Əlyazma göndər",
  searchArticles: "Məqalələrdə axtarış",
  searchTheJournal: "Jurnalda axtarış",
  searchPlaceholder: "Başlıq, müəllif, açar söz…",
  searchHint: "Arxivdəki bütün məqalələr üzrə axtarır — başlıq, müəlliflər, açar sözlər.",
  searchButton: "Axtar",
  closeSearch: "Axtarışı bağla",
  menu: "Menyu",
  switchTheme: "Rəng rejimini dəyiş",
  language: "Dil",
  skipToContent: "Məzmuna keç",
  primaryNav: "Əsas",

  heroEyebrow: "Azərbaycan Texniki Universiteti · Bakı",
  heroLede:
    "Mexanizmlər və maşınlar nəzəriyyəsi üzrə beynəlxalq elmi-texniki jurnal — 2001-ci ildən fasiləsiz nəşr olunur, rəyçi baxışından keçir və müəlliflər üçün tamamilə ödənişsizdir.",
  readCurrentIssue: "Cari nömrəni oxu",
  publishedSince: "Nəşr olunur",
  issuesOnline: "Onlayn nömrələr",
  costToAuthors: "Müəllif üçün xərc",
  free: "Ödənişsiz",

  readMore: "Jurnal haqqında ətraflı",
  browseArchive: "Arxivə bax",
  allSubjectAreas: "Bütün sahələr",
  theFullBoard: "Tam heyət",
  openTheIssue: "Nömrəni aç",
  downloadFullIssue: "Tam nömrəni yüklə",
  downloadPdf: "PDF yüklə",
  thisIssue: "Bu nömrə",
  backToArchive: "Arxivə bax",

  currentIssue: "Cari nömrə",
  issueRecord: "Nömrə haqqında",
  featured: "Seçilmiş",
  aboutTheJournal: "Jurnal haqqında",
  aboutTitle: "Maşınşünaslığın çərək əsri",
  journalRecord: "Jurnalın qeydiyyatı",
  indexedIn: "İndeksləşdirilir",
  scopeLabel: "Əhatə dairəsi",
  scopeTitle: "Nəşr etdiyimiz sahələr",
  announcements: "Elanlar",
  announcementsTitle: "Redaksiyadan",
  openCall: "Məqalə qəbulu",
  openCallTitle: "Araşdırmanızı göndərin",
  openCallLede:
    "“Machine Science” hazırda aşağıdakı nömrələr üçün əlyazma qəbul edir. Göndəriş ödənişsizdir və bütün məqalələr rəyçi baxışından keçir.",
  callForPapers: "Məqalə qəbulu",
  submissionDeadline: "Son göndəriş tarixi",
  boardLabel: "Redaksiya heyəti",
  boardTitle: "İşi kim qiymətləndirir",
  archiveLabel: "Arxiv",
  archiveTitle: "Bütün nömrələr açıqdır",
  archiveLede:
    "Bütün nömrələr tam mətnli PDF şəklində sərbəst əlçatandır. Abunə yoxdur, müəllif haqqı yoxdur.",
  contactLabel: "Əlaqə",
  contactTitle: "Araşdırmanızı<br>bizə göndərin",
  contactLede:
    "“Machine Science” jurnalının redaksiyası, Azərbaycan Texniki Universiteti. Siyasətimizdə cavabını tapmadığınız açıq giriş sualları üçün e-poçtla yazın.",
  writeToEditors: "Redaksiyaya yaz",

  qcRead: "Cari nömrəni oxuyun",
  qcReadBody: "Bütün məqalələr CC BY şərtləri ilə sərbəst oxunur, yüklənir və istifadə olunur.",
  qcSubmit: "Əlyazma göndərin",
  qcSubmitBody: "Heç bir mərhələdə göndəriş, rəy və ya nəşr haqqı alınmır.",
  qcArchive: "Arxivə baxın",
  qcArchiveBody: "Bütün nömrələr onlayn, tam mətnli PDF şəklində.",
  qcAuthors: "Müəllif təlimatı",
  qcAuthorsBody: "Əlyazmanın hazırlanması, rəy prosesi və göndəriş şərtləri.",

  volume: "Cild",
  number: "Nömrə",
  year: "İl",
  articles: "məqalə",
  article: "məqalə",
  published: "Nəşr tarixi",
  pages: "Səhifələr",
  doi: "DOI",
  language_: "Dil",
  licence: "Lisenziya",
  frequency: "Dövriyyə",
  twiceAYear: "İldə iki nömrə",
  english: "İngilis dili",
  publisher: "Naşir",
  doiPrefix: "DOI prefiksi",
  issnPrint: "ISSN (çap)",
  issnOnline: "E-ISSN (onlayn)",
  founded: "Təsis olunub",
  boardMembers: "Heyət üzvləri",
  countries: "ölkə",
  editorsAndReviewers: "Redaktorlar və rəyçilər",
  inTotal: "nəfər",
  doubleBlind: "İkiqat anonim",
  peerReview: "Rəy prosesi",
  charges: "Haqq",
  none: "Yoxdur",

  tableOfContents: "Mündəricat",
  abstract: "Xülasə",
  keywords: "Açar sözlər",
  authorsAndAffiliations: "Müəlliflər və təşkilatlar",
  howToCite: "Necə istinad etməli",
  citation: "İstinad",
  copyToClipboard: "Mətni kopyala",
  copied: "Kopyalandı",
  share: "Paylaş",
  shareByEmail: "E-poçtla paylaş",
  copyLink: "Keçidi kopyala",
  fullText: "Tam mətn",
  fullIssuePdf: "Nömrənin tam PDF-i",
  articleMetrics: "Məqalə göstəriciləri",
  views: "Baxış",
  downloads: "Yükləmə",
  citations: "İstinad",
  identifiers: "İdentifikatorlar",
  issue: "Nömrə",
  correspondingAuthor: "Məsul müəllif",
  corr: "məsul",
  researchArticle: "Elmi məqalə",
  licenceNote:
    "Bu, {licence} şərtləri əsasında yayımlanan açıq girişli məqalədir; orijinal işə düzgün istinad edilməsi şərti ilə istənilən mühitdə məhdudiyyətsiz istifadəyə, yayılmasına və çoxaldılmasına icazə verilir.",
  ccLicenceName: "Creative Commons Attribution 4.0 lisenziyası",

  search: "Axtarış",
  searchResults: "Axtarış nəticələri",
  searchTheArchive: "Arxivdə axtarış",
  searchLede:
    "“Machine Science”-də nəşr olunmuş bütün məqalələri başlıq, müəllif və ya açar sözlə axtarın.",
  noMatches: "Uyğun məqalə tapılmadı",
  noMatchesBody:
    "Daha geniş bir ifadə və ya müəllifin soyadı ilə yoxlayın, yaxud arxivə nömrə-nömrə baxın.",
  startSearch: "Başlıq, müəllif və ya açar sözlə başlayın",
  startSearchBody:
    "2001-ci ildən bəri nəşr olunmuş bütün məqalələr indeksləşdirilib — məqalənin başlığı, müəlliflərindən biri və ya mövzu açar sözü ilə axtarın.",
  searchUnavailable: "Axtarış müvəqqəti olaraq əlçatmazdır",
  searchUnavailableBody: "Məqalə indeksinə çıxış alınmadı. Bu müddətdə arxivdə bütün nömrələr sadalanır.",
  prev: "Əvvəlki",
  next: "Sonrakı",
  resultPages: "Axtarış nəticələrinin səhifələri",

  noIssuesYet: "Hələ nömrə nəşr olunmayıb",
  noIssuesYetBody:
    "Redaksiya nömrəni nəşr etdiyi anda burada görünəcək. Bu müddətdə məqalə qəbulu açıqdır.",
  boardUnavailable: "Heyət siyahısı müvəqqəti olaraq əlçatmazdır",
  boardUnavailableBody:
    "Redaksiya heyəti jurnalın qeydiyyat sistemindən gəlir. Bir azdan yenidən yoxlayın və ya redaksiyaya yazın.",
  scopeUnavailable: "Mövzu siyahısı yenilənir",
  scopeUnavailableBody:
    "“Machine Science” mexanizmlər və maşınlar nəzəriyyəsi, maşınqayırma texnologiyası, mexatronika, materiallar və enerji sahələrində nəşr edir. Mövzunuz siyahıda yoxdursa, redaksiyaya yazın.",
  issueEmpty: "Bu nömrə hələ doldurulmayıb",
  issueEmptyBody:
    "Redaksiya məqalələri nəşr etdiyi kimi burada görünəcək. Nömrənin tam PDF-i artıq yuxarıda mövcud ola bilər.",
  notFoundTitle: "Bu səhifə qeydiyyatda yoxdur",
  notFoundLede:
    "Keçid etdiyiniz ünvan “Machine Science”-də heç bir səhifə, nömrə və ya məqalə ilə uyğun gəlmir. Sayt yenilənməzdən əvvəlki köhnə keçid ola bilər.",
  returnHome: "Ana səhifəyə qayıt",

  theJournal: "Jurnal",
  aimAndScope: "Məqsəd və əhatə dairəsi",
  forAuthors: "Müəlliflər üçün",
  authorGuidelines: "Müəlliflər üçün məlumat",
  publicationEthics: "Nəşr etikası",
  editorialOffice: "Redaksiya",
  ethics: "Etika",
  contact: "Əlaqə",
  sitemap: "Sayt xəritəsi",
  publishedBy: "Naşir",
  numbers: "nömrə",
  numbersOne: "nömrə",
  fullTextPdf: "Tam mətnli PDF",
  previousIssue: "← Əvvəlki nömrə",
  nextIssue: "Sonrakı nömrə →",
  adjacentIssues: "Qonşu nömrələr",
  breadcrumb: "Naviqasiya",
  home: "Ana səhifə",
};

const DICT: Record<Locale, Strings> = { en, az };

/** The string table for a locale. */
export function ui(locale: Locale): Strings {
  return DICT[locale] ?? DICT[DEFAULT_LOCALE];
}

/** Narrow an arbitrary cookie/param value to a supported locale. */
export function toLocale(value: string | null | undefined): Locale {
  return value === "az" ? "az" : DEFAULT_LOCALE;
}
