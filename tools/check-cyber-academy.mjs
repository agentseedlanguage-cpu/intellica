#!/usr/bin/env node
// Gate for the Cybersecurity Academy. Run by `npm run check` once tools/patch-cyber-1.mjs has been applied.
// Fails when the academy data disagrees with the live course, when a generated page is stale, or when page copy
// overclaims (affiliation, accreditation, equivalence, guaranteed results, prices that belong to the course).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { LEVELS, LESSON_LEVEL, LESSON_TAGS, ASI, AISVS_CH } from './cyber-academy/levels.mjs';
import { PLANNED, PATHS, GAPS, GAIPS, ROADMAP } from './cyber-academy/meta.mjs';
import { SOURCES } from './cyber-academy/sources.mjs';
import { QUESTIONS, PER_LEVEL, PASS } from './cyber-academy/questions.mjs';
import { scoreAnswers, recommend } from './cyber-academy/placement.mjs';

const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const errs = [];
const cat = read('site/training/catalog.json');
const ent = cat.series.courses.find((x) => x.id === 'cybersecurity');
const claims = read('training-private/cybersecurity-claims.json');
const total = ent.modules.reduce((n, m) => n + m.lessons.length, 0);
if (total !== claims.counts.lessons) errs.push(`catalogue has ${total} lessons, claims say ${claims.counts.lessons}`);

// 1. Every live lesson sits in exactly one level, and each level's list agrees with the lesson map.
for (let n = 1; n <= total; n++) {
  if (!LESSON_LEVEL[n]) errs.push(`lesson ${n} has no academy level`);
  if (!LESSON_TAGS[n]) errs.push(`lesson ${n} has no standards tags`);
  else { for (const a of LESSON_TAGS[n].asi) if (!ASI[a]) errs.push(`lesson ${n}: unknown ASI${a}`); for (const c of LESSON_TAGS[n].aisvs) if (!AISVS_CH[c]) errs.push(`lesson ${n}: unknown AISVS chapter C${c}`); }
}
for (const n of Object.keys(LESSON_LEVEL)) if (+n > total || +n < 1) errs.push(`level map names lesson ${n}, which does not exist`);
const seen = new Set();
for (const v of LEVELS) {
  const mapped = Object.keys(LESSON_LEVEL).filter((n) => LESSON_LEVEL[n] === v.n).map(Number).sort((a, b) => a - b);
  if (JSON.stringify(mapped) !== JSON.stringify([...v.core].sort((a, b) => a - b))) errs.push(`level ${v.n}: core lessons ${v.core} do not match the lesson map ${mapped}`);
  for (const n of v.core) { if (seen.has(n)) errs.push(`lesson ${n} appears in two levels`); seen.add(n); }
  for (const p of v.planned) if (!PLANNED[p]) errs.push(`level ${v.n}: unknown planned lesson ${p}`);
  if (!v.modules.length || v.modules.some((m) => m.length !== 3 || m.some((x) => !x))) errs.push(`level ${v.n}: every module needs a title, an outcome and evidence`);
  if (!v.caveat) errs.push(`level ${v.n}: no caveat`);
}
if (seen.size !== total) errs.push(`levels cover ${seen.size} lessons, the course has ${total}`);

// 2. References resolve.
const plannedUsed = new Set([...LEVELS.flatMap((v) => v.planned), ...GAPS.map((g) => g.planned), ...GAIPS.flatMap((g) => g.planned)]);
for (const id of Object.keys(PLANNED)) if (!plannedUsed.has(id)) errs.push(`planned lesson ${id} is not linked from any level or gap`);
for (const g of GAPS) if (!PLANNED[g.planned]) errs.push(`gap ${g.id} points at unknown ${g.planned}`);
for (const g of GAIPS) { for (const n of g.lessons) if (n < 1 || n > total) errs.push(`GAIPS row "${g.cluster}" names lesson ${n}`); for (const p of g.planned) if (!PLANNED[p]) errs.push(`GAIPS row "${g.cluster}" names ${p}`); }
for (const p of PATHS) { for (const n of p.lessons) if (n < 1 || n > total) errs.push(`path ${p.id} names lesson ${n}`); for (const l of p.levels) if (!LEVELS.find((v) => v.n === l)) errs.push(`path ${p.id} names level ${l}`); }
for (const s of SOURCES) if (!/^(verified|carried)$/.test(s.status) || (s.status === 'verified' && !s.url)) errs.push(`source ${s.id}: a verified source needs a URL`);
if (new Set(ROADMAP.map((r) => r.n)).size !== ROADMAP.length) errs.push('duplicate roadmap phase numbers');


// 2b. Placement question bank: shape, balance, honesty.
{
  const seenQ = new Set();
  for (const [i, q] of QUESTIONS.entries()) {
    const tag = `question ${i + 1} (level ${q.level})`;
    if (!LEVELS.find((v) => v.n === q.level)) errs.push(`${tag}: unknown level`);
    if (!q.q || !q.why || !Array.isArray(q.o) || q.o.length !== 4) errs.push(`${tag}: needs a stem, an explanation and exactly 4 options`);
    else {
      if (new Set(q.o.map((x) => x.trim().toLowerCase())).size !== 4) errs.push(`${tag}: duplicate options`);
      if (q.o.some((x) => /^(all|none) of the above$/i.test(x.trim()))) errs.push(`${tag}: "all/none of the above" is not allowed`);
    }
    if (seenQ.has(q.q)) errs.push(`${tag}: duplicate stem`); seenQ.add(q.q);
    if (!q.lessons || !q.lessons.length || q.lessons.some((n) => !Number.isInteger(n) || n < 1 || n > total)) errs.push(`${tag}: lessons must be live lesson numbers`);
  }
  for (const v of LEVELS) { const n = QUESTIONS.filter((q) => q.level === v.n).length; if (n !== PER_LEVEL) errs.push(`level ${v.n} has ${n} placement questions, expected ${PER_LEVEL}`); }
  // scoring logic
  const items = QUESTIONS.map((q) => ({ level: q.level, correct: 0 }));
  if (recommend(scoreAnswers(items, items.map((x) => x.correct))) !== 6) errs.push('placement: a perfect score must recommend the top level');
  if (recommend(scoreAnswers(items, items.map(() => null))) !== 1) errs.push('placement: no answers must recommend level 1');
  const mixed = items.map((x) => (x.level === 1 ? x.correct : null));
  if (recommend(scoreAnswers(items, mixed)) !== 2) errs.push('placement: passing level 1 only must recommend level 2');
  if (PASS !== 0.75) errs.push('placement pass line changed; update the page copy and this check');
  const html = fs.existsSync(path.join(root, 'site/training/cybersecurity/academy/placement/index.html')) ? fs.readFileSync(path.join(root, 'site/training/cybersecurity/academy/placement/index.html'), 'utf8') : '';
  const pos = [...html.matchAll(/data-correct="(\d)"/g)].map((m) => +m[1]);
  if (pos.length !== QUESTIONS.length) errs.push(`placement page has ${pos.length} questions, data has ${QUESTIONS.length}`);
  for (let k = 0; k < 4; k++) if (pos.filter((x) => x === k).length > Math.ceil(QUESTIONS.length / 4) + 3) errs.push(`placement: correct answers cluster in position ${k + 1}`);
}

// 3. Generated pages are current.
const b = spawnSync(process.execPath, ['tools/build-cyber-academy.mjs', '--check'], { cwd: root, encoding: 'utf8' });
if (b.status !== 0) errs.push((b.stderr || b.stdout || 'academy build check failed').trim());

// 4. Copy rules.
const dir = path.join(root, 'site/training/cybersecurity/academy');
const files = [];
(function walk(d) { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(dir);
const BAD = [
  [/Intellica is (an? )?(accredited|approved|authori[sz]ed|certified)/i, 'claims an accreditation or approval'],
  [/(GIAC|ISC2|ISACA|CompTIA|CSA|IAPP|OWASP|MITRE|NIST)[- ](approved|accredited|endorsed|authori[sz]ed)/i, 'claims third-party approval'],
  [/\b(official|authori[sz]ed) (partner|training provider|prep)/i, 'claims partner status'],
  [/pass(es)? (guaranteed|rate of)|guaranteed (to )?pass|\b100% pass/i, 'promises exam results'],
  [/equivalent to (a |the )?(GAIPS|GAIPT|CISSP|CISM|CRISC|CISA|CCSP|CSSLP|Security\+|CC\b)/i, 'claims equivalence to an external credential'],
  [/\b(US|TT)\$\s?\d/, 'states a price (the course page owns prices)'],
  [/\bcounts? towards (a |the |your )?(GAIPS|CISSP|CISM|exam|certification)/i, 'claims credit towards an external credential'],
];
for (const f of files.filter((x) => x.endsWith('.html'))) {
  const text = fs.readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' ').replace(/Not a preparation guarantee\./g, '');
  for (const [re, why] of BAD) if (re.test(text)) errs.push(`${path.relative(root, f)}: ${why} (${re})`);
  if (!/independent of GIAC/.test(text)) errs.push(`${path.relative(root, f)}: missing the independence statement`);
}
if (files.filter((x) => x.endsWith('.html')).length < 14) errs.push('expected at least 14 academy pages');

if (errs.length) { console.error(`cyber academy check: ${errs.length} problem(s)\n  - ${errs.join('\n  - ')}`); process.exit(1); }
console.log(`cyber academy check: ok (${LEVELS.length} levels, ${total} lessons mapped, ${Object.keys(PLANNED).length} planned lessons, ${files.filter((x) => x.endsWith('.html')).length} pages)`);
