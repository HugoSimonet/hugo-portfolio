"use client";

import { useEffect } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEF";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? "";
  const compact = el.dataset.compact === "true";
  const fmt = (n: number) => {
    if (compact && n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= to ? 0 : 1)}M`;
    return Math.round(n).toLocaleString("en-US");
  };
  if (prefersReducedMotion()) {
    el.textContent = fmt(to) + suffix;
    return;
  }
  const dur = 1700;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(2, -10 * p); // easeOutExpo
    el.textContent = fmt(p >= 1 ? to : to * e) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function scramble(el: HTMLElement) {
  const final = el.dataset.text ?? el.textContent ?? "";
  if (prefersReducedMotion()) return;
  const dur = 900;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const revealed = Math.floor(p * final.length);
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      if (i < revealed || ch === " ") out += ch;
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}

/**
 * One observer for the whole page:
 *  [data-reveal]   → adds .is-in when it scrolls into view
 *  [data-count]    → counts up to its value
 *  [data-scramble] → decodes its text
 */
export default function RevealRoot() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal],[data-count],[data-scramble]"),
    );

    // Hide counters that start below the fold so they can count up later.
    for (const el of els) {
      if (el.dataset.count && el.getBoundingClientRect().top > window.innerHeight) {
        el.textContent = "0" + (el.dataset.suffix ?? "");
      }
      if (el.dataset.scramble !== undefined && !el.dataset.text) {
        el.dataset.text = el.textContent ?? "";
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.classList.add("is-in");
          if (el.dataset.count) countUp(el);
          if (el.dataset.scramble !== undefined) scramble(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
