import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import JsonEditor from '../../admin/components/JsonEditor';
import StructuredEditor from '../../admin/components/StructuredEditor';
import { getSchemaForKey } from '../../admin/structuredSchemas';
import { useToast } from '../../admin/components/useToast';
import Field, { TextInput, Toggle } from '../../admin/components/Field';
import { Save, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ConfirmDialog } from '../../admin/components/ConfirmDialog';

export default function SectionEditor() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { activePortfolio } = useAuth();
  const { toast } = useToast();

  const [section, setSection] = useState(null);
  const [form, setForm] = useState({ key: '', label: '', isPublished: true, content: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mode, setMode] = useState('structured');

  const isNew = sectionId === 'new' || !sectionId;
  const schema = getSchemaForKey(form.key);

  useEffect(() => {
    setMode(schema ? 'structured' : 'json');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.key]);

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
        const payload = {
          ...form,
          content:
            form.content ?? (schema ? (schema.kind === 'list' ? [] : {}) : null),
        };
        const created = await api.sections.create(activePortfolio._id, payload);
        toast('Section created successfully', 'success');
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
        toast('Section saved successfully', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to save section');
      toast(err.message || 'Failed to save section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!activePortfolio || isNew) return;
    try {
      await api.sections.remove(activePortfolio._id, sectionId);
      toast('Section deleted', 'info');
      navigate('/admin/sections');
    } catch (err) {
      setError(err.message || 'Failed to delete section');
      setDeleteOpen(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading section content…</div>;

  if (!activePortfolio) {
    return <div className="admin-loading">No portfolio selected. Create one first.</div>;
  }

  return (
    <div className="admin-page">
      {/* Top Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-icon-only"
            onClick={() => navigate('/admin/sections')}
            title="Back to Sections"
            aria-label="Back to Sections"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="admin-page-title">{isNew ? 'New Section' : `Edit: ${section?.key || form.key}`}</h1>
            <p className="admin-page-subtitle">
              Changes update your live portfolio REST API immediately upon saving.
            </p>
          </div>
        </div>

        <div className="admin-page-actions">
          {!isNew && (
            <button
              type="button"
              className="admin-btn admin-btn-danger-ghost"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={submit}
            disabled={saving}
          >
            <Save size={15} />
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {error && <div className="admin-form-error">{error}</div>}
      {saved && (
        <div className="admin-form-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>All changes saved successfully to portfolio database.</span>
        </div>
      )}

      {/* Section Metadata Card */}
      <div className="admin-form" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 16 }}>
          General Section Settings
        </div>
        <div className="admin-form-grid">
          <Field label="Section Key" hint="Unique identifier in API responses (lowercase, hyphens).">
            <TextInput
              value={form.key}
              onChange={(v) => set('key')(v.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g. projects"
              disabled={!isNew}
            />
          </Field>
          <Field label="Display Label" hint="Human-friendly name shown in dashboards.">
            <TextInput
              value={form.label}
              onChange={set('label')}
              placeholder="e.g. Featured Projects"
            />
          </Field>
          <Field label="API Visibility">
            <Toggle
              checked={form.isPublished}
              onChange={set('isPublished')}
              label={form.isPublished ? 'Published to API' : 'Saved as Draft'}
            />
          </Field>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="admin-form">
        <div className="admin-toolbar" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)' }}>
            Section Content Payload
          </div>

          {schema ? (
            <div className="admin-seg">
              <button
                type="button"
                className={mode === 'structured' ? 'active' : ''}
                onClick={() => setMode('structured')}
              >
                Structured Form
              </button>
              <button
                type="button"
                className={mode === 'json' ? 'active' : ''}
                onClick={() => setMode('json')}
              >
                Raw JSON
              </button>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
              Custom key — editing as raw JSON schema.
            </span>
          )}
        </div>

        <div style={{ minHeight: 320 }}>
          {schema && mode === 'structured' ? (
            <StructuredEditor schema={schema} value={form.content} onChange={set('content')} />
          ) : (
            <JsonEditor value={form.content} onChange={set('content')} />
          )}
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={submit}
            disabled={saving}
          >
            <Save size={15} />
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {deleteOpen && (
        <ConfirmDialog
          title="Delete Section"
          message={`Are you sure you want to delete section "${form.key}"? All associated content will be permanently removed.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
