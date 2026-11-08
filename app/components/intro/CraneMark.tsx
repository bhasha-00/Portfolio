import { craneFinal } from "./crane";
import { bbox, flatten, pts } from "./fold";
import styles from "./Intro.module.css";

// The finished gold crane, drawn on the server from the same data as the intro's last frame,
// so the flying crane lands on an identical one. The view box is cropped tight to the crane
// (outlines and the ground shadow spill over; the svg is overflow: visible) so its box matches
// the flyer's exactly.
const faces = flatten(craneFinal);
const b = bbox(faces);
export const CRANE_VIEWBOX = `${b.x} ${b.y} ${b.w} ${b.h}`;

// It sits on the bottom point of its body (the lowest point; the wings are lifted). The crane
// faces left, toward the girl, so its raised wings throw their soft shadow to the right.
let foot: [number, number] = [0, -Infinity];
faces.forEach((f) => f.p.forEach((q) => { if (q[1] > foot[1]) foot = q; }));
const tilt = 0;
const cx = foot[0] + b.w * 0.14, cy = foot[1] + b.h * 0.01;

export default function CraneMark({ className, ...rest }: { className?: string } & Record<string, string | undefined>) {
  return (
    <svg className={className} viewBox={CRANE_VIEWBOX} aria-hidden="true" focusable="false" {...rest}>
      <defs>
        <filter id="craneGround" x="-30%" y="-150%" width="160%" height="400%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {/* Contact shadow: a wide soft pool, and a darker core right under the body. */}
      <g className={styles.ground} filter="url(#craneGround)" transform={`rotate(${tilt} ${cx} ${cy})`}>
        <ellipse className={styles.shade} cx={cx} cy={cy} rx={b.w * 0.42} ry={b.h * 0.06} opacity={0.3} />
        <ellipse className={styles.shade} cx={foot[0]} cy={foot[1]} rx={b.w * 0.12} ry={b.h * 0.035} opacity={0.55} />
      </g>
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
