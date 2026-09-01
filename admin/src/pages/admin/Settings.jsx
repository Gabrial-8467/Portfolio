import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api, getPublicPortfolioUrl } from '../../api/client';
import { useToast } from '../../admin/components/useToast';
import JsonEditor from '../../admin/components/JsonEditor';
import Field, { TextInput } from '../../admin/components/Field';
import { Save, ExternalLink, Trash2, AlertTriangle, User } from 'lucide-react';
import { ConfirmDialog } from '../../admin/components/ConfirmDialog';

export default function Settings() {
  const { user, activePortfolio, refreshPortfolios } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!activePortfolio) {
      // eslint-disable-next-line react/set-state-in-effect
      setLoading(false);
      return undefined;
    }
    const portfolioId = activePortfolio._id;
    // eslint-disable-next-line react/set-state-in-effect
    setLoading(true);
    setName(activePortfolio.name);
    async function load() {
      try {
        const data = await api.portfolios.getSettings(portfolioId);
        if (!cancelled) setSettings(data || {});
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load settings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activePortfolio]);

  const submit = async (e) => {
    e.preventDefault();
    if (!activePortfolio) return;
    setSaving(true);
    setError('');
    try {
      await api.portfolios.updateSettings(activePortfolio._id, settings);
      await api.portfolios.update(activePortfolio._id, { name });
      await refreshPortfolios();
      addToast('Portfolio settings saved successfully', 'success');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async () => {
    if (!activePortfolio) return;
    setDeleting(true);
    try {
      await api.portfolios.remove(activePortfolio._id);
      addToast(`Portfolio "${activePortfolio.name}" was deleted`, 'info');
      await refreshPortfolios();
      navigate('/admin');
    } catch (err) {
      addToast(err.message || 'Could not delete portfolio', 'error');
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading settings…</div>;

  if (!activePortfolio) {
    return <div className="admin-loading">No portfolio selected. Create one first.</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Workspace & Portfolio Settings</h1>
          <p className="admin-page-subtitle">Configure portfolio metadata, custom design preferences, and workspace access.</p>
        </div>
        <a
          className="admin-btn admin-btn-ghost"
          href={getPublicPortfolioUrl(activePortfolio.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          View /{activePortfolio.slug}
        </a>
      </div>

      {error && <div className="admin-form-error">{error}</div>}

      {/* User Account Info Box */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          padding: 24,
          marginBottom: 32,
          boxShadow: 'var(--admin-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <User size={18} color="var(--admin-blue)" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
            Account Profile
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Name</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', marginTop: 2 }}>{user?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', marginTop: 2 }}>{user?.email}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Role</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-blue)', marginTop: 2, textTransform: 'capitalize' }}>
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Config Form */}
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-grid">
          <Field label="Portfolio Name">
            <TextInput value={name} onChange={setName} placeholder="My Portfolio" />
          </Field>
          <Field label="Public Slug" hint="Identifier for the public API and URL /?preview=<slug>.">
            <TextInput value={activePortfolio.slug} onChange={() => {}} disabled />
          </Field>
        </div>

        <h2 className="admin-form-section">Custom Settings & Theme JSON</h2>
        <p className="admin-form-hint">
          Free-form JSON delivered under <code>portfolio.settings</code>. Configure color themes, font preferences, or social defaults.
        </p>
        <div className="admin-content-editor">
          <JsonEditor value={settings} onChange={setSettings} />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div
        style={{
          marginTop: 48,
          border: '1px solid #fecdd3',
          background: '#fff1f2',
          borderRadius: 'var(--admin-radius)',
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#be123c', marginBottom: 8 }}>
          <AlertTriangle size={18} />
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Danger Zone</h3>
        </div>
        <p style={{ fontSize: 13, color: '#9f1239', margin: '0 0 16px 0' }}>
          Deleting a portfolio workspace removes all associated sections, configurations, and API keys permanently.
        </p>
        <button
          type="button"
          className="admin-btn admin-btn-danger"
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 size={15} />
          <span>Delete Portfolio Workspace</span>
        </button>
      </div>

      {deleteConfirmOpen && (
        <ConfirmDialog
          title="Delete Portfolio Workspace"
          message={`Are you absolutely sure you want to delete "${activePortfolio.name}" (${activePortfolio.slug})? All section data and API keys will be removed.`}
          onConfirm={handleDeletePortfolio}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
}