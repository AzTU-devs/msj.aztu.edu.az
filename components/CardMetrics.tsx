import type { Metrics } from "@/lib/api";

/** Compact "views · downloads · citations" row at the foot of an article card. */
export default function CardMetrics({ m }: { m: Metrics | undefined | null }) {
  if (!m) return null;
  return (
    <div className="art__metrics" aria-label="Article metrics">
      <span><b>{m.views.toLocaleString()}</b> views</span>
      <span><b>{m.downloads.toLocaleString()}</b> downloads</span>
      <span><b>{m.citations.toLocaleString()}</b> citations</span>
    </div>
  );
}
