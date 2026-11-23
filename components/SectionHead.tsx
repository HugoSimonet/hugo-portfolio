import type { CSSProperties, ReactNode } from "react";

export default function SectionHead({
  index,
  alias,
  title,
  lede,
}: {
  index: string;
  alias: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="shead">
      <div className="shead__meta" data-reveal>
        <span className="shead__index">{index}</span>
        <span className="shead__rule" aria-hidden />
        <span className="shead__alias" data-scramble>{`// ${alias}`}</span>
      </div>
      <h2 className="shead__title" data-reveal style={{ "--d": "80ms" } as CSSProperties}>
        {title}
      </h2>
      {lede && (
        <p className="shead__lede" data-reveal style={{ "--d": "160ms" } as CSSProperties}>
          {lede}
        </p>
      )}
    </header>
  );
}
