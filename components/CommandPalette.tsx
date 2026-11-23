"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Copy, FileText, Hash, Search } from "./icons";
import { catan, mlLab, nav, site } from "@/lib/content";

type Item = { id: string; label: string; hint: string; group: string; run: () => void; icon: "hash" | "out" | "copy" | "file" };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  const items: Item[] = useMemo(() => {
    const go = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    };
    const out = (url: string) => () => window.open(url, "_blank", "noopener");
    return [
      ...nav.map((n) => ({ id: n.id, label: n.label, hint: n.alias, group: "Jump to", run: go(n.id), icon: "hash" as const })),
      { id: "catan-live", label: "Catan Bot Lab: live site", hint: "replays + results", group: "Open", run: out(catan.live), icon: "out" },
      { id: "catan-code", label: "Catan Bot Lab: source", hint: "github", group: "Open", run: out(catan.code), icon: "out" },
      { id: "ml", label: "ML-Projects repo", hint: "github", group: "Open", run: out(mlLab.repo), icon: "out" },
      { id: "gh", label: "GitHub profile", hint: "HugoSimonet", group: "Open", run: out(site.github), icon: "out" },
      { id: "li", label: "LinkedIn", hint: "in/hsimonet", group: "Open", run: out(site.linkedin), icon: "out" },
      { id: "cv", label: "Resume (PDF)", hint: "one page", group: "Open", run: out(site.resume), icon: "file" },
      {
        id: "copy",
        label: "Copy email address",
        hint: site.email,
        group: "Contact",
        run: () => {
          navigator.clipboard?.writeText(site.email).then(() => {
            setToast("Email copied");
            setTimeout(() => setToast(""), 1800);
          });
        },
        icon: "copy",
      },
    ];
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    const score = (i: Item) => {
      const label = i.label.toLowerCase();
      if (label.startsWith(s) || label.includes(` ${s}`)) return 0;
      if (label.includes(s)) return 1;
      return `${i.hint} ${i.group}`.toLowerCase().includes(s) ? 2 : 9;
    };
    return items
      .map((i) => ({ i, sc: score(i) }))
      .filter((r) => r.sc < 9)
      .sort((a, b) => a.sc - b.sc)
      .map((r) => r.i);
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) lastFocus.current = document.activeElement as HTMLElement;
          return !o;
        });
      }
    };
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  const run = (item: Item | undefined) => {
    if (!item) return;
    item.run();
    if (item.id !== "copy") close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[sel]);
    }
  };

  const Icon = ({ k }: { k: Item["icon"] }) =>
    k === "hash" ? <Hash /> : k === "out" ? <ArrowUpRight /> : k === "copy" ? <Copy /> : <FileText />;

  let lastGroup = "";

  return (
    <>
      {open && (
        <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu" onKeyDown={onKeyDown}>
          <button type="button" className="palette__scrim" aria-label="Close" onClick={close} tabIndex={-1} />
          <div className="palette__box">
            <label className="palette__search">
              <Search />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Jump to a section, open a project…"
                aria-label="Search commands"
                aria-controls="palette-list"
                aria-activedescendant={results[sel] ? `cmd-${results[sel].id}` : undefined}
              />
              <kbd>esc</kbd>
            </label>
            <ul id="palette-list" role="listbox" className="palette__list">
              {results.length === 0 && <li className="palette__empty">No matches.</li>}
              {results.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {header && <p className="palette__group">{header}</p>}
                    <div
                      id={`cmd-${item.id}`}
                      role="option"
                      aria-selected={i === sel}
                      className="palette__item"
                      onMouseMove={() => setSel(i)}
                      onClick={() => run(item)}
                    >
                      <span className="palette__icon">
                        <Icon k={item.icon} />
                      </span>
                      <span className="palette__label">{item.label}</span>
                      <span className="palette__hint">{item.hint}</span>
                      <ArrowRight className="palette__go" />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="palette__foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> open
              </span>
            </p>
          </div>
        </div>
      )}
      <div className="toast" role="status" aria-live="polite" data-show={toast ? "true" : "false"}>
        {toast}
      </div>
    </>
  );
}
