// Cybersecurity for Agentic Environments Academy: the six levels (source: Blueprint v2 + CYB-1 reconciliation).
// Edit the data, not the generated pages. Statuses are honest: "available" means lessons exist in the live course.
export const REVIEWED = '2026-11-25';

export const LESSON_LEVEL = { // primary level for each of the 28 live lessons
  1: 1, 2: 1, 3: 1, 4: 1,
  5: 2, 6: 2, 7: 2, 8: 2, 10: 2, 11: 2, 26: 2, 27: 2,
  9: 3, 12: 3, 13: 3, 14: 3, 22: 3, 28: 3,
  15: 4, 17: 4, 25: 4,
  16: 5, 21: 5, 23: 5, 24: 5,
  18: 6, 19: 6, 20: 6,
};

// Standards tags per live lesson: OWASP Agentic Top 10 (ASI01..ASI10) and AISVS 1.0 chapter numbers (C1..C12).
export const LESSON_TAGS = {
  1: { asi: [], aisvs: [] }, 2: { asi: [], aisvs: [9] }, 3: { asi: [], aisvs: [] }, 4: { asi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], aisvs: [] },
  5: { asi: [1, 9], aisvs: [2, 7] }, 6: { asi: [2, 7], aisvs: [9, 10] }, 7: { asi: [3], aisvs: [5] }, 8: { asi: [6], aisvs: [8] },
  9: { asi: [7, 8, 10], aisvs: [9] }, 10: { asi: [5], aisvs: [4] }, 11: { asi: [4], aisvs: [3, 6] }, 12: { asi: [], aisvs: [4] },
  13: { asi: [3, 8], aisvs: [4, 5, 9] }, 14: { asi: [2, 3], aisvs: [9] }, 15: { asi: [10], aisvs: [12] }, 16: { asi: [], aisvs: [11] },
  17: { asi: [8, 10], aisvs: [12] }, 18: { asi: [], aisvs: [] }, 19: { asi: [8, 9], aisvs: [] }, 20: { asi: [], aisvs: [] },
  21: { asi: [1], aisvs: [11] }, 22: { asi: [2, 3], aisvs: [9] }, 23: { asi: [5, 10], aisvs: [4] }, 24: { asi: [6, 4], aisvs: [8, 10] },
  25: { asi: [10], aisvs: [12] }, 26: { asi: [3, 7], aisvs: [10, 5] }, 27: { asi: [4, 2], aisvs: [6, 10] }, 28: { asi: [3], aisvs: [5, 9] },
};

export const ASI = {
  1: 'Agent Goal Hijack', 2: 'Tool Misuse and Exploitation', 3: 'Identity and Privilege Abuse', 4: 'Agentic Supply Chain', 5: 'Unexpected Code Execution',
  6: 'Memory and Context Poisoning', 7: 'Insecure Inter-Agent Communication', 8: 'Cascading Failures', 9: 'Human-Agent Trust Exploitation', 10: 'Rogue Agents',
};
// AISVS 1.0 chapter names, abbreviated. Check the OWASP repository for the exact titles before quoting any of them.
export const AISVS_CH = {
  1: 'Training data integrity and traceability', 2: 'Input validation', 3: 'Model lifecycle and change control', 4: 'Infrastructure and deployment security',
  5: 'Access control and identity', 6: 'Supply chain security for models', 7: 'Model behaviour, output control and safety assurance',
  8: 'Memory, embeddings and vector stores', 9: 'Orchestration and agentic action security', 10: 'Model Context Protocol (MCP) security',
  11: 'Adversarial robustness', 12: 'Monitoring, logging and anomaly detection',
};

export const LEVELS = [
  {
    n: 1, id: 'level-1', short: 'Understand', title: 'Agentic Cybersecurity Foundations',
    tagline: 'The disciplined baseline: security principles, how agents are built, and the first threat model you can defend.',
    audience: 'Career changers, junior security practitioners, developers moving into security, and technical managers who need a baseline they can reason from.',
    prereq: 'None. An entry diagnostic decides whether a short networking, operating-systems or programming bridge comes first.',
    status: { key: 'partial', label: 'Core lessons live; bridge and assessment in design' },
    core: [1, 2, 3, 4], planned: ['P9', 'P11'],
    modules: [
      ['Cybersecurity principles for agentic systems', 'Apply CIA, safety, trust boundaries, assets, threat, vulnerability and risk; explain defence in depth and shared responsibility.', 'Asset inventory and security boundary map'],
      ['Agentic system anatomy', 'Describe models, orchestration, tools, context, memory, retrieval, identity, execution and multi-agent workflows.', 'Annotated architecture and data-flow diagram'],
      ['Networking, operating systems and cloud essentials', 'Explain protocols, segmentation, endpoint security, containers, cloud responsibility, logging and secrets.', 'Hardened baseline and network trust map'],
      ['Identity, access and cryptography', 'Distinguish authentication from authorisation; apply least privilege, workload identity, key lifecycle and delegation.', 'Permission matrix and identity flow'],
      ['Secure software and supply-chain foundations', 'Run a threat model; apply secure SDLC, dependency hygiene, build integrity and vulnerability handling.', 'Threat model and secure build checklist'],
      ['AI-specific threats and prompt injection', 'Recognise untrusted context, direct and indirect injection, tool misuse, poisoning and exfiltration.', 'Attack tree and mitigation plan in an isolated lab'],
      ['Governance, risk and incident response', 'Keep a risk register with owners; follow the response lifecycle; preserve evidence.', 'Risk register, incident runbook and tabletop'],
      ['Integrated secure-agent case', 'Apply the fundamentals to a small customer-support or internal-operations agent.', 'Portfolio submission and timed practical'],
    ],
    capstone: 'Foundational knowledge exam, a safe lab practical and a basic threat model of a small agent.',
    assessment: 'Blueprint-balanced knowledge items plus one observed lab task. Knowledge alone never earns the level.',
    mapping: [
      ['ISC2 Certified in Cybersecurity (CC)', 'Entry-level security principles. Not an agentic AI qualification.'],
      ['CompTIA Security+', 'Optional general baseline. Check the current exam version before relying on any mapping.'],
    ],
    caveat: 'This level builds entry-level capability. It is not presented as sufficient preparation for CISSP, CSSLP, GAIPS or other experience-dependent credentials.',
  },
  {
    n: 2, id: 'level-2', short: 'Build', title: 'Agentic Application Security Professional',
    tagline: 'Move from knowing security concepts to engineering secure agentic applications.',
    audience: 'Software and platform engineers, application security engineers and AI/ML engineers who ship agents.',
    prereq: 'Level 1 or the entry diagnostic. Working knowledge of one programming language and HTTP APIs.',
    status: { key: 'available', label: 'Eight core lessons live; verification and pipeline modules planned' },
    core: [5, 6, 7, 8, 10, 11, 26, 27], planned: ['P1', 'P2', 'P4'],
    modules: [
      ['Prompt and context security', 'Explain the limits of instruction hierarchy; separate trusted and untrusted context; track provenance and enforce policy.', 'Prompt-injection test corpus, context design and regression results'],
      ['Tool, API and MCP security', 'Scope capabilities; validate inputs and encode outputs; verify server identity, discovery, revocation and provenance.', 'Secure tool gateway, tool manifest review and abuse-case tests'],
      ['Agent identity and delegation', 'Use workload identity, short-lived credentials, audience restriction, privilege ceilings and revocation.', 'Identity and delegation model with negative authorisation tests'],
      ['Memory, RAG and data security', 'Enforce tenant isolation and retrieval filtering; handle provenance, poisoning, retention and deletion.', 'RAG threat model, poisoned-source test and data-access evidence'],
      ['Code execution and isolation', 'Sandbox ephemeral workloads; restrict filesystem, network and egress; isolate secrets; limit resources.', 'Isolated execution environment and escape-resistance test plan'],
      ['Model and AI supply chain', 'Record model provenance and artefacts; scan and sign; gate deployment; plan rollback.', 'Model and software bill of materials with provenance record'],
      ['Secure implementation and verification', 'Write security requirements; review code; run SAST, DAST and API tests; build release gates.', 'AISVS-informed verification report and CI security gates'],
    ],
    capstone: 'A secure-agent application project with abuse cases, a verification report and a code and configuration review.',
    assessment: 'Observed build-and-verify task, negative tests that must fail closed, and a written review defended to an assessor.',
    mapping: [
      ['OWASP AISVS 1.0', 'Primary verification checklist and lab rubric source. Cite the version: 1.01 is in progress.'],
      ['ISC2 CSSLP', 'Secure software lifecycle benchmark. Published experience requirements apply to the credential.'],
      ['GIAC GAIPS', 'Primary external platform-security benchmark; the published mapping identifies current coverage and the additional pipeline and model-customisation work.'],
      ['ISC2 AI Security Certification', 'Emerging six-domain professional benchmark; pilot stage as of November 2026, not yet an operational credential.'],
    ],
    caveat: 'Completing this level does not meet any experience requirement of an external credential.',
  },
  {
    n: 3, id: 'level-3', short: 'Architect', title: 'Agentic Security Architect',
    tagline: 'Design platforms that stay safe when models are manipulated, tools fail, credentials leak or suppliers change.',
    audience: 'Security and solution architects, platform leads and senior engineers.',
    prereq: 'Level 2, or equivalent evidence of having built and verified an agent application.',
    status: { key: 'available', label: 'Six core lessons live; architecture dossier assessment in design' },
    core: [9, 12, 13, 14, 22, 28], planned: ['P3', 'P5', 'P6', 'P7', 'P13'],
    modules: [
      ['Architecture decomposition', 'Separate control, data, model, tool, execution, memory and retrieval, identity and observability planes.', 'System and data-flow diagrams with a trust-boundary map'],
      ['Least agency and capability security', 'Deny by default; narrow tools; enforce policy outside the model with independent authorisation.', 'Agent permission graph and control matrix'],
      ['Zero-trust architecture', 'Apply explicit identity, continuous verification, resource-specific policy, segmentation and telemetry.', 'Zero-trust design with workload identity'],
      ['Human oversight as an engineered control', 'Design approval quality, transaction previews, separation of duties, escalation, safe defaults and emergency stop.', 'Approval-flow design and failure-mode analysis'],
      ['Resilience', 'Set quotas, circuit breakers, idempotency, bounded retries, workflow budgets and blast-radius limits.', 'Resilience and recovery plan'],
      ['Formal and semi-formal assurance', 'State invariants, state machines and policy properties; write attack trees and safety cases with testable acceptance criteria.', 'Safety case with acceptance criteria'],
      ['Cloud-native deployment', 'Manage secrets, KMS and HSM, network boundaries, container hardening, workload isolation and shared responsibility.', 'Deployment baseline'],
    ],
    capstone: 'Architecture dossier: threat model, security requirements, control matrix, failure-mode analysis, deployment baseline and a live architecture defence.',
    assessment: 'Dossier review plus an oral design defence against changed assumptions.',
    mapping: [
      ['CSA CCZT', 'Zero-trust benchmark. Verify the current exam details before publishing any figure.'],
      ['CSA CCSK', 'Cloud-security benchmark for cloud architecture, governance, risk and operational controls.'],
      ['ISC2 CCSP', 'Cloud security architecture benchmark. Experience requirements apply.'],
      ['ISC2 CISSP (and ISSAP)', 'Broad architecture benchmark. Qualifying experience applies.'],
    ],
    caveat: 'The architecture level is assessed on a defended design, not on a multiple-choice score.',
  },
  {
    n: 4, id: 'level-4', short: 'Defend', title: 'Agentic Security Operations Professional',
    tagline: 'Detect, investigate, contain and recover from incidents where the actor is an agent.',
    audience: 'SOC analysts, detection engineers, incident responders and cloud security engineers.',
    prereq: 'Level 1 plus SOC or engineering experience, or Level 2.',
    status: { key: 'partial', label: 'Three core lessons live; telemetry and simulation labs in design' },
    core: [15, 17, 25], planned: ['P8', 'P4'],
    modules: [
      ['Telemetry engineering', 'Define privacy-conscious event schemas for runs, tool calls, identity, policy decisions, retrieval provenance, model versions and approvals.', 'Event schema and sample trace'],
      ['Detection engineering', 'Detect anomalous tool sequences, privilege escalation, unusual delegation, exfiltration, poisoning indicators and agent loops.', 'Detection set mapped to MITRE ATLAS'],
      ['Threat hunting', 'Correlate agent traces with identity, cloud, endpoint, network, application and data-access telemetry.', 'Hunt report'],
      ['Forensics', 'Preserve chain of custody; reconstruct sequences; separate model output from executed actions; find affected data and credentials.', 'Forensic timeline'],
      ['Containment', 'Revoke tokens, disable tools, quarantine agents, isolate execution, freeze workflows and restore known-good state.', 'Containment plan executed in a controlled environment'],
      ['Recovery and learning', 'Validate eradication, reissue credentials, restore memory safely, retest controls and update threat models.', 'Post-incident review'],
    ],
    capstone: 'A live incident simulation with injects, time-boxed decisions, evidence handling and a post-incident report.',
    assessment: 'Observed simulation scored on containment quality, evidence handling and the written review.',
    mapping: [
      ['CompTIA CySA+', 'Defensive analysis benchmark. Pin the exam version at release.'],
      ['MITRE ATLAS', 'Technique language for detections and playbooks. Cite a release version.'],
      ['GIAC GASAE', 'AI and security-automation benchmark across offensive, defensive and cloud operations; verify current exam status.'],
    ],
    caveat: 'Incident simulations run only in the academy lab, on synthetic data.',
  },
  {
    n: 5, id: 'level-5', short: 'Assure', title: 'Agentic Red Teaming and Assurance Professional',
    tagline: 'Plan authorised adversarial tests, validate control failures and report residual risk honestly.',
    audience: 'Penetration testers, red teamers, application security engineers and assurance specialists.',
    prereq: 'Level 2 and Level 3 knowledge, or demonstrated penetration-testing experience.',
    status: { key: 'partial', label: 'Four core lessons live; engagement assessment in design' },
    core: [16, 21, 23, 24], planned: ['P6', 'P7'],
    modules: [
      ['Engagement scoping and authorisation', 'Write scope, written authorisation, rules of engagement, test windows, safety constraints and stop conditions.', 'Signed-off engagement plan (lab scenario)'],
      ['Attack planning', 'Map plans to the OWASP Agentic Top 10 and MITRE ATLAS techniques.', 'Attack plan with technique mapping'],
      ['Injection, poisoning and misuse evaluations', 'Test prompt injection, context poisoning, tool misuse, delegation abuse, inter-agent trust and supply-chain attacks.', 'Reproducible test cases'],
      ['Tool, sandbox and exfiltration testing', 'Test APIs and tools, sandbox boundaries, exfiltration simulations and safe code execution.', 'Boundary test results'],
      ['Robustness and regression', 'Re-test across model, prompt, tool, retrieval and policy changes; defend against adaptive attackers.', 'Regression suite'],
      ['Evidence and reporting', 'Record preconditions, expected and observed results, impact, logs, reproduction steps and remediation retests; separate vulnerability, limitation, unsafe workflow, weak control and residual risk.', 'Evidence pack and report'],
    ],
    capstone: 'A scoped red-team engagement against a purpose-built target, with an evidence pack, reproducible tests and a remediation retest.',
    assessment: 'Observed engagement in the lab and a written report reviewed against a published rubric.',
    mapping: [
      ['GIAC GAIPT', 'Offensive AI testing benchmark with published objectives for direct and indirect injection, RAG, agents, MCP, API security and architecture flaws; verify presale status.'],
      ['GIAC GOAA', 'Related offensive AI analyst benchmark with practical AI-enabled offensive operations; distinct from agent-platform assurance.'],
      ['CompTIA PenTest+', 'General penetration-testing benchmark. Pin the exam version at release.'],
    ],
    caveat: 'Offensive work is taught only in isolated lab environments with synthetic data, disposable credentials and audit logs. Nothing here is a route to testing systems you do not have written permission to test.',
  },
  {
    n: 6, id: 'level-6', short: 'Govern', title: 'Principal Agentic Security and Governance Professional',
    tagline: 'Turn technical risk into accountable organisational decisions.',
    audience: 'Security leaders, risk and compliance leads, product owners and senior architects.',
    prereq: 'Levels 1 and 3, or equivalent senior experience.',
    status: { key: 'partial', label: 'Three core lessons live; programme assessment in design' },
    core: [18, 19, 20], planned: ['P10', 'P11'],
    modules: [
      ['Governance operating model', 'Name the accountable, risk, system, model or provider, data and control owners, plus legal, privacy, procurement and audit.', 'Operating-model chart'],
      ['AI inventory and classification', 'Classify use cases by autonomy, tool permissions, data classes, affected parties, criticality, third parties and jurisdiction.', 'AI inventory'],
      ['Management-system integration', 'Integrate ISO/IEC 42001 with risk and impact processes informed by ISO/IEC 23894 and 42005, and with ISO/IEC 27001.', 'Management-system mapping'],
      ['Risk appetite for autonomous action', 'Set prohibited actions, human-approval tiers, service criticality and residual-risk acceptance.', 'Risk appetite statement'],
      ['Procurement and vendor oversight', 'Review model and API terms, data use, subprocessor chains, breach notice, audit rights, model-change notice and exit plans.', 'Supplier assurance pack'],
      ['Board reporting and workforce', 'Report exposure, incidents, control effectiveness and investment priorities; align roles to NICE tasks, knowledge and skills.', 'Board paper'],
    ],
    capstone: 'An enterprise agentic security programme with policy and control architecture, a risk and impact assessment, a supplier assurance pack, a board paper and an independent oral defence.',
    assessment: 'Programme review and an oral defence before independent assessors.',
    mapping: [
      ['IAPP AIGP', 'AI governance benchmark. Not a hands-on security engineering credential.'],
      ['ISC2 AI Security Certification', 'Emerging six-domain benchmark spanning AI concepts, governance, data and model security, architecture, operations and testing; pilot stage as of November 2026.'],
      ['ISACA CISM, CRISC and CISA', 'Management, risk and audit benchmarks. Experience and continuing-education requirements apply.'],
      ['ISO/IEC 42001 and 27001', 'Teach implementation and audit readiness. A learner credential does not make an organisation certified.'],
    ],
    caveat: 'Governance claims are tied to dated sources: the EU AI Act timetable changed in 2026, so every date shown here carries a review date.',
  },
];
