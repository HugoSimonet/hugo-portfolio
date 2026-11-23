"use client";

import { useState, type CSSProperties } from "react";
import SectionHead from "./SectionHead";
import { toolkit, toolkitCols } from "@/lib/content";

type Cell = { r: number; c: number } | null;

export default function Toolkit() {
  const [cell, setCell] = useState<Cell>(null);
  const [row, setRow] = useState<number | null>(null);
  const [col, setCol] = useState<number | null>(null);

  const colTotals = toolkitCols.map((c) => toolkit.filter((t) => t.uses[c.id]).length);
  const maxCol = Math.max(...colTotals);
  const rowTotals = toolkit.map((t) => Object.keys(t.uses).length);
  const maxRow = Math.max(...rowTotals);

  const hr = cell?.r ?? row;
  const hc = cell?.c ?? col;
  const info = cell ? toolkit[cell.r].uses[toolkitCols[cell.c].id] : null;

  const clear = () => {
    setCell(null);
    setRow(null);
    setCol(null);
  };

  return (
    <section className="section" id="toolkit" aria-labelledby="toolkit-title">
      <div className="wrap">
        <SectionHead
          index="04"
          alias="feature map"
          title={
            <span id="toolkit-title">
              What I <em>reach for</em>.
            </span>
          }
          lede="No skill bars. Each dot is a place I used the tool, so you can check the evidence. Hover one for specifics."
        />

        <div className="matrix-wrap" data-reveal onMouseLeave={clear}>
          <div
            className="matrix"
            role="table"
            aria-label="Tools by project"
            style={{ "--cols": toolkitCols.length } as CSSProperties}
          >
            <div className="matrix__row matrix__row--head" role="row">
              <span className="matrix__corner" role="columnheader">
                tool \ where
              </span>
              {toolkitCols.map((c, ci) => (
                <span
                  key={c.id}
                  role="columnheader"
                  className={`matrix__col${hc === ci ? " is-hi" : ""}`}
                  title={c.full}
                  onMouseEnter={() => {
                    setCell(null);
                    setRow(null);
                    setCol(ci);
                  }}
                >
                  {c.short}
                </span>
              ))}
              <span className="matrix__tot" role="columnheader">
                n
              </span>
            </div>

            {toolkit.map((t, ri) => (
              <div
                key={t.tool}
                role="row"
                className={`matrix__row${hr === ri ? " is-hi" : ""}`}
                style={{ "--r": ri } as CSSProperties}
              >
                <span
                  className="matrix__tool"
                  role="rowheader"
                  onMouseEnter={() => {
                    setCell(null);
                    setCol(null);
                    setRow(ri);
                  }}
                >
                  {t.tool}
                  <small>{t.group}</small>
                </span>
                {toolkitCols.map((c, ci) => {
                  const use = t.uses[c.id];
                  return (
                    <span role="cell" key={c.id} className={`matrix__cell${hc === ci ? " is-col" : ""}`}>
                      {use ? (
                        <button
                          type="button"
                          className={`dot${cell?.r === ri && cell?.c === ci ? " is-on" : ""}`}
                          aria-label={`${t.tool} at ${c.full}: ${use}`}
                          onMouseEnter={() => setCell({ r: ri, c: ci })}
                          onFocus={() => setCell({ r: ri, c: ci })}
                          onClick={() => setCell({ r: ri, c: ci })}
                          style={{ "--k": ri + ci } as CSSProperties}
                        />
                      ) : (
                        <i className="nil" aria-label="not used" />
                      )}
                    </span>
                  );
                })}
                <span className="matrix__tot" role="cell">
                  <i style={{ "--w": rowTotals[ri] / maxRow } as CSSProperties} />
                  <b>{rowTotals[ri]}</b>
                </span>
              </div>
            ))}

            <div className="matrix__row matrix__row--foot" role="row" aria-hidden>
              <span className="matrix__corner">tools used</span>
              {colTotals.map((n, ci) => (
                <span key={ci} className={`matrix__colbar${hc === ci ? " is-hi" : ""}`}>
                  <i style={{ "--h": n / maxCol } as CSSProperties} />
                  <b>{n}</b>
                </span>
              ))}
              <span />
            </div>
          </div>

          <div className="matrix__info" aria-live="polite">
            {cell && info ? (
              <p>
                <b>{toolkit[cell.r].tool}</b>
                <span className="matrix__at">@ {toolkitCols[cell.c].full}</span>
                <span className="matrix__use">{info}</span>
              </p>
            ) : hr !== null && hr !== undefined ? (
              <p>
                <b>{toolkit[hr].tool}</b>
                <span className="matrix__at">used in {rowTotals[hr]} of {toolkitCols.length}</span>
                <span className="matrix__use">
                  {toolkitCols
                    .filter((c) => toolkit[hr].uses[c.id])
                    .map((c) => c.full)
                    .join(" · ")}
                </span>
              </p>
            ) : hc !== null && hc !== undefined ? (
              <p>
                <b>{toolkitCols[hc].full}</b>
                <span className="matrix__at">{colTotals[hc]} tools</span>
                <span className="matrix__use">
                  {toolkit
                    .filter((t) => t.uses[toolkitCols[hc].id])
                    .map((t) => t.tool)
                    .join(" · ")}
                </span>
              </p>
            ) : (
              <p className="matrix__idle">
                <b className="on-hover">Hover a dot</b>
                <b className="on-touch">Tap a dot</b>
                <span className="matrix__use">to see where and how I used that tool.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
