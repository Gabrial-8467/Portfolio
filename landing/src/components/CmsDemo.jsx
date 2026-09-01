import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  KeyRound,
  FileCode,
  Settings,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { ADMIN_URL, PORTFOLIO_SLUG } from '../api/client';

export default function CmsDemo() {
  const [activeSection, setActiveSection] = useState('projects');

  const demoSections = [
    { key: 'site', label: 'Site & About', status: 'Published', count: '14 fields' },
    { key: 'projects', label: 'Projects', status: 'Published', count: '9 projects' },
    { key: 'experience', label: 'Experience', status: 'Published', count: '2 items' },
    { key: 'skills', label: 'Skills', status: 'Published', count: '6 categories' },
    { key: 'services', label: 'Services', status: 'Published', count: '7 items' },
    { key: 'achievements', label: 'Hackathons', status: 'Draft', count: '3 items' },
  ];

  return (
    <section id="cms-demo" className="saas-section saas-section-alt">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 680 }}>
          <div className="saas-badge">
            <Sparkles size={14} /> Seamless Content Workflow
          </div>
          <h2 className="saas-heading">Manage once. Deliver everywhere.</h2>
          <p className="saas-subheading mx-auto">
            A clean visual dashboard for your portfolio data. Edit fields or raw JSON, hit publish, and watch your changes immediately go live across all frontends.
          </p>
        </div>

        {/* CMS Showcase Mockup */}
        <div className="cms-showcase">
          <div className="cms-mockup-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 12, color: 'var(--saas-text-muted)', marginLeft: 12, fontFamily: 'var(--saas-mono)' }}>
                app.portfoliocms.dev/admin/sections
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16a34a', fontWeight: 600, background: '#f0fdf4', padding: '3px 8px', borderRadius: 9999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} /> API Live
              </span>
              <a
                href={`${ADMIN_URL}/admin`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '4px 10px' }}
              >
                Open Admin <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="cms-mockup-body">
            {/* Mockup Sidebar */}
            <div className="cms-mockup-sidebar">
              <div style={{ padding: '4px 12px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--saas-text-muted)', letterSpacing: '0.05em' }}>
                Portfolio CMS
              </div>
              <div className="cms-sidebar-item">
                <LayoutDashboard size={16} /> Overview
              </div>
              <div className="cms-sidebar-item active">
                <Layers size={16} /> Sections
              </div>
              <div className="cms-sidebar-item">
                <KeyRound size={16} /> API Keys
              </div>
              <div className="cms-sidebar-item">
                <FileCode size={16} /> Developer Docs
              </div>
              <div className="cms-sidebar-item">
                <Settings size={16} /> Settings
              </div>
            </div>

            {/* Mockup Main View */}
            <div className="cms-mockup-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--saas-text)' }}>Sections ({demoSections.length})</h3>
                  <p style={{ fontSize: 13, color: 'var(--saas-text-muted)' }}>Portfolio: <strong>{PORTFOLIO_SLUG}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
                    <Plus size={14} /> New Section
                  </button>
                </div>
              </div>

              {/* Sections Table Mockup */}
              <div style={{ border: '1px solid var(--saas-border)', borderRadius: 'var(--saas-radius)', overflow: 'hidden' }}>
                {demoSections.map((sec) => (
                  <div
                    key={sec.key}
                    onClick={() => setActiveSection(sec.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--saas-border)',
                      background: activeSection === sec.key ? 'var(--saas-primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: sec.status === 'Published' ? '#10b981' : '#94a3b8' }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--saas-text)' }}>{sec.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--saas-text-muted)', fontFamily: 'var(--saas-mono)' }}>key: {sec.key}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 12, color: 'var(--saas-text-secondary)' }}>{sec.count}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: sec.status === 'Published' ? '#dcfce7' : '#f1f5f9',
                          color: sec.status === 'Published' ? '#15803d' : '#64748b',
                        }}
                      >
                        {sec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
