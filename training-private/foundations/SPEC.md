# Authoring brief: Intellica Level 1, Software Architecture Foundations

Independent Intellica self-study that follows the topics of the public iSAQB CPSA-F curriculum 2025.1-rev2. It is NOT an iSAQB course. Never write "official", "accredited", "iSAQB certified" or "real exam questions". All text is original: write in your own words, do not copy curriculum text, and DO NOT read, copy, paraphrase or reconstruct the public iSAQB mock exam.

Audience: developers with 18+ months of team experience, new to architecture. Tone: plain, concrete, friendly, short sentences, no acronyms without spelling them out first, no marketing language, British spelling. No em-dashes used as drama; avoid filler.

Facts: if you are not sure of a fact, check it (WebSearch/WebFetch) or leave it out. Do not invent statistics, quotations, company stories or sources. A case study must start "Illustrative case." if invented. Allowed anchors: arc42 documentation (docs.arc42.org), ISO/IEC 25010:2023, ISO/IEC/IEEE 42010:2022, Parnas 1972 (information hiding), Bass/Clements/Kazman "Software Architecture in Practice", Nygard's decision records, Brown's C4 model, Fowler, Hohpe, Evans. Cite only sources you are sure exist.

Shared case: **ClinicBook**, a synthetic booking system for small clinics. Patients book, move and cancel appointment slots on web and phone; receptionists manage calendars; an external payment provider takes deposits; an external messaging provider sends reminders; clinics are in several time zones; patient data is sensitive. Use it for examples. Labs let the learner use their own system or ClinicBook. All data is synthetic.

Module map (Intellica unit -> curriculum goals, ids are in training-private/foundations/curriculum-map.json):
1 What Software Architecture Is and What Architects Do (01-01..01-06): definitions, structures and building blocks, decisions, goals and benefits, long-term impact, architect tasks, relations to developers/product owners/testers/operations/project managers, other architecture domains. Misconceptions: architecture is just diagrams; the architect decides alone; it is frozen up front; a framework choice is an architecture.
2 Stakeholders, Requirements and Constraints (02-01, 02-02, 02-05, 01-06): concerns, functional and quality requirements, constraints (technical, organisational, regulatory), assumptions, influencing factors, conflicting goals; requirement vs constraint vs decision vs assumption vs preference; explicit over implicit.
3 Quality Attributes and Measurable Scenarios (02-03, 02-04): quality characteristics (ISO 25010 is a checklist), trade-offs, scenario structure (source, stimulus, environment, artefact, response, response measure), numbers and baselines, no vague words.
4 Design Approaches and Decomposition (03-01, 03-02, 03-03, 03-05): fulfilling requirements through structure, top-down and bottom-up, iterative design, view-based development, building-block identification, responsibilities, feedback loops and risk, premature microservices.
5 Design Principles and Patterns (03-04, 03-08, 03-09): abstraction, modularisation, encapsulation/information hiding, separation of concerns, coupling and cohesion, dependency inversion, conceptual integrity, complexity reduction, error handling and robustness; layers, pipes and filters, client-server, event-driven, modular monolith, services; a few design patterns; principles conflict and requirements decide.
6 Interfaces, Contracts and Data Models (03-06, 03-07, 04-06, 01-07): interface design and documentation, dependencies between building blocks, cycles, data models, data ownership, contracts, compatibility, versioning.
7 Runtime Views and Distributed Systems (03-12, 04-05): runtime scenarios, sequence/activity views, sync vs async, timeouts, retries, duplicate delivery, ordering, partial failure, consistency (Foundation depth only).
8 Deployment and Infrastructure (03-11, 04-05): deployment view, nodes, environments, infrastructure dependencies, separation of dev/test/production, single points of failure, deployment constraints, operations concerns.
9 Cross-Cutting Concepts (03-10, 04-07): persistence, communication, security, authentication/authorisation, error handling, logging/monitoring, transactions, configuration, UI; why they touch many building blocks; documenting them.
10 Documenting and Communicating Architecture (04-01, 04-02, 04-03, 04-05, 04-08, 04-09): documentation requirements, stakeholder-specific communication, views, notations (UML, C4 as examples), diagrams as abstractions, decision records with alternatives, arc42 as ONE practical structure (CC BY-SA 4.0; credit arc42.org when you adapt its structure), tools.
11 Analysing and Assessing Architecture (05-01, 05-02, 05-03): why analyse, quality risks, evidence sources (documentation, models, code, metrics, tests, logs, runtime measurements) and their limits, conformance to decisions, scenario-based review at Foundation depth.
12 Worked Example: The Integrated Case Study (06-01, 06-02): trace requirements and constraints to decisions, views and implementation using ClinicBook; three requirements traced end to end; open issues and risks.
13 AI-Assisted Architecture Work (Intellica extension; not in 2025.1): using AI assistants as helpers, not authorities: hallucinated constraints, fabricated sources, diagram/code mismatch, stale generated docs, privacy of confidential architecture, automation bias, human accountability, a verification workflow and a provenance log. Say plainly this is Intellica extension content and that the next curriculum release candidate adds AI topics that are not final.
14 Exam Strategy and the Final Mock (Intellica; supports the external exam): how a ~40-question multiple-choice exam works (single choice, choose N, allocation), how to read stems (polarity words like NOT, BEST), time allocation, elimination, confidence calibration, exam-day plan, how to use the Intellica mock exams and readiness report. State that exam format and rules belong to the iSAQB certification bodies and must be checked before booking; training is not required to sit the exam; the Intellica mocks are original practice, not real questions.

Exam facts you may state: the exam is about 40 multiple-choice questions in about 75 minutes with a 60% pass mark (check the certification body); R1 goals are examined, R2 may be, R3 are not; chapter 6 (examples) is not examined.

## File formats (must pass `node tools/validate-foundations.mjs lessons|bank`)

### Lesson files: training-private/foundations/lessons-NN.mjs, `export default [ {...}, ... ]`
Study the format of training-private/quality-decisions/part1.mjs (one lesson object). Each lesson:
{ n, title (EXACTLY as in curriculum-map.json "lessons"), lead (20+ words, plain),
  slides: EXACTLY 8 x [title, objective ("Explain..", "Apply.." etc.), principle (1-2 sentences), evidence ("Evidence from the field": concrete, checkable fact, named source, or a clearly marked illustrative example; 20+ words), response ("Engineering response": what to do), check (a retrieval question that makes the learner think)],
  guide: 2-3 paragraphs of 40+ words each (the field guide), case: 'Illustrative case. ...' 60+ words using ClinicBook or another small system,
  lab: { title, intro (names the learner's own system or ClinicBook), tasks: 4-5 tasks each 8+ words and each producing something checkable, evidence: 'what to include', model: markdown model solution for ClinicBook, 80+ words, may use \n and lists },
  rubric: 4 x [criterion, missing, partial, competent],
  quiz: EXACTLY 5 x [question, [4 options], correctIndex, explanation 8+ words] (recall and understanding checks; spread correct positions over at least 3 of 4 slots),
  sources: 2+ strings like 'arc42 documentation, section 5. docs.arc42.org/section-5/' }
Slides should build a teaching arc: define, show an example, show a plausible weaker alternative and why it is weaker, name the common misconception, apply to ClinicBook, then a checklist/summary. Each slide stands alone but together they teach. Use R1 goals for applied depth. R3 goals: context only. Do not repeat the same sentence structure on every slide.

### Question bank: training-private/foundations/bank-<name>.mjs, `export default [ {...} ]`
Original practice items for exam-style mock exams. Fields:
 id 'F-C03-017' (C = chapter 1..5, 3-digit running number from 001 in YOUR chapter file),
 type 'single' | 'multi' | 'classify',
 ch (1-5), lg [goal ids from curriculum-map.json IN THAT CHAPTER, R1 or R2 goals preferred; never only an R3 goal],
 cog 'recall'|'understand'|'apply' (at least 60% must be 'understand' or 'apply'; prefer short scenarios), diff 1|2|3,
 stem (state polarity clearly: "Which statement is correct?" / "Which is NOT ...?"; multi stems say "Select TWO" etc.),
 single: options [4-5], key (index), wrong [one entry per option: '' for the correct one, a one-line misconception for each wrong one],
 multi: options [5-6], key [indexes], pick (= key.length), wrong [same shape; '' for each correct option],
 classify: cats [two labels], items [4-6 x {t, c:0|1}], (no options/wrong),
 why: explanation of why the key is right (15+ words).
Rules: one defensible best answer; distractors are plausible misconceptions, not trick wording; no "all of the above"/"none of the above"; vary the position of the correct option; avoid absolutes ("always", "never") as the tell; options of similar length; no item may be answerable from the stem alone; no two items test the same fact the same way; mix types roughly 70% single, 20% multi, 10% classify. Spread difficulty 25% diff1, 50% diff2, 25% diff3.
Every claim must be true under the curriculum topic and standard sources. Quarantine anything contested rather than guessing.

Run the validator on your files before you finish and fix every problem. Do not touch any file you were not assigned. Report: files written, counts, anything you were unsure of.
