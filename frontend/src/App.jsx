import './App.css';
import './animations.css';
import './mobile.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Hackathons from './components/Hackathons';
import Footer from './components/Footer';

function App() {
  return (
    <div className="layout-container">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Hackathons />
      </main>
      <Footer />
    </div>
  );
}

export default App;
