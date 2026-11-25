# CYB-3 build repair — lesson-title alignment

## Reproduced failure

The first CYB-3 overlay updated the cybersecurity course catalogue with five renamed entries under **Frontier research, 2026**, but the actual lesson source in `training-private/frontier.mjs` retained its published titles. `tools/cyber-course.mjs` resolves catalogue lesson names against the private source and stopped with:

`catalog.json: module "Frontier research, 2026" names a lesson that is not in the course file: Adaptive Red-Team Evaluation: Test the Defence`

The academy pages and placement tests were not the cause.

## Correction

The five catalogue entries now use the exact lesson titles from the source:

| CYB-3 catalogue title (incorrect) | Authoritative source title |
|---|---|
| Adaptive Red-Team Evaluation: Test the Defence | Break Your Own Defence: Adaptive Evaluation |
| Independent Runtime Enforcement: Boundaries and Failure Modes | Out-of-Band Enforcement, and Where It Breaks |
| Agent and Evaluation Environment Containment | Contain Your Own Agents and Evaluation Environments |
| Detecting Memory, Tool-Description and Server Poisoning | Measure Poisoning: Memory, Tool Descriptions and Servers |
| Runtime Monitoring and Detection Assurance | Runtime Monitors and Honest Detection |

No lesson source, lesson ID, encrypted lesson payload, production key, access-code logic, payment logic, or learner data is added or changed by this repair. The correction restores the catalogue-to-source names expected by the existing build.

## Apply the hotfix

From the repository root, after CYB-3 has been applied:

```sh
unzip -o Intellica_CYB-3_Repair_Hotfix.zip -d .
npm run training
npm test
```

For the full pipeline, first confirm the existing production course key is available in the authorised environment (`.course-key` or `COURSE_KEY`). The course builder can create a new key if none is found; **do not run `npm run sync` or deploy without recovering the existing production key**. Once the correct key is present:

```sh
npm run sync
npm run check
```

Do not delete or replace a key that may have been created during the failed build. If the key was absent when the failed `npm run sync` began, pause and recover the production key from its authorised backup before rebuilding encrypted course content or deploying.

## Validation performed on an isolated copy

- `npm run training` — passed.
- `npm test` — passed.
- `npm run sync` — passed using a disposable test-only key in the isolated validation copy; no production key was used.
- `npm run check` — passed; 188 pages checked, 0 errors, 0 warnings; link checker, cyber claims checker and academy checker passed.

The supplied archive did not include a separate error-log attachment. The failure above was reproduced directly from the CYB-3 archive against the supplied main repository and CYB-2 checkpoint.
