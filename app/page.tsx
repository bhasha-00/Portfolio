import Hero from "./components/Hero";
import Projects from "./components/Projects";
import AiTinkering from "./components/AiTinkering";
import About from "./components/About";
import { sections } from "./sections";
import styles from "./page.module.css";

// Hero, Projects, AI Tinkering, then one empty section per remaining nav tab. Content arrives in later build steps.
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <AiTinkering />
      <About />
      {sections.slice(4).map(({ id, label }) => (
        <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
          <h2 id={`${id}-title`} className="sr-only">
            {label}
          </h2>
        </section>
      ))}
    </>
  );
}
