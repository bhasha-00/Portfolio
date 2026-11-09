# Art direction: Bhasha Maheshwari portfolio

Product / UX/UI designer, enterprise fintech. Audience: recruiters who give it about 10 seconds.
Feel: a precise, warm paper object. Bold red, hand-sketched, with one origami companion. Personality comes from illustration and motion; type stays quiet and confident.

## Brief (approved)
- **Bar:** Single-page portfolio, 4 tabs: Home, Projects, AI Tinkering, About. Flat red hero with a hand-sketched figure.
- **Reference:** `reference/lofi-v4.html` (motion + layout prototype), result-led hero (Albin Sigi), tabbed case study cards.
- **Limits:** tokens below; Next.js (or React) on Vercel; mobile-first; hero usable in about 1s; no WebGL on first paint; respect reduced-motion; no texture; two font families only.
- **Check:** screenshots at 390px and 1440px vs the prototype, Lighthouse mobile run, a 10-second recruiter scan.

## Tokens
```css
:root{
  --red:#A82A1E;      /* hero + page background */
  --cream:#F3E9DA;    /* text on red, cards, nav pill */
  --ink:#2A1410;      /* text on cream */
  --gold:#E8B04A;     /* paper, accents, large/decorative only */
  --green:#2E7D6B;    /* accent */
  --vermilion:#D9432F;/* accent */
  --back:#FFF7E8;     /* paper back side in origami folds; white rabbit paper */
  --lime:#C8D52E;     /* parrot paper only (added 2026-11-10 at Bhasha's request) */
}
```
- Cream on red is about 5.8:1 (passes AA). Gold on red is about 3.6:1: use for large or decorative elements only, never body text.
- **Texture: none.** Flat colour. (Revisit only if the hero feels heavy once built.)

## Type
- **Geist** for headings, body and nav. **Geist Mono** only for small labels and chips (caps, wide tracking), e.g. "PROJECT 01 / ROLE / OUTCOME".
- Nav: Geist 500, normal case.
- Headings: weight 700-800, letter-spacing about -0.03em, line-height about 1.0. Name: `clamp(64px, 13vw, 180px)`.
- Body: 400, at least 16px on mobile.
- Load with `next/font/google`, Latin subset, `display: swap`, preload the heading weight. No other families.
- Optional (only if the hero looks too plain): one serif accent word. Test before committing.

## Home (hero)
- Cream pill nav, top centre: Home, Projects, AI Tinkering, About.
- Headline large, top-left: **"Translating business goals and user needs into interfaces that perform."**
- Top-right column: name (Geist 800), "Product Designer", then one short summary sentence. No icons.
- Hand-sketched figure (girl, top-down, seated with laptop, papers, tube, bowl), centred low. Ink line plus flat blue/orange accents. Until the real art exists, use the SVG placeholder from the prototype.
- Large tinted numeral ("01") at about 14% opacity behind, right side.
- Peek of the first case study card at the bottom, so people know to scroll.
- Persistent "Open to work / Resume" pill.

## Case study cards (Projects)
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
- Cards are the art cut from `ai.svg` (public/ai/card-N.svg), text drawn as shapes, so no extra font loads. Inside these cards only, the art keeps its own colours: indigo #4F46E5 on lavender #EDEDF8 (one-liner) and #FEFBEB (name pill). Not tokens; do not reuse elsewhere.
- Layout: one straight row of upright cards (29.3% of the stage each, reference 1522 x 768). Motion: from a centred stack, one by one, scrubbed by scroll; each swings through -11 / -3 / +5 degrees mid-flight and lands at 0. Hover / focus / tap: lift 8px, deeper shadow, 200ms. Phones: vertical stack, same swing.
