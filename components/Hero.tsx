import type { CSSProperties } from "react";
import LossLandscape from "./LossLandscape";
import { ArrowDown, ArrowUpRight, Github, Linkedin } from "./icons";
import { heroStats, site } from "@/lib/content";

function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="ch" style={{ "--i": i + offset } as CSSProperties}>
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <LossLandscape />

      <div className="hero__inner wrap">
        <p className="hero__status">
          <span className="pulse" aria-hidden />
          <span className="hero__status-long">{site.status}</span>
          <span className="hero__status-short" aria-hidden>Open to data &amp; AI roles</span>
        </p>

        <h1 id="hero-title" className="hero__name" aria-label={site.name}>
          <span className="hero__line" aria-hidden>
            <Letters text="Hugo" />
          </span>
          <span className="hero__line" aria-hidden>
            <Letters text="Simonet" offset={4} />
          </span>
        </h1>

        <p className="hero__statement">
          I find the <em>signal</em> in messy data, and build the dashboards and models that act on it.
        </p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#work">
            See the work <ArrowDown />
          </a>
          <a className="btn btn--ghost" href={site.resume} target="_blank" rel="noopener">
            Resume <ArrowUpRight />
          </a>
          <span className="hero__socials">
            <a className="icon-btn" href={site.github} target="_blank" rel="noopener" aria-label="GitHub">
              <Github />
            </a>
            <a className="icon-btn" href={site.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <Linkedin />
            </a>
          </span>
        </div>

        <p className="hero__meta">
          {site.role} · B.S. Statistics &amp; Data Science, UCSB · {site.location}
        </p>
      </div>

      <dl className="hero__stats wrap">
        {heroStats.map((s, i) => (
          <div className="stat" key={s.label} style={{ "--i": i } as CSSProperties}>
            <dt>
              <span
                data-count={s.value}
                data-suffix={s.suffix ?? ""}
                data-compact={s.value >= 1_000_000 ? "true" : undefined}
              >
                {s.display}
              </span>
            </dt>
            <dd>{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
