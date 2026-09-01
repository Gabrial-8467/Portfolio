import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileJson } from 'lucide-react';
import { PORTFOLIO_SLUG } from '../api/client';

export default function ResponseExplorer() {
  const [openNodes, setOpenNodes] = useState({
    data: true,
    portfolio: true,
    sections: true,
  });

  const toggleNode = (node) => {
    setOpenNodes((prev) => ({ ...prev, [node]: !prev[node] }));
  };

  return (
    <section className="saas-section saas-section-alt">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
          <div className="saas-badge">
            <FileJson size={14} /> Predictable JSON Contracts
          </div>
          <h2 className="saas-heading">API Response Explorer</h2>
          <p className="saas-subheading mx-auto">
            Inspect the standard response structure designed for intuitive frontend consumption.
          </p>
        </div>

        <div
          style={{
            maxWidth: 820,
            margin: '40px auto 0',
            background: '#ffffff',
            border: '1px solid var(--saas-border)',
            borderRadius: 'var(--saas-radius-xl)',
            padding: 32,
            boxShadow: 'var(--saas-shadow-md)',
          }}
        >
          {/* Root Level */}
          <div style={{ fontFamily: 'var(--saas-mono)', fontSize: 14 }}>
            <div style={{ color: '#64748b' }}>&#123;</div>

            <div style={{ marginLeft: 20 }}>
              <span className="tree-key">&quot;success&quot;</span>: <span style={{ color: '#16a34a' }}>true</span>,
            </div>

            {/* data object */}
            <div style={{ marginLeft: 20 }}>
              <div
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => toggleNode('data')}
              >
                {openNodes.data ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="tree-key">&quot;data&quot;</span>: &#123;
                <span className="tree-type">Object (Payload root)</span>
              </div>

              {openNodes.data && (
                <div style={{ marginLeft: 24, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                  {/* portfolio object */}
                  <div
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => toggleNode('portfolio')}
                  >
                    {openNodes.portfolio ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="tree-key">&quot;portfolio&quot;</span>: &#123;
                    <span className="tree-type">Object (Tenant metadata)</span>
                  </div>

                  {openNodes.portfolio && (
                    <div style={{ marginLeft: 24, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                      <div><span className="tree-key">&quot;name&quot;</span>: <span style={{ color: '#0d9488' }}>&quot;Gabrial Deora&quot;</span>,</div>
                      <div><span className="tree-key">&quot;slug&quot;</span>: <span style={{ color: '#0d9488' }}>&quot;{PORTFOLIO_SLUG}&quot;</span>,</div>
                      <div><span className="tree-key">&quot;settings&quot;</span>: &#123; <span className="tree-type">Custom JSON preferences</span> &#125;</div>
                    </div>
                  )}
                  <div style={{ color: '#64748b' }}>&#125;,</div>

                  {/* sections array */}
                  <div
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}
                    onClick={() => toggleNode('sections')}
                  >
                    {openNodes.sections ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="tree-key">&quot;sections&quot;</span>: [
                    <span className="tree-type">Array (Published content blocks)</span>
                  </div>

                  {openNodes.sections && (
                    <div style={{ marginLeft: 24, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                      <div style={{ color: '#64748b' }}>&#123;</div>
                      <div style={{ marginLeft: 16 }}>
                        <div><span className="tree-key">&quot;key&quot;</span>: <span style={{ color: '#0d9488' }}>&quot;site&quot;</span>,</div>
                        <div><span className="tree-key">&quot;label&quot;</span>: <span style={{ color: '#0d9488' }}>&quot;Site Settings&quot;</span>,</div>
                        <div><span className="tree-key">&quot;content&quot;</span>: &#123; <span className="tree-type">Hero title, bio, avatarUrl, links...</span> &#125;,</div>
                        <div><span className="tree-key">&quot;isPublished&quot;</span>: <span style={{ color: '#16a34a' }}>true</span></div>
                      </div>
                      <div style={{ color: '#64748b' }}>&#125;,</div>

                      <div style={{ color: '#64748b', marginTop: 4 }}>&#123;</div>
                      <div style={{ marginLeft: 16 }}>
                        <div><span className="tree-key">&quot;key&quot;</span>: <span style={{ color: '#0d9488' }}>&quot;projects&quot;</span>,</div>
                        <div><span className="tree-key">&quot;label&quot;</span>: <span style={{ color: '#0d9488' }}>&quot;Projects&quot;</span>,</div>
                        <div><span className="tree-key">&quot;content&quot;</span>: [ <span className="tree-type">Array of project cards with tags, descriptions, links</span> ],</div>
                        <div><span className="tree-key">&quot;isPublished&quot;</span>: <span style={{ color: '#16a34a' }}>true</span></div>
                      </div>
                      <div style={{ color: '#64748b' }}>&#125;</div>
                    </div>
                  )}
                  <div style={{ color: '#64748b' }}>]</div>
                </div>
              )}
              <div style={{ color: '#64748b' }}>&#125;</div>
            </div>

            <div style={{ color: '#64748b' }}>&#125;</div>
          </div>
        </div>
      </div>
    </section>
  );
}
