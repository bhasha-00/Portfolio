import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./Annotated.module.css";

// One of Bhasha's annotated artifacts, in her own coordinates (the Figma frame's px). Three layers, all
// scaled together by the SVG viewBox: `under` (drawn on the page), her export as an image (frames,
// highlights, leader lines, note cards and the screenshots, stored lossless by
// scripts/build-lsneo-artifacts.cjs with the outlined text taken out), and `over`, the text set again
// in Geist / Caveat. So the type is the site's, and every pixel of the screenshots is hers. Her own
// frame is taken off each export; `frame` draws the one every artifact shares (16px corners).

/** `view`: show only the band from y to y + h of the artifact (one card of a stacked pair). */
type Props = { src: string; w: number; h: number; alt: string; under?: ReactNode; over?: ReactNode; frame?: boolean; view?: { y: number; h: number } };

export function Annotated({ src, w, h, alt, under, over, frame = true, view }: Props) {
  const box = `0 0 ${w} ${h}`;
  const layers = (
    <>
      {under && (
        <svg className={styles.layer} viewBox={box}>
          {under}
        </svg>
      )}
      <Image src={src} alt={alt} fill unoptimized className={styles.layer} />
      {over && (
        <svg className={styles.layer} viewBox={box}>
          {over}
        </svg>
      )}
    </>
  );
  return (
    <figure
      className={frame ? `${styles.fig} ${styles.frame}` : styles.fig}
      style={{ aspectRatio: `${w} / ${view ? view.h : h}`, ...(view && { overflow: "hidden" }) }}
    >
      {view ? (
        // The whole artifact, shifted up so only its band shows.
        <div className={styles.band} style={{ top: `${(-view.y / view.h) * 100}%`, height: `${(h / view.h) * 100}%` }}>
          {layers}
        </div>
      ) : (
        layers
      )}
    </figure>
  );
}

const LINE = 20; // --lh-small

/** Lines of text from (x, y), the first baseline. An empty string is a blank line. */
export function Lines({ x, y, lines, step = LINE, className }: { x: number; y: number; lines: string[]; step?: number; className?: string }) {
  let skip = 0;
  return (
    <text className={className} x={x} y={y}>
      {lines.map((l, i) => {
        if (!l) {
          skip += step;
          return null;
        }
        const dy = i === 0 ? 0 : step + skip;
        skip = 0;
        return (
          <tspan key={i} x={x} dy={dy}>
            {l}
          </tspan>
        );
      })}
    </text>
  );
}

/** A note card of hers (222 wide): the text, and her "Bhasha" tag in the bottom corner. */
export function Note({
  x,
  y,
  h = 128,
  lines,
  top = 25.7,
  step = LINE,
  tone,
}: {
  x: number;
  y: number;
  h?: number;
  lines: string[];
  top?: number;
  /** Line spacing in her px (20 unless her card sets it tighter or looser). */
  step?: number;
  /** A class for the note's text colour (her green notes). */
  tone?: string;
}) {
  return (
    <g>
      <Lines x={x + 11} y={y + top} step={step} lines={lines} className={tone ? `${styles.note} ${tone}` : styles.note} />
      <text className={styles.sign} transform={`translate(${x + 11} ${y + h - 12.2}) scale(0.55)`}>
        Bhasha
      </text>
    </g>
  );
}

export { styles as annotated };
