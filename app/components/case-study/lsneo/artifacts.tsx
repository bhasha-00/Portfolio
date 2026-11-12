import { Annotated, Lines, Note, annotated as s } from "./Annotated";

// LSNeo Lite's annotated artifacts. Positions are Bhasha's (her Figma frames, px); the text is hers,
// set in Geist (notes) and Caveat (hand-lettered headings). Line breaks are where Geist wraps inside
// her cards (measured in the browser), so nothing spills.

const DIR = "/case-studies/lsneo-lite";

type AnimProps = { name: string; w: number; h: number; alt: string; frame?: boolean; className?: string };

/** One of her GIFs, stored as lossless animated WebP (every frame kept, see the build script). Reduced
 *  motion gets the first frame, still. */
function Anim({ name, w, h, alt, frame = true, className }: AnimProps) {
  return (
    <figure className={frame ? `${s.fig} ${s.frame}` : s.fig} style={{ aspectRatio: `${w} / ${h}` }}>
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={`${DIR}/${name}-still.webp`} />
        {/* eslint-disable-next-line @next/next/no-img-element -- an animation, served exactly as stored */}
        <img className={`${s.layer} ${className ?? ""}`} src={`${DIR}/${name}.webp`} width={w} height={h} loading="lazy" decoding="async" alt={alt} />
      </picture>
    </figure>
  );
}

/** Research › What I saw: her walkthrough of the existing New Title screen (error_walkthrough_v4.gif). */
export const Walkthrough = () => (
  <Anim name="walkthrough-v2" w={1588} h={796} alt="Walkthrough of the existing Direct Cataloguing screen in LS Neo, with the friction points marked one by one." />
);

/** Final design › Walkthrough: the 6 changes, before and after (before_after_v5.gif). Her two panels sit
 *  on the page as in Versions; the clip keeps the GIF's white corners off the cream. */
export const SixChanges = () => (
  <>
    <Anim
      name="six-changes-v1"
      w={1800}
      h={662}
      frame={false}
      className={s.twin}
      alt="The existing New Title screen beside the redesigned one, with the six changes that answer each friction point."
    />
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <clipPath id="lsneo-twin" clipPathUnits="objectBoundingBox">
        <rect x={0} y={0} width={884 / 1800} height={1} rx={72 / 1800} ry={72 / 662} />
        <rect x={916 / 1800} y={0} width={884 / 1800} height={1} rx={72 / 1800} ry={72 / 662} />
      </clipPath>
    </svg>
  </>
);

/** Handoff: the ISBN field with its server choice, state by state (isbn_states.gif). */
export const HandoffIsbn = () => (
  <Anim name="handoff-isbn-v1" w={1128} h={251} alt="The ISBN field with a server choice, shown in each of its states." />
);

/** Edge cases › Onboarding for new users (1onboarding.png, 4068 x 2596 inside her frame). */
export const Onboarding = () => (
  <figure className={`${s.fig} ${s.frame}`} style={{ aspectRatio: "4068 / 2596" }}>
    {/* eslint-disable-next-line @next/next/no-img-element -- served exactly as stored */}
    <img
      className={s.layer}
      src={`${DIR}/onboarding-v2.webp`}
      width={4068}
      height={2596}
      loading="lazy"
      decoding="async"
      alt="Onboarding for new users: set up the catalogue first, then add titles."
    />
  </figure>
);

/** Edge cases › Duplicate ISBN: the guided choice. 1duplicate.svg */
export function Duplicate() {
  return (
    <Annotated
      src={`${DIR}/duplicate-v2.svg`}
      w={1922}
      h={901}
      alt="The New Title screen with a duplicate ISBN: matching titles listed on the right, and the next step held until one is chosen."
      over={
        <>
          <Note x={54} y={259} lines={["Caught at the ISBN : Matches", "appear as soon as the ISBN is", "entered, with a hint to pick one", "on the right"]} />
          <Note x={54} y={703} lines={["Progress waits for a decision :", "Add and Continue to Source", "stay disabled until the", "duplicate is resolved."]} />
          <Note x={1646} y={135} lines={["Matches side by side : Title,", "ISBN, year, and edition show", "whether it's the same book or", "a new edition"]} />
          <Note x={1646} y={680} lines={["Guided next step : Select a", "title, then add it as a new", "edition, update it, or copy it"]} />
        </>
      }
    />
  );
}

/** One of her tilted "why it didn't survive" notes: local px inside the card, which `at` turns. */
function Verdict({ at, head, headX, lines }: { at: string; head: string; headX: number; lines: string[] }) {
  return (
    <g transform={at}>
      <text className={s.hand} x={headX} y={37}>
        {head}
      </text>
      <Lines x={22} y={85} step={24} lines={lines} className={`${s.body} ${s.blue}`} />
    </g>
  );
}

/** Design explorations: V1 and V2, and why each was dropped. 1versions.svg */
export function Versions() {
  return (
    <Annotated
      src={`${DIR}/versions-v2.svg`}
      frame={false}
      w={1808}
      h={665}
      alt="Two explorations of LS Neo lite: V1, a full-page title table, and V2, a New Title form that put approval and ordering inside each title."
      over={
        <>
          <Verdict
            at="translate(496.363 333) rotate(11.7515)"
            head="Why v1 didn't survive :"
            headX={58}
            lines={["LS Neo lite runs on two panels,", "work left, records right. A full-page", "table broke that pattern."]}
          />
          <Verdict
            at="translate(1408 226.352) rotate(-9.31754)"
            head="Why v2 didn't survive :"
            headX={130}
            lines={["Approval, ordering, and label", "generation happen in bulk, once", "enough titles are logged. Inside a", "per-title flow, they made batch", "work confusing."]}
          />
        </>
      }
    />
  );
}

/** Edge cases › Search by title: the screen as exported (no notes on it). 1searchbytitle.svg */
export function SearchByTitle() {
  return (
    <Annotated
      src={`${DIR}/search-by-title-v2.svg`}
      w={1030}
      h={661}
      alt="Searching by title when a book has no ISBN: typing India lists matching titles with author, ISBN, year and edition."
    />
  );
}

// ---------- Existing & New IA (1flow.svg) ----------
// Her diagram was a picture of its own; it is drawn here instead, in that picture's half-size space
// (1560 wide), which `DIAGRAM` places where the picture sat. Box and line colours are hers.

const DIAGRAM = "translate(260.67 29.79) scale(0.6305)";
const LINE_SOFT = "#BFE0F3"; // tokens-allow: her diagram colour (1flow.svg)
const LINE_DARK = "#2B6EAF"; // tokens-allow: her diagram colour (1flow.svg)
const LINE_OLD = "#9CA0C4"; // tokens-allow: her diagram colour (1flow.svg)

type BoxProps = { x: number; y: number; w: number; h: number; title: string; sub?: string; fill?: string; stroke: string; dash?: boolean };

function Box({ x, y, w, h, title, sub, fill = "#FFFFFF", stroke, dash }: BoxProps) { // tokens-allow: her diagram colour (1flow.svg)
  const cx = x + w / 2, cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash ? "7 6" : undefined} />
      <text className={s.title} x={cx} y={sub ? cy - 2 : cy + 7}>
        {title}
      </text>
      {sub && (
        <text className={`${s.sub} ${s.mid}`} x={cx} y={cy + 22}>
          {sub}
        </text>
      )}
    </g>
  );
}

const line = (x1: number, x2: number, y: number, c: string) => <line x1={x1} x2={x2} y1={y} y2={y} stroke={c} strokeWidth={2} />;

function FlowDiagram() {
  const old = "#CDD0E6"; // tokens-allow: her diagram colour (1flow.svg)
  const blue = "#BFE0F3"; // tokens-allow: her diagram colour (1flow.svg)
  const lit = { fill: "#DDEFFC", stroke: "#B5DAF2" }; // tokens-allow: her diagram colour (1flow.svg)
  const rows = [482, 602, 722]; // tops of the three branches; centres at +38
  return (
    <>
      <g transform={DIAGRAM}>
        {/* Existing */}
        <rect x={40} y={40} width={1480} height={320} rx={16} fill="#FFFFFF" stroke="#D5D6EA" strokeWidth={2} />
        <text className={s.head} x={72} y={90}>
          Existing: many doors, hidden work
        </text>
        <Box x={72} y={118} w={300} h={88} title="Catalogue" sub="Add or update titles" stroke={old} />
        <Box x={432} y={118} w={300} h={88} title="Pick a route" sub="7 ways in" stroke={old} />
        <Box x={792} y={118} w={300} h={88} title="Title details" sub="Long scrolling form" stroke={old} />
        <Box x={1152} y={118} w={300} h={88} title="Holdings" sub="After a cover stage" stroke={old} />
        {line(378, 426, 162, LINE_OLD)}
        {line(738, 786, 162, LINE_OLD)}
        {line(1098, 1146, 162, LINE_OLD)}
        <Box x={72} y={240} w={300} h={88} title="Acquisition module" sub="Separate and mostly unused" stroke="#9C9DC4" dash />
        <Box x={432} y={240} w={300} h={88} title="Label generation" sub="Hidden inside Bulk Processing" stroke="#9C9DC4" dash />
        <text className={s.sub} x={792} y={291}>
          Dashed boxes sit outside the title flow
        </text>

        {/* Revised */}
        <rect x={40} y={400} width={1480} height={420} rx={16} fill="#F3F9FE" stroke="#A9D0EA" strokeWidth={2} />
        <text className={`${s.head} ${s.blue}`} x={72} y={448}>
          Revised: one flow, work visible
        </text>
        <Box x={72} y={602} w={140} h={76} title="Toolbar" stroke={blue} />
        <Box x={248} y={602} w={160} h={76} title="Book details" sub="Scan or type ISBN" {...lit} />
        <Box x={444} y={602} w={140} h={76} title="Source" sub="How it arrived" {...lit} />
        {line(218, 242, 640, LINE_SOFT)}
        {line(414, 438, 640, LINE_SOFT)}
        {line(590, 634, 640, LINE_DARK)}
        <line x1={612} x2={612} y1={520} y2={760} stroke={LINE_SOFT} strokeWidth={2} />
        {line(612, 634, 520, LINE_SOFT)}
        {line(612, 634, 760, LINE_SOFT)}

        <Box x={640} y={rows[0]} w={180} h={76} title="On approval" sub="Needs sign-off" stroke={blue} />
        <Box x={640} y={rows[1]} w={180} h={76} title="To be entered" sub="Goes to Procure" stroke={blue} />
        <Box x={640} y={rows[2]} w={180} h={76} title="Other sources" sub="Direct to copies" stroke={blue} />

        <Box x={856} y={rows[0]} w={130} h={76} title="Approval" stroke={blue} />
        <Box x={1022} y={rows[0]} w={130} h={76} title="Order" stroke={blue} />
        <Box x={1188} y={rows[0]} w={130} h={76} title="Copies" stroke={blue} />
        <Box x={1354} y={rows[0]} w={130} h={76} title="Generate" stroke={blue} />
        {line(826, 850, 520, LINE_DARK)}
        {line(992, 1016, 520, LINE_DARK)}
        {line(1158, 1182, 520, LINE_DARK)}
        {line(1324, 1348, 520, LINE_DARK)}

        <Box x={1022} y={rows[1]} w={130} h={76} title="Procure" stroke={blue} />
        <Box x={1188} y={rows[1]} w={130} h={76} title="Copies" stroke={blue} />
        <Box x={1354} y={rows[1]} w={130} h={76} title="Generate" stroke={blue} />
        {line(826, 1016, 640, LINE_SOFT)}
        {line(1158, 1182, 640, LINE_DARK)}
        {line(1324, 1348, 640, LINE_SOFT)}

        <Box x={1188} y={rows[2]} w={130} h={76} title="Copies" stroke={blue} />
        <Box x={1354} y={rows[2]} w={130} h={76} title="Generate" stroke={blue} />
        {line(826, 1182, 760, LINE_SOFT)}
        {line(1324, 1348, 760, LINE_SOFT)}
      </g>
    </>
  );
}

/** Existing & New IA: the old many-door flow against the revised one, with her paper sketch. */
export function Flow() {
  return (
    <Annotated
      src={`${DIR}/flow-v2.svg`}
      w={1274}
      h={608}
      alt="Existing and new information architecture, with Bhasha's paper sketch of the flow."
      under={<FlowDiagram />}
    />
  );
}
