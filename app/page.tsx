import Backdrop from "./components/Backdrop";
import Intro from "./components/intro/Intro";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import AiTinkering from "./components/AiTinkering";
import About from "./components/About";
import End from "./components/End";

// Home: the red backdrop, the intro and the nav, then Hero, Projects, AI Tinkering, About and the
// sign-off.
export default function Home() {
  return (
    <>
      <Backdrop />
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <AiTinkering />
        <About />
        <End />
      </main>
    </>
  );
}
