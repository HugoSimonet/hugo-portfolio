import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowUp = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
export const Github = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);
export const Linkedin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const Copy = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const FileText = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
export const Search = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const Hash = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </svg>
);

/** Brand mark: three ridgelines and a converged particle. */
export const Mark = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden {...p}>
    <path d="M3 10c4 0 5-4 8-4s4 5 7 5 4-3 6-3 3 2 5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".45" />
    <path d="M3 17c4 0 5-5 9-5s3 7 7 7 4-4 6-4 2 2 4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
    <path d="M3 25c3 0 5-2 8-2s5 4 9 4 4-3 6-3 2 1 3 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="19" cy="19" r="2.6" fill="var(--accent)" />
  </svg>
);
