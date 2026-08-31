import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './AnimatedSection';
import GridLines from './GridLines';
import { SITE, CONTACT, FOOTER_NAV } from '../data';

export default function Footer() {
  return (
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
              {FOOTER_NAV.map((link) => (
                <a key={link.href} href={link.href}>• {link.label}</a>
              ))}
            </div>
          </Reveal>

          <Reveal type="up" delay={2} className="footer-contact-col">
            <div className="footer-links-title">Contact</div>
            <div className="footer-contact-info">
              <a href={CONTACT.phoneHref}>• {CONTACT.phone}</a>
              <a href={CONTACT.emailHref}>• {CONTACT.email}</a>
              <a href="https://github.com/Gabrial-8467" target="_blank" rel="noreferrer">• github.com/Gabrial-8467</a>
            </div>
          </Reveal>

          <Reveal type="up" delay={3} className="footer-right-col">
            <a href={CONTACT.emailHref} className="btn-primary">
              Let's Work Together
              <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
            </a>
            <p className="copyright">{SITE.copyright}</p>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
