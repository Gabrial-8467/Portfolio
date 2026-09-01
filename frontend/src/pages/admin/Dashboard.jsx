import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api } from '../../api/client';
import { Layers, Plus, ExternalLink, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { user, activePortfolio, refreshPortfolios, selectPortfolio } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadSections = async () => {
    if (!activePortfolio) return;
    setLoading(true);
    try {
      const list = await api.sections.list(activePortfolio._id);
      setSections(list || []);
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSections([]);
    setLoading(true);
    loadSections().catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePortfolio?._id]);

  const handleCreatePortfolio = async () => {
    setCreating(true);
    try {
      const created = await api.portfolios.create({ name: 'My Portfolio' });
      await refreshPortfolios();
      selectPortfolio(created._id);
      navigate('/admin');
    } catch {
      /* surface silently */
    } finally {
      setCreating(false);
    }
  };

  if (!activePortfolio) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Welcome</h1>
            <p className="admin-page-subtitle">Create your first portfolio to get started.</p>
          </div>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={handleCreatePortfolio} disabled={creating}>
          <Plus size={16} />
          {creating ? 'Creating…' : 'Create Portfolio'}
        </button>
      </div>
    );
  }

  const published = sections.filter((s) => s.isPublished).length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Welcome back, {user?.name || user?.email}. Editing <strong>{activePortfolio.name}</strong>.
          </p>
        </div>
        <div className="admin-page-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={loadSections}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link to="/admin/sections/new" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            New Section
          </Link>
        </div>
      </div>

      <div className="admin-cards-grid">
        <div className="admin-card">
          <div className="admin-card-icon"><Layers size={22} /></div>
          <div className="admin-card-label">Sections</div>
          <div className="admin-card-count">{sections.length}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-icon"><Layers size={22} /></div>
          <div className="admin-card-label">Published</div>
          <div className="admin-card-count">{published}</div>
        </div>
        <a
          className="admin-card"
          href={`/?preview=${activePortfolio.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="admin-card-icon"><ExternalLink size={22} /></div>
          <div className="admin-card-label">Public URL</div>
          <div className="admin-card-count">/{activePortfolio.slug}</div>
        </a>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <div className="admin-section-list">
          <h2 className="admin-form-section">Sections</h2>
          {sections.length === 0 && (
            <div className="admin-empty-state">
              <p>No sections yet. Create one to start publishing content.</p>
            </div>
          )}
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
        </div>
      )}
    </div>
  );
}