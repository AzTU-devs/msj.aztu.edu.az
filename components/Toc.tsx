import Link from "next/link";
import type { ArticleSummary } from "@/lib/api";
import { authorLine, pagesLabel, parseKeywords } from "@/lib/journal";
import { IconArrow } from "@/components/icons";

/**
 * An issue's table of contents, set the way a journal prints one: a numbered,
 * ruled list with the title, the credit line, the subject/keyword note and the
 * page range hanging on the right.
 *
 * The homepage and the issue page previously each rendered the contents as a
 * grid of cards, which reads as a blog roll rather than a contents page and
 * loses the running order and the pagination entirely.
 */
export default function Toc({
  articles,
  offset = 0,
  showKeywords = true,
}: {
  articles: ArticleSummary[];
  /** Running number of the first row (used when a featured article precedes it). */
  offset?: number;
  showKeywords?: boolean;
}) {
  if (!articles.length) return null;

  return (
    <div className="toc">
      {articles.map((a, i) => {
        const pages = pagesLabel(a);
        const keys = showKeywords ? parseKeywords(a.keywords, 3) : [];
        const sub = [a.subjectArea, keys.join(", ")].filter(Boolean);

        return (
          <Link className="toc__i" key={a.id} href={`/articles/${a.id}`}>
            <span className="toc__no">{String(offset + i + 1).padStart(2, "0")}</span>

            <span className="toc__b">
              <span className="toc__t">{a.title}</span>
              {a.authorNames?.length > 0 && <span className="toc__a">{authorLine(a.authorNames)}</span>}
              {sub.length > 0 && (
                <span className="toc__sub">
                  {sub.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </span>
              )}
            </span>

            <span className="toc__pg">
              {pages || <IconArrow className="toc__go" />}
              {pages && <span className="toc__pdf">Read →</span>}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
