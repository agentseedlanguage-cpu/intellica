# Planned academy lessons: specifications (CYB-1)

Thirteen lessons are specified (P1 to P13). Each spec is the minimum bar before a lesson is written. A lesson ships only with: outcomes, a transcript, a worked example, a lab that runs safely and resets, an assessment rubric, a knowledge check, a portfolio artefact, a source list with access dates and a changelog entry. Lab rules: synthetic data, deny-by-default egress, disposable credentials, resettable state, audit log.

Read the primary sources listed before drafting. Where a source is paid or share-alike, paraphrase and cite identifiers.

---

## P1. Model pipelines: data, training, registry and signing (Level 2; closes G1)
**Outcomes.** Map a model pipeline from data collection to deployment and mark each trust boundary. Specify controls for data lineage, training and fine-tuning jobs, CI/CD, registry access, artefact signing and promotion gates. Define an evaluation gate with a rollback trigger.
**Lab.** Given a toy pipeline (data store, training job, registry, deployment step), find five seeded weaknesses (unsigned artefact, writable registry, unpinned dependency, no evaluation gate, shared credentials), fix them and prove each fix with a failing negative test.
**Artefact.** Pipeline threat model and promotion-gate checklist.
**Standards.** AISVS C1, C3, C6; ASI04; NIST SSDF and 800-218A (check current versions).
**Read first.** AISVS chapters 1, 3 and 6; SP 800-218A; MITRE ATLAS techniques on ML supply chain.

## P2. Fine-tuning, adapters and alignment: poisoning, backdoors and limits (Level 2; closes G2)
**Outcomes.** Explain how fine-tuning and adapters change model behaviour and where the data and the weights can be tampered with. Describe backdoor and poisoning risk and how to test for it. State plainly what alignment and moderation can and cannot protect against, and why neither replaces an external control.
**Lab.** Compare a clean and a tampered adapter on a small evaluation suite, record the safety-regression result and write the go or no-go decision with evidence.
**Artefact.** Customisation risk assessment and safety-regression plan.
**Standards.** AISVS C1, C3, C7, C11; ASI01; NIST AI RMF Measure function.
**Read first.** AISVS chapters 1, 3, 7 and 11; the poisoning material already in lessons 11 and 24.

## P3. Inference, serving and AI infrastructure hardening (Level 3; closes G3)
**Outcomes.** Harden an inference endpoint at configuration level: authentication, network policy, secrets, resource limits, logging and multi-tenancy. Place shared-responsibility lines for a managed model API versus self-hosting.
**Lab.** Review and fix a deliberately weak serving configuration; verify with a checklist derived from AISVS C4.
**Artefact.** Deployment baseline.
**Standards.** AISVS C4; ASI05; cloud shared-responsibility documentation of the chosen provider.

## P4. Privacy, sensitive data and logging in agent systems (Level 2; closes G4)
**Outcomes.** Trace personal and sensitive data through prompts, tool calls, logs, memory, retrieval stores and provider APIs. Specify retention, minimisation, deletion and access rules. Explain why logs can become the largest leak.
**Lab.** Instrument a toy agent, find where sensitive fields persist, add redaction and retention rules, and show deletion works end to end.
**Artefact.** Data-flow map with retention table.
**Standards.** AISVS C8; applicable data-protection law (confirm jurisdiction; for Trinidad and Tobago, the Data Protection Act status must be checked at writing time).

## P5. Agent action safety: approvals, previews and emergency stop (Level 3; closes G5)
**Outcomes.** Design a human approval step that cannot be spoofed by the agent: transaction previews generated outside the model, dual control, irreversible-action limits, safe defaults, escalation and an emergency stop. Recognise approval fatigue and design against it.
**Lab.** Attack an approval flow whose preview is model-generated, then rebuild it with an out-of-band preview and show the attack fails.
**Artefact.** Approval-flow design and failure-mode analysis.
**Standards.** ASI08, ASI09; AISVS C9.

## P6. Multi-agent failure and cascade testing (Level 3; closes G6)
**Outcomes.** Identify delegation loops, shared-memory contamination, trust propagation, recursive tool calls, cost exhaustion and correlated failure. Set budgets, depth limits and circuit breakers. Write tests that provoke each failure.
**Lab.** A three-agent workflow with a seeded loop and a poisoned shared note; add limits and show the cascade stops inside the budget.
**Artefact.** Cascade test suite and blast-radius statement.
**Standards.** ASI07, ASI08, ASI10; AISVS C9.

## P7. Agent-to-agent protocols: discovery, authentication and replay (Level 3; closes G7)
**Outcomes.** Compare agent-to-agent protocol patterns on discovery, authentication, authorisation, message integrity, replay and versioning. Verify provenance of an agent or server before trusting it.
**Lab.** Replay and downgrade attacks against a toy agent message bus; add nonces, audience binding and version pinning, and prove the attacks fail.
**Artefact.** Protocol review checklist.
**Standards.** ASI07; AISVS C9, C10. Build on lessons 6, 26 and 27.
**Read first.** The current specification of each protocol taught; record the version and access date.

## P8. Detection engineering with MITRE ATLAS (Level 4; closes G8)
**Outcomes.** Turn agent traces into detections for anomalous tool sequences, privilege escalation, unusual delegation, exfiltration and loops. Map each detection to an ATLAS technique and a response playbook. Estimate false-positive cost honestly.
**Lab.** Use the MITRE OpenClaw case studies (AML.CS0048 to AML.CS0051) as worked examples: reconstruct the sequence from synthetic traces, write detections and measure them on benign and malicious sets.
**Artefact.** Detection set with test results.
**Standards.** AISVS C12; MITRE ATLAS (cite a release version).
**Read first.** The four case studies on the ATLAS site and MITRE's OpenClaw summary.

## P9. Foundations bridge: networks, operating systems, cloud and cryptography (Level 1; closes G9)
**Outcomes.** Explain TCP/IP basics, DNS, TLS, segmentation, processes, permissions, containers, cloud shared responsibility, hashing, signing and key management well enough to follow Levels 2 and 3.
**Lab.** Trace one agent request across the network, inspect its TLS, and verify a signed artefact.
**Artefact.** Network trust map.
**Entry diagnostic.** Ten short items decide whether a learner needs the bridge.

## P10. Sector safety and operational technology boundaries (Level 6; closes G10)
**Outcomes.** Apply safety engineering and human-factors thinking to agentic systems near physical or critical services. Draw the boundary between IT and OT, and show a security control cannot create an unsafe state.
**Lab.** Review a utility-style scenario: a proposed containment action that would stop a safety function; redesign it.
**Artefact.** Safety and security trade-off record.
**Standards.** ASI08, ASI09; the sector rules relevant to the learner. Builds on lesson 19.

## P11. The Secure Agentic Enterprise Dossier (Level 1 onward; closes G11)
**Outcomes.** Start and maintain one portfolio across all levels: system description, data-flow diagram, threat model, control matrix, test evidence, incident runbook, risk register. Version it and validate it against a checklist.
**Lab.** Create the Level 1 dossier for a small support agent and pass the automated structure check.
**Artefact.** The dossier itself (Markdown plus diagrams, exportable).

## P12. External exam orientation (Level 2; closes G12)
**Outcomes.** Read a published exam objective list, map it to your own evidence, and practise exam technique with original items. No protected or leaked material is used.
**Lab.** Self-assess against the public GAIPS domain headings and produce a study plan.
**Artefact.** Personal gap map.
**Rule.** Kept separate from Intellica assessment. State the independence disclaimer on every page and every practice item set.

---

## P13. Mapping agent controls to NIST: CSF, Cyber AI Profile and SP 800-53 overlays (Level 3; closes G13)
**Outcomes.** Express the academy control matrix in the control language auditors use: NIST CSF 2.0 functions, the Cyber AI Profile focus areas and SP 800-53 controls and overlays for AI. State which mappings are final and which are drafts, with dates.
**Lab.** Take the Level 3 control matrix of a sample agent platform and map every control to CSF 2.0 and to SP 800-53 families; mark each mapping as final or draft and list the gaps an auditor would raise.
**Artefact.** Control crosswalk with a status column and review date.
**Standards.** NIST CSF 2.0; NISTIR 8596 (Cyber AI Profile, draft status to confirm); SP 800-53 COSAiS overlays (in development); SP 800-218 and 218A.
**Read first.** The NIST CSRC pages for each publication, not summaries. Record the version and access date. Agentic overlays were reported as planned but unscheduled, so the lesson ships with a change trigger and is updated when NIST publishes.
