import Image from "next/image";
import styles from "./Hero.module.css";

// Static home hero. Layout and spacing from reference/lofi-v4.html; type and colour from artdirection.md.
export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="home-title">
      <div className={styles.top}>
        <p className={styles.headline}>
          Translating business goals and user needs into conversion focused interfaces that perform.
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
        01
      </div>

      {/* Hero art: designer workspace, top-down. Decorative, so empty alt. */}
      <div className={styles.stage}>
        <Image
          src="/hero/workspace-v2.webp"
          alt=""
          width={2400}
          height={1909}
          quality={90}
          priority
          sizes="(max-width: 767px) 100vw, 640px"
          className={styles.art}
        />
      </div>

      <p className={styles.cue}>Scroll for work</p>
    </section>
  );
}
