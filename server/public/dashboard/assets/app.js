// Portfolio Admin Dashboard  —  vanilla JS

const API = '/api';

const state = {
  view: 'projects',
  data: {},        // raw fetched data per collection
  settings: null,  // { site, socials, nav, stats, processSteps }
  editing: null,   // item being edited, or null for "new"
};

// --- Field definitions per collection ------------------------------------
const COLLECTIONS = {
  projects: {
    singular: 'Project',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'meta', label: 'Meta / date', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'link', label: 'Link', type: 'text' },
      { key: 'tags', label: 'Tags (comma separated)', type: 'tags' },
    ],
    card: (p) => ({
      title: p.name,
      sub: p.meta,
      footer: (p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join(''),
    }),
  },
  skills: {
    singular: 'Skill Group',
    fields: [
      { key: 'category', label: 'Category', type: 'text', required: true },
      { key: 'items', label: 'Skills (comma separated)', type: 'tags' },
    ],
    card: (s) => ({ title: s.category, sub: (s.items || []).join(' · ') }),
  },
  services: {
    singular: 'Service',
    fields: [
      { key: 'num', label: 'Number', type: 'text', required: true },
      { key: 'name', label: 'Name', type: 'text', required: true },
    ],
    card: (s) => ({ title: `${s.num} — ${s.name}` }),
  },
  experience: {
    singular: 'Experience Entry',
    fields: [
      { key: 'period', label: 'Period', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text', required: true },
      { key: 'company', label: 'Company', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'points', label: 'Bullet points (one per line)', type: 'points' },
    ],
    card: (e) => ({ title: e.role, sub: `${e.company} — ${e.period}` }),
  },
  education: {
    singular: 'Education Entry',
    fields: [
      { key: 'period', label: 'Period', type: 'text', required: true },
      { key: 'degree', label: 'Degree', type: 'text', required: true },
      { key: 'institution', label: 'Institution', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text' },
    ],
    card: (e) => ({ title: e.degree, sub: `${e.institution} — ${e.period}` }),
  },
  achievements: {
    singular: 'Achievement',
    fields: [
      { key: 'event', label: 'Event', type: 'text', required: true },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'org', label: 'Organisation', type: 'text' },
    ],
    card: (a) => ({ title: a.event, sub: a.org ? `${a.org} · ${a.year}` : a.year }),
  },
};

// KV (settings) collection definitions
const KV_SETS = {
  socials: { title: 'Social Links', fields: ['key', 'label', 'href'], desc: 'key: linkedin | github | portfolio, plus label and href' },
  nav: { title: 'Navigation', fields: ['label', 'href'], desc: 'label and href (e.g. #about)' },
  stats: { title: 'Stats', fields: ['label', 'value', 'subtext'], desc: 'label, value, subtext' },
  processSteps: { title: 'Process Steps', fields: ['text', 'variant'], desc: 'text (use "arrow" for the arrow pill), variant: grey | blue | black' },
};

const $ = (sel) => document.querySelector(sel);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"'`]/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
  }[c] || c));

function banner(msg, type = 'success') {
  const el = $('#banner');
  el.className = `banner ${type}`;
  el.textContent = msg;
  setTimeout(() => { el.textContent = ''; el.className = ''; }, 3000);
}

// --- API helpers -----------------------------------------------------------
async function req(url, opts = {}) {
  const res = await fetch(url, { credentials: 'include', ...opts });
  if (res.status === 401 && state.view !== 'noop') {
    window.location.href = '/dashboard/login';
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function itemId(view, item) {
  const idField = view === 'skills' ? 'category' : view === 'services' ? 'num' : 'id';
  return encodeURIComponent(item[idField]);
}

// --- Views -----------------------------------------------------------------
async function loadView() {
  $('#settings').innerHTML = '';
  if (state.view === 'site') {
    await renderSettings();
    return;
  }
  const list = await req(`${API}/${state.view}`);
  state.data[state.view] = list;
  renderList();
}

function renderList() {
  const view = state.view;
  const def = COLLECTIONS[view];
  const list = state.data[view] || [];
  const search = ($('#search').value || '').toLowerCase();
  const filtered = search ? list.filter((it) => JSON.stringify(it).toLowerCase().includes(search)) : list;

  $('#panel-title').textContent = def.singular + 's';
  $('#add-btn').hidden = false;
  $('#toolbar').hidden = false;

  const el = $('#list');
  if (!filtered.length) {
    el.innerHTML = `<div class="empty">${search ? 'No matches' : 'Nothing here yet. Click "Add New".'}</div>`;
    return;
  }
  el.innerHTML = filtered
    .map((item, i) => {
      const card = def.card(item);
      return `<div class="card">
        <h3>${esc(card.title)}</h3>
        ${card.sub ? `<div class="sub">${esc(card.sub)}</div>` : ''}
        ${card.footer || ''}
        <div class="actions">
          <button data-action="edit" data-view="${view}" data-idx="${i}">Edit</button>
          <button class="danger" data-action="delete" data-view="${view}" data-idx="${i}">Delete</button>
        </div>
      </div>`;
    })
    .join('');
}

$('#search').addEventListener('input', renderList);

// --- Modal form ------------------------------------------------------------
function openModal(item) {
  const view = state.view;
  const def = COLLECTIONS[view];
  state.editing = item;

  $('#modal-title').textContent = item ? `Edit ${def.singular}` : `Add ${def.singular}`;
  $('#modal-body').innerHTML = def.fields.map((f) => fieldHtml(f, item ? item[f.key] : undefined)).join('');
  $('#modal').classList.add('open');
}

function fieldHtml(f, val) {
  const current = val === undefined ? '' : val;
  let input;
  if (f.type === 'textarea') {
    input = `<textarea id="f-${f.key}">${esc(current)}</textarea>`;
  } else if (f.type === 'tags') {
    input = `<input id="f-${f.key}" value="${esc(Array.isArray(current) ? current.join(', ') : current)}" />`;
  } else if (f.type === 'points') {
    input = `<textarea id="f-${f.key}">${esc(Array.isArray(current) ? current.join('\n') : current)}</textarea>`;
  } else {
    input = `<input id="f-${f.key}" value="${esc(current)}" ${f.required ? 'required' : ''} />`;
  }
  return `<div class="form-row"><label>${f.label}</label>${input}</div>`;
}

function readForm(def) {
  const out = {};
  for (const f of def.fields) {
    const raw = $(`#f-${f.key}`).value.trim();
    if (f.type === 'tags') out[f.key] = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
    else if (f.type === 'points') out[f.key] = raw ? raw.split('\n').map((s) => s.trim()).filter(Boolean) : [];
    else out[f.key] = raw;
  }
  return out;
}

$('#add-btn').addEventListener('click', () => openModal(null));
$('#modal-cancel').addEventListener('click', () => { $('#modal').classList.remove('open'); });

$('#modal-save').addEventListener('click', async () => {
  const view = state.view;
  const def = COLLECTIONS[view];
  const payload = readForm(def);

  for (const f of def.fields) {
    if (f.required && !payload[f.key]) {
      banner(`${f.label} is required`, 'error');
      return;
    }
  }

  try {
    if (state.editing) {
      await req(`${API}/${view}/${itemId(view, state.editing)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      banner(`${def.singular} updated`);
    } else {
      await req(`${API}/${view}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      banner(`${def.singular} added`);
    }
    $('#modal').classList.remove('open');
    await loadView();
  } catch (e) {
    banner(e.message, 'error');
  }
});

// --- List delegation --------------------------------------------------------
$('#list').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, view, idx } = btn.dataset;
  const item = state.data[view][idx];

  if (action === 'edit') {
    openModal(item);
    return;
  }
  if (action === 'delete') {
    if (!confirm(`Delete this ${COLLECTIONS[view].singular.toLowerCase()}?`)) return;
    try {
      await req(`${API}/${view}/${itemId(view, item)}`, { method: 'DELETE' });
      banner(`${COLLECTIONS[view].singular} deleted`);
      await loadView();
    } catch (err) {
      banner(err.message, 'error');
    }
  }
});

// --- Sidebar navigation ------------------------------------------------------
$('#sidebar').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  $('.tab.active')?.classList.remove('active');
  tab.classList.add('active');
  state.view = tab.dataset.view;
  $('#search').value = '';
  loadView();
});

// --- Settings view ------------------------------------------------------------
const SITE_FIELDS = [
  { key: 'name', label: 'Full Name', hint: 'Displayed in header logo and footer' },
  { key: 'heroBadge', label: 'Hero Badge', hint: 'e.g. Full Stack' },
  { key: 'heroTitle', label: 'Hero Title', hint: 'Main hero heading' },
  { key: 'heroBgText', label: 'Hero Background Text', hint: 'Large background watermark word (e.g. Developer)' },
  { key: 'heroBio', label: 'Hero Bio Intro', textarea: true, hint: 'Intro paragraph under hero badge' },
  { key: 'avatarUrl', label: 'Hero Graphic/Avatar URL', hint: 'e.g. /hero.png or full https:// image URL' },
  { key: 'aboutTitle', label: 'About Section Title', hint: 'Heading for the About section' },
  { key: 'aboutDesc1', label: 'About Description (Paragraph 1)', textarea: true },
  { key: 'aboutDesc2', label: 'About Description (Paragraph 2)', textarea: true },
  { key: 'bio', label: 'Footer Bio Summary', textarea: true },
  { key: 'github', label: 'GitHub Profile URL' },
  { key: 'email', label: 'Contact Email' },
  { key: 'emailHref', label: 'Email Href (mailto:...)' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'phoneHref', label: 'Phone Href (tel:...)' },
  { key: 'copyright', label: 'Copyright Notice' },
];

async function renderSettings() {
  $('#panel-title').textContent = 'Settings';
  $('#add-btn').hidden = true;
  $('#toolbar').hidden = true;
  $('#list').innerHTML = '';

  const s = await req(`${API}/site`);
  state.settings = s;

  $('#settings').innerHTML = `
    <div class="card settings-card" style="margin-bottom:16px">
      <h3>Site Details</h3>
      <div class="sub">Basic site info shown across the portfolio</div>
      ${SITE_FIELDS.map((f) => `
        <div class="form-row">
          <label>${f.label}</label>
          ${f.textarea ? `<textarea id="st-${f.key}">${esc(s.site?.[f.key] ?? '')}</textarea>` : `<input id="st-${f.key}" value="${esc(s.site?.[f.key] ?? '')}" />`}
          ${f.hint ? `<div class="hint">${f.hint}</div>` : ''}
        </div>`).join('')}
      <div class="actions">
        <button class="primary" id="settings-site-save">Save Site Details</button>
      </div>
    </div>
    ${Object.keys(KV_SETS).map((key) => kvCard(key)).join('')}
  `;

  $('#settings-site-save').addEventListener('click', saveSite);
  Object.keys(KV_SETS).forEach((key) => {
    document.querySelector(`[data-settings-add="${key}"]`).addEventListener('click', () => addKvRow(key));
    document.querySelector(`[data-settings-save="${key}"]`).addEventListener('click', () => saveKv(key));
  });
}

function kvCard(key) {
  const def = KV_SETS[key];
  const rows = (state.settings[key] || []).map((item, i) => kvRow(key, item, i)).join('');
  return `<div class="card settings-card" style="margin-bottom:16px">
    <h3>${def.title}</h3>
    <div class="sub">${def.desc}</div>
    <div class="kv-list" data-key="${key}">${rows}</div>
    <div class="actions">
      <button data-settings-add="${key}">Add item</button>
      <button data-settings-save="${key}" class="primary">Save ${def.title}</button>
    </div>
  </div>`;
}

function kvRow(key, item, i) {
  const fields = KV_SETS[key].fields;
  return `<div class="kv-item has-${fields.length}">
    ${fields.map((f) => `<input data-kv="${f}" value="${esc(item[f])}" placeholder="${f}" />`).join('')}
    <button class="remove" data-remove title="Remove">×</button>
  </div>`;
}

function addKvRow(key) {
  const fields = KV_SETS[key].fields;
  const listEl = document.querySelector(`.kv-list[data-key="${key}"]`);
  listEl.insertAdjacentHTML('beforeend',
    `<div class="kv-item has-${fields.length}">
      ${fields.map((f) => `<input data-kv="${f}" placeholder="${f}" />`).join('')}
      <button class="remove" data-remove title="Remove">×</button>
    </div>`);
}

async function saveKv(key) {
  const rows = [...document.querySelectorAll(`.kv-list[data-key="${key}"] .kv-item`)];
  const value = rows.map((row) => {
    const obj = {};
    row.querySelectorAll('[data-kv]').forEach((inp) => { obj[inp.dataset.kv] = inp.value.trim(); });
    return obj;
  });
  try {
    await req(`${API}/site/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
    state.settings[key] = value;
    banner(`${key} saved`);
  } catch (err) {
    banner(err.message, 'error');
  }
}

async function saveSite() {
  const payload = {};
  SITE_FIELDS.forEach((f) => { payload[f.key] = $(`#st-${f.key}`).value.trim(); });
  try {
    await req(`${API}/site/site`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    banner('Site details saved');
  } catch (err) {
    banner(err.message, 'error');
  }
}

// Handle KV row removal (delegated)
document.addEventListener('click', (e) => {
  const rm = e.target.closest('[data-remove]');
  if (rm) rm.closest('.kv-item').remove();
});

// --- Logout --------------------------------------------------------------------
$('#logout').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/dashboard/login';
});

// --- Boot -----------------------------------------------------------------------
(async function init() {
  $('.tab')?.classList.add('active');
  await loadView();
})();
