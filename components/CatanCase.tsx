"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Github } from "./icons";
import { catan } from "@/lib/content";
import { curveAt, finalEval, tournament, trainingCurve, trainingStages } from "@/lib/data";

/* ── chart geometry ─────────────────────────────────────────── */
const VW = 640;
const VH = 400;
const M = { l: 44, r: 18, t: 40, b: 46 };
const XMAX = 11000;
const YMAX = 40;
const sx = (u: number) => M.l + (u / XMAX) * (VW - M.l - M.r);
const sy = (v: number) => VH - M.b - (v / YMAX) * (VH - M.t - M.b);
const LINE = trainingCurve.map(([u, v], i) => `${i ? "L" : "M"}${sx(u).toFixed(1)},${sy(v).toFixed(1)}`).join("");
const AREA = `${LINE}L${sx(XMAX).toFixed(1)},${sy(0).toFixed(1)}L${sx(trainingCurve[0][0]).toFixed(1)},${sy(0).toFixed(1)}Z`;
const LAST = trainingCurve[trainingCurve.length - 1][1];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rand = (i: number) => {
  let x = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

function viewFor(step: number) {
  return step === 0 ? 0 : step === 1 ? 1 : 2;
}

export default function CatanCase() {
  const [step, setStep] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const clip = useRef<SVGRectElement>(null);
  const head = useRef<SVGGElement>(null);
  const readout = useRef<SVGTextElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // Scroll-linked progress: which step is active, and how far through it we are.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".step[data-step]"));
    let raf = 0;

    const apply = (idx: number, prog: number) => {
      const p = clamp(prog / 0.8, 0, 1);
      const u = idx < 2 ? 50 : idx === 2 ? 50 + p * 7950 : idx === 3 ? 8000 + p * 3000 : XMAX;
      if (clip.current) clip.current.setAttribute("width", String(Math.max(0, sx(u) - M.l + 2)));
      const v = curveAt(u);
      if (head.current) head.current.setAttribute("transform", `translate(${sx(u).toFixed(1)} ${sy(v).toFixed(1)})`);
      if (readout.current) {
        readout.current.textContent = `update ${Math.round(u).toLocaleString("en-US")} · ${v.toFixed(1)}%`;
        readout.current.setAttribute("text-anchor", u > 7600 ? "end" : "start");
        readout.current.setAttribute("x", u > 7600 ? "-12" : "12");
      }
    };

    const update = () => {
      raf = 0;
      const mid = window.innerHeight * (window.innerWidth < 900 ? 0.8 : 0.55);
      let idx = 0;
      let prog = 0;
      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid) {
          idx = i;
          prog = clamp((mid - r.top) / r.height, 0, 1);
        }
      });
      setStep(idx);
      apply(idx, prog);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // While the engine view is up, count games at the engine's real throughput.
  useEffect(() => {
    if (step !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let games = 0;
    let last = performance.now();
    const tick = (now: number) => {
      games += ((now - last) / 1000) * 43000;
      last = now;
      if (counter.current) counter.current.textContent = Math.floor(games).toLocaleString("en-US");
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const view = viewFor(step);

  return (
    <article className="case case--catan" aria-labelledby="catan-title">
      <header className="case__head">
        <div className="case__label" data-reveal>
          <span className="case__num">Case 01</span>
          <span className="case__rule" aria-hidden />
          <span>Reinforcement learning · Simulation · Rust + PyTorch</span>
        </div>
        <div className="case__intro">
          <div>
            <h3 id="catan-title" className="case__title" data-reveal>
              Catan Bot Lab
            </h3>
            <p className="case__question" data-reveal style={{ "--d": "80ms" } as CSSProperties}>
              {catan.question}
            </p>
          </div>
          <div className="case__aside" data-reveal style={{ "--d": "140ms" } as CSSProperties}>
            <dl className="specs">
              {catan.specs.map((s) => (
                <div key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            <div className="case__links">
              <a className="btn btn--primary btn--sm" href={catan.live} target="_blank" rel="noopener">
                Live site <ArrowUpRight />
              </a>
              <a className="btn btn--ghost btn--sm" href={catan.code} target="_blank" rel="noopener">
                <Github /> Source
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="scrolly" ref={root}>
        <div className="scrolly__steps">
          {catan.steps.map((s, i) => (
            <section key={s.tag} className={`step${i === step ? " is-active" : ""}`} data-step={i} aria-label={s.tag}>
              <p className="step__tag">
                <span>{String(i + 1).padStart(2, "0")}</span> {s.tag}
              </p>
              <h4 className="step__title">{s.title}</h4>
              <p className="step__body">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="scrolly__stage">
          <div className="stage" data-view={view}>
            <div className="stage__bar" aria-hidden>
              <span className="stage__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="stage__file">
                {view === 0 ? "catan-sim bench" : view === 1 ? "tournament.json" : "training/metrics.jsonl"}
              </span>
              <span className="stage__steps">
                {catan.steps.map((_, i) => (
                  <b key={i} className={i === step ? "on" : i < step ? "done" : undefined} />
                ))}
              </span>
            </div>

            {/* View 0: engine throughput */}
            <div className={`view view--engine${view === 0 ? " is-active" : ""}`} aria-hidden={view !== 0}>
              <p className="view__kicker">Throughput, 6-core desktop</p>
              <p className="engine__big">
                43,000<small>random games / second</small>
              </p>
              <div className="engine__grid" aria-hidden>
                {Array.from({ length: 216 }, (_, i) => (
                  <i
                    key={i}
                    style={{ "--dl": `${(rand(i) * 2.4).toFixed(2)}s`, "--du": `${(0.6 + rand(i + 7) * 1.6).toFixed(2)}s` } as CSSProperties}
                  />
                ))}
              </div>
              <dl className="engine__facts">
                <div>
                  <dt>9,700</dt>
                  <dd>strategy-bot games/s</dd>
                </div>
                <div>
                  <dt>25</dt>
                  <dd>rule tests</dd>
                </div>
                <div>
                  <dt>420</dt>
                  <dd>games invariant-checked</dd>
                </div>
              </dl>
              <p className="engine__live">
                <span className="hud__live" /> games the engine could have played since you got here:{" "}
                <span ref={counter}>0</span>
              </p>
            </div>

            {/* View 1: strategy tournament */}
            <div className={`view view--bars${view === 1 ? " is-active" : ""}`} aria-hidden={view !== 1}>
              <p className="view__kicker">Win rate · 2,000,000 games · seats rotated · 95% CI</p>
              <div className="bars">
                <span className="bars__even" style={{ "--x": 25 / 40 } as CSSProperties}>
                  <em>25% break-even</em>
                </span>
                {tournament.map((t, i) => (
                  <div className={`bars__row${i === 0 ? " is-top" : ""}`} key={t.name} style={{ "--i": i } as CSSProperties}>
                    <span className="bars__name">{t.name}</span>
                    <span className="bars__track">
                      <span className="bars__fill" style={{ "--w": t.win / 40 } as CSSProperties} />
                    </span>
                    <span className="bars__val">{t.win.toFixed(1)}%</span>
                    <span className="bars__how">{t.how}</span>
                  </div>
                ))}
              </div>
              <p className="view__note">
                Tuning mattered as much as the strategy: Ore-Wheat-Sheep went from 21.7% to 37.7% when tuning raised its
                settlement priority.
              </p>
            </div>

            {/* View 2: training curve */}
            <div className={`view view--curve${view === 2 ? " is-active" : ""}`} aria-hidden={view !== 2}>
              <svg viewBox={`0 0 ${VW} ${VH}`} className="curve" role="img" aria-label="Win rate during training rises from 5% to 28%; with look-ahead the final agent reaches 36.1%, above the 28.9% of the best hand-written strategy.">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity=".28" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="reveal">
                    <rect ref={clip} x={M.l} y={0} width={0} height={VH} />
                  </clipPath>
                </defs>

                {trainingStages.map((s, i) => (
                  <g key={s.label} className={`curve__stage${i === 2 && step < 3 ? " is-dim" : ""}`}>
                    <rect x={sx(s.from)} y={M.t} width={sx(s.to) - sx(s.from)} height={VH - M.t - M.b} className={i % 2 ? "odd" : "even"} />
                    <text x={sx(s.from) + 8} y={M.t - 12}>
                      {s.label}
                    </text>
                  </g>
                ))}

                {[0, 10, 20, 30, 40].map((v) => (
                  <g key={v} className="curve__grid">
                    <line x1={M.l} x2={VW - M.r} y1={sy(v)} y2={sy(v)} />
                    <text x={M.l - 10} y={sy(v) + 4} textAnchor="end">
                      {v}%
                    </text>
                  </g>
                ))}
                {[0, 2000, 4000, 6000, 8000, 10000].map((u) => (
                  <text key={u} className="curve__tick" x={sx(u)} y={VH - M.b + 20} textAnchor="middle">
                    {u === 0 ? "0" : `${u / 1000}k`}
                  </text>
                ))}
                <text className="curve__axis" x={VW - M.r} y={VH - 6} textAnchor="end">
                  PPO updates →
                </text>

                <g className="curve__ref">
                  <line x1={M.l} x2={VW - M.r} y1={sy(finalEval.breakEven)} y2={sy(finalEval.breakEven)} />
                  <text x={M.l + 8} y={sy(finalEval.breakEven) - 6}>
                    25% break-even, 4 players
                  </text>
                </g>

                <g className={`curve__ref curve__ref--best${step >= 4 ? " is-on" : ""}`}>
                  <line x1={M.l} x2={VW - M.r} y1={sy(finalEval.balancedInSeat)} y2={sy(finalEval.balancedInSeat)} />
                  <text x={sx(4200)} y={sy(finalEval.balancedInSeat) - 7}>
                    Best hand-written strategy, same seat · 28.9%
                  </text>
                </g>

                <g clipPath="url(#reveal)">
                  <path d={AREA} fill="url(#area)" />
                  <path d={LINE} className="curve__line" />
                </g>

                <g ref={head} className={`curve__head${step >= 2 && step < 4 ? " is-on" : ""}`}>
                  <circle r="9" className="halo" />
                  <circle r="3.5" />
                  <text ref={readout} x="12" y="-12">
                    update 50
                  </text>
                </g>

                <g className={`curve__look${step >= 4 ? " is-on" : ""}`}>
                  <line x1={sx(XMAX)} x2={sx(XMAX)} y1={sy(LAST)} y2={sy(finalEval.lookahead)} />
                  <line className="ci" x1={sx(XMAX) - 6} x2={sx(XMAX) + 6} y1={sy(finalEval.lookaheadCi[1])} y2={sy(finalEval.lookaheadCi[1])} />
                  <line className="ci" x1={sx(XMAX) - 6} x2={sx(XMAX) + 6} y1={sy(finalEval.lookaheadCi[0])} y2={sy(finalEval.lookaheadCi[0])} />
                  <circle cx={sx(XMAX)} cy={sy(finalEval.lookahead)} r="10" className="halo" />
                  <circle cx={sx(XMAX)} cy={sy(finalEval.lookahead)} r="4.5" />
                  <text x={sx(XMAX) - 16} y={sy(finalEval.lookahead) - 4} textAnchor="end" className="big">
                    36.1%
                  </text>
                  <text x={sx(XMAX) - 16} y={sy(finalEval.lookahead) + 14} textAnchor="end">
                    final agent + look-ahead
                  </text>
                </g>
              </svg>
              <p className="view__note view__note--curve">
                Win rate against the three strongest bots during training (512-game evaluations, smoothed). Final
                figure: 40,448 held-out games, 95% CI 35.6–36.6%.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="learned">
        <div className="learned__copy">
          <p className="case__label case__label--sub" data-reveal>
            <span className="case__num">What it learned</span>
          </p>
          <h4 className="learned__title" data-reveal>
            Nobody showed it a strategy. It invented a hybrid.
          </h4>
          <p className="learned__lede" data-reveal>
            It settled between Ore-Wheat-Sheep and Dev-Card Rush. Hover a stat to compare it with the Balanced bot.
          </p>
          <ul className="learned__grid">
            {catan.learned.map((l, i) => (
              <li className="lstat" key={l.label} tabIndex={0} data-reveal style={{ "--d": `${i * 70}ms` } as CSSProperties}>
                <p className="lstat__label">{l.label}</p>
                <div className="lstat__bars">
                  <span className="lstat__row lstat__row--agent">
                    <i style={{ "--w": l.agent / l.max } as CSSProperties} />
                    <b>
                      {l.lowerIsBetter ? "turn " : ""}
                      {l.agent}
                      {l.unit}
                    </b>
                    <em>agent</em>
                  </span>
                  <span className="lstat__row">
                    <i style={{ "--w": l.base / l.max } as CSSProperties} />
                    <b>
                      {l.lowerIsBetter ? "turn " : ""}
                      {l.base}
                      {l.unit}
                    </b>
                    <em>Balanced</em>
                  </span>
                </div>
                <p className="lstat__note">{l.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <figure className="replay" data-reveal style={{ "--d": "120ms" } as CSSProperties}>
          <a href={catan.live} target="_blank" rel="noopener" className="replay__link">
            <Image
              src="/img/catan-replay.png"
              alt="Catan Bot Lab replay viewer: the learned agent (red) wins with 10 victory points in 76 turns against Balanced, Ore-Wheat-Sheep and Road Builder."
              width={1360}
              height={1060}
              sizes="(max-width: 900px) 100vw, 40vw"
            />
            <span className="replay__cta">
              Visit Catan Bot Lab <ArrowUpRight />
            </span>
          </a>
          <figcaption>The learned agent (red) wins in 76 turns against the three strongest bots.</figcaption>
        </figure>
      </div>
    </article>
  );
}
