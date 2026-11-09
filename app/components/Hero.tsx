import Image from "next/image";
import HeroTouchdown from "./HeroTouchdown";
import styles from "./Hero.module.css";

// Static home hero. Layout and spacing from reference/lofi-v4.html; type and colour from artdirection.md.
export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="home-title">
      <div className={styles.top}>
        <p className={styles.headline}>
          Translating business goals and user needs into interfaces that perform.
        </p>

        <div className={styles.intro}>
          <h1 id="home-title" className={styles.name}>
            Bhasha Maheshwari
          </h1>
          <p className={styles.role}>Product Designer</p>
          <p className={styles.summary}>
            2+ years across B2B SaaS and AI-native projects. Strong focus in complex system, scale
            and end-to-end ownership.
          </p>
        </div>
      </div>

      <div className={styles.big} aria-hidden="true">
        80/20
      </div>

      {/* Hero art: designer workspace, top-down. Decorative, so empty alt.
          The gold paper crane from the intro rests where the photo's crane was. */}
      <div className={styles.stage}>
        <div className={styles.artBox}>
          <Image
            src="/hero/workspace-v6.webp"
            alt=""
            width={2400}
            height={1912}
            quality={80}
            priority
            sizes="(max-width: 767px) 88vw, 640px"
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
          </div>
        </div>
      </div>

      <p className={styles.cue}>Scroll for work</p>
    </section>
  );
}
