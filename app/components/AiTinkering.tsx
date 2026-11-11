"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { PILL_H, tinkers } from "../content/ai";
import Origami from "./companion/Origami";
import PerchPuff from "./companion/PerchPuff";
import { ROLE, roleOf, useSpread } from "./useSpread";
import spread from "./Spread.module.css";
import styles from "./AiTinkering.module.css";

const PERCH = 0; // the crane perches on the card that starts in front

// AI Tinkering: the three-card spread (useSpread) as in ai.svg. Clicking, tapping or swiping to a side
// card brings it to the front; the front card does nothing yet (it will open the tool).
export default function AiTinkering() {
  const { section, stage, slots, front, bring, stageProps, swiped, zOf } = useSpread(tinkers);
  const fly = useRef<HTMLSpanElement>(null);
  const craneWidth = useCallback(() => (fly.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0, []);

  return (
    <section ref={section} id="ai-tinkering" className={`${spread.clip} ${styles.ai}`} aria-labelledby="ai-tinkering-title">
      <h2 id="ai-tinkering-title" className="sr-only">
        AI Tinkering
      </h2>
      <div className={`container ${spread.frame} ${styles.pin}`}>
        <div ref={stage} className={`${spread.stage} ${styles.stage}`} {...stageProps}>
          {tinkers.map((c, i) => {
            const role = roleOf(i, front);
            const isFront = role === 0;
            return (
              <div
                key={c.name}
                ref={(el) => {
                  slots.current[i] = el;
                }}
                className={spread.slot}
                style={{ zIndex: zOf(i) }}
              >
                <div className={spread.pos} data-role={ROLE[role]}>
                  <button
                    type="button"
                    className={styles.card}
                    aria-current={isFront || undefined}
                    aria-label={isFront ? undefined : `Bring ${c.name} to the front`}
                    onClick={() => {
                      if (!swiped() && !isFront) bring(i);
                    }}
                  >
                    <span className={styles.deep} aria-hidden="true" />
                    <span className={styles.media}>
                      {c.media && (
                        <Image
                          src={c.media.src}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 80vw, 560px"
                          quality={80}
                          className={styles.mediaImg}
                          style={c.media.focus ? { objectPosition: c.media.focus } : undefined}
                        />
                      )}
                    </span>
                    <span className={styles.foot}>
                      <Image
                        src={c.pill.src}
                        alt={c.name}
                        width={c.pill.w}
                        height={PILL_H}
                        className={styles.pill}
                        unoptimized
                      />
                      <span className={styles.line}>{c.line}</span>
                    </span>
                  </button>

                  {i === PERCH && (
                    // The crane's last perch: on this card's top edge, near its right corner.
                    <span className={styles.perch} data-perch="ai" aria-hidden="true">
                      <PerchPuff at="ai" size={craneWidth} />
                      <span ref={fly} className={styles.fly} data-fly="">
                        <Origami className={styles.craneArt}>
                          <Image
                            src="/assets/crane-sm.webp"
                            alt=""
                            width={320}
                            height={236}
                            quality={90}
                            sizes="(max-width: 767px) 12vw, 80px"
                            className={styles.craneImg}
                          />
                        </Origami>
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
