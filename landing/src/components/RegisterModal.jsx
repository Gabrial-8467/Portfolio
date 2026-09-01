import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { api, ADMIN_URL } from '../api/client';

export default function RegisterModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealedKey, setRevealedKey] = useState(null);
  const [createdPortfolio, setCreatedPortfolio] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.register({
        name,
        email,
        password,
        portfolioName: portfolioName || `${name}'s Portfolio`,
      });

      setRevealedKey(res.apiKey);
      setCreatedPortfolio(res.portfolio);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (!revealedKey) return;
    navigator.clipboard.writeText(revealedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'var(--saas-primary-light)',
                color: 'var(--saas-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} />
            </div>
            <h3 className="modal-title">
              {revealedKey ? 'Portfolio & API Key Ready' : 'Start Building with Portfolio CMS'}
            </h3>
          </div>
          <button type="button" onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {revealedKey ? (
            <div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '12px 0 20px',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <CheckCircle2 size={26} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--saas-text)' }}>Account Created Successfully!</h4>
                <p style={{ fontSize: 13, color: 'var(--saas-text-secondary)', marginTop: 4 }}>
                  Your portfolio workspace <strong>{createdPortfolio?.name}</strong> has been initialized.
                </p>
              </div>

              {/* One-time Key Warning Banner */}
              <div className="alert-security">
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Important Security Notice:</strong> Save your API key now. For your security, this full key will <u>never be shown again</u>.
                  </div>
                </div>
              </div>

              {/* Key Display & Copy */}
              <div className="form-group">
                <label className="form-label">Your Initial API Key</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value={revealedKey}
                    className="form-input"
                    style={{ fontFamily: 'var(--saas-mono)', background: '#f8fafc', fontSize: 13 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={copyKey}
                    style={{ flexShrink: 0 }}
                  >
                    {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <a
                  href={`${ADMIN_URL}/admin/login`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  Launch Admin Dashboard <ExternalLink size={15} />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="alert-danger">{error}</div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Developer"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Alex — Full Stack Engineer"
                  className="form-input"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 8 }}
                disabled={loading}
              >
                {loading ? 'Creating Account & Generating Key...' : 'Create Account & Get API Key'}
                {!loading && <ArrowRight size={16} />}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--saas-text-muted)' }}>
                Already have an account?{' '}
                <a
                  href={`${ADMIN_URL}/admin/login`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--saas-primary)', fontWeight: 600 }}
                >
                  Sign in here
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
