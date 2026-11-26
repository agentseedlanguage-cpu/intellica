# cp39: lab research, course improvements and agent plan

Status: plan and specification. None of the lab content changes below are built yet, because the lab step text is encrypted with the course key (`npm run sync` needs `.course-key`). The public pages were changed in cp39; the lab engines were not. The main Training page was written to describe only what exists today.

## 1. Lab design standard (apply to every step, all four live courses)
Research leads, to be read and verified by a human before they are quoted publicly (search results seen 2026-11-26, titles only):
- "The Right Kind of Help" (arXiv 2512.11735) and "Scaffolding Metacognition in Programming Education" (arXiv 2511.04144): help should match what the learner needs, and prompts that make learners plan and check their own work beat handing over answers.
- "CodeExemplar: Example-Based Scaffolding" (arXiv 2603.23830): show a worked example first, then fade support.
- Socratic AI tutor work (arXiv 2512.23633, 2608.12292) and a Khanmigo report (KQED MindShift): tutors that withhold answers can frustrate learners, so withholding must be tuned, not absolute.
- Already cited on the Training page: Renkl worked examples and fading; Hattie and Timperley feedback; Ericsson deliberate practice.

Every lab step should have these parts, in this order:
1. Goal in one sentence and the time it should take.
2. "You are done when" list of three to five observable checks (matches the health check).
3. Worked case of the same step for the sample system (ClinicBook, Doubles-to-Go).
4. Starter template with prompts, and snippets.
5. Three tiered hints, revealed one at a time: nudge, pointer, near-answer. Never the model solution.
6. Common mistakes: the three most frequent, each with a bad and a good one-line example.
7. Model solution, opened only after the student saves an attempt.
8. Four-criterion rubric with plain-language descriptors for 0, 1 and 2.
9. "Next step" card: what the next lab step reuses from this one, and what to do if the check fails.

## 2. Course by course
- Level 1 Foundations (14 steps): add tiered hints and common mistakes to each section; add a "map to exam chapter" tag per step; grow the question bank from 124 to 206 (82 pending questions need a human read) and move mocks from 3 to 5.
- Level 2 Mastering arc42 (19 lessons): add a per-section "done looks like" and a one-page quick card; add a "bad arc42" spot-the-flaw exercise for sections 5 to 9.
- Level 3 Quality and Decisions (20 steps): extend the scenario checker so it explains why a scenario is untestable; add three decision-record exemplars of different quality to rank.
- Cyber Level 2 (28 steps): deep-link each lesson to its academy level; add a capture-the-flag style step in the reference lab kit; add a "break your own pack" review where the student attacks their threat model.

## 3. Using agents to make the experience seamless (later, in this order)
1. Hint agent: reads the student's current section, returns tier 1 and 2 hints only. Runs only when the student asks. Needs a server route and a spending cap; today the site has no student accounts and keeps progress in the browser, so this needs an explicit opt-in and a privacy statement.
2. Rubric pre-marker: suggests a score per criterion with a quotation from the student's text as evidence. The student still marks themselves. Label it as a suggestion.
3. Next-step planner: from health checks and rubric scores, proposes what to revisit and which lesson to take next, including the next academy level.
4. Authoring agents (internal): source checking, stale-claim detection against the source register, question-bank generation for human review.
Guardrails: never claim a certificate is awarded by an agent; keep the 7-day refund and honesty statements; log nothing without consent.

## 4. Frontier ideas per live course (to research properly before building)
- Level 1: adaptive spaced review from mock results; 2027.1 AI chapter lesson to be written before 1 April 2027.
- Level 2: generate an arc42 skeleton from a repository (student reviews and edits); agents-as-readers lesson already exists, add an exercise that asks an AI to answer questions from the student's arc42 and scores how well it did.
- Level 3: LLM-drafted decision records critiqued against the student's own scenarios.
- Cyber: runnable adaptive attacks against the student's policy in the lab kit; MCP authorization lab.

## 5. Next checkpoint order
cp40: lab standard applied to Level 1 and Level 2 (needs course key). cp41: Levels 3 and cyber. cp42: Level 4 Agentic AI Architecture.
