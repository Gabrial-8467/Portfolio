import { useEffect, useState } from 'react';
import { Copy, KeyRound, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api, getPublicPortfolioUrl } from '../../api/client';
import { useAuth } from '../../admin/useAuth';
import ItemModal from '../../admin/components/ItemModal';
import { useToast } from '../../admin/components/useToast';

const SNIPPET = (apiUrl) => `// Fetch your live portfolio with one request
const res = await fetch('${apiUrl}/api/v1/portfolio', {
  headers: { Authorization: 'Bearer YOUR_API_KEY' }
});
const { data } = await res.json();
console.log(data);`;

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function CopyButton({ text, label = null, small = false }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    toast(label || 'Copied to clipboard', 'success');
  };

  return (
    <button type="button" className={`admin-btn ${small ? 'admin-btn-sm' : ''} admin-btn-ghost`} onClick={copy}>
      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function ApiKeys() {
  const { activePortfolio, portfolios } = useAuth();
  const { toast } = useToast();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingError, setCreatingError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [revealedKey, setRevealedKey] = useState(null);
  const [revoking, setRevoking] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);

  const loadKeys = () =>
    api.apiKeys
      .list()
      .then(setKeys)
      .catch(() => toast('Could not load API keys', 'error'))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!activePortfolio) return;
    setCreating(true);
    setCreatingError('');
    try {
      const result = await api.apiKeys.create(activePortfolio._id, createName.trim() || 'Main key');
      setKeys((current) => [result.apiKey, ...current]);
      setCreateOpen(false);
      setCreateName('');
      setRevealedKey(result.key);
    } catch (err) {
      setCreatingError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await api.apiKeys.revoke(revokeTarget._id);
      setKeys((current) => current.filter((k) => k._id !== revokeTarget._id));
      toast('API key revoked', 'success');
      setRevokeTarget(null);
    } catch (err) {
      toast(err.message || 'Could not revoke key', 'error');
    } finally {
      setRevoking(false);
    }
  };

  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const publicSiteUrl = getPublicPortfolioUrl(activePortfolio?.slug);
  const apiEndpointUrl = activePortfolio?.slug ? `${apiUrl}/api/p/${activePortfolio.slug}` : null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">API Keys</h1>
          <p className="admin-page-subtitle">
            Generate keys to connect an external portfolio to your content. The key is shown only once — store it securely.
          </p>
        </div>
        <div className="admin-page-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreateOpen(true)} disabled={!activePortfolio}>
            <Plus size={16} /> New API key
          </button>
        </div>
      </div>

      <div className="apikey-card">
        <h2 className="apikey-card-title">
          <KeyRound size={16} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Integrate your portfolio
        </h2>
        <div className="kv-row">
          <span className="kv-label">Dev server</span>
          <span className="kv-value">{apiUrl}</span>
        </div>
        {publicSiteUrl && (
          <div className="kv-row">
            <span className="kv-label">Public Portfolio</span>
            <span className="kv-value">
              <a className="admin-portfolio-link" href={publicSiteUrl} target="_blank" rel="noreferrer">
                {publicSiteUrl}
              </a>
            </span>
          </div>
        )}
        {apiEndpointUrl && (
          <div className="kv-row">
            <span className="kv-label">JSON API Endpoint</span>
            <span className="kv-value">
              <a className="admin-portfolio-link" href={apiEndpointUrl} target="_blank" rel="noreferrer">
                {apiEndpointUrl}
              </a>
            </span>
          </div>
        )}
        <div className="kv-row">
          <span className="kv-label">Live data</span>
          <span className="kv-value">
            <code className="prefix-chip">GET /api/v1/portfolio</code>
            <span className="admin-badge admin-badge-green" style={{ marginLeft: 8 }}>No CORS restrictions</span>
          </span>
        </div>
        <div className="snippet-box">
          <pre>{SNIPPET(apiUrl)}</pre>
          <CopyButton text={SNIPPET(apiUrl).replace('YOUR_API_KEY', '…')} label="Code copied" small />
        </div>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading keys…</div>
        ) : keys.length === 0 ? (
          <div className="admin-empty-state">
            <p>No API keys yet. Create one to start integrating.</p>
            <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreateOpen(true)} disabled={!activePortfolio}>
              <Plus size={15} /> Create your first key
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Portfolio</th>
                <th>Last used</th>
                <th className="admin-table-actions-head">Created</th>
                <th className="admin-table-actions-head"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k._id}>
                  <td style={{ fontWeight: 600 }}>{k.name}</td>
                  <td>
                    <span className="prefix-chip">{k.prefix + '…'}</span>
                  </td>
                  <td>{k.portfolioName || '—'}</td>
                  <td>{formatDate(k.lastUsedAt)}</td>
                  <td className="admin-table-actions">{formatDate(k.createdAt)}</td>
                  <td className="admin-table-actions">
                    <button type="button" className="admin-icon-btn admin-icon-btn-danger" onClick={() => setRevokeTarget(k)} aria-label="Revoke key">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ItemModal
        title="Create API key"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      >
        <p className="admin-modal-message">
          {portfolios.length > 1
            ? 'The key will be scoped to the active portfolio.'
            : 'The key is scoped to your portfolio.'}{' '}
          You will only see the full key once.
        </p>
        <div className="admin-field">
          <label className="admin-field-label" htmlFor="apikey-name">Name</label>
          <input
            id="apikey-name"
            className="admin-input"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder={activePortfolio ? `${activePortfolio.name} key` : 'Main key'}
            autoFocus
          />
        </div>
        {creatingError && <div className="admin-form-error">{creatingError}</div>}
      </ItemModal>

      <ItemModal
        title="Your new API key — save it now"
        open={Boolean(revealedKey)}
        onClose={() => setRevealedKey(null)}
        onSubmit={() => setRevealedKey(null)}
        loading={false}
      >
        <p className="admin-modal-message">
          This is the <strong>only time</strong> the full key will be displayed. Store it somewhere safe — you can revoke it later.
        </p>
        <div className="copy-row">
          <div className="key-mono key-reveal">{revealedKey}</div>
          <CopyButton text={revealedKey} label="API key copied" />
        </div>
        <p className="admin-field-hint">
          Use it as <code>Authorization: Bearer {'<key>'}</code> against <code className="prefix-chip">/api/v1/portfolio</code>.
        </p>
      </ItemModal>

      <ItemModal
        title="Revoke API key"
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        onSubmit={handleRevoke}
        loading={revoking}
      >
        <p className="admin-modal-message">
          Revoking <strong>{revokeTarget?.name}</strong> will immediately stop requests using this key. This cannot be undone.
        </p>
      </ItemModal>
    </div>
  );
}