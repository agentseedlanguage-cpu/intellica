// Validates the Level 1 (Foundations) source files. Usage: node tools/validate-foundations.mjs [lessons|bank|all]
// Also imported by the course builder and the tests.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('training-private/foundations');
export const MAP = JSON.parse(fs.readFileSync(path.join(DIR, 'curriculum-map.json'), 'utf8'));
const LG = new Map(MAP.goals.map((g) => [g.id, g]));
const words = (s) => (String(s).match(/\S+/g) || []).length;
const str = (x, min = 1) => typeof x === 'string' && x.trim().length >= min;

export function validateLessons(lessons) {
  const errs = [];
  const e = (n, m) => errs.push(`lesson ${n}: ${m}`);
  const seen = new Set();
  for (const l of lessons) {
    const n = l.n;
    if (seen.has(n)) e(n, 'duplicate number'); seen.add(n);
    if (l.title !== MAP.lessons[n]) e(n, `title must be exactly "${MAP.lessons[n]}"`);
    if (words(l.lead) < 20) e(n, 'lead too short');
    if (!Array.isArray(l.slides) || l.slides.length !== 8) e(n, `needs exactly 8 slides, has ${l.slides && l.slides.length}`);
    (l.slides || []).forEach((s, i) => {
      if (!Array.isArray(s) || s.length !== 6 || !s.every((x) => str(x))) return e(n, `slide ${i + 1} must be [title, objective, principle, evidence, response, check], all non-empty strings`);
      if (words(s[2]) < 8 || words(s[3]) < 20 || words(s[4]) < 8) e(n, `slide ${i + 1} ("${s[0]}") is too thin (principle 8+, evidence 20+, response 8+ words)`);
    });
    if (!Array.isArray(l.guide) || l.guide.length < 2 || l.guide.some((p) => words(p) < 40)) e(n, 'guide needs 2+ paragraphs of 40+ words');
    if (!str(l.case) || words(l.case) < 60) e(n, 'case needs 60+ words');
    const lab = l.lab || {};
    if (!str(lab.title) || words(lab.intro) < 15 || !Array.isArray(lab.tasks) || lab.tasks.length < 4 || lab.tasks.length > 6 || lab.tasks.some((t) => words(t) < 8)) e(n, 'lab needs title, intro (15+ words), 4-6 tasks of 8+ words');
    if (!str(lab.evidence) || words(lab.model) < 80) e(n, 'lab needs evidence and a model solution of 80+ words');
    if (!Array.isArray(l.rubric) || l.rubric.length !== 4 || l.rubric.some((r) => r.length !== 4 || !r.every((x) => str(x)))) e(n, 'rubric needs 4 rows of [criterion, missing, partial, competent]');
    if (!Array.isArray(l.quiz) || l.quiz.length !== 5) e(n, `needs exactly 5 recall questions, has ${l.quiz && l.quiz.length}`);
    const keys = [];
    (l.quiz || []).forEach((q, i) => {
      if (!Array.isArray(q) || q.length !== 4 || !str(q[0]) || !Array.isArray(q[1]) || q[1].length !== 4 || !q[1].every((x) => str(x)) || !Number.isInteger(q[2]) || q[2] < 0 || q[2] > 3 || words(q[3]) < 8) return e(n, `quiz ${i + 1} must be [question, 4 options, answer index 0-3, explanation of 8+ words]`);
      keys.push(q[2]);
    });
    if (keys.length === 5 && new Set(keys).size < 3) e(n, 'quiz answers sit in too few positions; spread them across at least 3 of the 4 slots');
    if (!Array.isArray(l.sources) || l.sources.length < 2) e(n, 'needs 2+ sources');
  }
  for (const n of Object.keys(MAP.lessons)) if (!seen.has(+n)) errs.push(`lesson ${n}: missing`);
  return errs;
}

export function validateBank(items) {
  const errs = [];
  const ids = new Set(), stems = new Map();
  const T = ['single', 'multi', 'classify'];
  for (const it of items) {
    const id = it.id || '(no id)';
    const e = (m) => errs.push(`${id}: ${m}`);
    if (!/^F-C0[1-5]-\d{3}$/.test(id)) e('id must look like F-C03-017');
    if (ids.has(id)) e('duplicate id'); ids.add(id);
    if (!T.includes(it.type)) e('type must be single, multi or classify');
    if (!Number.isInteger(it.ch) || it.ch < 1 || it.ch > 5 || !id.startsWith(`F-C0${it.ch}-`)) e('ch must be 1 to 5 and match the id');
    if (!Array.isArray(it.lg) || !it.lg.length || it.lg.some((g) => !LG.has(g) || LG.get(g).ch !== it.ch)) e('lg must list goal ids that exist in curriculum-map.json and belong to this chapter');
    const rs = it.lg && it.lg.map((g) => LG.get(g) && LG.get(g).r).join(' ');
    if (rs && /^R3$/.test(rs.trim()) ) e('items must test R1 or R2 goals; R3 goals are not examined');
    if (!['recall', 'understand', 'apply'].includes(it.cog)) e('cog must be recall, understand or apply');
    if (![1, 2, 3].includes(it.diff)) e('diff must be 1, 2 or 3');
    if (words(it.stem) < 5) e('stem too short');
    if (words(it.why) < 10) e('why (explanation) needs 10+ words');
    const k = it.stem && it.stem.toLowerCase().replace(/\W+/g, ' ').trim();
    if (stems.has(k)) e(`duplicate stem of ${stems.get(k)}`); else stems.set(k, id);
    if (it.type === 'single' || it.type === 'multi') {
      if (!Array.isArray(it.options) || it.options.length < 4 || it.options.length > 6 || !it.options.every((o) => str(o))) e('needs 4 to 6 options');
      if (new Set(it.options || []).size !== (it.options || []).length) e('duplicate options');
      if (!Array.isArray(it.wrong) || it.wrong.length !== (it.options || []).length) e('wrong[] must have one entry per option ("" for correct ones, a one-line misconception for wrong ones)');
      else (it.options || []).forEach((_, i) => { const right = it.type === 'single' ? it.key === i : (it.key || []).includes(i); if (!right && !str(it.wrong[i], 6)) e(`wrong[${i}] needs a misconception note`); });
    }
    if (it.type === 'single' && !(Number.isInteger(it.key) && it.key >= 0 && it.key < (it.options || []).length)) e('single: key must be an option index');
    if (it.type === 'multi') {
      if (!Array.isArray(it.key) || it.key.length < 2 || it.key.some((i) => !Number.isInteger(i) || i < 0 || i >= (it.options || []).length) || new Set(it.key).size !== it.key.length) e('multi: key must list 2+ distinct option indexes');
      if (it.pick !== (it.key || []).length) e('multi: pick must equal the number of correct options, and the stem must say how many to choose');
      if (!/\b(two|three|2|3|four|4)\b/i.test(it.stem || '')) e('multi: stem must say how many to select');
    }
    if (it.type === 'classify') {
      if (!Array.isArray(it.cats) || it.cats.length !== 2 || !it.cats.every((c) => str(c))) e('classify: cats must be two labels');
      if (!Array.isArray(it.items) || it.items.length < 4 || it.items.length > 6 || it.items.some((x) => !str(x.t) || ![0, 1].includes(x.c))) e('classify: needs 4 to 6 items of {t, c: 0|1}');
      else if (new Set(it.items.map((x) => x.c)).size < 2) e('classify: both categories must be used');
    }
  }
  return errs;
}

export function bankStats(items) {
  const by = (f) => items.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
  const pos = by((x) => x.type === 'single' ? 'p' + x.key : 'other');
  return { total: items.length, byChapter: by((x) => x.ch), byType: by((x) => x.type), byCog: by((x) => x.cog), byDiff: by((x) => x.diff), singleKeyPositions: pos };
}

// Authors write options in any order; the loader rotates them so correct answers do not cluster. Rotation keeps every option, so meaning is unchanged.
const rot = (a, k) => a.map((_, i) => a[(i - k + a.length) % a.length]);
export function spreadLesson(l) {
  return { ...l, quiz: l.quiz.map((q, i) => { const target = (l.n * 2 + i * 3 + 1) % 4; const k = (target - q[2] + 4) % 4; return [q[0], rot(q[1], k), target, q[3]]; }) };
}
export function spreadItem(it, idx) {
  if (it.type === 'classify') return it;
  const n = it.options.length, k = (idx * 3 + 1) % n;
  const move = (i) => (i + k) % n;
  return { ...it, options: rot(it.options, k), wrong: rot(it.wrong, k), key: it.type === 'single' ? move(it.key) : it.key.map(move).sort((a, b) => a - b) };
}
export async function loadLessons() {
  const fs2 = fs.readdirSync(DIR).filter((f) => /^lessons-\d+\.mjs$/.test(f)).sort();
  const out = [];
  for (const f of fs2) out.push(...(await import(path.join(DIR, f))).default);
  return out.sort((a, b) => a.n - b.n).map(spreadLesson);
}
export async function loadBank() {
  const fs2 = fs.readdirSync(DIR).filter((f) => /^bank-c\d.*\.mjs$/.test(f)).sort();
  const out = [];
  for (const f of fs2) out.push(...(await import(path.join(DIR, f))).default);
  return out.map(spreadItem);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop())) {
  const what = process.argv[2] || 'all';
  let bad = 0;
  if (what === 'lessons' || what === 'all') { const L = await loadLessons(); const e = validateLessons(L); console.log(`lessons: ${L.length} found, ${e.length} problem(s)`); e.forEach((x) => console.log(' - ' + x)); bad += e.length; }
  if (what === 'bank' || what === 'all') { const B = await loadBank(); const e = validateBank(B); console.log('bank:', JSON.stringify(bankStats(B))); console.log(`bank: ${e.length} problem(s)`); e.slice(0, 80).forEach((x) => console.log(' - ' + x)); bad += e.length; }
  process.exit(bad ? 1 : 0);
}
