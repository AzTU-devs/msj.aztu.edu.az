"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "@/components/PortalShell";
import { submissions, SubmissionSummary, STATUS_LABELS } from "@/lib/auth";

export default function Dashboard() {
  const [items, setItems] = useState<SubmissionSummary[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => { submissions.listMine().then(setItems).catch((e) => setErr(e.message)); }, []);

  return (
    <PortalShell>
      <div className="pt-row pt-row--between">
        <div>
          <h1 className="pt-h1">My submissions</h1>
          <p className="pt-sub">Track your manuscripts through review and publication.</p>
        </div>
        <Link href="/submit" className="btn">+ New submission</Link>
      </div>
      {err && <div className="err">{err}</div>}

      {items && items.length === 0 && (
        <div className="pt-card"><p className="muted" style={{ margin: 0 }}>
          You haven’t submitted anything yet. <Link href="/submit">Start a new submission →</Link></p></div>
      )}

      {items?.map((s) => (
        <Link key={s.id} href={`/dashboard/${s.id}`} className="pt-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
          <div className="pt-row pt-row--between">
            <div>
              <div className="pt-card__t">{s.title || "(untitled draft)"}</div>
              <div className="muted pt-mono" style={{ fontSize: ".76rem" }}>
                {s.subjectArea || "—"} · updated {new Date(s.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <span className={`pill ${s.status}`}>{STATUS_LABELS[s.status] || s.status}</span>
          </div>
        </Link>
      ))}

      {!items && !err && <div className="muted">Loading…</div>}
    </PortalShell>
  );
}
