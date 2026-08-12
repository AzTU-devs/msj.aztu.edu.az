"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "../app/portal.css";
import { auth, authApi, Me } from "@/lib/auth";

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth.isAuthed) { router.replace("/login"); return; }
    authApi.me().then((u) => { setMe(u); setReady(true); })
      .catch(() => { auth.clear(); router.replace("/login"); });
  }, [router]);

  if (!ready) return <div className="auth-page"><div className="muted">Loading…</div></div>;

  return (
    <div className="pt">
      <header className="pt-header">
        <div className="pt-header__in">
          <Link href="/dashboard" className="pt-brand" style={{ textDecoration: "none", color: "inherit" }}>
            Machine Science<small>AUTHOR PORTAL</small>
          </Link>
          <nav className="pt-nav">
            <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>My submissions</Link>
            <Link href="/submit" className={pathname === "/submit" ? "active" : ""}>New submission</Link>
            <Link href="/">Journal site</Link>
            <button onClick={async () => { await authApi.logout(); router.replace("/login"); }}>
              {me ? `${me.firstName} · Sign out` : "Sign out"}
            </button>
          </nav>
        </div>
      </header>
      <div className="pt-wrap">{children}</div>
    </div>
  );
}
