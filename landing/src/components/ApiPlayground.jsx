import React, { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  Send,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { api, PORTFOLIO_SLUG } from '../api/client';

export default function ApiPlayground() {
  const [endpoint, setEndpoint] = useState('/api/p/:slug');
  const [paramSlug, setParamSlug] = useState(PORTFOLIO_SLUG);
  const [paramKey, setParamKey] = useState('projects');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null);
    setLatency(null);

    try {
      let result;
      if (endpoint === '/api/p/:slug') {
        result = await api.getPublicPortfolio(paramSlug || PORTFOLIO_SLUG);
      } else if (endpoint === '/api/p/:slug/section/:key') {
        result = await api.getPublicSection(paramSlug || PORTFOLIO_SLUG, paramKey || 'projects');
      } else if (endpoint === '/api/v1/portfolio') {
        if (!apiKey) {
          throw new Error('Please enter an API Key to test /api/v1/portfolio');
        }
        result = await api.getPortfolioByKey(apiKey);
      } else if (endpoint === '/api/v1/section/:key') {
        if (!apiKey) {
          throw new Error('Please enter an API Key to test /api/v1/section/:key');
        }
        result = await api.getSectionByKey(apiKey, paramKey || 'projects');
      } else if (endpoint === '/health') {
        result = await api.getHealth();
      }

      setStatusCode(result.status || 200);
      setLatency(result.latency || 24);
      setResponse(result.payload || result.data);
    } catch (err) {
      setError(err.message || 'Request failed');
      setStatusCode(err.status || 500);
    } finally {
      setLoading(false);
    }
  };

  const getComputedPath = () => {
    if (endpoint === '/api/p/:slug') return `/api/p/${paramSlug || PORTFOLIO_SLUG}`;
    if (endpoint === '/api/p/:slug/section/:key') return `/api/p/${paramSlug || PORTFOLIO_SLUG}/section/${paramKey || 'projects'}`;
    if (endpoint === '/api/v1/section/:key') return `/api/v1/section/${paramKey || 'projects'}`;
    return endpoint;
  };

  const getGeneratedCurl = () => {
    const url = `${api.getUrl()}${getComputedPath()}`;
    if (endpoint.startsWith('/api/v1')) {
      return `curl -X GET "${url}" \\\n  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\\n  -H "Accept: application/json"`;
    }
    return `curl -X GET "${url}" \\\n  -H "Accept: application/json"`;
  };

  const copyResponse = () => {
    const content = response ? JSON.stringify(response, null, 2) : (error || '');
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="playground" className="saas-section">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <div className="saas-badge">
            <Play size={14} /> Interactive Developer Sandbox
          </div>
          <h2 className="saas-heading">Live API Playground</h2>
          <p className="saas-subheading mx-auto">
            Test and inspect live HTTP responses against real endpoints directly from your browser.
          </p>
        </div>

        <div className="playground-card">
          {/* Playground Header / Controls */}
          <div className="playground-header">
            <div className="playground-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
                <span className="method-tag method-get">GET</span>
                <select
                  className="select-input"
                  style={{ width: '100%', fontWeight: 600 }}
                  value={endpoint}
                  onChange={(e) => {
                    setEndpoint(e.target.value);
                    setResponse(null);
                    setError(null);
                  }}
                >
                  <option value="/api/p/:slug">GET /api/p/:slug (Public Portfolio)</option>
                  <option value="/api/p/:slug/section/:key">GET /api/p/:slug/section/:key (Public Section)</option>
                  <option value="/api/v1/portfolio">GET /api/v1/portfolio (API Key Auth)</option>
                  <option value="/api/v1/section/:key">GET /api/v1/section/:key (API Key Auth)</option>
                  <option value="/health">GET /health (Liveness Check)</option>
                </select>
              </div>

              {/* Endpoint Parameters */}
              {endpoint.includes(':slug') && (
                <input
                  type="text"
                  placeholder="slug (e.g. gabrial-deora)"
                  className="text-input"
                  style={{ width: 170 }}
                  value={paramSlug}
                  onChange={(e) => setParamSlug(e.target.value)}
                />
              )}

              {endpoint.includes(':key') && (
                <input
                  type="text"
                  placeholder="key (e.g. projects)"
                  className="text-input"
                  style={{ width: 150 }}
                  value={paramKey}
                  onChange={(e) => setParamKey(e.target.value)}
                />
              )}

              {endpoint.startsWith('/api/v1') && (
                <input
                  type="password"
                  placeholder="API Key (pk_live_...)"
                  className="text-input"
                  style={{ width: 220, fontFamily: 'var(--saas-mono)' }}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={executeRequest}
                disabled={loading}
                style={{ padding: '8px 18px' }}
              >
                {loading ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
                <span>{loading ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>
          </div>

          {/* Playground Split Pane */}
          <div className="playground-split">
            {/* Left Pane: Generated cURL */}
            <div className="playground-pane">
              <div className="pane-label">Generated Request cURL</div>
              <div style={{ background: '#0f172a', borderRadius: 'var(--saas-radius)', padding: 16, color: '#f1f5f9', fontFamily: 'var(--saas-mono)', fontSize: 12, lineHeight: 1.6, overflowX: 'auto', minHeight: 280 }}>
                <code>{getGeneratedCurl()}</code>
              </div>
            </div>

            {/* Right Pane: Live Response */}
            <div className="playground-pane" style={{ background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="pane-label" style={{ margin: 0 }}>Response Payload</div>
                {statusCode && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: statusCode >= 200 && statusCode < 300 ? '#dcfce7' : '#fee2e2',
                        color: statusCode >= 200 && statusCode < 300 ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {statusCode} {statusCode === 200 ? 'OK' : ''}
                    </span>
                    {latency && (
                      <span style={{ fontSize: 11, color: 'var(--saas-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={11} /> {latency}ms
                      </span>
                    )}
                    <button
                      type="button"
                      className="code-copy-btn"
                      onClick={copyResponse}
                      style={{ color: '#475569', background: '#e2e8f0', padding: '2px 8px' }}
                    >
                      {copied ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      <span style={{ fontSize: 11 }}>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  background: '#0f172a',
                  borderRadius: 'var(--saas-radius)',
                  padding: 16,
                  color: '#f1f5f9',
                  fontFamily: 'var(--saas-mono)',
                  fontSize: 12,
                  lineHeight: 1.5,
                  minHeight: 280,
                  maxHeight: 380,
                  overflowY: 'auto',
                }}
              >
                {loading ? (
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RefreshCw size={14} className="spin" /> Executing live HTTP request to {getComputedPath()}...
                  </div>
                ) : error ? (
                  <div style={{ color: '#f87171' }}>
                    {`{\n  "success": false,\n  "error": "${error}"\n}`}
                  </div>
                ) : response ? (
                  <pre style={{ margin: 0 }}>{JSON.stringify(response, null, 2)}</pre>
                ) : (
                  <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                    Select an endpoint above and click &quot;Send Request&quot; to inspect real live JSON output.
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
