import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function Pricing({ onOpenRegister }) {
  const plans = [
    {
      name: 'Hobby',
      price: '$0',
      period: 'forever',
      desc: 'Ideal for student portfolios and single developer showcases.',
      features: [
        '1 Active Portfolio Workspace',
        'Unlimited CMS Section Updates',
        'Headless REST Endpoints (/api/v1)',
        '1 Scoped API Key',
        'Image Uploads (Up to 5MB/file)',
        'Community Support',
      ],
      cta: 'Start Building Free',
      featured: false,
    },
    {
      name: 'Developer Pro',
      price: '$9',
      period: 'per month',
      desc: 'For freelancers, creators, and engineers managing multiple client portfolios.',
      features: [
        'Up to 5 Portfolio Workspaces',
        'Unlimited API Keys & Rotation',
        'Full Headless Developer API (/api/v1)',
        'Priority Edge CDN Caching',
        'Custom JSON Schema Fields',
        '50MB Media Asset Storage',
        'Priority Email Support',
      ],
      cta: 'Get Started with Pro',
      featured: true,
    },
    {
      name: 'Agency & Team',
      price: '$29',
      period: 'per month',
      desc: 'Collaborative workspaces for studios and development teams.',
      features: [
        'Unlimited Portfolios',
        'Multi-User Workspace Collaboration',
        'Unlimited API Keys & Granular ACLs',
        'Audit Logging & Activity Tracking',
        'Custom Domain Binding',
        'Dedicated SLA & Support',
      ],
      cta: 'Contact Sales',
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="saas-section">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <div className="saas-badge">
            <Sparkles size={14} /> Transparent Developer Pricing
          </div>
          <h2 className="saas-heading">Simple, predictable pricing.</h2>
          <p className="saas-subheading mx-auto">
            Get started for free with no credit card required. Upgrade as your portfolio footprint grows.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            >
              {plan.featured && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--saas-primary)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    letterSpacing: '0.05em',
                  }}
                >
                  Most Popular
                </div>
              )}

              <h3 className="pricing-plan-name">{plan.name}</h3>
              <p className="pricing-plan-desc">{plan.desc}</p>

              <div className="pricing-price-wrap">
                <span className="pricing-price">{plan.price}</span>
                <span className="pricing-period"> /{plan.period}</span>
              </div>

              <ul className="pricing-features-list">
                {plan.features.map((feat) => (
                  <li key={feat} className="pricing-feature-item">
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                style={{ width: '100%' }}
                onClick={onOpenRegister}
              >
                {plan.cta} <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
