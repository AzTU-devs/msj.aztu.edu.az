"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../portal.css";
import { authApi } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try { await authApi.login(email, password); router.replace("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h1>Sign in</h1>
        <p className="muted" style={{ marginTop: 0 }}>Author portal · Machine Science</p>
        {error && <div className="err">{error}</div>}
        <div className="field"><label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus /></div>
        <div className="field"><label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button className="btn" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}</button>
        <p className="sw">New author? <Link href="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
