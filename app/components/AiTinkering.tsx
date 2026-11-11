"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PILL_H, tinkers } from "../content/ai";
import Origami from "./companion/Origami";
import PerchPuff from "./companion/PerchPuff";
import { ROLE, roleOf, useSpread } from "./useSpread";
import spread from "./Spread.module.css";
import styles from "./AiTinkering.module.css";

const PERCH = 0; // the crane perches on the card that starts in front
const FRAME_W = 306; // the cards' width in Frames 1984079200–202, px

// A card's clip, over its still. Only the front card's clip plays; a side card's is paused and
// faded out, so the still shows. The file is fetched once the section is near (never with the
// hero), and the clip fades in (opacity) only once it is actually playing, so there is no blank
// frame. Reduced motion: never plays.
function Clip({ src, focus, play }: { src: string; focus?: string; play: boolean }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (play) {
      el.play().catch(() => {}); // a blocked autoplay leaves the still showing
    } else {
      el.pause();
      delete el.dataset.on;
    }
  }, [play]);
  return (
    <video
      ref={v}
      className={styles.clip}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      style={focus ? { objectPosition: focus } : undefined}
      onPlaying={(e) => (e.currentTarget.dataset.on = "")}
    />
  );
}

// AI Tinkering: the three-card spread (useSpread) as in ai.svg. Clicking, tapping or swiping to a side
// card brings it to the front; clicking the front card opens the tool in a new tab, or, for one not
// out yet, shows "Coming soon" over its media.
export default function AiTinkering() {
  const { section, stage, slots, front, bring, stageProps, swiped, zOf } = useSpread(tinkers);
  const fly = useRef<HTMLSpanElement>(null);
  const craneWidth = useCallback(() => (fly.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0, []);

  // The cards are laid out at the frames' 306px and scaled to the slot's width: --k = width / 306.
  useEffect(() => {
    const st = stage.current;
    const slot = slots.current[0];
    if (!st || !slot) return;
    const ro = new ResizeObserver(() => st.style.setProperty("--k", String(slot.offsetWidth / FRAME_W)));
    ro.observe(slot);
    return () => ro.disconnect();
  }, [stage, slots]);

  // "Coming soon" on the front card (Exploded Hierarchy); cleared when the ring turns.
  const [soon, setSoon] = useState(false);
  useEffect(() => setSoon(false), [front]);

  // Clips load once the section is a screen away, and play only while it is on screen.
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [still, setStill] = useState(true);
  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(reduce.matches);
    sync();
    reduce.addEventListener("change", sync);
    const early = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    early.observe(sec);
    io.observe(sec);
    return () => {
      reduce.removeEventListener("change", sync);
      early.disconnect();
      io.disconnect();
    };
  }, [section]);

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
            // The card as designed (306 x 410), scaled to the card's width as one piece (--k).
            const inner = (
              <span className={styles.face}>
                <span className={styles.deep} aria-hidden="true" />
                <span className={styles.media}>
                  {c.media && (
                    <Image
                      src={c.media.src}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 80vw, 400px"
                      quality={90}
                      className={styles.mediaImg}
                      style={c.media.focus ? { objectPosition: c.media.focus } : undefined}
                    />
                  )}
                  {c.soon && (
                    // gf.svg art ("Under testing", "Coming soon"), faded in when the front card is clicked; the
                    // words are given as text in the card's label.
                    <span className={styles.soon} data-on={soon && isFront ? "" : undefined} aria-hidden="true">
                      <Image src="/ai/coming-soon.svg" alt="" fill unoptimized className={styles.mediaImg} />
                    </span>
                  )}
                  {c.media?.clip && near && (
                    <Clip src={c.media.clip} focus={c.media.focus} play={isFront && onScreen && !still} />
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
              </span>
            );
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
                  {isFront && c.href ? (
                    // The tool, in a new tab. A drag that ends on the card is a swipe, not a click.
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.card}
                      aria-current="true"
                      aria-label={`${c.name}: ${c.line} Opens in a new tab.`}
                      onClick={(e) => swiped() && e.preventDefault()}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={styles.card}
                      aria-current={isFront || undefined}
                      aria-label={
                        !isFront ? `Bring ${c.name} to the front` : c.soon ? `${c.name}: ${c.line} Coming soon.` : undefined
                      }
                      onClick={() => {
                        if (swiped()) return;
                        if (!isFront) bring(i);
                        else if (c.soon) setSoon((s) => !s);
                      }}
                    >
                      {inner}
                    </button>
                  )}

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
