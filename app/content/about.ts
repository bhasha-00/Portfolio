// About cards: Bhasha's re-exports with matched sizes and radii (tall 358 × 521, wide 620 × 521),
// rendered from the card SVGs at 3x (1563px tall): public/about/*-v4.webp. The frame keeps
// Bhasha's own shape (16 outside with one square corner; the photo inside 8) and carries the site's paper grain,
// baked in on the cream only (not the photos). The caption is vector: a cream pill and Bhasha's
// outlined Figma Hand text from font2.svg, so it stays sharp. Every card of a shape is the same
// size, so a flip leaves no gap. `name` is the caption's text, for screen readers and search.

export type Shape = "wide" | "tall";

export type Craft = {
  name: string;
  src: string;
  /** Art size in px. */
  w: number;
  h: number;
  shape: Shape;
};

const charcoal: Craft = { name: "Charcoal sketching", src: "/about/charcoal-v4.webp", w: 1080, h: 1563, shape: "tall" };
const gourd: Craft = { name: "Gourd lamp", src: "/about/gourd-lamp-v4.webp", w: 1074, h: 1563, shape: "tall" };
const print: Craft = { name: "Print", src: "/about/print-v4.webp", w: 1860, h: 1563, shape: "wide" };
const clock: Craft = { name: "Clock making", src: "/about/clock-v4.webp", w: 1074, h: 1563, shape: "tall" };
const paper: Craft = { name: "Paper sculpture", src: "/about/paper-v4.webp", w: 1860, h: 1563, shape: "wide" };

/** All five, in the order a slot cycles through its shape's cards. The first three (paper sculpture,
 *  gourd lamp, charcoal) are what a first visit sees. The wide slot alternates paper sculpture and
 *  print; the two tall slots share gourd lamp, charcoal and clock. */
export const crafts: Craft[] = [paper, gourd, charcoal, print, clock];

/** The stages, in units. Desktop: one row (the reference: 930 of 1032 wide). Phones: the wide card
 *  on top, the two tall ones side by side under it. */
export const DESK = { w: 1000, h: 420 };
export const PHONE = { w: 360, h: 568 };

export type Slot = {
  shape: Shape;
  /** The card it shows first (index into crafts). */
  first: number;
  /** Card size and centre in stage units. */
  desk: { x: number; y: number; w: number; h: number };
  phone: { x: number; y: number; w: number; h: number };
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
  /** The same swing in the phone layout. */
  tilt: number;
};

// Desktop row: wide 442 + tall 255 + tall 255, gaps 22, cards 371 tall (620 / 358 × 521 scaled).
// Phones: wide 360 × 302 on top; tall 174 × 253 pair under it, 12 apart.
export const slots: Slot[] = [
  { shape: "wide", first: 0, desk: { x: 223, y: 210, w: 442, h: 371 }, phone: { x: 180, y: 151, w: 360, h: 302 }, swing: -11, tilt: -4 },
  { shape: "tall", first: 1, desk: { x: 593.5, y: 210, w: 255, h: 371 }, phone: { x: 87, y: 441, w: 174, h: 253 }, swing: -3, tilt: 3 },
  { shape: "tall", first: 2, desk: { x: 870.5, y: 210, w: 255, h: 371 }, phone: { x: 273, y: 441, w: 174, h: 253 }, swing: 5, tilt: -3 },
];

export const aboutLine = "Shaped by industrial design, grounded in the act of building";
