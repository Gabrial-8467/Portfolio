import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { PORTFOLIO_SLUG, ADMIN_URL, API_URL } from '../api/client';
import { useLandingAuth } from '../hooks/useLandingAuth';
import MagneticButton from './MagneticButton';

export default function Hero({ onOpenRegister }) {
  const { isAuthenticated } = useLandingAuth();
  const [activeTab, setActiveTab] = useState('response');
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const host = API_URL.replace(/^https?:\/\//, '');

  const requestSnippet = `GET /api/v1/portfolio HTTP/1.1
Host: ${host}
Authorization: Bearer pk_live_9d82f71a9320e4b7c
Accept: application/json`;

  const responseSnippet = `{
  "success": true,
  "data": {
    "slug": "${PORTFOLIO_SLUG}",
    "name": "Gabrial Deora",
    "config": { "theme": "developer-dark", "accent": "#4f46e5" },
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

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="saas-hero">
      <div className="saas-container">
        <div className="hero-grid">
          {/* Left Column: Value Proposition */}
          <div>
            <div className="saas-badge" data-cursor="NEXTGEN">
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
              {isAuthenticated ? (
                <MagneticButton
                  as="a"
                  href={`${ADMIN_URL}/admin`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-lg"
                  data-cursor="DASHBOARD"
                >
                  <span>Go to Dashboard</span> <ArrowUpRight size={17} />
                </MagneticButton>
              ) : (
                <MagneticButton
                  as="button"
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={onOpenRegister}
                  data-cursor="START"
                >
                  <span>Start Building — Free</span> <ArrowRight size={17} />
                </MagneticButton>
              )}
              <MagneticButton
                as="a"
                href="#docs"
                className="btn btn-secondary btn-lg"
                data-cursor="DOCS"
              >
                <BookOpen size={17} /> <span>Explore API Docs</span>
              </MagneticButton>
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

          {/* Right Column: Interactive Code Visualizer with 3D Mouse Tilt */}
          <div
            ref={cardRef}
            className="hero-code-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-cursor="JSON"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
            }}
          >
            <div className="code-card-header">
              <div className="code-dots">
                <span className="code-dot red" />
                <span className="code-dot yellow" />
                <span className="code-dot green" />
              </div>

              <div className="code-tabs">
                <button
                  type="button"
                  className={`code-tab-btn ${activeTab === 'response' ? 'active' : ''}`}
                  onClick={() => setActiveTab('response')}
                >
                  200 OK — JSON Response
                </button>
                <button
                  type="button"
                  className={`code-tab-btn ${activeTab === 'request' ? 'active' : ''}`}
                  onClick={() => setActiveTab('request')}
                >
                  HTTP Request
                </button>
              </div>

              <button
                type="button"
                className="code-copy-btn"
                onClick={handleCopy}
                data-cursor="COPY"
                title="Copy code"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="code-body">
              {activeTab === 'request' ? (
                <div>
                  <div className="code-request-line">
                    <span className="method-tag method-get">GET</span>
                    <span style={{ color: '#38bdf8' }}>/api/v1/portfolio</span>
                    <span style={{ color: '#64748b' }}>HTTP/1.1</span>
                  </div>
                  <pre style={{ margin: 0 }}>
                    <code>
                      <span style={{ color: '#94a3b8' }}>Host: </span><span style={{ color: '#f1f5f9' }}>{host}</span>{'\n'}
                      <span style={{ color: '#94a3b8' }}>Authorization: </span><span style={{ color: '#fbbf24' }}>Bearer pk_live_9d82f71a9320e4b7c</span>{'\n'}
                      <span style={{ color: '#94a3b8' }}>Accept: </span><span style={{ color: '#a7f3d0' }}>application/json</span>
                    </code>
                  </pre>
                </div>
              ) : (
                <pre style={{ margin: 0 }}>
                  <code>
                    <span className="tok-brace">&#123;</span>{'\n'}
                    {'  '}<span className="tok-key">&quot;success&quot;</span>: <span className="tok-bool">true</span>,{'\n'}
                    {'  '}<span className="tok-key">&quot;data&quot;</span>: <span className="tok-brace">&#123;</span>{'\n'}
                    {'    '}<span className="tok-key">&quot;slug&quot;</span>: <span className="tok-str">&quot;{PORTFOLIO_SLUG}&quot;</span>,{'\n'}
                    {'    '}<span className="tok-key">&quot;name&quot;</span>: <span className="tok-str">&quot;Gabrial Deora&quot;</span>,{'\n'}
                    {'    '}<span className="tok-key">&quot;config&quot;</span>: <span className="tok-brace">&#123;</span> <span className="tok-key">&quot;theme&quot;</span>: <span className="tok-str">&quot;developer-dark&quot;</span> <span className="tok-brace">&#125;</span>{'\n'}
                    {'    '}<span className="tok-key">&quot;sections&quot;</span>: [<span className="tok-brace">&#123;</span> <span className="tok-key">&quot;key&quot;</span>: <span className="tok-str">&quot;site&quot;</span>, <span className="tok-key">&quot;isPublished&quot;</span>: <span className="tok-bool">true</span> <span className="tok-brace">&#125;</span>, <span className="tok-brace">&#123;</span> <span className="tok-key">&quot;key&quot;</span>: <span className="tok-str">&quot;projects&quot;</span> <span className="tok-brace">&#125;</span>]{'\n'}
                    {'  '}<span className="tok-brace">&#125;</span>{'\n'}
                    <span className="tok-brace">&#125;</span>
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
