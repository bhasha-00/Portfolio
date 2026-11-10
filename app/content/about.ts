// About cards. The art (cream frame, photo, handwritten caption pill, shadow) is exported from the
// card SVGs as drawn, at 3x (1374px tall): public/about/*.webp. The captions are embedded in the
// SVGs at only 2x, so they soften past that. The caption is drawn into the art, so `name`
// is its text for screen readers and search.

export type Craft = {
  name: string;
  src: string;
  /** Art size in px. */
  w: number;
  h: number;
};

const charcoal: Craft = { name: "Charcoal sketching", src: "/about/charcoal-3x.webp", w: 951, h: 1374 };
const sanjhi: Craft = { name: "Sanjhi, paper cutting craft", src: "/about/sanjhi-3x.webp", w: 2151, h: 1374 };
const gourd: Craft = { name: "Gourd lamp", src: "/about/gourd-lamp-3x.webp", w: 945, h: 1374 };
const print: Craft = { name: "Print design", src: "/about/print-3x.webp", w: 1803, h: 1374 };
const clock: Craft = { name: "Clock designed using sanjhi", src: "/about/clock-3x.webp", w: 945, h: 1374 };
const paper: Craft = { name: "Paper sculpture", src: "/about/paper-3x.webp", w: 1650, h: 1374 };

/** Where a card lands in the collage: centre (x, y) in stage units, and its layer (higher = in front). */
export type Spot = { x: number; y: number; z: number };

/** The collage stages, in units. Every card is the same height in a stage; widths follow the art. */
export const DESK = { w: 1200, h: 700, cardH: 340 };
export const PHONE = { w: 360, h: 790, cardH: 200 };

export type Placed = Craft & {
  desk: Spot;
  phone: Spot;
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
};

// An overlapping, upright cluster after the stamp reference: wide cards at the back, tall and
// wide alternating so the outline stays ragged. Every card's caption sits bottom-left, so a card
// in front only ever covers the top or right of the cards behind it: all captions stay readable.
// Phones: a zig-zag where each card sits in front of the ones below it. Listed in fan order
// (left to right on desktop).
export const crafts: Placed[] = [
  { ...charcoal, desk: { x: 170, y: 420, z: 1 }, phone: { x: 100, y: 270, z: 5 }, swing: -12 },
  { ...sanjhi, desk: { x: 460, y: 195, z: 2 }, phone: { x: 180, y: 100, z: 6 }, swing: -7 },
  { ...paper, desk: { x: 480, y: 500, z: 5 }, phone: { x: 130, y: 660, z: 1 }, swing: -3 },
  { ...gourd, desk: { x: 830, y: 510, z: 3 }, phone: { x: 255, y: 290, z: 4 }, swing: 4 },
  { ...print, desk: { x: 880, y: 230, z: 4 }, phone: { x: 180, y: 480, z: 3 }, swing: 8 },
  { ...clock, desk: { x: 1030, y: 470, z: 6 }, phone: { x: 285, y: 680, z: 2 }, swing: 12 },
];

export const aboutLine = "From an industrial design background, I have always been curious why things work the way they do";
