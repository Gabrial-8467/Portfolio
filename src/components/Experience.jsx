import { ArrowUpRight } from 'lucide-react';
import { Reveal, AnimatedCounter } from './AnimatedSection';
import GridLines from './GridLines';
import { STATS, PROCESS_STEPS, experience, education } from '../data';

function ProcessPills() {
  return (
    <div className="process-pills-row">
      {PROCESS_STEPS.map(({ text, variant }, i) => (
        <Reveal key={`${text}-${i}`} as="div" type="scale" delay={i + 1} className={`process-pill ${variant}`}>
          {text === 'arrow' ? <ArrowUpRight size={32} /> : text}
        </Reveal>
      ))}
    </div>
  );
}

function Stats() {
  return (
    <div className="stats-grid">
      {STATS.map((stat, i) => (
        <Reveal key={stat.label} type="up" delay={i + 1} className="stat-card stat-card-animated">
          <div className="stat-label">{stat.label}</div>
          <AnimatedCounter end={stat.value} className="stat-number" />
          <div className="stat-subtext">{stat.subtext}</div>
        </Reveal>
      ))}
    </div>
  );
}

function Timeline() {
  return (
    <div className="experience-timeline">
      {experience.map((exp) => (
        <div key={`${exp.company}-${exp.period}`} className="exp-card">
          <div className="exp-left">
            <div className="exp-period">{exp.period}</div>
            <div className="exp-location">{exp.location}</div>
          </div>
          <div className="exp-right">
            <div className="exp-role">{exp.role}</div>
            <div className="exp-company">{exp.company}</div>
            <ul className="exp-points">
              {exp.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function Education() {
  return (
    <div className="education-section">
      <div className="section-label" style={{ marginBottom: '1.5rem' }}>Education</div>
      {education.map((edu) => (
        <div key={`${edu.institution}-${edu.period}`} className="edu-card">
          <div className="edu-period">{edu.period}</div>
          <div className="edu-degree">{edu.degree}</div>
          <div className="edu-institution">{edu.institution} — {edu.location}</div>
        </div>
      ))}
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section">
      <GridLines />
      <div className="content-wrapper">
        <div className="designer-section">
          <ProcessPills />

          <div className="designer-details">
            <div className="designer-title-col">
              <Reveal type="left" className="designer-label-area">
                <div className="section-label">Experience</div>
              </Reveal>
              <Reveal type="up" delay={1} className="designer-title-area">
                <h2 className="designer-heading">Crafting Scalable Solutions That Matter.</h2>
              </Reveal>
            </div>

            <Stats />
          </div>

          <Timeline />
          <Education />
        </div>
      </div>
    </section>
  );
}
