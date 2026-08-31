import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GridLines from './GridLines';

const scrollToAbout = () =>
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });

export default function Hero() {
  return (
    <section className="hero">
      <GridLines />
      <div className="hero-bg-text-container hero-bg-text-animated">
        <span className="hero-bg-text">Developer</span>
      </div>

      <div className="content-wrapper">
        <div className="hero-content">
          <div className="hero-left-col">
            <div>
              <div className="hero-badge hero-badge-animated">Full Stack</div>
              <p className="hero-bio">
                I'm Gabrial Deora, a Full Stack Web Developer with hands-on internship experience building responsive, high-performance web applications.
              </p>
            </div>
            <button
              className="hero-scroll-btn"
              onClick={scrollToAbout}
              aria-label="Scroll to About section"
              type="button"
            >
              <ArrowDownRight size={24} />
            </button>
          </div>

          <div className="hero-title-container">
            <h1 className="hero-title hero-title-animated">Building Web Apps That Actually Perform</h1>
          </div>

          <div className="hero-interactive-zone">
            <div className="hero-cta-left">
              <a href="#projects" className="btn-primary btn-primary-pulse">
                View My Work
                <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
              </a>
            </div>

            <div className="hero-image-wrapper">
              <img
                src="/hero.png"
                alt="Developer tech graphic"
                className="hero-portrait hero-portrait-animated"
              />
            </div>

            <div className="hero-cta-right">
              <a href="#contact" className="btn-primary">
                Let's Work Together
                <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
