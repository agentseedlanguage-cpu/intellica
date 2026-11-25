#!/usr/bin/env node
// Runs the placement page script against a minimal fake document, so typos in the browser glue are caught without a browser.
// Usage: node tools/test-cyber-academy.mjs
import assert from 'node:assert/strict';

const listeners = {};
const mk = (extra = {}) => ({ hidden: false, textContent: '', dataset: {}, classes: new Set(), classList: { toggle(c, on) { on ? this.owner.classes.add(c) : this.owner.classes.delete(c); }, remove(...c) { c.forEach((x) => this.owner.classes.delete(x)); } }, ...extra });
const own = (e) => { e.classList.owner = e; return e; };

const N = 48;
const qs = Array.from({ length: N }, (_, i) => {
  const why = own(mk({ hidden: true }));
  const q = own(mk({ dataset: { level: String(Math.floor(i / 8) + 1), correct: String(i % 4) }, picked: null, why }));
  q.querySelector = (sel) => (sel === 'input:checked' ? (q.picked === null ? null : { value: String(q.picked) }) : sel === '[data-why]' ? why : null);
  return q;
});
const scores = {}; for (let l = 1; l <= 6; l++) scores[l] = own(mk());
const links = Array.from({ length: 6 }, (_, i) => own(mk({ dataset: { recLink: String(i + 1) }, hidden: true })));
const rec = own(mk()), un = own(mk());
const result = own(mk({ hidden: true, scrolled: false, scrollIntoView() { this.scrolled = true; } }));
result.querySelector = (sel) => { const m = sel.match(/data-score="(\d)"/); return m ? scores[m[1]] : sel === '[data-rec]' ? rec : sel === '[data-unanswered]' ? un : null; };
result.querySelectorAll = () => links;
const note = own(mk({ hidden: true }));
const form = { querySelectorAll: () => qs, addEventListener: (t, f) => { listeners[t] = f; } };
globalThis.document = { querySelector: (s) => (s === '[data-placement]' ? form : s === '[data-result]' ? result : s === '[data-note]' ? note : null) };

const { scoreAnswers, recommend } = await import('./cyber-academy/placement.mjs');
assert.ok(listeners.submit && listeners.reset, 'the script must attach submit and reset handlers');
const submit = () => listeners.submit({ preventDefault() {} });

// too few answers: a message, no result
qs.forEach((q) => { q.picked = null; }); qs[0].picked = 0; submit();
assert.equal(result.hidden, true); assert.match(note.textContent, /at least six/);

// perfect run: top level, every explanation shown, every question marked right
qs.forEach((q) => { q.picked = Number(q.dataset.correct); }); submit();
assert.equal(result.hidden, false); assert.equal(rec.textContent, '6'); assert.equal(scores[3].textContent, '8 of 8');
assert.ok(qs.every((q) => q.classes.has('ac-right') && !q.why.hidden));
assert.deepEqual(links.map((a) => a.hidden), [true, true, true, true, true, false]);

// level 1 weak: start at level 1; only that link visible; wrong answers marked
qs.forEach((q) => { q.picked = q.dataset.level === '1' ? (Number(q.dataset.correct) + 1) % 4 : Number(q.dataset.correct); }); submit();
assert.equal(rec.textContent, '1'); assert.equal(scores[1].textContent, '0 of 8'); assert.equal(links[0].hidden, false);
assert.ok(qs[0].classes.has('ac-wrong') && !qs[0].classes.has('ac-right'));

// unanswered questions count as wrong and are reported
qs.forEach((q) => { q.picked = Number(q.dataset.correct); }); qs[47].picked = null; qs[46].picked = null; submit();
assert.match(un.textContent, /2 unanswered questions count/);
assert.equal(scores[6].textContent, '6 of 8');

// reset hides everything again
listeners.reset();
assert.equal(result.hidden, true); assert.ok(qs.every((q) => q.why.hidden && q.classes.size === 0));

// pure functions
assert.equal(recommend({ 1: { right: 6, total: 8 }, 2: { right: 5, total: 8 } }), 2); // 6/8 = 75% passes, 5/8 does not
console.log('cyber academy placement: all checks passed');
