import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';

const safeLink = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '#';
  return trimmed;
};

export default function Footer({ site = {}, nav = [] }) {
  const navLinks = Array.isArray(nav) ? nav.slice(0, 6) : [];
  const nameParts = (site.name || 'Gabrial Deora').trim().split(' ');
  const firstName = nameParts[0] || 'Gabrial';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (site.heroBgText || 'Portfolio');
  const bio = site.bio || 'A passionate Full Stack Web Developer building responsive, high-performance web applications.';
  const contactHref = safeLink(site.emailHref || (site.email ? `mailto:${site.email}` : '#contact'));

  return (
    <footer id="contact" className="footer-section">
      <GridLines />
      <div className="footer-bg-text-container">
        <span className="footer-bg-text">{lastName}</span>
      </div>

      <div className="content-wrapper">
        <div className="footer-content">
          <Reveal type="up" className="footer-left-col">
            <div className="footer-logo">{firstName}</div>
            <p className="footer-bio">{bio}</p>
          </Reveal>

          {navLinks.length > 0 && (
            <Reveal type="up" delay={1} className="footer-links-col">
              <div className="footer-links-title">Navigation</div>
              <div className="footer-links-list">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href}>• {link.label}</a>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal type="up" delay={2} className="footer-contact-col">
            <div className="footer-links-title">Contact</div>
            <div className="footer-contact-info">
              {site.phone && (
                <a href={safeLink(site.phoneHref || `tel:${site.phone}`)}>• {site.phone}</a>
              )}
              {site.email && (
                <a href={safeLink(site.emailHref || `mailto:${site.email}`)}>• {site.email}</a>
              )}
              {site.github && (
                <a href={safeLink(site.github)} target="_blank" rel="noopener noreferrer">
                  • {site.github.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </Reveal>

          <Reveal type="up" delay={3} className="footer-right-col">
            <a href={contactHref} className="btn-primary">
              Let's Work Together
              <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
            </a>
            <p className="copyright">{site.copyright || `© ${new Date().getFullYear()} ${site.name || 'Gabrial Deora'}. All Rights Reserved.`}</p>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
