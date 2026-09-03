import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api, getPublicPortfolioUrl } from '../../api/client';
import { useToast } from '../../admin/components/useToast';
import JsonEditor from '../../admin/components/JsonEditor';
import Field, { TextInput } from '../../admin/components/Field';
import {
  Save,
  ArrowUpRight,
  Trash2,
  AlertTriangle,
  User,
  KeyRound,
  Lock,
  Gauge,
  Layers,
  Sparkles,
  Sliders,
  Shield,
  CreditCard,
  Check,
  CheckCircle2,
  Copy,
  Code2,
  ExternalLink,
  Palette,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { ConfirmDialog } from '../../admin/components/ConfirmDialog';
import AdminLoader from '../../admin/components/AdminLoader';

const THEME_PRESETS = [
  {
    name: 'Midnight Noir (Default)',
    color: '#090d16',
    accent: '#1e293b',
    settings: { theme: 'noir', accentColor: '#090d16', radius: '12px' },
  },
  {
    name: 'Modern Indigo',
    color: '#4f46e5',
    accent: '#6366f1',
    settings: { theme: 'indigo', accentColor: '#4f46e5', radius: '10px' },
  },
  {
    name: 'Cyber Emerald',
    color: '#10b981',
    accent: '#059669',
    settings: { theme: 'emerald', accentColor: '#10b981', radius: '8px' },
  },
  {
    name: 'Vibrant Violet',
    color: '#8b5cf6',
    accent: '#7c3aed',
    settings: { theme: 'violet', accentColor: '#8b5cf6', radius: '12px' },
  },
  {
    name: 'Ocean Cyan',
    color: '#0ea5e9',
    accent: '#0284c7',
    settings: { theme: 'cyan', accentColor: '#0ea5e9', radius: '8px' },
  },
  {
    name: 'Sunset Rose',
    color: '#f43f5e',
    accent: '#e11d48',
    settings: { theme: 'rose', accentColor: '#f43f5e', radius: '10px' },
  },
];

export default function Settings() {
  const { user, activePortfolio, refreshPortfolios, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active Tab: 'general' | 'billing' | 'security' | 'danger'
  const [activeTab, setActiveTab] = useState('general');

  const [name, setName] = useState('');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Plan usage state
  const [planStatus, setPlanStatus] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Delete account state
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteAccountPwd, setDeleteAccountPwd] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState('');

  const activePortfolioId = activePortfolio?._id;
  const activePortfolioName = activePortfolio?.name;

  useEffect(() => {
    let cancelled = false;
    api.auth
      .plan()
      .then((data) => {
        if (!cancelled) setPlanStatus(data || null);
      })
      .catch(() => {
        if (!cancelled) setPlanStatus(null);
      })
      .finally(() => {
        if (!cancelled) setPlanLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  useEffect(() => {
    let cancelled = false;
    if (!activePortfolioId) {
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setName(activePortfolioName || '');
    async function load() {
      try {
        const data = await api.portfolios.getSettings();
        if (!cancelled) setSettings(data || {});
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load settings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activePortfolioId, activePortfolioName]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!activePortfolio) return;
    setSaving(true);
    setError('');
    try {
      await api.portfolios.updateSettings(settings);
      await api.portfolios.update({ name });
      await refreshPortfolios();
      addToast('Portfolio settings saved successfully', 'success');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const applyThemePreset = (preset) => {
    setSettings((prev) => ({
      ...prev,
      ...preset.settings,
    }));
    addToast(`Applied preset "${preset.name}". Click "Save Changes" to apply.`, 'info');
  };

  const handleDeletePortfolio = () => {
    addToast(
      'Portfolio workspace deletion is not available via API key. Manage portfolios at the admin console.',
      'info'
    );
    setDeleteConfirmOpen(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirmation do not match');
      return;
    }
    setPwdSaving(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      addToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.message || 'Failed to update password');
    } finally {
      setPwdSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountError('');
    if (!deleteAccountPwd) {
      setDeleteAccountError('Please enter your password to confirm deletion');
      return;
    }
    try {
      await api.auth.deleteAccount(deleteAccountPwd);
      logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      setDeleteAccountError(err.message || 'Failed to delete account');
    }
  };

  const handleCopyUrl = async () => {
    const url = getPublicPortfolioUrl(activePortfolio.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
      addToast('Live portfolio URL copied to clipboard', 'success');
    } catch {
      addToast('Could not copy URL', 'error');
    }
  };

  const handleRazorpayUpgrade = async (planId, planTitle) => {
    setCheckoutLoading(true);
    try {
      const orderRes = await api.billing.createOrder(planId);
      const orderData = orderRes?.data || orderRes;

      const loadRazorpayScript = () =>
        new Promise((resolve) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        addToast('Could not load Razorpay SDK', 'error');
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: `Portfolio CMS ${planTitle}`,
        description: `${planTitle} Plan Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            await api.billing.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            });
            addToast(`Successfully upgraded to ${planTitle}!`, 'success');
            window.location.reload();
          } catch (vErr) {
            addToast(vErr.message || 'Payment verification failed', 'error');
          }
        },
      });
      rzp.open();
    } catch (err) {
      addToast(err.message || 'Failed to initiate Razorpay checkout', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const usageRow = (label, used, max, icon) => {
    const isUnlimited = max === 'Unlimited' || max === undefined || max === null;
    const numMax = typeof max === 'number' ? max : 1;
    const pct = isUnlimited ? 0 : Math.min(100, Math.round(((used || 0) / numMax) * 100));

    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--admin-text)' }}>
            {icon}
            <span>{label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-muted)' }}>
            {used} / {isUnlimited ? 'Unlimited' : max}
          </span>
        </div>
        <div style={{ height: 7, background: 'var(--admin-border)', borderRadius: 9999, overflow: 'hidden' }}>
          {!isUnlimited && (
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: pct >= 90 ? 'var(--admin-danger)' : pct >= 70 ? 'var(--admin-warning)' : 'var(--admin-primary)',
                borderRadius: 9999,
                transition: 'width 0.3s ease',
              }}
            />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <AdminLoader message="Loading workspace settings…" subtext="Fetching portfolio configurations" />;
  }

  if (!activePortfolio) {
    return <AdminLoader message="No portfolio selected" subtext="Please select or create a workspace first" />;
  }

  const liveUrl = getPublicPortfolioUrl(activePortfolio.slug);

  return (
    <div className="admin-page">
      {checkoutLoading && (
        <AdminLoader
          fullscreen
          message="Opening secure checkout…"
          subtext="Please wait while we connect to the Razorpay payment gateway."
        />
      )}

      {/* Header Section */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Workspace Settings</h1>
          <p className="admin-page-subtitle">
            Manage portfolio details, themes, API configurations, subscription, and security credentials.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleCopyUrl}
            title="Copy live site URL"
          >
            {copiedSlug ? <Check size={14} color="var(--admin-success)" /> : <Copy size={14} />}
            <span>{copiedSlug ? 'Copied' : 'Copy Site URL'}</span>
          </button>
          <a
            className="admin-btn admin-btn-primary"
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {error && <div className="admin-form-error">{error}</div>}

      {/* Navigation Tabs */}
      <div className="settings-nav-tabs">
        <button
          type="button"
          className={`settings-nav-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Sliders size={15} />
          <span>General &amp; Theme</span>
        </button>
        <button
          type="button"
          className={`settings-nav-tab ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCard size={15} />
          <span>Plan &amp; Billing</span>
          <span
            className={`admin-badge ${
              user?.plan === 'agency'
                ? 'admin-badge-purple'
                : user?.plan === 'pro'
                ? 'admin-badge-blue'
                : 'admin-badge-green'
            }`}
            style={{ fontSize: 10, padding: '1px 6px' }}
          >
            {user?.plan || 'Hobby'}
          </span>
        </button>
        <button
          type="button"
          className={`settings-nav-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={15} />
          <span>Security &amp; Password</span>
        </button>
        <button
          type="button"
          className={`settings-nav-tab ${activeTab === 'danger' ? 'active' : ''}`}
          onClick={() => setActiveTab('danger')}
        >
          <AlertTriangle size={15} />
          <span>Danger Zone</span>
        </button>
      </div>

      {/* TAB 1: General & Theme */}
      {activeTab === 'general' && (
        <form onSubmit={submit}>
          {/* Live Theme Mockup Preview */}
          <div className="theme-studio-preview-card">
            <div className="theme-studio-preview-header">
              <div className="theme-studio-preview-dots">
                <span className="theme-studio-dot" style={{ background: '#ef4444' }} />
                <span className="theme-studio-dot" style={{ background: '#f59e0b' }} />
                <span className="theme-studio-dot" style={{ background: '#10b981' }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--admin-text-muted)' }}>
                  Interactive Live Theme Preview
                </span>
              </div>
              <span className="admin-badge admin-badge-blue" style={{ fontSize: 11, padding: '2px 8px' }}>
                {settings?.theme ? settings.theme.toUpperCase() : 'MODERN'}
              </span>
            </div>

            <div
              className="theme-studio-preview-canvas"
              style={{
                '--canvas-accent': settings?.accentColor || '#4f46e5',
                background: settings?.darkMode === false ? '#ffffff' : 'var(--admin-surface)',
              }}
            >
              <div
                className="theme-studio-avatar-mock"
                style={{
                  background: `linear-gradient(135deg, ${settings?.accentColor || '#4f46e5'} 0%, #1e1b4b 100%)`,
                }}
              >
                {(name || 'G')[0]}
              </div>
              <h3 className="theme-studio-name-mock">{name || 'Your Portfolio Name'}</h3>
              <div
                className="theme-studio-badge-mock"
                style={{
                  background: `${settings?.accentColor || '#4f46e5'}18`,
                  color: settings?.accentColor || '#4f46e5',
                  border: `1px solid ${settings?.accentColor || '#4f46e5'}33`,
                  borderRadius: settings?.radius || '10px',
                }}
              >
                <Sparkles size={12} />
                <span>Full Stack Developer &amp; Engineer</span>
              </div>
              <div className="theme-studio-buttons-row">
                <button
                  type="button"
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    background: settings?.accentColor || '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: settings?.radius || '10px',
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px 0 ${settings?.accentColor || '#4f46e5'}40`,
                  }}
                >
                  View Projects
                </button>
                <button
                  type="button"
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    background: 'transparent',
                    color: 'var(--admin-text)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: settings?.radius || '10px',
                    cursor: 'pointer',
                  }}
                >
                  Contact Me
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Identity Card */}
          <div className="admin-form" style={{ marginBottom: 24 }}>
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: 'var(--admin-primary-light)', color: 'var(--admin-primary)' }}
                >
                  <Layers size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Portfolio Identity</h2>
                  <p className="settings-card-subtitle">
                    Configure your workspace public identifier, display title, and live endpoint.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-form-grid">
              <Field label="Portfolio Name" hint="The display name of your portfolio shown in headers and SEO titles.">
                <TextInput
                  value={name}
                  onChange={setName}
                  placeholder="e.g. Gabriel Deora — Portfolio"
                  required
                />
              </Field>

              <Field
                label="Portfolio Public Slug"
                hint="Permanent slug used in routes, API queries, and webhooks."
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextInput value={activePortfolio.slug} onChange={() => {}} disabled />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={handleCopyUrl}
                    title="Copy full URL"
                    style={{ flexShrink: 0 }}
                  >
                    {copiedSlug ? <Check size={14} color="var(--admin-success)" /> : <Copy size={14} />}
                  </button>
                </div>
              </Field>
            </div>
          </div>

          {/* Quick Theme Presets */}
          <div className="admin-form" style={{ marginBottom: 24 }}>
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: '#fdf2f8', color: '#db2777' }}
                >
                  <Palette size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Theme Presets &amp; Color Palettes</h2>
                  <p className="settings-card-subtitle">
                    Select a curated color palette preset with tailored gradients and radius rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="theme-presets-grid">
              {THEME_PRESETS.map((preset) => {
                const isCurrentPreset =
                  settings?.accentColor === preset.color ||
                  settings?.theme === preset.settings.theme;

                return (
                  <div
                    key={preset.name}
                    className={`theme-preset-card ${isCurrentPreset ? 'active' : ''}`}
                    onClick={() => applyThemePreset(preset)}
                    style={{
                      borderColor: isCurrentPreset ? preset.color : 'var(--admin-border)',
                      boxShadow: isCurrentPreset ? `0 4px 14px -2px ${preset.color}30` : 'none',
                    }}
                  >
                    <div className="theme-preset-color-strip">
                      <span style={{ flex: 2, background: preset.color }} />
                      <span style={{ flex: 1, background: preset.accent }} />
                    </div>
                    <div className="theme-preset-info">
                      <div>
                        <div className="theme-preset-name">{preset.name}</div>
                        <div className="theme-preset-badge">Radius: {preset.settings.radius}</div>
                      </div>
                      {isCurrentPreset ? (
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: preset.color,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: `2px solid ${preset.color}`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Customization & Typography Controls */}
          <div className="admin-form" style={{ marginBottom: 24 }}>
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: 'var(--admin-surface-subtle)', color: 'var(--admin-text)' }}
                >
                  <Sliders size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Design Controls &amp; Styling</h2>
                  <p className="settings-card-subtitle">
                    Customize primary accent colors, component curvature, and typography.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-form-grid" style={{ marginBottom: 20 }}>
              <Field label="Custom Accent Color" hint="Primary theme color used across buttons, links, and hero accents.">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="color"
                    value={settings?.accentColor || '#4f46e5'}
                    onChange={(e) => setSettings((prev) => ({ ...prev, accentColor: e.target.value }))}
                    style={{
                      width: 38,
                      height: 38,
                      padding: 2,
                      borderRadius: 'var(--admin-radius-sm)',
                      border: '1px solid var(--admin-border)',
                      cursor: 'pointer',
                      background: 'none',
                    }}
                  />
                  <TextInput
                    value={settings?.accentColor || '#4f46e5'}
                    onChange={(val) => setSettings((prev) => ({ ...prev, accentColor: val }))}
                    placeholder="#4f46e5"
                  />
                </div>
              </Field>

              <Field label="Corner Curvature (Border Radius)" hint="Radius applied to cards, buttons, and badges.">
                <select
                  className="admin-input"
                  value={settings?.radius || '10px'}
                  onChange={(e) => setSettings((prev) => ({ ...prev, radius: e.target.value }))}
                >
                  <option value="4px">Sharp (4px)</option>
                  <option value="8px">Subtle (8px)</option>
                  <option value="10px">Modern (10px)</option>
                  <option value="14px">Rounded (14px)</option>
                  <option value="20px">Pill / Soft (20px)</option>
                </select>
              </Field>

              <Field label="Typography Font Family" hint="Font style applied to headers and body content.">
                <select
                  className="admin-input"
                  value={settings?.fontFamily || 'Inter, sans-serif'}
                  onChange={(e) => setSettings((prev) => ({ ...prev, fontFamily: e.target.value }))}
                >
                  <option value="Inter, sans-serif">Inter (Modern &amp; Clean)</option>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Tech / SaaS)</option>
                  <option value="'Outfit', sans-serif">Outfit (Bold &amp; Expressive)</option>
                  <option value="'Space Grotesk', sans-serif">Space Grotesk (Engineering / Code)</option>
                  <option value="'Playfair Display', serif">Playfair Display (Editorial / Elegant)</option>
                </select>
              </Field>

              <Field label="Portfolio Site Subtitle" hint="Meta tagline delivered in portfolio API response.">
                <TextInput
                  value={settings?.siteSubtitle || ''}
                  onChange={(val) => setSettings((prev) => ({ ...prev, siteSubtitle: val }))}
                  placeholder="e.g. Full Stack Web Developer &amp; Engineer"
                />
              </Field>
            </div>
          </div>

          {/* Advanced JSON Parameters */}
          <div className="admin-form">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: 'var(--admin-surface-subtle)', color: 'var(--admin-text)' }}
                >
                  <Code2 size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Advanced Settings &amp; JSON Editor</h2>
                  <p className="settings-card-subtitle">
                    Direct access to raw <code>portfolio.settings</code> object for developer parameters and tokens.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ minHeight: 220, marginBottom: 16 }}>
              <JsonEditor value={settings} onChange={setSettings} />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                <Save size={15} />
                <span>{saving ? 'Saving changes…' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Plan & Billing */}
      {activeTab === 'billing' && (
        <div>
          {/* Account Profile Box */}
          <div className="admin-form" style={{ marginBottom: 24 }}>
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: 'var(--admin-primary-light)', color: 'var(--admin-primary)' }}
                >
                  <User size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Account Profile</h2>
                  <p className="settings-card-subtitle">Your identity and subscription tier.</p>
                </div>
              </div>
              <span
                className={`admin-badge ${
                  user?.plan === 'agency'
                    ? 'admin-badge-purple'
                    : user?.plan === 'pro'
                    ? 'admin-badge-blue'
                    : 'admin-badge-green'
                }`}
                style={{ textTransform: 'uppercase', fontWeight: 700, padding: '4px 10px' }}
              >
                {user?.plan || 'Hobby'} Plan
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div style={{ padding: '12px 14px', background: 'var(--admin-surface-subtle)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Name</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', marginTop: 4 }}>{user?.name || 'Administrator'}</div>
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--admin-surface-subtle)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', marginTop: 4 }}>{user?.email}</div>
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--admin-surface-subtle)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Role</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-primary)', marginTop: 4, textTransform: 'capitalize' }}>
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>
          </div>

          {/* Plan Usage & Quotas */}
          <div className="admin-form" style={{ marginBottom: 24 }}>
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: 'var(--admin-warning-light)', color: 'var(--admin-warning)' }}
                >
                  <Gauge size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Resource Usage &amp; Limits</h2>
                  <p className="settings-card-subtitle">Real-time capacity tracking against your active tier.</p>
                </div>
              </div>
            </div>

            {planLoading ? (
              <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>Loading resource quotas…</div>
            ) : planStatus ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {usageRow(
                  'Portfolios Created',
                  planStatus.usage?.portfolios ?? 0,
                  planStatus.limits?.maxPortfolios,
                  <Layers size={15} />
                )}
                {usageRow(
                  'API Keys Active',
                  planStatus.usage?.totalApiKeys ?? 0,
                  planStatus.limits?.maxApiKeysPerPortfolio,
                  <KeyRound size={15} />
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 12,
                    marginTop: 8,
                    paddingTop: 16,
                    borderTop: '1px solid var(--admin-border-subtle)',
                  }}
                >
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                    Max Upload File Size:{' '}
                    <strong style={{ color: 'var(--admin-text)' }}>
                      {Math.round((planStatus.limits?.maxUploadSizeBytes || 0) / (1024 * 1024))} MB
                    </strong>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                    API Rate Limits:{' '}
                    <strong style={{ color: 'var(--admin-text)' }}>
                      {planStatus.limits?.rateLimitPerMin} req/min
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>Could not load plan quotas.</div>
            )}
          </div>

          {/* Pricing Tiers Comparison */}
          <div className="admin-form">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <div
                  className="settings-card-icon"
                  style={{ background: 'var(--admin-primary-light)', color: 'var(--admin-primary)' }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Available Subscription Tiers</h2>
                  <p className="settings-card-subtitle">
                    Instant activation powered by Razorpay secure checkout.
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-pricing-grid">
              {/* Free Tier */}
              <div className={`settings-pricing-card ${!user?.plan || user?.plan === 'free' || user?.plan === 'hobby' ? 'current' : ''}`}>
                {(!user?.plan || user?.plan === 'free' || user?.plan === 'hobby') && (
                  <div className="settings-pricing-badge">
                    <span className="admin-badge admin-badge-green">Current Plan</span>
                  </div>
                )}
                <div>
                  <h3 className="settings-pricing-title">Hobby / Starter</h3>
                  <p className="settings-pricing-desc">Perfect for personal portfolios and getting started.</p>
                  <div className="settings-pricing-price">
                    <span className="settings-pricing-amount">₹0</span>
                    <span className="settings-pricing-period">/ forever</span>
                  </div>
                  <ul className="settings-pricing-features">
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>1 Portfolio Workspace</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>2 Active API Keys</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>5MB Upload Limit</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>Standard Community Support</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-block"
                  disabled={!user?.plan || user?.plan === 'free' || user?.plan === 'hobby'}
                >
                  {(!user?.plan || user?.plan === 'free' || user?.plan === 'hobby') ? 'Current Active Plan' : 'Free Tier'}
                </button>
              </div>

              {/* Pro Tier */}
              <div className={`settings-pricing-card featured ${user?.plan === 'pro' ? 'current' : ''}`}>
                <div className="settings-pricing-badge">
                  {user?.plan === 'pro' ? (
                    <span className="admin-badge admin-badge-green">Current Plan</span>
                  ) : (
                    <span className="admin-badge admin-badge-blue">Most Popular</span>
                  )}
                </div>
                <div>
                  <h3 className="settings-pricing-title">Developer Pro</h3>
                  <p className="settings-pricing-desc">For serious developers needing multi-site capabilities.</p>
                  <div className="settings-pricing-price">
                    <span className="settings-pricing-amount">₹799</span>
                    <span className="settings-pricing-period">/ month</span>
                  </div>
                  <ul className="settings-pricing-features">
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>Up to 5 Portfolios</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>10 API Keys per Workspace</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>25MB Upload Limit</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>Custom Domain Ready</span>
                    </li>
                  </ul>
                </div>
                {user?.plan === 'pro' ? (
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-block" disabled>
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-block"
                    onClick={() => handleRazorpayUpgrade('pro', 'Developer Pro')}
                    disabled={checkoutLoading || user?.plan === 'agency'}
                  >
                    <Zap size={14} />
                    <span>{user?.plan === 'agency' ? 'Included in Agency' : 'Upgrade to Pro'}</span>
                  </button>
                )}
              </div>

              {/* Agency Tier */}
              <div className={`settings-pricing-card ${user?.plan === 'agency' ? 'current' : ''}`}>
                {user?.plan === 'agency' && (
                  <div className="settings-pricing-badge">
                    <span className="admin-badge admin-badge-green">Current Plan</span>
                  </div>
                )}
                <div>
                  <h3 className="settings-pricing-title">Agency &amp; Teams</h3>
                  <p className="settings-pricing-desc">Uncapped capabilities for studios and agencies.</p>
                  <div className="settings-pricing-price">
                    <span className="settings-pricing-amount">₹2,499</span>
                    <span className="settings-pricing-period">/ month</span>
                  </div>
                  <ul className="settings-pricing-features">
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>Unlimited Portfolios</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>Unlimited API Keys</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>100MB Upload Limits</span>
                    </li>
                    <li className="settings-pricing-feature">
                      <CheckCircle2 size={15} />
                      <span>Priority High-Bandwidth SLA</span>
                    </li>
                  </ul>
                </div>
                {user?.plan === 'agency' ? (
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-block" disabled>
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-block"
                    onClick={() => handleRazorpayUpgrade('agency', 'Agency')}
                    disabled={checkoutLoading}
                  >
                    <Zap size={14} />
                    <span>Upgrade to Agency</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Security & Password */}
      {activeTab === 'security' && (
        <form className="admin-form" onSubmit={handleChangePassword}>
          <div className="settings-card-header">
            <div className="settings-card-title-group">
              <div
                className="settings-card-icon"
                style={{ background: 'var(--admin-primary-light)', color: 'var(--admin-primary)' }}
              >
                <Lock size={18} />
              </div>
              <div>
                <h2 className="settings-card-title">Change Password</h2>
                <p className="settings-card-subtitle">
                  Ensure your account is protected by using a strong, unique password.
                </p>
              </div>
            </div>
          </div>

          {pwdError && <div className="admin-form-error">{pwdError}</div>}

          <div className="admin-form-grid" style={{ marginBottom: 20 }}>
            <div className="admin-field">
              <label className="admin-field-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  className="admin-input"
                  style={{ paddingRight: 36 }}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--admin-text-muted)',
                    padding: 4,
                  }}
                  tabIndex={-1}
                >
                  {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-field-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  className="admin-input"
                  style={{ paddingRight: 36 }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--admin-text-muted)',
                    padding: 4,
                  }}
                  tabIndex={-1}
                >
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="admin-field-hint">Must contain at least 8 characters.</span>
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Confirm New Password</label>
              <input
                type="password"
                className="admin-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={pwdSaving}>
              <Lock size={15} />
              <span>{pwdSaving ? 'Updating password…' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Danger Zone */}
      {activeTab === 'danger' && (
        <div className="settings-danger-box">
          <div className="settings-danger-header">
            <AlertTriangle size={20} />
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Danger Zone Actions</h2>
          </div>
          <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 20px 0' }}>
            Actions taken here are irreversible. Please proceed with utmost caution.
          </p>

          <div className="settings-danger-item">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)' }}>
                Delete Portfolio Workspace
              </div>
              <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>
                Permanently delete "{activePortfolio.name}" along with all of its custom sections, media mappings, and API keys.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={deleting}
              style={{ flexShrink: 0 }}
            >
              <Trash2 size={14} />
              <span>{deleting ? 'Deleting…' : 'Delete Portfolio'}</span>
            </button>
          </div>

          <div className="settings-danger-item">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)' }}>
                Delete Entire Account
              </div>
              <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>
                Permanently delete your account ({user?.email}) and all owned portfolios, API keys, and uploads.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-danger-ghost"
              onClick={() => setDeleteAccountOpen(true)}
              style={{ flexShrink: 0, border: '1px solid var(--admin-danger-border)' }}
            >
              <Trash2 size={14} />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {deleteConfirmOpen && (
        <ConfirmDialog
          title="Delete Portfolio Workspace"
          message={`Are you sure you want to delete "${activePortfolio.name}" (${activePortfolio.slug})? All section data and API keys will be permanently removed.`}
          onConfirm={handleDeletePortfolio}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}

      {deleteAccountOpen && (
        <ConfirmDialog
          title="Permanently Delete Your Account"
          message="This will permanently delete your account and all of your portfolios, sections, API keys, and media files. This action cannot be undone."
          onCancel={() => {
            setDeleteAccountOpen(false);
            setDeleteAccountError('');
            setDeleteAccountPwd('');
          }}
          onConfirm={handleDeleteAccount}
          confirmLabel="Delete My Account"
        >
          <div style={{ padding: '4px 0 12px' }}>
            {deleteAccountError && <div className="admin-form-error">{deleteAccountError}</div>}
            <input
              type="password"
              className="admin-input"
              value={deleteAccountPwd}
              onChange={(e) => setDeleteAccountPwd(e.target.value)}
              placeholder="Enter your password to confirm"
              autoComplete="current-password"
            />
            <p className="admin-field-hint" style={{ margin: '8px 0 0' }}>
              Enter your password to confirm permanent deletion.
            </p>
          </div>
        </ConfirmDialog>
      )}
    </div>
  );
}
