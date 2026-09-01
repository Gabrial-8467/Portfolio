import { useState } from 'react';
import { useAuth } from '../../admin/useAuth';
import { API_URL } from '../../api/client';
import {
  Copy,
  Check,
} from 'lucide-react';

export default function ApiDocs() {
  const { activePortfolio } = useAuth();
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const apiUrl = API_URL.replace(/\/+$/, '');
  const slug = activePortfolio?.slug || 'my-portfolio';

  const snippets = {
    javascript: `// Fetch full portfolio with API key
const res = await fetch("${apiUrl}/api/v1/portfolio", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Accept": "application/json"
  }
});
const { data } = await res.json();
console.log(data.portfolio, data.sections);`,

    react: `// React custom hook for ${slug}
import { useEffect, useState } from 'react';

export function usePortfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("${apiUrl}/api/p/${slug}")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}`,

    nextjs: `// Next.js App Router (Server Component)
export default async function Page() {
  const res = await fetch("${apiUrl}/api/p/${slug}", {
    next: { revalidate: 60 } // ISR cache for 60s
  });
  const { data } = await res.json();

  return (
    <div>
      <h1>{data.portfolio.name}</h1>
      {data.sections.map((s) => (
        <section key={s.key}>{s.label}</section>
      ))}
    </div>
  );
}`,

    curl: `# Fetch via Public Slug
curl -X GET "${apiUrl}/api/p/${slug}" \\
  -H "Accept: application/json"

# Fetch via Developer API Key
curl -X GET "${apiUrl}/api/v1/portfolio" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`,

    python: `import requests

url = "${apiUrl}/api/p/${slug}"
response = requests.get(url)
data = response.json().get("data", {})

print("Loaded sections:", len(data.get("sections", [])))`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(snippets[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Developer API Reference</h1>
          <p className="admin-page-subtitle">
            Integration guides, sample code snippets, and endpoints for <strong>{slug}</strong>.
          </p>
        </div>
      </div>

      {/* Code Snippets Box */}
      <div
        style={{
          background: '#0f172a',
          borderRadius: 'var(--admin-radius)',
          padding: 22,
          color: '#ffffff',
          marginBottom: 32,
          boxShadow: 'var(--admin-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4, background: '#1e293b', padding: 4, borderRadius: 6 }}>
            {['javascript', 'react', 'nextjs', 'curl', 'python'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLang(lang)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: selectedLang === lang ? '#ffffff' : '#94a3b8',
                  background: selectedLang === lang ? 'var(--admin-primary)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--admin-transition)',
                }}
              >
                {lang === 'nextjs' ? 'Next.js' : lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={copyCode}
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderColor: '#334155' }}
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre style={{ margin: 0, fontFamily: 'var(--admin-mono)', fontSize: 13, lineHeight: 1.6, overflowX: 'auto' }}>
          <code>{snippets[selectedLang]}</code>
        </pre>
      </div>

      {/* Endpoints Reference */}
      <div className="admin-toolbar" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
          Available REST Endpoints
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Endpoint 1 */}
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', padding: 18, boxShadow: 'var(--admin-shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="admin-badge admin-badge-blue">GET</span>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--admin-mono)', color: 'var(--admin-text)' }}>
              /api/p/{slug}
            </span>
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>Public Access (No Auth)</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: '0 0 12px 0' }}>
            Returns full portfolio configuration and all published content sections for <code>{slug}</code>.
          </p>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 12, fontFamily: 'var(--admin-mono)', border: '1px solid var(--admin-border-subtle)' }}>
            curl {apiUrl}/api/p/{slug}
          </div>
        </div>

        {/* Endpoint 2 */}
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', padding: 18, boxShadow: 'var(--admin-shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="admin-badge admin-badge-blue">GET</span>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--admin-mono)', color: 'var(--admin-text)' }}>
              /api/v1/portfolio
            </span>
            <span style={{ fontSize: 12, color: 'var(--admin-primary)', fontWeight: 600, marginLeft: 'auto' }}>API Key Required</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: '0 0 12px 0' }}>
            Authenticated developer endpoint for Next.js and custom servers. Delivers portfolio metadata and structured section objects.
          </p>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 12, fontFamily: 'var(--admin-mono)', border: '1px solid var(--admin-border-subtle)' }}>
            curl -H &quot;Authorization: Bearer &lt;API_KEY&gt;&quot; {apiUrl}/api/v1/portfolio
          </div>
        </div>

        {/* Endpoint 3 */}
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', padding: 18, boxShadow: 'var(--admin-shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="admin-badge admin-badge-blue">GET</span>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--admin-mono)', color: 'var(--admin-text)' }}>
              /api/v1/section/:key
            </span>
            <span style={{ fontSize: 12, color: 'var(--admin-primary)', fontWeight: 600, marginLeft: 'auto' }}>API Key Required</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: '0 0 12px 0' }}>
            Fetches an individual content section (e.g. <code>projects</code>, <code>experience</code>, <code>skills</code>).
          </p>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 12, fontFamily: 'var(--admin-mono)', border: '1px solid var(--admin-border-subtle)' }}>
            curl -H &quot;Authorization: Bearer &lt;API_KEY&gt;&quot; {apiUrl}/api/v1/section/projects
          </div>
        </div>
      </div>
    </div>
  );
}
