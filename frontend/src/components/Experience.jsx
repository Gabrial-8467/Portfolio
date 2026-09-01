import { ArrowUpRight } from 'lucide-react';
import { Reveal, AnimatedCounter } from './AnimatedSection';
import GridLines from './GridLines';

function ProcessPills({ steps = [] }) {
  if (!steps.length) return null;
  return (
    <div className="process-pills-row">
      {steps.map(({ text, variant }, i) => (
        <Reveal key={`${text}-${i}`} as="div" type="scale" delay={i + 1} className={`process-pill ${variant || 'grey'}`}>
          {text === 'arrow' ? <ArrowUpRight size={32} /> : text}
        </Reveal>
      ))}
    </div>
  );
}

function Stats({ stats = [] }) {
  if (!stats.length) return null;
  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <Reveal key={stat.label || i} type="up" delay={i + 1} className="stat-card stat-card-animated">
          <div className="stat-label">{stat.label}</div>
          <AnimatedCounter end={String(stat.value)} className="stat-number" />
          <div className="stat-subtext">{stat.subtext}</div>
        </Reveal>
      ))}
    </div>
  );
}

function Timeline({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="experience-timeline">
      {items.map((exp, i) => {
        const points = Array.isArray(exp.points) ? exp.points : [];
        return (
          <div key={exp.id || `${exp.company}-${exp.period}-${i}`} className="exp-card">
            <div className="exp-left">
              <div className="exp-period">{exp.period}</div>
              {exp.location && <div className="exp-location">{exp.location}</div>}
            </div>
            <div className="exp-right">
              <div className="exp-role">{exp.role}</div>
              <div className="exp-company">{exp.company}</div>
              {points.length > 0 && (
                <ul className="exp-points">
                  {points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Education({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="education-section">
      <div className="section-label" style={{ marginBottom: '1.5rem' }}>Education</div>
      {items.map((edu, i) => (
        <div key={edu.id || `${edu.institution}-${edu.period}-${i}`} className="edu-card">
          <div className="edu-period">{edu.period}</div>
          <div className="edu-degree">{edu.degree}</div>
          <div className="edu-institution">
            {edu.institution}{edu.location ? ` — ${edu.location}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Experience({ data = {} }) {
  const processSteps = data.processSteps || [];
  const stats = data.stats || [];
  const experience = data.experience || [];
  const education = data.education || [];
  const experienceTitle = data.site?.experienceTitle || 'Crafting Scalable Solutions That Matter.';

  return (
    <section id="experience" className="section">
      <GridLines />
      <div className="content-wrapper">
        <div className="designer-section">
          <ProcessPills steps={processSteps} />

          <div className="designer-details">
            <div className="designer-title-col">
              <Reveal type="left" className="designer-label-area">
                <div className="section-label">Experience</div>
              </Reveal>
              <Reveal type="up" delay={1} className="designer-title-area">
                <h2 className="designer-heading">{experienceTitle}</h2>
              </Reveal>
            </div>

            <Stats stats={stats} />
          </div>

          <Timeline items={experience} />
          <Education items={education} />
        </div>
      </div>
    </section>
  );
}
