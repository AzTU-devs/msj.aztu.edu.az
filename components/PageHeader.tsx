import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";

/**
 * The band every interior page opens on: breadcrumb, eyebrow, title, lede, an
 * optional metadata row and an optional action row. Before this, each page
 * started cold with a `.sec__head` and the site had no consistent "you are
 * here" — the one thing a reader arriving from Google Scholar needs most.
 *
 * `plain` keeps the title in sentence case (article and issue titles, which
 * are typeset copy) instead of the uppercase section-title treatment.
 */
export default function PageHeader({
  crumbs,
  eyebrow,
  title,
  titleHtml,
  lede,
  meta,
  actions,
  aside,
  plain = false,
  as: Tag = "h1",
}: {
  crumbs?: Crumb[];
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Backend copy may carry a <br>; render it rather than escaping it. */
  titleHtml?: string;
  lede?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  plain?: boolean;
  as?: "h1" | "h2";
}) {
  const titleClass = "phead__title" + (plain ? " phead__title--plain" : "");
  return (
    <header className="phead">
      <div className="wrap phead__in">
        <div className="phead__grid">
          <div>
            {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
            {eyebrow && <p className="annot phead__eyebrow">{eyebrow}</p>}

            {titleHtml ? (
              <Tag className={titleClass} dangerouslySetInnerHTML={{ __html: titleHtml }} />
            ) : (
              <Tag className={titleClass}>{title}</Tag>
            )}

            {lede && <p className="phead__lede">{lede}</p>}
            {meta && <div className="phead__meta">{meta}</div>}
            {actions && <div className="phead__acts">{actions}</div>}
          </div>

          {aside && <div className="phead__aside">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
