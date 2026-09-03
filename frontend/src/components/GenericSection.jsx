import React from 'react';
import { useInView } from '../hooks/useInView';

function prettyLabel(key) {
  return (key || '')
    .split(/(?=[A-Z])|[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function renderValue(value, depth = 0) {
  if (value === null || value === undefined) return null;

  if (Array.isArray(value)) {
    if (depth > 3 || value.length === 0) return null;
    return (
      <div className="generic-section-list" style={{ display: 'grid', gap: 8 }}>
        {value.map((item, i) => (
          <div key={i} className="generic-section-item">
            {typeof item === 'object' ? (
              <div style={{ display: 'grid', gap: 4 }}>
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 8, fontSize: 14 }}>
                    <span style={{ fontWeight: 600, minWidth: 110, color: 'var(--portfolio-muted, #64748b)' }}>
                      {prettyLabel(k)}
                    </span>
                    <span>{typeof v === 'object' ? renderValue(v, depth + 1) : String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              String(item)
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {Object.entries(value).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 8, fontSize: 15 }}>
            <span style={{ fontWeight: 600, minWidth: 130, color: 'var(--portfolio-muted, #64748b)' }}>
              {prettyLabel(k)}
            </span>
            <span style={{ flex: 1 }}>{typeof v === 'object' ? renderValue(v, depth + 1) : String(v)}</span>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

export default function GenericSection({ section = {} }) {
  const [ref, isInView] = useInView();
  const key = section.key || 'section';
  const label = section.label || prettyLabel(key);
  const content = section.content;

  return (
    <section id={key} ref={ref} className={`generic-modern-section ${isInView ? 'in-view' : ''}`}>
      <div className="section-container">
        <div className="section-header-row">
          <div className="section-header-left">
            <div className="card-badge">
              <span className="card-badge-dot" style={{ background: 'var(--portfolio-accent, #6366f1)' }} />
              <span className="card-badge-text">{key}</span>
            </div>
            <h2 className="section-main-title">{label}</h2>
          </div>
        </div>
        <div className="generic-section-body">
          {content !== null && content !== undefined ? renderValue(content) : <p style={{ color: 'var(--portfolio-muted, #94a3b8)' }}>No content added yet.</p>}
        </div>
      </div>
    </section>
  );
}
