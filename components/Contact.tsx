"use client";

import { useEffect, useRef, useState } from "react";
import SectionHead from "./SectionHead";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail } from "./icons";
import { site } from "@/lib/content";

const LINES: { k: string; v: string; href?: string }[] = [
  { k: "name", v: site.name },
  { k: "email", v: site.email, href: `mailto:${site.email}` },
  { k: "linkedin", v: "linkedin.com/in/hsimonet", href: site.linkedin },
  { k: "github", v: "github.com/HugoSimonet", href: site.github },
  { k: "resume", v: site.resume, href: site.resume },
  { k: "location", v: "Los Angeles, CA · remote" },
  { k: "status", v: "open_to_work" },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [shown, setShown] = useState(0);
  const term = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = term.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(LINES.length + 2);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let n = 0;
        timer = setInterval(() => {
          n += 1;
          setShown(n);
          if (n >= LINES.length + 2 && timer) clearInterval(timer);
        }, 110);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(site.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact">
        <div className="contact__copy">
          <SectionHead
            index="05"
            alias="inference endpoint"
            title={
              <span id="contact-title">
                Let&rsquo;s <em>talk</em>.
              </span>
            }
            lede="I'm looking for Data Analyst, BI Analyst, AI Engineer and AI Solutions roles in Los Angeles or remote. The fastest way to reach me is email."
          />
          <div className="contact__actions" data-reveal>
            <a className="btn btn--primary btn--lg" href={`mailto:${site.email}`}>
              <Mail /> {site.email}
            </a>
            <button type="button" className="btn btn--ghost btn--lg" onClick={copy} aria-live="polite">
              {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="contact__links" data-reveal>
            <a href={site.linkedin} target="_blank" rel="noopener">
              <Linkedin /> LinkedIn <ArrowUpRight />
            </a>
            <a href={site.github} target="_blank" rel="noopener">
              <Github /> GitHub <ArrowUpRight />
            </a>
            <a href={site.resume} target="_blank" rel="noopener">
              Resume (PDF) <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="term" ref={term} data-reveal>
          <div className="term__bar">
            <span className="stage__dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span>zsh · ~/hugo</span>
          </div>
          <pre className="term__body">
            <code>
              <span className="term__prompt">$</span> curl -s /api/contact | jq{"\n"}
              {shown >= 1 ? <span className="term__p">{"{"}</span> : null}
              {LINES.map((l, i) =>
                shown >= i + 2 ? (
                  <span key={l.k} className="term__line">
                    {"\n  "}
                    <span className="term__k">&quot;{l.k}&quot;</span>
                    <span className="term__p">: </span>
                    {l.href ? (
                      <a className="term__v" href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                        &quot;{l.v}&quot;
                      </a>
                    ) : (
                      <span className="term__v">&quot;{l.v}&quot;</span>
                    )}
                    {i < LINES.length - 1 ? <span className="term__p">,</span> : null}
                  </span>
                ) : null,
              )}
              {shown >= LINES.length + 2 ? <span className="term__p">{"\n}"}</span> : null}
              {"\n"}
              <span className="term__prompt">$</span> <span className="term__cursor" aria-hidden />
            </code>
          </pre>
          <p className="term__note">
            That endpoint is real: <a href="/api/contact">/api/contact</a>
          </p>
        </div>
      </div>
    </section>
  );
}
