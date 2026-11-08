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
          <p className={styles.place}>Bangalore, India</p>
          <p className={styles.summary}>
            2+ years across B2B SaaS and AI-native projects. Strong focus in complex system, scale
            and end-to-end ownership.
          </p>
        </div>
      </div>

      <div className={styles.big} aria-hidden="true">
        01
      </div>

      {/* Placeholder figure from the prototype, recoloured to tokens. Swap for the real art later. */}
      <div className={styles.stage} aria-hidden="true">
        <svg viewBox="0 0 560 440" width="560" height="440" focusable="false">
          <defs>
            <filter id="rough">
              <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>
          <g
            filter="url(#rough)"
            fill="none"
            style={{ stroke: "var(--ink)" }}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="300" y="170" width="150" height="100" rx="6" transform="rotate(28 375 220)" style={{ fill: "var(--cream)" }} />
            <rect x="120" y="190" width="95" height="120" transform="rotate(-18 167 250)" style={{ fill: "var(--back)" }} />
            <rect x="205" y="300" width="80" height="100" transform="rotate(14 245 350)" style={{ fill: "var(--back)" }} />
            <ellipse cx="450" cy="330" rx="30" ry="24" style={{ fill: "var(--back)" }} />
            <path d="M70 430c-6-70 10-150 70-180l70 10c40 20 66 90 70 170z" style={{ fill: "var(--cream)" }} />
            <path d="M205 262c40 10 70 6 100-14" />
            <circle cx="155" cy="205" r="46" style={{ fill: "var(--back)" }} />
            <path d="M110 205c0-40 28-60 58-56 26 3 40 26 34 56-14-22-38-28-92 0z" style={{ fill: "var(--ink)" }} />
            <circle cx="162" cy="140" r="17" style={{ fill: "var(--ink)" }} />
          </g>
        </svg>
      </div>

      <p className={styles.cue}>Scroll for work</p>
    </section>
  );
}
