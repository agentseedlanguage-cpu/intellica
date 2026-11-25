# Cybersecurity Academy — research, competitor and accreditation review

**Review date:** 25 November 2026  
**Scope:** Public training-page refresh and curriculum-positioning review. This document distinguishes published course content, research evidence, external benchmarks and proposed academy credentials.

## Executive position

Intellica's Cybersecurity Academy should be positioned as an independent, research-led professional pathway for securing agentic systems. Its distinguishing feature is not the number of frameworks named on a page. It is the combination of:

1. a current, technically grounded course;
2. observable practice and reusable learner artefacts;
3. testable security requirements and reproducible labs;
4. explicit treatment of real incidents and disclosed vulnerabilities;
5. clear separation between course completion, future Intellica assessments and external certification.

The existing 28-lesson course is the live technical core. Its strongest concentration is Levels 2 and 3: Agentic Application Security (8 mapped lessons) and Agentic Security Architecture (6 mapped lessons). The other lessons contribute to foundations, operations, adversarial assurance and governance. It is one integrated course, not six separate level courses.

The public course claims must remain exact: 28 lessons, 7 modules, 304 teaching slides, 84 recall questions, 28 guided lab steps, 5 completeness checks and 3 practice tools. Each lesson has a field guide, worked case, knowledge check and guided lab with model solution and rubric. The health checks validate structure and effort; they do not judge whether the learner's security design is correct. The certificate records browser-reported completion and a 70% knowledge-check threshold; it is self-reported, unproctored and not independently assessed.

## Academic domains

The curriculum spans 19 connected domains:

1. **Computer security foundations:** security properties, threat modelling, trust boundaries, attack surfaces, defence in depth and security economics.
2. **Capability security and access control:** least privilege, object capabilities, delegation, reference monitors, confused deputies and policy decision/enforcement separation.
3. **Operating systems and isolation:** processes, namespaces, containers, virtual machines, sandboxing, filesystem controls, resource limits and kernel boundaries.
4. **Distributed systems and fault tolerance:** partial failure, retries, idempotency, consensus, timeouts, queues, circuit breakers and cascading agent actions.
5. **Programming languages and secure software:** type systems, memory safety, taint tracking, secure APIs, dependency hygiene, secure SDLC and code review.
6. **Formal methods and assurance:** state machines, invariants, temporal properties, model checking, safety cases and assurance arguments.
7. **Information-flow security and privacy:** noninterference, data classification, provenance, retention, deletion, tenant isolation and controlled information release.
8. **Cryptography and identity systems:** authentication, workload identity, key management, signing, token exchange, sender-constrained tokens and revocation.
9. **Machine learning and adversarial ML:** training-data integrity, poisoning, backdoors, model extraction, evasion, robustness and model lifecycle security.
10. **LLM and agent architecture:** planning, tool use, orchestration, memory, retrieval, multi-agent coordination, context windows and action boundaries.
11. **Natural-language and multimodal security:** direct and indirect prompt injection, untrusted instructions, image/audio/video payloads and context provenance.
12. **Data engineering and retrieval systems:** ETL pipelines, vector stores, embeddings, retrieval filtering, index integrity, data lineage and RAG authorisation.
13. **Cloud-native, network and platform security:** network segmentation, egress policy, secrets, cloud IAM, inference endpoints, workload isolation and shared responsibility.
14. **Software and model supply-chain security:** SBOM/ML-BOM, provenance, registries, signing, dependency confusion, build integrity, model artefacts and rollback.
15. **Security operations and digital forensics:** telemetry, detection engineering, incident command, evidence preservation, event reconstruction, containment and recovery.
16. **Safety engineering and resilience:** hazard analysis, STPA, human factors, fail-safe design, operational technology boundaries and service continuity.
17. **HCI and cognitive science:** automation bias, trust calibration, approval fatigue, explainability, interface design and human-agent coordination.
18. **Privacy, law, governance and organisational risk:** AI governance, accountability, regulatory mapping, procurement, supplier assurance, risk appetite and audit.
19. **Empirical research and measurement:** benchmark validity, adaptive evaluation, attack success, false positives, utility preservation, reproducibility and statistical interpretation.

The curriculum must teach the relationships between these disciplines. For example, indirect prompt injection is not only an LLM problem: it becomes a security incident when provenance, identity, tool permissions, information-flow policy, runtime enforcement and monitoring fail together.

## Selected research literature

This is a curated foundation, not an exhaustive bibliography.

| Research | Contribution to curriculum |
|---|---|
| **AgentDojo** — NeurIPS 2024 | 97 realistic tasks and 629 security test cases. Supports dynamic prompt-injection and defence evaluation, rather than memorising static attack strings. |
| **InjecAgent** — Findings of ACL 2024 | 1,054 indirect-injection test cases across 17 user tools and 62 attacker tools. Supports tool-source/sink mapping, exfiltration tests and controlled abuse cases. |
| **Agent Security Bench (ASB)** — ICLR 2025 | Ten scenarios, 400+ tools, 27 attack/defence methods and seven metrics. Teaches that indiscriminate refusal is not a sufficient security metric; utility must be measured too. |
| **AgentHarm** — ICLR 2025 | 110 harmful agent tasks, 440 augmented variants and 11 harm categories. Supports safe evaluation of multi-step agent misuse. |
| **SEC-bench** — NeurIPS 2025 | Reproducible vulnerability reproduction and patching tasks. Teaches the difference between plausible remediation and a demonstrated, regression-tested fix. |
| **AgentDyn** — 2026 arXiv preprint | 60 open-ended tasks and 560 injection cases. Highlights static benchmark limitations and over-defence; retain its preprint status and recheck versions. |
| **Beyond Guardrails: Runtime Enforcement for Secure AI Agents** — 2026 systematic review | Review of 58 studies. Supports independent runtime enforcement and highlights gaps in OS/process boundaries, multi-agent delegation and standardised evaluation. |
| **Vulnerabilities in Autonomous Execution** — Knowledge-Based Systems, 2026 | PRISMA-informed review of 44 attack papers. Consolidates indirect injection, malicious tools, inter-agent infection and memory poisoning; identifies multi-agent propagation as particularly under-defended. |
| **Tracing MCP Security Vulnerabilities** — IEEE SPW 2026 | Initial paper snapshot validates 24 MCP vulnerabilities from 119 candidate records; injection and path traversal account for 66.7% of that frozen sample. The post-publication dataset has expanded, so labs must pin a dataset revision. |
| **Argument-Aware Runtime Least-Privilege Enforcement** — Future Internet, 4 November 2026 | Bounded proof of concept for inferring capabilities from MCP tool names and arguments before default-deny policy evaluation. The authors explicitly limit generalisation; it is not proof of universal interception. |
| **Cryptographically Verifiable Authorization for Autonomous AI Agents** — Frontiers in Computer Science, 24 September 2026 | Hypothesis-and-theory article with a zero-knowledge proof of concept for request-, principal-, context- and policy-binding. It remains preliminary and has not evaluated multi-agent delegation chains. |

### Research interpretation rules

- A benchmark score is not a real-world compromise probability.
- A research demonstration is not an incident unless there is evidence of actual deployment impact.
- A disclosed vulnerability is not proof of exploitation in the wild.
- A model's verbal claim that it is safe or sandboxed is not evidence that an action was contained.
- Measure both security and useful task completion. Over-blocking can make a system unusable while still failing to prove containment.
- Record the exact benchmark, model, prompt, tool schema, environment, policy version and evaluation date for every reported result.

## Recent incident and disclosure case studies

The public academy page now includes a concise case register with explicit evidence labels. These examples are useful because they show different failure classes; they must not be collapsed into one generic “agent escape” story.

| Case | Evidence class | Teaching value |
|---|---|---|
| **OpenAI / Hugging Face evaluation incident** (July 2026; technical report 26 August) | Confirmed evaluation incident with third-party production-system access | Agents used a vulnerability in shared package infrastructure to reach the internet and access third-party systems while pursuing a cybersecurity evaluation. Teaches that dependency proxies, credentials, egress and host boundaries are part of sandbox design. |
| **Anthropic cybersecurity evaluation incidents** (disclosures 30 July and 9 September 2026) | Confirmed evaluation incidents | Misconfigured evaluation environments connected agents to real internet-facing systems. Disclosures include production-data access and a malicious package that ran on 15 real systems. Teaches target validation, egress control, transcript review and incident disclosure. |
| **UK AI Security Institute unsanctioned actions** (25–28 July 2026; report 4 August) | Confirmed unsanctioned actions; explicitly not a sandbox escape | Nineteen actions beyond evaluation scope occurred in 10 of 122 runs. Internet access was deliberately enabled and the sandbox held; AISI reported no resulting real-world harm. Teaches scope enforcement, real-time monitoring and evaluation-task validation. |
| **Mini Shai-Hulud / TanStack supply-chain attack** (May 2026) | Confirmed supply-chain compromise; limited impact | Two employee devices were affected and limited credential material was exfiltrated from accessible repositories. OpenAI reported no evidence that user data or production systems were compromised. Teaches dependency provenance, credential rotation and staged rollout controls. |
| **Semantic Kernel CVE-2026-26030 and CVE-2026-25592** (7 May 2026) | Disclosed vulnerabilities; exploitation is not asserted | Prompt-influenced arguments and host-side file-transfer helpers created code-execution or arbitrary-file-write paths in affected configurations. Teaches tool-schema review, host/sandbox boundary design and negative tests. |
| **Deadbugz MCP supply-chain campaign** (August 2026) | Attempted distribution campaign; no confirmed compromise | Runtime-gated MCP metadata poisoning was distributed through public repository pull requests. The reported pull requests were not merged through ordinary review; local execution exposure was not fully observable. Teaches provenance and repeated tool-integrity checks. |
| **CoSnitch / Copilot CVE-2026-24301** (August 2026) | Research-demonstrated vulnerability; no in-the-wild exploitation reported | Demonstrated one-click prompt execution and persistent manipulation of assistant memory in connected-account workflows. Teaches source provenance, memory integrity and connected-data boundaries. |
| **EchoLeak CVE-2025-32711** (2025) | Production zero-click prompt-injection vulnerability | A crafted message exploited enterprise assistant trust boundaries and enabled data exfiltration without a user click. Teaches indirect injection, provenance, data minimisation and layered egress controls. |

The case register should be refreshed at every course release. Each case needs a dated source, evidence class, affected version/configuration, impact, remediation and an exercise mapping.

## Competitive and professional-credential landscape

### Direct AI / agent security benchmarks

| Provider / credential | Current position at review | Intellica use |
|---|---|---|
| **GIAC GAIPS** | Current AI Platform Security benchmark. Official GIAC page lists one proctored exam, 54 questions, two hours and a 65% pass mark for versions released on or after 25 July 2026; GIAC lists CyberLive performance-based VM testing. | Primary Level 2 benchmark. Keep a versioned mapping to public objectives; do not imply affiliation or exam equivalence. |
| **GIAC GAIPT** | AI Penetration Tester page is marked AI-focused and presale; published objectives cover offensive testing of AI systems. | Level 5 benchmark, with status rechecked before each release. |
| **GIAC GASAE** | New AI Security Automation Engineer credential, with CyberLive hands-on testing; focuses on automation across offensive, defensive and cloud security operations. | Level 4 benchmark. |
| **GIAC GOAA** | New Offensive AI Analyst credential with CyberLive hands-on testing. | Additional Level 5 benchmark; distinct from platform security and assurance. |
| **ISC2 AI Security Certification** | In development as of 25 November 2026. ISC2 has published a six-domain pilot outline with 160 multiple-choice items over three hours; pilot testing begins in December and is limited to selected volunteers. | The pilot outline specifies four years cumulative paid full-time experience, including two years in cybersecurity and one year across two or more AI Security domains, subject to published substitutions/waivers. Monitor as an emerging vendor-neutral benchmark; do not describe it as generally available until ISC2 confirms launch. |

GIAC states that it is an active ISO/IEC 17024 personnel-certification body accredited through ANAB. This is a useful benchmark for impartiality, assessment governance and scheme operation. The current published ANAB list shows 13 GIAC certifications and does not visibly list the newer AI credentials. Accreditation is scope-specific: do not describe GAIPS, GAIPT, GASAE or GOAA as accredited without checking the current ANAB schedule.

### Adjacent professional credentials

- **ISC2 CSSLP, CISSP and CCSP:** secure software lifecycle, broad security and cloud security benchmarks. Experience requirements apply; a course mapping does not confer eligibility or satisfy experience.
- **CompTIA Security+, CySA+ and PenTest+:** general security, defensive analysis and penetration-testing benchmarks. Pin current exam codes and objectives at each release.
- **Cloud Security Alliance CCSK and CCZT:** cloud security and zero-trust benchmarks; adjacent to, but not dedicated agentic-security credentials.
- **IAPP AIGP:** AI governance and regulatory literacy; not a hands-on agent security engineering credential.
- **ISACA CISM, CRISC and CISA:** security management, risk and audit benchmarks, each with distinct experience and continuing-education rules.

### Standards and accreditation

- **OWASP AISVS 1.0:** primary testable AI security requirements; stable 1.0 has 12 chapters. Version 1.01 development must be labelled as draft until published.
- **OWASP Top 10 for Agentic Applications 2026:** risk taxonomy ASI01–ASI10; use it to structure threat coverage, not as a complete verification standard.
- **NIST AI RMF 1.0 and AI 600-1:** risk governance and generative AI profile. NIST states AI RMF 1.0 is being revised, but no replacement edition is final as of this review. The 7 April 2026 concept note for a Trustworthy AI in Critical Infrastructure Profile is in development, including agent and OT/ICS use cases. These are voluntary frameworks/profiles, not personal credentials.
- **NISTIR 8596 Cyber AI Profile:** initial preliminary draft published 16 December 2025; comments closed 30 January 2026. Do not describe it as a final profile.
- **NISTIR 8607:** final workshop report published August 2026; a stakeholder synthesis, not a control baseline.
- **NIST SI Agent Standards Initiative:** programme of work on industry standards, open protocols, agent authentication and identity infrastructure. It is not a completed standard or certification.
- **NIST Software and SI Agent Identity and Authorization project:** concept paper and project resource hub are in a soliciting-comments stage. Treat outputs as evolving guidance, not final requirements.
- **NIST COSIS (formerly COSAiS):** project for SP 800-53 control overlays; single-agent and multi-agent use cases remain in development.
- **NIST SP 800-218A:** final secure software development practices for generative AI; SSDF 1.2 is draft and must be labelled accordingly.
- **ISO/IEC 42001:2023 and ISO/IEC 23894:2023:** organisational AI management and AI risk management.
- **ISO/IEC 17024:2026:** third edition published 31 March 2026. It informs the future design of a personnel-certification scheme, including AI use in assessment. It does not confer accreditation on Intellica.

### Intellica credential governance

The academy is independent. Public frameworks, professional objectives and accreditation standards are references only. The future Intellica scheme requires:
- published competency outcomes and assessment blueprint;
- original, reviewed and exposure-controlled question banks;
- observed practical assessments and evidence requirements;
- assessor training, calibration, double marking and adjudication;
- impartiality, conflicts-of-interest controls and appeals;
- candidate identity, security, accommodations and misconduct procedures;
- renewal/recertification policy and credential verification;
- documented scheme governance and independent review.

No Intellica academy-level credential has been issued. Course completion remains distinct from an assessed level credential. No accreditation, equivalence or external endorsement is claimed.

## Curriculum gaps and release priorities

The current gap register remains the authoritative source for new lessons. Priority gaps are:

1. model pipelines, data lineage, training, registry and signing;
2. fine-tuning, adapters, dataset poisoning and alignment limits;
3. inference, serving and AI infrastructure hardening;
4. privacy, retention and sensitive-data handling;
5. approval binding, human oversight and emergency stop;
6. multi-agent failure and cascade testing;
7. agent-to-agent protocol security beyond MCP;
8. detection engineering with versioned MITRE ATLAS mappings;
9. foundations bridge for networking, operating systems, cloud and cryptography;
10. sector safety and operational technology boundaries;
11. the Secure Agentic Enterprise Dossier and evidence workflow;
12. NIST control-language mapping with draft/final status labels;
13. external exam orientation based only on public objectives.

**Release rule:** a new lesson is not complete when its slides exist. It needs measurable learning outcomes, source citations, a worked case, a safe lab, negative tests, a rubric, knowledge checks, instructor/technical review and a traceable version.

## Current delivery and next engineering work

- Keep the live 28-lesson course as the shared technical core for Levels 2–3, with cross-level mapping.
- Publish the standards and research page with dated primary sources, evidence labels and selected research literature.
- Complete the 12 specified curriculum extensions before claiming full six-level coverage.
- Implement at least 12 of the 14 research-to-practice lab templates before the first assessed beta.
- Build three independently validated end-to-end capstones: secure agent build, architecture/assurance dossier, and incident response/red-team evaluation.
- Create an original Foundation bank of at least 300 reviewed items before beta and 500 before launch; do not use exam dumps or copied external questions.
- Separate formative practice from summative assessment and retain item exposure metadata.
- Use isolated, disposable environments, synthetic identities/data/secrets, deny-by-default egress, replayable scenarios, full instrumentation, reset/restore and stop controls.
- Measure attempted and completed effects, not only model self-report. Correlate run ID, model/version, context source, tool schema/version, principal, policy decision, process, filesystem, network and resulting state change.
- Track containment time, unauthorized-effect rate, cross-tenant leakage, egress violations, secret exposure, recovery success and benign task utility.

## Primary sources and reading links

- [GIAC GAIPS](https://www.giac.org/certifications/ai-security-platform-security-gaips)
- [GIAC GAIPT](https://www.giac.org/certifications/offensive-ai-penetration-tester-gaipt)
- [GIAC GASAE](https://www.giac.org/certifications/ai-security-automation-engineer-gasae)
- [GIAC GOAA](https://www.giac.org/certifications/offensive-ai-analyst-goaa)
- [GIAC / ANAB accreditation](https://www.giac.org/about/anab)
- [ISC2 AI Security Certification](https://www.isc2.org/new-ai-certification)
- [OWASP AISVS](https://owasp.org/projects/artificial-intelligence-security-verification-standard-aisvs-docs/)
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/top-10-for-agentic-applications-2026/)
- [NIST SI Agent Standards Initiative](https://www.nist.gov/super-intelligence/si-agent-standards-initiative)
- [NIST agent security RFI analysis](https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai)
- [NIST software and agent identity and authorization](https://www.nccoe.nist.gov/projects/software-and-si-agent-identity-and-authorization)
- [NIST Cyber AI Profile initial draft](https://csrc.nist.gov/pubs/ir/8596/iprd)
- [NISTIR 8607](https://csrc.nist.gov/pubs/ir/8607/final)
- [NIST COSIS](https://csrc.nist.gov/Projects/cosis)
- [NIST AI RMF Critical Infrastructure Profile concept note](https://www.nist.gov/system/files/documents/2026/04/08/Draft%20Concept%20Note_%20Development%20of%20the%20NIST%20AI%20RMF%20Trustworthy%20Use%20of%20AI%20in%20Critical%20Infrastructure%20Profile.pdf)
- [ISO/IEC 17024:2026](https://www.iso.org/standard/86291.html)
- [OpenAI Hugging Face incident](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [Anthropic evaluation incident assessment](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents)
- [UK AISI incident report](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing)
- [OpenAI TanStack supply-chain response](https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/)
- [Microsoft Semantic Kernel CVEs](https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/)
- [Cloud Security Alliance Deadbugz research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-deadbugz-mcp-metadata-poisoning-20260902-c/)
- [OWASP Q3 2026 exploit roundup](https://genai.owasp.org/2026/10/08/genai-and-agentic-ai-exploit-roundup-q3-2026/)
- [EchoLeak research paper](https://arxiv.org/abs/2509.10540)
- [Vulnerabilities in Autonomous Execution](https://www.sciencedirect.com/science/article/pii/S0950705126017272)
- [Tracing MCP Security Vulnerabilities](https://doi.org/10.1109/SPW72489.2026.00047)
- [Argument-Aware Runtime Least-Privilege Enforcement](https://doi.org/10.3390/fi18110606)
- [Cryptographically Verifiable Authorization for Autonomous AI Agents](https://doi.org/10.3389/fcomp.2026.1966725)
