// Placement self-check logic and page glue. Copied to site/training/cybersecurity/academy/placement/placement.js by the builder.
// No storage, no network, no tracking. Answers never leave the browser.
export const PASS = 0.75;

export function scoreAnswers(items, picks) {
  const per = {};
  items.forEach((it, i) => {
    const p = per[it.level] || (per[it.level] = { right: 0, total: 0 });
    p.total += 1;
    if (picks[i] === it.correct) p.right += 1;
  });
  return per;
}

// The level to start at: the first level where the score is below the pass line. All at or above the line: the top level.
export function recommend(per, pass = PASS) {
  const levels = Object.keys(per).map(Number).sort((a, b) => a - b);
  for (const l of levels) if (per[l].right / per[l].total < pass) return l;
  return levels[levels.length - 1];
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('[data-placement]');
  if (form) {
    const qs = Array.from(form.querySelectorAll('[data-q]'));
    const result = document.querySelector('[data-result]');
    const note = document.querySelector('[data-note]');
    const items = qs.map((q) => ({ level: Number(q.dataset.level), correct: Number(q.dataset.correct) }));
    const say = (t) => { note.textContent = t; note.hidden = !t; };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const picks = qs.map((q) => { const c = q.querySelector('input:checked'); return c ? Number(c.value) : null; });
      const answered = picks.filter((p) => p !== null).length;
      if (answered < 6) { say('Answer at least six questions to get a useful result.'); return; }
      say('');
      const per = scoreAnswers(items, picks);
      const rec = recommend(per);
      qs.forEach((q, i) => {
        const right = picks[i] === items[i].correct;
        q.classList.toggle('ac-right', right);
        q.classList.toggle('ac-wrong', !right);
        q.querySelector('[data-why]').hidden = false;
      });
      Object.keys(per).forEach((l) => {
        const el = result.querySelector('[data-score="' + l + '"]');
        if (el) el.textContent = per[l].right + ' of ' + per[l].total;
      });
      result.querySelectorAll('[data-rec-link]').forEach((a) => { a.hidden = Number(a.dataset.recLink) !== rec; });
      result.querySelector('[data-rec]').textContent = String(rec);
      result.querySelector('[data-unanswered]').textContent = answered < qs.length ? (qs.length - answered) + ' unanswered question' + (qs.length - answered === 1 ? ' counts' : 's count') + ' as not correct.' : '';
      result.hidden = false;
      result.scrollIntoView();
    });
    form.addEventListener('reset', () => {
      qs.forEach((q) => { q.classList.remove('ac-right', 'ac-wrong'); q.querySelector('[data-why]').hidden = true; });
      result.hidden = true; say('');
    });
  }
}
