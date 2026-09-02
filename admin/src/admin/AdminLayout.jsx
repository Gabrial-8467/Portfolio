import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getPublicPortfolioUrl } from '../api/client';
import {
  LayoutDashboard,
  Layers,
  Settings,
  LogOut,
  ArrowUpRight,
  KeyRound,
  Zap,
  Image as ImageIcon,
  ChevronDown,
  Menu,
  X,
  Plus,
} from 'lucide-react';

function initials(name) {
  return (name || 'Admin')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function AdminLayout() {
  const { user, portfolios, activePortfolio, selectPortfolio, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const livePortfolioUrl = getPublicPortfolioUrl(activePortfolio?.slug);

  // Compute breadcrumb info from current pathname
  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p === '/admin' || p === '/admin/') return { category: 'Main', page: 'Dashboard' };
    if (p.startsWith('/admin/sections/new')) return { category: 'Content', page: 'New Section' };
    if (p.startsWith('/admin/sections/')) return { category: 'Content', page: 'Edit Section' };
    if (p.startsWith('/admin/sections')) return { category: 'Content', page: 'Sections' };
    if (p.startsWith('/admin/media')) return { category: 'Content', page: 'Media Library' };
    if (p.startsWith('/admin/apikeys')) return { category: 'Developer', page: 'API Keys' };
    if (p.startsWith('/admin/docs')) return { category: 'Developer', page: 'API Documentation' };
    if (p.startsWith('/admin/playground')) return { category: 'Developer', page: 'API Playground' };
    if (p.startsWith('/admin/settings')) return { category: 'System', page: 'Settings' };
    return { category: 'Dashboard', page: 'Overview' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="admin-modal-overlay"
          style={{ zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-brand">
          <div className="admin-brand-mark">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <div className="admin-brand-info">
            <div className="admin-brand-title">Portfolio CMS</div>
            <div className="admin-brand-badge">Developer Platform</div>
          </div>
          {mobileOpen && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-icon-only"
              style={{ marginLeft: 'auto' }}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="admin-nav">
          <div className="admin-nav-group-title">Main</div>
          <NavLink
            to="/admin"
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/admin/sections"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Sections</span>
          </NavLink>
          <NavLink
            to="/admin/media"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <ImageIcon size={16} />
            <span>Media Assets</span>
          </NavLink>

          <div className="admin-nav-group-title">Developer & Settings</div>
          <NavLink
            to="/admin/apikeys"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <KeyRound size={16} />
            <span>API Keys</span>
          </NavLink>
          <NavLink
            to="/admin/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer User Area */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">{initials(user?.name)}</div>
            <div className="admin-user-details">
              <div className="admin-user-name">{user?.name || 'Developer'}</div>
              <div className="admin-user-email">{user?.email || 'admin@portfolio.local'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main App Content Shell */}
      <div className="admin-content-shell">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-icon-only"
              style={{ display: 'none' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="admin-breadcrumb">
              <span>{breadcrumb.category}</span>
              <span>/</span>
              <span className="admin-breadcrumb-item active">{breadcrumb.page}</span>
            </div>
          </div>

          <div className="admin-topbar-actions">
            {/* Live API Status Pill */}
            <div className="admin-live-badge" title="REST API Online">
              <span className="admin-live-dot" />
              <span>API Online</span>
            </div>

            {/* Portfolio Selector Pill */}
            {portfolios && portfolios.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="admin-portfolio-pill"
                  onClick={() => setSwitcherOpen(!switcherOpen)}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} />
                  <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activePortfolio?.name || 'Select Portfolio'}
                  </span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {switcherOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: 220,
                      background: '#ffffff',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 'var(--admin-radius-sm)',
                      boxShadow: 'var(--admin-shadow-lg)',
                      padding: 6,
                      zIndex: 50,
                    }}
                  >
                    <div style={{ padding: '6px 8px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-subtle)' }}>
                      Switch Portfolio
                    </div>
                    {portfolios.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => {
                          selectPortfolio(p._id);
                          setSwitcherOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '7px 10px',
                          borderRadius: 4,
                          fontSize: 13,
                          fontWeight: p._id === activePortfolio?._id ? 600 : 500,
                          background: p._id === activePortfolio?._id ? 'var(--admin-primary-light)' : 'transparent',
                          color: p._id === activePortfolio?._id ? 'var(--admin-primary)' : 'var(--admin-text)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </span>
                        {p._id === activePortfolio?._id && <span style={{ fontSize: 11 }}>✓</span>}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--admin-border-subtle)', marginTop: 4, paddingTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSwitcherOpen(false);
                          navigate('/admin/settings');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '6px 10px',
                          borderRadius: 4,
                          fontSize: 12,
                          color: 'var(--admin-primary)',
                          fontWeight: 600,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Plus size={13} />
                        <span>Manage Workspaces</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Preview Button */}
            {activePortfolio?.slug && (
              <a
                href={livePortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                title={`Open /${activePortfolio.slug} in new tab`}
              >
                <span>Live Preview</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </header>

        {/* Main Viewport */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
