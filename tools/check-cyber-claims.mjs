// Fails when the Cybersecurity course says one thing and the build or code says another. Run by `npm run check`.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const claims = read('training-private/cybersecurity-claims.json');
const src = read('training-private/cybersecurity-source.json');
const cat = read('site/training/catalog.json');
const ent = cat.series.courses.find((x) => x.id === 'cybersecurity');
const { LESSONS } = await import(path.join(root, 'training-private/frontier.mjs'));
const { fromCompact } = await import(path.join(root, 'tools/cyber-course.mjs'));
const all = [...src.lessons, ...LESSONS.slice().sort((a, b) => a.n - b.n).map(fromCompact)];
const errs = [];
const eq = (a, b, m) => { try { assert.deepEqual(a, b); } catch { errs.push(`${m}: page says ${JSON.stringify(a)}, build computes ${JSON.stringify(b)}`); } };

const sum = (f) => all.reduce((n, l) => n + f(l), 0);
const k = claims.counts;
eq(k.lessons, all.length, 'lessons');
eq(k.modules, ent.modules.length, 'modules');
eq(k.modules && ent.modules.reduce((n, m) => n + m.lessons.length, 0), all.length, 'lessons placed in modules');
eq(k.slides, sum((l) => l.slides.length), 'slides');
eq(k.quizQuestions, sum((l) => l.quiz.length), 'quiz questions');
eq(k.labSteps, all.length, 'lab steps (one per lesson)');
eq(ent.lab.steps.length, all.length, 'catalogue lab steps');
all.forEach((l, i) => { if (!ent.lab.steps[i] || !ent.lab.steps[i].endsWith(l.lab.title)) errs.push(`lab step ${i + 1} does not match the lesson's lab "${l.lab.title}"`); });
eq(ent.lab.checks.length, k.healthChecks, 'health checks on the page');
const health = fs.readFileSync('tools/cyber-health.js', 'utf8');
eq((health.match(/out\.push\(/g) || []).length, k.healthChecks, 'health checks in code');
eq(ent.course.free, k.free, 'free lessons');
for (const m of ent.modules) if (!m.note) errs.push(`module "${m.title}" has no note`);

// Certificate rule agrees with the worker.
const w = fs.readFileSync('worker/cert-api.js', 'utf8');
const c = claims.certificate;
const m = w.match(/cybersecurity:\s*\{([^}]*)\}/);
const got = m ? Object.fromEntries([...m[1].matchAll(/(\w+):\s*(\d+)/g)].map((x) => [x[1], +x[2]])) : {};
eq({ lessons: c.lessons, sections: c.sections, checks: c.checks, questions: c.questions }, got, 'certificate rule vs worker/cert-api.js');
if (!/self-reported/.test(c.attests)) errs.push('the certificate statement must say the record is self-reported');

// References: every slide ref marker resolves; every lesson has a review date; the changelog is current.
const refs = new Set(src.refs.map((r) => r.n));
for (const l of all) for (const s of l.slides) for (const r of s.refs || []) if (!refs.has(r)) errs.push(`lesson ${l.n} slide "${s.title}" cites missing reference ${r}`);
for (const l of all) if (!(claims.reviewed[l.n] || claims.reviewed.default)) errs.push(`lesson ${l.n} has no review date`);
if (!claims.changelog.length || !claims.changelog[0].date) errs.push('changelog is empty');

// No overclaims in the page copy.
const copy = JSON.stringify([ent.lab, ent.outcomes, ent.course.method, ent.course.faq]);
for (const bad of [/Twelve slides/i, /tells you if (your|the) lab/i, /build and attack/i, /run authorised red-team/i, /six-step|6-step/i]) if (bad.test(copy)) errs.push(`overclaim or stale wording in the course copy: ${bad}`);
if (/WhatsApp\. We reply with how to pay/.test(copy)) errs.push('the access answer describes the old WhatsApp-only flow');

// Built pages must not leak template failures.
for (const f of ['site/training/cybersecurity/index.html', 'site/training/index.html']) {
  if (!fs.existsSync(f)) continue;
  const text = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const bad of [/\bundefined\b/, /\bNaN\b/, /\[object /, /(^|\s)null(\s|$)/]) if (bad.test(text)) errs.push(`${f} contains ${bad}`);
}

if (errs.length) { console.error('Cybersecurity claims check failed:\n - ' + errs.join('\n - ')); process.exit(1); }
console.log(`cybersecurity claims ok: ${all.length} lessons, ${k.slides} slides, ${k.quizQuestions} questions, ${k.labSteps} lab steps, ${k.healthChecks} health checks`);
