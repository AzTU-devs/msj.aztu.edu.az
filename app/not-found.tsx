import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { IconArchive, IconArrow, IconBook, IconSearch, IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, or it competes with the page it replaced.
  robots: { index: false, follow: true },
};

/**
 * 404. A journal's dead links are almost always an old issue path or a moved
 * article, so this page routes people at the archive and the search box rather
 * than dead-ending them.
 */
export default function NotFound() {
  return (
    <main>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Not found" }]}
        eyebrow="Error 404"
        title="This page is not in the record"
        lede="The address you followed does not match any page, issue or article in Machine Science. It may have been an old link from before the site was rebuilt."
        actions={
          <>
            <Link className="btn btn--fill" href="/archive">
              <span>Browse the archive</span>
              <IconArrow />
            </Link>
            <Link className="btn btn--line" href="/">
              <span>Return to the homepage</span>
              <IconArrow />
            </Link>
          </>
        }
      />

      <section className="sec">
        <div className="wrap">
          <div className="quick">
            <Link className="qcard" href="/search">
              <span className="qcard__ic" aria-hidden="true">
                <IconSearch />
              </span>
              <span className="qcard__t">
                Search the archive <IconArrow />
              </span>
              <p className="qcard__d">Find a paper by title, author surname or keyword.</p>
            </Link>

            <Link className="qcard" href="/archive">
              <span className="qcard__ic" aria-hidden="true">
                <IconArchive />
              </span>
              <span className="qcard__t">
                Every issue <IconArrow />
              </span>
              <p className="qcard__d">The complete run of the journal, free as full-text PDF.</p>
            </Link>

            <Link className="qcard" href="/about">
              <span className="qcard__ic" aria-hidden="true">
                <IconBook />
              </span>
              <span className="qcard__t">
                About the journal <IconArrow />
              </span>
              <p className="qcard__d">Scope, ISSNs, indexing and the open-access policy.</p>
            </Link>

            <Link className="qcard" href="/contact">
              <span className="qcard__ic" aria-hidden="true">
                <IconUsers />
              </span>
              <span className="qcard__t">
                Contact the editors <IconArrow />
              </span>
              <p className="qcard__d">Tell us which link brought you here and we will fix it.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
