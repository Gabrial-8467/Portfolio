import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import {
  LayoutDashboard,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  KeyRound,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/sections', label: 'Sections', icon: Layers },
  { to: '/admin/apikeys', label: 'API Keys', icon: KeyRound },
  { to: '/admin/settings', label: 'Portfolio Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, portfolios, activePortfolio, selectPortfolio, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePortfolioChange = (e) => {
    selectPortfolio(e.target.value);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">Portfolio CMS</div>

        {portfolios.length > 0 && (
          <div className="admin-portfolio-switcher">
            <label className="admin-portfolio-label" htmlFor="portfolio-select">
              Portfolio
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
            {activePortfolio?.slug && (
              <a
                className="admin-portfolio-link"
                href={`/?preview=${activePortfolio.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={12} />
                /{activePortfolio.slug}
              </a>
            )}
          </div>
        )}

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-name">{user?.name || 'Admin'}</div>
            <div className="admin-user-email">{user?.email}</div>
          </div>
          <button type="button" onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}