"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/PortalShell";
import SubmissionForm from "@/components/SubmissionForm";
import { submissions, SubmissionInput } from "@/lib/auth";

export default function SubmitPage() {
  const router = useRouter();
  const [value, setValue] = useState<SubmissionInput>({
    title: "", abstractText: "", keywords: "", subjectArea: "", language: "en",
    authors: [{ firstName: "", lastName: "", email: "", affiliation: "", country: "", orcid: "", corresponding: true }],
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveDraft() {
    if (!value.title.trim()) { setErr("A title is required to start."); return; }
    if (!value.authors.some((a) => a.firstName && a.lastName)) { setErr("Add at least one author."); return; }
    setErr(""); setBusy(true);
    try {
      const created = await submissions.create(value);
      router.push(`/dashboard/${created.id}`);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not save"); setBusy(false); }
  }

  return (
    <PortalShell>
      <h1 className="pt-h1">New submission</h1>
      <p className="pt-sub">Enter the manuscript details. You’ll upload the PDF and submit on the next step.</p>
      <div className="steps"><span className="active">1 · Details</span><span>2 · Files & submit</span></div>
      {err && <div className="err">{err}</div>}
      <div className="pt-card">
        <SubmissionForm value={value} onChange={setValue} />
      </div>
      <div className="pt-row" style={{ justifyContent: "flex-end", gap: ".7rem" }}>
        <button className="btn btn--ghost" onClick={() => router.push("/dashboard")}>Cancel</button>
        <button className="btn" onClick={saveDraft} disabled={busy}>{busy ? "Saving…" : "Save draft & continue →"}</button>
      </div>
    </PortalShell>
  );
}
