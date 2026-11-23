import { ImageResponse } from "next/og";

export const alt = "Hugo Simonet · Data analyst & AI builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same family of surface as the live hero, frozen.
function f(x: number, z: number) {
  const wells = [
    [-1.1, 0.6, -1.3, 0.8],
    [1.45, -0.25, -1.0, 0.62],
    [0.5, 1.9, -0.75, 0.55],
    [0.25, -1.45, 1.05, 0.75],
    [-2.1, -1.5, 0.9, 0.85],
    [2.2, 1.8, 0.75, 0.65],
    [0.1, 0.35, 0.65, 0.42],
  ];
  let v = 0.04 * (x * x + z * z);
  for (const [cx, cz, a, s] of wells) v += a * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (2 * s * s));
  return v + 0.08 * Math.sin(1.9 * x) * Math.cos(1.6 * z);
}

function ridges() {
  const out: { line: string; fill: string; o: number }[] = [];
  const rows = 30;
  for (let r = 0; r < rows; r++) {
    const d = r / (rows - 1);
    const z = -3 + 6 * d;
    const p = 0.42 + 0.58 * d;
    let s = "";
    let first = 0;
    let last = 0;
    for (let c = 0; c <= 90; c++) {
      const x = -3 + (6 * c) / 90;
      const X = 880 + (x / 3) * 380 * p;
      const Y = 90 + Math.pow(d, 1.25) * 470 - f(x, z) * 72 * p;
      if (c === 0) first = X;
      last = X;
      s += `${c ? "L" : "M"}${X.toFixed(1)},${Y.toFixed(1)}`;
    }
    out.push({ line: s, fill: `${s}L${last.toFixed(1)},640L${first.toFixed(1)},640Z`, o: 0.08 + 0.55 * Math.pow(d, 1.5) });
  }
  return out;
}

export default function OpengraphImage() {
  const paths = ridges();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0b0d", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {paths.map((p, i) => (
            <g key={i}>
              <path d={p.fill} fill="#0a0b0d" />
              <path d={p.line} fill="none" stroke={`rgba(236,232,224,${p.o.toFixed(3)})`} strokeWidth="1.4" />
            </g>
          ))}
          <circle cx="826" cy="402" r="14" fill="rgba(255,122,61,0.18)" />
          <circle cx="826" cy="402" r="5" fill="#ff7a3d" />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#a9adb4", fontSize: 22, letterSpacing: 2 }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#7fd1a5" }} />
            OPEN TO DATA &amp; AI ROLES · LOS ANGELES
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 120, color: "#ece8e0", letterSpacing: -5, lineHeight: 0.95, fontWeight: 600 }}>Hugo</div>
            <div style={{ fontSize: 120, color: "#ece8e0", letterSpacing: -5, lineHeight: 0.95, fontWeight: 600 }}>Simonet</div>
            <div style={{ fontSize: 30, color: "#a9adb4", marginTop: 28, maxWidth: 520 }}>
              Data analyst &amp; AI builder. Dashboards, pipelines and models that learn.
            </div>
          </div>
          <div style={{ display: "flex", gap: 36, color: "#ff7a3d", fontSize: 22 }}>
            <span>Power BI</span>
            <span>Python · SQL</span>
            <span>PyTorch · RL</span>
            <span style={{ color: "#6d727a" }}>UCSB Statistics &amp; Data Science</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
