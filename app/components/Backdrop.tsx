import styles from "./Backdrop.module.css";

// The page background: red, a muted CSS dot grid (from Bhasha's type + texture test) and bg.svg's
// light "burst" shape (1522 × 768 frame). It is fixed: everything scrolls over it. The burst sits
// centred (as bg.svg) from the first screen on, as in every other section; it never moves.
const FRAME = { w: 1522, h: 768 };

const BURST =
  "M-66.2352 507.039C60.1046 480.71 284.961 363.786 173.668 106.719C241.794 187.965 409.653 301.268 536.078 104.508C760.984 123.914 765.906 33.9258 739.05 -16.7349C738.39 -17.9179 737.737 -19.0947 737.091 -20.2651C737.76 -19.1117 738.414 -17.9343 739.05 -16.7349C817.173 123.245 998.461 349.593 1114.87 161.137C1320.43 281.597 1466.26 192.591 1531.9 112.064C1539.45 100.741 1547.01 89.9251 1554.45 79.7569C1548.5 89.9814 1540.96 100.942 1531.9 112.064C1426.77 269.768 1325.47 525.756 1631.91 498.175C1465.69 528.738 1108.36 621.305 1008.86 747.064C990.006 683.363 897.786 586.209 679.762 707.202C667.505 664.117 612.54 604.245 490.74 709.44C463.815 633.374 361.135 517.873 165.818 664.395C193.672 615.984 186.258 516.736 -66.2352 507.039Z";

export default function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.texture} />
      <svg className={styles.burst} viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} preserveAspectRatio="xMidYMid slice">
        <path d={BURST} />
      </svg>
      {/* Printed-ink texture on the red (make-ink-texture.py): slow cloudy mottle, then fine speck. */}
      <div className={styles.inkMottle} />
      <div className={styles.inkSpeck} />
    </div>
  );
}
