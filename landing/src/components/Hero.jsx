import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { PORTFOLIO_SLUG } from '../api/client';

export default function Hero({ onOpenRegister }) {
  const [activeTab, setActiveTab] = useState('response');
  const [copied, setCopied] = useState(false);

  const requestSnippet = `GET /api/v1/portfolio HTTP/1.1
Host: api.portfoliocms.dev
Authorization: Bearer pk_live_9d82f71a9320e4b7c
Accept: application/json`;

  const responseSnippet = `{
  "success": true,
  "data": {
    "portfolio": {
      "name": "Gabrial Deora",
      "slug": "${PORTFOLIO_SLUG}",
      "settings": { "theme": "developer-dark", "accent": "#4f46e5" }
    },
    "sections": [
      {
        "key": "site",
        "label": "Site & Hero",
        "content": {
          "title": "Building Web Apps That Actually Perform",
          "badge": "Full Stack Engineer"
        },
        "isPublished": true
      },
      {
        "key": "projects",
        "label": "Featured Projects",
        "content": [
          { "name": "Brain Simulator", "tags": ["Python", "AI", "Simulation"] },
          { "name": "UniNest", "tags": ["Flutter", "Firebase", "Auth"] }
        ],
        "isPublished": true
      }
    ]
  }
}`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'request' ? requestSnippet : responseSnippet;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="saas-hero">
      <div className="saas-container">
        <div className="hero-grid">
          {/* Left Column: Value Proposition */}
          <div>
            <div className="saas-badge">
              <Sparkles size={14} /> Next-Gen Headless CMS for Portfolios
            </div>
            <h1 className="hero-title">
              Your portfolio.<br />
              Your content.<br />
              <span>Your API.</span>
            </h1>
            <p className="hero-subtext">
              Manage your portfolio from one powerful CMS and deliver your content anywhere through a secure, developer-first REST API.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={onOpenRegister}
              >
                Start Building — Free <ArrowRight size={17} />
              </button>
              <a href="#docs" className="btn btn-secondary btn-lg">
                <BookOpen size={17} /> Explore API Docs
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-val">&lt; 30ms</div>
                <div className="hero-stat-lbl">Global Edge Latency</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-val">100%</div>
                <div className="hero-stat-lbl">Framework Agnostic</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-val">Zero-CORS</div>
                <div className="hero-stat-lbl">Browser Ready</div>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic API Preview Card */}
          <div>
            <div className="hero-code-card">
              <div className="code-card-header">
                <div className="code-dots">
                  <div className="code-dot red" />
                  <div className="code-dot yellow" />
                  <div className="code-dot green" />
                </div>
                <div className="code-tabs">
                  <button
                    type="button"
                    className={`code-tab-btn ${activeTab === 'response' ? 'active' : ''}`}
                    onClick={() => setActiveTab('response')}
                  >
                    Response (200 OK)
                  </button>
                  <button
                    type="button"
                    className={`code-tab-btn ${activeTab === 'request' ? 'active' : ''}`}
                    onClick={() => setActiveTab('request')}
                  >
                    Request Header
                  </button>
                </div>
                <button
                  type="button"
                  className="code-copy-btn"
                  onClick={handleCopy}
                  title="Copy code"
                >
                  {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="code-body">
                {activeTab === 'request' ? (
                  <div>
                    <div className="code-request-line">
                      <span className="method-tag method-get">GET</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>/api/v1/portfolio</span>
                    </div>
                    <pre style={{ margin: 0 }}>
                      <span className="tok-key">Host:</span> <span className="tok-str">api.portfoliocms.dev</span>{'\n'}
                      <span className="tok-key">Authorization:</span> <span className="tok-str">Bearer pk_live_9d82f71a9320e4b7c</span>{'\n'}
                      <span className="tok-key">Accept:</span> <span className="tok-str">application/json</span>
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div className="code-request-line">
                      <span className="method-tag method-get" style={{ background: '#10b981' }}>200 OK</span>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>32ms · application/json</span>
                    </div>
                    <pre style={{ margin: 0 }}>
                      {`{\n  "success": true,\n  "data": {\n    "portfolio": {\n      "name": "Gabrial Deora",\n      "slug": "${PORTFOLIO_SLUG}"\n    },\n    "sections": [\n      {\n        "key": "site",\n        "label": "Site & Hero",\n        "isPublished": true\n      },\n      {\n        "key": "projects",\n        "items": 9,\n        "isPublished": true\n      }\n    ]\n  }\n}`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
