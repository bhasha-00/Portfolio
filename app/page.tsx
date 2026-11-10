import Hero from "./components/Hero";
import Projects from "./components/Projects";
import AiTinkering from "./components/AiTinkering";
import About from "./components/About";
import End from "./components/End";

// Hero, Projects, AI Tinkering, About, then the sign-off.
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <AiTinkering />
      <About />
      <End />
    </>
  );
}
