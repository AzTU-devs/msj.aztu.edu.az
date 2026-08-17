import { ImageResponse } from "next/og";

/**
 * The card every share of the site renders — Twitter/X, LinkedIn, Slack,
 * WhatsApp, Google Discover. Generated rather than checked in so it always
 * carries the current masthead, and drawn in the journal's own palette
 * (layout-dye navy, brass rule) so a shared link looks like the site.
 *
 * Next also serves this for twitter:image via the summary_large_image card.
 */
export const alt = "Machine Science — International Scientific & Technical Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // White stock, ink type, one brass rule — the same palette the site
          // itself now uses, so a shared link and the page it opens match.
          backgroundColor: "#FFFFFF",
          padding: "72px 80px",
          color: "#0B1A33",
          borderTop: "10px solid #8A6714",
        }}
      >
        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 3, background: "#8A6714" }} />
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#5F6C86",
            }}
          >
            Azerbaijan Technical University · Baku
          </div>
        </div>

        {/* masthead */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>
            MACHINE
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#7A5C10",
            }}
          >
            SCIENCE
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#45526B", maxWidth: 900 }}>
            International scientific and technical journal on the theory of mechanisms and machines
          </div>
        </div>

        {/* record strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            borderTop: "1px solid rgba(11,26,51,0.16)",
            paddingTop: 28,
            fontSize: 24,
            letterSpacing: 2,
            color: "#45526B",
          }}
        >
          <div style={{ display: "flex" }}>SINCE 2001</div>
          <div style={{ display: "flex", color: "#8A6714" }}>·</div>
          <div style={{ display: "flex" }}>ISSN 2227-6912</div>
          <div style={{ display: "flex", color: "#8A6714" }}>·</div>
          <div style={{ display: "flex" }}>E-ISSN 2790-0479</div>
          <div style={{ display: "flex", color: "#8A6714" }}>·</div>
          <div style={{ display: "flex", color: "#7A5C10" }}>OPEN ACCESS</div>
        </div>
      </div>
    ),
    size
  );
}
