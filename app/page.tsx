import Hero from "./components/Hero";
import { sections } from "./sections";
import styles from "./page.module.css";

// Hero, then one empty section per remaining nav tab. Content arrives in later build steps.
export default function Home() {
  return (
    <>
      <Hero />
      {sections.slice(1).map(({ id, label }) => (
        <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
          <h2 id={`${id}-title`} className="sr-only">
            {label}
          </h2>
        </section>
      ))}
    </>
  );
}
