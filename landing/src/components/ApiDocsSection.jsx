import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
} from 'lucide-react';
import { PORTFOLIO_SLUG } from '../api/client';

export default function ApiDocsSection() {
  const [selectedTopic, setSelectedTopic] = useState('get-portfolio');
  const [searchQuery, setSearchQuery] = useState('');

  const topics = [
    { id: 'intro', category: 'Overview', title: 'Introduction' },
    { id: 'quickstart', category: 'Overview', title: 'Quick Start' },
    { id: 'auth', category: 'Overview', title: 'Authentication' },
    { id: 'get-portfolio', category: 'Endpoints', title: 'GET /api/v1/portfolio' },
    { id: 'get-section', category: 'Endpoints', title: 'GET /api/v1/section/:key' },
    { id: 'health', category: 'Endpoints', title: 'GET /health' },
    { id: 'errors', category: 'Guides', title: 'Errors & Status Codes' },
  ];

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="docs" className="saas-section saas-section-alt">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 48 }}>
          <div className="saas-badge">
            <BookOpen size={14} /> Comprehensive API Documentation
          </div>
          <h2 className="saas-heading">API Reference & Guides</h2>
          <p className="saas-subheading mx-auto">
            Everything you need to fetch, render, and automate portfolio content delivery.
          </p>
        </div>

        {/* Docs Box */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--saas-border)',
            borderRadius: 'var(--saas-radius-xl)',
            boxShadow: 'var(--saas-shadow-lg)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            minHeight: 520,
          }}
        >
          {/* Docs Sidebar */}
          <div style={{ background: '#f8fafc', borderRight: '1px solid var(--saas-border)', padding: '20px' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--saas-text-muted)' }} />
              <input
                type="text"
                placeholder="Search docs..."
                className="form-input"
                style={{ paddingLeft: 32, fontSize: 13 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--saas-radius-sm)',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'left',
                    color: selectedTopic === topic.id ? 'var(--saas-primary)' : 'var(--saas-text-secondary)',
                    background: selectedTopic === topic.id ? 'var(--saas-primary-light)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{topic.title}</span>
                  {selectedTopic === topic.id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Docs Content */}
          <div style={{ padding: '36px 40px', overflowY: 'auto' }}>
            {selectedTopic === 'intro' && (
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--saas-text)', marginBottom: 12 }}>Introduction</h3>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Portfolio CMS is a high-performance multi-tenant Content API designed specifically for personal websites, portfolio showcases, and resume applications. It decouples your portfolio content from its visual design, allowing you to update projects, hero details, skills, and work history without redeploying code.
                </p>
                <div style={{ padding: 16, background: '#f8fafc', border: '1px solid var(--saas-border)', borderRadius: 'var(--saas-radius)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Base API URLs</div>
                  <div style={{ fontFamily: 'var(--saas-mono)', fontSize: 13, color: 'var(--saas-primary)' }}>
                    Local: http://localhost:5000<br />
                    Production: https://api.portfoliocms.dev
                  </div>
                </div>
              </div>
            )}

            {selectedTopic === 'quickstart' && (
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--saas-text)', marginBottom: 12 }}>Quick Start Guide</h3>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  Get your portfolio powered by the API in 3 easy steps:
                </p>
                <ol style={{ paddingLeft: 20, color: 'var(--saas-text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
                  <li><strong>Create an account</strong> — Sign up to receive your instant API key and default portfolio workspace.</li>
                  <li><strong>Populate content</strong> — Use the visual admin panel to customize your projects and skills.</li>
                  <li><strong>Fetch your data</strong> — Query <code>GET /api/v1/portfolio</code> with your API key from any frontend.</li>
                </ol>
              </div>
            )}

            {selectedTopic === 'auth' && (
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--saas-text)', marginBottom: 12 }}>API Authentication</h3>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  The Developer API supports three authentication methods:
                </p>
                <div style={{ background: '#0f172a', borderRadius: 'var(--saas-radius)', padding: 16, color: '#f1f5f9', fontFamily: 'var(--saas-mono)', fontSize: 13, marginBottom: 16 }}>
                  # 1. Bearer Token Header (Recommended){'\n'}
                  Authorization: Bearer YOUR_API_KEY{'\n\n'}
                  # 2. Custom Header{'\n'}
                  x-api-key: YOUR_API_KEY{'\n\n'}
                  # 3. Query Parameter{'\n'}
                  ?api_key=YOUR_API_KEY
                </div>
                <div className="alert-security">
                  <strong>Security Best Practice:</strong> API keys provide read-only access to published content. Never commit your API key to public repositories.
                </div>
              </div>
            )}

            {selectedTopic === 'get-portfolio' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className="method-tag method-get">GET</span>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--saas-mono)' }}>/api/v1/portfolio</span>
                </div>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  Retrieves the full portfolio metadata and all published sections scoped to the provided API key.
                </p>

                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--saas-text-muted)', marginBottom: 8 }}>Headers</h4>
                <div style={{ background: '#f8fafc', border: '1px solid var(--saas-border)', borderRadius: 'var(--saas-radius)', padding: 12, fontSize: 13, fontFamily: 'var(--saas-mono)', marginBottom: 20 }}>
                  Authorization: Bearer &lt;API_KEY&gt; (Required)
                </div>

                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--saas-text-muted)', marginBottom: 8 }}>Response (200 OK)</h4>
                <div style={{ background: '#0f172a', borderRadius: 'var(--saas-radius)', padding: 16, color: '#f1f5f9', fontFamily: 'var(--saas-mono)', fontSize: 13, overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}>
{`{
  "success": true,
  "data": {
    "portfolio": {
      "name": "Gabrial Deora",
      "slug": "${PORTFOLIO_SLUG}",
      "settings": {}
    },
    "sections": [
      {
        "key": "site",
        "label": "Site & Hero",
        "content": { "name": "Gabrial Deora" },
        "isPublished": true
      },
      {
        "key": "projects",
        "label": "Projects",
        "content": [ ... ],
        "isPublished": true
      }
    ]
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedTopic === 'get-section' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className="method-tag method-get">GET</span>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--saas-mono)' }}>/api/v1/section/:key</span>
                </div>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  Fetches a single published section by its unique identifier (e.g. <code>projects</code>, <code>skills</code>, <code>experience</code>).
                </p>
                <div style={{ background: '#0f172a', borderRadius: 'var(--saas-radius)', padding: 16, color: '#f1f5f9', fontFamily: 'var(--saas-mono)', fontSize: 13 }}>
                  <pre style={{ margin: 0 }}>
{`{
  "success": true,
  "data": {
    "key": "projects",
    "label": "Projects",
    "content": [
      { "name": "Brain Simulator", "tags": ["Python", "AI"] }
    ]
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedTopic === 'health' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className="method-tag method-get">GET</span>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--saas-mono)' }}>/health</span>
                </div>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  System liveness and uptime check.
                </p>
                <div style={{ background: '#0f172a', borderRadius: 'var(--saas-radius)', padding: 16, color: '#f1f5f9', fontFamily: 'var(--saas-mono)', fontSize: 13 }}>
                  {`{ "status": "ok", "uptime": 14280.4 }`}
                </div>
              </div>
            )}

            {selectedTopic === 'errors' && (
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--saas-text)', marginBottom: 12 }}>Status & Error Codes</h3>
                <p style={{ color: 'var(--saas-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  Standard HTTP status codes are used for all responses:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: '10px 14px', border: '1px solid var(--saas-border)', borderRadius: 6, display: 'flex', gap: 12 }}>
                    <strong style={{ color: '#16a34a', width: 70 }}>200 OK</strong>
                    <span style={{ color: 'var(--saas-text-secondary)', fontSize: 13 }}>Successful request with payload in <code>data</code>.</span>
                  </div>
                  <div style={{ padding: '10px 14px', border: '1px solid var(--saas-border)', borderRadius: 6, display: 'flex', gap: 12 }}>
                    <strong style={{ color: '#d97706', width: 70 }}>401 Unauthorized</strong>
                    <span style={{ color: 'var(--saas-text-secondary)', fontSize: 13 }}>Missing or invalid API key / JWT session.</span>
                  </div>
                  <div style={{ padding: '10px 14px', border: '1px solid var(--saas-border)', borderRadius: 6, display: 'flex', gap: 12 }}>
                    <strong style={{ color: '#dc2626', width: 70 }}>404 Not Found</strong>
                    <span style={{ color: 'var(--saas-text-secondary)', fontSize: 13 }}>Portfolio slug or section key does not exist.</span>
                  </div>
                  <div style={{ padding: '10px 14px', border: '1px solid var(--saas-border)', borderRadius: 6, display: 'flex', gap: 12 }}>
                    <strong style={{ color: '#dc2626', width: 70 }}>429 Too Many Requests</strong>
                    <span style={{ color: 'var(--saas-text-secondary)', fontSize: 13 }}>Rate limit exceeded (600 req/15min).</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
