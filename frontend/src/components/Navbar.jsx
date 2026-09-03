import { useState, useEffect, useMemo } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import ThemeToggle from './ThemeToggle';

const DEFAULT_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Hackathons', href: '#hackathons' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ site = {}, nav = [] }) {
  const { isScrolled } = useScrollProgress();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const siteName = site.name || 'Gabrial Deora';
  const shortName = siteName.split(' ')[0] || 'Gabrial';

  const links = useMemo(
    () =>
      (Array.isArray(nav) && nav.length > 0 ? nav : DEFAULT_LINKS).filter(
        (l) => l && typeof l.href === 'string' && l.href
      ),
    [nav]
  );

  const sectionIds = useMemo(
    () => links.map((l) => l.href.replace('#', '')).filter(Boolean),
    [links]
  );

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 200;
      let current = '';

      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = sectionId;
            break;
          }
        }
      }

      setActiveSection(current || 'hero');
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [sectionIds]);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setDrawerOpen(false);
    if (href.startsWith('#')) {
      const target = document.getElementById(href.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <header className={`floating-nav-header ${isScrolled ? 'scrolled-island' : ''}`}>
        <div className="nav-island-container">
          <div className="nav-island-inner">
            {/* Brand */}
            <a
              href="#"
              className="nav-brand-logo"
              data-cursor="TOP"
              onClick={(e) => scrollTo(e, '#hero')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              
              <span className="brand-name-full">{isScrolled ? shortName : siteName}</span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="nav-desktop-links" aria-label="Main Navigation">
              {links.map((link, idx) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.label || link.href || idx}
                    href={link.href}
                    className={`nav-link-item ${isActive ? 'active' : ''}`}
                    data-cursor="NAV"
                    onClick={(e) => scrollTo(e, link.href)}
                  >
                    <span>{link.label}</span>
                    <span className="nav-link-indicator" />
                  </a>
                );
              })}
            </nav>

            {/* CTA & Theme Action group */}
            <div className="nav-action-wrapper">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              <a
                href="#contact"
                className="nav-cta-btn"
                data-cursor="TALK"
                onClick={(e) => scrollTo(e, '#contact')}
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight size={14} />
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="nav-mobile-toggle"
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label="Toggle Menu"
              >
                {drawerOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-overlay ${drawerOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <span className="mobile-brand-title">{siteName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ThemeToggle />
              <button
                type="button"
                className="mobile-close-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="mobile-drawer-links">
            {links.map((link, idx) => (
              <a
                key={link.label || link.href || idx}
                href={link.href}
                className="mobile-nav-link"
                onClick={(e) => scrollTo(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mobile-drawer-footer">
            <a
              href="#contact"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={(e) => scrollTo(e, '#contact')}
            >
              Start a Conversation <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
