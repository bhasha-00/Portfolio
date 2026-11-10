// About cards. The art (cream frame, photo, handwritten caption pill, shadow) is exported from the
// card SVGs as drawn, at 3x (1374px tall): public/about/*.webp. The captions are embedded in the
// SVGs at only 2x, so they soften past that. The caption is drawn into the art, so `name`
// is its text for screen readers and search.

export type Shape = "wide" | "tall";

export type Craft = {
  name: string;
  src: string;
  /** Art size in px. */
  w: number;
  h: number;
  shape: Shape;
};

const charcoal: Craft = { name: "Charcoal sketching", src: "/about/charcoal-3x.webp", w: 951, h: 1374, shape: "tall" };
const sanjhi: Craft = { name: "Sanjhi, paper cutting craft", src: "/about/sanjhi-3x.webp", w: 2151, h: 1374, shape: "wide" };
const gourd: Craft = { name: "Gourd lamp", src: "/about/gourd-lamp-3x.webp", w: 945, h: 1374, shape: "tall" };
const print: Craft = { name: "Print design", src: "/about/print-3x.webp", w: 1803, h: 1374, shape: "wide" };
const clock: Craft = { name: "Clock designed using sanjhi", src: "/about/clock-3x.webp", w: 945, h: 1374, shape: "tall" };
const paper: Craft = { name: "Paper sculpture", src: "/about/paper-3x.webp", w: 1650, h: 1374, shape: "wide" };

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
  /** Box size and centre in stage units. The box fits the widest card of its shape; narrower cards
   *  sit centred in it, so a flip never moves the neighbours. */
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

export const aboutLine = "From an industrial design background, I have always been curious why things work the way they do";
