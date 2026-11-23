"use client";

import { useEffect, useRef } from "react";

/**
 * A live optimization demo drawn as a ridgeline plot.
 *
 * The surface is a procedurally generated loss function: a gentle bowl,
 * drifting Gaussian wells (minima) and bumps (ridges), and a low ripple.
 * Particles run gradient descent with momentum on it and leave trails.
 * The cursor digs a temporary well that particles roll toward; a click
 * drops a new particle. Rows are painted back to front, each filled with
 * the background color, so nearer ridges hide what is behind them.
 */

const D = 3; // the domain is [-D, D] on both axes
const BG = "#0a0b0d";
const INK = "236, 232, 224";
const ACCENT = "255, 122, 61";

type Well = { x: number; z: number; a: number; s: number; ox: number; oz: number; w: number; p: number };
const WELLS: Well[] = [
  { x: -1.1, z: 0.6, a: -1.3, s: 0.8, ox: 0.45, oz: 0.3, w: 0.09, p: 0 },
  { x: 1.45, z: -0.25, a: -1.0, s: 0.62, ox: 0.3, oz: 0.4, w: 0.07, p: 2.1 },
  { x: 0.5, z: 1.9, a: -0.75, s: 0.55, ox: 0.3, oz: 0.2, w: 0.11, p: 4.2 },
  { x: 0.25, z: -1.45, a: 1.05, s: 0.75, ox: 0.3, oz: 0.25, w: 0.06, p: 1.0 },
  { x: -2.1, z: -1.5, a: 0.9, s: 0.85, ox: 0.2, oz: 0.3, w: 0.05, p: 3.3 },
  { x: 2.2, z: 1.8, a: 0.75, s: 0.65, ox: 0.25, oz: 0.2, w: 0.08, p: 5.0 },
  { x: 0.1, z: 0.35, a: 0.65, s: 0.42, ox: 0.2, oz: 0.2, w: 0.1, p: 0.7 },
  { x: -1.9, z: 2.1, a: 0.6, s: 0.6, ox: 0.2, oz: 0.2, w: 0.07, p: 2.6 },
];
const INV2S2 = WELLS.map((w) => 1 / (2 * w.s * w.s));

type Particle = {
  x: number;
  z: number;
  vx: number;
  vz: number;
  loss: number;
  still: number;
  fade: number;
  dying: boolean;
  trail: number[]; // flat [x0, z0, x1, z1, ...]
  tick: number;
};

type Layout = { cx: number; half: number; top: number; span: number; amp: number; rows: number; cols: number };

function makeLayout(W: number, H: number): Layout {
  if (W <= 900) {
    // Phones and small tablets: the canvas is its own band below the intro.
    return { cx: W * 0.5, half: W * 0.78, top: H * 0.16, span: H * 0.62, amp: H * 0.15, rows: 32, cols: 90 };
  }
  return { cx: W * 0.665, half: W * 0.42, top: H * 0.2, span: H * 0.6, amp: H * 0.11, rows: 54, cols: 150 };
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export default function LossLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudStep = useRef<HTMLSpanElement>(null);
  const hudBest = useRef<HTMLSpanElement>(null);
  const hudGrad = useRef<HTMLSpanElement>(null);
  const hudCount = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";

    let W = 0;
    let H = 0;
    let L: Layout = makeLayout(1, 1);
    let t = 0; // surface time, seconds
    let intro = reduced ? 1 : 0;
    let steps = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastHud = 0;

    // Per-frame well centers
    const cxs = new Float64Array(WELLS.length);
    const czs = new Float64Array(WELLS.length);
    const mouse = { sx: -1, sy: -1, x: 0, z: 0, inside: false, strength: 0, loss: 0 };

    const updateWells = () => {
      for (let i = 0; i < WELLS.length; i++) {
        const w = WELLS[i];
        cxs[i] = w.x + w.ox * Math.cos(t * w.w + w.p);
        czs[i] = w.z + w.oz * Math.sin(t * w.w * 1.3 + w.p);
      }
    };

    const baseLoss = (x: number, z: number) => {
      let v = 0.04 * (x * x + z * z);
      for (let i = 0; i < WELLS.length; i++) {
        const dx = x - cxs[i];
        const dz = z - czs[i];
        v += WELLS[i].a * Math.exp(-(dx * dx + dz * dz) * INV2S2[i]);
      }
      v += 0.08 * Math.sin(1.9 * x + t * 0.17) * Math.cos(1.6 * z - t * 0.11);
      return v;
    };

    const loss = (x: number, z: number) => {
      let v = baseLoss(x, z);
      if (mouse.strength > 0.001) {
        const dx = x - mouse.x;
        const dz = z - mouse.z;
        v -= 0.95 * mouse.strength * Math.exp(-(dx * dx + dz * dz) * 3.6);
      }
      return v;
    };

    const persp = (d: number) => 0.42 + 0.58 * d;
    const pt = [0, 0];
    const project = (x: number, z: number, v: number) => {
      const d = (z + D) / (2 * D);
      const p = persp(d);
      pt[0] = L.cx + (x / D) * L.half * p;
      pt[1] = L.top + Math.pow(d, 1.25) * L.span - v * L.amp * p * (0.25 + 0.75 * easeIntro());
      return pt;
    };

    const unproject = (sx: number, sy: number) => {
      let d = 0.5;
      let v = 0;
      let x = 0;
      for (let k = 0; k < 3; k++) {
        const base = sy + v * L.amp * persp(d);
        d = Math.pow(clamp((base - L.top) / L.span, 0, 1), 1 / 1.25);
        x = ((sx - L.cx) / (L.half * persp(d))) * D;
        v = baseLoss(clamp(x, -D, D), d * 2 * D - D);
      }
      return { x, z: d * 2 * D - D, inside: d > 0.03 && d < 0.985 && Math.abs(x) < D * 0.97 };
    };

    function easeIntro() {
      return 1 - Math.pow(1 - intro, 3);
    }

    // ── particles ──────────────────────────────────────────────
    const particles: Particle[] = [];
    const spawn = (x?: number, z?: number): Particle => {
      let px = x ?? 0;
      let pz = z ?? 0;
      if (x === undefined || z === undefined) {
        let best = -Infinity;
        for (let i = 0; i < 12; i++) {
          const cx = (Math.random() * 2 - 1) * 2.6;
          const cz = (Math.random() * 2 - 1) * 2.6;
          const l = baseLoss(cx, cz);
          if (l > best) {
            best = l;
            px = cx;
            pz = cz;
          }
        }
      }
      return { x: px, z: pz, vx: 0, vz: 0, loss: 0, still: 0, fade: 0, dying: false, trail: [], tick: 0 };
    };

    const count = () => (W <= 900 ? 5 : 8);
    updateWells();
    for (let i = 0; i < count(); i++) {
      const p = spawn();
      p.still = Math.random() * 60; // stagger convergence so they don't all respawn together
      particles.push(p);
    }

    const LR = 0.0017;
    const MOMENTUM = 0.93;
    const NOISE = 0.0011;
    let gradSum = 0;

    const stepParticles = (dt: number) => {
      gradSum = 0;
      const e = 0.01;
      const mom = Math.pow(MOMENTUM, dt);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const gx = (loss(p.x + e, p.z) - loss(p.x - e, p.z)) / (2 * e);
        const gz = (loss(p.x, p.z + e) - loss(p.x, p.z - e)) / (2 * e);
        gradSum += Math.hypot(gx, gz);
        p.vx = p.vx * mom - LR * gx * dt + (Math.random() - 0.5) * NOISE * dt;
        p.vz = p.vz * mom - LR * gz * dt + (Math.random() - 0.5) * NOISE * dt;
        const sp = Math.hypot(p.vx, p.vz);
        if (sp > 0.06) {
          p.vx *= 0.06 / sp;
          p.vz *= 0.06 / sp;
        }
        p.x += p.vx * dt;
        p.z += p.vz * dt;
        const lim = D * 0.97;
        if (p.x < -lim || p.x > lim) {
          p.x = clamp(p.x, -lim, lim);
          p.vx *= -0.4;
        }
        if (p.z < -lim || p.z > lim) {
          p.z = clamp(p.z, -lim, lim);
          p.vz *= -0.4;
        }
        p.loss = loss(p.x, p.z);

        if (sp < 0.0028) p.still += dt;
        else p.still = Math.max(0, p.still - dt * 2);
        if (p.still > 150 && !p.dying) p.dying = true;

        if (p.dying) {
          p.fade -= 0.018 * dt;
          if (p.fade <= 0) particles[i] = spawn();
        } else {
          p.fade = Math.min(1, p.fade + 0.03 * dt);
        }

        p.tick += dt;
        if (p.tick >= 2) {
          p.tick = 0;
          p.trail.push(p.x, p.z);
          if (p.trail.length > 140) p.trail.splice(0, 2);
        }
      }
      steps += particles.length * dt;
    };

    // ── drawing ────────────────────────────────────────────────
    const xs = new Float64Array(200);
    const ys = new Float64Array(200);
    const vs = new Float64Array(200);
    const buckets: Particle[][] = [];

    const drawParticle = (p: Particle, isBest: boolean) => {
      const a = p.fade;
      if (a <= 0.01) return;
      const n = p.trail.length / 2;
      if (n > 1) {
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        let px = 0;
        let py = 0;
        for (let k = 0; k < n; k++) {
          const tx = p.trail[k * 2];
          const tz = p.trail[k * 2 + 1];
          project(tx, tz, loss(tx, tz));
          if (k > 0) {
            ctx.strokeStyle = `rgba(${ACCENT}, ${((k / n) * 0.85 * a).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(pt[0], pt[1]);
            ctx.stroke();
          }
          px = pt[0];
          py = pt[1];
        }
      }
      project(p.x, p.z, p.loss);
      const hx = pt[0];
      const hy = pt[1];
      ctx.fillStyle = `rgba(${ACCENT}, ${(0.16 * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(hx, hy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${ACCENT}, ${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
      ctx.fill();

      if (isBest && W >= 760) {
        ctx.strokeStyle = `rgba(${INK}, ${(0.35 * a).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, hy - 6);
        ctx.lineTo(hx, hy - 30);
        ctx.lineTo(hx + 8, hy - 38);
        ctx.stroke();
        ctx.font = `11px ${monoFamily}`;
        ctx.fillStyle = `rgba(${INK}, ${(0.8 * a).toFixed(3)})`;
        ctx.fillText(`L = ${p.loss.toFixed(3)}`, hx + 12, hy - 35);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const { rows, cols } = L;
      const ei = easeIntro();

      // which particle is lowest?
      let bestIdx = -1;
      let bestLoss = Infinity;
      for (let i = 0; i < particles.length; i++) {
        if (!particles[i].dying && particles[i].fade > 0.6 && particles[i].loss < bestLoss) {
          bestLoss = particles[i].loss;
          bestIdx = i;
        }
      }

      for (let r = 0; r < rows; r++) buckets[r] = [];
      for (const p of particles) {
        const ri = clamp(Math.floor(((p.z + D) / (2 * D)) * (rows - 1)), 0, rows - 1);
        buckets[ri].push(p);
      }

      for (let r = 0; r < rows; r++) {
        const d = r / (rows - 1);
        const z = -D + 2 * D * d;
        // rows fade in back-to-front during the intro
        const rowIn = clamp(intro * 2.2 - (1 - d) * 1.2, 0, 1);
        if (rowIn <= 0) continue;

        for (let c = 0; c < cols; c++) {
          const x = -D + (2 * D * c) / (cols - 1);
          const v = loss(x, z);
          project(x, z, v);
          xs[c] = pt[0];
          ys[c] = pt[1];
          vs[c] = v;
        }

        // occlusion fill
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let c = 1; c < cols; c++) ctx.lineTo(xs[c], ys[c]);
        ctx.lineTo(xs[cols - 1], H + 2);
        ctx.lineTo(xs[0], H + 2);
        ctx.closePath();
        ctx.fillStyle = BG;
        ctx.fill();

        // ridge
        const alpha = (0.07 + 0.5 * Math.pow(d, 1.5)) * rowIn;
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let c = 1; c < cols; c++) ctx.lineTo(xs[c], ys[c]);
        ctx.strokeStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // valleys glow faintly in the accent color
        const va = (0.06 + 0.34 * d) * rowIn * ei;
        if (va > 0.02) {
          ctx.beginPath();
          let pen = false;
          for (let c = 0; c < cols; c++) {
            if (vs[c] < -0.5) {
              if (pen) ctx.lineTo(xs[c], ys[c]);
              else ctx.moveTo(xs[c], ys[c]);
              pen = true;
            } else pen = false;
          }
          ctx.strokeStyle = `rgba(${ACCENT}, ${va.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        if (ei > 0.5) {
          for (const p of buckets[r]) drawParticle(p, particles.indexOf(p) === bestIdx);
        }
      }

      // cursor read-out
      if (finePointer && mouse.inside && mouse.strength > 0.05) {
        project(mouse.x, mouse.z, loss(mouse.x, mouse.z));
        const a = mouse.strength;
        ctx.strokeStyle = `rgba(${INK}, ${(0.5 * a).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = `11px ${monoFamily}`;
        ctx.fillStyle = `rgba(${INK}, ${(0.75 * a).toFixed(3)})`;
        const label = `x ${mouse.x.toFixed(2)}  z ${mouse.z.toFixed(2)}  L ${mouse.loss.toFixed(3)}`;
        ctx.fillText(label, pt[0] + 18, pt[1] + 4);
      }
    };

    const updateHud = (now: number) => {
      if (now - lastHud < 180) return;
      lastHud = now;
      let best = Infinity;
      for (const p of particles) if (p.fade > 0.5) best = Math.min(best, p.loss);
      if (hudStep.current) hudStep.current.textContent = Math.floor(steps).toLocaleString("en-US");
      if (hudBest.current) hudBest.current.textContent = Number.isFinite(best) ? best.toFixed(4) : "…";
      if (hudGrad.current) hudGrad.current.textContent = (gradSum / particles.length).toFixed(4);
      if (hudCount.current) hudCount.current.textContent = String(particles.length);
    };

    // ── sizing ────────────────────────────────────────────────
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      L = makeLayout(W, H);
      while (particles.length > count()) particles.pop();
      while (particles.length < count()) particles.push(spawn());
      if (!running) draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── input ─────────────────────────────────────────────────
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      if (sx < 0 || sy < 0 || sx > rect.width || sy > rect.height) {
        mouse.inside = false;
        return;
      }
      const u = unproject(sx, sy);
      mouse.x = clamp(u.x, -D, D);
      mouse.z = u.z;
      mouse.inside = u.inside;
    };
    const onLeave = () => {
      mouse.inside = false;
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, [role='button']")) return;
      onMove(e);
      if (!mouse.inside) return;
      const p = spawn(mouse.x + (Math.random() - 0.5) * 0.3, mouse.z + (Math.random() - 0.5) * 0.3);
      if (particles.length >= count() + 4) particles.shift();
      particles.push(p);
    };
    const hero = canvas.closest("section") ?? document.body;
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointerdown", onDown as EventListener);
    }

    // ── loop ──────────────────────────────────────────────────
    const frame = (now: number) => {
      if (!running) return;
      const dtMs = last ? Math.min(now - last, 50) : 16.7;
      last = now;
      const dt = dtMs / 16.67;
      t += dtMs / 1000;
      intro = Math.min(1, intro + dtMs / 2400);
      mouse.strength += ((mouse.inside ? 1 : 0) - mouse.strength) * Math.min(1, 0.08 * dt);
      updateWells();
      if (mouse.inside) mouse.loss = loss(mouse.x, mouse.z);
      if (intro > 0.35) stepParticles(dt);
      draw();
      updateHud(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      // One still frame with converged-looking trails.
      t = 8;
      updateWells();
      for (let i = 0; i < 260; i++) stepParticles(1);
      particles.forEach((p) => (p.fade = 1));
      draw();
      updateHud(performance.now() + 1000);
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.01,
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown as EventListener);
    };
  }, []);

  return (
    <>
      <div className="landscape" aria-hidden>
        <canvas ref={canvasRef} />
      </div>
      <aside className="hud" aria-hidden>
        <p className="hud__title">
          <span className="hud__live" /> live · SGD with momentum
        </p>
        <dl className="hud__grid">
          <dt>step</dt>
          <dd ref={hudStep}>0</dd>
          <dt>particles</dt>
          <dd ref={hudCount}>8</dd>
          <dt>best loss</dt>
          <dd ref={hudBest}>…</dd>
          <dt>mean |∇L|</dt>
          <dd ref={hudGrad}>…</dd>
        </dl>
        <p className="hud__hint">Move the cursor to bend the surface. Click to drop a particle.</p>
      </aside>
    </>
  );
}
