// HTML pieces for the course catalogue: the six-level architecture path, the agentic-era series, the certificate.
// Used by build-training.mjs (index page, arc42 page) and build-catalog.mjs (the course pages).
import { esc, kicker, cols, site } from './training-shell.mjs';

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
      <h2 id="crs-t">Practical courses, built around real work</h2>
      <p class="sub">${esc(catalog.coursesLead)}</p>
      ${track('architecture', catalog.ladder.title, catalog.ladder.lead, levels, (l) => `Level ${l.n} of ${levels.length}`)}
      ${catalog.tracks.map((t) => track(t.id, t.title, t.lead, sr.courses.filter((c) => c.track === t.id), () => 'Online course')).join('')}
      <p class="catalog-academy-note">The original <a href="/training/cybersecurity/">Cybersecurity for the Agentic Era course</a> is part of the <a href="/training/cybersecurity/academy/">Cyber Security Academy</a>, not a separate general-course category.</p>
    </section>`;
}

/* The academies on the training page: one card each, with an honest status. Data: catalog.json "academies". */
export function academiesBlock(catalog, arc) {
  const list = catalog.academies || [];
  if (!list.length) return '';
  const word = ['', 'One', 'Two', 'Three', 'Four'][list.length] || String(list.length);
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
      <p class="eyebrow">Learning paths</p>
      <h2 id="acad-t">${word} academies. Clear paths. Practical work.</h2>
      <p class="sub">Each academy is one path through a field. Open levels are labelled open and planned levels are labelled planned, so you can see where the path goes. Join at the level that fits you.</p>
      <div class="cat-grid">${list.map(card).join('')}
      </div>
    </section>`;
}

export function featuredBlock(catalog) {
  const f = catalog.featured, c = catalog.series.courses.find((x) => x.id === f.id);
  return `<section class="t-block feat" aria-labelledby="feat-t">
      <p class="eyebrow">Featured course · Cyber Security Academy</p>
      <h2 id="feat-t"><a href="${c.path}">${esc(f.title)}</a></h2>
      <p class="feat-line">${esc(f.line)}</p>
      <ul class="facts-list">${f.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="actions"><a class="btn btn-primary" href="${c.path}">Explore the course</a>${academyOf(catalog, c.id) ? `<a class="btn btn-ghost" href="${academyOf(catalog, c.id).path}">${esc(academyOf(catalog, c.id).title)}</a>` : ''}<a class="btn btn-ghost" href="#courses">All courses</a></div>
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
  const interest = wa(`Hello, I would like to hear when "${c.title}" opens.`);
  const nav = levels
    ? `<p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="/training/#track-architecture">Software architecture</a><span aria-hidden="true"> / </span>Level ${c.n}</p>`
    : `<p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="${c.track === 'cyber-academy' ? '/training/cybersecurity/academy/' : '/training/#track-run'}">${c.track === 'cyber-academy' ? 'Cyber Security Academy' : 'Run and grow a business with agents'}</a><span aria-hidden="true"> / </span>${esc(c.short)}</p>`;
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
        ${c.course && c.course.enabled ? `<div class="actions"><a class="btn btn-primary" href="${c.path}course/">Start the free lessons</a><a class="btn btn-ghost" href="${c.path}course/#get-t">Buy the course, ${esc(c.course.price.label)}</a><a class="btn btn-ghost" href="#syllabus">See the syllabus</a></div>
        <p class="fine">Lesson${c.course.free.length > 1 ? 's' : ''} ${c.course.free.join(' and ')} ${c.course.free.length > 1 ? 'are' : 'is'} free to open now. ${esc(c.course.price.note)} Questions? <a href="${esc(wa(`Hello, I would like to ask about "${c.title}".`))}" rel="noopener">Contact sales</a>.</p>` : `<div class="actions"><a class="btn btn-primary" href="${esc(interest)}" rel="noopener">Contact sales</a><a class="btn btn-ghost" href="#syllabus">See the syllabus</a></div>
        <p class="fine">Enrol by message. We confirm what is ready today, send every module as it is released, and you keep every update to this edition.</p>`}${academyOf(catalog, c.id) ? `
        <p class="fine">Part of the <a href="${academyOf(catalog, c.id).path}">${esc(academyOf(catalog, c.id).title)}</a>: where this course sits, the levels around it and what is planned.</p>` : ''}
      </div>
    </section>
${levels ? `
    <section class="t-block lvl-wrap" aria-label="Where this level sits">${levelPath(levels, c.n)}</section>
` : ''}
    <section class="t-strip" aria-label="At a glance">
      <dl>
        <div><dt>${lessons} lessons</dt><dd>in ${c.modules.length} modules</dd></div>
        <div><dt>${c.lab.steps.length}-step lab</dt><dd>${esc(c.lab.title)}</dd></div>
        <div><dt>Certificate</dt><dd>Verifiable and shareable</dd></div>
        <div><dt>Your pace</dt><dd>Any device, no deadlines</dd></div>
      </dl>
    </section>

    <section class="t-block" id="why" aria-labelledby="why-t">
      ${kicker(++n, 'Why now')}
      <h2 id="why-t">Why this course, and why now</h2>
      <p class="pull">${esc(c.why)}</p>
    </section>

    <section class="t-block" id="able" aria-labelledby="able-t">
      ${kicker(++n, 'Outcomes')}
      <h2 id="able-t">What you will be able to do</h2>
      ${cols(c.outcomes, 'c4')}
    </section>

    <section class="t-block" id="syllabus" aria-labelledby="syl-t">
      ${kicker(++n, 'Syllabus')}
      <h2 id="syl-t">${lessons} lessons in ${c.modules.length} modules</h2>
      <div class="syl">${c.modules.map((m, i) => `
        <div class="syl-m"><h3><span>Module ${i + 1}</span>${esc(m.title)}</h3>${m.note ? `<p class="muted">${esc(m.note)}</p>` : ''}
          <ol>${m.lessons.map((l) => `<li>${esc(l)}</li>`).join('')}</ol></div>`).join('')}
      </div>${c.honesty ? `
      <p class="muted">${esc(c.honesty)}</p>` : ''}
    </section>

    <section class="t-block" id="lab" aria-labelledby="lab-t">
      ${kicker(++n, 'The lab')}
      <h2 id="lab-t">${esc(c.lab.title)}</h2>
      <p class="sub">${esc(c.lab.text)} ${esc(c.lab.intro)}</p>
      <div class="two">
        <div><h3>The steps</h3><ol class="lab-steps">${c.lab.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>
        <div><h3>What the health check looks for</h3><ul class="lab-checks">${c.lab.checks.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      </div>
    </section>

    <section class="t-block" id="learn" aria-labelledby="learn-t">
      ${kicker(++n, 'How you learn')}
      <h2 id="learn-t">The same method as every Intellica course</h2>
      ${cols(catalog.learn, 'c4')}
      <p class="muted">The method follows published research on retrieval practice, worked examples and spaced review. <a href="/training/arc42/#research">Read the evidence and sources</a>.</p>
    </section>

    ${certificateBlock(catalog, ++n)}

    <section class="t-block" id="who" aria-labelledby="who-t">
      ${kicker(++n, 'Who it is for')}
      <h2 id="who-t">${levels ? 'What it builds on' : 'What you need'}</h2>
      <p class="sub">${esc(c.needs)}</p>
      <div class="actions"><a class="btn btn-primary" href="${esc(interest)}" rel="noopener">Contact sales</a><a class="btn btn-ghost" href="/training/">All training</a></div>
    </section>`;
}

/* Small boxes for the training header: every course one click away. */
export function courseTiles(catalog, arc) {
  const levels = allLevels(catalog, arc);
  const courses = catalog.series.courses;
  const general = courses.filter((c) => c.id !== 'cybersecurity');
  const tile = (href, top, name, open) => `<a class="tile${open ? ' is-open' : ''}" href="${href}"><span class="tile-top">${esc(top)}</span><span class="tile-name">${esc(name)}</span></a>`;
  const group = (label, note, tiles, className = '') => `<section class="tile-group ${className}" aria-label="${esc(label)}"><h2 class="tile-label">${esc(label)}</h2>${note ? `<p class="tile-note">${esc(note)}</p>` : ''}<div class="tiles">${tiles.join('')}</div></section>`;
  return `<nav class="hero-tiles" aria-label="Explore Intellica learning paths">
        ${group('Architecture Academy', 'Six levels in software architecture', levels.map((l) => tile(l.path, `Level ${l.n}`, l.short, false)), 'tile-architecture')}
        ${group('Cyber Security Academy', 'The original professional course, within a six-level pathway', [tile('/training/cybersecurity/academy/', '6-level pathway', 'Explore the academy', false), tile('/training/cybersecurity/course/', 'Original 28-lesson course', 'Start the course', true)], 'tile-cyber')}
        ${group('Run and grow a business with agents', 'Courses for building, analysing, operating and growing with AI', general.map((c) => tile(c.path, 'Course', c.short, false)), 'tile-general')}
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
        <p class="lead">${esc(catalog.ladder.lead)} Today ${nOpen} of the ${levels.length} levels are open. The rest are planned and are marked that way, so you can see where the path goes without being sold something that does not exist yet.</p>
      </div>
    </section>

    <section class="cat-section" aria-labelledby="ac-levels">
      <h2 id="ac-levels">The path, level by level</h2>
      ${levelPath(levels, 0)}
      <div class="cat-grid">${levels.map(row).join('')}
      </div>
    </section>

    <section class="cat-section" aria-labelledby="ac-how">
      <h2 id="ac-how">How the academy works</h2>
      <div class="cols">
        <div><h3>Hands on at every level</h3><p>Each open course has a lab that builds a real artefact, such as one architecture file for a system, and checks that work with tools you run yourself, not only quizzes.</p></div>
        <div><h3>Free lessons first</h3><p>Every open course has lessons you can read before you pay, so you can judge the teaching before you decide.</p></div>
        <div><h3>Join at your level</h3><p>Start at Level 1, or join where your experience fits. Each level page lists what it covers and what it expects you to know.</p></div>
      </div>
    </section>

    <section class="cat-section" aria-labelledby="ac-honest">
      <h2 id="ac-honest">What the academy is not</h2>
      <ul class="plain">
        <li>Level 1 is independent self-study that follows the topics of the iSAQB Certified Professional for Software Architecture, Foundation Level curriculum. It is not an iSAQB course, and Intellica is not an accredited training provider. The iSAQB exam is separate and is taken through a certification body; check its current rules there.</li>
        <li>The mock exams are original practice questions written by Intellica. They are not real exam questions and do not guarantee a pass.</li>
        <li>An Intellica certificate shows that you completed an Intellica course and met its published rule. Intellica's own assessed credentials for the higher levels are planned, not available.</li>
        <li>Levels marked Planned have no open course yet. Message us on WhatsApp to hear when they open.</li>
      </ul>
    </section>`;
}
