# Cybersecurity Academy checkpoints

Own file, so it never collides with `CHECKPOINTS.md` (shared with the architecture chats).

## How a checkpoint is applied (same flow as the architecture courses)

From the repository root in Codespaces:

1. Upload the zip and run `unzip -o intellica-cyb-N.zip`
2. `npm run deploy -- home` (its gate runs `sync` and the site checks first)
3. `git add -A && git commit -m "Cyber academy CYB-N" && git push`

A checkpoint zip contains only files the cyber academy owns (listed in `CYB-N-MANIFEST.txt`). It never contains `package.json`, `catalog.json`, `training.json`, the worker files, `CHECKPOINTS.md` or any generated file shared with other chats (`sitemap.xml`, `site-manifest.json`). `sync` regenerates the sitemap and manifest on deploy.

The academy tools are not part of `sync` or `check`, so nothing here can stop a deploy. The generated pages are committed output, like every other training page. To rebuild after editing the data: `node tools/build-cyber-academy.mjs`. To check it on demand: `node tools/check-cyber-academy.mjs`.

## CYB-2 (25 November 2026): both academies on the training page, placement check, NIST research

Based on checkpoint 36. Apply the zip on top of the current repository, then deploy as usual. This checkpoint changes five shared files from checkpoint 36 (listed in `CYB-2-MANIFEST.txt` under "shared files changed"). If the architecture chat has produced a newer checkpoint since 36, apply that first, then ask for this checkpoint to be rebuilt on it.

- Training page: new "Academies" block with both academies; featured cybersecurity course links to its academy; the cybersecurity course page links back. Data: `academies` in `catalog.json`.
- Cyber hub: same components and wording as the architecture hub; level cards, "How the academy works", "What the academy is not", "Enter access code".
- New: Find your level, a 48-question placement check (8 per level), scored in the browser with no storage or network.
- Research: OWASP Agentic Top 10, NIST AI RMF, SSDF verified; NIST Cyber AI Profile and SP 800-53 AI overlays added; gap G13 and lesson P13.
- Parity review of both academies in `docs/cyber-academy/ACADEMY-PARITY.md`.
- Tests: `node tools/test-cyber-academy.mjs` (placement script against a fake document) and `node tools/check-cyber-academy.mjs`. Neither is wired into `sync`, `check` or `test`.

## CYB-1 (24 November 2026)

New: the Academy (13 public pages under `/training/cybersecurity/academy/`), its builder, checker and data, Blueprint v3 and twelve lesson specifications.

- Pages: landing, six level pages, pathways, lesson map, GAIPS mapping, standards and sources, certification policy, roadmap and gap register.
- Data: `tools/cyber-academy/levels.mjs`, `meta.mjs`, `sources.mjs`. Lesson titles, the free lessons and all counts are read from the live course when the pages are built.
- Not touched: the course, its encrypted lessons, `.course-key`, payments, certificates, the cybersecurity catalogue page, `package.json`.
- Not yet done: no link from the cybersecurity course page or the training index to the academy. The pages are reachable by address and appear in the sitemap after `sync`. Linking is a deliberate next step.
- Rollback: delete `site/training/cybersecurity/academy/` (everything else in the zip is inert tooling and docs), or `git revert` the commit.
