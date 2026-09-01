import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import Field, { TextInput } from '../../admin/components/Field';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, name, portfolioName });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">Portfolio CMS</div>
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
    </div>
  );
}