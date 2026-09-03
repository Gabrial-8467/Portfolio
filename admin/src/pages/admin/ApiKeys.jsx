import { useEffect, useState } from 'react';
import { Copy, KeyRound, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../admin/useAuth';
import ItemModal from '../../admin/components/ItemModal';
import { useToast } from '../../admin/components/useToast';
import AdminLoader from '../../admin/components/AdminLoader';

const SNIPPET = (apiUrl) => `// Consume portfolio content with your API key
const res = await fetch('${apiUrl}/api/v1/portfolio', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Accept': 'application/json'
  }
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
    <button type="button" className={`admin-btn ${small ? 'admin-btn-sm' : ''} admin-btn-secondary`} onClick={copy}>
      {copied ? <CheckCircle2 size={13} color="#10b981" /> : <Copy size={13} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export default function ApiKeys() {
  const { activePortfolio } = useAuth();
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
      const result = await api.apiKeys.create(createName.trim() || 'Production Key');
      setKeys((current) => [
        { ...result.apiKey, portfolioName: activePortfolio?.name || '' },
        ...current,
      ]);
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

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">API Keys</h1>
          <p className="admin-page-subtitle">
            Generate and manage access tokens for consuming your portfolio via REST APIs.
          </p>
        </div>
        <div className="admin-page-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreateOpen(true)} disabled={!activePortfolio}>
            <Plus size={15} />
            <span>Create API Key</span>
          </button>
        </div>
      </div>

      {/* Quick Integration Card */}
      <div className="admin-form" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-primary-light)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)' }}>
              Headless Content Delivery API
            </div>
            <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
              Bearer Authentication header: <code>Authorization: Bearer {'<API_KEY>'}</code>
            </div>
          </div>
        </div>

        <div style={{ background: '#0f172a', borderRadius: 'var(--admin-radius-sm)', padding: 16, color: '#f8fafc', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em' }}>
              Quick Code Example
            </span>
            <CopyButton text={SNIPPET(apiUrl).replace('YOUR_API_KEY', '…')} label="Code snippet copied" small />
          </div>
          <pre style={{ margin: 0, fontFamily: 'var(--admin-mono)', fontSize: 12, lineHeight: 1.6, overflowX: 'auto' }}>
            <code>{SNIPPET(apiUrl)}</code>
          </pre>
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="admin-toolbar" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
            Active Credentials ({keys.length})
          </h2>
        </div>

        {loading ? (
          <AdminLoader message="Loading API credentials…" subtext="Retrieving SHA-256 key records" />
        ) : keys.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon"><KeyRound size={24} /></div>
            <div className="admin-empty-title">No API keys created</div>
            <div className="admin-empty-desc">Create your first API key to connect your custom frontend or mobile app.</div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreateOpen(true)} disabled={!activePortfolio}>
              <Plus size={15} /> Create First Key
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Key Name</th>
                  <th>Key Prefix</th>
                  <th>Workspace</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th className="admin-table-actions-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k._id}>
                    <td><strong>{k.name}</strong></td>
                    <td>
                      <span className="prefix-chip">{k.prefix + '••••••••'}</span>
                    </td>
                    <td>{k.portfolioName || activePortfolio?.name || '—'}</td>
                    <td>{formatDate(k.createdAt)}</td>
                    <td>{formatDate(k.lastUsedAt)}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger-ghost admin-btn-sm"
                        onClick={() => setRevokeTarget(k)}
                        title="Revoke key"
                      >
                        <Trash2 size={13} />
                        <span>Revoke</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      <ItemModal
        title="Create API Key"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      >
        <p className="admin-modal-message">
          Generate a secret credential to authenticate requests for <strong>{activePortfolio?.name}</strong>.
        </p>
        <div className="admin-field">
          <label className="admin-field-label" htmlFor="apikey-name">Key Name</label>
          <input
            id="apikey-name"
            className="admin-input"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder={activePortfolio ? `${activePortfolio.name} Key` : 'Production Key'}
            autoFocus
          />
        </div>
        {creatingError && <div className="admin-form-error">{creatingError}</div>}
      </ItemModal>

      {/* Reveal Key Modal */}
      <ItemModal
        title="Your New API Key"
        open={Boolean(revealedKey)}
        onClose={() => setRevealedKey(null)}
        onSubmit={() => setRevealedKey(null)}
        loading={false}
      >
        <div style={{ padding: '12px 14px', background: 'var(--admin-warning-light)', border: '1px solid var(--admin-warning-border)', borderRadius: 'var(--admin-radius-sm)', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-warning)', marginBottom: 2 }}>
            ⚠ Save this key now
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
            For security, the full secret key will <strong>never be shown again</strong>. Store it securely in your environment variables.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <input
            type="text"
            readOnly
            value={revealedKey || ''}
            className="admin-input"
            style={{ fontFamily: 'var(--admin-mono)', fontSize: 13, background: '#f8fafc', fontWeight: 600 }}
          />
          <CopyButton text={revealedKey} label="API key copied to clipboard" />
        </div>

        <p className="admin-field-hint">
          Pass it as <code>Authorization: Bearer {'<YOUR_API_KEY>'}</code> in your HTTP headers.
        </p>
      </ItemModal>

      {/* Revoke Key Modal */}
      <ItemModal
        title="Revoke API Key"
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        onSubmit={handleRevoke}
        loading={revoking}
      >
        <p className="admin-modal-message">
          Are you sure you want to revoke <strong>{revokeTarget?.name}</strong>? Any application or frontend using this key will immediately lose access.
        </p>
      </ItemModal>
    </div>
  );
}
