import { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  Palette,
  Rocket,
  Server,
  Sparkles,
  X,
} from 'lucide-react';
import { api, ADMIN_URL, PORTFOLIO_SLUG } from '../api/client';

const FEATURES = [
  { icon: KeyRound, title: 'One key, one request', text: 'Generate an API key and fetch your whole portfolio with a single authenticated call.' },
  { icon: LayoutDashboard, title: 'Beautiful admin panel', text: 'Edit nav links, footer links, images, projects and descriptions with structured forms — no code.' },
  { icon: Layers, title: 'All sections, structured', text: 'Projects, experience, education, skills, services, socials — every piece has a dedicated editor.' },
  { icon: Lock, title: 'Keys stay secret', text: 'Only a one-way hash of your key is stored. The plaintext is shown once and can be revoked anytime.' },
  { icon: Rocket, title: 'Ship in minutes', text: 'Add one environment variable to your site and your content updates live from the CMS.' },
  { icon: Palette, title: 'Design stays yours', text: 'It is a headless API — your portfolio keeps its own look while content comes from the CMS.' },
];

const STEPS = [
  { icon: KeyRound, step: '01', title: 'Sign up & get your key', text: 'Create a free account. Your portfolio, admin access, and API key are generated instantly.' },
  { icon: Server, step: '02', title: 'Point your site at the API', text: 'Set VITE_API_URL and VITE_API_KEY in your frontend build. Fetch /api/v1/portfolio with one line.' },
  { icon: LayoutDashboard, step: '03', title: 'Manage content in the admin', text: 'Add projects, links, images, education and experience. Publish and your site updates instantly.' },
];

const HERO_BULLETS = [
  'Free API key in under 30 seconds',
  'Structured editor for every section',
  'No CORS restrictions on your API calls',
];

function copyText(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    el.remove();
    return Promise.resolve();
  }
}

export default function Landing() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealedKey, setRevealedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const apiUrl = api.getUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.register({ name, email, password, portfolioName });
      setRevealedKey(result.apiKey);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await copyText(revealedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="land-page">
      <nav className="land-nav">
        <div className="land-container land-nav-inner">
          <a className="land-brand" href="#top">Portfolio CMS</a>
          <div className="land-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#snippet">Integrate</a>
          </div>
          <div className="land-nav-cta">
            <a className="land-link-btn" href={ADMIN_URL} target="_blank" rel="noreferrer">
              Sign in
            </a>
            <a className="land-btn land-btn-primary" href="#signup">
              Get API key
            </a>
          </div>
        </div>
      </nav>

      <header id="top" className="land-hero">
        <div className="land-container land-hero-inner">
          <div className="land-hero-copy">
            <div className="land-hero-pill">
              <Sparkles size={14} />
              Headless portfolio CMS for developers
            </div>
            <h1 className="land-hero-title">
              Your portfolio content,
              <br />
              <span className="land-gradient-text">powered by one API key.</span>
            </h1>
            <p className="land-hero-sub">
              Generate a secure API key, integrate once, and manage every link, image, project and section from a
              modern admin panel — while keeping your own design.
            </p>
            <ul className="land-bullets">
              {HERO_BULLETS.map((b) => (
                <li key={b}>
                  <Check size={16} /> {b}
                </li>
              ))}
            </ul>
            <div className="land-hero-actions">
              <a className="land-btn land-btn-primary" href="#signup">
                Get my API key <ArrowRight size={16} />
              </a>
              <a className="land-btn land-btn-ghost" href={`${apiUrl}/api/p/${PORTFOLIO_SLUG}`} target="_blank" rel="noreferrer">
                View live demo <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <form className="land-signup" id="signup" onSubmit={handleSubmit}>
            <div className="land-signup-head">
              <KeyRound size={18} />
              Generate your API key
            </div>
            <div className="land-field">
              <label htmlFor="signup-name">Your name</label>
              <input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required autoComplete="name" />
            </div>
            <div className="land-field">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="land-field">
              <label htmlFor="signup-pass">Password</label>
              <input id="signup-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required autoComplete="new-password" minLength={8} />
            </div>
            <div className="land-field">
              <label htmlFor="signup-portfolio">Portfolio name</label>
              <input id="signup-portfolio" value={portfolioName} onChange={(e) => setPortfolioName(e.target.value)} placeholder="My Portfolio" />
            </div>
            {error && <div className="land-form-error">{error}</div>}
            <button className="land-btn land-btn-primary land-btn-block" type="submit" disabled={loading}>
              {loading ? 'Generating…' : 'Generate my API key'}
            </button>
            <p className="land-signup-note">
              Free forever. Your portfolio, admin access and API key are created instantly.
            </p>
          </form>
        </div>
      </header>

      <section id="features" className="land-section">
        <div className="land-container">
          <h2 className="land-section-title">Everything you need to run <span className="land-gradient-text">a living portfolio</span></h2>
          <p className="land-section-sub">A headless CMS built for developers who want content control without losing design freedom.</p>
          <div className="land-features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div className="land-feature" key={title}>
                <div className="land-feature-icon"><Icon size={20} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="land-section land-section-alt">
        <div className="land-container">
          <h2 className="land-section-title">How it works</h2>
          <p className="land-section-sub">From signup to a live, always-current portfolio in three steps.</p>
          <div className="land-steps">
            {STEPS.map(({ icon: Icon, step, title, text }) => (
              <div className="land-step" key={step}>
                <div className="land-step-icon"><Icon size={22} /></div>
                <span className="land-step-num">{step}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="snippet" className="land-section">
        <div className="land-container">
          <h2 className="land-section-title">Integrate <span className="land-gradient-text">in one request</span></h2>
          <div className="land-snippet">
            <pre>{`// 1. Add to your build env (Vercel / Netlify / .env)
VITE_API_URL="https://your-api.onrender.com"
VITE_API_KEY="pk_your_generated_key"

// 2. Fetch your live portfolio from any frontend
const res = await fetch(\`\${import.meta.env.VITE_API_URL}/api/v1/portfolio\`, {
  headers: { Authorization: \`Bearer \${import.meta.env.VITE_API_KEY}\` },
});
const { data } = await res.json();
console.log(data.sections); // projects, skills, experience…`}</pre>
          </div>
        </div>
      </section>

      <footer className="land-footer">
        <div className="land-container land-footer-inner">
          <span className="land-brand">Portfolio CMS</span>
          <p>Headless portfolio content, driven by API keys.</p>
          <a href={ADMIN_URL} target="_blank" rel="noreferrer">Open the admin panel →</a>
        </div>
      </footer>

      {revealedKey && (
        <div className="land-modal-overlay" role="dialog" aria-modal="true">
          <div className="land-modal">
            <button type="button" className="land-modal-close" onClick={() => setRevealedKey(null)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="land-modal-icon"><CheckCircle2 size={22} /></div>
            <h3>Your API key is ready</h3>
            <p className="land-modal-message">
              This is the <strong>only time</strong> the full key is shown. Copy it now — you can revoke it later from the admin panel.
            </p>
            <div className="land-key-row">
              <code className="land-key">{revealedKey}</code>
              <button type="button" className="land-btn land-btn-ghost" onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="land-modal-actions">
              <button type="button" className="land-btn land-btn-ghost" onClick={() => setRevealedKey(null)}>
                I saved it
              </button>
              <a className="land-btn land-btn-primary" href={ADMIN_URL} target="_blank" rel="noreferrer">
                Open the admin panel <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}