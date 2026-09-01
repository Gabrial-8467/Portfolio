import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, MailIcon } from './Icons';

export default function SideRails({ site = {}, socials = [] }) {
  const email = site.email || 'gabrialdeora@gmail.com';

  const socialLinks = socials.length > 0 ? socials : [
    { label: 'GitHub', url: site.github || 'https://github.com/gabrialdeora' },
    { label: 'LinkedIn', url: site.linkedin || 'https://linkedin.com/in/gabrialdeora' },
    { label: 'Twitter', url: site.twitter || 'https://twitter.com' },
    { label: 'Instagram', url: site.instagram || 'https://instagram.com' },
  ];

  const getSocialIcon = (label = '') => {
    const l = label.toLowerCase();
    if (l.includes('github') || l.includes('git')) return <GithubIcon width="19" height="19" />;
    if (l.includes('linkedin')) return <LinkedinIcon width="19" height="19" />;
    if (l.includes('twitter') || l.includes('x')) return <TwitterIcon width="19" height="19" />;
    if (l.includes('instagram')) return <InstagramIcon width="19" height="19" />;
    return <MailIcon width="19" height="19" />;
  };

  return (
    <>
      {/* Left Social Rail */}
      <aside className="side-rail side-rail-left" aria-label="Social Links">
        <ul className="side-rail-list">
          {socialLinks.map((item, idx) => (
            <li key={item.label || idx} className="side-rail-item">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="side-rail-link"
                data-cursor="LINK"
                aria-label={item.label}
              >
                {getSocialIcon(item.label)}
              </a>
            </li>
          ))}
        </ul>
        <div className="side-rail-line" />
      </aside>

      {/* Right Email Rail */}
      <aside className="side-rail side-rail-right" aria-label="Email Contact">
        <div className="side-rail-email-wrap">
          <a
            href={`mailto:${email}`}
            className="side-rail-email-link"
            data-cursor="EMAIL"
          >
            {email}
          </a>
        </div>
        <div className="side-rail-line" />
      </aside>
    </>
  );
}
