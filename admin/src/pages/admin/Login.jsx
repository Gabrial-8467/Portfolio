import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Copy, KeyRound, Zap, Terminal, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../admin/useAuth';
import Field, { TextInput } from '../../admin/components/Field';
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
    toast('API key copied', 'success');
  };

  return (
    <div className="admin-login-page">
      {/* Left Brand Feature Banner */}
      <div className="admin-login-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#4f46e5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Portfolio CMS
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Developer Platform</div>
            </div>
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 850, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16, maxWidth: 440 }}>
            The Headless Content Engine for Modern Developers.
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, maxWidth: 420, marginBottom: 36 }}>
            Manage your projects, experience, media assets, and credentials in one dashboard, delivered instantly to any frontend via high-speed REST APIs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#e2e8f0' }}>
              <Terminal size={16} color="#38bdf8" />
              <span>Type-safe REST API & JSON content delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#e2e8f0' }}>
              <KeyRound size={16} color="#fbbf24" />
              <span>One-click API key generation with SHA-256</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#e2e8f0' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span>Multi-tenant portfolio workspaces</span>
            </div>
          </div>
        </div>

        {/* Mini Terminal Preview */}
        <div style={{ background: '#030712', borderRadius: 8, padding: '14px 18px', border: '1px solid #1e293b', fontFamily: 'var(--admin-mono)', fontSize: 12, color: '#f8fafc', maxWidth: 420 }}>
          <div style={{ color: '#38bdf8', marginBottom: 4 }}>$ curl https://api.portfolio.com/api/v1/portfolio</div>
          <div style={{ color: '#94a3b8' }}>&gt; 200 OK (14ms) · 8 sections delivered</div>
        </div>
      </div>

      {/* Right Login Form Pane */}
      <div className="admin-login-form-pane">
        <div className="admin-login-card">
          <h1 className="admin-login-title">{mode === 'login' ? 'Sign in to Dashboard' : 'Create an Account'}</h1>
          <p className="admin-login-subtitle">
            {mode === 'login' ? 'Enter your administrator credentials to access your CMS.' : 'Set up your developer workspace in seconds.'}
          </p>

          <form onSubmit={handleSubmit} className="admin-form" style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent' }}>
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
                <Field label="Your Name">
                  <TextInput value={name} onChange={setName} placeholder="Jane Doe" required autoComplete="name" />
                </Field>
                <Field label="Portfolio Workspace Name" hint="Defaults to your name if left empty.">
                  <TextInput value={portfolioName} onChange={setPortfolioName} placeholder="My Portfolio" />
                </Field>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              <Field label="Email Address">
                <TextInput
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  className="admin-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </Field>
            </div>

            {error && <div className="admin-form-error">{error}</div>}

            <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading} style={{ padding: '10px 14px' }}>
              {loading ? 'Authenticating…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--admin-text-muted)' }}>
            {mode === 'login' ? (
              <>
                Need a new workspace?{' '}
                <button type="button" className="admin-link-btn" onClick={() => { setMode('register'); setError(''); }}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" className="admin-link-btn" onClick={() => { setMode('login'); setError(''); }}>
                  Sign in
                </button>
              </>
            )}
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 12, color: 'var(--admin-text-muted)', textDecoration: 'none' }}>
              ← Return to Portfolio Website
            </Link>
          </div>
        </div>
      </div>

      {/* Secret Key Modal */}
      <ItemModal
        title="Your API Key is Ready"
        open={Boolean(revealedKey)}
        onClose={() => { setRevealedKey(null); finish(); }}
        onSubmit={finish}
        loading={false}
      >
        <div style={{ padding: '12px 14px', background: 'var(--admin-warning-light)', border: '1px solid var(--admin-warning-border)', borderRadius: 'var(--admin-radius-sm)', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-warning)', marginBottom: 2 }}>
            ⚠ Save this secret key now
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
            This is the <strong>only time</strong> the full key will be shown. You can revoke it anytime in API Key settings.
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
