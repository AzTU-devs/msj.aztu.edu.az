import type { Issue } from "@/lib/api";
import { ISSN_PRINT, JOURNAL_NAME, toRoman } from "@/lib/journal";
import { IconGear } from "@/components/icons";

type CoverIssue = Pick<Issue, "coverUrl" | "title" | "volume" | "number" | "year">;

/**
 * An issue's cover plate.
 *
 * Most back issues in the archive have no scanned cover, and a grid of empty
 * grey rectangles is the fastest way to make an archive look abandoned. So the
 * fallback is not a placeholder — it is a typeset cover built from the issue's
 * own record (masthead, volume/number, year, ISSN) in the journal's palette.
 * It reads as a designed cover, not as a missing image.
 *
 * `eager` marks the current-issue cover, which is above the fold.
 */
export default function IssueCover({
  issue,
  eager = false,
}: {
  issue: CoverIssue;
  eager?: boolean;
}) {
  if (issue.coverUrl) {
    return (
      <div className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={issue.coverUrl}
          alt={`Cover of ${issue.title}`}
          loading={eager ? undefined : "lazy"}
          decoding="async"
        />
      </div>
    );
  }

  const roman = toRoman(issue.number);
  const line = [
    issue.volume != null ? `Volume ${issue.volume}` : null,
    roman ? `Number ${roman}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="cover cover--gen" role="img" aria-label={`Cover of ${issue.title}`}>
      <span className="cover__mark" aria-hidden="true">
        <IconGear />
      </span>

      <span className="cover__jn" lang="en">
        Machine
        <em>Science</em>
      </span>

      <span className="cover__foot">
        {line && <span className="cover__vn">{line}</span>}
        {issue.year ? <span className="cover__yr">{issue.year}</span> : null}
        <span className="cover__issn">
          {JOURNAL_NAME} · ISSN {ISSN_PRINT}
        </span>
      </span>
    </div>
  );
}
