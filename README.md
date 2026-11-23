# hugo.simonet: portfolio

Personal site for Hugo Simonet: data analyst & AI builder, B.S. Statistics & Data Science (UCSB).

Built with Next.js (App Router) + TypeScript and plain CSS, with no UI framework and no animation library. It is designed to be deployed on Vercel.

## What's on the page

| Section | What it does |
|---|---|
| **Hero** | A live canvas simulation: particles run gradient descent with momentum on a procedurally generated loss surface, drawn as a ridgeline plot. Moving the cursor digs a well, and a click drops a new particle. The HUD shows live optimizer stats. |
| **01 Work** | Three case studies. **Catan Bot Lab** is a scroll-driven story whose sticky chart draws the agent's *real* training curve (from `results/training/*.jsonl`) as you scroll. **DataCo dashboard** shows the real Power BI pages with hover hotspots that spotlight design decisions, plus an animated 53 → 37 column-cleaning funnel and an interactive star schema. **ML lab** has four cards with small generative visuals that animate on hover. |
| **02 Experience** | Roles that expand on hover (desktop) or tap (mobile). |
| **03 Education** | Career timeline. Cards flip to coursework and course projects on hover. |
| **04 Toolkit** | An evidence matrix (tool × where it was used) instead of skill bars, with marginal totals and a hover read-out. |
| **05 Contact** | A terminal that "curls" `/api/contact`, which is a real JSON endpoint. |
| Everywhere | `Ctrl/⌘ + K` command palette, scroll-spy nav with a progress bar, scroll reveals, and `prefers-reduced-motion` support. On touch devices, content that would appear on hover is shown by default. |

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
```

## Edit the content

All copy lives in **`lib/content.ts`**: hero stats, case-study text, experience bullets, education, the toolkit matrix and contact links. Chart data lives in **`lib/data.ts`**.

- Images: `public/img/` (DataCo screenshots, Catan replay).
- Resume: replace `public/resume/Hugo-Simonet-Resume.pdf` (keep the filename, or update `site.resume`).
- Dashboard hotspots: `dataco.pages[].hotspots` in `lib/content.ts`. `x` and `y` are percentages of the screenshot.
- Colors and type: CSS variables at the top of `app/globals.css` (`--accent` is the orange).

Every figure on the site comes from the resume, the LinkedIn notes in `Job Search/`, or the project repos. Keep it that way when editing.

## Deploy to Vercel

**Live at https://hugo-simonet.vercel.app.** The Vercel project is `hugo-simonet` (team `hugosimonets-projects`), and this folder is already linked to it (`.vercel/`).

**Publish an update** from this folder:

```bash
npx vercel --prod   # build on Vercel and replace the live site
npx vercel          # optional: a private preview URL first
```

`vercel.json` pins the framework to Next.js. Without it, a project created from the CLI defaults to "Other" and serves only `public/` (every page 404s). `.vercelignore` keeps `.env*`, `.next` and `node_modules` out of uploads.

**Optional: auto-deploy on every push.** Put the folder on GitHub, then connect the repo under Project → Settings → Git:

```bash
git init && git add -A && git commit -m "Portfolio site"
gh repo create hugo-portfolio --public --source . --push
```

**Custom domain (optional):** add it under Project → Settings → Domains. Social-preview URLs use Vercel's production URL automatically. To pin a different one, set the `NEXT_PUBLIC_SITE_URL` environment variable (for example `https://hugosimonet.com`).

## Structure

```
app/
  layout.tsx            fonts (Geist, Geist Mono, Instrument Serif), metadata
  page.tsx              section order
  globals.css           the whole design system
  api/contact/route.ts  the JSON contact endpoint
  opengraph-image.tsx   generated social preview card
  icon.svg              favicon
components/             one file per section, plus LossLandscape (hero canvas),
                        CommandPalette, Nav, RevealRoot (scroll reveal / count-up / text decode)
lib/content.ts          all copy
lib/data.ts             Catan training curve + tournament results
```
