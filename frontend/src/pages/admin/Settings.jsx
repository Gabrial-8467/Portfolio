import { useEffect, useState } from 'react';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import JsonEditor from '../../admin/components/JsonEditor';
import Field, { TextInput } from '../../admin/components/Field';
import { Save, ExternalLink } from 'lucide-react';

export default function Settings() {
  const { activePortfolio, refreshPortfolios } = useAuth();

  const [name, setName] = useState('');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

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
    setSaved(false);
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
    setSaved(false);
    try {
      await api.portfolios.updateSettings(activePortfolio._id, settings);
      await api.portfolios.update(activePortfolio._id, { name });
      await refreshPortfolios();
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading…</div>;

  if (!activePortfolio) {
    return <div className="admin-loading">No portfolio selected. Create one first.</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Portfolio Settings</h1>
          <p className="admin-page-subtitle">Global configuration for your portfolio design.</p>
        </div>
        <a
          className="admin-btn admin-btn-ghost"
          href={`/?preview=${activePortfolio.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          View /
          {activePortfolio.slug}
        </a>
      </div>

      {error && <div className="admin-form-error">{error}</div>}
      {saved && <div className="admin-form-success">Saved successfully.</div>}

      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-grid">
          <Field label="Portfolio Name">
            <TextInput value={name} onChange={setName} placeholder="My Portfolio" />
          </Field>
          <Field label="Public Slug" hint="Read-only. Determines the public URL /?preview=&lt;slug&gt;.">
            <TextInput value={activePortfolio.slug} onChange={() => {}} disabled />
          </Field>
        </div>

        <h2 className="admin-form-section">Design Configuration</h2>
        <p className="admin-form-hint">
          Free-form JSON your frontend reads. Common keys like <code>site</code>, <code>navigation</code>, or <code>theme</code> are supported — use whatever your design expects.
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
    </div>
  );
}