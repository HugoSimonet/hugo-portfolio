"use client";

import { useState, type CSSProperties } from "react";
import SectionHead from "./SectionHead";
import { experience } from "@/lib/content";

export default function Experience() {
  const [pinned, setPinned] = useState<number | null>(null);

  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead
          index="02"
          alias="deployments"
          title={
            <span id="experience-title">
              Where I&rsquo;ve <em>shipped</em>.
            </span>
          }
          lede="Hover a role for the full record. Click to keep it open."
        />

        <ol className="xps">
          {experience.map((x, i) => {
            const open = pinned === i;
            return (
              <li
                key={x.org}
                className={`xp${open ? " is-open" : ""}`}
                data-reveal
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  className="xp__head"
                  aria-expanded={open}
                  aria-controls={`xp-${i}`}
                  onClick={() => setPinned(open ? null : i)}
                >
                  <span className="xp__when">
                    {x.when}
                    <small>{x.where}</small>
                  </span>
                  <span className="xp__title">
                    <span className="xp__role">{x.role}</span>
                    <span className="xp__org">{x.org}</span>
                  </span>
                  <span className="xp__icon" aria-hidden>
                    <i />
                    <i />
                  </span>
                </button>

                <div className="xp__body">
                  <p className="xp__summary">{x.summary}</p>
                  <ul className="xp__metrics">
                    {x.metrics.map((m) => (
                      <li key={m.v}>
                        <b>{m.k}</b>
                        <span>{m.v}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="xp__detail" id={`xp-${i}`}>
                    <div className="xp__inner">
                      <ul className="xp__bullets">
                        {x.bullets.map((b, j) => (
                          <li key={j} style={{ "--j": j } as CSSProperties}>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <ul className="tags">
                        {x.stack.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
