import React from 'react';
import { XCircle, CheckCircle2, RefreshCw, GitCommit, Rocket, ShieldCheck, Database } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="saas-section">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <h2 className="saas-heading">Stop hardcoding your portfolio.</h2>
          <p className="saas-subheading mx-auto">
            Traditional portfolios force you to open VS Code, rewrite JSX, push commits, and wait for CI/CD builds every time you add a project or skill.
          </p>
        </div>

        <div className="problem-solution-grid">
          {/* Old Way */}
          <div className="comparison-box old-way">
            <div className="comparison-title" style={{ color: '#be123c' }}>
              <XCircle size={20} /> Traditional Portfolio Website
            </div>
            <div className="comparison-steps">
              <div className="step-row" style={{ color: '#9f1239' }}>
                <GitCommit size={16} /> Hardcoded JSON & JSX files in git repo
              </div>
              <div className="step-row" style={{ color: '#9f1239' }}>
                <RefreshCw size={16} /> Manual code edits for every small typo or new project
              </div>
              <div className="step-row" style={{ color: '#9f1239' }}>
                <Rocket size={16} /> Wait for full rebuild and deployment pipelines
              </div>
              <div className="step-row" style={{ color: '#9f1239' }}>
                <XCircle size={16} /> Locked into one framework; impossible to share content
              </div>
            </div>
          </div>

          {/* New Way */}
          <div className="comparison-box new-way">
            <div className="comparison-title" style={{ color: '#4338ca' }}>
              <CheckCircle2 size={20} /> The Portfolio CMS Platform
            </div>
            <div className="comparison-steps">
              <div className="step-row" style={{ color: '#3730a3' }}>
                <Database size={16} color="#4f46e5" /> Centralized multi-tenant database & structured CMS
              </div>
              <div className="step-row" style={{ color: '#3730a3' }}>
                <CheckCircle2 size={16} color="#16a34a" /> Instant visual forms & raw JSON editor in browser
              </div>
              <div className="step-row" style={{ color: '#3730a3' }}>
                <Rocket size={16} color="#2563eb" /> Publish once — REST API updates across all frontends
              </div>
              <div className="step-row" style={{ color: '#3730a3' }}>
                <ShieldCheck size={16} color="#10b981" /> Connect anywhere: React, Next.js, Vue, or iOS/Android
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
