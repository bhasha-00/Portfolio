import type { ReactNode } from "react";
import { Annotated, Lines, Note } from "../lsneo/Annotated";
import Tldr, { type TldrCard } from "../lsneo/Tldr";
import tl from "../lsneo/Tldr.module.css";
import VideoArtifact from "../lsneo/VideoArtifact";
import Flip from "./Flip";
import t from "./ds.module.css";

// The Design system case study's artifacts (Bhasha's 2*.svg exports, built by
// scripts/build-ds-artifacts.cjs). Positions are hers, in each Figma frame's px; her outlined text is
// set again in Geist (Caveat for her hand-lettered notes), in her colours. Line breaks are where Geist
// wraps inside her cards (measured in the browser).

const DIR = "/case-studies/design-system";

/** One run of her text at (x, y), the baseline, `size` px in her frame (any size: the type is scaled). */
function T({ x, y, size = 16, className, mid, children }: { x: number; y: number; size?: number; className: string; mid?: boolean; children: ReactNode }) {
  return (
    <text className={`${t.t} ${className}`} transform={`translate(${x} ${y}) scale(${size / 16})`} textAnchor={mid ? "middle" : undefined}>
      {children}
    </text>
  );
}

const shot = (name: string, w: number, h: number, alt: string) => {
  const Shot = () => <Annotated src={`${DIR}/${name}-v1.svg`} w={w} h={h} alt={alt} />;
  Shot.displayName = name;
  return Shot;
};

// ---------- TL;DR (2tldr.svg) ----------
const cards: TldrCard[] = [
  {
    tone: "problem",
    label: "Problem",
    body: (
      <>
        <p className={tl.big}>Every designer drew their own components</p>
        <p>No tokens, no variants. A new designer took a month or more to match the styling.</p>
      </>
    ),
  },
  {
    tone: "did",
    label: "What I did",
    body: (
      <>
        <p>Mapped every existing element and when each pattern is used</p>
        <p>Built a 3-layer token system : Brand → Alias → Mapped</p>
      </>
    ),
  },
  {
    tone: "impact",
    label: "Impact",
    body: (
      <>
        <p>
          <span className={tl.stat}>26+</span> components, each with real variants
        </p>
        <p>
          <span className={tl.stat}>150+</span> variants across width, state, icon and helper text
        </p>
      </>
    ),
  },
];
export const DsTldr = () => <Tldr cards={cards} />;

// ---------- Challenge ----------
/** The repository tabs and their layers, recorded (her MP4, 1542 x 1028, the stream copied as is),
 *  shown like a GIF: it plays from the start whenever it comes into view, looping. */
export const DsChallenge = () => (
  <VideoArtifact
    gif
    src={`${DIR}/challenge-v1.mp4`}
    poster={`${DIR}/challenge-v1-poster.webp`}
    w={1542}
    h={1028}
    label="The repository tabs look like one system, but in the layers panel each nav item is a separate, hand-built group."
  />
);

/** Same product, different hands (2diffhands.svg): two screens and her notes. */
export const DsDiffHands = () => (
  <Annotated
    src={`${DIR}/diff-hands-v1.svg`}
    w={1909}
    h={668}
    alt="Two LSNeo screens built by different designers: different header spacing, table and search layouts."
    over={
      <>
        <Note x={54} y={99} lines={["Inconsistent", "header spacing"]} />
        <Note x={54} y={254} lines={["...but each one is", "a separate,", "manually built", "group."]} />
        <Note x={1727} y={269} lines={["Different table,", "search layouts", "and structures"]} />
      </>
    }
  />
);

// Her blues, as named in her cards (hex values are the copy itself).
const BLUES = [
  { y: 0, head: "Existing header gradient", tone: t.red, rows: [["Start", "#1F3BB4", "8 . 96 : 1"], ["End (Indigo)", "#3A19A1", "11 . 45 : 1"]] }, // tokens-allow: copy naming her colours
  { y: 417, head: "Suggested header gradient", tone: t.green, rows: [["Start", "#1E4DFE", "5 . 92 : 1"], ["End", "#132053", "15 . 45 : 1"]] }, // tokens-allow: copy naming her colours
];

/** Three blues, no owner (2blues.svg): the existing header gradient and the suggested one. Her two
 *  cards, so no outer frame. */
export const DsBlues = () => (
  <Annotated
    src={`${DIR}/blues-v1.svg`}
    w={814}
    h={810}
    frame={false}
    alt="The existing header gradient, blue to indigo, and the suggested one, brand blue to deep navy; both pass AA with white text."
    over={BLUES.map((c) => (
      <g key={c.head} transform={`translate(0 ${c.y})`}>
        <T x={23} y={44.5} size={22} className={`${t.bold} ${c.tone}`}>
          {c.head}
        </T>
        <T x={22.3} y={88.5} size={12} className={t.quiet}>
          Blue to Indigo, no rule for which hue to follow
        </T>
        <T x={63.3} y={190} size={22} className={`${t.semi} ${t.paper}`}>
          LSNeo Library Services Platform
        </T>
        <T x={61.8} y={221} size={14} className={t.paper}>
          White text on a full-opacity gradient
        </T>
        {c.rows.map(([name, hex, ratio], i) => (
          <g key={name} transform={`translate(0 ${48 * i})`}>
            <T x={54} y={317.5} className={t.ink}>
              {name}
            </T>
            <T x={292.6} y={317.5} className={t.ink}>
              {hex}
            </T>
            <T x={509.7} y={317.5} className={t.ink}>
              {ratio}
            </T>
            <T x={720} y={317.5} className={t.green}>
              Passes AA
            </T>
          </g>
        ))}
      </g>
    ))}
  />
);

/** Scope: what we didn't do and what we did (2dodont.svg). */
export const DsDoDont = () => (
  <Annotated
    src={`${DIR}/do-dont-v1.svg`}
    w={892}
    h={356}
    alt="What we didn't do: reinvent components. What we did: map existing raw values to clear roles."
    over={
      <>
        <T x={118.8} y={100.8} size={22} className={`${t.semi} ${t.ink}`}>
          What we didn’t do
        </T>
        <Lines
          x={75.2}
          y={143.5}
          step={22.5}
          className={`${t.t} ${t.body} ${t.muted}`}
          lines={[
            "Didn’t reinvent components, simply made",
            "what already existed usable, keeping",
            "product’s look and feel same.",
            "",
            "Librarians and admin staff aren’t especially",
            "tech-savvy; a new visual language meant",
            "unnecessary friction.",
          ]}
        />
        <T x={522.4} y={100.5} size={22} className={`${t.semi} ${t.ink}`}>
          What we did
        </T>
        <Lines
          x={479.5}
          y={143.3}
          step={22.5}
          className={`${t.t} ${t.body} ${t.muted}`}
          lines={[
            "Our attempt was to map existing raw values",
            "to clear roles; maintaining consistency.",
            "",
            "Giving existing components responsive",
            "behavior, so the same look came from a",
            "system, not a redraw.",
          ]}
        />
      </>
    }
  />
);

// ---------- Approach ----------
export const DsStudy = shot("study", 2028, 1144, "The existing Figma file, page by page: every screen of every flow, studied before anything was built.");
export const DsAudit = shot("audit", 2028, 1148, "The original Figma page, with each pattern marked by where it is used and notes on what was missing.");
export const DsDocumentation = shot("documentation", 1913, 865, "The documentation's introduction: foundations, components, patterns and screens, mapped to atoms, molecules, organisms and templates.");

// ---------- Structure ----------
/** The three token layers (2tokens.svg). */
export const DsTokens = () => (
  <Annotated
    src={`${DIR}/tokens-v1.svg`}
    w={903}
    h={190}
    alt="One blue through the three layers: #1E4DFE, Product/600, Surface/action/primary600." // tokens-allow: copy naming her colour
    over={
      <>
        <T x={119.4} y={88.5} size={20} className={`${t.semi} ${t.ink}`}>
          {"#1E4DFE" /* tokens-allow: copy naming her colour */}
        </T>
        <T x={140} y={131} size={14} mid className={t.muted}>
          The raw color value
        </T>
        <T x={315.7} y={89.5} size={20} className={`${t.semi} ${t.ink}`}>
          Product/600
        </T>
        <T x={356} y={131.5} size={14} mid className={t.muted}>
          Gives the color a meaning
        </T>
        <T x={552.1} y={89.5} size={20} className={`${t.semi} ${t.ink}`}>
          Surface/action/primary600
        </T>
        <T x={667.5} y={132} size={14} mid className={t.muted}>
          Assigns it a job in the UI
        </T>
      </>
    }
  />
);
export const DsMapping = shot("mapping", 1920, 1161, "The Mapped token collection in Figma: surface, text, icon and border tokens, light and dark.");

// ---------- Documentation ----------
export const DsFoundation = shot("foundation", 5698, 2037, "Foundation documentation: the primary blue and neutral scales, and the type styles.");
export const DsFoundationB = shot("foundation-b", 3498, 1015, "Foundation documentation: layout application, grid and breakpoints.");

/** The input field chapter: what we borrowed and what we kept (2input.svg). */
export const DsReferences = () => (
  <Annotated
    src={`${DIR}/references-v1.svg`}
    w={1737}
    h={776}
    alt="Input field references from Cloudscape, Ant Design and Material, what each lent, and the inline field we continued with."
    over={
      <>
        <T x={56.5} y={92} size={36} className={`${t.semi} ${t.black}`}>
          References
        </T>
        <T x={750.8} y={173} className={`${t.medium} ${t.black}`}>
          Ant design
        </T>
        <Lines x={171.7} y={351} step={21} className={`${t.t} ${t.handLg} ${t.amber}`} lines={["Borrowed", "Helper text below the field, for", "requirements and constraints"]} />
        <Lines x={907.1} y={124} step={21} className={`${t.t} ${t.handLg} ${t.amber}`} lines={["Borrowed", "The label beside the field, with a", "colon as matches existing fields"]} />
        <Lines x={1216.1} y={478} step={21} className={`${t.t} ${t.handLg} ${t.amber}`} lines={["Borrowed", "Strong full length Underline as made", "the field look complete"]} />
        <T x={54.5} y={584} size={36} className={`${t.medium} ${t.indigo}`}>
          What we continued with
        </T>
        <Lines
          x={826.8}
          y={581}
          step={21}
          className={`${t.t} ${t.handLg} ${t.black}`}
          lines={["The product already worked with", "inline input style also it kept the", "overall height of form short"]}
        />
      </>
    }
  />
);
export const DsComponents = shot("components", 1494, 1139, "The input field component in Figma: 48 variants across width, state, icon and helper text.");
export const DsNav = shot("nav", 4204, 2325, "Component pages in Figma by category: header, navigation sidebar and contextual action bar, each documented.");

// ---------- In Use ----------
/** The same screen before and after, flipping as you scroll (as What I understood does on LSNeo). */
export const DsBeforeAfter = () => (
  <Flip
    heading="Same fields, same data, a system underneath this time"
    front={
      <Annotated
        src={`${DIR}/before-v1.svg`}
        w={1474}
        h={916}
        alt="Before: the Patron details screen as it was."
        over={
          <T x={55.1} y={72} className={`${t.semi} ${t.red}`}>
            Before
          </T>
        }
      />
    }
    back={
      <Annotated
        src={`${DIR}/after-v1.svg`}
        w={1474}
        h={1057}
        alt="After: the same screen built from the system's tokens and components."
        over={
          <T x={54.3} y={72} className={`${t.semi} ${t.green}`}>
            After
          </T>
        }
      />
    }
  />
);
