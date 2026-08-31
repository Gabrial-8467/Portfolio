import { Reveal, AnimatedCounter } from './AnimatedSection';
import GridLines from './GridLines';
import { TrophyIcon } from './Icons';

export default function Hackathons({ achievements = [], site = {} }) {
  const count = String(achievements?.length || 0);
  const title = site.hackathonsTitle || 'Competing, Learning & Growing';
  const subtitle =
    site.hackathonsSubtitle ||
    "Participated in prestigious national-level innovation challenges, collaborating with teams to solve real-world problems under pressure.";

  return (
    <section id="hackathons" className="section achievements-section-wrap">
      <GridLines />
      <div className="content-wrapper">
        <div className="achievements-section">
          <div className="achievements-header">
            <Reveal type="up">
              <div className="section-label" style={{ color: 'var(--color-blue)' }}>Hackathon Journey</div>
              <h2 className="achievements-title-light">{title}</h2>
              <p className="achievements-subtitle">{subtitle}</p>
            </Reveal>
            <div className="achievements-badge-row">
              <Reveal type="scale" delay={1} className="achievements-count-badge">
                <AnimatedCounter end={count} className="achievements-count-num" />
                <span className="achievements-count-label">Major<br />Participations</span>
              </Reveal>
            </div>
          </div>
          <div className="achievements-list">
            {achievements.map((ach, idx) => (
              <Reveal key={`${ach.event}-${ach.year}-${idx}`} type="up" delay={idx + 1} className="achievement-item-light">
                <div className="achievement-icon-wrap">
                  <TrophyIcon className="achievement-icon" />
                </div>
                <div className="achievement-text">
                  <span className="achievement-label">
                    {ach.year ? `Certificate · ${ach.year}` : 'Certificate'}
                  </span>
                  <span className="achievement-name">{ach.event}</span>
                  {ach.org && <span className="achievement-org">{ach.org}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
