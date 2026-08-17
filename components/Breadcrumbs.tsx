import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  name: string;
  href?: string;
}

/**
 * Visible breadcrumb trail. The pages already emit a BreadcrumbList in JSON-LD
 * for crawlers; this is the same trail for readers, who otherwise land on an
 * article from Scholar with no idea which issue they are inside.
 *
 * The last crumb is the current page and is never a link.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${c.name}-${i}`}>
              <li {...(last ? { "aria-current": "page" as const } : {})}>
                {c.href && !last ? (
                  <Link href={c.href}>{c.name}</Link>
                ) : (
                  <span className={last ? "crumbs__cur" : undefined}>{c.name}</span>
                )}
              </li>
              {!last && (
                <li aria-hidden="true" className="crumbs__sep">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
