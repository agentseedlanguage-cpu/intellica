#!/usr/bin/env node
// Builds the Cyber Security for Agentic Environments Academy pages under /training/cybersecurity/academy/.
// Data: tools/cyber-academy/*.mjs. Lessons, free lessons and counts come from the live course data, so the academy
// can never disagree with the course. Writes only inside site/training/cybersecurity/academy/ (own namespace).
// Usage: node tools/build-cyber-academy.mjs [--check]   (--check writes nothing and fails if any page on disk is stale)
import fs from 'node:fs';
import path from 'node:path';
import { page, esc } from './training-shell.mjs';
import { levelPath } from './catalog-html.mjs';
import { LEVELS, LESSON_LEVEL, LESSON_TAGS, ASI, AISVS_CH, REVIEWED } from './cyber-academy/levels.mjs';
import { PLANNED, PATHS, GAPS, GAIPS, RATING, ROADMAP, STATUS_LABEL, ENDORSEMENTS, POLICY, ASSESSMENT, ACADEMIC_DOMAINS, RESEARCH_LITERATURE, CASE_STUDIES } from './cyber-academy/meta.mjs';
import { SOURCES } from './cyber-academy/sources.mjs';
import { QUESTIONS, PER_LEVEL, PASS } from './cyber-academy/questions.mjs';

const CHECK = process.argv.includes('--check');
const stale = [];
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'site/training/cybersecurity/academy');
const BASE = '/training/cybersecurity/academy/';
const COURSE = '/training/cybersecurity/course/';
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const cat = read('site/training/catalog.json');
const ent = cat.series.courses.find((x) => x.id === 'cybersecurity');
const claims = read('training-private/cybersecurity-claims.json');
const FREE = new Set(ent.course.free);
const lessons = []; // { n, title, module }
for (const m of ent.modules) for (const l of m.lessons) lessons.push({ n: lessons.length + 1, title: typeof l === 'string' ? l : (l.title || l.name), module: m.title });
if (lessons.length !== claims.counts.lessons) throw new Error(`catalogue has ${lessons.length} lessons but the claims file says ${claims.counts.lessons}`);
const L = (n) => lessons[n - 1];
const num = (n) => Number(n).toLocaleString('en-US');

/* ---------- helpers ---------- */
const sect = (id, h, intro, html) => `<section class="ac-sec" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(h)}</h2>${intro ? `<p class="ac-intro">${esc(intro)}</p>` : ''}${html}</section>`;
const table = (heads, rows, cls = '') => `<div class="ac-scroll"><table class="ac-table ${cls}"><thead><tr>${heads.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 && c && c.n ? `<td class="ac-n">${esc(c.n)}</td>` : `<td>${c && c.html !== undefined ? c.html : esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
const pill = (cls, text) => `<span class="ac-pill ac-${cls}">${esc(text)}</span>`;
const lessonLink = (n) => `<a href="${COURSE}">${esc(L(n).title)}</a>`;
const lessonRow = (n) => `<li><span class="ac-ln">${n}</span>${lessonLink(n)}${FREE.has(n) ? pill('free', 'Free') : ''}</li>`;
const asiTags = (n) => LESSON_TAGS[n].asi.map((a) => `ASI${String(a).padStart(2, '0')}`).join(', ') || '\u2013';
const aisvsTags = (n) => LESSON_TAGS[n].aisvs.map((c) => `C${c}`).join(', ') || '\u2013';
const plannedRow = (id) => `<li><span class="ac-ln">${id}</span><span><strong>${esc(PLANNED[id].title)}</strong> ${pill('gap', 'Planned')}<br><span class="ac-fine">${esc(PLANNED[id].why)}</span></span></li>`;

const NAV = [['', 'Overview'], ['placement/', 'Find your level'], ['paths/', 'Pathways'], ['lessons/', 'Lesson map'], ['gaips/', 'GAIPS mapping'], ['standards/', 'Standards and sources'], ['certification/', 'Certification policy'], ['roadmap/', 'Roadmap']];
const nav = (cur) => `<nav aria-label="Academy sections"><ul class="ac-nav">${NAV.map(([p, t]) => `<li><a href="${BASE}${p}"${p === cur ? ' aria-current="page"' : ''}>${esc(t)}</a></li>`).join('')}<li><a href="${BASE}level-1/"${/^level-/.test(cur) ? ' aria-current="page"' : ''}>The six levels</a></li></ul></nav>`;
const crumb = (label) => `<nav class="subnav" aria-label="Academy"><p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="/training/cybersecurity/">Cyber Security</a><span aria-hidden="true"> / </span>${label === 'Academy' ? 'Academy' : `<a href="${BASE}">Academy</a><span aria-hidden="true"> / </span>${esc(label)}`}</p><a class="sn-code" href="/training/my-courses/">Enter access code</a></nav>`;
const hero = (h, lead, actions = '', tag = 'Academy') => `<section class="t-hero t-hero-single" aria-labelledby="ac-title"><div class="t-hero-copy"><p class="cat-tag"><span>${esc(tag)}</span></p><h1 id="ac-title">${esc(h)}</h1><p class="lead">${esc(lead)}</p>${actions ? `<div class="actions">${actions}</div>` : ''}</div></section>`;
const btn = (href, text, primary) => `<a class="btn ${primary ? 'btn-primary' : 'btn-ghost'}" href="${href}">${esc(text)}</a>`;
const INDEP = 'Intellica is independent of GIAC, ISC2, ISACA, CompTIA, CSA, IAPP, OWASP, MITRE and NIST. Mappings show how our lessons relate to published objectives. They are not an affiliation, an approval or a prediction of any exam result.';
const foot = `<p class="ac-fine">Reviewed ${REVIEWED}. ${esc(INDEP)}</p>`;

const written = [];
function emit(rel, o) {
  const dir = path.join(OUT, rel);
  const html = page({ title: `${o.title} | Intellica Training`, description: o.description, canonicalPath: BASE + rel, body: `\n${crumb(o.crumb)}\n${nav(o.cur ?? rel)}\n${o.body}\n${foot}\n`, css: ['/training/catalog.css', `${BASE}academy.css`] })
    .replace('</body>', o.script ? `  <script type="module" src="${o.script}"></script>\n</body>` : '</body>')
    .replace('<!-- Generated by tools/build-training.mjs from site/training/training.json. Edit the data, not this file. -->', '<!-- Generated by tools/build-cyber-academy.mjs from tools/cyber-academy/. Edit the data, not this file. -->');
  const file = path.join(dir, 'index.html');
  if (CHECK) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== html) stale.push(BASE + rel); }
  else { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file, html); }
  written.push(BASE + rel);
}

function emitFile(rel, content) {
  const file = path.join(OUT, rel);
  if (CHECK) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) stale.push(BASE + rel); }
  else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
}

/* ---------- landing ---------- */
const THESIS = [
  ['Intent is not authority', 'A natural-language request must never become an implicit grant of permission.'],
  ['Prompt injection is a control-plane attack', 'Instructions can arrive in documents, email, web pages, tool output, code comments and images.'],
  ['Tool access turns errors into impact', 'A mistaken or manipulated plan can move money, change systems, run code or disclose data.'],
  ['Identity and delegation are dynamic', 'Users, agents, sub-agents, service accounts and tools form authority chains that change at run time.'],
  ['Memory and retrieval persist', 'Poisoned context can shape later sessions long after the original interaction.'],
  ['Multi-agent systems correlate failure', 'Trust propagates, permissions compound and a small compromise can cascade.'],
  ['Assurance must be continuous', 'Model, prompt, tool, policy and data changes alter behaviour, so controls have to be measured again.'],
];
emit('', {
  title: 'Cyber Security Academy', crumb: 'Academy', cur: '',
  description: 'A six-level programme for securing AI agents, their tools, identities, memory and infrastructure, with original teaching, practical evidence and an independent credential scheme in development.',
  body: hero('Intellica Cyber Security Academy', 'A six-level professional pathway for cyber security in agentic environments: from foundations and application security to architecture, operations, adversarial assurance and governance. The curriculum is grounded in current research and mapped to published security frameworks and professional objectives.', btn('/training/cybersecurity/', 'View Level 2 course', true) + btn(`${BASE}placement/`, 'Find your level') + btn('#levels', 'View the six levels'), 'Agentic cyber security · 6 levels')
    + sect('delivery', 'Current course and academy status', 'The complete 28-lesson Application Cyber Security for Agentic Environments course is the online course for Level 2. The six-level academy defines the broader progression, additional level outcomes and future assessments; selected course lessons also support outcomes elsewhere in the pathway.',
      `<ul class="ac-stats"><li><b>${num(claims.counts.lessons)}</b><span>lessons in the live course</span></li><li><b>${num(claims.counts.slides)}</b><span>teaching slides</span></li><li><b>${num(claims.counts.labSteps)}</b><span>guided lab steps</span></li><li><b>${num(claims.counts.quizQuestions)}</b><span>recall questions</span></li><li><b>${PLANNED ? Object.keys(PLANNED).length : 0}</b><span>curriculum extensions specified</span></li></ul>
<div class="ac-note"><p><strong>Credential status.</strong> The course and its self-reported completion certificate are available. Intellica’s six-level assessed credential scheme is in design; no academy-level credential has been issued. Level pages distinguish published course lessons from additional curriculum and assessment work still in development.</p></div>`)
    + sect('level-2-course', 'Level 2 course: Application Cyber Security for Agentic Environments', 'One integrated 28-lesson course across seven modules, with a 28-step assurance-pack lab. It is the course attached to Level 2—not a separate course for each academy level.',
      `<div class="ac-grid"><div class="ac-card"><h3><a href="/training/cybersecurity/">Application Cyber Security for Agentic Environments</a></h3><p>28 lessons · 7 modules · 28-step guided assurance-pack lab. The course covers secure agent applications, untrusted context, tools and MCP, identity, memory, execution, supply chain, monitoring and governance.</p><p>Selected lessons also support mapped outcomes in other academy levels, while the course itself remains one Level 2 course.</p></div></div>
      <div class="actions"><a class="btn btn-primary" href="/training/cybersecurity/">Course details</a><a class="btn btn-ghost" href="${COURSE}">Open the course player</a><a class="btn btn-ghost" href="${BASE}lessons/">Review the lesson map</a></div>
      <p class="ac-fine">Course completion is not the same as passing an independently assessed academy level. The current completion certificate is self-reported and unproctored; its scope is stated on the <a href="/training/cybersecurity/">course page</a>.</p>`)
    + sect('cases', 'Recent incidents translated into practical study', 'The course and academy use current disclosures as engineering case studies. Evidence labels distinguish confirmed incidents from research demonstrations and attempted campaigns.',
      table(['Case study', 'Evidence class', 'What learners investigate'], CASE_STUDIES.map((c) => [{ html: `<a href="${esc(c.url)}" rel="noopener">${esc(c.title)}</a><div class="ac-fine">${esc(c.date)}</div>` }, c.evidence, c.detail])))
    + sect('why', 'Why agentic security is its own subject', 'Traditional application security assumes software follows explicit control flow. Agents interpret untrusted content, choose tools, hold memory and delegate work, so the security boundary moves.',
      `<div class="ac-grid">${THESIS.map(([h, t]) => `<div class="ac-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}</div>
<div class="ac-note"><p><strong>Design thesis.</strong> Minimise agency, constrain authority, isolate execution, authenticate every actor, validate every consequential action, treat model-visible data as untrusted, and keep measuring whether the controls work.</p></div>`)
    + sect('levels', 'The six-level professional pathway', 'Understand, build, architect, defend, assure and govern. Each level defines the practical evidence and competence expected at that stage.',
      levelPath(LEVELS.map((v) => ({ n: v.n, path: `${BASE}${v.id}/`, short: v.short })), 0)
      + `<div class="cat-grid">${LEVELS.map((v) => `
        <article class="cat-card">
          <p class="cat-tag">Level ${v.n}<span class="cat-status is-live">${v.core.length} lessons live</span></p>
          <h3><a href="${BASE}${v.id}/">${esc(v.title)}</a></h3>
          <p>${esc(v.tagline)}</p>
          <p class="ac-fine">${esc(v.status.label)}. ${v.planned.length} planned lesson${v.planned.length === 1 ? '' : 's'}.</p>
          <a class="cat-go" href="${BASE}${v.id}/">See the level <span aria-hidden="true">\u2192</span></a>
        </article>`).join('')}
      </div>
<p class="ac-fine">Specialist endorsements are planned across Levels 2 to 5: ${esc(ENDORSEMENTS.join('; '))}.</p>`)
    + sect('paths', 'Choose a pathway', 'Six pathways by role, each a sequence of levels and live lessons.',
      `<div class="ac-grid">${PATHS.map((p) => `<div class="ac-card"><h3>${esc(p.title)}</h3><p>${esc(p.who)}</p><p class="ac-fine">Levels ${p.levels.join(', ')} \u00b7 ${p.lessons.length} lessons</p></div>`).join('')}</div><p><a href="${BASE}paths/">See every pathway and its lessons</a></p>`)
    + sect('method', 'Assessment principles for the academy', 'These principles govern the design of future assessed level credentials. They do not describe the current course completion certificate, which is self-reported and unproctored.', `<div class="ac-grid">${ASSESSMENT.map(([h, t]) => `<div class="ac-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}</div>`)
    + sect('how', 'How the academy works', null, `<div class="cols">
        <div><h3>Hands on at every level</h3><p>Each lesson has a guided lab step, a worked model and a four-criterion rubric. The 28 steps build one assurance pack for an agent system you know. Browser-based policy and trace tools, plus a local reference kit, let you test selected controls and attack scenarios using synthetic data.</p></div>
        <div><h3>Preview before enrolment</h3><p>Lessons ${[...FREE].join(' and ')} are available as a free preview, allowing learners to inspect the teaching approach and course materials before enrolment.</p></div>
        <div><h3>Placement and progression</h3><p>Use the <a href="${BASE}placement/">placement check</a> to review your current knowledge: ${QUESTIONS.length} original practice questions, ${PER_LEVEL} per level, scored locally in your browser. Responses are not transmitted or stored by the placement tool.</p></div>
      </div>`)
    + sect('not', 'Programme scope and credential status', null, `<ul class="plain">
        <li>The academy maps to public frameworks and published exam objectives. It is independent of those bodies and does not claim affiliation, accreditation, equivalence or guaranteed exam outcomes.</li>
        <li>The placement check is a self-check made of original practice questions. It is not an assessment and does not count towards any credential.</li>
        <li>An Intellica certificate shows that you completed an Intellica course and met its published rule. Intellica\u2019s own assessed credentials for the six levels are planned, not available.</li>
        <li>Planned lessons have not yet been published. The <a href="${BASE}roadmap/">roadmap</a> identifies the capability gap and intended evidence for each one.</li>
      </ul>`)
    + sect('refs', 'What it is built on', 'Public standards and exam objectives are used as references and mappings, and every source is dated.',
      `<p>The curriculum maps to the OWASP Top 10 for Agentic Applications, OWASP AISVS, MITRE ATLAS, the NIST AI RMF and the public objectives of external exams such as GIAC GAIPS. See the <a href="${BASE}standards/">source register</a> and the <a href="${BASE}gaips/">GAIPS mapping</a>.</p>`),
});

/* ---------- levels ---------- */
LEVELS.forEach((v, i) => {
  const prev = LEVELS[i - 1], next = LEVELS[i + 1];
  emit(`${v.id}/`, {
    title: `Level ${v.n}: ${v.title}`, crumb: `Level ${v.n}`, cur: v.id,
    description: `${v.tagline} Modules, evidence, live lessons, planned lessons and honest external mapping for Level ${v.n} of the Cyber Security for Agentic Environments Academy.`,
    body: hero(`Level ${v.n}: ${v.title}`, v.tagline, btn(COURSE, 'Open the live course', true) + btn(`${BASE}paths/`, 'See pathways'), `Level ${v.n} \u00b7 ${v.short}`)
      + `<p>${pill(v.status.key, v.status.label)}</p><dl class="ac-facts"><div><dt>Who it is for</dt><dd>${esc(v.audience)}</dd></div><div><dt>Before you start</dt><dd>${esc(v.prereq)}</dd></div><div><dt>Capstone evidence</dt><dd>${esc(v.capstone)}</dd></div><div><dt>How it is assessed</dt><dd>${esc(v.assessment)}</dd></div></dl>`
      + sect('modules', 'Modules and evidence', 'Each module ends in an artefact that goes into your portfolio.', table(['Module', 'You will be able to', 'Evidence'], v.modules.map((m) => [m[0], m[1], m[2]])))
      + sect('live', v.n === 2 ? 'Core Level 2 lessons within the course' : 'Live lessons for this level', v.n === 2 ? 'The complete 28-lesson Application Cyber Security course is the Level 2 online course. These eight lesson IDs are the academy’s core mapping for Level 2; other lessons in the same course support selected outcomes elsewhere in the pathway.' : `${v.core.length} lessons in the live course are currently mapped to this level.`, `<ul class="ac-lessons">${v.core.map(lessonRow).join('')}</ul><p class="ac-fine">The free lessons open without payment. Lesson order inside the course is by module, not by level.</p>`)
      + sect('planned', 'Planned lessons', v.planned.length ? 'These lessons are specified but not yet published. They address gaps identified in the curriculum review.' : null, v.planned.length ? `<ul class="ac-lessons">${v.planned.map(plannedRow).join('')}</ul>` : '<p>No new lessons are planned for this level.</p>')
      + sect('mapping', 'External mapping', 'Related published credentials, as benchmarks and optional pathways only.', table(['Credential or framework', 'How we use it'], v.mapping) + `<div class="ac-note"><p>${esc(v.caveat)}</p></div>`)
      + `<div class="ac-pager">${prev ? `<a href="${BASE}${prev.id}/">\u2190 Level ${prev.n}: ${esc(prev.short)}</a>` : '<span></span>'}${next ? `<a href="${BASE}${next.id}/">Level ${next.n}: ${esc(next.short)} \u2192</a>` : '<span></span>'}</div>`,
  });
});

/* ---------- placement self-check ---------- */
{
  const rot = (o, shift) => o.map((_, j) => o[(j - shift + o.length) % o.length]);
  let gi = 0;
  const groups = LEVELS.map((v) => `<fieldset class="ac-level"><legend>Level ${v.n}: ${esc(v.title)}</legend>${QUESTIONS.filter((q) => q.level === v.n).map((q) => {
    const id = gi++;
    const shift = (id * 3 + q.level) % q.o.length; // moves the correct answer around, deterministically
    return `
      <div class="ac-q" data-q data-level="${q.level}" data-correct="${shift}">
        <p class="ac-qt"><span class="ac-qn">${id + 1}.</span> ${esc(q.q)}</p>
        ${rot(q.o, shift).map((t, j) => `<label class="ac-opt"><input type="radio" name="q${id}" value="${j}"><span>${esc(t)}</span></label>`).join('')}
        <div class="ac-why" data-why hidden><p><strong>Why.</strong> ${esc(q.why)}</p><p class="ac-fine">Review: ${q.lessons.map((n) => `lesson ${n}, ${esc(L(n).title)}`).join('; ')}.</p></div>
      </div>`;
  }).join('')}</fieldset>`);
  emit('placement/', {
    title: 'Find your level', crumb: 'Find your level', cur: 'placement/', script: `${BASE}placement/placement.js`,
    description: `${QUESTIONS.length} original practice questions, ${PER_LEVEL} per level, to find the academy level that fits you. Scored in your browser; nothing is stored or sent.`,
    body: hero('Find your level', `${QUESTIONS.length} original practice questions, ${PER_LEVEL} for each of the six levels. Answer what you can, check your answers, and see where to start. Scored in your browser. Nothing is stored or sent.`, '', 'Placement check')
      + `<div class="ac-note"><p><strong>A self-check, not an assessment.</strong> These are practice questions written by Intellica. They are not exam questions, do not predict the result of any external exam and do not count towards any credential. A level counts as familiar at ${Math.round(PASS * 100)}% or more.</p></div>
<noscript><p class="ac-fine">Scoring needs JavaScript. You can still read every question, but the answers and your result appear only when scripts run.</p></noscript>
<form data-placement class="ac-form" aria-label="Placement check">${groups.join('')}
  <div class="actions"><button class="btn btn-primary" type="submit">Check my answers</button><button class="btn btn-ghost" type="reset">Start again</button></div>
  <p class="ac-fine" data-note role="status" hidden></p>
</form>
<section class="ac-result" data-result aria-live="polite" aria-labelledby="ac-res-h" hidden>
  <h2 id="ac-res-h">Your result</h2>
  ${table(['Level', 'Score'], LEVELS.map((v) => [`${v.n}. ${v.title}`, { html: `<span data-score="${v.n}">\u2013</span>` }]))}
  <p>Start at <strong>Level <span data-rec></span></strong>: the first level where you scored under ${Math.round(PASS * 100)}%, or the top level if you scored above that everywhere. <span data-unanswered></span></p>
  <div class="actions">${LEVELS.map((v) => `<a class="btn btn-primary" data-rec-link="${v.n}" href="${BASE}${v.id}/" hidden>Open Level ${v.n}</a>`).join('')}<a class="btn btn-ghost" href="${BASE}paths/">See pathways by role</a></div>
  <p class="ac-fine">Each answer explains why and names the lessons to review. Newcomers who score low at Level 1 should start with the free lessons; a short foundations bridge is planned (P9).</p>
</section>`,
  });
  emitFile('placement/placement.js', fs.readFileSync(path.join(ROOT, 'tools/cyber-academy/placement.mjs'), 'utf8'));
}

/* ---------- pathways ---------- */
emit('paths/', {
  title: 'Pathways by role', crumb: 'Pathways', cur: 'paths/',
  description: 'Six pathways through the Cyber Security for Agentic Environments Academy, by role: newcomer, builder, architect, operations, assurance and governance.',
  body: hero('Pathways by role', 'Pick the sequence that matches your job. Each pathway names the levels to work through and the live lessons that serve them.', btn(COURSE, 'Open the live course', true), 'Pathways')
    + PATHS.map((p) => sect(p.id, p.title, `${p.who} ${p.note}`, `<p class="ac-fine">Levels: ${p.levels.map((n) => `<a href="${BASE}level-${n}/">Level ${n}</a>`).join(', ')}</p><ul class="ac-lessons">${p.lessons.map(lessonRow).join('')}</ul>`)).join(''),
});

/* ---------- lesson map ---------- */
emit('lessons/', {
  title: 'Lesson map', crumb: 'Lesson map', cur: 'lessons/',
  description: `All ${lessons.length} live lessons placed in the six academy levels, with their OWASP Agentic Top 10 and AISVS tags.`,
  body: hero('Lesson map', `All ${lessons.length} live lessons, placed in a level and tagged to the OWASP Agentic Top 10 and OWASP AISVS chapters they touch.`, btn(COURSE, 'Open the live course', true), 'Lesson map')
    + sect('map', 'Every live lesson', 'Tags show where a lesson is a main teaching source for a risk or chapter. This is an Intellica-maintained curriculum map, not an external endorsement or a claim of conformance.',
      table(['#', 'Lesson', 'Module', 'Level', 'Agentic Top 10', 'AISVS chapters'], lessons.map((l) => [{ n: l.n }, { html: `<a href="${COURSE}">${esc(l.title)}</a>${FREE.has(l.n) ? ' ' + pill('free', 'Free') : ''}` }, l.module, { html: `<a href="${BASE}level-${LESSON_LEVEL[l.n]}/">${LESSON_LEVEL[l.n]}</a>` }, asiTags(l.n), aisvsTags(l.n)])))
    + sect('keys', 'Reading the tags', null, `<div class="ac-grid"><div class="ac-card"><h3>OWASP Top 10 for Agentic Applications</h3><ul class="ac-list">${Object.entries(ASI).map(([k, v]) => `<li>ASI${String(k).padStart(2, '0')}: ${esc(v)}</li>`).join('')}</ul></div><div class="ac-card"><h3>OWASP AISVS 1.0 chapters</h3><ul class="ac-list">${Object.entries(AISVS_CH).map(([k, v]) => `<li>C${k}: ${esc(v)}</li>`).join('')}</ul><p class="ac-fine">Chapter names are abbreviated. Check the OWASP repository for exact titles.</p></div></div>`),
});

/* ---------- GAIPS ---------- */
emit('gaips/', {
  title: 'GIAC GAIPS objective alignment', crumb: 'GAIPS mapping', cur: 'gaips/',
  description: 'An independent, version-aware comparison between Cyber Security Academy lessons and the published GIAC AI Platform Security objectives.',
  body: hero('GIAC GAIPS objective alignment', 'A documented comparison between the academy’s published lessons and GIAC’s current AI Platform Security objectives. The mapping identifies areas of coverage and curriculum development priorities.', btn(COURSE, 'Explore the technical course', true), 'External benchmark')
    + `<div class="ac-note"><p><strong>Independent curriculum mapping.</strong> Intellica is not affiliated with GIAC. This comparison uses public objectives and is not an endorsement, an accredited preparation course, or a prediction of exam performance. Confirm the current exam rules directly with GIAC before booking.</p></div>`
    + sect('facts', 'Current published exam information', `Checked ${REVIEWED}.`, `<dl class="ac-facts"><div><dt>Exam</dt><dd>One proctored examination</dd></div><div><dt>Format</dt><dd>GIAC lists CyberLive performance-based virtual-machine testing for GAIPS.</dd></div><div><dt>Length</dt><dd>54 questions; 2 hours</dd></div><div><dt>Passing score</dt><dd>65% for exam versions released on or after 25 July 2026</dd></div><div><dt>Objectives</dt><dd>Eight published outcome areas, including agentic systems, AI foundations, architecture, infrastructure, risk, MLOps, retrieval and model customisation.</dd></div></dl><p class="ac-fine">GIAC states that exam specifications may change. The candidate portal is authoritative for the version attached to an individual attempt.</p>`)
    + sect('crosswalk', 'Published-objective alignment', 'Intellica’s preliminary lesson mapping to the public GAIPS outcomes. It is subject to independent technical review and is not approved by GIAC.',
      table(['Published objective area', 'Related lessons', 'Coverage status', 'Curriculum development'], GAIPS.map((g) => [g.cluster, { html: g.lessons.map((n) => `<span title="${esc(L(n).title)}">${n}</span>`).join(', ') }, { html: pill(g.rating, RATING[g.rating]) }, { html: esc(g.note) + (g.planned.length ? ` <span class="ac-fine">(${g.planned.join(', ')})</span>` : '') }])))
    + sect('priority', 'Priority curriculum development', null, `<p>Two objective areas require additional lessons and labs: development pipelines and MLOps security (${PLANNED.P1.title}) and model customisation and alignment (${esc(PLANNED.P2.title)}). The academy will not claim full GAIPS coverage from topic titles alone. Each mapped area requires measurable outcomes, original lab evidence, original practice items and independent review.</p>`)
    + sect('others', 'Related GIAC AI credentials', 'GIAC’s wider AI portfolio provides distinct benchmarks for platform security, offensive testing and security automation.', `<ul class="ac-list"><li><strong><a href="https://www.giac.org/certifications/offensive-ai-penetration-tester-gaipt" rel="noopener">GAIPT</a></strong> (AI Penetration Tester): published objectives include direct and indirect injection, RAG, agents, MCP, API security and AI architecture flaws. The page is marked presale; Level 5 uses it as a benchmark, not an available credential.</li><li><strong><a href="https://www.giac.org/certifications/ai-security-automation-engineer-gasae" rel="noopener">GASAE</a></strong> (AI Security Automation Engineer): practical automation across offensive, defensive and cloud security operations; relevant to Level 4.</li><li><strong><a href="https://www.giac.org/certifications/offensive-ai-analyst-goaa" rel="noopener">GOAA</a></strong> (Offensive AI Analyst): a distinct offensive AI benchmark covering AI-enabled reconnaissance, vulnerability discovery, social engineering and operational security.</li></ul>`),
});

/* ---------- standards ---------- */
emit('standards/', {
  title: 'Standards and sources', crumb: 'Standards and sources', cur: 'standards/',
  description: 'The dated, version-pinned source register behind the Cyber Security for Agentic Environments Academy, with what was verified and what must be rechecked.',
  body: hero('Standards and sources', 'Every claim in the academy traces to a source with a version and a review date. This is the register, including what is verified and what still needs rechecking.', '', 'Sources')
    + sect('register', 'Source register', `Review date ${REVIEWED}. Verified means read in this review. Carried means kept from the research blueprint and rechecked before release.`,
      table(['Source', 'Role', 'Version and status', 'Notes'], SOURCES.map((s) => [{ html: (s.url ? `<a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a>` : esc(s.name)) + `<br><span class="ac-fine">${esc(s.owner)}</span>` }, s.role, { html: `${pill(s.status === 'verified' ? 'taught' : 'verify', s.status === 'verified' ? 'Verified' : 'Recheck')}<br>${esc(s.pin)}` }, s.note])))
    + sect('domains', 'Academic domains underpinning the curriculum', 'The academy integrates established computer-security disciplines with the newer research fields required to secure tool-using and autonomous systems.',
      table(['Academic domain', 'How it informs the curriculum'], ACADEMIC_DOMAINS))
    + sect('literature', 'Selected research literature and benchmarks', 'A curated starting set, not an exhaustive bibliography. Benchmarks are teaching and evaluation instruments; their limitations must be taught alongside their results.',
      table(['Research', 'Venue', 'Curriculum contribution'], RESEARCH_LITERATURE.map((r) => [{ html: `<a href="${esc(r.url)}" rel="noopener">${esc(r.title)}</a>` }, r.year, r.focus])))
    + sect('rules', 'How we use sources', null, `<ul class="ac-list"><li>Teach the concept in our own words. Cite requirement identifiers, not protected text.</li><li>Pin the version and the review date wherever a figure or a date appears.</li><li>Where sources disagree, say so and follow the primary source.</li><li>Standards change quickly. A scheduled scan and a change trigger update affected lessons, and the lesson changelog records it.</li><li>Paid standards are taught as concepts without reproducing protected text.</li></ul>`),
});

/* ---------- certification ---------- */
emit('certification/', {
  title: 'Certification and independence policy', crumb: 'Certification policy', cur: 'certification/',
  description: 'How the academy relates to external certifications, what the Intellica credential scheme will be, and the claims the academy will not make.',
  body: hero('Certification and independence policy', 'This policy distinguishes course completion, Intellica’s planned level credentials, external professional certifications and independently accredited personnel certification.', '', 'Policy')
    + sect('policy', 'Our independence policy', null, `<ul class="ac-list">${POLICY.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`)
    + sect('credentials', 'The six planned credentials', 'Working titles. None has been issued.', table(['Level', 'Working credential title', 'Capstone evidence'], LEVELS.map((v) => [`Level ${v.n}`, { html: `<a href="${BASE}${v.id}/">${esc(v.title)}</a>` }, v.capstone])))
    + sect('assessment', 'How a level is earned', null, `<div class="ac-grid">${ASSESSMENT.map(([h, t]) => `<div class="ac-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}</div>`)
    + sect('kinds', 'Reading the market precisely', 'Different things get called accreditation. We keep them apart.', table(['Kind', 'What it means', 'How we use it'], [
      ['Professional certification', 'A body certifies that an individual met its own exam, experience and renewal requirements.', 'Map public domains. Never claim equivalence or award another body\u2019s credential.'],
      ['Accredited personnel certification', 'An independent accreditation body assesses a certification body against a standard such as ISO/IEC 17024.', 'A long-term design benchmark for our own scheme. We make no accreditation claim. GIAC states that it is an active ISO/IEC 17024 personnel-certification body accredited through ANAB; that does not establish the accreditation scope of every individual credential.'],
      ['Accreditation scope', 'Accreditation applies to the certification body and the defined scope listed by the accreditation body.', 'Check the current ANAB schedule before treating any particular credential as accredited. Do not infer that a new AI credential is automatically within scope.'],
      ['Management-system certification', 'An organisation\u2019s management system is certified, for example to ISO/IEC 27001 or 42001.', 'We teach implementation and audit readiness. A learner credential does not certify an organisation.'],
      ['Framework or standard', 'A control set, taxonomy or reference architecture.', 'Source material and assessment criteria. It is not a personal certification.'],
      ['Course alignment', 'A provider maps lessons to public objectives.', 'We publish the mapping with this disclaimer.'],
    ]))
    + sect('completion', 'Current course completion record', null, `<p>The live course already issues a completion certificate. It is a record based on your own reported progress, not an Intellica academy credential. See the <a href="/training/cybersecurity/">course page</a> for exactly what it attests.</p>`),
});

/* ---------- roadmap ---------- */
emit('roadmap/', {
  title: 'Roadmap and gap register', crumb: 'Roadmap', cur: 'roadmap/',
  description: 'The phased build plan for the Cyber Security for Agentic Environments Academy, the gap register from the audit and the lessons planned to close each gap.',
  body: hero('Roadmap and gap register', 'What is done, what is next, the gaps the audit found, and the lessons planned to close them.', '', 'Roadmap')
    + sect('phases', 'Build phases', 'Each phase has an exit gate. A phase is not finished until its gate is met.', table(['Phase', 'Work', 'Exit gate', 'Status'], ROADMAP.map((r) => [`${r.n}. ${r.name}`, r.work, r.gate, { html: pill(r.status === 'done' ? 'done' : r.status === 'active' ? 'active' : 'verify', STATUS_LABEL[r.status]) }])))
    + sect('gaps', 'Gap register', 'Found by reconciling the research blueprint with the live course and with current sources.', table(['Gap', 'Finding', 'Source', 'Planned lesson'], GAPS.map((g) => [`${g.id}. ${g.topic}`, g.finding, g.source, g.planned])))
    + sect('planned', 'Planned lessons', `${Object.keys(PLANNED).length} lessons, each with a lab and an artefact for the portfolio.`, `<ul class="ac-lessons">${Object.keys(PLANNED).map((id) => `<li><span class="ac-ln">${id}</span><span><strong>${esc(PLANNED[id].title)}</strong> ${pill('gap', 'Planned')} <span class="ac-fine">Level ${PLANNED[id].level} \u00b7 ${esc(PLANNED[id].tags)}</span><br><span class="ac-fine">${esc(PLANNED[id].why)}</span></span></li>`).join('')}</ul>`)
    + sect('release', 'How releases work', null, `<ul class="ac-list"><li>Each release is a checkpoint with a changelog, a test run and a review date.</li><li>Existing course addresses, paid access and learner progress are never changed by an academy release.</li><li>Academy pages never state a price, a credential or a result that the course and its tests do not already support.</li></ul>`),
});

if (CHECK) {
  if (stale.length) { console.error(`cyber academy: ${stale.length} stale or missing page(s). Run: node tools/build-cyber-academy.mjs\n  ${stale.join('\n  ')}`); process.exit(1); }
  console.log(`cyber academy: ${written.length} pages are current`);
} else {
  console.log(`cyber academy: ${written.length} pages written to ${path.relative(ROOT, OUT)}`);
  for (const w of written) console.log('  ' + w);
}
