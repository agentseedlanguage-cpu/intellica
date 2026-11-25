// HTML pieces for the course catalogue: the six-level architecture path, the agentic-era series, the certificate.
// Used by build-training.mjs (index page, arc42 page) and build-catalog.mjs (the course pages).
import { esc, kicker, cols, site } from './training-shell.mjs';
import { LEVELS as CYBER_LEVELS } from './cyber-academy/levels.mjs';

export const wa = (t) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t)}`;
export const lessonCount = (c) => c.modules.reduce((n, m) => n + m.lessons.length, 0);

/* Level 2, Mastering arc42, is the arc42 workshop and online course from training.json; levels 1 and 3 to 6 come from catalog.json. */
export function allLevels(catalog, arc) {
  const l2 = { n: 2, id: 'arc42', path: arc.path, title: 'Mastering arc42', short: 'Mastering arc42', lead: arc.lead, live: true, price: arc.course && arc.course.price ? arc.course.price.label : '' };
  return [l2, ...catalog.ladder.levels].sort((a, b) => a.n - b.n);
}

export function levelPath(levels, current) {
  return `<ol class="lvl-path" aria-label="The ${levels.length} levels">${levels.map((l) => `<li${l.n === current ? ' aria-current="step" class="is-here"' : ''}><a href="${l.path}"><b>${l.n}</b><span>${esc(l.short)}</span>${l.live ? '<i>Live workshop</i>' : ''}</a></li>`).join('')}</ol>`;
}

const card = (c, tag) => `
        <article class="cat-card">
          <p class="cat-tag">${esc(tag)}${(c.price || (c.course && c.course.enabled && c.course.price && c.course.price.label)) ? `<span class="cat-price">${esc(c.price || c.course.price.label)}</span>` : ''}${c.live ? '<span class="cat-status is-live">Live workshop too</span>' : ''}</p>
          <h3><a href="${c.path}">${esc(c.title)}</a></h3>
          <p>${esc(c.lead)}</p>
          <a class="cat-go" href="${c.path}">See the course <span aria-hidden="true">\u2192</span></a>${c.live ? `
          <a class="cat-go" href="${c.path}course/#get-t" data-access data-learn="${c.path}course/learn/" data-probe="${c.path}course/data/part-2-1-goals.json" data-probe-id="part-2-1-goals">Get access</a>` : ''}
        </article>`;

/* The whole catalogue as one list of tracks. Every course is a permanent online course; live workshops are a separate, dated thing. */
export function catalogSections(catalog, arc, startN) {
  const levels = allLevels(catalog, arc);
  const sr = catalog.series;
  const academyCourseIds = new Set((catalog.academies || []).flatMap((a) => a.courses || []));
  const track = (id, title, lead, items, tag) => `
      <div class="track" id="track-${id}">
        <h3>${esc(title)}</h3>
        <p class="sub">${esc(lead)}${id === 'architecture' ? ' <a href="/training/architecture-academy/">See the whole Architecture Academy</a>.' : ''}</p>
        <div class="cat-grid">${items.map((l) => card(l, tag(l))).join('')}
        </div>
      </div>`;
  return `
    <section class="t-block" id="courses" aria-labelledby="crs-t">
      ${kicker(startN, 'Courses')}
      <h2 id="crs-t">Every course, online, yours to keep</h2>
      <p class="sub">${esc(catalog.coursesLead)}</p>
      ${track('architecture', catalog.ladder.title, catalog.ladder.lead, levels, (l) => `Level ${l.n} of ${levels.length}`)}
      ${catalog.tracks.map((t) => track(t.id, t.title, t.lead, sr.courses.filter((c) => c.track === t.id && !academyCourseIds.has(c.id)), () => 'Online course')).join('')}
    </section>`;
}

/* The academies on the training page: one card each, with an honest status. Data: catalog.json "academies". */
export function academiesBlock(catalog, arc) {
  const list = catalog.academies || [];
  if (!list.length) return '';
  const levels = allLevels(catalog, arc);
  const nOpen = levels.filter((l) => Boolean(l.live || (l.course && l.course.enabled))).length;
  const card = (a) => {
    const n = a.id === 'architecture' ? levels.length : a.levels;
    const status = a.id === 'architecture' ? `${nOpen} of ${levels.length} levels open` : a.status;
    return `
        <article class="cat-card">
          <p class="cat-tag">${esc(a.tag)} \u00b7 ${n} levels<span class="cat-status is-live">${esc(status)}</span></p>
          <h3><a href="${a.path}">${esc(a.title)}</a></h3>
          <p>${esc(a.lead)}</p>
          <a class="cat-go" href="${a.path}">See the academy <span aria-hidden="true">\u2192</span></a>
        </article>`;
  };
  return `<section class="t-block" id="academies" aria-labelledby="acad-t">
      <p class="eyebrow">Professional development</p>
      <h2 id="acad-t">Explore our academies</h2>
      <p class="sub">Explore each academy’s progression, available courses and practical outcomes. Start at the level that matches your experience and goals.</p>
      <div class="cat-grid">${list.map(card).join('')}
      </div>
    </section>`;
}

export function featuredBlock(catalog) {
  const f = catalog.featured, c = catalog.series.courses.find((x) => x.id === f.id);
  return `<section class="t-block feat" aria-labelledby="feat-t">
      <p class="eyebrow">${esc(f.kicker)}</p>
      <h2 id="feat-t"><a href="${c.path}">${esc(f.title)}</a></h2>
      <p class="feat-line">${esc(f.line)}</p>
      <ul class="facts-list">${f.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="actions"><a class="btn btn-primary" href="${c.path}">See the course</a>${academyOf(catalog, c.id) ? `<a class="btn btn-ghost" href="${academyOf(catalog, c.id).path}">${esc(academyOf(catalog, c.id).title)}</a>` : ''}<a class="btn btn-ghost" href="#courses">All courses</a></div>
    </section>`;
}

export function certificateBlock(catalog, n, { id = 'certificate' } = {}) {
  const c = catalog.certificate;
  return `<section class="t-block" id="${id}" aria-labelledby="${id}-t">
      ${kicker(n, 'Certificate')}
      <h2 id="${id}-t">A certificate you can verify and share</h2>
      <p class="sub">${esc(c.text)}</p>
      <div class="two">
        <div><h3>To earn it</h3><ol class="cert-criteria">${c.criteria.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div>
        <div><h3>What you get</h3><ul class="facts-list"><li>A credential ID and a public page that confirms it</li><li>Add to LinkedIn in one click</li><li>Share on LinkedIn, X or Facebook, or copy the link</li><li>Save as a PDF</li></ul></div>
      </div>
      <p class="muted">${esc(c.scope)}</p>
    </section>`;
}

/* The academy a catalogue course belongs to, if catalog.json "academies" lists it (by "courses"). */
const academyOf = (catalog, id) => (catalog.academies || []).find((a) => (a.courses || []).includes(id));

export function coursePage(c, { catalog, levels, kindLabel, series }) {
  const lessons = lessonCount(c);
  const isLive = Boolean(c.course && c.course.enabled);
  const interest = wa(`Hello, I would like to hear when "${c.title}" opens.`);
  const nav = levels
    ? `<p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="/training/#track-architecture">Software architecture</a><span aria-hidden="true"> / </span>Level ${c.n}</p>`
    : c.id === 'cybersecurity'
      ? `<p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="/training/cybersecurity/academy/">Cyber Security Academy</a><span aria-hidden="true"> / </span><a href="/training/cybersecurity/academy/level-2/">Level 2</a></p>`
      : `<p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="/training/#track-${c.track || 'build'}">${c.track === 'run' ? 'Run and grow a business' : 'Build and secure agentic systems'}</a><span aria-hidden="true"> / </span>${esc(c.short)}</p>`;
  let n = 0;
  return `
    <nav class="subnav" aria-label="${esc(c.title)}">
      ${nav}
      <a class="sn-code" href="/training/my-courses/">Enter access code</a>
    </nav>

    <section class="t-hero t-hero-single" aria-labelledby="c-title">
      <div class="t-hero-copy">
        <p class="cat-tag"><span>${esc(kindLabel)}</span></p>
        <h1 id="c-title">${esc(c.title)}</h1>
        <p class="lead">${esc(c.lead)}</p>
        ${c.course && c.course.enabled ? `<div class="actions"><a class="btn btn-primary" href="${c.path}course/">Preview course lessons</a><a class="btn btn-ghost" href="${c.path}course/#get-t">Enrol — ${esc(c.course.price.label)}</a><a class="btn btn-ghost" href="#syllabus">See the syllabus</a></div>
        <p class="fine">Lessons ${c.course.free.join(' and ')} ${c.course.free.length > 1 ? 'are' : 'is'} available as free previews. ${esc(c.course.price.note)} Questions? <a href="${esc(wa(`Hello, I would like to ask about "${c.title}".`))}" rel="noopener">Contact sales</a>.</p>` : `<div class="actions"><a class="btn btn-primary" href="${esc(interest)}" rel="noopener">Request release information</a><a class="btn btn-ghost" href="#syllabus">Review curriculum outline</a></div>
        <p class="fine">This level is in development. Contact Intellica for release information; this page will be updated as additional course materials are published.</p>`}${academyOf(catalog, c.id) ? `
        <p class="fine">Part of the <a href="${academyOf(catalog, c.id).path}">${esc(academyOf(catalog, c.id).title)}</a>. ${c.academyPosition ? esc(c.academyPosition) : 'See the published level outcomes, progression routes and delivery status.'}</p>` : ''}
      </div>
    </section>
${levels ? `
    <section class="t-block lvl-wrap" aria-label="Where this level sits">${levelPath(levels, c.n)}</section>
` : ''}
    <section class="t-strip" aria-label="At a glance">
      <dl>
        ${isLive ? `<div><dt>${lessons} lessons</dt><dd>in ${c.modules.length} modules</dd></div>
        <div><dt>${c.lab.steps.length}-step guided lab</dt><dd>${esc(c.lab.title)}</dd></div>
        <div><dt>Course certificate</dt><dd>Verifiable completion record</dd></div>
        <div><dt>Your pace</dt><dd>Self-paced; no fixed deadlines</dd></div>` : `<div><dt>Planned curriculum</dt><dd>${lessons} proposed lessons in ${c.modules.length} modules</dd></div>
        <div><dt>Practical work</dt><dd>${c.lab.steps.length} proposed lab steps</dd></div>
        <div><dt>Delivery status</dt><dd>In development</dd></div>`}
      </dl>
    </section>

    <section class="t-block" id="why" aria-labelledby="why-t">
      ${kicker(++n, isLive ? 'Why now' : 'Rationale')}
      <h2 id="why-t">${isLive ? 'Why this course, and why now' : 'Why this level matters'}</h2>
      <p class="pull">${esc(c.why)}</p>
      ${c.benchmark ? `<p class="fine">External reference: <a href="${esc(c.benchmark.url)}" rel="noopener">${esc(c.benchmark.label)}</a>. ${esc(c.benchmark.note)}</p>` : ''}
    </section>

    <section class="t-block" id="able" aria-labelledby="able-t">
      ${kicker(++n, isLive ? 'Outcomes' : 'Target competencies')}
      <h2 id="able-t">${isLive ? 'What you will be able to do' : 'Intended learning outcomes'}</h2>
      ${cols(c.outcomes, 'c4')}
    </section>

    <section class="t-block" id="syllabus" aria-labelledby="syl-t">
      ${kicker(++n, isLive ? 'Syllabus' : 'Planned scope')}
      <h2 id="syl-t">${isLive ? `${lessons} lessons in ${c.modules.length} modules` : `Proposed scope: ${lessons} lessons in ${c.modules.length} modules`}</h2>
      ${isLive ? '' : '<p class="sub">This outline describes the intended curriculum. Lesson materials and assessments are not yet available.</p>'}
      <div class="syl">${c.modules.map((m, i) => `
        <div class="syl-m"><h3><span>Module ${i + 1}</span>${esc(m.title)}</h3>${m.note ? `<p class="muted">${esc(m.note)}</p>` : ''}
          <ol>${m.lessons.map((l) => `<li>${esc(l)}</li>`).join('')}</ol></div>`).join('')}
      </div>${c.honesty ? `
      <p class="muted">${esc(c.honesty)}</p>` : ''}
    </section>

    <section class="t-block" id="lab" aria-labelledby="lab-t">
      ${kicker(++n, isLive ? 'The lab' : 'Planned practical work')}
      <h2 id="lab-t">${esc(c.lab.title)}</h2>
      <p class="sub">${isLive ? `${esc(c.lab.text)} ${esc(c.lab.intro)}` : `Proposed project: ${esc(c.lab.text)} This practical component will be developed and validated before the level opens.`}</p>
      <div class="two">
        <div><h3>The steps</h3><ol class="lab-steps">${c.lab.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>
        <div><h3>${isLive ? 'What the health check looks for' : 'Intended validation criteria'}</h3><ul class="lab-checks">${c.lab.checks.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      </div>
    </section>

    <section class="t-block" id="learn" aria-labelledby="learn-t">
      ${kicker(++n, 'How you learn')}
      <h2 id="learn-t">${isLive ? 'Evidence-led learning method' : 'Proposed learning design'}</h2>
      ${cols(catalog.learn, 'c4')}
      <p class="muted">${isLive ? 'The method follows published research on retrieval practice, worked examples and spaced review.' : 'The proposed learning design draws on retrieval practice, worked examples and spaced review; detailed learner materials will be published before release.'} <a href="/training/#how-t">Read the evidence and sources</a>.</p>
    </section>

    ${isLive ? certificateBlock(catalog, ++n) : ''}

    <section class="t-block" id="who" aria-labelledby="who-t">
      ${kicker(++n, isLive ? 'Who it is for' : 'Intended audience')}
      <h2 id="who-t">${levels ? 'What it builds on' : 'What you need'}</h2>
      <p class="sub">${esc(c.needs)}</p>
      <div class="actions"><a class="btn btn-primary" href="${esc(interest)}" rel="noopener">${isLive ? "Contact sales" : "Request release information"}</a><a class="btn btn-ghost" href="/training/">All training</a></div>
    </section>`;
}

/* Training hero: three balanced destinations, generated from the academy and course sources. */
export function courseTiles(catalog, arc) {
  const architectureLevels = allLevels(catalog, arc);
  const cyberAcademy = (catalog.academies || []).find((a) => a.id === 'cybersecurity');
  const academyCourseIds = new Set((catalog.academies || []).flatMap((a) => a.courses || []));
  const standalone = catalog.series.courses.filter((c) => !academyCourseIds.has(c.id));
  const tile = (href, top, name, extra = '') => `<a class="tile${extra ? ' is-course-level' : ''}" href="${href}"><span class="tile-top">${esc(top)}</span><span class="tile-name">${esc(name)}</span>${extra ? `<span class="tile-note">${esc(extra)}</span>` : ''}</a>`;
  const card = (id, label, title, href, lead, tiles) => `<section class="tile-group" aria-labelledby="${id}">
      <p class="hero-card-kicker">${esc(label)}</p><h2 class="hero-card-title" id="${id}"><a href="${href}">${esc(title)}</a></h2><p class="hero-card-lead">${esc(lead)}</p>
      <div class="tiles">${tiles.join('')}</div></section>`;
  const architecture = architectureLevels.map((l) => tile(l.path, `Level ${l.n}`, l.short));
  const cyber = CYBER_LEVELS.map((l) => tile(`${cyberAcademy.path}${l.id}/`, l.n === 2 ? 'Level 2 · 28 lessons' : `Level ${l.n}`, l.n === 2 ? 'Application Cyber Security' : l.short, l.n === 2 ? 'The Level 2 online course' : ''));
  const other = standalone.map((c) => tile(c.path, 'Course', c.short));
  return `<nav class="hero-tiles" aria-label="Explore academies and standalone courses">
    ${card('hero-architecture', 'Professional learning path', 'Architecture Academy', '/training/architecture-academy/', 'Six levels in software architecture, from foundations to architecture leadership.', architecture)}
    ${card('hero-cyber-security', 'Professional learning path', 'Agentic Cyber Security', cyberAcademy.path, 'Six levels in cyber security for agentic environments. Level 2 is the 28-lesson course.', cyber)}
    ${card('hero-other-courses', 'Standalone learning', 'Other Courses', '#courses', 'Focused courses not yet grouped into an academy. Explore the current six offerings.', other)}
  </nav>`;
}

/* The Architecture Academy page: the six levels with honest statuses, and what is and is not available. */
export function academyPage(catalog, arc) {
  const levels = allLevels(catalog, arc);
  const open = (l) => Boolean(l.live || (l.course && l.course.enabled));
  const price = (l) => l.price || (l.course && l.course.price && l.course.price.label) || '';
  const row = (l) => `
        <article class="cat-card">
          <p class="cat-tag">Level ${l.n}${price(l) ? `<span class="cat-price">${esc(price(l))}</span>` : ''}<span class="cat-status">${open(l) ? 'Available now' : 'Planned'}</span></p>
          <h3><a href="${l.path}">${esc(l.title)}</a></h3>
          <p>${esc(l.lead)}</p>
          <a class="cat-go" href="${l.path}">${open(l) ? 'See the course' : 'See the plan'} <span aria-hidden="true">→</span></a>
        </article>`;
  const nOpen = levels.filter(open).length;
  return `
    <nav class="subnav" aria-label="Architecture Academy">
      <p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span>Architecture Academy</p>
      <a class="sn-code" href="/training/my-courses/">Enter access code</a>
    </nav>

    <section class="t-hero t-hero-single" aria-labelledby="ac-title">
      <div class="t-hero-copy">
        <p class="cat-tag"><span>Software architecture · ${levels.length} levels</span></p>
        <h1 id="ac-title">Intellica Architecture Academy</h1>
        <p class="lead">${esc(catalog.ladder.lead)} ${nOpen} of the ${levels.length} levels currently have published courses available. The remaining levels are in development and are shown with their intended outcomes and scope.</p>
      </div>
    </section>

    <section class="cat-section" aria-labelledby="ac-levels">
      <h2 id="ac-levels">Six-level professional pathway</h2>
      ${levelPath(levels, 0)}
      <div class="cat-grid">${levels.map(row).join('')}
      </div>
    </section>

    <section class="cat-section" aria-labelledby="ac-how">
      <h2 id="ac-how">How the academy works</h2>
      <div class="cols">
        <div><h3>Applied architecture work</h3><p>Each available course develops a practical architecture artefact through guided tasks, worked examples and structured self-review. The course page explains the scope and limits of its health checks.</p></div>
        <div><h3>Preview before enrolment</h3><p>Each available course includes free preview lessons so you can inspect the teaching approach and course materials before enrolling.</p></div>
        <div><h3>Clear progression requirements</h3><p>Each level page publishes its intended outcomes, prerequisites, available learning materials and current delivery status.</p></div>
      </div>
    </section>

    <section class="cat-section" aria-labelledby="ac-honest">
      <h2 id="ac-honest">Programme scope and credential status</h2>
      <ul class="plain">
        <li>Level 1 is independent Intellica self-study aligned to the published iSAQB CPSA-F curriculum version 2025.1. It is not an iSAQB course, and Intellica is not an iSAQB-accredited training provider. The iSAQB examination is separate and is administered under the rules of an authorised certification body. The current public CPSA-F curriculum is 2025.1; a 2027.1 release candidate is published for an effective date of 1 April 2027, and Intellica will version its mapping before that date.</li>
        <li>The mock examinations use original Intellica practice questions derived from public curriculum topics. They are not official iSAQB examination questions and cannot guarantee a pass.</li>
        <li>The current course certificates record completion under their published course rules. They are not iSAQB credentials. Intellica’s independently assessed higher-level credentials remain in development.</li>
        <li>Levels marked Planned do not yet have an available course. Their pages identify the intended scope; contact Intellica for release information.</li>
      </ul>
    </section>`;
}
