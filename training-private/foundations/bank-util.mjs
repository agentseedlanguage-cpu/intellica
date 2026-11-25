// Builders for exam-practice items. Authors write the correct option first; the loader rotates options so correct answers do not cluster.
// S(id, ch, goals, cog, diff, stem, [correct, wrong...], [one misconception note per wrong option], why)
export const S = (id, ch, lg, cog, diff, stem, options, notes, why) => ({ id, type: 'single', ch, lg, cog, diff, stem, options, key: 0, wrong: ['', ...notes], why });
// M(id, ch, goals, cog, diff, stem, [correct x n, wrong...], n, [notes for the wrong options], why)
export const M = (id, ch, lg, cog, diff, stem, options, n, notes, why) => ({ id, type: 'multi', ch, lg, cog, diff, stem, options, key: Array.from({ length: n }, (_, i) => i), pick: n, wrong: [...Array(n).fill(''), ...notes], why });
// C(id, ch, goals, cog, diff, stem, [labelA, labelB], [[text, 0|1]...], why)
export const C = (id, ch, lg, cog, diff, stem, cats, items, why) => ({ id, type: 'classify', ch, lg, cog, diff, stem, cats, items: items.map(([t, c]) => ({ t, c })), why });
