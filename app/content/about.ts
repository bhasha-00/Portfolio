// About cards. Each card is one element (About.tsx): the photo, then a caption chip in the hand font.
// The photos come from Bhasha's card SVGs (paper.svg, print.svg, ...), extracted as they are framed
// there: public/about/photos/*.webp, served through next/image. Every card is the same tall shape
// (About.svg), so any piece can show in any of the three places and a flip leaves no gap.

export type Craft = {
  name: string;
  src: string;
  /** Photo size in px. */
  w: number;
  h: number;
  /** The caption in Bhasha's hand (Figma Hand outline, from font2.svg): file and width in its units.
   *  Every word shares one box height (HAND_H) and one baseline, so they line up in their chips. */
  hand: { src: string; w: number };
  /** Where a wide photo is cropped into the tall card (object-position); centred if not given. */
  focus?: string;
  /** A cut-out on a transparent background: shown whole on the card's cream instead of on ink. */
  cutout?: boolean;
};

const charcoal: Craft = { name: "Charcoal sketching", hand: { src: "/about/hand/charcoal-sketching.svg", w: 129.2 }, src: "/about/photos/charcoal.webp", w: 1181, h: 1600 };
const gourd: Craft = { name: "Gourd lamp", hand: { src: "/about/hand/gourd-lamp.svg", w: 75.05 }, src: "/about/photos/gourd-lamp.webp", w: 774, h: 1054 };
// About.svg crops the print to the birds on the left of centre.
const print: Craft = { name: "Print", hand: { src: "/about/hand/print.svg", w: 35 }, src: "/about/photos/print.webp", w: 1800, h: 1013, focus: "36% 50%" };
const clock: Craft = { name: "Clock making", hand: { src: "/about/hand/clock-making.svg", w: 90.85 }, src: "/about/photos/clock.webp", w: 1367, h: 1800 };
const paper: Craft = { name: "Paper sculpture", hand: { src: "/about/hand/paper-sculpture.svg", w: 102.15 }, src: "/about/photos/paper.webp", w: 1800, h: 1385, cutout: true };

/** All five, in the order a card cycles through them when it flips. */
export const crafts: Craft[] = [gourd, print, charcoal, paper, clock];

export type Slot = {
  /** The piece it shows first (index into crafts). */
  first: number;
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
  /** The same swing in the phone layout. */
  tilt: number;
};

// The ring (useSpread): the first slot starts in front, the second on the left, the third on the
// right. About.svg: gourd lamp in front, print on the left, charcoal on the right.
export const slots: Slot[] = [
  { first: 0, swing: -3, tilt: 3 },
  { first: 1, swing: -11, tilt: -4 },
  { first: 2, swing: 5, tilt: -3 },
];

/** Height of every handwriting box, in its own units (11.7 above the baseline, 3.9 below). */
export const HAND_H = 15.6;

/** The line above the cards, in Geist (h2). */
export const aboutLine = "Shaped by industrial design, grounded in the act of building.";

/** Desktop only: the eyebrow above the line, the paragraph and the tag under it. */
export const aboutHead = {
  eyebrow: "Before pixels",
  text: "I trained in product design, where I learned to think with my hands before my screen. Paper, light and cut-outs taught me how things hold together. Outside work I still build, now with AI as the workshop.",
  tag: "B.Des, Product Design",
};
