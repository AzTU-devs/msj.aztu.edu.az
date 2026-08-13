import type { Metadata } from "next";
import "./design.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://msj.aztu.edu.az";

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
  keywords: [
    "Machine Science",
    "mechanisms and machines",
    "mechanical engineering",
    "scientific journal",
    "Azerbaijan Technical University",
    "open access",
    "peer reviewed",
  ],
  authors: [{ name: "Azerbaijan Technical University" }],
  publisher: "Azerbaijan Technical University",
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
};

// Set the saved colour theme before paint to avoid a flash of the wrong theme.
const themeBoot = `(function(){try{var t=localStorage.getItem('msj-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
