"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PortalShell from "@/components/PortalShell";
import SubmissionForm from "@/components/SubmissionForm";
import { submissions, SubmissionDetail, SubmissionInput, STATUS_LABELS } from "@/lib/auth";

const REC_LABELS: Record<string, string> = {
  ACCEPT: "Accept", MINOR_REVISION: "Minor revision", MAJOR_REVISION: "Major revision", REJECT: "Reject",
};

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sid = Number(id);
  const router = useRouter();
  const [d, setD] = useState<SubmissionDetail | null>(null);
  const [form, setForm] = useState<SubmissionInput | null>(null);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState("MANUSCRIPT");

  const load = useCallback(() => {
    submissions.get(sid).then((det) => {
      setD(det);
      setForm({
        title: det.title, abstractText: det.abstractText || "", keywords: det.keywords || "",
        subjectArea: det.subjectArea || "", language: det.language || "en",
        authors: det.authors.map((a) => ({ ...a })),
      });
    }).catch((e) => setErr(e.message));
  }, [sid]);
  useEffect(() => { load(); }, [load]);

  async function saveMeta() {
    if (!form) return;
    setBusy(true); setErr(""); setOk("");
    try { await submissions.update(sid, form); setOk("Saved."); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Save failed"); }
    finally { setBusy(false); }
  }
  async function upload(file: File) {
    setErr(""); setOk("");
    try { await submissions.uploadFile(sid, file, kind); setOk("File uploaded."); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Upload failed"); }
  }
  async function removeFile(fileId: number) {
    setErr("");
    try { await submissions.deleteFile(sid, fileId); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Delete failed"); }
  }
  async function submitForReview() {
    setBusy(true); setErr(""); setOk("");
    try { const det = await submissions.submit(sid); setD(det); setOk("Submitted for review."); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Submit failed"); }
    finally { setBusy(false); }
  }

  if (!d || !form) return <PortalShell><div className="muted">Loading…</div></PortalShell>;
  const editable = d.canEdit;
  const hasManuscript = d.files.some((f) => f.kind === "MANUSCRIPT");

  return (
    <PortalShell>
      <div className="pt-row pt-row--between">
        <div>
          <h1 className="pt-h1" style={{ fontSize: "1.5rem" }}>{d.title || "(untitled draft)"}</h1>
          <p className="pt-sub" style={{ marginBottom: 0 }}>Submission #{d.id}{d.doi ? ` · ${d.doi}` : ""}</p>
        </div>
        <span className={`pill ${d.status}`} style={{ fontSize: ".7rem" }}>{STATUS_LABELS[d.status] || d.status}</span>
      </div>

      {err && <div className="err" style={{ marginTop: "1rem" }}>{err}</div>}
      {ok && <div className="ok-msg" style={{ marginTop: "1rem" }}>{ok}</div>}

      {d.status === "REVISION_REQUESTED" && (
        <div className="pt-card" style={{ borderColor: "#eab8ae", background: "#fdf7f5" }}>
          <div className="pt-card__t">Revision requested</div>
          {d.editorNote && <p style={{ margin: ".4rem 0 0" }}>{d.editorNote}</p>}
          <p className="muted" style={{ marginBottom: 0 }}>Update your manuscript and details below, then resubmit.</p>
        </div>
      )}

      {/* reviews visible to the author */}
      {d.reviews.length > 0 && (
        <div className="pt-card">
          <div className="pt-card__t">Reviewer feedback</div>
          {d.reviews.map((r, i) => (
            <div className="review-box" key={i}>
              <div className="rec">Recommendation: {REC_LABELS[r.recommendation] || r.recommendation}</div>
              {r.commentsToAuthor && <div dangerouslySetInnerHTML={{ __html: r.commentsToAuthor }} />}
            </div>
          ))}
        </div>
      )}

      {/* metadata */}
      <div className="pt-card">
        <div className="pt-card__t" style={{ marginBottom: "1rem" }}>Manuscript details</div>
        {editable ? <SubmissionForm value={form} onChange={setForm} />
          : <ReadOnly d={d} />}
        {editable && (
          <div className="pt-row" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn--ghost" onClick={saveMeta} disabled={busy}>Save details</button>
          </div>
        )}
      </div>

      {/* files */}
      <div className="pt-card">
        <div className="pt-card__t">Files</div>
        {d.files.length === 0 && <p className="muted">No files uploaded yet.</p>}
        {d.files.map((f) => (
          <div className="file-row" key={f.id}>
            <span><b>{f.kind.replace("_", " ")}</b> · <a className="linkish" style={{ cursor: "pointer", color: "#b8860b" }} onClick={() => submissions.openFile(f.id).catch((e) => setErr(e.message))}>{f.originalName}</a>
              {f.sizeBytes ? <span className="muted"> · {(f.sizeBytes / 1024).toFixed(0)} KB</span> : null}</span>
            {editable && <button className="btn btn--danger btn--sm" onClick={() => removeFile(f.id)}>Remove</button>}
          </div>
        ))}
        {editable && (
          <div className="pt-row" style={{ marginTop: "1rem", gap: ".6rem" }}>
            <select value={kind} onChange={(e) => setKind(e.target.value)} style={{ width: "auto" }}>
              <option value="MANUSCRIPT">Manuscript (PDF)</option>
              <option value="SUPPLEMENTARY">Supplementary</option>
              <option value="COVER_LETTER">Cover letter</option>
            </select>
            <button className="btn btn--ghost btn--sm" onClick={() => fileInput.current?.click()}>Upload file</button>
            <input ref={fileInput} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
            {!hasManuscript && <span className="muted" style={{ fontSize: ".8rem" }}>A manuscript PDF is required to submit.</span>}
          </div>
        )}
      </div>

      {editable && (
        <div className="pt-row" style={{ justifyContent: "flex-end", gap: ".7rem" }}>
          <button className="btn" onClick={submitForReview} disabled={busy || !hasManuscript}>
            {d.status === "REVISION_REQUESTED" ? "Resubmit for review" : "Submit for review"}
          </button>
        </div>
      )}

      {/* timeline */}
      <div className="pt-card">
        <div className="pt-card__t">History</div>
        <ul className="timeline">
          {d.history.map((h, i) => (
            <li key={i}>
              <span className="pt-mono">{new Date(h.at).toLocaleDateString()}</span>
              <span>{STATUS_LABELS[h.toStatus] || h.toStatus}{h.comment ? ` — ${h.comment}` : ""}</span>
            </li>
          ))}
          {d.history.length === 0 && <li className="muted">No changes yet.</li>}
        </ul>
      </div>
    </PortalShell>
  );
}

function ReadOnly({ d }: { d: SubmissionDetail }) {
  return (
    <div>
      <p><b>Abstract.</b> {d.abstractText}</p>
      <p><b>Keywords.</b> {d.keywords}</p>
      <p><b>Subject.</b> {d.subjectArea}</p>
      <p><b>Authors.</b> {d.authors.map((a) => `${a.firstName} ${a.lastName}${a.corresponding ? " ✉" : ""}`).join("; ")}</p>
    </div>
  );
}
