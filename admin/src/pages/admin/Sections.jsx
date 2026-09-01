import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import ItemModal from '../../admin/components/ItemModal';
import Field, { TextInput, Toggle } from '../../admin/components/Field';
import { ConfirmDialog, ItemsToolbar } from '../../admin/components/ConfirmDialog';

export default function Sections() {
  const { activePortfolio } = useAuth();
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
    setLoading(true);
    load().catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePortfolio?._id]);

  const submit = async () => {
    if (!activePortfolio) return;
    setSaving(true);
    setError('');
    try {
      const created = await api.sections.create(activePortfolio._id, form);
      setModalOpen(false);
      navigate(`/admin/sections/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create section');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!activePortfolio || !deleteTarget) return;
    try {
      await api.sections.remove(activePortfolio._id, deleteTarget._id);
      setSections((prev) => prev.filter((s) => s._id !== deleteTarget._id));
    } catch (err) {
      setError(err.message || 'Failed to delete section');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sections</h1>
          <p className="admin-page-subtitle">
            Each section is a named piece of content your frontend renders. Content is free-form, so it works with any portfolio design.
          </p>
        </div>
      </div>

      <ItemsToolbar onAdd={() => setModalOpen(true)} addLabel="Section" />

      {error && <div className="admin-form-error">{error}</div>}

      {sections.length === 0 ? (
        <div className="admin-empty-state">
          <p>No sections yet. Create one to start publishing content.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Label</th>
                <th>Order</th>
                <th>Status</th>
                <th className="admin-table-actions-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section._id}>
                  <td><strong>{section.key}</strong></td>
                  <td>{section.label || '—'}</td>
                  <td>{section.order}</td>
                  <td>
                    {section.isPublished ? (
                      <span className="admin-badge admin-badge-green">Published</span>
                    ) : (
                      <span className="admin-badge admin-badge-red">Draft</span>
                    )}
                  </td>
                  <td className="admin-table-actions">
                    <Link to={`/admin/sections/${section._id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ItemModal
        title="New Section"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        loading={saving}
      >
        <div className="admin-form-grid">
          <Field label="Key" hint="Used by your frontend, e.g. projects, about, skills. Lowercase letters and hyphens only.">
            <TextInput value={form.key} onChange={(v) => setForm((prev) => ({ ...prev, key: v.toLowerCase() }))} placeholder="projects" />
          </Field>
          <Field label="Label" hint="Display name shown in this admin panel.">
            <TextInput value={form.label} onChange={(v) => setForm((prev) => ({ ...prev, label: v }))} placeholder="Projects" />
          </Field>
          <Field label="Visibility">
            <Toggle checked={form.isPublished} onChange={(v) => setForm((prev) => ({ ...prev, isPublished: v }))} label={form.isPublished ? 'Published' : 'Draft'} />
          </Field>
        </div>
      </ItemModal>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete section"
          message={`Delete section "${deleteTarget.key}"? All of its content will be removed. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}