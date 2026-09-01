import React from 'react';
import { Layers } from 'lucide-react';
import { ADMIN_URL, FRONTEND_URL, PORTFOLIO_SLUG } from '../api/client';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer({ onOpenRegister }) {
  return (
    <footer className="saas-footer">
      <div className="saas-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="saas-logo">
              <div className="saas-logo-icon">
                <Layers size={18} />
              </div>
              <span>Portfolio<span style={{ color: 'var(--saas-primary)' }}>CMS</span></span>
            </div>
            <p>
              The multi-tenant headless CMS and Content API platform engineered for modern developer portfolios.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <a
                href="https://github.com/Gabrial-8467/Portfolio"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  border: '1px solid var(--saas-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--saas-text-secondary)',
                }}
                aria-label="GitHub Repository"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href="https://linkedin.com/in/gabrial-deora"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  border: '1px solid var(--saas-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--saas-text-secondary)',
                }}
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#cms-demo" className="footer-link">CMS Engine</a></li>
              <li><a href="#pricing" className="footer-link">Pricing Plans</a></li>
              <li><a href={`${FRONTEND_URL}/?preview=${PORTFOLIO_SLUG}`} target="_blank" rel="noreferrer" className="footer-link">Live Demo Site</a></li>
              <li><button type="button" onClick={onOpenRegister} className="footer-link" style={{ textAlign: 'left', padding: 0 }}>Create Account</button></li>
            </ul>
          </div>

          {/* Developers Links */}
          <div>
            <h4 className="footer-col-title">Developers</h4>
            <ul className="footer-links">
              <li><a href="#docs" className="footer-link">API Documentation</a></li>
              <li><a href="#playground" className="footer-link">Live Playground</a></li>
              <li><a href="#developer" className="footer-link">Code Examples</a></li>
              <li><a href="#docs" className="footer-link">Authentication Guide</a></li>
              <li><a href={`${ADMIN_URL}/admin/apikeys`} target="_blank" rel="noreferrer" className="footer-link">API Key Dashboard</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works" className="footer-link">How It Works</a></li>
              <li><a href="#faq" className="footer-link">Developer FAQ</a></li>
              <li><a href={`${ADMIN_URL}/admin/login`} target="_blank" rel="noreferrer" className="footer-link">Admin Portal</a></li>
              <li><a href="#developer" className="footer-link">Developer Community</a></li>
            </ul>
          </div>

          {/* Legal / Company Links */}
          <div>
            <h4 className="footer-col-title">Legal & Security</h4>
            <ul className="footer-links">
              <li><a href="#docs" className="footer-link">Security Practices</a></li>
              <li><a href="#docs" className="footer-link">Data Privacy</a></li>
              <li><a href="#docs" className="footer-link">API Terms</a></li>
              <li><a href="#docs" className="footer-link">System Status</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © 2026 Portfolio CMS. Designed and engineered for developers.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Built with precision for modern developer portfolios</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
