---
name: Bhasha Maheshwari, Portfolio
description: A product designer's portfolio as a folded sheet of paper on a red desk.
colors:
  desk-red: "#A82A1E"
  sheet-cream: "#F8F4E9"
  ink-brown: "#2A1410"
  crane-gold: "#E8B04A"
  paper-green: "#2E7D6B"
  vermilion: "#D9432F"
  paper-back: "#FFF7E8"
  parrot-lime: "#C8D52E"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "52px"
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "44px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "32px"
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.02em"
  hand:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  sm: "8px"
  art: "12px"
  md: "16px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
  "9": "96px"
components:
  nav-pill:
    backgroundColor: "{colors.sheet-cream}"
    textColor: "{colors.ink-brown}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px"
  nav-tab-active:
    backgroundColor: "{colors.desk-red}"
    textColor: "{colors.sheet-cream}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  case-card:
    backgroundColor: "{colors.sheet-cream}"
    textColor: "{colors.ink-brown}"
    rounded: "{rounded.md}"
    padding: "32px"
  craft-card:
    backgroundColor: "{colors.sheet-cream}"
    textColor: "{colors.ink-brown}"
    rounded: "{rounded.md}"
    padding: "16px"
  tag:
    textColor: "{colors.sheet-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  play-button:
    backgroundColor: "{colors.sheet-cream}"
    textColor: "{colors.desk-red}"
    rounded: "{rounded.pill}"
    size: "96px"
---

# Design System: Bhasha Maheshwari, Portfolio

## Overview

**Creative North Star: "The Folded Sheet"**

Origami is the idea behind everything on the site: one flat sheet, a few precise folds, and a shape with character at the end. The page is a red desk. On it lie cream sheets (the nav, the cards, the case study pages) and one folded companion, a gold crane, that travels with the reader. Nothing is decorated for its own sake; every surface is paper you could pick up.

The system is tactile and calm. Sheets rest on the desk with one soft shadow and rise a little when touched. Type stays quiet and confident so that personality can come from the hand: Bhasha's handwriting on labels, her own illustrations, the crane's flight. Precision and warmth sit side by side, the way a designer trained in making things by hand works on a screen.

**Key Characteristics:**
- Flat red ground, cream sheets, brown ink. Three colours do almost all the work.
- One typeface for reading (Geist) and one for the hand (Caveat).
- A single paper shadow; depth is a sheet resting on a desk, never a glow.
- Motion is folding, flying and lifting: transform and opacity only.
- Everything shown as artwork is Bhasha's own, at the quality she exported it.

## Colors

A warm, saturated red ground with cream paper and brown ink; gold and a few paper colours appear only as folded objects.

### Primary
- **Desk Red** (#A82A1E): the page and hero ground on the home page, the active nav tab, hand-lettered eyebrows on cream, the play button's triangle. It is the room everything sits in.

### Secondary
- **Crane Gold** (#E8B04A): the origami crane and the square it is folded from. Decorative and large only; never text.

### Tertiary
- **Paper Green** (#2E7D6B), **Vermilion** (#D9432F), **Parrot Lime** (#C8D52E): other sheets of origami paper (the square, a reserved accent, the parrot). Used on folded shapes only.

### Neutral
- **Sheet Cream** (#F8F4E9): cards, the nav pill, the case study page, and all text on red (6.3:1).
- **Ink Brown** (#2A1410): text on cream. Body text is the same ink mixed 72% into cream, for a quieter read (about 6.6:1).
- **Paper Back** (#FFF7E8): the reverse side of folded paper, landing puffs, caption chips on photo cards.
- Dividers and tints are ink at 8 to 12% over cream; a faint cream at 12% tints shapes on the red.

### Named Rules
**The Three Colours Rule.** Red, cream and ink carry every layout. Gold, green, vermilion and lime exist only as folded paper.

**The Borrowed Palette Rule.** Case study artifacts keep the colours of the products they show (the `--art-*` tokens). Those colours never appear in the site's own interface.

## Typography

**Display and Body Font:** Geist (with ui-sans-serif, system-ui)
**Hand Font:** Caveat (with Segoe Print), plus Bhasha's own handwriting as outlined artwork

**Character:** Geist is set plainly and tightly, heavy at the top of the scale and regular for reading. Caveat and the handwritten outlines are the voice in the margin: labels, eyebrows and chips.

### Hierarchy
- **Display** (800, 32px on phones to 48px on desktop, line height 36 to 52px, -0.03em): the hero headline only.
- **Headline** (700, 28px to 40px, -0.02em): card titles, section titles and case study headings.
- **Title** (700, 24px to 28px): the name in the hero, sub-heads.
- **Lead** (600, 20px / 28px): callout titles and column heads.
- **Body** (400, 16px / 24px): all running text, including the summary lines under section headers. Running text in case studies stays within the reading column.
- **Label** (500 to 600, 14px / 20px): nav tabs, card labels, tags, counts.
- **Caption** (500, 12px / 16px, 0.02em): counters and small cues.
- **Hand** (Caveat 16, 20 and 24px): eyebrows above titles, chips, the role line.

The scale is a minor third from 16px, snapped to whole pixels, with every line height on a 4px grid.

### Named Rules
**The Two Voices Rule.** Geist says the facts; the hand says who is speaking. A third family never appears.

**The Fill the Line Rule.** Headings wrap only when they reach the edge of their column. They are never balanced into short, even lines.

## Layout

A centred container up to 1280px, with margins of 20px on phones, 40px on tablets and 80px on desktop, and a grid of 4, 8 and 12 columns (16px gutters, 24px from tablet). Spacing comes from one 4px-based scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

The home page is one scroll in four parts. Case study cards fill the screen and stack: each one sticks below the nav while the next slides over it. On desktop, AI Tinkering is a header with three equal cards in a row, and About is text beside three overlapping, tilted cards. On tablets both sections pin and fan their cards out as the page scrolls; on phones the cards are a spread with one in front and two peeking in from the edges.

Case study pages are a single reading column: all columns on phones and tablets, columns 3 to 10 of 12 on desktop, with 24px between blocks and 64px between sections.

## Elevation & Depth

One soft paper shadow. Every sheet resting on the red desk carries the same shadow; nothing glows and nothing floats higher than a sheet lifted by a finger.

### Shadow Vocabulary
- **Paper shadow** (`0 8px 24px` of ink at 20%): the nav pill, case study cards, AI and About cards.
- **Lifted** (`0 12px 28px` of ink at 16%, faded in): an AI card on hover, together with an 8px rise.
- **Cut-out shadows**: the crane and other folded shapes cast shadows that follow their own outline. These are the only blurred shapes in the system.

### Named Rules
**The Resting Sheet Rule.** A shadow means "this is paper on the desk". It is never used to rank importance, and a card covered by the next card loses its shadow so two never stack.

## Shapes

Soft, even corners on every sheet: 16px on cards and frames, 12px on phones, 8px for anything set inside a card (images, table frames), and full pills for the nav, tags and chips. No borders on the site's own surfaces; edges come from cream meeting red. Cards may tilt a few degrees, like prints laid on a desk. Folded shapes are flat polygons with no outline.

## Components

Tactile and calm: paper you can lift, with a soft shadow and a small rise on hover.

### Navigation
- **Style:** a cream pill fixed at the top centre, 4px padding, paper shadow, with a faint paper grain.
- **Tabs:** Geist 500 at 14px; inactive tabs are ink at 68% opacity, the active tab is a red pill with cream text. Tabs scale to 97% while pressed.
- **Case study bar:** the same pill with a back link, a hairline rule and section tabs; the current section is red text rather than a filled pill.

### Cards / Containers
- **Case study card:** cream with paper grain, 16px corners, 32px padding on all sides, paper shadow. A handwritten label, a headline, three short blocks (Problem, What I did, Outcome) and the project image at 8px corners. The whole card is one link.
- **AI card:** cream, 16px corners, 16px padding around a media panel, a handwritten name pill and one line of body text. Rises 8px on hover.
- **About card:** cream, 16px corners, 16px padding around a photo, a handwritten caption chip. Flips over to show another piece.
- **Covered state:** a card under the next one dims with an 8% ink veil and its text falls to 32% opacity.

### Chips
- **Tag:** a pill of cream at 12% on the red, cream label text at 14px, 8px by 16px padding.
- **Caption chip:** a Paper Back pill holding one handwritten word.

### Buttons
- **Play:** a cream disc (64 to 96px) with a red triangle, on a 16% ink veil over the first frame of a prototype. Grows to 106% on hover, 96% while pressed.
- There are no other buttons; links are cards, tabs or plain underlined text.

### The Crane
The companion. A gold origami crane folds itself in the intro, lands in the hero, then perches on the case study cards and the AI cards as the reader scrolls. Tapping it refolds it into a rabbit or a parrot. It never blocks content and stays still under reduced motion.

## Do's and Don'ts

### Do:
- **Do** take every colour, size, space and radius from `app/tokens.css`.
- **Do** keep text at AA contrast: cream on red, ink on cream.
- **Do** animate transform and opacity only, and honour `prefers-reduced-motion`.
- **Do** show supplied artwork exactly as exported: lossless, never resized.
- **Do** give every sheet the one paper shadow and 16px corners (12px on phones).

### Don't:
- **Don't** use gradients, glows, glass effects or texture beyond the paper grain.
- **Don't** add a third font family, or indigo anywhere in the interface.
- **Don't** use gold, green, vermilion or lime for text or interface surfaces.
- **Don't** let animation delay content; the intro is skippable by any tap, scroll or key.
- **Don't** use third-party characters or artwork.
