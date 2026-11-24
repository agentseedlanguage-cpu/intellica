// Tests for the cybersecurity course's practice tools and reference lab kit. Node only; runs OPA too if it is installed.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SCENARIOS, REGO, evaluate, HIGH_IMPACT } from './cyber-tools/data.mjs';
import { EXPECTED, regoTests } from './cyber-tools/rego-tests.mjs';
import { runAll, CHECKS } from './cyber-tools/lab-kit.mjs';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.error('FAIL ' + m); } else console.log('ok   ' + m); };

// 1. The reference lab kit: every reference blocks, every unsafe baseline misses.
const rows = runAll();
ok(rows.length >= 18, `lab kit has ${rows.length} seeded checks`);
ok(rows.every((r) => r.reference_blocks), 'the reference blocks every seeded flaw' + rows.filter((r) => !r.reference_blocks).map((r) => ' ' + r.id).join(''));
ok(rows.every((r) => r.baseline_misses), 'the unsafe baseline misses every seeded flaw' + rows.filter((r) => !r.baseline_misses).map((r) => ' ' + r.id).join(''));
ok(new Set(CHECKS.map((c) => c.lesson)).size >= 6, 'the kit covers at least six lessons');
const run = spawnSync(process.execPath, ['tools/cyber-tools/lab-kit.mjs'], { encoding: 'utf8' });
ok(run.status === 0 && /^OK:/m.test(run.stdout), 'node lab-kit.mjs exits 0 and prints OK');

// 2. Policy: the JavaScript mirror gives the decisions we wrote down by hand.
ok(SCENARIOS.length === EXPECTED.length, 'every scenario has a hand-written expected decision');
SCENARIOS.forEach((s, i) => ok((evaluate(s.input).allow ? 'allow' : 'deny') === EXPECTED[i], `JS policy: ${s.title} -> ${EXPECTED[i]}`));

// 3. Rego against JS: structural parity always, and the real engine when OPA is installed.
ok(HIGH_IMPACT.every((t) => REGO.includes(`"${t}"`)), 'Rego high-impact set contains every tool the JS policy treats as high impact');
for (const [needle, what] of [['audience_valid == true', 'audience'], ['token_passthrough == false', 'no passthrough'], ['deny_tainted_egress', 'taint rule'], ['approval.subject == input.agent.user_id', 'approval user'], ['approval.action_hash == input.action.canonical_hash', 'approval bound to arguments'], ['expires_at > input.context.now_epoch', 'approval expiry']]) ok(REGO.includes(needle), `Rego has the ${what} rule`);
const opa = spawnSync('opa', ['version'], { encoding: 'utf8' });
if (opa.status === 0) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'rego-'));
  fs.writeFileSync(path.join(d, 'agent_guardrail.rego'), REGO);
  fs.writeFileSync(path.join(d, 'agent_guardrail_test.rego'), regoTests());
  const t = spawnSync('opa', ['test', d, '-v'], { encoding: 'utf8' });
  ok(t.status === 0, 'opa test passes: the Rego gives the same decisions as the JS mirror' + (t.status ? '\n' + t.stdout + t.stderr : ''));
} else console.log('skip opa test: OPA is not installed here (CI installs it). Rego and JS parity is then checked structurally only.');

// 4. The generated Rego test file mentions every scenario.
ok((regoTests().match(/^test_case_/gm) || []).length === SCENARIOS.length, 'generated opa test file has one test per scenario');

if (fails) { console.error(`\n${fails} failed`); process.exit(1); }
console.log('\ncyber tests passed');
