import type { CSSProperties } from "react";
import { ArrowUpRight, Github } from "./icons";
import { mlLab } from "@/lib/content";

const rand = (i: number) => {
  let x = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

/* Reconstruction-error histogram: normal parts on the left, defects in a
   small cluster on the right. On hover the threshold slides into the gap
   and the flagged bins light up. */
function AnomalyViz() {
  const bins = 28;
  const bars = Array.from({ length: bins }, (_, i) => {
    const x = i / (bins - 1);
    const normal = Math.exp(-Math.pow((x - 0.24) / 0.11, 2));
    const defect = 0.26 * Math.exp(-Math.pow((x - 0.8) / 0.07, 2));
    return { h: Math.max(0.03, normal + defect + rand(i) * 0.04), flagged: x > 0.62 };
  });
  return (
    <svg viewBox="0 0 280 140" className="viz viz--anomaly" aria-hidden>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={10 + i * 9.4}
          y={118 - b.h * 96}
          width={7}
          height={b.h * 96}
          rx={1.5}
          className={b.flagged ? "flag" : undefined}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      <line x1="8" x2="272" y1="119" y2="119" className="axis" />
      <g className="thresh">
        <line x1="0" x2="0" y1="12" y2="122" />
        <text x="5" y="20">
          threshold
        </text>
      </g>
      <text x="10" y="136" className="lbl">
        reconstruction error →
      </text>
    </svg>
  );
}

/* User × item matrix: known ratings in gray; on hover, the factorized
   model fills in predictions. */
function RecsysViz() {
  const cols = 14;
  const rows = 7;
  return (
    <div className="viz viz--recsys" aria-hidden>
      {Array.from({ length: cols * rows }, (_, i) => {
        const known = rand(i * 3 + 1) < 0.27;
        const score = 0.15 + rand(i * 7 + 3) * 0.85;
        return (
          <i
            key={i}
            className={known ? "known" : "pred"}
            style={{ "--s": score.toFixed(2), "--d": `${Math.round(rand(i + 11) * 520)}ms` } as CSSProperties}
          />
        );
      })}
      <span className="viz__axis viz__axis--y">users</span>
      <span className="viz__axis viz__axis--x">items</span>
    </div>
  );
}

/* Tokens weighted by their pull on the prediction (illustrative). */
const TOKENS: [string, number][] = [
  ["honestly", 0.35],
  ["the", 0],
  ["new", 0.1],
  ["update", 0.05],
  ["fixed", 0.7],
  ["every", 0.15],
  ["bug", -0.45],
  ["i", 0],
  ["had", 0],
  ["—", 0],
  ["love", 0.95],
  ["it", 0.05],
];
function SentimentViz() {
  return (
    <div className="viz viz--sent" aria-hidden>
      <p className="sent__text">
        {TOKENS.map(([w, s], i) => (
          <span
            key={i}
            className={s > 0.2 ? "pos" : s < -0.2 ? "neg" : undefined}
            style={{ "--s": Math.abs(s).toFixed(2), "--d": `${i * 45}ms` } as CSSProperties}
          >
            {w}
          </span>
        ))}
      </p>
      <div className="sent__meter">
        <span>negative</span>
        <b>
          <i />
        </b>
        <span>positive</span>
      </div>
      <p className="sent__out">
        p(positive) = <em>0.93</em>
      </p>
    </div>
  );
}

/* A 12×12 "7" and the ten softmax outputs. */
const SEVEN = [
  "............",
  "..########..",
  "..########..",
  "........##..",
  ".......##...",
  "......##....",
  "......##....",
  ".....##.....",
  ".....##.....",
  "....##......",
  "....##......",
  "............",
];
const PROBS = [0.01, 0.02, 0.04, 0.03, 0.01, 0.02, 0.0, 0.83, 0.02, 0.02];
function MnistViz() {
  return (
    <div className="viz viz--mnist" aria-hidden>
      <div className="mnist__px">
        {SEVEN.join("")
          .split("")
          .map((c, i) => (
            <i
              key={i}
              className={c === "#" ? "on" : undefined}
              style={{ "--d": `${Math.round((i / 144) * 420)}ms` } as CSSProperties}
            />
          ))}
      </div>
      <div className="mnist__out">
        {PROBS.map((p, d) => (
          <span key={d} className={d === 7 ? "top" : undefined} style={{ "--p": p } as CSSProperties}>
            <i />
            <b>{d}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

const VIZ: Record<string, () => React.JSX.Element> = {
  anomaly: AnomalyViz,
  recsys: RecsysViz,
  sentiment: SentimentViz,
  mnist: MnistViz,
};

export default function MLLab() {
  return (
    <article className="case case--ml" aria-labelledby="ml-title">
      <header className="case__head">
        <div className="case__label" data-reveal>
          <span className="case__num">Case 03</span>
          <span className="case__rule" aria-hidden />
          <span>Machine learning · PyTorch · scikit-learn · NumPy</span>
        </div>
        <div className="case__intro case__intro--ml">
          <h3 id="ml-title" className="case__title" data-reveal>
            ML lab
          </h3>
          <p className="case__question" data-reveal style={{ "--d": "80ms" } as CSSProperties}>
            Smaller experiments from my ML-Projects repo, from a neural net written by hand to an anomaly detector
            benchmarked on four datasets.
          </p>
          <a
            className="btn btn--ghost btn--sm case__repo"
            href={mlLab.repo}
            target="_blank"
            rel="noopener"
            data-reveal
            style={{ "--d": "140ms" } as CSSProperties}
          >
            <Github /> ML-Projects
          </a>
        </div>
      </header>

      <div className="mlgrid">
        {mlLab.projects.map((p, i) => {
          const Viz = VIZ[p.id];
          return (
            <section
              key={p.id}
              className="mlcard"
              tabIndex={0}
              aria-labelledby={`ml-${p.id}`}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
            >
              <div className="mlcard__viz">
                <Viz />
              </div>
              <div className="mlcard__body">
                <p className="mlcard__idx">ml/{String(i + 1).padStart(2, "0")}</p>
                <h4 id={`ml-${p.id}`}>{p.title}</h4>
                <p className="mlcard__metric">
                  <span>{p.metric}</span>
                  <small>{p.metricLabel}</small>
                </p>
                <div className="mlcard__swap">
                  <p className="mlcard__summary">{p.summary}</p>
                  <div className="mlcard__detail">
                    <p>{p.detail}</p>
                    <ul className="tags">
                      {p.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <a className="mlcard__link" href={p.href} target="_blank" rel="noopener">
                  Code <ArrowUpRight />
                </a>
              </div>
            </section>
          );
        })}
      </div>
      <p className="ml__foot" data-reveal>
        Visuals on these cards are schematic. The numbers are from the projects.
      </p>
    </article>
  );
}
