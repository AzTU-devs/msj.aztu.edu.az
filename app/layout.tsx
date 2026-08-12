import type { Metadata } from "next";
import "./design.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Machine Science — Azerbaijan Technical University",
    template: "%s · Machine Science",
  },
  description:
    "Machine Science — international scientific and technical journal published by Azerbaijan Technical University. ISSN 2227-6912, E-ISSN 2790-0479.",
  openGraph: {
    title: "Machine Science — Azerbaijan Technical University",
    description:
      "International scientific and technical journal on the theory of mechanisms and machines. Peer-reviewed, open access, published since 2001.",
    type: "website",
  },
};

// Set the saved colour theme before paint to avoid a flash.
const themeBoot = `(function(){try{var t=localStorage.getItem('msj-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
