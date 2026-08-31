import { useState } from 'react';
import { X } from 'lucide-react';
import { SITE, NAV_LINKS } from '../data';
import { useDarkSections } from '../hooks/useDarkSections';

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isNavDark = useDarkSections();

  const toggleNav = () => setIsNavOpen((open) => !open);
  const closeNav = () => setIsNavOpen(false);
  const navClass = isNavDark ? ' nav-dark' : '';

  return (
    <>
      <header className={`header${navClass}`}>
        <div className="content-wrapper header-content">
          <div className={`logo${navClass}`}>{SITE.name}</div>
          <button
            className={`menu-btn${navClass}`}
            onClick={toggleNav}
            aria-label="Open navigation menu"
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

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
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeNav}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-drawer-footer">
          <p>{SITE.copyright}</p>
        </div>
      </div>
      {isNavOpen && <div className="nav-backdrop" onClick={closeNav} />}
    </>
  );
}
