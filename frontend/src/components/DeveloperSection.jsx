import { ArrowUpRight, Terminal } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import MagneticButton from './MagneticButton';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function DeveloperSection({ site = {} }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const githubUrl = site.github || 'https://github.com/Gabrial-8467';

  return (
    <section id="developer" ref={sectionRef} className="dev-modern-section">
      <div className="section-container">
        <div className={`dev-cta-card ${isInView ? 'in-view' : ''}`}>
          <div className="dev-card-left">
            <div className="card-badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}>
              <Terminal size={14} color="#38bdf8" /> Open Source &amp; Engineering
            </div>
            <h2 className="dev-card-heading">Explore what I&apos;m building.</h2>
            <p className="dev-card-subtext">
              Browse public repositories, language experiments, cognitive simulators, and real production web apps directly on GitHub.
            </p>

            <div style={{ marginTop: 24 }}>
              <MagneticButton
                as="a"
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-light btn-lg"
                data-cursor="GITHUB"
              >
                <GithubIcon size={18} />
                <span>Visit GitHub Profile</span>
                <ArrowUpRight size={16} />
              </MagneticButton>
            </div>
          </div>

          {/* Terminal Code Mockup */}
          <div className="dev-card-right">
            <div className="terminal-code-box">
              <div className="terminal-header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="terminal-title">bash — 80x24</span>
              </div>
              <div className="terminal-body">
                <p><span className="t-prompt">$</span> curl -s https://api.github.com/users/Gabrial-8467</p>
                <p className="t-out"><span className="tok-key">&quot;login&quot;</span>: <span className="tok-str">&quot;Gabrial-8467&quot;</span>,</p>
                <p className="t-out"><span className="tok-key">&quot;bio&quot;</span>: <span className="tok-str">&quot;Full Stack Web Developer | MERN &amp; Flutter&quot;</span>,</p>
                <p className="t-out"><span className="tok-key">&quot;public_repos&quot;</span>: <span className="tok-num">30+</span>,</p>
                <p className="t-out"><span className="tok-key">&quot;status&quot;</span>: <span className="tok-str">&quot;Active &amp; Shipping&quot;</span></p>
                <p className="t-cursor"><span className="t-prompt">$</span> <span className="blink-block" /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
