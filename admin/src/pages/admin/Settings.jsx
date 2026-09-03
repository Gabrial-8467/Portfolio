import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/useAuth';
import { api, getPublicPortfolioUrl } from '../../api/client';
import { useToast } from '../../admin/components/useToast';
import JsonEditor from '../../admin/components/JsonEditor';
import Field, { TextInput } from '../../admin/components/Field';
import { Save, ArrowUpRight, Trash2, AlertTriangle, User } from 'lucide-react';
import { ConfirmDialog } from '../../admin/components/ConfirmDialog';
import AdminLoader from '../../admin/components/AdminLoader';

export default function Settings() {
  const { user, activePortfolio, refreshPortfolios } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const activePortfolioId = activePortfolio?._id;
  const activePortfolioName = activePortfolio?.name;

  useEffect(() => {
    let cancelled = false;
    if (!activePortfolioId) {
      // eslint-disable-next-line react/set-state-in-effect
      setLoading(false);
      return undefined;
    }
    // eslint-disable-next-line react/set-state-in-effect
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
    e.preventDefault();
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

  const handleDeletePortfolio = () => {
    addToast('Portfolio workspace deletion is not available via API key. Manage portfolios at the admin console.', 'info');
    setDeleteConfirmOpen(false);
  };

  if (loading) {
    return <AdminLoader message="Loading workspace settings…" subtext="Fetching portfolio configurations" />;
  }

  if (!activePortfolio) {
    return <AdminLoader message="No portfolio selected" subtext="Please select or create a workspace first" />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Workspace Settings</h1>
          <p className="admin-page-subtitle">Configure portfolio metadata, theme preferences, and access permissions.</p>
        </div>
        <a
          className="admin-btn admin-btn-secondary admin-btn-sm"
          href={getPublicPortfolioUrl(activePortfolio.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View Live Site</span>
          <ArrowUpRight size={13} />
        </a>
      </div>

      {error && <div className="admin-form-error">{error}</div>}

      {/* User Account & Subscription Info Box */}
      <div className="admin-form" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-primary-light)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
              Account Profile &amp; Plan
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Current Plan:</span>
            <span className={`admin-badge ${user?.plan === 'agency' ? 'admin-badge-purple' : user?.plan === 'pro' ? 'admin-badge-blue' : 'admin-badge-green'}`} style={{ textTransform: 'uppercase', fontWeight: 700 }}>
              {user?.plan || 'Hobby'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Name</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', marginTop: 4 }}>{user?.name || 'Administrator'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Email</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', marginTop: 4 }}>{user?.email}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Role</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-primary)', marginTop: 4, textTransform: 'capitalize' }}>
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>

        {/* Razorpay Subscription Tier Actions */}
        {user?.plan !== 'agency' && (
          <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 8 }}>
              Upgrade Your SaaS Workspace via Razorpay
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {user?.plan !== 'pro' && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={async () => {
                    try {
                      const orderRes = await api.billing.createOrder('pro');
                      const orderData = orderRes?.data || orderRes;
                      
                      const loadRazorpayScript = () => new Promise((resolve) => {
                        if (window.Razorpay) return resolve(true);
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = () => resolve(true);
                        script.onerror = () => resolve(false);
                        document.body.appendChild(script);
                      });

                      const loaded = await loadRazorpayScript();
                      if (!loaded) {
                        addToast({ type: 'error', message: 'Could not load Razorpay SDK' });
                        return;
                      }

                      const rzp = new window.Razorpay({
                        key: orderData.keyId,
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: 'Portfolio CMS Pro',
                        description: 'Developer Pro Plan Subscription',
                        order_id: orderData.orderId,
                        prefill: {
                          name: user?.name,
                          email: user?.email,
                        },
                        theme: { color: '#6366f1' },
                        handler: async (response) => {
                          try {
                            const verifyRes = await api.billing.verifyPayment({
                              razorpay_order_id: response.razorpay_order_id,
                              razorpay_payment_id: response.razorpay_payment_id,
                              razorpay_signature: response.razorpay_signature,
                              planId: 'pro',
                            });
                            addToast({ type: 'success', message: 'Successfully upgraded to Developer Pro!' });
                            window.location.reload();
                          } catch (vErr) {
                            addToast({ type: 'error', message: vErr.message || 'Payment verification failed' });
                          }
                        },
                      });
                      rzp.open();
                    } catch (err) {
                      addToast({ type: 'error', message: err.message || 'Failed to initiate Razorpay checkout' });
                    }
                  }}
                >
                  <span>Upgrade to Pro (₹799/mo)</span>
                </button>
              )}
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={async () => {
                  try {
                    const orderRes = await api.billing.createOrder('agency');
                    const orderData = orderRes?.data || orderRes;
                    
                    const loadRazorpayScript = () => new Promise((resolve) => {
                      if (window.Razorpay) return resolve(true);
                      const script = document.createElement('script');
                      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                      script.onload = () => resolve(true);
                      script.onerror = () => resolve(false);
                      document.body.appendChild(script);
                    });

                    const loaded = await loadRazorpayScript();
                    if (!loaded) {
                      addToast({ type: 'error', message: 'Could not load Razorpay SDK' });
                      return;
                    }

                    const rzp = new window.Razorpay({
                      key: orderData.keyId,
                      amount: orderData.amount,
                      currency: orderData.currency,
                      name: 'Portfolio CMS Agency',
                      description: 'Agency & Team Plan Subscription',
                      order_id: orderData.orderId,
                      prefill: {
                        name: user?.name,
                        email: user?.email,
                      },
                      theme: { color: '#6366f1' },
                      handler: async (response) => {
                        try {
                          await api.billing.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: 'agency',
                          });
                          addToast({ type: 'success', message: 'Successfully upgraded to Agency Plan!' });
                          window.location.reload();
                        } catch (vErr) {
                          addToast({ type: 'error', message: vErr.message || 'Payment verification failed' });
                        }
                      },
                    });
                    rzp.open();
                  } catch (err) {
                    addToast({ type: 'error', message: err.message || 'Failed to initiate Razorpay checkout' });
                  }
                }}
              >
                <span>Upgrade to Agency (₹2,499/mo)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Config Form */}
      <form className="admin-form" onSubmit={submit}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 16 }}>
          Portfolio Metadata
        </div>
        <div className="admin-form-grid">
          <Field label="Portfolio Name">
            <TextInput value={name} onChange={setName} placeholder="My Portfolio" />
          </Field>
          <Field label="Public Slug" hint="Unique slug used in your portfolio frontend and API responses.">
            <TextInput value={activePortfolio.slug} onChange={() => {}} disabled />
          </Field>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: '24px 0 6px' }}>
          Custom Settings & Theme JSON
        </div>
        <p className="admin-field-hint" style={{ marginBottom: 14 }}>
          Arbitrary JSON payload delivered under <code>portfolio.settings</code>. Configure color accents, theme preferences, or analytics IDs.
        </p>
        <div style={{ minHeight: 240 }}>
          <JsonEditor value={settings} onChange={setSettings} />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <Save size={15} />
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div
        style={{
          border: '1px solid var(--admin-danger-border)',
          background: 'var(--admin-danger-light)',
          borderRadius: 'var(--admin-radius)',
          padding: 22,
          marginTop: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-danger)', marginBottom: 6 }}>
          <AlertTriangle size={16} />
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Danger Zone</h3>
        </div>
        <p style={{ fontSize: 13, color: '#991b1b', margin: '0 0 16px 0' }}>
          Deleting this portfolio workspace permanently deletes all of its content sections, media mappings, and API keys.
        </p>
        <button
          type="button"
          className="admin-btn admin-btn-danger"
          onClick={() => setDeleteConfirmOpen(true)}
          disabled={deleting}
        >
          <Trash2 size={14} />
          <span>{deleting ? 'Deleting…' : 'Delete Portfolio Workspace'}</span>
        </button>
      </div>

      {deleteConfirmOpen && (
        <ConfirmDialog
          title="Delete Portfolio Workspace"
          message={`Are you sure you want to delete "${activePortfolio.name}" (${activePortfolio.slug})? All section data and API keys will be permanently removed.`}
          onConfirm={handleDeletePortfolio}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
}
