import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import { useToast } from '../../admin/components/useToast';
import ItemModal from '../../admin/components/ItemModal';
import Field, { TextInput, Toggle } from '../../admin/components/Field';
import { ConfirmDialog } from '../../admin/components/ConfirmDialog';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit,
  SquareCheckBig,
  Plus,
  Layers,
} from 'lucide-react';

const SUGGESTED_TEMPLATES = [
  { key: 'site', label: 'Site & About' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Work Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'services', label: 'Services' },
  { key: 'education', label: 'Education' },
  { key: 'socials', label: 'Social Links' },
  { key: 'stats', label: 'Stats' },
  { key: 'achievements', label: 'Hackathons & Awards' },
];

export default function Sections() {
  const { activePortfolio } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ key: '', label: '', isPublished: true });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    if (!activePortfolio) return;
    setLoading(true);
    try {
      const list = await api.sections.list(activePortfolio._id);
      setSections(list || []);
    } catch (err) {
      setError(err.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSections([]);
    if (!activePortfolio) {
      // eslint-disable-next-line react/set-state-in-effect
      setLoading(false);
      return undefined;
    }
    // eslint-disable-next-line react/set-state-in-effect
    setLoading(true);
    load().catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePortfolio?._id]);

  const submit = async () => {
    if (!activePortfolio) return;
    if (!form.key.trim()) {
      addToast('Section key is required', 'error');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await api.sections.create(activePortfolio._id, form);
      addToast(`Section "${created.key}" created`, 'success');
      setModalOpen(false);
      navigate(`/admin/sections/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create section');
      addToast(err.message || 'Failed to create section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (section) => {
    if (!activePortfolio) return;
    const newStatus = !section.isPublished;
    try {
      await api.sections.update(activePortfolio._id, section._id, {
        isPublished: newStatus,
      });
      setSections((prev) =>
        prev.map((s) => (s._id === section._id ? { ...s, isPublished: newStatus } : s))
      );
      addToast(`Section "${section.key}" is now ${newStatus ? 'Published' : 'Draft'}`, 'info');
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const moveOrder = async (index, direction) => {
    if (!activePortfolio) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSections(reordered);

    try {
      const ids = reordered.map((s) => s._id);
      await api.sections.reorder(activePortfolio._id, ids);
      addToast('Section order updated', 'success');
    } catch {
      addToast('Failed to save order', 'error');
      load();
    }
  };

  const confirmDelete = async () => {
    if (!activePortfolio || !deleteTarget) return;
    try {
      await api.sections.remove(activePortfolio._id, deleteTarget._id);
      setSections((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      addToast(`Section "${deleteTarget.key}" deleted`, 'info');
    } catch (err) {
      setError(err.message || 'Failed to delete section');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className="admin-loading">Loading sections…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sections</h1>
          <p className="admin-page-subtitle">
            Manage, publish, and reorder content sections for <strong>{activePortfolio?.name}</strong>.
          </p>
        </div>
        <div className="admin-page-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={15} />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {error && <div className="admin-form-error">{error}</div>}

      {sections.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon"><Layers size={24} /></div>
          <div className="admin-empty-title">No content sections yet</div>
          <div className="admin-empty-desc">Create your first section using templates or custom JSON schemas.</div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={15} /> Create a Section
          </button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Order</th>
                <th>Section Key</th>
                <th>Display Label</th>
                <th>Status</th>
                <th className="admin-table-actions-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, idx) => (
                <tr key={section._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        style={{ padding: '3px 6px' }}
                        disabled={idx === 0}
                        onClick={() => moveOrder(idx, -1)}
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        style={{ padding: '3px 6px' }}
                        disabled={idx === sections.length - 1}
                        onClick={() => moveOrder(idx, 1)}
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--admin-mono)', fontWeight: 600, color: 'var(--admin-text)' }}>
                      {section.key}
                    </span>
                  </td>
                  <td>{section.label || '—'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => togglePublished(section)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {section.isPublished ? (
                        <span className="admin-badge admin-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <SquareCheckBig size={12} /> Published
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-red">Draft</span>
                      )}
                    </button>
                  </td>
                  <td className="admin-table-actions">
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link
                        to={`/admin/sections/${section._id}`}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger-ghost admin-btn-sm"
                        onClick={() => setDeleteTarget(section)}
                        title="Delete section"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Section Modal */}
      <ItemModal
        title="Create Content Section"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        loading={saving}
      >
        <div className="admin-form-grid">
          {/* Quick Template Suggestions */}
          <div>
            <label className="admin-field-label" style={{ marginBottom: 8, display: 'block' }}>
              Quick Templates
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTED_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, key: tmpl.key, label: tmpl.label }))}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    background: form.key === tmpl.key ? 'var(--admin-primary)' : 'var(--admin-surface-subtle)',
                    color: form.key === tmpl.key ? '#ffffff' : 'var(--admin-text)',
                    border: '1px solid var(--admin-border)',
                    cursor: 'pointer',
                    transition: 'var(--admin-transition)',
                  }}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Section Key" hint="Unique identifier for this section in the API (e.g. projects, skills, about).">
            <TextInput
              value={form.key}
              onChange={(v) => setForm((prev) => ({ ...prev, key: v.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
              placeholder="e.g. projects"
            />
          </Field>

          <Field label="Display Label" hint="Human-readable title displayed in the CMS.">
            <TextInput
              value={form.label}
              onChange={(v) => setForm((prev) => ({ ...prev, label: v }))}
              placeholder="e.g. Featured Projects"
            />
          </Field>

          <Field label="Initial Visibility">
            <Toggle
              checked={form.isPublished}
              onChange={(v) => setForm((prev) => ({ ...prev, isPublished: v }))}
              label={form.isPublished ? 'Published to API' : 'Save as Draft'}
            />
          </Field>
        </div>
      </ItemModal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete section"
          message={`Are you sure you want to delete section "${deleteTarget.key}"? All structured content inside this section will be permanently deleted.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
