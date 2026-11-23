import type { CSSProperties } from "react";
import SectionHead from "./SectionHead";
import { education, timeline } from "@/lib/content";

const T0 = 2021;
const T1 = 2027;
const NOW = 2026.9;
const pct = (t: number) => ((t - T0) / (T1 - T0)) * 100;

export default function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-title">
      <div className="wrap">
        <SectionHead
          index="03"
          alias="training data"
          title={
            <span id="education-title">
              Where I <em>trained</em>.
            </span>
          }
          lede="Computer science first, then statistics and data science. Hover a school to see what I studied."
        />

        <div className="tl" data-reveal aria-hidden>
          <div className="tl__axis">
            {Array.from({ length: T1 - T0 + 1 }, (_, i) => (
              <span key={i} className="tl__year" style={{ left: `${(i / (T1 - T0)) * 100}%` }}>
                {T0 + i}
              </span>
            ))}
          </div>
          <div className="tl__track">
            {education.map((e, i) => (
              <span
                key={e.short}
                className="tl__seg tl__seg--edu"
                style={{ left: `${pct(e.from)}%`, width: `${pct(e.to) - pct(e.from)}%`, "--d": `${i * 200}ms` } as CSSProperties}
              >
                <em>{e.short}</em>
              </span>
            ))}
            <span
              className="tl__seg tl__seg--work"
              style={{ left: `${pct(2025.92)}%`, width: `${pct(NOW) - pct(2025.92)}%`, "--d": "450ms" } as CSSProperties}
            >
              <em>Compass</em>
            </span>
            <span
              className="tl__seg tl__seg--work tl__seg--low"
              style={{ left: `${pct(2026.2)}%`, width: `${pct(2026.8) - pct(2026.2)}%`, "--d": "600ms" } as CSSProperties}
            >
              <em>H&amp;C</em>
            </span>
            {timeline.map((m) => (
              <i key={m.label} className="tl__tick" style={{ left: `${pct(m.t)}%` }} />
            ))}
            <span className="tl__now" style={{ left: `${pct(NOW)}%` }}>
              now
            </span>
          </div>
        </div>

        <div className="edus">
          {education.map((e, i) => (
            <article
              key={e.short}
              className={`edu edu--${e.short.toLowerCase()}`}
              tabIndex={0}
              aria-labelledby={`edu-${e.short}`}
              data-reveal
              style={{ "--d": `${i * 100}ms` } as CSSProperties}
            >
              <div className="edu__faces">
                <div className="edu__front">
                  <p className="edu__when">
                    {e.when} · {e.where}
                  </p>
                  <h3 id={`edu-${e.short}`} className="edu__degree">
                    {e.degree}
                  </h3>
                  <p className="edu__school">{e.school}</p>
                  <p className="edu__cue" aria-hidden>
                    <span>hover</span> coursework &amp; projects
                  </p>
                </div>
                <div className="edu__back">
                  <p className="edu__k">Coursework</p>
                  <ul className="tags">
                    {e.coursework.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="edu__k">{e.short === "UCSB" ? "Course projects" : "Next"}</p>
                  <ul className="edu__projects">
                    {e.projects.map((p) => (
                      <li key={p.title}>
                        <b>{p.title}</b>
                        <span>{p.body}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <span className="edu__big" aria-hidden>
                {e.short}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
