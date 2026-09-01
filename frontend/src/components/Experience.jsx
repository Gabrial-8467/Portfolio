import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function Experience({ data = {} }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const experienceList = Array.isArray(data.experience) ? data.experience : [];
  const educationList = Array.isArray(data.education) ? data.education : [];

  return (
    <section id="experience" ref={sectionRef} className="experience-modern-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <div className="card-badge">
              <Briefcase size={14} /> Career &amp; Education
            </div>
            <h2 className="section-main-title">Experience &amp; Background</h2>
          </div>
          <p className="section-header-desc">
            Hands-on software development experience across live client projects and technical computer science education.
          </p>
        </div>

        <div className={`experience-timeline-layout ${isInView ? 'in-view' : ''}`}>
          {/* Work Experience Column */}
          <div className="timeline-column">
            <h3 className="timeline-col-title">
              <Briefcase size={18} color="var(--saas-primary)" /> Work Experience
            </h3>

            <div className="timeline-items-list">
              {experienceList.map((item, idx) => (
                <div key={item.company || idx} className="timeline-card">
                  <div className="timeline-card-header">
                    <span className="timeline-period-pill">
                      <Calendar size={12} /> {item.period}
                    </span>
                    {item.location && (
                      <span className="timeline-location">
                        <MapPin size={12} /> {item.location}
                      </span>
                    )}
                  </div>

                  <h4 className="timeline-role-title">{item.role}</h4>
                  <div className="timeline-company-name">{item.company}</div>

                  {Array.isArray(item.points) && (
                    <ul className="timeline-points-list">
                      {item.points.map((pt, pIdx) => (
                        <li key={pIdx} className="timeline-point-item">
                          <CheckCircle2 size={14} color="var(--saas-primary)" style={{ flexShrink: 0, marginTop: 4 }} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className="timeline-column">
            <h3 className="timeline-col-title">
              <GraduationCap size={18} color="var(--saas-accent)" /> Education
            </h3>

            <div className="timeline-items-list">
              {educationList.map((edu, idx) => (
                <div key={edu.degree || idx} className="timeline-card">
                  <div className="timeline-card-header">
                    <span className="timeline-period-pill">
                      <Calendar size={12} /> {edu.period}
                    </span>
                    {edu.location && (
                      <span className="timeline-location">
                        <MapPin size={12} /> {edu.location}
                      </span>
                    )}
                  </div>

                  <h4 className="timeline-role-title">{edu.degree}</h4>
                  <div className="timeline-company-name">{edu.institution}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
