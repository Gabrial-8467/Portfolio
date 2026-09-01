import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Zap,
  Terminal,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Layers,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../admin/useAuth';
import ItemModal from '../../admin/components/ItemModal';
import { useToast } from '../../admin/components/useToast';

export default function Login() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealedKey, setRevealedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const finish = () => navigate(from, { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        finish();
      } else {
        const result = await register({ email, password, name, portfolioName });
        if (result?.apiKey) {
          setRevealedKey(result.apiKey);
        } else {
          finish();
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(revealedKey);
    } catch {
      const el = document.createElement('textarea');
      el.value = revealedKey;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    toast('API key copied to clipboard', 'success');
  };

  return (
    <div className="admin-login-page">
      {/* Left Feature Showcase Banner */}
      <div className="admin-login-banner">
        <div className="login-banner-glow" />

        <div className="login-banner-top">
          <div className="login-brand-pill">
            <div className="login-brand-icon">
              <Zap size={18} />
            </div>
            <div>
              <div className="login-brand-name">Portfolio CMS</div>
              <div className="login-brand-sub">Developer Infrastructure</div>
            </div>
          </div>

          <h2 className="login-banner-heading">
            The headless content engine for modern developers.
          </h2>
          <p className="login-banner-desc">
            Manage your sections, media assets, API keys, and portfolio state with instant low-latency REST API delivery.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <div className="login-feature-icon" style={{ color: '#38bdf8' }}>
                <Terminal size={16} />
              </div>
              <div className="login-feature-text">
                <strong>Type-Safe REST Endpoints</strong>
                <span>Instant JSON payloads for React, Next.js &amp; Flutter</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon" style={{ color: '#fbbf24' }}>
                <Sparkles size={16} />
              </div>
              <div className="login-feature-text">
                <strong>Dynamic Section CMS</strong>
                <span>Visual structured editing + raw JSON schema mode</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon" style={{ color: '#34d399' }}>
                <ShieldCheck size={16} />
              </div>
              <div className="login-feature-text">
                <strong>Secure API Keys</strong>
                <span>SHA-256 encrypted authentication &amp; rotation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Code Preview Mockup */}
        <div className="login-terminal-window">
          <div className="login-terminal-bar">
            <span className="login-term-dot red" />
            <span className="login-term-dot yellow" />
            <span className="login-term-dot green" />
            <span className="login-term-title">api-live-request.sh</span>
          </div>
          <div className="login-terminal-content">
            <p className="term-line">
              <span className="term-prompt">$</span> curl -X GET https://api.portfolio.com/api/v1/portfolio \
            </p>
            <p className="term-line indent">
              -H <span className="term-str">&quot;Authorization: Bearer pk_live_••••••••&quot;</span>
            </p>
            <div className="term-status-badge">
              <span className="term-status-dot" />
              <span>HTTP 200 OK (14ms) · 8 Sections Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Pane */}
      <div className="admin-login-form-pane">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">
              {mode === 'login' ? 'Sign in to Dashboard' : 'Create Admin Workspace'}
            </h1>
            <p className="admin-login-subtitle">
              {mode === 'login'
                ? 'Welcome back! Enter your administrator credentials to access your CMS.'
                : 'Set up your multi-tenant developer workspace in seconds.'}
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div className="login-mode-tabs">
            <button
              type="button"
              className={`login-mode-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`login-mode-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {mode === 'register' && (
              <div className="login-field-group">
                <div className="login-field">
                  <label className="login-label" htmlFor="register-name">Full Name</label>
                  <div className="login-input-wrap">
                    <User size={16} className="login-input-icon" />
                    <input
                      id="register-name"
                      type="text"
                      className="login-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label" htmlFor="register-portfolio">Portfolio Name</label>
                  <div className="login-input-wrap">
                    <Layers size={16} className="login-input-icon" />
                    <input
                      id="register-portfolio"
                      type="text"
                      className="login-input"
                      value={portfolioName}
                      onChange={(e) => setPortfolioName(e.target.value)}
                      placeholder="My Portfolio"
                    />
                  </div>
                  <span className="login-hint">Defaults to your full name if left empty.</span>
                </div>
              </div>
            )}

            <div className="login-field-group">
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">Email Address</label>
                <div className="login-input-wrap">
                  <Mail size={16} className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <Lock size={16} className="login-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="login-error-alert" role="alert">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Workspace'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer-links">
            <Link to="/" className="login-back-link">
              <ArrowLeft size={14} />
              <span>Return to Portfolio Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Secret API Key Reveal Modal */}
      <ItemModal
        title="Your API Key is Ready"
        open={Boolean(revealedKey)}
        onClose={() => { setRevealedKey(null); finish(); }}
        onSubmit={finish}
        loading={false}
      >
        <div style={{ padding: '14px 16px', background: 'var(--admin-warning-light)', border: '1px solid var(--admin-warning-border)', borderRadius: 'var(--admin-radius-sm)', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-warning)', marginBottom: 4 }}>
            ⚠ Save this secret key now
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>
            This is the <strong>only time</strong> the full secret key will be revealed. You can regenerate or revoke it anytime in API Key settings.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <input
            type="text"
            readOnly
            value={revealedKey || ''}
            className="admin-input"
            style={{ fontFamily: 'var(--admin-mono)', fontSize: 13, background: '#f8fafc', fontWeight: 600 }}
          />
          <button type="button" className="admin-btn admin-btn-secondary" onClick={copyKey}>
            {copied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p className="admin-field-hint">
          Configure <code className="prefix-chip">VITE_API_KEY</code> in your frontend to fetch content directly.
        </p>
      </ItemModal>
    </div>
  );
}
