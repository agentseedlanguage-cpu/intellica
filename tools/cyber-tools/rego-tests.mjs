// Generates agent_guardrail_test.rego from the same scenarios the browser tool uses, so `opa test` can check the Rego itself.
import { SCENARIOS, toRegoInput } from './data.mjs';
export const EXPECTED = ['allow', 'deny', 'deny', 'allow', 'deny', 'deny', 'deny', 'deny']; // written by hand, not computed, so a drift in either side shows up
export function regoTests() {
  const body = SCENARIOS.map((s, i) => {
    const doc = JSON.stringify(toRegoInput(s.input), null, 2).split('\n').map((l, j) => (j ? '\t' + l : l)).join('\n');
    const rule = EXPECTED[i] === 'allow' ? 'allow' : 'not allow';
    return `# ${s.title}\ntest_case_${i + 1} if {\n\t${rule} with input as ${doc}\n}\n`;
  }).join('\n');
  return `package agent.guardrail_test\n\nimport rego.v1\n\nimport data.agent.guardrail.allow\n\n${body}`;
}
