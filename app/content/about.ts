// About tiles. Each tile is one element (About.tsx): the photo on --ink, then a caption chip in the
// hand font. The photos come from Bhasha's card SVGs (paper.svg, print.svg, ...), extracted as they
// are framed there: public/about/photos/*.webp, served through next/image. Every tile of a shape is
// the same size, so a flip leaves no gap. `name` is the caption.

export type Shape = "wide" | "tall";

export type Craft = {
  name: string;
  src: string;
  /** Photo size in px. */
  w: number;
  h: number;
  shape: Shape;
  /** Show the whole photo on the ink (it has a transparent background) instead of filling the tile. */
  whole?: boolean;
};

const charcoal: Craft = { name: "Charcoal sketching", src: "/about/photos/charcoal.webp", w: 1181, h: 1600, shape: "tall" };
const gourd: Craft = { name: "Gourd lamp", src: "/about/photos/gourd-lamp.webp", w: 774, h: 1054, shape: "tall" };
const print: Craft = { name: "Print", src: "/about/photos/print.webp", w: 1800, h: 1013, shape: "wide" };
const clock: Craft = { name: "Clock making", src: "/about/photos/clock.webp", w: 1367, h: 1800, shape: "tall" };
const paper: Craft = { name: "Paper sculpture", src: "/about/photos/paper.webp", w: 1800, h: 1385, shape: "wide", whole: true };

/** All five, in the order a slot cycles through its shape's cards. The first three (paper sculpture,
 *  gourd lamp, charcoal) are what a first visit sees. The wide slot alternates paper sculpture and
 *  print; the two tall slots share gourd lamp, charcoal and clock. */
export const crafts: Craft[] = [paper, gourd, charcoal, print, clock];

export type Slot = {
  shape: Shape;
  /** The card it shows first (index into crafts). */
  first: number;
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
  /** The same swing in the phone layout. */
  tilt: number;
};

// Layout is the grid (About.module.css): desktop 6 / 3 / 3 of 12 columns, tablet 4 / 2 / 2 of 8,
// phones the wide tile on top and the tall pair (2 + 2 of 4) under it.
export const slots: Slot[] = [
  { shape: "wide", first: 0, swing: -11, tilt: -4 },
  { shape: "tall", first: 1, swing: -3, tilt: 3 },
  { shape: "tall", first: 2, swing: 5, tilt: -3 },
];

/** The line above the tiles; `hand` is set in the hand font. */
export const aboutLine = { lead: "Shaped by industrial design, grounded in the", hand: "act of creating" };
