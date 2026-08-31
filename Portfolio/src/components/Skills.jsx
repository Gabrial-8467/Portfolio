import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';

function Services({ services = [] }) {
  const [activeService, setActiveService] = useState(0);

  if (!services.length) return null;

  const select = (index) => setActiveService(index);

  return (
    <div className="services-right-col">
      {services.map((service, index) => {
        const isActive = activeService === index;
        return (
          <div
            key={service.num || `${service.name}-${index}`}
            className={`service-accordion-item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => select(index)}
            onClick={() => select(index)}
          >
            <div className="service-title-container">
              <span className="service-num">{service.num || `0${index + 1}`}</span>
              <span className="service-name">{service.name}</span>
            </div>
            <div className="service-arrow-circle">
              {isActive ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillsTags({ skills = [] }) {
  if (!skills.length) return null;

  return (
    <div className="skills-tags-section">
      {skills.map((group, idx) => {
        const items = Array.isArray(group.items) ? group.items : [];
        return (
          <Reveal key={group.category || idx} type="up" delay={Math.min(idx + 1, 6)} className="skills-group">
            <div className="skills-group-title">{group.category}</div>
            {items.length > 0 && (
              <div className="skills-group-tags">
                {items.map((skill, sIdx) => (
                  <span key={`${skill}-${sIdx}`} className="skill-tag">{skill}</span>
                ))}
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

export default function Skills({ services = [], skills = [] }) {
  return (
    <section id="skills" className="section">
      <GridLines />
      <div className="content-wrapper">
        <div className="services-section">
          <Reveal type="left" className="services-left-col">
            <div className="section-label">What I Do</div>
            <h2 className="services-title">Tech Stack & Skills</h2>
          </Reveal>

          <Services services={services} />
        </div>

        <SkillsTags skills={skills} />
      </div>
    </section>
  );
}
