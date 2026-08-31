import { Reveal, AnimatedCounter } from './AnimatedSection';
import GridLines from './GridLines';
import { TrophyIcon } from './Icons';
import { achievements } from '../data';

export default function Hackathons() {
  return (
    <section id="hackathons" className="section achievements-section-wrap">
      <GridLines />
      <div className="content-wrapper">
        <div className="achievements-section">
          <div className="achievements-header">
            <Reveal type="up">
              <div className="section-label" style={{ color: 'var(--color-blue)' }}>Hackathon Journey</div>
              <h2 className="achievements-title-light">Competing, Learning & Growing</h2>
              <p className="achievements-subtitle">Participated in India's most prestigious national-level innovation challenges, collaborating with teams to solve real-world problems under pressure.</p>
            </Reveal>
            <div className="achievements-badge-row">
              <Reveal type="scale" delay={1} className="achievements-count-badge">
                <AnimatedCounter end="3" className="achievements-count-num" />
                <span className="achievements-count-label">SIH<br />Participations</span>
              </Reveal>
            </div>
          </div>
          <div className="achievements-list">
            {achievements.map((ach, idx) => (
              <Reveal key={`${ach.event}-${ach.year}`} type="up" delay={idx + 1} className="achievement-item-light">
                <div className="achievement-icon-wrap">
                  <TrophyIcon className="achievement-icon" />
                </div>
                <div className="achievement-text">
                  <span className="achievement-label">Certificate of Participation · {ach.year}</span>
                  <span className="achievement-name">{ach.event}</span>
                  <span className="achievement-org">{ach.org}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
