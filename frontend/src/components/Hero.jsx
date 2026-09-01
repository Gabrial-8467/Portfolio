import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { resolveAssetUrl } from '../api/client';
import heroFallback from '../assets/hero.png';

export default function Hero({ site = {} }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const name = site.name || 'Gabrial Deora';
  const heroBadge = site.heroBadge || 'Available for full-time & contract roles';
  const heroTitle = site.heroTitle || 'Building Web Apps That Actually Perform';
  const heroBio = site.heroBio || site.bio || 'Full Stack Developer with hands-on experience building responsive, high-performance web applications with React, Node.js, and MongoDB.';
  const heroBgText = site.heroBgText || 'DEVELOPER';
  const rawAvatarUrl = site.avatarUrl || '/hero.png';
  const avatarSrc = resolveAssetUrl(rawAvatarUrl);

  useEffect(() => {
    // Only desktop parallax
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Split name for dramatic character/word reveal
  const nameParts = name.toUpperCase().split(' ');

  return (
    <section id="hero" ref={heroRef} className="hero-modern-section">
      {/* Background Parallax Typography & Grid */}
      <div
        className="hero-ambient-backdrop"
        style={{
          transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 6}px, 0)`,
        }}
      >
        <span className="hero-giant-bg-text">{heroBgText}</span>
      </div>

      <div className="hero-content-container">
        {/* Top Eyebrow & Status */}
        <div className="hero-eyebrow-row">
          <div className="hero-status-pill">
            <span className="pulse-dot" />
            <span>{heroBadge}</span>
          </div>

          <div className="hero-intro-text">
            <span>HELLO, I&apos;M {name.split(' ')[0]?.toUpperCase()}</span>
          </div>
        </div>

        {/* Main Giant Name Heading with Staggered Reveal */}
        <div className="hero-display-heading">
          {nameParts.map((word, wIdx) => (
            <div key={`${word}-${wIdx}`} className="hero-name-word">
              {word.split('').map((char, cIdx) => (
                <span
                  key={`${word}-${char}-${cIdx}`}
                  className="hero-split-char"
                  style={{ animationDelay: `${wIdx * 120 + cIdx * 35 + 100}ms` }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Dynamic Tagline & Supporting Copy */}
        <div className="hero-narrative-grid">
          <div>
            <h2 className="hero-tagline">{heroTitle}</h2>
            <p className="hero-description">{heroBio}</p>

            {/* Magnetic CTA Action Buttons */}
            <div className="hero-cta-group">
              <MagneticButton
                as="a"
                href="#projects"
                className="btn-primary btn-lg"
                data-cursor="VIEW"
                onClick={(e) => scrollToSection(e, 'projects')}
              >
                <span>View Projects</span>
                <span className="btn-arrow-circle"><ArrowUpRight size={18} /></span>
              </MagneticButton>

              <MagneticButton
                as="a"
                href="#contact"
                className="btn-secondary btn-lg"
                data-cursor="TALK"
                onClick={(e) => scrollToSection(e, 'contact')}
              >
                <span>Let&apos;s Talk</span>
                <ArrowDownRight size={18} />
              </MagneticButton>
            </div>
          </div>

          {/* Interactive Floating Parallax Visual Scene with Avatar */}
          <div className="hero-visual-column">
            <div
              className="hero-floating-card-scene"
              style={{
                transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px, 0)`,
              }}
            >
              {/* Image Card Container */}
              <div className="hero-avatar-card" data-cursor="GABRIAL">
                <div className="avatar-img-frame">
                  <img
                    src={avatarSrc}
                    alt={name}
                    className="avatar-photo"
                    onError={(e) => {
                      if (e.currentTarget.src !== heroFallback) {
                        e.currentTarget.src = heroFallback;
                      }
                    }}
                  />
                  <div className="avatar-overlay-gradient" />
                </div>

                <div className="avatar-caption-bar">
                  <div>
                    <div className="avatar-name">{name}</div>
                    <div className="avatar-role">Full Stack Web Developer</div>
                  </div>
                  <span className="avatar-online-indicator">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
