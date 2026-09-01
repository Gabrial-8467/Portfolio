import React from 'react';
import { KeyRound, LayoutDashboard, Globe2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: KeyRound,
      title: 'Create your portfolio',
      desc: 'Sign up in seconds. An isolated portfolio tenant, admin workspace, and a secure API key are provisioned instantly.',
    },
    {
      num: '02',
      icon: LayoutDashboard,
      title: 'Manage your content',
      desc: 'Fill out structured forms for projects, career history, skills, and links, or edit raw JSON directly in the browser.',
    },
    {
      num: '03',
      icon: Globe2,
      title: 'Connect your API',
      desc: 'Query your portfolio REST endpoints in React, Next.js, Vue, mobile apps, or static site generators in one clean fetch call.',
    },
  ];

  return (
    <section id="how-it-works" className="saas-section">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <h2 className="saas-heading">How it works</h2>
          <p className="saas-subheading mx-auto">
            From registration to live API consumption in under two minutes.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => {
            return (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-desc">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
