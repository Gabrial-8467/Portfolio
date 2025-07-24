import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Achievements from "../components/Achievements";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar name="Gabrial Deora" />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Achievements />
      <Projects />
      <Contact />
      <Footer name="Gabrial Deora" />
    </div>
  );
};

export default Home; 