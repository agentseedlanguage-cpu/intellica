// The cybersecurity course: turns training-private/cybersecurity-source.json (see import-cyber.mjs) and the
// "course" block of the cybersecurity entry in site/training/catalog.json into what build-course.mjs needs:
// a deck of slides, quiz questions, a lab of 28 steps (one growing assurance pack), and the player files.
import fs from 'node:fs';
import path from 'node:path';
import { page, esc as xesc } from './training-shell.mjs';
import * as XT from './cyber-tools/data.mjs';
import { regoTests } from './cyber-tools/rego-tests.mjs';
import { CHECKS } from './cyber-tools/lab-kit.mjs';

export const ID = 'cybersecurity';
// Frontier lessons 21+ and "2026 update" notes live in training-private/frontier.mjs (compact format, see that file).
const FRONTIER_FILE = path.resolve('training-private/frontier.mjs');
const FRONTIER = fs.existsSync(FRONTIER_FILE) ? await import(FRONTIER_FILE) : null;
export function fromCompact(l) {
  const e = (x) => esc(x);
  return { n: l.n, title: l.title, lead: l.lead,
    slides: l.slides.map(([t, obj, core, ev, resp, chk]) => ({ title: t, refs: [], html: `<h2>${e(t)}</h2>\n<p class="objective"><strong>Learning objective</strong> \u2014 ${e(obj)}</p>\n<div class="teaching-grid${ev.split(/\s+/).length > 60 ? ' ev2' : ev.split(/\s+/).length > 28 ? ' ev' : ''}">\n<section class="panel"><h3>Core principle</h3><p>${e(core)}</p></section>\n<section class="panel"><h3>Evidence from the field</h3><p>${e(ev)}</p></section>\n<section class="panel"><h3>Engineering response</h3><p>${e(resp)}</p></section>\n</div>\n<section class="challenge"><div class="challenge-label">RETRIEVAL &amp; DESIGN CHECK</div><p>${e(chk)}</p></section>` })),
    guide: l.guide, case: l.case, lab: l.lab,
    rubric: l.rubric.map(([criterion, missing, partial, competent]) => ({ criterion, missing, partial, competent })),
    quiz: l.quiz.map(([q, o, a, why]) => ({ q, o, a, why })), sources: l.sources || [] };
}
export const COPY = { tools: [['course/lab/policy/', 'Policy tester'], ['course/lab/trace/', 'Trace spotter'], ['course/lab/kit/', 'Reference lab kit'], ['course/lab/changelog/', 'Changelog']], noun: 'assurance pack', own: 'your own assurance pack', doc: 'Your assurance pack', file: 'assurance-pack.md', extra: 'A model solution for every lab, and a rubric to mark your own work', labFor: 'Build your own agent security assurance pack' };
export const slug = (s) => s.toLowerCase().replace(/[§·]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CLAIMS = (() => { try { return JSON.parse(fs.readFileSync(path.resolve('training-private/cybersecurity-claims.json'), 'utf8')); } catch { return { reviewed: { default: '2026-11-21' }, changelog: [] }; } })();
const reviewedOn = (n) => CLAIMS.reviewed[n] || CLAIMS.reviewed.default;
export function load(SITE) {
  const srcFile = path.resolve('training-private/cybersecurity-source.json');
  const catFile = path.join(SITE, 'training', 'catalog.json');
  if (!fs.existsSync(srcFile)) { console.log('cybersecurity course: no training-private/cybersecurity-source.json, skipped (run tools/import-cyber.mjs)'); return null; }
  const catalog = JSON.parse(fs.readFileSync(catFile, 'utf8'));
  const ent = catalog.series.courses.find((x) => x.id === ID);
  const cc = ent && ent.course;
  if (!cc || !cc.enabled) return null;
  const src = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
  if (FRONTIER) src.lessons.push(...FRONTIER.LESSONS.map(fromCompact));
  const site = JSON.parse(fs.readFileSync(path.join(SITE, 'site.json'), 'utf8'));
  const idOf = (title) => slug(title);

  const slides = [];
  for (const l of src.lessons) {
    for (const sl of l.slides) slides.push({ part: l.title, t: sl.title, o: false, e: 0, n: '', h: sl.html });
  }
  const css = fs.readFileSync(path.resolve('tools/cyber-slides.css'), 'utf8');
  const deck = { slides, dgx: () => '', deck: 'cybersecurity', css };

  const quiz = {};
  for (const l of src.lessons) quiz[idOf(l.title)] = l.quiz.map((q) => ({ q: q.q, o: q.o, a: q.a, why: q.why }));

  const modules = ent.modules.map((m) => ({ title: m.title, note: m.note || '', lessons: m.lessons.map((t) => {
    const l = src.lessons.find((x) => idOf(x.title) === idOf(t));
    if (!l) throw new Error(`catalog.json: module "${m.title}" names a lesson that is not in the course file: ${t}`);
    return idOf(l.title);
  }) }));
  const free = (cc.free || []).map((n) => idOf(src.lessons[n - 1].title));

  const w = { id: ID, path: ent.path, title: ent.title, whatsapp: site.whatsapp, facilitator: null };
  const c = { enabled: true, noBoard: true, headline: cc.headline, lead: cc.lead, honesty: cc.honesty, free, skip: [], price: cc.price || null, priceNote: cc.priceNote || '',
    method: cc.method, evidence: cc.evidence, faq: cc.faq, modules, preview: { lesson: idOf(src.lessons[cc.preview.lesson - 1].title), slideTitle: src.lessons[cc.preview.lesson - 1].slides[cc.preview.slide - 1].title } };

  const reading = {};
  for (const l of src.lessons) {
    reading[idOf(l.title)] = [
      { h: 'Field guide', ps: l.guide },
      { h: 'Worked case', ps: [l.case] },
      ...(FRONTIER && FRONTIER.UPDATES[l.n] ? [{ h: '2026 update', ps: [FRONTIER.UPDATES[l.n]] }] : []),
      { h: 'Last reviewed', ps: [`${reviewedOn(l.n)}. See the course changelog for what changed.`] },
      { h: 'How your lab is assessed', ps: ['Mark your own work against these four criteria. Score each 0, 1 or 2.'], head: ['Criterion', '0: Missing', '1: Partial', '2: Competent'], rows: l.rubric.map((r) => [r.criterion, r.missing, r.partial, r.competent]) },
      ...(l.sources && l.sources.length ? [{ h: 'Sources', ps: l.sources }] : []),
    ];
  }
  return { w, c, deck, quiz, lab: (lessons) => buildLab(src, lessons, idOf), reading };
}

/* The lab: one growing assurance pack. Section s<n> belongs to lesson n and holds that lesson's tasks. */
function buildLab(src, lessons, idOf) {
  const sections = [{ key: 'head', title: 'Pack header', short: 'Header', template: [
    '| | |', '|---|---|', '| **System** | _One sentence: the agent system this pack is about, and what it can do_ |', '| **Owner** | _the accountable person_ |', '| **Status** | Draft v0.1 |', '| **Date** | _today_ |', '',
    '**Scope.** _What is in scope for this pack, and what is not._'] }];
  const steps = [];
  for (const l of src.lessons) {
    const key = `s${l.n}`;
    const tpl = [`## ${l.n}. ${l.title}`, '', `**Lab:** ${l.lab.title}`, ''];
    l.lab.tasks.forEach((t, i) => { tpl.push(`**Task ${i + 1}.** ${t}`, '', '_Your answer._', ''); });
    tpl.push(`**Evidence to include:** ${l.lab.evidence}`);
    sections.push({ key, title: `${l.n}. ${l.title}`, short: `§${l.n}`, template: tpl });
    const lesson = lessons.find((x) => x.id === idOf(l.title));
    steps.push({ id: idOf(l.title), title: l.lab.title, sections: [key], minutes: 20, brief: l.lab.intro,
      do: l.lab.tasks, done: [...l.rubric.map((r) => `${r.criterion}: ${r.competent}`), `Evidence: ${l.lab.evidence}`],
      experienced: 'Apply it to a real agent your organization runs, using the real tools, identities and data.', example: l.lab.model,
      free: lesson.free, lessonNum: lesson.num, lessonTitle: lesson.title,
      next: null });
  }
  steps.sort((a, b) => a.lessonNum - b.lessonNum);
  steps.forEach((s, i) => { const nx = steps[i + 1]; s.next = nx ? { id: nx.id, title: nx.title } : null; });
  return { sections, steps };
}

/* Player files: the same course engine as arc42, copied with its own paths and its own browser storage names so that
   the two courses never share a code, progress or lab document. The lab health check is the cybersecurity one. */
/* Two hands-on practice tools, with their fixtures to download: a policy tester and a trace spotter. Free to open. */
function writeTools(out, w) {
  const base = `${w.path}course/lab/`, put = (rel, txt) => { const f = path.join(out, 'lab', rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };
  const src = path.resolve('tools/cyber-tools');
  for (const f of ['data.mjs', 'policy.js', 'trace.js', 'tools.css']) put(`tools/${f === 'data.mjs' ? 'data.js' : f}`, fs.readFileSync(path.join(src, f), 'utf8'));
  put('files/agent_guardrail.rego', XT.REGO);
  put('files/agent_guardrail_test.rego', regoTests());
  put('files/agent-lab-kit.mjs', fs.readFileSync(path.join(src, 'lab-kit.mjs'), 'utf8'));
  put('files/policy-cases.json', JSON.stringify(XT.SCENARIOS.map((s) => ({ title: s.title, input: XT.toRegoInput(s.input), expected: XT.evaluate(s.input).allow ? 'allow' : 'deny' })), null, 2));
  put('files/trace-benign.jsonl', XT.TRACE_GOOD.map((e) => JSON.stringify(e)).join('\n') + '\n');
  put('files/trace-compromised.jsonl', XT.TRACE_BAD.map((e) => JSON.stringify(e)).join('\n') + '\n');
  const nav = (here) => `<nav class="subnav" aria-label="Practice tools"><p class="crumb"><a href="/training/">Training</a><span aria-hidden="true"> / </span><a href="${w.path}">${xesc(w.title)}</a><span aria-hidden="true"> / </span>${here}</p><a class="sn-code" href="/training/my-courses/">Enter access code</a></nav>`;
  const dl = (names) => `<p class="dl">${names.map((n) => `<a class="btn btn-ghost" href="${base}files/${n}" download>${n}</a>`).join('')}</p>`;
  const css = [`${base}tools/tools.css`];
  const policy = `${nav('Policy tester')}
    <section class="t-hero t-hero-single"><div class="t-hero-copy"><p class="eyebrow">Practice tool</p><h1>Policy tester</h1><p class="lead">A deterministic policy decides whether an agent action may run, whatever the model says. Try it, then predict eight decisions. The policy is the same one you can download as Rego and run with OPA.</p></div></section>
    <div class="xt" data-policy>
      <h2>Playground</h2>
      <form data-play class="grid">
        <label>Tool<select name="tool" data-tools></select></label>
        <label>Approval<select name="approval" data-approvals></select></label>
        <label class="chk"><input type="checkbox" name="tainted"> Untrusted input is in the context</label>
        <label class="chk"><input type="checkbox" name="egress"> External write or egress</label>
        <label class="chk"><input type="checkbox" name="aud" checked> Token audience is valid</label>
        <label class="chk"><input type="checkbox" name="pass"> Server passes a caller\u2019s token through</label>
      </form>
      <div data-play-out aria-live="polite"></div>
      <h2>Predict the decision</h2>
      <p class="muted">Eight cases. Choose Allow or Deny, then read the reason. <strong data-score role="status">0 of 0 right</strong></p>
      <ol class="cases" data-cases></ol>
      <h2>Take it with you</h2>
      <p class="muted">Run the same cases against the real policy with <code>opa eval</code> or <code>opa test</code>. Then add a rule of your own and a case that proves it.</p>
      ${dl(['agent_guardrail.rego', 'policy-cases.json'])}
      <p class="muted small">This page mirrors the Rego rule for rule in plain JavaScript so you can explore it in the browser. It is a teaching tool, not a security control.</p>
    </div>
    <script type="module" src="${base}tools/policy.js"></script>`;
  const trace = `${nav('Trace spotter')}
    <section class="t-hero t-hero-single"><div class="t-hero-copy"><p class="eyebrow">Practice tool</p><h1>Trace spotter</h1><p class="lead">Read an agent\u2019s execution trace and mark every step that breaks a rule: taint, approval drift, wrong audience, token passthrough, egress, replay, scope. Then compare with a reference checker you can read and port.</p></div></section>
    <div class="xt" data-trace>
      <label>Trace<select data-which><option value="bad">Compromised run (find the violations)</option><option value="good">Benign run (find nothing)</option></select></label>
      <table><thead><tr><th>#</th><th>Event</th><th>Logged fields</th><th>Your call</th><th>Result</th></tr></thead><tbody data-rows></tbody></table>
      <div class="actions"><button class="btn btn-primary" type="button" data-check>Check my answers</button><button class="btn btn-ghost" type="button" data-run>Run the reference checker</button></div>
      <p role="status" data-res></p>
      <h2>The reference checker</h2>
      <p class="muted">Plain rules over the logged fields. Notice what it needs the log to record: hashes, audiences, scopes, nonces and whether content was isolated. If your logs lack those, no checker can help.</p>
      <pre><code data-code></code></pre>
      ${dl(['trace-compromised.jsonl', 'trace-benign.jsonl'])}
    </div>
    <script type="module" src="${base}tools/trace.js"></script>`;
  const kit = `${nav('Reference lab kit')}
    <section class="t-hero t-hero-single"><div class="t-hero-copy"><p class="eyebrow">Practice kit</p><h1>Reference lab kit</h1><p class="lead">One file, run locally with Node, no packages and no network. It mounts ${CHECKS.length} seeded flaws from lessons 14 and 22 to 28 against a reference control and an unsafe baseline, so you can see what a working control catches and what a common shortcut misses.</p></div></section>
    <div class="xt">
      <h2>Run it</h2>
      <pre><code>node agent-lab-kit.mjs</code></pre>
      <p class="muted">Exit code 0 means the reference blocked every seeded flaw and the unsafe baseline missed every one. Add <code>--json</code> for machine-readable output you can use in CI.</p>
      ${dl(['agent-lab-kit.mjs', 'agent_guardrail.rego', 'agent_guardrail_test.rego'])}
      <h2>What it contains</h2>
      <ul>
        <li>A mock MCP resource server with seeded flaws: wrong audience, token passthrough, a discovery fetch to a private address, a loose issuer check, an unbound state handle, over-broad scope.</li>
        <li>A mock identity and delegation service with expiry, narrowing-only delegation and cascading revocation.</li>
        <li>A containment harness with an egress allow-list and path limits.</li>
        <li>Poisoned memory and tool-description fixtures.</li>
        <li>A tool register that catches a rug pull and a shadowed tool name.</li>
        <li>Approvals bound to the exact arguments, with expiry, and a trace monitor for tainted egress.</li>
      </ul>
      <h2>The checks</h2>
      <table class="tbl"><thead><tr><th>Check</th><th>Lesson</th><th>Seeded flaw</th></tr></thead><tbody>${CHECKS.map((c) => `<tr><td>${c.id}</td><td>${c.lesson}</td><td>${xesc(c.flaw)}</td></tr>`).join('')}</tbody></table>
      <p class="muted small">Everything is synthetic and runs inside one process. The mocks teach the controls; they are not a scanner and they do not test your real systems. To use the kit on your own work, replace a reference function with your implementation and run it again.</p>
      <p class="muted small">The Rego policy and its test file run with <code>opa test</code>. Open Policy Agent was not available when this course was built, so the Rego has been checked structurally against the browser tool and not executed here. Run <code>opa test .</code> yourself to confirm.</p>
    </div>`;
  const changelog = `${nav('Changelog')}
    <section class="t-hero t-hero-single"><div class="t-hero-copy"><p class="eyebrow">Course</p><h1>Changelog</h1><p class="lead">What changed in the course and when. Every lesson also shows the date it was last reviewed. Updates are free to buyers.</p></div></section>
    <div class="xt">${CLAIMS.changelog.map((c) => `<h2>${xesc(c.date)} · ${xesc(c.title)}</h2><ul>${c.items.map((i) => `<li>${xesc(i)}</li>`).join('')}</ul>`).join('')}</div>`;
  put('changelog/index.html', page({ title: 'Changelog | Application Cyber Security for Agentic Environments', description: 'What changed in the course and when.', canonicalPath: `${base}changelog/`, body: changelog, css }));
  put('kit/index.html', page({ title: 'Reference lab kit | Application Cyber Security for Agentic Environments', description: 'A local, Node-only kit with seeded agent security flaws, a reference control and an unsafe baseline.', canonicalPath: `${base}kit/`, body: kit, css }));
  put('policy/index.html', page({ title: 'Policy tester | Application Cyber Security for Agentic Environments', description: 'Explore and test a deterministic agent guardrail policy in the browser.', canonicalPath: `${base}policy/`, body: policy, css }));
  put('trace/index.html', page({ title: 'Trace spotter | Application Cyber Security for Agentic Environments', description: 'Find taint, approval drift, audience and passthrough violations in an agent execution trace.', canonicalPath: `${base}trace/`, body: trace, css }));
}

export function engineFiles(out, w, SITE, cfg) {
  const from = path.join(SITE, 'training', 'arc42', 'course');
  const base = `${w.path}course/`;
  const sub = (src) => src
    .replaceAll('/training/arc42/course/', base)
    .replaceAll("'/training/access.js'", `'${base}access.js'`)
    .replaceAll("'iw-", `'${cfg.prefix}`).replaceAll('"iw-', `"${cfg.prefix}`)
    ;
  const sub2 = (src) => cfg.text ? cfg.text(sub(src)) : sub(src);
  for (const f of ['course.js', 'lab.js', 'board.js', 'board-core.js', 'cert.js', 'pay.js', 'board.css']) {
    fs.writeFileSync(path.join(out, f), sub2(fs.readFileSync(path.join(from, f), 'utf8')));
  }
  fs.writeFileSync(path.join(out, 'access.js'), sub2(fs.readFileSync(path.join(SITE, 'training', 'access.js'), 'utf8')));
  fs.writeFileSync(path.join(out, 'health.js'), fs.readFileSync(path.resolve(cfg.health), 'utf8'));
}

export function writeEngine(out, w, SITE) {
  writeTools(out, w);
  engineFiles(out, w, SITE, { prefix: 'iwc-', health: 'tools/cyber-health.js', text: cyberText });
}

const cyberText = (src) => src
    .replaceAll('Your arc42 so far: ${started} of 12 sections started.', 'Your assurance pack so far: ${started} of 28 sections started.')
    .replaceAll('Your arc42 is yours to keep', 'Your assurance pack is yours to keep').replaceAll("'Open your arc42'", "'Open your pack'")
    .replaceAll('architecture documentation (arc42)', 'agent security assurance pack').replaceAll('-arc42.md', '-assurance-pack.md').replaceAll("|| 'arc42'", "|| 'assurance-pack'")
    .replaceAll('No arc42 sections found. The file needs headings like "## 1. Introduction and Goals".', 'No sections found. The file needs headings like "## 1. Security Foundations for the Agentic Era".')
    .replaceAll('See the finished version (Doubles-to-Go worked example)', 'See a model solution').replaceAll('write the next arc42 section in the lab', 'write the next section of your pack in the lab')
    .replaceAll('sectionsTotal: 12', 'sectionsTotal: 28').replaceAll('checksTotal: 6', 'checksTotal: 5').replaceAll('rec.sections, 12, rec.sections >= 12', 'rec.sections, 28, rec.sections >= 28').replaceAll('rec.checks, 6, rec.checks >= 6', 'rec.checks, 5, rec.checks >= 5')
    .replaceAll('n <= 12', 'n <= 28').replaceAll('arc42.md', 'assurance-pack.md')
    .replaceAll("/:?\\s*architecture documentation.*$/i", "/:?\\s*agent security assurance pack.*$/i").replaceAll('.*arc42.*$', '.*assurance pack.*$');
