import { useState, useEffect } from 'react';
import { useAuth } from '../../admin/useAuth';
import { api, API_URL } from '../../api/client';
import {
  Send,
  RefreshCw,
  Copy,
  Check,
  Clock,
  Terminal,
} from 'lucide-react';

export default function Playground() {
  const { activePortfolio } = useAuth();
  const slug = activePortfolio?.slug || 'my-portfolio';

  const [endpoint, setEndpoint] = useState(`/api/p/${slug}`);
  const [sectionKey, setSectionKey] = useState('projects');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    // Reset the playground when the active portfolio changes
    // eslint-disable-next-line react/set-state-in-effect
    setEndpoint(`/api/p/${slug}`);
    // eslint-disable-next-line react/set-state-in-effect
    setSectionKey('projects');
    // eslint-disable-next-line react/set-state-in-effect
    setApiKey('');
    // eslint-disable-next-line react/set-state-in-effect
    setStatusCode(null);
    // eslint-disable-next-line react/set-state-in-effect
    setLatency(null);
    // eslint-disable-next-line react/set-state-in-effect
    setResponse(null);
    // eslint-disable-next-line react/set-state-in-effect
    setError(null);
  }, [slug]);

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

      if (res === undefined) {
        setStatusCode(null);
        setResponse(null);
        setError('No matching endpoint — select a valid endpoint first');
        return;
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

  const getCurlPreview = () => {
    const base = API_URL.replace(/\/+$/, '');
    let target = endpoint.replace(':key', sectionKey || 'projects');
    if (target.startsWith('/api/v1')) {
      return `curl -X GET "${base}${target}" \\\n  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\\n  -H "Accept: application/json"`;
    }
    return `curl -X GET "${base}${target}" \\\n  -H "Accept: application/json"`;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlPreview());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">API Playground</h1>
          <p className="admin-page-subtitle">
            Execute live test requests and inspect JSON response trees for workspace <strong>{slug}</strong>.
          </p>
        </div>
      </div>

      <div
        style={{
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          boxShadow: 'var(--admin-shadow-sm)',
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        {/* Controls Header */}
        <div
          style={{
            padding: 16,
            background: 'var(--admin-surface-subtle)',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span className="admin-badge admin-badge-blue" style={{ fontWeight: 700 }}>
            GET
          </span>

          <select
            className="admin-select"
            style={{ width: 300 }}
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
            <span>{loading ? 'Executing…' : 'Send Request'}</span>
          </button>
        </div>

        {/* Response Viewport */}
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-muted)', letterSpacing: '0.04em' }}>
              HTTP Response
            </div>

            {statusCode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  className={statusCode === 200 ? 'admin-badge admin-badge-green' : 'admin-badge admin-badge-red'}
                >
                  {statusCode} {statusCode === 200 ? 'OK' : 'Error'}
                </span>
                {latency && (
                  <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {latency}ms
                  </span>
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={copyResponse}
                >
                  {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              background: '#0f172a',
              borderRadius: 'var(--admin-radius-sm)',
              padding: 18,
              color: '#f8fafc',
              fontFamily: 'var(--admin-mono)',
              fontSize: 13,
              minHeight: 300,
              maxHeight: 520,
              overflowY: 'auto',
            }}
          >
            {loading ? (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={14} className="spin" /> Executing request against server…
              </div>
            ) : error ? (
              <div style={{ color: '#f87171' }}>
                {`{\n  "success": false,\n  "error": "${error}"\n}`}
              </div>
            ) : response ? (
              <pre style={{ margin: 0 }}>{JSON.stringify(response, null, 2)}</pre>
            ) : (
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                Click &quot;Send Request&quot; above to execute a real test call.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated cURL Section */}
      <div
        style={{
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          padding: 18,
          boxShadow: 'var(--admin-shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>
            <Terminal size={15} color="#4f46e5" />
            <span>Generated cURL Command</span>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={copyCurl}
          >
            {copiedCurl ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>
        <div style={{ background: '#0f172a', borderRadius: 'var(--admin-radius-sm)', padding: 14, color: '#38bdf8', fontFamily: 'var(--admin-mono)', fontSize: 12, lineHeight: 1.6 }}>
          <pre style={{ margin: 0 }}><code>{getCurlPreview()}</code></pre>
        </div>
      </div>
    </div>
  );
}
