import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { useToast } from '../../admin/components/useToast';
import { api, getPublicPortfolioUrl, API_URL } from '../../api/client';
import {
  Layers,
  Plus,
  RefreshCw,
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
  Image as ImageIcon,
  Edit,
} from 'lucide-react';

function firstWord(name) {
  return (name || '').split(/\s+/)[0] || 'Developer';
}

export default function Dashboard() {
  const { user, activePortfolio, refreshPortfolios, selectPortfolio } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [apiKeysCount, setApiKeysCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const loadData = async () => {
    if (!activePortfolio) return;
    setLoading(true);
    try {
      const [secList, keysList] = await Promise.allSettled([
        api.sections.list(activePortfolio._id),
        api.apiKeys.list(),
      ]);

      const loadedSections = secList.status === 'fulfilled' ? secList.value : [];
      setSections(loadedSections || []);

      if (keysList.status === 'fulfilled' && Array.isArray(keysList.value)) {
        setApiKeysCount(keysList.value.length);
      }

      // Read cached media items count
      try {
        const cacheKey = `portfolio_media_cache_${activePortfolio._id}`;
        const saved = localStorage.getItem(cacheKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setMediaCount(parsed.length);
        }
      } catch {
        /* ignore */
      }
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSections([]);
    setLoading(true);
    loadData().catch(() => setLoading(false));
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
      /* ignore */
    } finally {
      setCreating(false);
    }
  };

  if (!activePortfolio) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Welcome, {firstWord(user?.name)}!</h1>
            <p className="admin-page-subtitle">Let&apos;s create your first portfolio workspace — it takes seconds.</p>
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
  const livePortfolioUrl = getPublicPortfolioUrl(activePortfolio.slug);
  const curlSnippet = `curl -X GET "${API_URL.replace(/\/+$/, '')}/api/p/${activePortfolio.slug}"`;

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlSnippet);
    } catch {
      const el = document.createElement('textarea');
      el.value = curlSnippet;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    setCopiedCurl(true);
    addToast('cURL command copied to clipboard', 'success');
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Good morning, {firstWord(user?.name)} 👋</h1>
          <p className="admin-page-subtitle">
            Managing content and API endpoints for <strong>{activePortfolio.name}</strong> (<code>/{activePortfolio.slug}</code>).
          </p>
        </div>
        <div className="admin-page-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={loadData} title="Refresh workspace data">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <a
            href={livePortfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="admin-btn admin-btn-primary"
          >
            <span>View Portfolio</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Real Metric Cards Grid */}
      <div className="admin-cards-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-label">Published Sections</span>
            <div className="admin-card-icon green"><FileCheck2 size={18} /></div>
          </div>
          <div className="admin-card-count">{published}</div>
          <div className="admin-card-meta">Live in public REST API</div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-label">Draft Sections</span>
            <div className="admin-card-icon violet"><FilePenLine size={18} /></div>
          </div>
          <div className="admin-card-count">{drafts}</div>
          <div className="admin-card-meta">Staged for preview</div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-label">Media Assets</span>
            <div className="admin-card-icon blue"><ImageIcon size={18} /></div>
          </div>
          <div className="admin-card-count">{mediaCount}</div>
          <div className="admin-card-meta">Hosted images & assets</div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-label">Active API Keys</span>
            <div className="admin-card-icon amber"><KeyRound size={18} /></div>
          </div>
          <div className="admin-card-count">{apiKeysCount}</div>
          <div className="admin-card-meta">Developer credentials</div>
        </div>
      </div>

      {/* Developer Quick-Start cURL Card */}
      <div
        style={{
          background: '#0f172a',
          borderRadius: 'var(--admin-radius)',
          padding: '18px 22px',
          color: '#ffffff',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: 'var(--admin-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Terminal size={18} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em' }}>
              Public Content Endpoint
            </div>
            <div style={{ fontFamily: 'var(--admin-mono)', fontSize: 13, color: '#f8fafc', marginTop: 2 }}>
              {curlSnippet}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className={`admin-btn admin-btn-dark ${copiedCurl ? 'copied' : ''}`}
            style={{ fontSize: 12, padding: '6px 12px' }}
            onClick={copyCurl}
            title="Copy cURL command to clipboard"
          >
            {copiedCurl ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
            <span>{copiedCurl ? 'Copied!' : 'Copy cURL'}</span>
          </button>
          <Link
            to="/admin/playground"
            className="admin-btn admin-btn-primary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            <Play size={13} />
            <span>Open Playground</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        <Link
          to="/admin/sections/new"
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'var(--admin-transition)',
            boxShadow: 'var(--admin-shadow-xs)',
            textDecoration: 'none',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--admin-primary-light)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>New Section</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Add projects, bio, skills</div>
          </div>
        </Link>

        <Link
          to="/admin/media"
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'var(--admin-transition)',
            boxShadow: 'var(--admin-shadow-xs)',
            textDecoration: 'none',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--admin-success-light)', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>Upload Media</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Images, banners & avatars</div>
          </div>
        </Link>

        <Link
          to="/admin/apikeys"
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'var(--admin-transition)',
            boxShadow: 'var(--admin-shadow-xs)',
            textDecoration: 'none',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--admin-warning-light)', color: 'var(--admin-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>API Keys</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Manage access tokens</div>
          </div>
        </Link>

        <Link
          to="/admin/docs"
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'var(--admin-transition)',
            boxShadow: 'var(--admin-shadow-xs)',
            textDecoration: 'none',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCode2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)' }}>Developer Docs</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>React, Next.js, Node guide</div>
          </div>
        </Link>
      </div>

      {/* Sections Table View */}
      {loading ? (
        <div className="admin-loading">Loading portfolio content…</div>
      ) : (
        <div>
          <div className="admin-toolbar">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
              Configured Content Sections ({sections.length})
            </h2>
            <Link to="/admin/sections/new" className="admin-btn admin-btn-primary admin-btn-sm">
              <Plus size={14} />
              <span>Add Section</span>
            </Link>
          </div>

          {sections.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon"><Layers size={24} /></div>
              <div className="admin-empty-title">No content sections configured</div>
              <div className="admin-empty-desc">Create your first section to start serving structured content to your portfolio.</div>
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
                      <td>
                        <span style={{ fontFamily: 'var(--admin-mono)', fontWeight: 600, color: 'var(--admin-text)' }}>
                          {section.key}
                        </span>
                      </td>
                      <td>{section.label || '—'}</td>
                      <td>{section.order}</td>
                      <td>
                        {section.isPublished ? (
                          <span className="admin-badge admin-badge-green">
                            <SquareCheckBig size={11} />
                            Published
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge-red">Draft</span>
                        )}
                      </td>
                      <td className="admin-table-actions">
                        <Link to={`/admin/sections/${section._id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                          <Edit size={12} />
                          <span>Edit</span>
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
