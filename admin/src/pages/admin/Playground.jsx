import { useState } from 'react';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import {
  Send,
  RefreshCw,
  Copy,
  Check,
  Clock,
} from 'lucide-react';

export default function Playground() {
  const { activePortfolio } = useAuth();
  const slug = activePortfolio?.slug || 'gabrial-deora';

  const [endpoint, setEndpoint] = useState(`/api/p/${slug}`);
  const [sectionKey, setSectionKey] = useState('projects');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null);
    setLatency(null);

    const startTime = performance.now();
    try {
      let res;
      if (endpoint === `/api/p/${slug}`) {
        res = await api.public.getPortfolio(slug);
      } else if (endpoint === `/api/p/${slug}/section/:key`) {
        res = await api.public.getSection(slug, sectionKey || 'projects');
      } else if (endpoint === '/api/v1/portfolio') {
        if (!apiKey) throw new Error('API key is required for /api/v1/portfolio');
        res = await api.get('/api/v1/portfolio', { headers: { Authorization: `Bearer ${apiKey}` } });
      } else if (endpoint === '/api/v1/section/:key') {
        if (!apiKey) throw new Error('API key is required for /api/v1/section/:key');
        res = await api.get(`/api/v1/section/${sectionKey || 'projects'}`, { headers: { Authorization: `Bearer ${apiKey}` } });
      } else if (endpoint === '/health') {
        res = await api.get('/health');
      }

      setLatency(Math.round(performance.now() - startTime));
      setStatusCode(200);
      setResponse(res);
    } catch (err) {
      setLatency(Math.round(performance.now() - startTime));
      setStatusCode(err.status || 500);
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    const text = response ? JSON.stringify(response, null, 2) : error;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">API Playground</h1>
          <p className="admin-page-desc">
            Test and inspect live API payloads directly against your active portfolio (<code>{slug}</code>).
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          boxShadow: 'var(--admin-shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {/* Controls Bar */}
        <div
          style={{
            padding: 16,
            background: '#f8fafc',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ background: '#0284c7', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>
            GET
          </span>

          <select
            className="admin-select"
            style={{ width: 320, background: '#ffffff' }}
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          >
            <option value={`/api/p/${slug}`}>GET /api/p/{slug} (Public)</option>
            <option value={`/api/p/${slug}/section/:key`}>GET /api/p/{slug}/section/:key (Public Section)</option>
            <option value="/api/v1/portfolio">GET /api/v1/portfolio (API Key)</option>
            <option value="/api/v1/section/:key">GET /api/v1/section/:key (API Key)</option>
            <option value="/health">GET /health</option>
          </select>

          {endpoint.includes(':key') && (
            <input
              type="text"
              className="admin-input"
              style={{ width: 160 }}
              placeholder="key (e.g. projects)"
              value={sectionKey}
              onChange={(e) => setSectionKey(e.target.value)}
            />
          )}

          {endpoint.startsWith('/api/v1') && (
            <input
              type="password"
              className="admin-input"
              style={{ width: 220, fontFamily: 'var(--admin-mono)' }}
              placeholder="API Key (pk_live_...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          )}

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? <RefreshCw size={14} className="spin" /> : <Send size={14} />}
            <span>{loading ? 'Sending...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Response Panel */}
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>
              Live JSON Response
            </div>

            {statusCode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: statusCode === 200 ? '#dcfce7' : '#fee2e2',
                    color: statusCode === 200 ? '#15803d' : '#b91c1c',
                  }}
                >
                  {statusCode} {statusCode === 200 ? 'OK' : ''}
                </span>
                {latency && (
                  <span style={{ fontSize: 11, color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {latency}ms
                  </span>
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={copyResponse}
                  style={{ fontSize: 11, padding: '3px 8px' }}
                >
                  {copied ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              background: '#0f172a',
              borderRadius: 8,
              padding: 16,
              color: '#f1f5f9',
              fontFamily: 'var(--admin-mono)',
              fontSize: 13,
              minHeight: 320,
              maxHeight: 500,
              overflowY: 'auto',
            }}
          >
            {loading ? (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={14} className="spin" /> Executing request...
              </div>
            ) : error ? (
              <div style={{ color: '#f87171' }}>
                {`{\n  "success": false,\n  "error": "${error}"\n}`}
              </div>
            ) : response ? (
              <pre style={{ margin: 0 }}>{JSON.stringify(response, null, 2)}</pre>
            ) : (
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                Click &quot;Send Request&quot; above to test this endpoint live.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
