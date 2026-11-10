// About cards, rebuilt from the card SVGs: the cream frame is CSS; the photo and the handwritten
// caption pill are cut out at 3x (public/about/*-photo.webp, *-caption.webp). Every card in a slot
// is the same size and its photo is cropped to fit (object-fit: cover), so a flip leaves no gap.
// The captions are embedded in the SVGs at only 2x, so they soften past that. `name` is the
// caption's text, for screen readers and search.

export type Shape = "wide" | "tall";

export type Craft = {
  name: string;
  /** The photo (1155px tall) and its width. */
  photo: string;
  pw: number;
  /** The caption pill (99px tall) and its width. */
  caption: string;
  cw: number;
  shape: Shape;
};

const PH = 1155; // photo height, px
const CH = 99; // caption height, px
export { PH, CH };

const charcoal: Craft = { name: "Charcoal sketching", photo: "/about/charcoal-photo.webp", pw: 852, caption: "/about/charcoal-caption.webp", cw: 498, shape: "tall" };
const sanjhi: Craft = { name: "Sanjhi, paper cutting craft", photo: "/about/sanjhi-photo.webp", pw: 2053, caption: "/about/sanjhi-caption.webp", cw: 231, shape: "wide" };
const gourd: Craft = { name: "Gourd lamp", photo: "/about/gourd-lamp-photo.webp", pw: 848, caption: "/about/gourd-lamp-caption.webp", cw: 324, shape: "tall" };
const print: Craft = { name: "Print design", photo: "/about/print-photo.webp", pw: 1707, caption: "/about/print-caption.webp", cw: 339, shape: "wide" };
const clock: Craft = { name: "Clock designed using sanjhi", photo: "/about/clock-photo.webp", pw: 848, caption: "/about/clock-caption.webp", cw: 651, shape: "tall" };
const paper: Craft = { name: "Paper sculpture", photo: "/about/paper-photo.webp", pw: 1552, caption: "/about/paper-caption.webp", cw: 405, shape: "wide" };

/** All six, in the order a slot cycles through its shape's cards. */
export const crafts: Craft[] = [sanjhi, gourd, charcoal, print, clock, paper];

/** The stages, in units. Desktop: one row (the reference: 930 of 1032 wide). Phones: the wide card
 *  on top, the two tall ones side by side under it. */
export const DESK = { w: 1000, h: 420 };
export const PHONE = { w: 360, h: 500 };

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

// Desktop row from the reference: wide 510 + tall 224 + tall 224, gaps 19, cards 326 tall.
export const slots: Slot[] = [
  { shape: "wide", first: 0, desk: { x: 257, y: 210, w: 510, h: 326 }, phone: { x: 180, y: 115, w: 360, h: 230 }, swing: -11, tilt: -4 },
  { shape: "tall", first: 1, desk: { x: 643, y: 210, w: 224, h: 326 }, phone: { x: 87, y: 372, w: 174, h: 252 }, swing: -3, tilt: 3 },
  { shape: "tall", first: 2, desk: { x: 886, y: 210, w: 224, h: 326 }, phone: { x: 273, y: 372, w: 174, h: 252 }, swing: 5, tilt: -3 },
];

export const aboutLine = "Shaped by industrial design, grounded in the act of building";
