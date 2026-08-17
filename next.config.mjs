/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Minimal production server for Docker (copies only what's needed).
  output: "standalone",
  // One less fingerprinting header, and one less thing to explain in an audit.
  poweredByHeader: false,
  async rewrites() {
    // Server-side proxy: browser calls stay same-origin (/api, /files) and the
    // Next server forwards them to the backend. API_URL is the internal backend
    // URL in Docker (e.g. http://backend:8080); the fallback is the public host
    // so a deploy that forgets the variable still serves real content.
    const api =
      process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api-msj.aztu.edu.az";
    return [
      { source: "/api/:path*", destination: `${api}/api/:path*` },
      { source: "/files/:path*", destination: `${api}/files/:path*` },
    ];
  },
  async headers() {
    return [
      {
        // Baseline security headers. Search engines do not rank on these
        // directly, but HTTPS-only + no-sniff + a referrer policy are what a
        // scholarly indexer's site audit checks, and they are free.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
      {
        // Board portraits and hero frames are content-addressed by filename and
        // never change in place; let the CDN and the browser keep them.
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The four woff2 faces, extracted out of design.css. They change only
        // when the typeface itself does, so they get the same immutable year.
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};
export default nextConfig;
