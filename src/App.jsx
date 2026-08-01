import { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { Reveal, AnimatedCounter } from './components/AnimatedSection';
import './App.css';
import './animations.css';
import './mobile.css';

// Reusable Grid Lines Overlay component to match the Figma visual architecture
const GridLines = () => (
  <div className="grid-lines-bg" aria-hidden="true">
    <div className="grid-col-line"></div>
    <div className="grid-col-line"></div>
    <div className="grid-col-line"></div>
    <div className="grid-col-line"></div>
  </div>
);

// Custom SVG Brand Icons since Lucide-React deprecated/removed them in newer releases
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GlobeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const TrophyIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="8 21 12 17 16 21" />
    <line x1="12" y1="17" x2="12" y2="11" />
    <path d="M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4" />
    <path d="M17 4h3a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4" />
    <rect x="7" y="2" width="10" height="9" rx="2" />
  </svg>
);

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);

  const projects = [
    {
      id: 1,
      meta: "Python + AI — Jul 2026",
      name: "Brain Simulator",
      desc: "Advanced cognitive simulation framework modeling neurochemical dynamics, memory systems, and decision-making. Creates a virtual brain that learns, adapts, and responds using biologically-inspired algorithms.",
      tags: ["Python", "AI", "Neuroscience", "Simulation"],
      link: "https://github.com/Gabrial-8467/Brain-Simulator"
    },
    {
      id: 2,
      meta: "Flutter App — Mar 2026 – Jun 2026",
      name: "UniNest",
      desc: "A cross-platform Flutter application for accommodation booking with role-based authentication and real-time backend integration for food delivery.",
      tags: ["Flutter", "Firebase", "Role-Based Auth"],
      link: "https://github.com/Gabrial-8467/UniNest-Backend"
    },

    {
      id: 3,
      meta: "Python — Mar 2026",
      name: "Vyom — Custom Language",
      desc: "An experimental Python-based custom programming language built for fun. Open to contributors — a creative exploration of language design and interpreter architecture.",
      tags: ["Python", "Language Design", "Open Source"],
      link: "https://github.com/Gabrial-8467/vyom"
    },
    {
      id: 4,
      meta: "Python + AI — Dec 2025",
      name: "Virtual Mouse",
      desc: "AI-powered virtual mouse using MediaPipe, OpenCV, and PyAutoGUI. Detects hand landmarks via webcam to control the cursor gesture-based — no physical mouse needed.",
      tags: ["Python", "MediaPipe", "OpenCV", "PyAutoGUI"],
      link: "https://github.com/Gabrial-8467/virtual_mouse_by_GabrialDeora"
    },
    {
      id: 5,
      meta: "React Native — Nov 2025",
      name: "G News App",
      desc: "A cross-platform mobile news aggregator built with React Native that fetches and displays categorized news articles from live APIs with a clean, responsive interface.",
      tags: ["React Native", "REST API", "Mobile App"],
      link: "https://github.com/Gabrial-8467/g_news"
    },
    {
      id: 6,
      meta: "React Native — Oct 2025",
      name: "Calculator",
      desc: "A clean, feature-rich calculator mobile app built with React Native. Supports standard arithmetic operations with a polished, cross-platform UI.",
      tags: ["React Native", "Mobile App"],
      link: "https://github.com/Gabrial-8467/calculator"
    },
    {
      id: 7,
      meta: "MERN Stack — Aug 2025",
      name: "PlanPocket",
      desc: "Full-stack expense tracker built with the MERN stack. Manage expenses, income, categories, loans & savings with a personal finance dashboard.",
      tags: ["MongoDB", "Express.js", "React", "Node.js"],
      link: "https://github.com/Gabrial-8467/PlanPocket"
    },
    {
      id: 8,
      meta: "Full Stack — Jun 2025 – Jul 2025",
      name: "Pizza Delivery App",
      desc: "Built with React, Bootstrap, Express.js, and MongoDB. Features product listings, a cart, checkout system, and login/sign-up functionality.",
      tags: ["React", "Bootstrap", "Express.js", "MongoDB"],
      link: "https://github.com/Gabrial-8467/pizzadelivery_web_app"
    },
    {
      id: 9,
      meta: "MERN Stack — May 2025",
      name: "IntelliQuiz",
      desc: "An intelligent quiz application built with the MERN stack featuring multiple categories, score tracking, and timed challenges. Designed for an engaging and competitive learning experience.",
      tags: ["MongoDB", "Express.js", "React", "Node.js"],
      link: "https://github.com/Gabrial-8467/intelliquiz"
    },
    {
      id: 10,
      meta: "JavaScript — Sep 2024",
      name: "Weather App",
      desc: "A real-time weather application that fetches live weather data via API and displays current conditions, temperature, and forecasts with a clean UI.",
      tags: ["JavaScript", "REST API", "HTML", "CSS"],
      link: "https://github.com/Gabrial-8467/MY_WEATHER_APP"
    },
    {
      id: 11,
      meta: "JavaScript — Sep 2024",
      name: "To-Do App",
      desc: "A task management app with add, complete, and delete functionality. Features local storage persistence and a minimal, distraction-free interface.",
      tags: ["JavaScript", "HTML", "CSS", "LocalStorage"],
      link: "https://github.com/Gabrial-8467/my_to-do_app"
    },
    {
      id: 12,
      meta: "HTML — Dec 2023",
      name: "Carbon Footprinter",
      desc: "A web tool to calculate and visualize an individual's carbon footprint based on lifestyle inputs, promoting environmental awareness through interactive UI.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/Gabrial-8467/Carbonfootprinter"
    },
    {
      id: 13,
      meta: "Python — Oct 2023",
      name: "Desk Assistant Prototype",
      desc: "A Python-based desktop assistant prototype with voice command support and basic automation tasks — an early exploration into AI-powered desktop tools.",
      tags: ["Python", "Voice Recognition", "Automation"],
      link: "https://github.com/Gabrial-8467/deskassitant-prototype"
    }
  ];

  const skills = [
    {
      category: "Frontend",
      items: ["React JS", "Vue.js", "TypeScript", "JavaScript", "HTML5 / CSS3", "Tailwind CSS", "Bootstrap"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Express JS"]
    },
    {
      category: "Database",
      items: ["MongoDB", "MySQL", "PostgreSQL", "Firebase"]
    },
    {
      category: "Mobile & Cross-Platform",
      items: ["Flutter", "Firebase Auth", "Role-Based Auth"]
    },
    {
      category: "Python & AI/ML",
      items: ["Python", "MediaPipe", "OpenCV", "PyAutoGUI", "Voice Recognition"]
    },
    {
      category: "Tools & Other",
      items: ["Git & GitHub", "REST APIs", "Vite", "VS Code", "Postman", "Linux"]
    }
  ];

  const services = [
    { num: "01", name: "Full Stack Web Development" },
    { num: "02", name: "React JS & Vue.js Development" },
    { num: "03", name: "Node.js & Express REST APIs" },
    { num: "04", name: "MongoDB, MySQL & PostgreSQL" },
    { num: "05", name: "Flutter Mobile Apps" },
    { num: "06", name: "Python & AI Tool Development" },
    { num: "07", name: "Responsive UI Design" }
  ];

  const experience = [
    {
      period: "Feb 2026 — Present",
      role: "Intern Web Developer",
      company: "Vibrantick Infotech Solutions",
      location: "Mohali",
      points: [
        "Developing websites using React JS, Node.js, and Vue.js, enhancing user experience and functionality.",
        "Conducting code reviews to ensure best practices and improve code quality.",
        "Utilizing MySQL and PostgreSQL for database management and query optimization.",
        "Working on live production projects for real clients — gaining hands-on experience in end-to-end feature development and deployment."
      ]
    },
    {
      period: "Jun 2025 — Jul 2025",
      role: "Intern Trainee",
      company: "Techlive Solutions",
      location: "Mohali",
      points: [
        "Developed websites using React JS and Node.js, enhancing user experience.",
        "Conducted code reviews to ensure best practices and improve code quality.",
        "Utilized MongoDB for database management, optimizing data retrieval and storage."
      ]
    }
  ];

  const education = [
    {
      period: "Sep 2022 — Jun 2026",
      degree: "B.Tech CSE",
      institution: "CT University",
      location: "Ludhiana"
    },
    {
      period: "Mar 2022",
      degree: "10+2 (Non-Medical)",
      institution: "Teja Singh Sutantar Memorial Sr. Sec. School",
      location: "Ludhiana"
    }
  ];

  const achievements = [
    {
      event: "Smart India Hackathon — LPU 2025",
      year: "2025",
      org: "Lovely Professional University"
    },
    {
      event: "Smart India Hackathon — CT University 2025",
      year: "2025",
      org: "CT University, Ludhiana"
    },
    {
      event: "Smart India Hackathon — CT University 2023",
      year: "2023",
      org: "CT University, Ludhiana"
    }
  ];

  const [navDark, setNavDark] = useState(false);

  useEffect(() => {
    const darkSections = document.querySelectorAll('.section-dark, .footer-section');
    const header = document.querySelector('.header');

    const checkNavColor = () => {
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      let onDark = false;
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerBottom && rect.bottom >= 0) {
          onDark = true;
        }
      });
      setNavDark(onDark);
    };

    checkNavColor();
    window.addEventListener('scroll', checkNavColor, { passive: true });
    return () => window.removeEventListener('scroll', checkNavColor);
  }, []);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="layout-container">
      {/* Header / Navbar */}
      <header className={`header${navDark ? ' nav-dark' : ''}`}>
        <div className="content-wrapper header-content">
          <div className={`logo${navDark ? ' nav-dark' : ''}`}>Gabrial Deora</div>
          <button
            className={`menu-btn${navDark ? ' nav-dark' : ''}`}
            onClick={toggleNav}
            aria-label="Open navigation menu"
            type="button"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Navigation Drawer Menu */}
      <div className={`nav-drawer ${isNavOpen ? 'open' : ''}`}>
        <button
          className="nav-drawer-close"
          onClick={toggleNav}
          aria-label="Close navigation menu"
          type="button"
        >
          <X size={32} />
        </button>

        <nav className="nav-drawer-links">
          <a href="#about" onClick={toggleNav}>About Me</a>
          <a href="#experience" onClick={toggleNav}>Experience</a>
          <a href="#projects" onClick={toggleNav}>Projects</a>
          <a href="#skills" onClick={toggleNav}>Skills</a>
          <a href="#hackathons" onClick={toggleNav}>Hackathons</a>
          <a href="#contact" onClick={toggleNav}>Contact</a>
        </nav>

        <div className="nav-drawer-footer">
          <p>© 2026 Gabrial Deora. All Rights Reserved.</p>
        </div>
      </div>
      {isNavOpen && <div className="nav-backdrop" onClick={toggleNav}></div>}

      {/* Hero Section */}
      <section className="hero">
        <GridLines />
        <div className="hero-bg-text-container hero-bg-text-animated">
          <span className="hero-bg-text">Developer</span>
        </div>

        <div className="content-wrapper">
          <div className="hero-content">
            <div className="hero-left-col">
              <div>
                <div className="hero-badge hero-badge-animated">Full Stack</div>
                <p className="hero-bio">
                  I'm Gabrial Deora, a Full Stack Web Developer with hands-on internship experience building responsive, high-performance web applications.
                </p>
              </div>
              <button
                className="hero-scroll-btn"
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                aria-label="Scroll to About section"
                type="button"
              >
                <ArrowDownRight size={24} />
              </button>
            </div>

            <div className="hero-title-container">
              <h1 className="hero-title hero-title-animated">Building Web Apps That Actually Perform</h1>
            </div>

            <div className="hero-interactive-zone">
              <div className="hero-cta-left">
                <a href="#projects" className="btn-primary btn-primary-pulse">
                  View My Work
                  <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
                </a>
              </div>

              <div className="hero-image-wrapper">
                <img
                  src="/hero.png"
                  alt="Developer tech graphic"
                  className="hero-portrait hero-portrait-animated"
                />
              </div>

              <div className="hero-cta-right">
                <a href="#contact" className="btn-primary">
                  Let's Work Together
                  <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="section section-dark">
        <GridLines />
        <div className="content-wrapper">
          <div className="about-grid">
            <Reveal type="left" className="about-col-1">
              <div className="section-label">About Me</div>
              <div className="socials-list">
                {[['https://linkedin.com/in/gabrial-deora/', <LinkedinIcon />, 'LinkedIn'],
                ['https://github.com/Gabrial-8467', <GithubIcon />, 'GitHub'],
                ['https://gabrialdeora.vercel.app', <GlobeIcon />, 'Portfolio']].map(([href, icon, label], i) => (
                  <Reveal key={label} as="a" type="up" delay={i + 1} href={href} target="_blank" rel="noreferrer" className="social-pill-btn">
                    {icon} {label}
                  </Reveal>
                ))}
              </div>
            </Reveal>
            <Reveal type="up" delay={1} className="about-col-2">
              <h2 className="about-title">The Developer Shaping Modern Web Experiences</h2>
            </Reveal>
            <Reveal type="up" delay={2} className="about-col-3">
              <p className="about-desc">
                I'm a dynamic Full Stack Web Developer with strong internship experience in crafting responsive and high-performance web applications. I specialize in React.js, Node.js, and MongoDB.
              </p>
            </Reveal>
            <Reveal type="up" delay={3} className="about-col-4">
              <p className="about-desc">
                My commitment is to enhancing user experience through clean, scalable code and modern design. I'm passionate about leveraging technology to tackle real-world challenges and continuously improving code quality.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience & Stats Section */}
      <section id="experience" className="section">
        <GridLines />
        <div className="content-wrapper">
          <div className="designer-section">
            {/* Code, Build, Ship flow banner */}
            <div className="process-pills-row">
              <Reveal as="div" type="scale" delay={1} className="process-pill grey">Code</Reveal>
              <Reveal as="div" type="scale" delay={2} className="process-pill blue">Build</Reveal>
              <Reveal as="div" type="scale" delay={3} className="process-pill black"><ArrowUpRight size={32} /></Reveal>
              <Reveal as="div" type="scale" delay={4} className="process-pill grey">Ship</Reveal>
            </div>

            <div className="designer-details">
              <div className="designer-title-col">
                <Reveal type="left" className="designer-label-area">
                  <div className="section-label">Experience</div>
                </Reveal>
                <Reveal type="up" delay={1} className="designer-title-area">
                  <h2 className="designer-heading">Crafting Scalable Solutions That Matter.</h2>
                </Reveal>
              </div>

              <div className="stats-grid">
                <Reveal type="up" delay={1} className="stat-card stat-card-animated">
                  <div className="stat-label">MERN Stack</div>
                  <AnimatedCounter end="3" className="stat-number" />
                  <div className="stat-subtext">PlanPocket, IntelliQuiz, Pizza Delivery</div>
                </Reveal>
                <Reveal type="up" delay={2} className="stat-card stat-card-animated">
                  <div className="stat-label">Mobile Apps</div>
                  <AnimatedCounter end="3" className="stat-number" />
                  <div className="stat-subtext">UniNest (Flutter), G News & Calculator (RN)</div>
                </Reveal>
                <Reveal type="up" delay={3} className="stat-card stat-card-animated">
                  <div className="stat-label">Python & AI</div>
                  <AnimatedCounter end="4" className="stat-number" />
                  <div className="stat-subtext">Brain Simulator, Virtual Mouse & more</div>
                </Reveal>
                <Reveal type="up" delay={4} className="stat-card stat-card-animated">
                  <div className="stat-label">Frontend JS</div>
                  <AnimatedCounter end="3" className="stat-number" />
                  <div className="stat-subtext">Weather, To-Do & Carbon Footprinter</div>
                </Reveal>
              </div>
            </div>

            {/* Employment History */}
            <div className="experience-timeline">
              {experience.map((exp, idx) => (
                <div key={idx} className="exp-card">
                  <div className="exp-left">
                    <div className="exp-period">{exp.period}</div>
                    <div className="exp-location">{exp.location}</div>
                  </div>
                  <div className="exp-right">
                    <div className="exp-role">{exp.role}</div>
                    <div className="exp-company">{exp.company}</div>
                    <ul className="exp-points">
                      {exp.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="education-section">
              <div className="section-label" style={{ marginBottom: '1.5rem' }}>Education</div>
              {education.map((edu, idx) => (
                <div key={idx} className="edu-card">
                  <div className="edu-period">{edu.period}</div>
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-institution">{edu.institution} — {edu.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="section section-dark">
        <GridLines />
        <div className="content-wrapper">
          <div className="projects-grid">
            <Reveal type="left" className="projects-col-1">
              <div className="section-label">Featured Projects</div>
              <div className="projects-cta-container">
                <a href="https://github.com/Gabrial-8467" target="_blank" rel="noreferrer" className="btn-primary">
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
              {projects.map((proj, idx) => (
                <Reveal key={proj.id} type="up" delay={Math.min(idx % 4 + 1, 4)} className="project-card project-dev-card">
                  <div className="project-dev-header">
                    <div className="project-dev-meta">{proj.meta}</div>
                    <a href={proj.link} className="project-dev-link" aria-label={`View ${proj.name}`}>
                      <ArrowUpRight size={20} />
                    </a>
                  </div>
                  <div className="project-dev-name">{proj.name}</div>
                  <p className="project-dev-desc">{proj.desc}</p>
                  <div className="project-dev-tags">
                    {proj.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <GridLines />
        <div className="content-wrapper">
          <div className="services-section">
            <Reveal type="left" className="services-left-col">
              <div className="section-label">What I Do</div>
              <h2 className="services-title">Tech Stack & Skills</h2>
            </Reveal>

            <div className="services-right-col">
              {services.map((service, index) => (
                <div
                  key={service.num}
                  className={`service-accordion-item ${activeService === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                >
                  <div className="service-title-container">
                    <span className="service-num">{service.num}</span>
                    <span className="service-name">{service.name}</span>
                  </div>
                  <div className="service-arrow-circle">
                    {activeService === index ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Tags Grid */}
          <div className="skills-tags-section">
            {skills.map((group, idx) => (
              <Reveal key={idx} type="up" delay={Math.min(idx + 1, 6)} className="skills-group">
                <div className="skills-group-title">{group.category}</div>
                <div className="skills-group-tags">
                  {group.items.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Journey Section */}
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
                <Reveal key={idx} type="up" delay={idx + 1} className="achievement-item-light">
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

      {/* Footer / Contact Section */}
      <footer id="contact" className="footer-section">
        <GridLines />
        <div className="footer-bg-text-container">
          <span className="footer-bg-text">Deora</span>
        </div>

        <div className="content-wrapper">
          <div className="footer-content">
            <Reveal type="up" className="footer-left-col">
              <div className="footer-logo">Gabrial</div>
              <p className="footer-bio">
                A passionate Full Stack Web Developer with hands-on experience in building responsive, scalable web applications using the MERN stack.
              </p>
            </Reveal>

            <Reveal type="up" delay={1} className="footer-links-col">
              <div className="footer-links-title">Navigation</div>
              <div className="footer-links-list">
                <a href="#about">• About Me</a>
                <a href="#experience">• Experience</a>
                <a href="#projects">• Projects</a>
                <a href="#skills">• Skills</a>
              </div>
            </Reveal>

            <Reveal type="up" delay={2} className="footer-contact-col">
              <div className="footer-links-title">Contact</div>
              <div className="footer-contact-info">
                <a href="tel:+917888695062">• +91 7888695062</a>
                <a href="mailto:gabrialdeora003@gmail.com">• gabrialdeora003@gmail.com</a>
                <a href="https://github.com/Gabrial-8467" target="_blank" rel="noreferrer">• github.com/Gabrial-8467</a>
              </div>
            </Reveal>

            <Reveal type="up" delay={3} className="footer-right-col">
              <a href="mailto:gabrialdeora003@gmail.com" className="btn-primary">
                Let's Work Together
                <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
              </a>
              <p className="copyright">
                Copyright© 2026 Gabrial Deora. All Rights Reserved.
              </p>
            </Reveal>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
