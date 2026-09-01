import { useState, useRef } from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const tags = Array.isArray(project.tags) ? project.tags : [];
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      className={`project-showcase-card ${isHovered ? 'hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="VIEW"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Top Meta Bar */}
      <div className="project-card-topbar">
        <div className="project-number">{projectNumber}</div>
        <div className="project-meta-tag">{project.meta || 'Full Stack Project'}</div>
      </div>

      {/* Title & Description */}
      <div className="project-content-block">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-desc">{project.desc}</p>

        {/* Tech Stack Pills */}
        <div className="project-tags-list">
          {tags.map((tag) => (
            <span key={tag} className="tech-tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Link Footer */}
      <div className="project-card-footer">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="project-action-link"
            data-cursor="OPEN"
          >
            <span>Explore Repository</span>
            <span className="action-circle-icon"><ArrowUpRight size={16} /></span>
          </a>
        ) : (
          <span className="project-action-link disabled">Production Internal</span>
        )}
      </div>
    </div>
  );
}

export default function Projects({ projects = [] }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const projectList = Array.isArray(projects) && projects.length > 0 ? projects : [];

  return (
    <section id="projects" ref={sectionRef} className="projects-modern-section">
      <div className="section-container">
        {/* Section Heading */}
        <div className="section-header-row">
          <div>
            <div className="card-badge">
              <Code2 size={14} /> Selected Works
            </div>
            <h2 className="section-main-title">Engineered to Perform</h2>
          </div>
          <p className="section-header-desc">
            A curated showcase of full-stack web applications, AI frameworks, and distributed mobile tools.
          </p>
        </div>

        {/* Projects Grid */}
        <div className={`projects-showcase-grid ${isInView ? 'in-view' : ''}`}>
          {projectList.map((project, index) => (
            <ProjectCard
              key={project.name || index}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
