import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GridLines from './GridLines';

const safeLink = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '#';
  return trimmed;
};

const scrollToAbout = () =>
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });

export default function Hero({ site = {} }) {
  const heroBadge = site.heroBadge || 'Full Stack';
  const heroBio =
    site.heroBio ||
    site.bio ||
    "I'm Gabrial Deora, a Full Stack Web Developer with hands-on internship experience building responsive, high-performance web applications.";
  const heroTitle = site.heroTitle || 'Building Web Apps That Actually Perform';
  const heroBgText = site.heroBgText || 'Developer';
  const avatarUrl = safeLink(site.avatarUrl || '/hero.png');
  const contactHref = safeLink(site.emailHref || '#contact');

  return (
    <section className="hero">
      <GridLines />
      <div className="hero-bg-text-container hero-bg-text-animated">
        <span className="hero-bg-text">{heroBgText}</span>
      </div>

      <div className="content-wrapper">
        <div className="hero-content">
          <div className="hero-left-col">
            <div>
              <div className="hero-badge hero-badge-animated">{heroBadge}</div>
              <p className="hero-bio">{heroBio}</p>
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
            <h1 className="hero-title hero-title-animated">{heroTitle}</h1>
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
                src={avatarUrl}
                alt={`${site.name || 'Developer'} tech graphic`}
                className="hero-portrait hero-portrait-animated"
              />
            </div>

            <div className="hero-cta-right">
              <a href={contactHref} className="btn-primary">
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
