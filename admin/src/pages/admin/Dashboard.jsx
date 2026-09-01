import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api, getPublicPortfolioUrl } from '../../api/client';
import {
  Layers,
  Plus,
  RefreshCw,
  Globe,
  FileCheck2,
  FilePenLine,
  SquareCheckBig,
  ArrowUpRight,
} from 'lucide-react';

function firstWord(name) {
  return (name || '').split(/\s+/)[0] || 'there';
}

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
        <div className="admin-hero">
          <div>
            <h1>Welcome, {firstWord(user?.name)}!</h1>
            <p>Let&apos;s set up your first portfolio — it takes seconds.</p>
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
  const drafts = sections.length - published;

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <h1>Welcome back, {firstWord(user?.name)}</h1>
          <p>
            Editing <strong>{activePortfolio.name}</strong> — push content to your portfolio from here.
          </p>
        </div>
        <div className="admin-hero-actions">
          <button type="button" className="admin-btn admin-btn-hero" onClick={loadSections}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link to="/admin/sections/new" className="admin-btn admin-btn-hero-solid">
            <Plus size={16} />
            New Section
          </Link>
        </div>
      </div>

      <div className="admin-cards-grid">
        <div className="admin-card admin-card-accent blue">
          <div className="admin-card-icon blue"><Layers size={22} /></div>
          <div className="admin-card-label">Total sections</div>
          <div className="admin-card-count">{sections.length}</div>
        </div>
        <div className="admin-card admin-card-accent green">
          <div className="admin-card-icon green"><FileCheck2 size={22} /></div>
          <div className="admin-card-label">Published</div>
          <div className="admin-card-count">{published}</div>
        </div>
        <div className="admin-card admin-card-accent violet">
          <div className="admin-card-icon violet"><FilePenLine size={22} /></div>
          <div className="admin-card-label">Drafts</div>
          <div className="admin-card-count">{drafts}</div>
        </div>
        <a
          className="admin-card admin-card-accent amber"
          href={getPublicPortfolioUrl(activePortfolio.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="admin-card-icon amber"><Globe size={22} /></div>
          <div className="admin-card-label">Public URL</div>
          <div className="admin-card-count">
            /{activePortfolio.slug} <ArrowUpRight size={16} style={{ verticalAlign: '-2px', opacity: 0.7 }} />
          </div>
        </a>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <div className="admin-section-list">
          <div className="admin-toolbar">
            <h2 className="admin-form-section" style={{ margin: 0, border: 'none', padding: 0 }}>
              Your sections
            </h2>
            <span className="struct-intro">{sections.length} total · {published} live</span>
          </div>
          {sections.length === 0 && (
            <div className="admin-empty-state">
              <p>No sections yet. Create one to start publishing content.</p>
              <Link to="/admin/sections/new" className="admin-btn admin-btn-primary">
                <Plus size={15} /> Create a section
              </Link>
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
                        <span className="admin-badge admin-badge-green">
                          <SquareCheckBig size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                          Published
                        </span>
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