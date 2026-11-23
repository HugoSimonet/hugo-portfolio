import { ArrowUp, Mark } from "./icons";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <p className="footer__brand">
          <Mark /> {site.name} · {new Date().getFullYear()}
        </p>
        <p className="footer__colophon">
          Built with Next.js and deployed on Vercel. The hero is a live simulation: gradient descent with momentum on a
          procedurally generated loss surface.
        </p>
        <a href="#top" className="footer__top">
          Back to top <ArrowUp />
        </a>
      </div>
    </footer>
  );
}
