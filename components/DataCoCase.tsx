"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { dataco } from "@/lib/content";

type Cat = "keep" | "dead" | "pii" | "redundant";

const REMOVED: Record<number, { cat: Exclude<Cat, "keep">; name: string }> = {
  4: { cat: "dead", name: "Product Description" },
  11: { cat: "dead", name: "Product Status" },
  19: { cat: "dead", name: "Customer Email" },
  27: { cat: "dead", name: "Customer Password" },
  38: { cat: "dead", name: "Order Zipcode" },
  47: { cat: "dead", name: "Product Image" },
  7: { cat: "pii", name: "Customer Fname" },
  15: { cat: "pii", name: "Customer Lname" },
  23: { cat: "pii", name: "Customer Street" },
  33: { cat: "pii", name: "Customer Zipcode" },
  2: { cat: "redundant", name: "Benefit per order = Order Profit Per Order" },
  13: { cat: "redundant", name: "Sales per customer = Order Item Total" },
  21: { cat: "redundant", name: "Order Item Cardprod Id = Product Card Id" },
  30: { cat: "redundant", name: "Product Category Id = Category Id" },
  41: { cat: "redundant", name: "Order Item Product Price = Product Price" },
  50: { cat: "redundant", name: "Order Customer Id = Customer Id" },
};

const CATS: { id: Exclude<Cat, "keep">; label: string; n: number; why: string }[] = [
  { id: "dead", label: "Dead", n: 6, why: "100% null, constant, or already masked" },
  { id: "pii", label: "Personal data", n: 4, why: "names, street and zip code" },
  { id: "redundant", label: "Redundant", n: 6, why: "each confirmed equal to another column, row by row" },
];

/* star schema geometry (viewBox 0 0 440 300) */
const BOX = { w: 132, h: 54 };
const FACT = { x: 150, y: 120, w: 140, h: 62 };
const DIMS = [
  { x: 8, y: 14 },
  { x: 300, y: 14 },
  { x: 154, y: 238 },
];

export default function DataCoCase() {
  const [page, setPage] = useState(0);
  const [spot, setSpot] = useState<number | null>(null);
  const [cat, setCat] = useState<Cat | null>(null);
  const [table, setTable] = useState<string>(dataco.schema.fact.name);

  const current = dataco.pages[page];
  const active = spot !== null ? current.hotspots[spot] : null;
  const allTables = [dataco.schema.fact, ...dataco.schema.dims];
  const tableInfo = allTables.find((t) => t.name === table) ?? dataco.schema.fact;

  return (
    <article className="case case--dataco" aria-labelledby="dataco-title">
      <header className="case__head">
        <div className="case__label" data-reveal>
          <span className="case__num">Case 02</span>
          <span className="case__rule" aria-hidden />
          <span>Business intelligence · Power BI · DAX · Power Query</span>
        </div>
        <div className="case__intro">
          <div>
            <h3 id="dataco-title" className="case__title" data-reveal>
              Supply-chain &amp; sales dashboard
            </h3>
            <p className="case__question" data-reveal style={{ "--d": "80ms" } as CSSProperties}>
              An end-to-end Power BI build on the public DataCo dataset: profiled, cleaned, modeled as a star schema
              and designed page by page, with a git commit and a sign-off at every stage.
            </p>
          </div>
          <div className="case__aside" data-reveal style={{ "--d": "140ms" } as CSSProperties}>
            <dl className="specs">
              {dataco.facts.map((f) => (
                <div key={f.v}>
                  <dt>{f.v}</dt>
                  <dd>{f.k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="dash" data-reveal>
        <div className="dash__top">
          <div className="tabs" role="tablist" aria-label="Dashboard pages">
            {dataco.pages.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={i === page}
                className="tab"
                onClick={() => {
                  setPage(i);
                  setSpot(null);
                }}
              >
                <span className="tab__num">p{i + 1}</span> {p.label}
              </button>
            ))}
          </div>
          <p className="dash__hint">Hover the markers for the decisions behind each page</p>
        </div>

        <div className="dash__frame" onMouseLeave={() => setSpot(null)}>
          <div className="dash__chrome" aria-hidden>
            <span className="stage__dots">
              <i />
              <i />
              <i />
            </span>
            <span>DataCoDashboard.pbip · {current.label}</span>
          </div>
          <div className="dash__canvas">
            {dataco.pages.map((p, i) => (
              <Image
                key={p.id}
                src={p.src}
                alt={p.alt}
                width={2886}
                height={1624}
                sizes="(max-width: 1240px) 100vw, 1180px"
                className={i === page ? "is-active" : undefined}
                aria-hidden={i !== page}
                priority={false}
              />
            ))}
            <div
              className={`dash__spot${active ? " is-on" : ""}`}
              style={active ? ({ "--sx": `${active.x}%`, "--sy": `${active.y}%` } as CSSProperties) : undefined}
              aria-hidden
            />
            {current.hotspots.map((h, i) => (
              <div
                key={`${current.id}-${i}`}
                className={`hot${spot === i ? " is-on" : ""}${h.x > 58 ? " hot--left" : h.x < 22 ? " hot--right" : ""}${h.y > 55 ? " hot--up" : ""}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` } as CSSProperties}
              >
                <button
                  type="button"
                  className="hot__btn"
                  aria-label={h.title}
                  aria-expanded={spot === i}
                  onMouseEnter={() => setSpot(i)}
                  onFocus={() => setSpot(i)}
                  onClick={() => setSpot(spot === i ? null : i)}
                >
                  {i + 1}
                </button>
                <div className="hot__card" role="tooltip">
                  <p className="hot__title">{h.title}</p>
                  <p>{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ol className="dash__legend">
          {current.hotspots.map((h, i) => (
            <li key={`${current.id}-l-${i}`} className={spot === i ? "is-on" : undefined}>
              <button type="button" onMouseEnter={() => setSpot(i)} onFocus={() => setSpot(i)} onClick={() => setSpot(i)}>
                <span className="dash__n">{i + 1}</span>
                <span className="dash__lt">{h.title}</span>
              </button>
              <p className="dash__lb">{h.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="dataco-grid">
        <section className="panel funnel" data-reveal aria-labelledby="funnel-title">
          <header className="panel__head">
            <p className="panel__kicker">Cleaning · Power Query</p>
            <h4 id="funnel-title">
              <span className="funnel__from">53</span>
              <span className="funnel__arrow" aria-hidden>
                →
              </span>
              <span className="funnel__to">37</span> columns
            </h4>
          </header>
          <div className={`funnel__grid${cat ? ` show-${cat}` : ""}`} aria-hidden>
            {Array.from({ length: dataco.funnel.total }, (_, i) => {
              const r = REMOVED[i];
              return (
                <i
                  key={i}
                  className={r ? `x ${r.cat}` : "keep"}
                  title={r ? r.name : undefined}
                  style={{ "--i": i } as CSSProperties}
                />
              );
            })}
          </div>
          <ul className="funnel__legend">
            {CATS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`chip-btn ${c.id}${cat === c.id ? " is-on" : ""}`}
                  onMouseEnter={() => setCat(c.id)}
                  onMouseLeave={() => setCat(null)}
                  onFocus={() => setCat(c.id)}
                  onBlur={() => setCat(null)}
                >
                  <i aria-hidden />
                  <b>{c.n}</b> {c.label}
                </button>
                <span className="funnel__why">{c.why}</span>
              </li>
            ))}
          </ul>
          <p className="panel__note">
            180,519 rows, latin-1 encoded. Whitespace trimmed, dates parsed with a fixed locale, and “EE. UU.” mapped
            to “United States”.
          </p>
        </section>

        <section className="panel schema" data-reveal style={{ "--d": "100ms" } as CSSProperties} aria-labelledby="schema-title">
          <header className="panel__head">
            <p className="panel__kicker">Model · star schema</p>
            <h4 id="schema-title">One fact, three dimensions</h4>
          </header>
          <svg viewBox="0 0 440 300" className="schema__svg" role="group" aria-label="Star schema diagram">
            {DIMS.map((d, i) => {
              const dx = d.x + BOX.w / 2;
              const dy = d.y + (d.y < FACT.y ? BOX.h : 0);
              const fx = FACT.x + FACT.w / 2 + (i === 0 ? -40 : i === 1 ? 40 : 0);
              const fy = d.y < FACT.y ? FACT.y : FACT.y + FACT.h;
              const on = table === dataco.schema.dims[i].name;
              return (
                <g key={i} className={`schema__rel${on ? " is-on" : ""}`}>
                  <path d={`M${dx},${dy} C${dx},${(dy + fy) / 2} ${fx},${(dy + fy) / 2} ${fx},${fy}`} />
                  <text x={dx + (i === 2 ? 10 : 8)} y={d.y < FACT.y ? dy + 14 : dy - 8}>
                    1
                  </text>
                  <text x={fx + 8} y={d.y < FACT.y ? fy - 6 : fy + 16}>
                    *
                  </text>
                </g>
              );
            })}
            {[{ ...dataco.schema.fact, box: FACT, fact: true }, ...dataco.schema.dims.map((d, i) => ({ ...d, box: { ...DIMS[i], ...BOX }, fact: false }))].map((t) => (
              <g
                key={t.name}
                className={`schema__table${t.fact ? " is-fact" : ""}${table === t.name ? " is-on" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`${t.name}, ${t.rows} rows`}
                onMouseEnter={() => setTable(t.name)}
                onFocus={() => setTable(t.name)}
                onClick={() => setTable(t.name)}
              >
                <rect x={t.box.x} y={t.box.y} width={t.box.w} height={t.box.h} rx="8" />
                <text x={t.box.x + 12} y={t.box.y + 22} className="schema__name">
                  {t.name}
                </text>
                <text x={t.box.x + 12} y={t.box.y + 40} className="schema__rows">
                  {t.rows} rows
                </text>
              </g>
            ))}
          </svg>
          <p className="schema__caption" aria-live="polite">
            <b>{tableInfo.name}</b> {tableInfo.note}
          </p>
          <p className="panel__note">
            Three single-direction, many-to-one relationships. Shipping and geography stay on the fact as degenerate
            dimensions rather than earning tables of their own.
          </p>
        </section>
      </div>
    </article>
  );
}
