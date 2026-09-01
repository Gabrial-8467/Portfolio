import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  Code2,
  Terminal,
  FileText,
  Play,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  Cpu,
  Menu,
  X,
} from 'lucide-react';
import MagneticButton from './MagneticButton';
import { ADMIN_URL } from '../api/client';
import { useLandingAuth } from '../hooks/useLandingAuth';

export default function Navbar({ onOpenRegister, onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useLandingAuth();

  return (
    <nav className="saas-nav" aria-label="Main navigation">
      <div className="saas-container">
        <div className="saas-nav-inner">
          {/* Logo */}
          <a href="#" className="saas-logo" data-cursor="CMS" onClick={() => onSelectTab && onSelectTab('overview')}>
            <div className="saas-logo-icon">
              <Layers size={18} />
            </div>
            <span>Portfolio<span style={{ color: 'var(--saas-primary)' }}>CMS</span></span>
          </a>

          {/* Desktop Links */}
          <div className="saas-nav-links">
            <div className="nav-item">
              <a href="#features" className="nav-link" data-cursor="EXPLORE">
                Product <ChevronDown size={14} />
              </a>
              <div className="nav-dropdown">
                <a href="#features" className="dropdown-item">
                  <div className="dropdown-title"><Sparkles size={14} color="#4f46e5" /> Features</div>
                  <div className="dropdown-desc">Headless engine, multi-tenant & media</div>
                </a>
                <a href="#cms-demo" className="dropdown-item">
                  <div className="dropdown-title"><Layers size={14} color="#2563eb" /> CMS Dashboard</div>
                  <div className="dropdown-desc">Visual and raw JSON editors</div>
                </a>
                <a href="#developer" className="dropdown-item">
                  <div className="dropdown-title"><Code2 size={14} color="#10b981" /> Integrations</div>
                  <div className="dropdown-desc">React, Next.js, Vue, Mobile apps</div>
                </a>
              </div>
            </div>

            <div className="nav-item">
              <a href="#docs" className="nav-link" data-cursor="DOCS">
                Developers <ChevronDown size={14} />
              </a>
              <div className="nav-dropdown">
                <a href="#docs" className="dropdown-item">
                  <div className="dropdown-title"><BookOpen size={14} color="#4f46e5" /> Documentation</div>
                  <div className="dropdown-desc">Getting started & authentication guides</div>
                </a>
                <a href="#docs" className="dropdown-item">
                  <div className="dropdown-title"><FileText size={14} color="#0284c7" /> API Reference</div>
                  <div className="dropdown-desc">Full endpoints specification</div>
                </a>
                <a href="#developer" className="dropdown-item">
                  <div className="dropdown-title"><Terminal size={14} color="#8b5cf6" /> Code Examples</div>
                  <div className="dropdown-desc">Snippets for React, Next.js & Python</div>
                </a>
                <a href="#playground" className="dropdown-item">
                  <div className="dropdown-title"><Play size={14} color="#f59e0b" /> Live API Playground</div>
                  <div className="dropdown-desc">Test real HTTP requests live in-browser</div>
                </a>
              </div>
            </div>

            <div className="nav-item">
              <a href="#faq" className="nav-link" data-cursor="FAQ">
                Resources <ChevronDown size={14} />
              </a>
              <div className="nav-dropdown">
                <a href="#how-it-works" className="dropdown-item">
                  <div className="dropdown-title"><Cpu size={14} color="#4f46e5" /> How It Works</div>
                  <div className="dropdown-desc">3-step architecture walkthrough</div>
                </a>
                <a href="#faq" className="dropdown-item">
                  <div className="dropdown-title"><HelpCircle size={14} color="#0284c7" /> FAQ & Help</div>
                  <div className="dropdown-desc">Common developer questions answered</div>
                </a>
              </div>
            </div>

            <a href="#pricing" className="nav-link" data-cursor="PLANS">Pricing</a>
          </div>

          {/* Nav Actions */}
          <div className="saas-nav-actions">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a
                  href={`${ADMIN_URL}/admin`}
                  className="nav-user-chip"
                  target="_blank"
                  rel="noreferrer"
                  title={`Signed in as ${user?.name || user?.email}`}
                >
                  <span className="nav-live-dot" />
                  <span className="nav-user-label">{user?.name?.split(' ')[0] || 'Admin'}</span>
                </a>
                <MagneticButton
                  as="a"
                  href={`${ADMIN_URL}/admin`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="DASHBOARD"
                >
                  <span>Dashboard</span>
                  <ArrowUpRight size={15} />
                </MagneticButton>
              </div>
            ) : (
              <>
                <a
                  href={`${ADMIN_URL}/admin/login`}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="SIGNIN"
                >
                  Sign In
                </a>
                <MagneticButton
                  type="button"
                  className="btn btn-primary"
                  onClick={onOpenRegister}
                  data-cursor="START"
                >
                  <span>Get Started</span> <ArrowRight size={15} />
                </MagneticButton>
              </>
            )}

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', padding: '6px' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
