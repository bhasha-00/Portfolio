import Image from "next/image";
import HeroTouchdown from "./HeroTouchdown";
import Origami from "./companion/Origami";
import styles from "./Hero.module.css";

// Static home hero. Layout and spacing from reference/lofi-v4.html; type and colour from artdirection.md.
export default function Hero() {
  return (
    <section id="home" className={`container ${styles.hero}`} aria-labelledby="home-title">
      {/* One reading unit, in order: who (name, role), what she delivers (headline), the proof of
          experience (summary). */}
      <div className={`grid ${styles.top}`}>
        <div className={styles.text}>
          <h1 id="home-title" className={styles.name}>
            Hi, I am Bhasha
          </h1>
          {/* In Bhasha's hand (Figma Hand), as an outline from her export (2026-11-11). */}
          <p className={styles.role}>
            <img src="/hero/product-designer.svg" alt="Product designer" width={150} height={20} className={styles.hand} />
          </p>
          {/* Three lines, set by hand, from 768 up; phones let it wrap. */}
          <p className={styles.headline}>
            <span className={styles.step}>Translating business goals and</span>{" "}
            <span className={styles.step}>user needs into interfaces that</span>{" "}
            <span className={styles.step}>perform.</span>
          </p>
          <p className={styles.summary}>
            With 2+ years across B2B SaaS, I bring strong focus in complex systems,
            scale and end‑to‑end ownership.
          </p>
        </div>
      </div>

      {/* Hero art: designer workspace, top-down. Decorative, so empty alt.
          The gold paper crane from the intro rests in the clear space above the tablet. */}
      <div className={styles.stage}>
        <div className={styles.artBox}>
          <Image
            src="/hero/workspace-v7.webp"
            alt=""
            width={2000}
            height={1615}
            quality={90}
            priority
            // Desktop: twice the drawn 640px, so there is detail to zoom into (most get the full
            // 2000px). Phones: the drawn 88vw only, because the hero is the LCP element and the
            // doubled copy cost mobile Lighthouse about 6 points (LCP 3.1–3.5s).
            sizes="(max-width: 767px) 88vw, 1280px"
            className={styles.art}
          />
          {/* Landing puff at the crane's foot; before the crane in the DOM, so it sits underneath. */}
          <HeroTouchdown />
          <div className={styles.crane} data-intro-target="">
            {/* Cast shadow from its own silhouette, thrown back-right from a top-left light:
                a near, sharper layer and a far, softer one; plus the contact point at the foot. */}
            <span className={`${styles.craneCast} ${styles.castFar}`}><span className={styles.castShape} /></span>
            <span className={`${styles.craneCast} ${styles.castNear}`}><span className={styles.castShape} /></span>
            <span className={styles.craneAmbient} />
            <span className={styles.craneFoot} />
            {/* Tap to refold: crane → rabbit → parrot. */}
            <Origami>
              <Image
                src="/assets/crane-sm.webp"
                alt=""
                width={320}
                height={236}
                quality={90}
                priority
                sizes="(max-width: 767px) 12vw, 80px"
                className={styles.craneArt}
              />
            </Origami>
          </div>
        </div>
      </div>
    </section>
  );
}
