import { Mail, Phone, ArrowUpRight, MessageSquare, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import MagneticButton from './MagneticButton';

export default function Contact({ site = {} }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = site.email || 'gabrialdeora003@gmail.com';
  const emailHref = site.emailHref || `mailto:${email}`;
  const phone = site.phone || '+91 7888695062';
  const phoneHref = site.phoneHref || 'tel:+917888695062';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const el = document.createElement('textarea');
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-modern-section">
      <div className="section-container">
        <div className={`contact-hero-card ${isInView ? 'in-view' : ''}`}>
          <div className="card-badge">
            <MessageSquare size={14} /> Get in Touch
          </div>

          <h2 className="contact-giant-heading">
            HAVE A PROJECT IN MIND?<br />
            <span>LET&apos;S BUILD SOMETHING.</span>
          </h2>

          <p className="contact-subtext">
            Available for software engineering roles, full-stack web applications, and consulting collaborations.
          </p>

          <div className="contact-cta-row">
            <MagneticButton
              as="a"
              href={emailHref}
              className="btn-primary btn-xl"
              data-cursor="EMAIL"
            >
              <span>Start a Conversation</span>
              <span className="btn-arrow-circle"><ArrowUpRight size={20} /></span>
            </MagneticButton>

            <button
              type="button"
              className="btn-secondary btn-xl"
              onClick={copyEmail}
              data-cursor="COPY"
            >
              {copiedEmail ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
              <span>{copiedEmail ? 'Email Copied!' : email}</span>
            </button>
          </div>

          {phone && (
            <div className="contact-direct-links">
              <a href={phoneHref} className="contact-direct-item" data-cursor="CALL">
                <Phone size={15} />
                <span>{phone}</span>
              </a>
              <span className="contact-sep">•</span>
              <a href={emailHref} className="contact-direct-item" data-cursor="MAIL">
                <Mail size={15} />
                <span>{email}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
