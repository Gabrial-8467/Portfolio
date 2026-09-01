import { useState } from 'react';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function Skills({ skills = [], services = [] }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState(null);

  const skillCategories = Array.isArray(skills) ? skills : [];
  const serviceList = Array.isArray(services) ? services : [];

  return (
    <section id="skills" ref={sectionRef} className="skills-modern-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <div className="card-badge">
              <Layers size={14} /> Technical Stack &amp; Services
            </div>
            <h2 className="section-main-title">Skills &amp; Capabilities</h2>
          </div>
          <p className="section-header-desc">
            Full-spectrum capabilities spanning high-performance client interfaces, scalable server architectures, and AI frameworks.
          </p>
        </div>

        {/* Skill Category Cards Grid */}
        <div className={`skills-categories-grid ${isInView ? 'in-view' : ''}`}>
          {skillCategories.map((cat, idx) => {
            const isHovered = activeCategory === cat.category;
            const items = Array.isArray(cat.items) ? cat.items : [];

            return (
              <div
                key={cat.category || idx}
                className={`skill-category-card ${isHovered ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory(cat.category)}
                onMouseLeave={() => setActiveCategory(null)}
                data-cursor="STACK"
              >
                <div className="skill-cat-header">
                  <h3 className="skill-cat-title">{cat.category}</h3>
                  <span className="skill-count-badge">{items.length} tools</span>
                </div>

                <div className="skill-items-wrap">
                  {items.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Services & Offerings List */}
        {serviceList.length > 0 && (
          <div className="services-showcase-block">
            <h3 className="services-title-head">
              <Sparkles size={16} color="var(--saas-primary)" /> Core Service Offerings
            </h3>

            <div className="services-list-grid">
              {serviceList.map((service, idx) => (
                <div
                  key={service.name || idx}
                  className="service-item-row"
                  data-cursor="SERVICE"
                >
                  <span className="service-number">{service.num || `0${idx + 1}`}</span>
                  <span className="service-name">{service.name}</span>
                  <span className="service-arrow"><ArrowRight size={18} /></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
