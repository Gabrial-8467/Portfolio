export const SECTION_SCHEMAS = {
  site: {
    kind: 'object',
    title: 'Site & About',
    description: 'Your name, hero, avatar and about-me content. Nav & footer links are managed here too.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', placeholder: 'Your full name', required: true },
      { name: 'heroBadge', label: 'Hero badge', type: 'text', placeholder: 'e.g. Open to internship opportunities' },
      { name: 'heroTitle', label: 'Hero title', type: 'textarea', placeholder: 'A short tagline' },
      { name: 'heroBgText', label: 'Hero background text', type: 'text' },
      { name: 'heroBio', label: 'Hero bio', type: 'textarea' },
      { name: 'avatarUrl', label: 'Avatar image URL', type: 'image' },
      { name: 'aboutTitle', label: 'About title', type: 'text' },
      { name: 'aboutDesc1', label: 'About paragraph 1', type: 'textarea' },
      { name: 'aboutDesc2', label: 'About paragraph 2', type: 'textarea' },
      { name: 'bio', label: 'Short bio', type: 'textarea' },
      { name: 'phone', label: 'Phone (display)', type: 'text' },
      { name: 'phoneHref', label: 'Phone link', type: 'text' },
      { name: 'email', label: 'Email', type: 'text', placeholder: 'you@example.com' },
      { name: 'emailHref', label: 'Email link', type: 'text' },
      { name: 'github', label: 'GitHub URL', type: 'url' },
      { name: 'copyright', label: 'Footer copyright text', type: 'text' },
    ],
    lists: [
      { name: 'navLinks', label: 'Navbar links', fields: [
        { name: 'label', label: 'Label', type: 'text' },
        { name: 'href', label: 'Href', type: 'text', placeholder: '#about' },
      ] },
      { name: 'footerNav', label: 'Footer links', fields: [
        { name: 'label', label: 'Label', type: 'text' },
        { name: 'href', label: 'Href', type: 'text' },
      ] },
    ],
  },
  projects: {
    kind: 'list',
    title: 'Projects',
    description: 'Cards shown on the homepage. Add a screenshot URL to use it as the project image.',
    fields: [
      { name: 'image', label: 'Image URL', type: 'image' },
      { name: 'meta', label: 'Meta (stack / date)', type: 'text' },
      { name: 'name', label: 'Project name', type: 'text', required: true },
      { name: 'desc', label: 'Description', type: 'textarea' },
      { name: 'link', label: 'Project link', type: 'url' },
      { name: 'tags', label: 'Tags', type: 'tags' },
    ],
  },
  experience: {
    kind: 'list',
    title: 'Work Experience',
    fields: [
      { name: 'period', label: 'Period', type: 'text', placeholder: 'Jan 2026 — Present' },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'points', label: 'Achievements / bullet points', type: 'strings' },
    ],
  },
  education: {
    kind: 'list',
    title: 'Education',
    fields: [
      { name: 'period', label: 'Period', type: 'text' },
      { name: 'degree', label: 'Degree / course', type: 'text', required: true },
      { name: 'institution', label: 'Institution', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
    ],
  },
  skills: {
    kind: 'list',
    title: 'Skills',
    fields: [
      { name: 'category', label: 'Category', type: 'text', placeholder: 'Frontend', required: true },
      { name: 'items', label: 'Skills', type: 'tags' },
    ],
  },
  services: {
    kind: 'list',
    title: 'Services',
    fields: [
      { name: 'num', label: 'Number', type: 'text', placeholder: '01' },
      { name: 'name', label: 'Service name', type: 'text', required: true },
    ],
  },
  socials: {
    kind: 'list',
    title: 'Social Links',
    fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'href', label: 'URL', type: 'url' },
      { name: 'key', label: 'Key (for icon)', type: 'text', hint: 'Used to pick the brand icon in the footer.' },
    ],
  },
  stats: {
    kind: 'list',
    title: 'Stats',
    fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'value', label: 'Value', type: 'text' },
      { name: 'subtext', label: 'Subtext', type: 'text' },
    ],
  },
  processSteps: {
    kind: 'list',
    title: 'Process Steps',
    fields: [
      { name: 'text', label: 'Text', type: 'text' },
      { name: 'variant', label: 'Variant', type: 'select', options: ['grey', 'blue', 'black', 'arrow'] },
    ],
  },
  achievements: {
    kind: 'list',
    title: 'Achievements',
    fields: [
      { name: 'event', label: 'Event', type: 'text', required: true },
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'org', label: 'Organisation', type: 'text' },
    ],
  },
};

export function getSchemaForKey(key) {
  if (key === 'site') return SECTION_SCHEMAS.site;
  return SECTION_SCHEMAS[key] || null;
}

export function blankItem(schema) {
  const item = {};
  for (const field of schema.fields) {
    if (field.type === 'tags' || field.type === 'strings') item[field.name] = [];
    else if (field.type === 'boolean') item[field.name] = false;
    else if (field.type === 'select') item[field.name] = field.options?.[0] || '';
  }
  return item;
}