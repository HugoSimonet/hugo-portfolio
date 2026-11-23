"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "./icons";
import { nav, site } from "@/lib/content";

export default function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mod, setMod] = useState("Ctrl");
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setMod("⌘");

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        setScrolled(h.scrollTop > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const top = document.getElementById("top");
    const topIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (top) topIo.observe(top);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      topIo.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openPalette = () => window.dispatchEvent(new Event("palette:open"));

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="brand" aria-label={`${site.name}, back to top`} onClick={() => setOpen(false)}>
          <Mark />
          <span className="brand__name">
            hugo<span>.</span>simonet
          </span>
        </a>

        <nav aria-label="Primary" className="nav__primary">
          <ol className="nav__links">
            {nav.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className={active === n.id ? "is-active" : undefined}>
                  <span className="nav__num">0{i + 1}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="nav__right">
          <button type="button" className="kbd-btn" onClick={openPalette} aria-label="Open command menu">
            <kbd>{mod}</kbd>
            <kbd>K</kbd>
          </button>
          <a className="btn btn--sm" href={site.resume} target="_blank" rel="noopener">
            Resume
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="burger">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
      <span className="nav__progress" aria-hidden>
        <span ref={bar} />
      </span>

      <div id="mobile-menu" className="sheet" hidden={!open}>
        <ol>
          {nav.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)}>
                <span className="nav__num">0{i + 1}</span>
                {n.label}
                <span className="sheet__alias">{`// ${n.alias}`}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="sheet__foot">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  );
}
