import React from 'react';
import {
  LayoutDashboard,
  Server,
  KeyRound,
  Users,
  Eye,
  FileJson,
  UploadCloud,
  ToggleLeft,
  Sparkles,
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Headless CMS',
      desc: 'Manage all portfolio content, hero copy, projects, experience, skills, and links from one unified dashboard.',
    },
    {
      icon: Server,
      title: 'Developer REST API',
      desc: 'Ultra-fast endpoints with zero CORS restrictions. Fetch full portfolios or single sections with clean JSON responses.',
    },
    {
      icon: KeyRound,
      title: 'Scoped API Keys',
      desc: 'Create, manage, and instantly revoke secure API keys. Only hashed digests are stored on our servers.',
    },
    {
      icon: Users,
      title: 'Multi-Tenant Architecture',
      desc: 'Create and switch between multiple portfolios effortlessly under one account with complete data isolation.',
    },
    {
      icon: Eye,
      title: 'Live Instant Preview',
      desc: 'Preview changes across themes and viewport sizes before publishing to your production domain.',
    },
    {
      icon: FileJson,
      title: 'Flexible JSON Engine',
      desc: 'Switch between structured visual form fields and raw JSON editing with live syntax validation and formatting.',
    },
    {
      icon: UploadCloud,
      title: 'Media Asset Manager',
      desc: 'Directly upload high-res screenshots, project banners, and avatars with optimized static asset serving.',
    },
    {
      icon: ToggleLeft,
      title: 'Granular Publishing',
      desc: 'Draft upcoming projects or unpublished experiments privately without breaking production consumer apps.',
    },
  ];

  return (
    <section id="features" className="saas-section saas-section-alt">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <div className="saas-badge">
            <Sparkles size={14} /> Built for Maximum Developer Velocity
          </div>
          <h2 className="saas-heading">Everything you need to power your portfolio.</h2>
          <p className="saas-subheading mx-auto">
            Engineered to remove friction between content creation and modern frontend deployment.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
