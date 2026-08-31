import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';
import { services, skills } from '../data';

function Services() {
  const [activeService, setActiveService] = useState(0);

  const select = (index) => setActiveService(index);

  return (
    <div className="services-right-col">
      {services.map((service, index) => {
        const isActive = activeService === index;
        return (
          <div
            key={service.num}
            className={`service-accordion-item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => select(index)}
            onClick={() => select(index)}
          >
            <div className="service-title-container">
              <span className="service-num">{service.num}</span>
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

function SkillsTags() {
  return (
    <div className="skills-tags-section">
      {skills.map((group, idx) => (
        <Reveal key={group.category} type="up" delay={Math.min(idx + 1, 6)} className="skills-group">
          <div className="skills-group-title">{group.category}</div>
          <div className="skills-group-tags">
            {group.items.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <GridLines />
      <div className="content-wrapper">
        <div className="services-section">
          <Reveal type="left" className="services-left-col">
            <div className="section-label">What I Do</div>
            <h2 className="services-title">Tech Stack & Skills</h2>
          </Reveal>

          <Services />
        </div>

        <SkillsTags />
      </div>
    </section>
  );
}
