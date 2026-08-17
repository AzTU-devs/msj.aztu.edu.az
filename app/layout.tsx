import type { Metadata, Viewport } from "next";
// design.css owns the palette tokens, the type scale and the original
// component primitives; layout.css adds the page furniture on top of them and
// must therefore load second.
import "./design.css";
import "./layout.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { API_ORIGIN, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Machine Science — international scientific and technical journal on the theory of mechanisms and machines, published by Azerbaijan Technical University since 2001. Peer-reviewed, open access, free of charge to authors. ISSN 2227-6912, E-ISSN 2790-0479.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Machine Science — International Scientific & Technical Journal",
    template: "%s · Machine Science",
  },
  description: DESCRIPTION,
  applicationName: "Machine Science",
  category: "science",
  keywords: [
    "Machine Science",
    "Machine Science journal",
    "theory of mechanisms and machines",
    "mechanical engineering journal",
    "mechatronics",
    "machine design",
    "open access engineering journal",
    "peer reviewed",
    "Azerbaijan Technical University",
    "AzTU",
    "ISSN 2227-6912",
    "ISSN 2790-0479",
  ],
  authors: [{ name: "Azerbaijan Technical University", url: "https://aztu.edu.az" }],
  creator: "Azerbaijan Technical University",
  publisher: "Azerbaijan Technical University",
  referrer: "origin-when-cross-origin",
  // Safari otherwise linkifies ISSNs, page ranges and DOIs as phone numbers.
  formatDetection: { telephone: false, date: false, address: false, email: false },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Machine Science",
    title: "Machine Science — International Scientific & Technical Journal",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Machine Science — International Scientific & Technical Journal",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set these in the environment once the properties are claimed; an unset var
  // simply omits the tag rather than emitting an empty one.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
      ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The site is white by default and only goes dark when a reader asks for it
  // with the header toggle, so the browser chrome should match white — not the
  // OS preference, which would tint the address bar against the page.
  colorScheme: "light",
  themeColor: "#FFFFFF",
};

// Set the saved colour theme before paint to avoid a flash of the wrong theme.
const themeBoot = `(function(){try{var t=localStorage.getItem('msj-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        {/* Archivo sets the masthead — the largest text on the page and the LCP
            text candidate. Preloading it starts the download alongside the CSS
            instead of after it parses. The other three faces swap in later;
            font-display:swap means none of them ever block paint. */}
        <link
          rel="preload"
          href="/fonts/archivo-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Browser traffic normally stays same-origin through the /api and
            /files rewrites, so a preconnect would open a socket nothing uses —
            resolve the names early instead, for the cases where the backend
            hands back absolute URLs for covers and portraits. */}
        <link rel="dns-prefetch" href={API_ORIGIN} />
        <link rel="dns-prefetch" href="https://aztu.edu.az" />
        {/* Site-wide graph: WebSite (with the sitelinks search box action) and
            the publishing Organization. Per-page nodes reference these by @id. */}
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      </head>
      <body>
        {/* The primary nav is seven items long — give keyboard users a way past it. */}
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <div id="content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
