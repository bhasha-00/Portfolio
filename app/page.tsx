import { sections } from "./sections";
import styles from "./page.module.css";

// Layout shell only: one empty section per nav tab. Content arrives in later build steps.
export default function Home() {
  return (
    <>
      {sections.map(({ id, label }) => (
        <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
          <h2 id={`${id}-title`} className="sr-only">
            {label}
          </h2>
        </section>
      ))}
    </>
  );
}
