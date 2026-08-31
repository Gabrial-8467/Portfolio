import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';
import { ICON_KEYS } from '../data/iconKeys';
import { SOCIALS } from '../data';

export default function About() {
  return (
    <section id="about" className="section section-dark">
      <GridLines />
      <div className="content-wrapper">
        <div className="about-grid">
          <Reveal type="left" className="about-col-1">
            <div className="section-label">About Me</div>
            <div className="socials-list">
              {SOCIALS.map(({ key, label, href }, i) => {
                const Icon = ICON_KEYS[key];
                return (
                  <Reveal
                    key={label}
                    as="a"
                    type="up"
                    delay={i + 1}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill-btn"
                  >
                    {Icon && <Icon />} {label}
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
          <Reveal type="up" delay={1} className="about-col-2">
            <h2 className="about-title">The Developer Shaping Modern Web Experiences</h2>
          </Reveal>
          <Reveal type="up" delay={2} className="about-col-3">
            <p className="about-desc">
              I'm a dynamic Full Stack Web Developer with strong internship experience in crafting responsive and high-performance web applications. I specialize in React.js, Node.js, and MongoDB.
            </p>
          </Reveal>
          <Reveal type="up" delay={3} className="about-col-4">
            <p className="about-desc">
              My commitment is to enhancing user experience through clean, scalable code and modern design. I'm passionate about leveraging technology to tackle real-world challenges and continuously improving code quality.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
