// Mock exam player for Level 1. Questions are encrypted like the lessons and open with the buyer's access code, in this browser.
// Answers, confidence and results stay on this device. Scoring is Intellica practice scoring (see score.js).
import { parseCode, decryptLesson, CODE_KEY } from '/training/software-architecture-foundations/course/access.js';
import { scoreItem, answered, report, readiness } from './score.js';

const root = document.querySelector('[data-mock]');
const cfg = JSON.parse(root.dataset.cfg);
const $ = (s) => root.querySelector(s);
const el = (t, a = {}, ...kids) => { const n = document.createElement(t); for (const [k, v] of Object.entries(a)) { if (k === 'class') n.className = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v); } for (const k of kids.flat()) n.append(k instanceof Node ? k : document.createTextNode(k)); return n; };
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage may be blocked */ } } };
const RKEY = cfg.prefix + 'mock-results';
const results = () => { try { return JSON.parse(store.get(RKEY) || '{}'); } catch { return {}; } };

const code = parseCode(store.get(CODE_KEY) || '');
const show = (name) => { for (const n of ['gate', 'menu', 'exam', 'result']) { const e = $(`[data-${n}]`); if (e) e.hidden = n !== name; } };
const pct = (x) => Math.round(x * 100) + '%';
let timer = null;

if (!code) {
  $('[data-gate]').append(el('p', {}, 'The mock exams open with your access code. Enter it on '), el('a', { href: cfg.learn }, 'your course page'), '.');
  show('gate');
} else { menu(); }

function menu() {
  const list = $('[data-forms]'); list.textContent = '';
  const res = results();
  for (let i = 1; i <= cfg.forms; i++) {
    const r = res['mock-' + i];
    list.append(el('li', {}, el('strong', {}, `Paper ${i}`), ` · ${cfg.items} questions · `, r ? `last score ${pct(r.score)}` : 'not taken yet', ' ',
      el('button', { type: 'button', class: 'btn', onclick: () => start(i) }, r ? 'Take it again' : 'Start')));
  }
  const rd = readiness(res);
  $('[data-ready]').textContent = rd.ready ? 'Practice-ready by Intellica guidance: three different mocks at 80 percent or more with no chapter below 70 percent.' : `Not yet practice-ready. ${rd.qualifying} of ${cfg.ready.mocks} mocks meet the guidance so far (${rd.taken} taken).`;
  show('menu');
}

async function start(n) {
  const mode = $('[data-mode]').value, minutes = +$('[data-time]').value;
  let items;
  try { items = await decryptLesson(`${cfg.base}data/mock-${n}.json`, 'mock-' + n, code); } catch { $('[data-gate]').replaceChildren(el('p', {}, 'This access code does not open the mock exams. Check it on '), el('a', { href: cfg.learn }, 'your course page'), '.'); return show('gate'); }
  run({ n, items, mode, minutes });
}

function run({ n, items, mode, minutes }) {
  const answers = {}, flags = {}, conf = {}, shown = {};
  let i = 0, left = minutes * 60;
  const box = $('[data-exam]'); show('exam');
  const submit = () => { clearInterval(timer); finish(n, items, answers, conf, mode, minutes * 60 - left); };
  const draw = () => {
    box.textContent = '';
    const it = items[i];
    const head = el('div', { class: 'mock-head' },
      el('span', {}, `Question ${i + 1} of ${items.length}`), ' · ', el('span', {}, cfg.chapters[it.ch]),
      mode === 'exam' ? el('span', { class: 'mock-time', 'aria-live': 'off' }, ` · Time left ${fmt(left)}`) : '');
    const body = el('fieldset', { class: 'mock-q' }, el('legend', {}, it.stem));
    if (it.type === 'single') it.options.forEach((o, k) => body.append(el('label', { class: 'mock-opt' }, el('input', { type: 'radio', name: 'q', value: k, checked: answers[it.id] === k, onchange: () => { answers[it.id] = k; if (mode === 'practice') feedback(); } }), ' ', o)));
    if (it.type === 'multi') {
      body.append(el('p', { class: 'muted small' }, `Select ${it.pick}.`));
      it.options.forEach((o, k) => body.append(el('label', { class: 'mock-opt' }, el('input', { type: 'checkbox', value: k, checked: (answers[it.id] || []).includes(k), onchange: (e) => { const a = new Set(answers[it.id] || []); e.target.checked ? a.add(k) : a.delete(k); answers[it.id] = [...a].sort((x, y) => x - y); } }), ' ', o)));
    }
    if (it.type === 'classify') it.items.forEach((x, k) => body.append(el('div', { class: 'mock-opt' }, el('span', {}, x.t, ' '),
      ...it.cats.map((c, ci) => el('label', { class: 'mock-cat' }, el('input', { type: 'radio', name: 'c' + k, checked: (answers[it.id] || [])[k] === ci, onchange: () => { const a = answers[it.id] || []; a[k] = ci; answers[it.id] = a; } }), ' ', c)))));
    box.append(head, body);
    box.append(el('div', { class: 'mock-conf' }, 'How sure are you? ', ...['low', 'medium', 'high'].map((c) => el('label', {}, el('input', { type: 'radio', name: 'conf', value: c, checked: conf[it.id] === c, onchange: () => { conf[it.id] = c; } }), ' ', c, ' '))));
    if (mode === 'practice') {
      box.append(el('button', { type: 'button', class: 'btn', onclick: () => { shown[it.id] = true; feedback(); } }, 'Check this answer'));
      box.append(el('div', { 'data-fb': true, 'aria-live': 'polite' }));
      if (shown[it.id]) feedback();
    }
    box.append(el('div', { class: 'mock-nav' },
      el('button', { type: 'button', class: 'btn', disabled: i === 0, onclick: () => { i--; draw(); } }, 'Previous'), ' ',
      el('button', { type: 'button', class: 'btn', disabled: i === items.length - 1, onclick: () => { i++; draw(); } }, 'Next'), ' ',
      el('button', { type: 'button', class: 'btn', onclick: () => { flags[it.id] = !flags[it.id]; draw(); } }, flags[it.id] ? 'Remove flag' : 'Flag for review'), ' ',
      el('button', { type: 'button', class: 'btn', onclick: () => { const un = items.filter((x) => !answered(x, answers[x.id])).length; if (confirm(un ? `${un} question(s) are unanswered. Submit anyway?` : 'Submit your answers?')) submit(); } }, 'Submit')));
    box.append(el('p', { class: 'mock-map', role: 'navigation', 'aria-label': 'Question list' }, ...items.map((x, k) => el('button', { type: 'button', class: 'mock-dot', 'aria-label': `Question ${k + 1}: ${answered(x, answers[x.id]) ? 'answered' : 'unanswered'}${flags[x.id] ? ', flagged' : ''}${k === i ? ', current' : ''}`, onclick: () => { i = k; draw(); } }, String(k + 1) + (flags[x.id] ? '⚑' : answered(x, answers[x.id]) ? '✓' : '')))));
  };
  const feedback = () => {
    const it = items[i], fb = box.querySelector('[data-fb]'); if (!fb) return; fb.textContent = '';
    if (!answered(it, answers[it.id])) return fb.append(el('p', {}, 'Choose an answer first.'));
    const s = scoreItem(it, answers[it.id]);
    fb.append(el('p', {}, el('strong', {}, s >= 1 ? 'Correct. ' : s > 0 ? 'Partly correct. ' : 'Not correct. '), it.why));
  };
  draw();
  if (mode === 'exam') timer = setInterval(() => { left--; const t = box.querySelector('.mock-time'); if (t) t.textContent = ` · Time left ${fmt(left)}`; if (left <= 0) { alert('Time is up. Your answers are being submitted.'); submit(); } }, 1000);
}

const fmt = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

function finish(n, items, answers, conf, mode, used) {
  const r = report(items, answers, conf);
  const all = results();
  if (mode === 'exam') { all['mock-' + n] = { score: r.score, chapters: r.chapters, used, at: new Date().toISOString().slice(0, 10) }; store.set(RKEY, JSON.stringify(all)); }
  const box = $('[data-result]'); box.textContent = ''; show('result');
  box.append(el('h2', {}, `Paper ${n}: ${pct(r.score)}`), el('p', {}, `${r.points.toFixed(1)} of ${r.of} points in ${Math.round(used / 60)} minutes. `, mode === 'exam' ? 'Saved on this device.' : 'Practice mode results are not saved.'));
  box.append(el('h3', {}, 'By chapter'), el('table', { class: 'tbl' }, el('thead', {}, el('tr', {}, ...['Chapter', 'Score', 'Guide'].map((h) => el('th', {}, h)))),
    el('tbody', {}, ...Object.entries(r.chapters).map(([ch, c]) => el('tr', {}, el('td', {}, `${ch}. ${cfg.chapters[ch]}`), el('td', {}, pct(c.got / c.of)), el('td', {}, c.got / c.of >= cfg.ready.perChapter ? 'At or above 70%' : 'Below 70%: revise'))))));
  const weak = Object.entries(r.goals).filter(([, g]) => g.got / g.of < 0.7).map(([g]) => g);
  box.append(el('h3', {}, 'Learning goals to revise'), el('p', {}, weak.length ? weak.join(', ') + '. See the curriculum map to find the lessons.' : 'No goal below 70 percent in this paper.'), el('p', {}, el('a', { href: `${cfg.base}lab/map/` }, 'Open the curriculum map')));
  if (r.sureN || r.unsureN) box.append(el('h3', {}, 'Confidence'), el('p', {}, `When you were sure (${r.sureN}), you were right ${r.sureN ? pct(r.sureRight) : 'n/a'} of the time. When you were unsure (${r.unsureN}), you were right ${r.unsureN ? pct(r.unsureRight) : 'n/a'}. Sure and wrong answers show the topics to revise first.`));
  box.append(el('h3', {}, 'Review your answers'));
  const wrongs = items.filter((it) => scoreItem(it, answers[it.id]) < 1);
  box.append(wrongs.length ? el('ol', {}, ...wrongs.map((it) => el('li', {}, el('strong', {}, it.stem), ' ', el('em', {}, it.type === 'classify' ? '' : 'Correct: ' + [].concat(it.key).map((k) => it.options[k]).join('; ')), ' ', it.why))) : el('p', {}, 'Every answer was fully correct.'));
  const rd = readiness(all);
  box.append(el('p', { role: 'status' }, rd.ready ? 'Practice-ready by Intellica guidance. This is not an external result and not a guarantee.' : `Practice-ready guidance: ${rd.qualifying} of ${cfg.ready.mocks} mocks so far.`), el('button', { type: 'button', class: 'btn', onclick: () => menu() }, 'Back to the papers'));
}
