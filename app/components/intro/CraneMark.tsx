import { craneFinal } from "./crane";
import { bbox, flatten, pts } from "./fold";
import styles from "./Intro.module.css";

// The finished gold crane, drawn on the server from the same data as the intro's last frame,
// so the flying crane lands on an identical one. The view box is cropped tight to the crane
// (outlines spill over; the svg is overflow: visible) so its box matches the flyer's exactly.
const faces = flatten(craneFinal);
const b = bbox(faces);
const pad = 0;
export const CRANE_VIEWBOX = `${b.x - pad} ${b.y - pad} ${b.w + 2 * pad} ${b.h + 2 * pad}`;

export default function CraneMark({ className, ...rest }: { className?: string } & Record<string, string | undefined>) {
  return (
    <svg className={className} viewBox={CRANE_VIEWBOX} aria-hidden="true" focusable="false" {...rest}>
      {faces.map((f, i) => {
        const p = pts(f.p);
        return (
          <g key={i}>
            <polygon className={styles.paper} points={p} />
            {f.s && f.s > 0 ? <polygon className={styles.shade} points={p} opacity={f.s} /> : null}
            {f.s && f.s < 0 ? <polygon className={styles.lite} points={p} opacity={-f.s} /> : null}
            <polygon className={styles.edge} points={p} />
          </g>
        );
      })}
    </svg>
  );
}
