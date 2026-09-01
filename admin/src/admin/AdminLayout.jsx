import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getPublicPortfolioUrl } from '../api/client';
import {
  LayoutDashboard,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  KeyRound,
  Zap,
  Image as ImageIcon,
  FileCode2,
  Play,
  Globe2,
} from 'lucide-react';

function initials(name) {
  return (name || 'A')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function AdminLayout() {
  const { user, portfolios, activePortfolio, selectPortfolio, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handlePortfolioChange = (e) => {
    selectPortfolio(e.target.value);
  };

  const livePortfolioUrl = getPublicPortfolioUrl(activePortfolio?.slug);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-brand">
          <span className="admin-brand-mark"><Zap size={17} /></span>
          <span className="admin-brand-text">Portfolio CMS</span>
        </div>

        {/* Portfolio Switcher */}
        {portfolios.length > 0 && (
          <div className="admin-portfolio-switcher">
            <label className="admin-portfolio-label" htmlFor="portfolio-select">
              Active Portfolio
            </label>
            <select
              id="portfolio-select"
              className="admin-select"
              value={activePortfolio?._id || ''}
              onChange={handlePortfolioChange}
            >
              {portfolios.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="admin-nav" style={{ flex: 1 }}>
          <div style={{ padding: '12px 14px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
            Overview
          </div>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>

          <div style={{ padding: '16px 14px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
            Content
          </div>
          <NavLink
            to="/admin/sections"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Layers size={17} />
            <span>Sections</span>
          </NavLink>
          <NavLink
            to="/admin/media"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <ImageIcon size={17} />
            <span>Media Library</span>
          </NavLink>

          <div style={{ padding: '16px 14px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
            Developer
          </div>
          <NavLink
            to="/admin/apikeys"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <KeyRound size={17} />
            <span>API Keys</span>
          </NavLink>
          <NavLink
            to="/admin/docs"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <FileCode2 size={17} />
            <span>API Docs</span>
          </NavLink>
          <NavLink
            to="/admin/playground"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Play size={17} />
            <span>Playground</span>
          </NavLink>

          <div style={{ padding: '16px 14px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
            Configuration
          </div>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Settings size={17} />
            <span>Settings</span>
          </NavLink>

          {/* Quick Preview Button */}
          {activePortfolio?.slug && (
            <div style={{ padding: '16px 12px 0' }}>
              <a
                href={livePortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-secondary"
                style={{
                  width: '100%',
                  fontSize: 13,
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Globe2 size={14} color="#38bdf8" />
                <span>View Portfolio</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </nav>

        {/* Sidebar Footer / User Info */}
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-row">
              <span className="admin-avatar">{initials(user?.name)}</span>
              <div style={{ overflow: 'hidden' }}>
                <div className="admin-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Admin'}
                </div>
                <div className="admin-user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}