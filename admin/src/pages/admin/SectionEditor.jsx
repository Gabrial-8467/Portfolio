import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import JsonEditor from '../../admin/components/JsonEditor';
import Field, { TextInput, Toggle } from '../../admin/components/Field';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { ConfirmDialog } from '../../admin/components/ConfirmDialog';

export default function SectionEditor() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { activePortfolio } = useAuth();

  const [section, setSection] = useState(null);
  const [form, setForm] = useState({ key: '', label: '', isPublished: true, content: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isNew = sectionId === 'new' || !sectionId;

  const set = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const load = async () => {
    if (!activePortfolio || isNew) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.sections.get(activePortfolio._id, sectionId);
      setSection(data);
      setForm({
        key: data.key,
        label: data.label || '',
        isPublished: data.isPublished,
        content: data.content,
      });
    } catch (err) {
      setError(err.message || 'Failed to load section');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, activePortfolio?._id]);

  const submit = async () => {
    if (!activePortfolio) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      if (isNew) {
        const created = await api.sections.create(activePortfolio._id, form);
        navigate(`/admin/sections/${created._id}`, { replace: true });
      } else {
        const updated = await api.sections.update(activePortfolio._id, sectionId, form);
        setForm({
          key: updated.key,
          label: updated.label || '',
          isPublished: updated.isPublished,
          content: updated.content,
        });
        setSaved(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!activePortfolio || isNew) return;
    try {
      await api.sections.remove(activePortfolio._id, sectionId);
      navigate('/admin/sections');
    } catch (err) {
      setError(err.message || 'Failed to delete section');
      setDeleteOpen(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading…</div>;

  if (!activePortfolio) {
    return <div className="admin-loading">No portfolio selected. Create one first.</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-editor-heading">
          <LinkBack onClick={() => navigate('/admin/sections')} />
          <div>
            <h1 className="admin-page-title">{isNew ? 'New Section' : `Editing: ${section?.key || form.key}`}</h1>
            <p className="admin-page-subtitle">
              Make changes below — your portfolio frontend will pick them up automatically.
            </p>
          </div>
        </div>
        {!isNew && (
          <button type="button" className="admin-btn admin-btn-danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>

      {error && <div className="admin-form-error">{error}</div>}
      {saved && <div className="admin-form-success">Saved successfully.</div>}

      <form
        className="admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="admin-form-grid">
          <Field label="Key" hint="Lowercase letters and hyphens only.">
            <TextInput value={form.key} onChange={(v) => set('key')(v.toLowerCase())} placeholder="projects" />
          </Field>
          <Field label="Label" hint="Display name shown in this admin panel.">
            <TextInput value={form.label} onChange={set('label')} placeholder="Projects" />
          </Field>
          <Field label="Visibility">
            <Toggle checked={form.isPublished} onChange={set('isPublished')} label={form.isPublished ? 'Published' : 'Draft'} />
          </Field>
        </div>

        <h2 className="admin-form-section">Content</h2>
        <div className="admin-content-editor">
          <JsonEditor value={form.content} onChange={set('content')} />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving…' : 'Save Section'}
          </button>
        </div>
      </form>

      {deleteOpen && (
        <ConfirmDialog
          title="Delete section"
          message={`Delete section "${form.key}"? All of its content will be removed. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}

function LinkBack({ onClick }) {
  return (
    <button type="button" className="admin-btn admin-btn-ghost admin-btn-icon-only" onClick={onClick} aria-label="Back to sections">
      <ArrowLeft size={16} />
    </button>
  );
}