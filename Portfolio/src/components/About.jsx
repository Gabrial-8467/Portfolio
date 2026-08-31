import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';
import { ICON_KEYS } from '../data/iconKeys';
import { GlobeIcon } from './Icons';

export default function About({ socials = [], site = {} }) {
  const aboutTitle = site.aboutTitle || 'The Developer Shaping Modern Web Experiences';
  const desc1 =
    site.aboutDesc1 ||
    site.bio ||
    "I'm a dynamic Full Stack Web Developer with strong internship experience in crafting responsive and high-performance web applications. I specialize in React.js, Node.js, and MongoDB.";
  const desc2 =
    site.aboutDesc2 ||
    "My commitment is to enhancing user experience through clean, scalable code and modern design. I'm passionate about leveraging technology to tackle real-world challenges and continuously improving code quality.";

  return (
    <section id="about" className="section section-dark">
      <GridLines />
      <div className="content-wrapper">
        <div className="about-grid">
          <Reveal type="left" className="about-col-1">
            <div className="section-label">About Me</div>
            <div className="socials-list">
              {socials.map(({ key, label, href }, i) => {
                const Icon = ICON_KEYS[key] || GlobeIcon;
                return (
                  <Reveal
                    key={`${key}-${label}-${i}`}
                    as="a"
                    type="up"
                    delay={i + 1}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill-btn"
                  >
                    {Icon && <Icon />} {label || key}
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
          <Reveal type="up" delay={1} className="about-col-2">
            <h2 className="about-title">{aboutTitle}</h2>
          </Reveal>
          <Reveal type="up" delay={2} className="about-col-3">
            <p className="about-desc">{desc1}</p>
          </Reveal>
          <Reveal type="up" delay={3} className="about-col-4">
            <p className="about-desc">{desc2}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
