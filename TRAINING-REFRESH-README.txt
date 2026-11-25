INTELLICA TRAINING PAGE — MARKETING & STRUCTURE REFRESH

Overlay ZIP for the Intellica main repository. Extract at the repository root, preserving paths.

WHAT CHANGED
- Rebuilt the training landing hero as three balanced, responsive panels with no hero image.
- Panel 1: Architecture Academy (all six levels).
- Panel 2: Cyber Security Academy, linking to the academy and directly to the original 28-lesson course.
- Panel 3: Run and grow a business with agents, containing every other course (six courses).
- The original cybersecurity course is assigned to the Cyber Security Academy and excluded from the general-course category.
- Updated course grouping, academy/featured messaging, introductory copy, teaching principles, team-training copy and metadata.
- Updated the generated landing page and course-page breadcrumbs.

APPLY
1. Extract this ZIP into the Intellica repository root, keeping the directory structure.
2. Run: npm run sync
3. Run: npm test
4. Run: npm run check
5. Review the page locally, then deploy using your normal validated command.

IMPORTANT
- This overlay does not contain or modify .course-key.
- The validation run used a disposable generated course key in an isolated working copy; that key was removed and is not included.
- Do not deploy until your real production course key is confirmed present and backed up.

VALIDATION PERFORMED ON ISOLATED COPY
- npm test: passed
- npm run sync: completed
- link checker: 188 pages checked, passed
- site checks: 0 errors, 0 warnings
- cybersecurity claims check: passed
