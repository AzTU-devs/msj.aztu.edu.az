import Link from "next/link";

/**
 * Global site footer — the design's <footer class="ft"> reproduced 1:1 with its
 * CSS classes. Section anchors are now Next <Link> routes. Pure/server render.
 */
export default function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap ft__in">
        <div className="ft__c">
          <b>Machine Science</b> · Azerbaijan Technical University · ISSN 2227-6912 · E-ISSN 2790-0479
        </div>
        <div className="ft__l">
          <Link href="/about">Publication ethics</Link>
          <Link href="/authors">Open access policy</Link>
          <Link href="/authors">AI policy</Link>
          <Link href="/board">Peer review</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
