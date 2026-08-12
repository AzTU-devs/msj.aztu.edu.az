"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../portal.css";
import { authApi } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", password: "", affiliation: "", country: "", orcid: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setBusy(true);
    try { await authApi.register(f); router.replace("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Registration failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit} style={{ width: 520 }}>
        <h1>Create an author account</h1>
        <p className="muted" style={{ marginTop: 0 }}>Submit and track manuscripts for Machine Science.</p>
        {error && <div className="err">{error}</div>}
        <div className="grid2">
          <div className="field"><label>First name</label><input value={f.firstName} onChange={(e) => set("firstName", e.target.value)} required /></div>
          <div className="field"><label>Last name</label><input value={f.lastName} onChange={(e) => set("lastName", e.target.value)} required /></div>
        </div>
        <div className="field"><label>Email</label><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} required /></div>
        <div className="field"><label>Password</label><input type="password" value={f.password} onChange={(e) => set("password", e.target.value)} required />
          <div className="hint">At least 8 characters.</div></div>
        <div className="grid2">
          <div className="field"><label>Affiliation</label><input value={f.affiliation} onChange={(e) => set("affiliation", e.target.value)} /></div>
          <div className="field"><label>Country</label><input value={f.country} onChange={(e) => set("country", e.target.value)} /></div>
        </div>
        <div className="field"><label>ORCID (optional)</label><input value={f.orcid} onChange={(e) => set("orcid", e.target.value)} placeholder="0000-0000-0000-0000" /></div>
        <button className="btn" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Creating…" : "Create account"}</button>
        <p className="sw">Already have an account? <Link href="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
