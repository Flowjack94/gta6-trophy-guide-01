// Leonida Platinum — offline GTA VI trophy guide & tracker.
// State lives only in this browser (localStorage); the app makes zero network
// requests beyond loading its own data file. Written for this entry, in this session.
const KEY = 'leonida-platinum-progress-v1';
const SPOILER_KEY = 'leonida-platinum-spoilers-v1';

const listEl = document.getElementById('trophyList');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const gradeCountsEl = document.getElementById('gradeCounts');
const resultCountEl = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const saveNote = document.getElementById('saveNote');
const searchInput = document.getElementById('search');
const gradeFilter = document.getElementById('gradeFilter');
const kindFilter = document.getElementById('kindFilter');
const statusFilter = document.getElementById('statusFilter');
const missableOnly = document.getElementById('missableOnly');
const spoilerToggle = document.getElementById('spoilerToggle');

let trophies = [];
let earned = new Set();
let openGuides = new Set();

function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    const ids = Array.isArray(raw) ? raw : raw.earned ?? [];
    earned = new Set(ids.filter((n) => Number.isInteger(n)));
  } catch {
    earned = new Set();
  }
}

function save(note) {
  localStorage.setItem(KEY, JSON.stringify({ version: 1, earned: [...earned].sort((a, b) => a - b) }));
  if (note) {
    saveNote.textContent = note;
    setTimeout(() => { saveNote.textContent = ''; }, 2500);
  }
}

function spoilerOn() {
  return spoilerToggle.checked;
}

function isSpoilerHidden(t) {
  return t.hidden && spoilerOn() && !earned.has(t.id);
}

function gradeLabel(g) {
  return g[0].toUpperCase() + g.slice(1);
}

function trophyCard(t) {
  const hidden = isSpoilerHidden(t);
  const card = document.createElement('article');
  card.className = 'trophy' + (earned.has(t.id) ? ' earned' : '') + (t.missable ? ' missable-card' : '');
  card.id = 'trophy-' + t.id;

  const head = document.createElement('div');
  head.className = 'trophy-head';

  const check = document.createElement('label');
  check.className = 'trophy-check';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', 'Mark ' + (hidden ? 'hidden trophy ' + t.id : t.name) + ' as earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    save('Progress saved.');
    render();
  });
  check.append(box, document.createTextNode(earned.has(t.id) ? 'Earned' : 'Earn it'));
  head.append(check);

  const title = document.createElement('div');
  title.className = 'trophy-title';
  const h3 = document.createElement('h3');
  const no = document.createElement('span');
  no.className = 'trophy-no';
  no.textContent = '#' + t.id;
  h3.append(no, document.createTextNode(hidden ? 'Hidden Trophy' : t.name));
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = hidden ? 'A hidden story trophy — earn it (or turn spoilers on) to reveal its name and description.' : t.description;
  title.append(h3, desc);

  const badges = document.createElement('div');
  badges.className = 'badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = 'badge ' + t.grade;
  gradeBadge.textContent = gradeLabel(t.grade);
  badges.append(gradeBadge);
  if (!hidden) {
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind';
    kindBadge.textContent = t.kind;
    badges.append(kindBadge);
  }
  if (t.hidden) {
    const hb = document.createElement('span');
    hb.className = 'badge hidden-badge';
    hb.textContent = 'Hidden';
    badges.append(hb);
  }
  if (t.missable) {
    const mb = document.createElement('span');
    mb.className = 'badge missable-badge';
    mb.textContent = 'Missable';
    badges.append(mb);
  }
  title.append(badges);
  head.append(title);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'details-btn';
  btn.textContent = openGuides.has(t.id) ? 'Hide guide' : 'Show guide';
  btn.addEventListener('click', () => {
    if (openGuides.has(t.id)) openGuides.delete(t.id); else openGuides.add(t.id);
    render();
  });
  head.append(btn);
  card.append(head);

  if (openGuides.has(t.id)) {
    const guide = document.createElement('div');
    guide.className = 'trophy-guide';
    if (hidden) {
      const p = document.createElement('p');
      p.textContent = 'This trophy is hidden until you earn it — turn off "Hide spoilers" above to see its guide, or tick it as earned once it pops on your PS5.';
      guide.append(p);
    } else {
      const p = document.createElement('p');
      p.textContent = t.guide;
      guide.append(p);
      const note = document.createElement('p');
      note.className = 'missable-note' + (t.missable ? '' : ' ok');
      note.textContent = t.missable ? t.missableNote : 'Missable? ' + t.missableNote;
      guide.append(note);
    }
    card.append(guide);
  }
  return card;
}

function matches(t) {
  if (gradeFilter.value !== 'all' && t.grade !== gradeFilter.value) return false;
  if (kindFilter.value !== 'all' && t.kind !== kindFilter.value) return false;
  if (statusFilter.value === 'earned' && !earned.has(t.id)) return false;
  if (statusFilter.value === 'unearned' && earned.has(t.id)) return false;
  if (missableOnly.checked && !t.missable) return false;
  const q = searchInput.value.trim().toLowerCase();
  if (q) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.kind).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function render() {
  const shown = trophies.filter(matches);
  listEl.replaceChildren(...shown.map(trophyCard));
  emptyState.hidden = shown.length !== 0;
  const total = trophies.length;
  const done = earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = pct + '%';
  progressText.textContent = done + ' of ' + total + ' earned — ' + pct + '%';
  const perGrade = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const inGrade = trophies.filter((t) => t.grade === g);
    const got = inGrade.filter((t) => earned.has(t.id)).length;
    return gradeLabel(g) + ' ' + got + '/' + inGrade.length;
  }).join(' · ');
  gradeCountsEl.textContent = perGrade;
  resultCountEl.textContent = shown.length === total
    ? 'Showing all ' + total + ' trophies.'
    : 'Showing ' + shown.length + ' of ' + total + ' trophies.';
}

// Tabs
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    for (const t of document.querySelectorAll('.tab')) t.classList.toggle('active', t === tab);
    for (const view of document.querySelectorAll('.view')) view.hidden = view.id !== 'view-' + tab.dataset.view;
  });
}

// Export / import / reset
document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', version: 1, exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  saveNote.textContent = 'Progress exported.';
});

document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const raw = JSON.parse(await file.text());
    const ids = Array.isArray(raw) ? raw : raw.earned ?? [];
    const valid = new Set(trophies.map((t) => t.id));
    const next = new Set(ids.filter((n) => Number.isInteger(n) && valid.has(n)));
    earned = next;
    save('Progress imported: ' + earned.size + ' trophies earned.');
    render();
  } catch {
    saveNote.textContent = 'Import failed — that file is not a valid progress export.';
  }
  e.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all progress? This clears every earned tick in this browser.')) {
    earned = new Set();
    save('Progress reset.');
    render();
  }
});

// Filters
for (const el of [searchInput, gradeFilter, kindFilter, statusFilter, missableOnly, spoilerToggle]) {
  el.addEventListener(el === searchInput ? 'input' : 'change', render);
}
spoilerToggle.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilerToggle.checked));
});

async function init() {
  loadEarned();
  const storedSpoiler = localStorage.getItem(SPOILER_KEY);
  if (storedSpoiler !== null) spoilerToggle.checked = JSON.parse(storedSpoiler);
  const doc = await (await fetch('data/trophies.json')).json();
  trophies = doc.trophies;
  render();
}

init();
