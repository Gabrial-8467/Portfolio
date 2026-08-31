import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';

export default function Projects({ projects = [], site = {} }) {
  const allProjectsHref = site.github || 'https://github.com/Gabrial-8467';

  return (
    <section id="projects" className="section section-dark">
      <GridLines />
      <div className="content-wrapper">
        <div className="projects-grid">
          <Reveal type="left" className="projects-col-1">
            <div className="section-label">Featured Projects</div>
            <div className="projects-cta-container">
              <a href={allProjectsHref} target="_blank" rel="noreferrer" className="btn-primary">
                All Projects
                <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
              </a>
            </div>
          </Reveal>

          <Reveal type="up" delay={1} className="projects-col-2">
            <h2 className="projects-title">
              Portfolio<br />Highlights
            </h2>
          </Reveal>

          <div className="projects-col-3-4 projects-dev-grid">
            {projects.map((proj, idx) => {
              const tags = Array.isArray(proj.tags) ? proj.tags : [];
              return (
                <Reveal
                  key={proj.id || `${proj.name}-${idx}`}
                  type="up"
                  delay={Math.min((idx % 4) + 1, 4)}
                  className="project-card project-dev-card"
                >
                  <div className="project-dev-header">
                    <div className="project-dev-meta">{proj.meta}</div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="project-dev-link"
                        aria-label={`View ${proj.name}`}
                      >
                        <ArrowUpRight size={20} />
                      </a>
                    )}
                  </div>
                  <div className="project-dev-name">{proj.name}</div>
                  <p className="project-dev-desc">{proj.desc}</p>
                  {tags.length > 0 && (
                    <div className="project-dev-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="project-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
