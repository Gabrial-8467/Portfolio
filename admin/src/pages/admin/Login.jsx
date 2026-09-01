import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Copy, KeyRound, Zap } from 'lucide-react';
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
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark"><Zap size={17} /></span>
          <span className="admin-brand-text">Portfolio CMS</span>
        </div>
        <h1 className="admin-login-title">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {mode === 'register' && (
            <>
              <Field label="Your name">
                <TextInput value={name} onChange={setName} placeholder="Jane Doe" required autoComplete="name" />
              </Field>
              <Field label="Portfolio name" hint="Optional — defaults to your name.">
                <TextInput value={portfolioName} onChange={setPortfolioName} placeholder="My Portfolio" />
              </Field>
            </>
          )}
          <Field label="Email">
            <TextInput
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
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
          {error && <div className="admin-form-error">{error}</div>}
          <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="admin-login-switch">
          {mode === 'login' ? (
            <>
              New here?{' '}
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

        <Link to="/" className="admin-login-back">
          ← Back to portfolio
        </Link>
      </div>

      <ItemModal
        title="Your API key — save it now"
        open={Boolean(revealedKey)}
        onClose={() => { setRevealedKey(null); finish(); }}
        onSubmit={finish}
        loading={false}
      >
        <p className="admin-modal-message">
          <KeyRound size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
          Your portfolio and API key are ready. This is the <strong>only time</strong> the full key is shown — you can revoke it anytime from the API Keys page.
        </p>
        <div className="copy-row">
          <div className="key-mono key-reveal">{revealedKey}</div>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={copyKey}>
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="admin-field-hint">
          Add <code className="prefix-chip">VITE_API_KEY</code> to your site&apos;s build env so it can fetch live content from{' '}
          <code className="prefix-chip">/api/v1/portfolio</code>.
        </p>
      </ItemModal>
    </div>
  );
}