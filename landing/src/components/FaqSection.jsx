import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      q: 'How does Portfolio CMS differ from standard static website templates?',
      a: 'Traditional templates require you to modify hardcoded source code and trigger new deployments whenever content changes. Portfolio CMS stores your content in a centralized multi-tenant database and serves it via an API so your frontend updates instantly without rebuilds.',
    },
    {
      q: 'Can I use this with Next.js App Router, Vite React, Astro, or Vue?',
      a: 'Yes! Portfolio CMS provides standard JSON REST endpoints (`/api/v1/portfolio` and `/api/v1/section/:key`) secured with API keys. You can fetch your content at build time (SSG), on every request (SSR), or on the client side (CSR) in any frontend framework.',
    },
    {
      q: 'Are there any CORS restrictions on the developer API?',
      a: 'No. The developer API (`/api/v1`) has CORS enabled for all origins (`*`), allowing direct client-side fetching from custom domains or localhost without proxy servers.',
    },
    {
      q: 'How does API key security work?',
      a: 'When you generate an API key, we show the full plaintext key exactly once. In our database, only a one-way cryptographic SHA-256 hash is saved. API keys provide read access to published sections.',
    },
    {
      q: 'Can I upload screenshots and project images?',
      a: 'Yes. The admin dashboard features an integrated media uploader that uploads directly to the server asset storage and generates optimized public asset URLs.',
    },
    {
      q: 'What happens if my frontend goes offline or the server is updating?',
      a: 'Our recommended frontend client architecture includes local fallback JSON data so your portfolio always renders gracefully even if network connectivity is interrupted.',
    },
  ];

  return (
    <section id="faq" className="saas-section saas-section-alt">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <div className="saas-badge">
            <HelpCircle size={14} /> Clear Answers
          </div>
          <h2 className="saas-heading">Frequently Asked Questions</h2>
          <p className="saas-subheading mx-auto">
            Everything you need to know about our headless architecture and developer tooling.
          </p>
        </div>

        <div className="faq-grid">
          {faqs.map((faq) => (
            <div key={faq.q} className="faq-card">
              <h3 className="faq-q">{faq.q}</h3>
              <p className="faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
