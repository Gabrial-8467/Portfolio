import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function About({ site = {}, socials = [], stats = [] }) {
  const [sectionRef, isInView] = useInView();
  const statementRef = useRef(null);
  const [highlightRatio, setHighlightRatio] = useState(0);

  const statement = 'I build digital products where clean engineering meets thoughtful interaction design.';
  const words = statement.split(' ');

  const aboutTitle = site.aboutTitle || 'The Developer Shaping Modern Web Experiences';
  const aboutDesc1 = site.aboutDesc1 || "I'm a dynamic Full Stack Web Developer with strong internship experience crafting responsive, high-performance web applications using React.js, Node.js, and MongoDB.";
  const aboutDesc2 = site.aboutDesc2 || "My commitment is to enhancing user experience through clean, scalable architecture and modern design systems. I specialize in turning complex requirements into seamless digital products.";

  useEffect(() => {
    const handleScroll = () => {
      const node = statementRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the statement has entered the viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.25;

      const progress = (start - rect.top) / (start - end);
      setHighlightRatio(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-modern-section">
      <div className="section-container">
        {/* Large Scroll-Driven Statement */}
        <div ref={statementRef} className="about-statement-box">
          <p className="about-statement-text">
            {words.map((word, idx) => {
              const wordThreshold = idx / words.length;
              const isLit = highlightRatio >= wordThreshold;
              return (
                <span
                  key={`${word}-${idx}`}
                  className={`statement-word ${isLit ? 'lit' : ''}`}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>

        {/* Narrative & Highlights Grid */}
        <div className={`about-detail-grid ${isInView ? 'in-view' : ''}`}>
          {/* Left Narrative Column */}
          <div className="about-narrative-card">
            <div className="card-badge">
              <Sparkles size={14} /> Philosophy &amp; Experience
            </div>
            <h3 className="about-narrative-title">{aboutTitle}</h3>
            <p className="about-narrative-body">{aboutDesc1}</p>
            <p className="about-narrative-body">{aboutDesc2}</p>

            {/* Social Proof Pills */}
            <div className="about-socials-row">
              {Array.isArray(socials) && socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill-link"
                  data-cursor="OPEN"
                >
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Metrics / Stats Column */}
          <div className="about-stats-column">
            {Array.isArray(stats) && stats.map((stat, i) => (
              <div
                key={stat.label || i}
                className="stat-metric-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="stat-card-header">
                  <span className="stat-card-label">{stat.label}</span>
                  <span className="stat-card-value">{stat.value}</span>
                </div>
                {stat.subtext && (
                  <p className="stat-card-subtext">{stat.subtext}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
