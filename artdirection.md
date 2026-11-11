# Art direction: Bhasha Maheshwari portfolio

Product / UX/UI designer, enterprise fintech. Audience: recruiters who give it about 10 seconds.
Feel: a precise, warm paper object. Bold red, hand-sketched, with one origami companion. Personality comes from illustration and motion; type stays quiet and confident.

## Brief (approved)
- **Bar:** Single-page portfolio, 4 tabs: Home, Projects, AI Tinkering, About. Flat red hero with a hand-sketched figure.
- **Reference:** `reference/lofi-v4.html` (motion + layout prototype), result-led hero (Albin Sigi), tabbed case study cards.
- **Limits:** tokens below; Next.js (or React) on Vercel; mobile-first; hero usable in about 1s; no WebGL on first paint; respect reduced-motion; no texture; two font families only.
- **Check:** screenshots at 390px and 1440px vs the prototype, Lighthouse mobile run, a 10-second recruiter scan.

## Tokens
`app/tokens.css` is the only place raw values live (imported once in `app/layout.tsx`). Everything else uses `var(--token)`. `npm run check:tokens` fails on raw colours, raw font sizes, `clamp()` font sizes, extra families, gradients/filters and off-scale spacing. Approved exceptions carry `tokens-allow: <reason>` on the same line (grep for the full list). So far: the hero crane's four blur shadows (brand moment, 2026-11-10).

Brand colours (`--indigo` dropped 2026-11-10; no indigo anywhere):
```css
:root{
  --red:#A82A1E;      /* hero + page background */
  --cream:#F3E9DA;    /* text on red, cards, nav pill */
  --ink:#2A1410;      /* text on cream */
  --gold:#E8B04A;     /* paper, accents, large/decorative only */
  --green:#2E7D6B;    /* accent */
  --vermilion:#D9432F;/* accent */
  --back:#FFF7E8;     /* paper back side in origami folds; white rabbit paper */
  --lime:#C8D52E;     /* parrot paper only (added 2026-11-10 at Bhasha's request) */}
```
- Cream on red is about 5.8:1 (passes AA). Gold on red is about 3.6:1: use for large or decorative elements only, never body text.
- **Texture: none.** Flat colour. (Revisit only if the hero feels heavy once built.)
  - Exception (2026-11-10, at Bhasha's request): the green paper square in the End section is a photo of real paper, texture and its own green included. That square only.
  - Exception (2026-11-11, at Bhasha's request, from bg.svg): the page background is a fixed layer (Backdrop.tsx) of red, a muted CSS dot grid (cream dots 1.3px every 22px at 22%, layer at 52%, from Bhasha's type + texture test), and bg.svg's burst shape in cream at 12%. Content scrolls over it; the burst starts low and rises to the centre over the first screen.
  - Paper grain (same request): the cream surfaces drawn in code (case study cards and tabs, nav) carry the green paper's fibres, taken from the End photo as a near-white tile (public/bg/paper-grain.webp) multiplied onto --cream. Loads after the page. The AI cards get the same grain as a layer clipped to their outline; the About tiles carry it at 0.25 on their cream.

- Roles: `--text-on-red` (cream), `--text-on-cream` (ink), `--text-muted` (~6.3:1 on cream), `--divider` (ink 12%), `--dim-overlay` + `--dim-text-opacity` (covered card), `--cloud-fill`.
- Radius `--r-sm` 8 / `--r-md` 16 / `--r-pill`; elevation `--shadow-card`. Motion `--dur-fast` 150 / `--dur-base` 250 / `--dur-card` 500, `--ease-out`.

## Type
- Exactly two families, both via `next/font/google` in `app/layout.tsx`: **Geist** (`--nf-geist` → `--font-sans`) for everything set in type, and **Caveat** (`--nf-hand` → `--font-hand`) as the fallback hand font. No Geist Mono, no monospace.
- Handwriting is Bhasha's own (Figma Hand) everywhere, as outlines: "Product designer" (hero), the case study eyebrows, the AI card names, the About captions, "Try a fold?". Caveat shows only where an outline is missing.
- Every text element maps to one role. No raw sizes, no `clamp()` sizes. Line heights sit on the 4px grid.

| Role | 390 | 768 | 1200+ | Use |
|---|---|---|---|---|
| display | 32/36 | 40/44 | 48/52 | hero headline only, weight 800, -0.03em (one step down, 2026-11-11) |
| h2 | 28/32 | 32/36 | 40/44 | card + section titles, 700, -0.02em |
| h3 | 24/32 | 28/32 | 28/32 | name, sub-heads |
| lead | 20/28 | | | summary, column labels (600) |
| body | 16/24 | | | body, 400 |
| small | 14/20 | | | nav, captions |
| caption | 12/16 | | | counters, chips |
| hand-sm / md / lg | 16/20 · 20/24 · 24/28 | | | chips · eyebrows, role line · "Try a fold?" |

- numeral (decorative "80/20" behind the hero only): `--fs-numeral` 96 / 128 / 192, line-height 1, 14% opacity.
- Counters: Geist 500, `font-variant-numeric: tabular-nums`. Metrics: weight 700.
- Headings use `text-wrap: balance`.
- Nav: Geist 500, normal case.

## Spacing and grid
- Spacing, 4px base: `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 24 · `-6` 32 · `-7` 48 · `-8` 64 · `-9` 96. Every margin, padding and gap uses one of these.
- Grid: `.container` (max 1280) + `.grid`. Columns / margin / gutter: 4 / 20 / 16 below 768; 8 / 40 / 24 at 768–1199; 12 / 80 / 24 at 1200+. Every section sits in `.container .grid`, so all left edges match.
- `--card-pad` 24 / 32 / 48 on all four sides. `--nav-offset` 96.
- Optional (only if the hero looks too plain): one serif accent word. Test before committing.

## Home (hero)
- Cream pill nav, top centre: Home, Projects, AI Tinkering, About.
- Headline large, top-left: **"Translating business goals and user needs into interfaces that perform."** Display role. Phones: wraps balanced. From 768: three set lines. From 1200: headline cols 1–8, intro cols 9–12. Name: h3 at weight 700. Summary: body 16/24: "2+ years across B2B SaaS. Strong focus on complex systems, scale and end‑to‑end ownership."
- Top-right column: name (Geist 800), "Product Designer", then one short summary sentence. No icons.
- Hand-sketched figure (girl, top-down, seated with laptop, papers, tube, bowl), centred low. Ink line plus flat blue/orange accents. Until the real art exists, use the SVG placeholder from the prototype.
- Large tinted numeral ("01") at about 14% opacity behind, right side.
- Peek of the first case study card at the bottom, so people know to scroll.
- Persistent "Open to work / Resume" pill.

## Case study cards (Projects)
- Layout (2026-11-11): the section is a `.container`; each card runs the full container (on the page grid), padding `--card-pad` on all four sides, radius `--r-sm` (open top-left under the tab), `--shadow-card`. All four cards share one height: the tallest card's content (no fixed card shape). From 1200 the shot stretches to fill its card (small crop from the right); tablet shows it uncropped at the top of its column. Inside, a grid of `--cols`: phones stacked; 768 text 3 / media 5 of 8; 1200+ text 5 / media 7 of 12. Card content sits on this inner grid, `--card-pad` in from the page columns.
- Type: eyebrow hand-md (outlined handwriting); title h2 700, `text-wrap: pretty` so lines run the full width (no balancing, no two-line reserve); labels small 600; body body in `--text-muted`; key figures 700 in the body colour (no indigo). Dividers `--divider`. Tab "01" and counter "01 / 04": caption, Geist 500, tabular-nums; the counter sits in its own card's tab row, right edge.
- Covered card (cs2.svg): `--dim-overlay` over the paper, content at `--dim-text-opacity`. Paper grain on its own layer at 0.25.
- Cream card with a folder-style tab ("Project 01"). Three columns: Project, Role, Outcome.
- Each card has a small interactive demo that shows its own result when scrolled into view and replays on tap:
  - Dashboard redesign: counter 6 → 3 clicks.
  - Accessibility: bar to 85%.
  - Chatbot: count to 40%.
- Map real case studies from the Framer portfolio. Keep the demos as the pattern. Case study pages stay on Framer for now; cards link out.

## Origami and motion
- **Intro (about 3s, skippable, once per session):** on cream, a gold square folds into a crane following the real crane sequence (triangle, small triangle, square base, kite, petal fold, narrowed, neck/tail/head). Each fold is a flap turning on its crease; faces catch light mid-turn and cast a soft shadow. No numbers, arrows or text. Then the cream sheet shrinks away in a circle and the paper crane flies onto the origami crane in the hero art and becomes it (crossfade to the photo's crane layer).
- **Companion shapes:** each shape (parrot, fox) follows its own real folding sequence when the companion changes into it.
- **Skip:** any tap, scroll, key press or wheel finishes it immediately. Set `sessionStorage.seen`; repeat visits skip the intro.
- **Companion:** the parrot sits on the active section. When the active case study changes it folds itself flat, then folds up as the next shape (parrot, crane, fox, original critter). About 1.6s total.
- **Play:** tap = refold into the next shape. Drag = carry it (tilts with movement). Release = it hops back to its perch.
- **Implementation:** inline SVG polygons, animated in `requestAnimationFrame` (see prototype `run()` / `fold()`). Transform and opacity only. No video, no Lottie.
- **Reduced motion:** show final shapes with no folding; companion static.
- **End section, "Try a fold":** a click on the green paper removes the handwriting and starts a guided crab (end/crab.ts, end/CrabFold.tsx, on the intro's fold engine). No words: the part to fold next is outlined in dashed ink and pulses; clicking it plays that fold, a click elsewhere nudges the paper. Eight steps: collapse, two claws, turn over, bottom point up, two legs, turn over. Keyboard: Enter / Space folds; reduced motion lands each fold at once. A round button folds a fresh sheet.
- Do not use Pokemon or any other third-party characters. The "critter" is original.

## Performance budget
- Hero text and nav visible and usable within about 1s on a mid-range phone.
- Hero illustration as sized WebP or optimised SVG, preloaded, with width/height set.
- Everything below the fold lazy-loaded.
- Lighthouse mobile performance 90 or above.
- No WebGL, no heavy libraries. Ask before adding any dependency.

## Accessibility
- Cream on red only for body text. Visible focus rings. All interactions reachable by keyboard.
- Companion is decorative (`aria-hidden`) but its tap/drag must never block content.
- Respect `prefers-reduced-motion`.

## Avoid
- Template-looking gradients, glassmorphism, stock icons.
- Motion that delays content. Nothing waits for the origami.
- Copying other designers' signatures (taped notes, grid textures, stamps, mascots).
- More than two font families.

## AI Tinkering (built, step 4)
- Cards are the art cut from `ai.svg` (public/ai/card-N.svg), text drawn as shapes, so no extra font loads. Inside these cards only, the art keeps its own colours: the one-liner in grey #4E4E4E straight on the cream (re-exported 2026-11-11; it used to be indigo on a lavender pill) and the name pill in #FEFBEB. Not tokens; do not reuse elsewhere.
- Layout (2026-11-11): the section is a `.container`; from 768 one straight row of upright cards on three equal columns with the grid gutter (on 12 columns exactly 1–4, 5–8, 9–12; 24px gutters at 1440); phones stack them full width, 48px apart. Shadow: `--shadow-card` on a box behind each card (also fills the 8px gap between its panels); paper grain at 0.25. Motion: from a centred stack, one by one, scrubbed by scroll; each swings through -11 / -3 / +5 degrees mid-flight and lands at 0. Hover / focus / tap: lift 8px, deeper shadow, 200ms. Phones: vertical stack, same swing.

## About (2026-11-11)
- Heading: "Shaped by industrial design, grounded in the act of creating", all in Geist, h2 700, left-aligned to the container (`text-wrap: balance`).
- Tiles: each one element (About.tsx face): cream with grain at 0.25, `--r-md`, `--shadow-card`, `overflow: hidden`, `--space-3` (12) padding on all sides and 8 from photo to caption, as in Bhasha's card; no notches. The photo on `--ink` with `--r-sm`, filling the space above a caption chip (pill on `--back`) holding the word in Bhasha's handwriting: Figma Hand outlines cut from font2.svg (public/about/hand/*.svg), one shared box and baseline, 20px tall (hand-sm line height), filled with `--text-on-cream`. Paper sculpture is a cut-out on transparency: it fills its frame like the others, straight on the tile's cream (no ink), as in paper.svg.
- Photos: extracted from Bhasha's card SVGs as they frame them (paper turned 90°, gourd lamp cropped to its left photo): public/about/photos/*.webp, through next/image. The old `*-v4.webp` exports are unused.
- Grid: desktop 6 / 3 / 3 of 12 (24px gutters at 1440), tablet 4 / 2 / 2 of 8, phones the wide tile on top and the tall pair (2 + 2) under it. All tiles in a row share one height (the tall tiles' 358 × 521 shape).
- Motion unchanged: the fan from a stack into the row, the flip every few seconds and on tap, hover/focus lift; reduced motion lands them without the fan and swaps without turning.

## End (2026-11-11)
- On `.container`. From 768 the paper square is centred on the grid: 4 of 8 columns (tablet), 6 of 12 (desktop, 620 at 1440), never taller than 85svh. Phones: full width, then sign-off, then links.
- Sign-off on the container's left edge, links ending on its right edge, one row along the bottom from 768. Where the title meets the paper, the text sits on top (cream on green ≈ 4.1:1, large text).
- Title h2 700 (balanced); line and links body 16/24 (links 600). Spacing tokens; paper shadow `--shadow-card`.
- "Try a fold?": Bhasha's outline with the question mark moved in next to "fold" (no space), along the line's slant. Cream on the green token 4.63:1.
