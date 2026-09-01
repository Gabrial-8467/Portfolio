import { Trophy, Award, Calendar, Building } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function Hackathons({ achievements = [] }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const list = Array.isArray(achievements) ? achievements : [];

  if (list.length === 0) return null;

  return (
    <section id="hackathons" ref={sectionRef} className="hackathons-modern-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <div className="card-badge">
              <Trophy size={14} color="#f59e0b" /> Competitions &amp; Hackathons
            </div>
            <h2 className="section-main-title">Hackathon Achievements</h2>
          </div>
          <p className="section-header-desc">
            Proven track record participating in national hackathons and competitive engineering sprints.
          </p>
        </div>

        {/* Hackathon Cards Grid */}
        <div className={`hackathons-grid ${isInView ? 'in-view' : ''}`}>
          {list.map((item, idx) => (
            <div
              key={item.event || idx}
              className="hackathon-card"
              data-cursor="AWARD"
            >
              <div className="hackathon-card-header">
                <div className="hackathon-icon-box">
                  <Award size={20} />
                </div>
                <span className="hackathon-year-pill">
                  <Calendar size={12} /> {item.year || '2025'}
                </span>
              </div>

              <h3 className="hackathon-event-title">{item.event}</h3>
              {item.org && (
                <div className="hackathon-org-name">
                  <Building size={14} /> {item.org}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
