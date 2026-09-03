import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { API_URL } from '../api/client';

export default function DeveloperSection() {
  const [lang, setLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const snippets = {
    javascript: `// Modern fetch with async/await
const res = await fetch("${API_URL}/api/v1/portfolio", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Accept": "application/json"
  }
});

const { data } = await res.json();
console.log("Portfolio:", data.name);
console.log("Published Sections:", data.sections);`,

    react: `// React custom hook with resilient fallback
import { useState, useEffect } from 'react';

export function usePortfolio(apiKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('${API_URL}/api/v1/portfolio', {
      headers: { Authorization: \`Bearer \${apiKey}\` }
    })
      .then(res => res.json())
      .then(json => {
        setData(json.data);
        setLoading(false);
      });
  }, [apiKey]);

  return { data, loading };
}`,

    nextjs: `// Next.js App Router (Server Component with revalidation)
export default async function PortfolioPage() {
  const res = await fetch('${API_URL}/api/v1/portfolio', {
    headers: { Authorization: \`Bearer \${process.env.PORTFOLIO_API_KEY}\` },
    next: { revalidate: 60 } // ISR every 60 seconds
  });

  const { data } = await res.json();

  return (
    <main className="container">
      <h1>{data.name}</h1>
      <section>
        {data.sections.map(section => (
          <div key={section.key}>
            <h2>{section.label}</h2>
          </div>
        ))}
      </section>
    </main>
  );
}`,

    curl: `# Direct cURL request
curl -X GET "${API_URL}/api/v1/portfolio" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`,

    python: `# Python requests
import requests

url = "${API_URL}/api/v1/portfolio"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json().get("data", {})

print(f"Loaded portfolio: {data.get('name')}")`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer" className="saas-section">
      <div className="saas-container">
        <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 40 }}>
          <div className="saas-badge">
            <Code2 size={14} /> Developer Experience First
          </div>
          <h2 className="saas-heading">Built for modern developers.</h2>
          <p className="saas-subheading mx-auto">
            Integrate in any frontend framework or backend runtime in seconds with type-safe payloads and zero CORS hurdles.
          </p>
        </div>

        <div className="dev-section-wrapper">
          <div className="dev-tabs-header">
            <div className="dev-lang-tabs">
              {[
                { id: 'javascript', label: 'JavaScript' },
                { id: 'react', label: 'React' },
                { id: 'nextjs', label: 'Next.js' },
                { id: 'curl', label: 'cURL' },
                { id: 'python', label: 'Python' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`dev-tab ${lang === t.id ? 'active' : ''}`}
                  onClick={() => setLang(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="code-copy-btn"
              onClick={handleCopy}
              style={{ fontSize: 13, padding: '6px 12px' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to clipboard' : 'Copy Code'}</span>
            </button>
          </div>

          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--saas-mono)',
              fontSize: 14,
              lineHeight: 1.6,
              color: '#f1f5f9',
              overflowX: 'auto',
            }}
          >
            <code>{snippets[lang]}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
