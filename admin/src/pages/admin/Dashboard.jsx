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
  Terminal,
  KeyRound,
  Play,
  FileCode2,
  Copy,
  Check,
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
  const [copiedCurl, setCopiedCurl] = useState(false);

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
            <p>Let&apos;s set up your first portfolio workspace — it takes seconds.</p>
          </div>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleCreatePortfolio}
          disabled={creating}
        >
          <Plus size={16} />
          {creating ? 'Creating…' : 'Create Portfolio Workspace'}
        </button>
      </div>
    );
  }

  const published = sections.filter((s) => s.isPublished).length;
  const drafts = sections.length - published;
  const curlSnippet = `curl -X GET "http://localhost:5000/api/p/${activePortfolio.slug}"`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-hero">
        <div>
          <h1>Welcome back, {firstWord(user?.name)}</h1>
          <p>
            Managing <strong>{activePortfolio.name}</strong> (<code>/{activePortfolio.slug}</code>).
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

      {/* Metrics Cards Grid */}
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
          <div className="admin-card-label">Live Site</div>
          <div className="admin-card-count">
            /{activePortfolio.slug} <ArrowUpRight size={16} style={{ verticalAlign: '-2px', opacity: 0.7 }} />
          </div>
        </a>
      </div>

      {/* Developer Quick-Start cURL Card */}
      <div
        style={{
          background: '#0f172a',
          borderRadius: 'var(--admin-radius)',
          padding: '16px 20px',
          color: '#ffffff',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: 'var(--admin-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Terminal size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
              Quick Public REST Endpoint
            </div>
            <div style={{ fontFamily: 'var(--admin-mono)', fontSize: 13, color: '#f1f5f9' }}>
              {curlSnippet}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: '#334155' }}
            onClick={copyCurl}
          >
            {copiedCurl ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
          </button>
          <Link
            to="/admin/playground"
            className="admin-btn admin-btn-primary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            <Play size={13} />
            <span>Test in Playground</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <Link
          to="/admin/sections/new"
          style={{
            background: '#ffffff',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'all 0.15s',
            boxShadow: 'var(--admin-shadow-sm)',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--admin-blue-soft)', color: 'var(--admin-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>New Section</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Add projects, skills, bio</div>
          </div>
        </Link>

        <Link
          to="/admin/apikeys"
          style={{
            background: '#ffffff',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'all 0.15s',
            boxShadow: 'var(--admin-shadow-sm)',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>API Keys</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Generate & rotate tokens</div>
          </div>
        </Link>

        <Link
          to="/admin/docs"
          style={{
            background: '#ffffff',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'all 0.15s',
            boxShadow: 'var(--admin-shadow-sm)',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCode2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>Developer Docs</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>React, Next.js, Node snippets</div>
          </div>
        </Link>
      </div>

      {/* Sections Table View */}
      {loading ? (
        <div className="admin-loading">Loading sections…</div>
      ) : (
        <div className="admin-section-list">
          <div className="admin-toolbar">
            <h2 className="admin-form-section" style={{ margin: 0, border: 'none', padding: 0 }}>
              Configured Content Sections
            </h2>
            <span className="struct-intro">{sections.length} total · {published} published</span>
          </div>

          {sections.length === 0 ? (
            <div className="admin-empty-state">
              <p>No sections configured yet. Create your first section to start serving content.</p>
              <Link to="/admin/sections/new" className="admin-btn admin-btn-primary">
                <Plus size={15} /> Create a Section
              </Link>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Section Key</th>
                    <th>Display Label</th>
                    <th>Sort Order</th>
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
                          Edit Content
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}