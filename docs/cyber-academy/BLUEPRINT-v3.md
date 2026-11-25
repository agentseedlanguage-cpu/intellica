# Cybersecurity for Agentic Environments Academy: Blueprint v3 (reconciliation and research addendum)

Checkpoint CYB-1 (24 November 2026), extended in CYB-2 (25 November 2026; see section 9). This builds on Blueprint v2 (accepted in full). It does three things: reconciles v2 with the live course, verifies the facts v2 depends on, and adds what v2 missed. Nothing in v2 is withdrawn.

## 1. Reconciliation: Blueprint v2 against the live repository

Blueprint v2 audited `cybersecurity_for_the_agentic_era_complete.html` and counted 20 lessons, 240 slides and 20 labs. The live course (IntellicaWeb checkpoint 35) is larger:

| Item | Blueprint v2 | Live course (from `cybersecurity-claims.json`) |
|---|---|---|
| Lessons | 20 | 28 in 7 modules |
| Slides | 240 | 304 |
| Lab steps | 20 | 28 (one per lesson) |
| Knowledge-check questions | 60 (3 per lesson) | 84 |
| Health checks | not covered | 5 |
| Free lessons | not covered | 2 (lessons 1 and 5) |

Lessons 21 to 28 (frontier research, MCP authorisation, skills trust, agent identity) did not exist in the file v2 audited. Several v2 "gaps" are therefore already closed or partly closed. The gap register below replaces v2's list.

### v2 technical-depth gaps against the 28 live lessons

| v2 gap | Live coverage | Status | Register |
|---|---|---|---|
| Agent protocol security (MCP, A2A) | Lessons 6, 26, 27 cover MCP security, authorisation flow and skills trust | MCP closed; other protocols open | G7 |
| Model lifecycle and ML/LLMOps | Lesson 11 (supply chain) only | Open | G1 |
| Model customisation and alignment | Poisoning in 11 and 24 only | Open | G2 |
| AI security evaluation | Lessons 16, 21 | Largely closed; verify regression-suite lab | (audit in phase 2) |
| Agent action safety | Fragments inside 13, 14, 19 | Open | G5 |
| Privacy and sensitive data | Lesson 8 (data security) | Partly open: retention, deletion, training reuse | G4 |
| Multi-agent failure evaluation | Lesson 9 | Partly open: loops, cost exhaustion, correlated failure | G6 |
| Sector safety and OT | Lesson 19 | Partly open | G10 |
| Detection and forensics | Lessons 15, 25 | Largely closed; no ATLAS-mapped detection lab | G8 |

New gaps found in this checkpoint: inference and serving hardening (G3), the Level 1 foundations bridge (G9), the portfolio workflow (G11), and the missing offensive benchmark (G12).

## 2. Verification of facts v2 depends on

Review date 24 November 2026. "Primary" means the owner's own page.

| Claim in v2 | Result | Source quality | Action |
|---|---|---|---|
| ISO/IEC 17024:2026 is the third edition, published March 2026, with AI provisions | Confirmed. The contents list includes clause 6.5 (AI in the certification process) and a clause on how a certification body relates to education and training | Primary (ISO) | Read the full text before designing the separation of teaching and certification |
| GAIPS is the most direct AI platform security exam | Confirmed as the closest for platform security. General purchase 28 July 2026; multiple choice plus CyberLive; proctored; open book; beta FAQ says validity four years | Primary (GIAC) | Keep as first benchmark |
| GAIPS exam facts (v2 gave none) | SANS page: 2 hours, 54 questions, 65% pass mark, 8 domains. GIAC says length and structure may change | SANS primary for the course; GIAC for the exam | Show as indicative only |
| OWASP AISVS 1.0 has 191 requirements, 12 chapters, 3 appendices | Supported by the OWASP repository chapter list and OWASP-linked write-ups. Two blog posts claim 514 requirements in 14 chapters, which conflicts and looks unreliable. A third-party guide says 1.01 has 213 active requirements and that the repository README now names 1.01 | Primary for chapters; secondary for counts | Cite version and chapter list, not a requirement count. Pin 1.0, watch 1.01 |
| (not in v2) AISVS licence | CC BY-SA 4.0 | Primary | Paraphrase and cite identifiers. Copying text brings share-alike duties |
| MITRE ATLAS is a living base with agentic coverage | Confirmed. Monthly releases. MITRE's OpenClaw investigation (9 February 2026) added seven techniques. Counts differ between sources (for example 129 techniques at v2026.10 in one, other figures elsewhere) | Primary for the investigation; secondary for counts | Cite a release version, never a count |
| NIST work on agents | The AI Agent Standards Initiative launched 17 February 2026 under CAISI; page updated August 2026. A programme, not a standard | Primary (NIST) | Teach as direction of travel |
| EU AI Act timing (v2 left open) | The Digital Omnibus on AI, Regulation (EU) 2026/1744, is reported in force from 27 July 2026. High-risk obligations for stand-alone systems move to 2 December 2027 and for embedded systems to 2 August 2028. Most transparency duties still apply from 2 August 2026 | Secondary (law-firm commentary) | Confirm against the Official Journal before any teaching material states a date |

Not independently verified in this checkpoint: the incident reports and papers in v2's "research update sources" (the OpenAI and Hugging Face incident, the METR and Redwood investigation, the UK AISI incident report, the TanStack npm response, the Semantic Kernel CVEs, and the listed academic papers). Lessons 21 to 25 already draw on frontier sources. Before a new lesson cites any of them, read the primary document and record the access date in the lesson changelog.

## 3. What v2 missed or under-weighted

1. **A second and third external benchmark.** GIAC now lists GAIPT (AI Penetration Tester; seven objectives including agents, orchestration and MCP servers), GASAE (AI Security Automation Engineer) and GOAA (Offensive AI Analyst; ten objectives). Level 5 should map to GAIPT. Level 4 can reference GASAE for automation.
2. **Licence handling.** AISVS is share-alike. ISO and many exam outlines are protected. The source register states how each is used.
3. **Counts rot.** ATLAS and AISVS counts disagree across sources and change monthly. Pages cite versions and release dates.
4. **Teaching and certifying under one roof.** ISO/IEC 17024:2026 has a clause on how a certification body relates to training. Intellica both teaches and plans to certify. The scheme must separate teaching from the certification decision from day one.
5. **Level 1 assumes foundations newcomers may lack.** A short bridge (P9) is needed or Level 1 silently excludes career changers.
6. **A single evolving portfolio needs a lesson of its own (P11),** not just a platform feature.
7. **Dated legal content.** The EU AI Act timetable changed in 2026. Level 6 content carries review dates and a change trigger.

## 4. Gap register and planned lessons

Thirteen planned lessons close the register (G1 to G13 to P1 to P13). Full specifications are in `LESSON-SPECS.md`. Summary:

| Lesson | Title | Level | Closes |
|---|---|---|---|
| P1 | Model pipelines: data, training, registry and signing | 2 | G1 |
| P2 | Fine-tuning, adapters and alignment: poisoning, backdoors and limits | 2 | G2 |
| P3 | Inference, serving and AI infrastructure hardening | 3 | G3 |
| P4 | Privacy, sensitive data and logging in agent systems | 2 | G4 |
| P5 | Agent action safety: approvals, previews and emergency stop | 3 | G5 |
| P6 | Multi-agent failure and cascade testing | 3 | G6 |
| P7 | Agent-to-agent protocols: discovery, authentication and replay | 3 | G7 |
| P8 | Detection engineering with MITRE ATLAS | 4 | G8 |
| P9 | Foundations bridge: networks, operating systems, cloud and cryptography | 1 | G9 |
| P10 | Sector safety and operational technology boundaries | 6 | G10 |
| P11 | The Secure Agentic Enterprise Dossier | 1 | G11 |
| P12 | External exam orientation (public objectives, original practice items) | 2 | G12 |
| P13 | Mapping agent controls to NIST: CSF, Cyber AI Profile and SP 800-53 overlays | 3 | G13 |

## 5. Assessment engineering (proposed; not yet standard-set)

| Level | Knowledge items | Observed practical or design work | Pass rule |
|---|---|---|---|
| 1 | Blueprint-balanced bank, unseen form | One timed lab task and a threat model | Both components passed |
| 2 | Scenario items | Build-and-verify task with negative tests that must fail closed | Practical passed; items above cut score |
| 3 | Short scenario items | Architecture dossier and oral defence | Dossier and defence passed |
| 4 | Scenario items | Live incident simulation and post-incident report | Simulation scored on containment and evidence |
| 5 | Scenario items | Scoped engagement in the lab, evidence pack, retest | Report reviewed against a published rubric |
| 6 | None as the main route | Programme, board paper, independent oral defence | Panel decision |

Rules for every level: separate practice and assessment item pools; track item exposure and retire items; double-mark a sample of practical work and record assessor agreement; publish appeals and accommodation rules before launch; no AI-only decision on a candidate. ISO/IEC 17024:2026 is a design benchmark only.

## 6. Lab safety architecture (carried from v2, confirmed as a release gate)

Deny-by-default egress; synthetic data only; disposable, short-lived credentials; resettable snapshots; per-learner quotas and expiry; instructor-visible audit logs; no live third-party targets; written scope for any offensive lab. Lesson 23 already teaches containing agents and evaluation environments, and the academy labs use the same rules.

## 7. Release gates added by this addendum

A level cannot be marked "available" until: every live and planned lesson in it has an outcome, a lab, an artefact and a source list with access dates; the gap register has no open item for that level; the claims checker passes; the source register has no "recheck" entry older than 30 days for a source the level cites.

## 8. Proposed next checkpoints

- **CYB-2:** write P1 and P2 (the two GAIPS gaps) using the course's existing lesson format; run in the Codespace where `.course-key` lives.
- **CYB-3:** P5, P6, P7 (action safety, cascade testing, agent protocols), plus a practice lab for each.
- **CYB-4:** P8, P9, P11 (detection lab, foundations bridge, portfolio template).
- **CYB-5:** P3, P4, P10, P12; academy search and per-level progress view.
- Throughout: link the academy from the cybersecurity course page by a patch script once the data model for that page is confirmed, so no shared file is replaced.

## 9. CYB-2 addendum (25 November 2026): research, parity and the placement check

### Sources moved from "carried" to "verified"
| Source | Finding on 25 November 2026 | Quality |
|---|---|---|
| OWASP Top 10 for Agentic Applications 2026 | ASI01 to ASI10 names confirmed. The list introduces the principle of "least agency", which Level 3 already teaches | OWASP announcement and press coverage; read the primary PDF before quoting |
| NIST AI RMF | AI RMF 1.0 is still current; AI 600-1 final since 26 July 2024; revision in progress with no public draft seen; a concept note for a critical-infrastructure profile was released 7 April 2026. NIST has not named a successor, so "AI RMF 2.0" is unofficial | Primary (NIST page) plus a third-party tracker |
| NIST SSDF | SP 800-218 v1.1 final; Revision 1 (SSDF 1.2) is a draft from 17 December 2025; SP 800-218A final | Primary (NIST CSRC) |

### New material not in Blueprint v2 or CYB-1
- **NIST Cyber AI Profile (NISTIR 8596):** bridges CSF 2.0 and the AI RMF. A preliminary draft was out for comment to 30 January 2026.
- **SP 800-53 control overlays for securing AI systems (COSAiS):** a draft outline for predictive AI appeared in January 2026. Overlays for generative and agentic AI were reported as planned but unscheduled. When published, they will be the control language auditors ask for. This opens gap G13 and lesson P13.
Both come from secondary sources (law-firm and consultancy alerts). Read the NIST publication pages before building the lesson.

### Parity with the Architecture Academy (cp36)
See `ACADEMY-PARITY.md`. Summary: the Architecture Academy is ahead on shipped product (three levels open as separate online courses, per-level prices, 124 mock exam items); the Cybersecurity Academy is ahead on public structure (level plans, pathways, source register, policy, roadmap). CYB-2 brings the cyber hub into the same visual and wording format as the architecture hub, adds both academies to the training page, and adds a 48-question placement check.

### Question volume (honest count)
| | Lesson quiz | Mock or placement | Total |
|---|---|---|---|
| Architecture Level 1 (cp36) | 70 | 124 mock items | 194 |
| Cybersecurity (CYB-2) | 84 | 48 placement items | 132 |
The cyber academy is behind on volume. Target for CYB-3: a practice bank of at least 200 original items in separate pools (practice, placement, future assessment), authored per lesson as each planned lesson is written, with machine checks for shape and balance, and human review before any item is used for assessment.
