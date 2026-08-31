import './App.css';
import './animations.css';
import './mobile.css';

import {
  SITE,
  SOCIALS,
  NAV_LINKS,
  STATS,
  PROCESS_STEPS,
  projects,
  skills,
  services,
  experience,
  education,
  achievements,
} from './data';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Hackathons from './components/Hackathons';
import Footer from './components/Footer';

const data = {
  site: SITE,
  nav: NAV_LINKS,
  socials: SOCIALS,
  stats: STATS,
  processSteps: PROCESS_STEPS,
  projects,
  skills,
  services,
  experience,
  education,
  achievements,
};

function App() {
  return (
    <div className="layout-container">
      <Navbar site={data.site} nav={data.nav} />
      <main>
        <Hero site={data.site} />
        <About socials={data.socials} site={data.site} />
        <Experience data={data} />
        <Projects projects={data.projects} site={data.site} />
        <Skills services={data.services} skills={data.skills} />
        <Hackathons achievements={data.achievements} site={data.site} />
      </main>
      <Footer site={data.site} nav={data.nav} />
    </div>
  );
}

export default App;
