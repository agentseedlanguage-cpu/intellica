#!/usr/bin/env node
// Generates the catalogue course pages /training/<id>/index.html from site/training/catalog.json,
// and the certificate page /training/certificate/. Real HTML, no JavaScript needed. Safe to run repeatedly.
import fs from 'node:fs';
import path from 'node:path';
import { page, esc, SITE } from './training-shell.mjs';
import { allLevels, coursePage, lessonCount, academyPage } from './catalog-html.mjs';

const catalog = JSON.parse(fs.readFileSync(path.join(SITE, 'training', 'catalog.json'), 'utf8'));
const training = JSON.parse(fs.readFileSync(path.join(SITE, 'training', 'training.json'), 'utf8'));
const arc = training.workshops[0];
const levels = allLevels(catalog, arc);
const write = (rel, html) => {
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const bad of [/\bundefined\b/, /\bNaN\b/, /\[object /, /(^|\s)null(\s|$)/]) if (bad.test(visible)) throw new Error(`${rel} would publish a template failure (${bad}). Fix the data or the template.`);
  const f = path.join(SITE, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const CSS = ['/training/catalog.css'];

for (const c of catalog.ladder.levels) {
  write(`training/${c.id}/index.html`, page({
    title: `${c.title} | Level ${c.n} of ${levels.length} | Intellica Training`, description: c.lead, canonicalPath: c.path, ld: null, css: CSS,
    body: coursePage(c, { catalog, levels, kindLabel: `Software architecture · Level ${c.n} of ${levels.length}` }),
  }));
}
for (const c of catalog.series.courses) {
  write(`training/${c.id}/index.html`, page({
    title: `${c.title} | Intellica Training`, description: c.lead, canonicalPath: c.path, ld: null, css: CSS,
    body: coursePage(c, { catalog, levels: null, kindLabel: c.id === 'cybersecurity' ? 'Cyber Security Academy · Level 2' : 'The agentic era' }),
  }));
}

write('training/architecture-academy/index.html', page({
  title: 'Architecture Academy | Intellica Training', description: catalog.ladder.lead, canonicalPath: '/training/architecture-academy/', ld: null, css: CSS,
  body: academyPage(catalog, arc),
}));

// the certificate page: verifies a credential and offers the share actions (training/certificate/certificate.js fills it in)
const titles = Object.fromEntries([[arc.id, arc.title], ...[...catalog.ladder.levels, ...catalog.series.courses].map((c) => [c.id, c.title])]);
write('training/certificate/courses.json', JSON.stringify(titles));
write('training/certificate/index.html', page({
  title: 'Verify a certificate | Intellica Training', description: 'Confirm an Intellica Training certificate by its credential ID.', canonicalPath: '/training/certificate/', ld: null, css: CSS,
  body: `
    <nav class="subnav" aria-label="Certificate"><p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span>Certificate</p></nav>
    <section class="cert-page" data-cert aria-labelledby="cert-t">
      <h1 id="cert-t" class="sr-only">Certificate</h1>
      <div data-cert-body><p class="muted" data-cert-msg role="status">Checking this credential…</p></div>
      <noscript><p class="lead">This page needs JavaScript to look up the credential.</p></noscript>
    </section>`,
}).replace('</head>', '  <meta name="robots" content="noindex">\n</head>').replace('<script type="module" src="/training/training.js"></script>', '<script type="module" src="/training/training.js"></script>\n  <script type="module" src="/training/certificate/certificate.js"></script>'));

console.log(`built catalogue: ${catalog.ladder.levels.length + catalog.series.courses.length} course pages, academy page, certificate page`);
