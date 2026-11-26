#!/usr/bin/env node
// Builds the AI for Business Academy page at /training/ai-business-academy/.
// Everything comes from site/training/catalog.json (the academy entry "aibusiness" and its six courses),
// so the page cannot disagree with the course pages. Usage: node tools/build-ai-business-academy.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { page, esc } from './training-shell.mjs';
import { lessonCount } from './catalog-html.mjs';

const CHECK = process.argv.includes('--check');
const ROOT = process.cwd();
const cat = JSON.parse(fs.readFileSync(path.join(ROOT, 'site/training/catalog.json'), 'utf8'));
const A = cat.academies.find((a) => a.id === 'aibusiness');
const courses = A.courses.map((id) => cat.series.courses.find((c) => c.id === id));
const open = (c) => Boolean(c.course && c.course.enabled);
const nOpen = courses.filter(open).length;
const BASE = A.path;
const status = (c) => (open(c) ? 'Open now' : 'In development');

const crumb = `<nav class="subnav" aria-label="Academy"><p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span>AI for Business Academy</p><a class="sn-code" href="/training/my-courses/">Enter access code</a></nav>`;
const boxes = `<ul class="hero-boxes" aria-label="The six courses">${courses.map((c, i) => `<li><a class="${open(c) ? 'is-open' : ''}" href="${c.path}"><b>Course ${i + 1}</b><span>${esc(c.short)}</span><i>${status(c)}</i></a></li>`).join('')}</ul>`;
const hero = `<section class="t-hero t-hero-single" aria-labelledby="ac-title"><div class="t-hero-copy"><p class="cat-tag"><span>AI for business · ${courses.length} courses</span></p><h1 id="ac-title" class="t-title-sm">AI for Business Academy</h1><p class="lead">Six practical courses for putting AI agents to work in data, software, marketing, projects and your own business. ${nOpen === 0 ? 'The courses are in development; each page shows the planned lessons and lab.' : `${nOpen} of ${courses.length} are open.`}</p>${boxes}</div></section>`;
const sect = (id, h, intro, html) => `<section class="ac-sec" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(h)}</h2>${intro ? `<p class="ac-intro">${esc(intro)}</p>` : ''}${html}</section>`;
const pill = (cls, t) => `<span class="ac-pill ac-${cls}">${esc(t)}</span>`;

const courseCards = courses.map((c, i) => `<div class="ac-card"><span class="ac-k">Course ${i + 1} · ${lessonCount(c)} ${open(c) ? '' : 'planned '}lessons</span><h3>${esc(c.title)}</h3><p>${esc(c.lead)}</p><p>${pill(open(c) ? 'available' : 'planned', status(c))}</p><p class="ac-fine"><strong>Lab:</strong> ${esc(c.lab.title)}</p><p class="ac-fine"><strong>You need:</strong> ${esc(c.needs)}</p><a class="ac-more" href="${c.path}">${open(c) ? 'See the course' : 'See the outline'}</a></div>`).join('');

const ROLES = [
  ['I run a business', ['entrepreneurship', 'ai-agents-business', 'digital-marketing']],
  ['I lead a team or projects', ['project-operations', 'ai-agents-business', 'data-analytics']],
  ['I work with data', ['data-analytics', 'ai-agents-business']],
  ['I want to build software', ['software-development', 'data-analytics']],
];
const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
for (const [, ids] of ROLES) for (const id of ids) if (!byId[id]) throw new Error(`pathway names unknown course ${id}`);

const body = `
${crumb}
${hero}
${sect('courses', 'The six courses', 'Each course pairs short lessons with one practical lab. Courses marked In development have a published outline only; none is for sale until it opens.', `<div class="ac-grid ac-grid-3">${courseCards}</div>`)}
${sect('paths', 'Where to start', 'A suggested order by goal. The courses are independent, so you can start with any of them.', `<div class="ac-grid">${ROLES.map(([h, ids]) => `<div class="ac-card"><h3>${esc(h)}</h3><ol class="ac-list">${ids.map((id) => `<li><a href="${byId[id].path}">${esc(byId[id].short)}</a></li>`).join('')}</ol></div>`).join('')}</div>`)}
${sect('how', 'How every course works', null, `<div class="ac-grid ac-grid-3">${cat.learn.map((l) => `<div class="ac-card"><h3>${esc(l.title)}</h3><p>${esc(l.text)}</p></div>`).join('')}</div>`)}
${sect('status', 'What is open and what is planned', null, `<div class="ac-note"><p><strong>${nOpen} of ${courses.length} courses are open.</strong> ${nOpen === 0 ? 'All six are in development.' : ''} A course page that says In development shows the intended lessons and lab, and the dates are not fixed. To hear when one opens, use the request button on its page. No Intellica credential is issued for this academy; an open course issues a completion certificate under its published rule.</p></div>
<p class="ac-fine">Looking for the technical tracks? See the <a href="/training/architecture-academy/">Software Architecture Academy</a> and the <a href="/training/cybersecurity/academy/">Cyber Security Academy</a>.</p>`)}
`;
const html = page({ title: 'AI for Business Academy | Intellica Training', description: 'Six practical courses for putting AI agents to work in data, software, marketing, projects and your own business, with a lab in every course and honest status for each.', canonicalPath: BASE, body, css: ['/training/catalog.css', '/training/architecture-academy/academy.css'] })
  .replace('<!-- Generated by tools/build-training.mjs from site/training/training.json. Edit the data, not this file. -->', '<!-- Generated by tools/build-ai-business-academy.mjs from site/training/catalog.json. Edit the data, not this file. -->');
const file = path.join(ROOT, 'site', BASE, 'index.html');
if (CHECK) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== html) { console.error('ai business academy: page is stale. Run: node tools/build-ai-business-academy.mjs'); process.exit(1); } console.log('ai business academy: page is current'); }
else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html); console.log('ai business academy: 1 page written'); }
