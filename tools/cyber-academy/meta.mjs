// Academy pathways, planned lessons, gap register, GAIPS working crosswalk, roadmap and policy text.
export const PLANNED = {
  P1: { title: 'Model pipelines: data, training, registry and signing', level: 2, tags: 'AISVS C1, C3, C6', why: 'Closes the GAIPS development-pipelines and MLOps cluster: data lineage, training and fine-tuning pipelines, CI/CD, model registry, artefact signing, evaluation gates and rollback.' },
  P2: { title: 'Fine-tuning, adapters and alignment: poisoning, backdoors and limits', level: 2, tags: 'AISVS C1, C3, C7, C11', why: 'Closes the model customisation and alignment cluster: dataset lineage, backdoor and poisoning risk, safety regression, and why alignment is not a security boundary.' },
  P3: { title: 'Inference, serving and AI infrastructure hardening', level: 3, tags: 'AISVS C4', why: 'Hardened inference and deployment environments, isolation, secrets, network controls, runtime policy and cloud shared responsibility, taught at configuration level.' },
  P4: { title: 'Privacy, sensitive data and logging in agent systems', level: 2, tags: 'AISVS C8; UK and EU data-protection principles', why: 'Prompt and log retention, leakage, minimisation, deletion, training reuse, residency and access control as data moves between tools, providers, logs and retrieval stores.' },
  P5: { title: 'Agent action safety: approvals, previews and emergency stop', level: 3, tags: 'ASI08, ASI09; AISVS C9', why: 'Transaction previews, approval integrity, dual control, irreversible-action limits and bounded autonomy, so a successful injection cannot become an incident.' },
  P6: { title: 'Multi-agent failure and cascade testing', level: 3, tags: 'ASI07, ASI08, ASI10', why: 'Delegation loops, trust propagation, shared memory, correlated failure, recursive tool calls, cost exhaustion and cascading action, with tests that expose them.' },
  P7: { title: 'Agent-to-agent protocols: discovery, authentication and replay', level: 3, tags: 'ASI07; AISVS C9, C10', why: 'Protocol security beyond MCP: discovery, authentication, authorisation, message integrity, replay, versioning and provenance of agents and servers.' },
  P8: { title: 'Detection engineering with MITRE ATLAS', level: 4, tags: 'AISVS C12; MITRE ATLAS', why: 'Turning agent traces into detections and response playbooks, including the MITRE OpenClaw case studies as worked examples.' },
  P9: { title: 'Foundations bridge: networks, operating systems, cloud and cryptography', level: 1, tags: 'Level 1 modules 3 and 4', why: 'A short bridge for learners who arrive without networking, operating-systems or cryptography fundamentals, so Level 1 does not assume them.' },
  P10: { title: 'Sector safety and operational technology boundaries', level: 6, tags: 'ASI08, ASI09', why: 'Safety engineering, human factors, OT boundaries and service continuity, so a security control cannot create an unsafe condition.' },
  P11: { title: 'The Secure Agentic Enterprise Dossier: building the portfolio', level: 1, tags: 'All levels', why: 'The single evolving portfolio the academy uses as evidence: templates, validation, versioning and export, introduced at Level 1 and extended at every level.' },
  P13: { title: 'Mapping agent controls to NIST: CSF, Cyber AI Profile and SP 800-53 overlays', level: 3, tags: 'NIST CSF 2.0; Cyber AI Profile; SP 800-53 overlays', why: 'Architects and governance leads must express agent controls in the language auditors already use. Maps the academy control matrix to NIST CSF 2.0, the Cyber AI Profile and the SP 800-53 overlays for AI as they are finalised.' },
  P12: { title: 'External exam orientation: published objectives and exam mechanics', level: 2, tags: 'GAIPS public objectives', why: 'Familiarisation with the public objectives and format of external exams, using original practice items only. Kept separate from Intellica assessment.' },
};

export const PATHS = [
  { id: 'newcomer', title: 'Start here: new to security', who: 'Developers, analysts and managers who are new to security.', levels: [1], lessons: [1, 2, 3, 4, 5], note: 'Begin with the free lessons, then take the foundation modules in order.' },
  { id: 'builder', title: 'Build secure agents', who: 'Engineers who ship agents, tools and integrations.', levels: [1, 2], lessons: [2, 5, 6, 7, 8, 10, 11, 26, 27], note: 'Foundations, then the application-security core.' },
  { id: 'architect', title: 'Architect agent platforms', who: 'Architects and platform leads.', levels: [2, 3], lessons: [7, 9, 12, 13, 14, 22, 28], note: 'Identity, isolation and enforcement before the dossier.' },
  { id: 'operations', title: 'Detect and respond', who: 'SOC analysts, detection engineers and responders.', levels: [1, 4], lessons: [4, 15, 17, 25], note: 'Threats first, then telemetry, forensics and containment.' },
  { id: 'assurance', title: 'Red team and assurance', who: 'Penetration testers and assurance specialists.', levels: [2, 5], lessons: [5, 6, 16, 21, 23, 24], note: 'Understand the controls, then test whether they hold.' },
  { id: 'governance', title: 'Govern and lead', who: 'Security leaders, risk owners and product owners.', levels: [1, 6], lessons: [1, 3, 18, 19, 20], note: 'Risk, regulation and accountable decisions.' },
];

export const GAPS = [
  { id: 'G1', topic: 'Development pipelines and MLOps security', source: 'GAIPS cluster; Blueprint v2', planned: 'P1', finding: 'Lesson 11 covers model supply chain. Data and training pipelines, registry, signing, evaluation gates and rollback are not taught as a unit.' },
  { id: 'G2', topic: 'Model customisation and alignment', source: 'GAIPS cluster; Blueprint v2', planned: 'P2', finding: 'Poisoning appears in lessons 11 and 24. Fine-tuning and adapter risk, backdoors and the limits of alignment need their own lesson and lab.' },
  { id: 'G3', topic: 'Inference and serving infrastructure', source: 'GAIPS cluster', planned: 'P3', finding: 'Lessons 10, 12 and 13 cover isolation, cloud and zero trust. Configuration-level hardening of inference serving is thin.' },
  { id: 'G4', topic: 'Privacy, retention and sensitive data', source: 'Blueprint v2; EU and national data-protection law', planned: 'P4', finding: 'Data security is taught in lesson 8. Prompt and log retention, deletion and training reuse are not covered as a topic.' },
  { id: 'G5', topic: 'Agent action safety and human approval integrity', source: 'ASI09; Blueprint v2', planned: 'P5', finding: 'Approval and escalation appear inside other lessons. A dedicated lesson on previews, dual control and emergency stop is needed.' },
  { id: 'G6', topic: 'Multi-agent failure and cascade evaluation', source: 'ASI07, ASI08, ASI10', planned: 'P6', finding: 'Lesson 9 covers trust propagation. Loops, cost exhaustion and correlated failure need tests, not only discussion.' },
  { id: 'G7', topic: 'Agent-to-agent protocol security', source: 'Blueprint v2', planned: 'P7', finding: 'Lessons 6, 26 and 27 cover MCP authorisation and skills. Other agent protocols and discovery are not yet covered.' },
  { id: 'G8', topic: 'Detection engineering and ATLAS mapping', source: 'MITRE ATLAS; Blueprint v2', planned: 'P8', finding: 'Lessons 15 and 25 teach monitoring and honest detection. A detection-engineering lab mapped to ATLAS is missing.' },
  { id: 'G9', topic: 'Foundations bridge for newcomers', source: 'Blueprint v2 Level 1', planned: 'P9', finding: 'The live course assumes networking, operating-system and cryptography basics that newcomers may not have.' },
  { id: 'G10', topic: 'Sector safety and operational technology', source: 'Blueprint v2', planned: 'P10', finding: 'Lesson 19 covers critical industries. OT boundaries and safety engineering need depth.' },
  { id: 'G11', topic: 'Portfolio and evidence workflow', source: 'Blueprint v2', planned: 'P11', finding: 'Each lesson has a lab. There is no single evolving portfolio that carries evidence from level to level.' },
  { id: 'G13', topic: 'Mapping to NIST control language', source: 'CYB-2 research: NIST Cyber AI Profile and COSAiS overlays', planned: 'P13', finding: 'Not in Blueprint v2. NIST is building the Cyber AI Profile and SP 800-53 overlays for AI, which auditors will ask for. The control matrix is not yet mapped to them.' },
  { id: 'G12', topic: 'Offensive credential benchmark missing from Blueprint v2', source: 'CYB-1 research: GIAC GAIPT, GASAE and GOAA', planned: 'P12', finding: 'Blueprint v2 benchmarks only GAIPS. Level 5 should also be mapped to the published GAIPT objectives.' },
];

// Working crosswalk: Intellica's own reading of the public GAIPS domain headings. Ratings are ours and unreviewed.
export const GAIPS = [
  { cluster: 'Agentic systems and AI integrations', lessons: [2, 6, 9, 26, 27, 28], rating: 'taught', planned: [], note: 'Build and assess a complete integration, including inter-agent communication, tool identity and protocol security.' },
  { cluster: 'AI and LLM foundations', lessons: [1, 2, 4, 5], rating: 'verify', planned: ['P9'], note: 'Add precise coverage of inference, context windows, sampling, serving and failure modes that matter for security.' },
  { cluster: 'AI application architecture and frameworks', lessons: [2, 6, 13, 14], rating: 'verify', planned: ['P3'], note: 'Compare orchestration patterns; teach secure framework configuration and dependency risk.' },
  { cluster: 'AI infrastructure and deployment security', lessons: [10, 12, 13, 23], rating: 'verify', planned: ['P3'], note: 'Show hardened inference and deployment: isolation, secrets, network controls and runtime policy.' },
  { cluster: 'AI risk management and strategic application', lessons: [3, 18, 19], rating: 'verify', planned: ['P10'], note: 'Tie risk to NIST AI RMF and ISO/IEC 23894; include ownership and residual-risk acceptance.' },
  { cluster: 'Development pipelines and MLOps security', lessons: [11], rating: 'gap', planned: ['P1'], note: 'New lesson and lab: data and training pipelines, CI/CD, registry, signing, evaluation gates and rollback.' },
  { cluster: 'Knowledge augmentation and retrieval', lessons: [8, 24], rating: 'taught', planned: ['P4'], note: 'Retrieval authorisation, provenance, poisoning, vector-store exposure and tenant isolation.' },
  { cluster: 'Model customisation and alignment', lessons: [5, 11], rating: 'gap', planned: ['P2'], note: 'New lesson and lab: fine-tuning, adapters, dataset lineage, backdoors and safety regression.' },
];
export const RATING = { taught: 'Taught; evidence to verify', verify: 'Taught; depth to verify', gap: 'Gap: new lesson planned' };

export const ROADMAP = [
  { n: 0, name: 'Discovery and audit', status: 'done', work: 'Inventory the course engine, source files, deployment path and learner data. Reconcile Blueprint v2 with the live course (28 lessons, not 20).', gate: 'Asset inventory and key and data preservation plan.' },
  { n: 1, name: 'Research and curriculum freeze', status: 'active', work: 'Verify standards and exam facts, publish the source register, freeze six-level outcomes, close the gap register.', gate: 'Source register and crosswalk reviewed by independent specialists.' },
  { n: 2, name: 'Course content uplift', status: 'next', work: 'Write the twelve planned lessons, audit every live lesson against its outcome, and attach sources.', gate: 'Every lesson mapped to an outcome; every lab verified to run; no source gap left open.' },
  { n: 3, name: 'Platform foundations', status: 'later', work: 'Academy catalogue, portfolio workspace, recall scheduling and lab orchestration on the existing course platform.', gate: 'Automated tests, accessibility review, restore test and security review.' },
  { n: 4, name: 'Assessment bank', status: 'later', work: 'Author and pilot original items, a mock engine and performance tasks.', gate: 'Blueprint targets met, item analysis and standard setting documented.' },
  { n: 5, name: 'Beta and external review', status: 'later', work: 'Pilot with learners and employers; independent curriculum, assessment and red-team review.', gate: 'No critical safety defect; measurable learning gain; assessor calibration accepted.' },
  { n: 6, name: 'Credential launch', status: 'later', work: 'Publish the scheme handbook, candidate rules, verification, appeals and renewal.', gate: 'Governance operating, legal review complete, training and certification decisions separated.' },
  { n: 7, name: 'Expansion', status: 'later', work: 'Specialist endorsements and annual refresh of frameworks and mappings.', gate: 'Annual scheme review with release evidence.' },
];
export const STATUS_LABEL = { done: 'Done', active: 'In progress', next: 'Next', later: 'Planned' };

export const ENDORSEMENTS = ['Agent identity and delegation', 'Secure tool and MCP integration', 'Cloud and runtime isolation', 'AI supply-chain assurance', 'SOC and incident response', 'Red-team testing', 'Regulated and critical-sector assurance'];

export const POLICY = [
  'Intellica owns its curriculum, teaching, practice items, labs, credential names, rules and decisions. Public frameworks and exam blueprints are references and mappings only.',
  'Intellica is independent of GIAC, ISC2, ISACA, CompTIA, CSA, IAPP, OWASP, MITRE and NIST. Nothing here suggests an affiliation, approval or partnership.',
  'We use no protected exam questions, leaked questions, confidential task briefs, logos or marketing claims from any other organisation.',
  'A mapping shows which of our lessons relate to a published objective. It does not mean a level replaces, counts towards or predicts the result of any external exam, and it does not satisfy any experience requirement.',
  'External exam orientation and Intellica assessment stay separate. The first familiarises you with public objectives and exam mechanics. The second measures Intellica\u2019s own published competence standard.',
  'No Intellica credential has been issued yet. When the scheme launches, the handbook, candidate rules, appeals process and renewal policy will be published first.',
];

export const ASSESSMENT = [
  ['Knowledge is necessary, not sufficient', 'Every level combines blueprint-balanced knowledge items with observed lab or design work. A knowledge score alone never earns a level.'],
  ['Evidence you can inspect', 'Each lesson ends in an artefact that goes into one evolving portfolio, the Secure Agentic Enterprise Dossier, so assessors review what you built.'],
  ['Controls must fail closed', 'Practical tasks include negative tests: the control has to refuse the attack, not just permit the intended use.'],
  ['Unseen forms and item control', 'Practice items and assessment items are separate pools. Assessment items are exposure-tracked and retired.'],
  ['Separated decisions', 'The people who teach a level do not decide whether a candidate meets the standard. Appeals go to a reviewer who did not assess the candidate.'],
  ['Design benchmark, not a claim', 'ISO/IEC 17024:2026 guides the design of the scheme. Intellica makes no accreditation or conformity claim.'],
];
