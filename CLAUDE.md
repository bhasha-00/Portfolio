# CLAUDE.md

Portfolio site for Bhasha Maheshwari (product / UX/UI designer). Read `artdirection.md` before any UI work and follow it. It is the source of truth for tokens, type, layout and motion.

## Stack
Next.js (App Router) + TypeScript + CSS (variables or CSS modules). Deploy on Vercel. Mobile-first, responsive from 360px to 1440px+.

## How to work
1. **Plan first, code second.** Before building any screen or component, restate the brief in four lines (Bar, Reference, Limits, Check) and wait for approval.
2. **One screen or component per task.** Do not build ahead.
3. **Check against the reference.** After building, compare with `reference/lofi-v4.html` at 390px and 1440px, report differences, then fix them.
4. **Small diffs.** Edit the lines that need changing. Do not rewrite whole files to tweak them.
5. **Ask before adding a dependency.** Prefer plain CSS and inline SVG.

## Hard rules
- Colours and fonts come only from the tokens in `artdirection.md`. No new colours, no new font families.
- No texture, no gradients, no glassmorphism.
- No WebGL or video on first paint. Hero must be usable in about 1s.
- Animate transform and opacity only. Respect `prefers-reduced-motion`.
- Intro is skippable by any tap, scroll or key, and plays once per session (`sessionStorage`).
- Content never waits on animation.
- Original characters only. No third-party IP.

## Build order
0. Scaffold, tokens, fonts (`next/font`), layout shell, nav.
1. Home hero (static): name, result-led line, figure placeholder, metrics, card peek.
2. Intro fold + companion (port `run()` / `fold()` from the prototype).
3. Case study cards with metric demos.
4. AI Tinkering section.
5. About.
6. Polish: responsive pass, accessibility, Lighthouse.
7. Deploy to Vercel, connect a custom domain.

## Definition of done (per task)
- Matches the reference at 390px and 1440px.
- States covered: hover, focus, touch, reduced-motion.
- No console errors. Lighthouse mobile performance 90 or above.

## Keeping context small
- Do not re-read large files you already have. Read only what the task needs.
- Start each build order step in a fresh session if context gets long.

## Git and deploy
- Initialise Git at step 0 with a `.gitignore` (node_modules, .next, .env*, .DS_Store). Never commit secrets.
- Work on a branch per build-order step (`step-1-hero`, `step-2-intro`). Merge to `main` only when the step meets its definition of done.
- Commit after every working change, with a short message in the form `hero: add result-led headline`.
- Push to a GitHub repo. Connect that repo to Vercel: every branch gets a preview URL, and `main` deploys to production.
- Before merging, check the Vercel preview on a real phone, not just the desktop browser.
- Custom domain: add it in Vercel project settings, then set the DNS records the registrar needs. Do this last (build order step 7).
- Never run destructive Git commands (`reset --hard`, force push) without asking me first.
