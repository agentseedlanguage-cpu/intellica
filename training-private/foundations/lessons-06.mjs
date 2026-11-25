// Level 1 (Foundations), lessons 12-14. Independent Intellica self-study following the topics of the public iSAQB CPSA-F curriculum 2025.1-rev2. Not an iSAQB course.
// Lesson 13 is Intellica extension content. Lesson 14 supports the external exam; exam format and rules belong to the certification bodies.
// ClinicBook is a synthetic case. Cases marked "Illustrative" are invented. Numbers in examples are invented for teaching.
export default [
{
  n: 12, title: 'Worked Example: The Integrated Case Study',
  lead: 'Everything so far, in one place. You will follow three ClinicBook requirements from stakeholder concern to decision, view and implementation, and learn to check that the chain holds from end to end.',
  slides: [
    ['Why trace end to end', 'Explain the relation between requirements, constraints and solutions.',
      'A solution is only justified if you can show the requirement or constraint that led to it, and the implementation that realises it.',
      'If ClinicBook uses a queue for reminders, the chain should read: concern (patients must not get late or duplicate reminders), requirement (a reminder is sent within five minutes of its local time), decision (use a queue with retries), view (runtime scenario), implementation (the Reminders module and queue service).',
      'For every major decision, write the chain from concern to implementation, and fix any missing link.',
      'Pick a decision in your system. Can you name the requirement behind it?'],
    ['The system in brief', 'Summarise the example system.',
      'ClinicBook lets patients book, move and cancel appointments, takes deposits through a payment provider and sends reminders. Clinics span time zones; patient data is sensitive.',
      'Stakeholders: patients, receptionists, clinic owners, operations, the data protection officer. Constraints: a fixed payment provider, a team of five, patient data kept in one country.',
      'Always start a worked example from the stakeholders, constraints and goals, not from technology.',
      'Which constraint would most limit your own design?'],
    ['Requirement 1: no double booking', 'Trace a quality requirement to its solution.',
      'Concern: patients and receptionists lose trust if two people get the same slot. Requirement: a slot can be booked by only one patient, even under simultaneous requests.',
      'Decision: Calendar owns slot state and holds a slot for ten minutes with a check that only one hold succeeds. View: runtime scenario for booking with a failure path. Implementation: a database constraint on slot and time, tested with two simultaneous requests.',
      'Make strict requirements checkable with a test that tries to break them.',
      'What test would prove no double booking in your system?'],
    ['Requirement 2: reminders at local time', 'Trace a functional and constraint-driven requirement.',
      'Concern: patients miss appointments when reminders arrive at the wrong hour. Requirement: reminders arrive within five minutes of the chosen local time, in any clinic time zone.',
      'Decision: store appointment times in UTC with the clinic’s time zone name and convert at the edge. View: cross-cutting rule for time. Implementation: a shared time module and tests across a daylight-saving change.',
      'When a rule affects many blocks, record it as a cross-cutting concept and add tests for the hard cases.',
      'Which edge case, such as a daylight-saving change, could break your time handling?'],
    ['Requirement 3: patient privacy', 'Trace a constraint-driven requirement.',
      'Constraint: patient data must stay in one country and be visible only to staff of the patient’s clinic.',
      'Decisions: hosting in an in-country region, clinic membership checks in every block that owns data, and no patient details in logs. Views: deployment view with region, cross-cutting security concept. Implementation: cross-clinic access tests and a log review.',
      'Show constraints in both the deployment and the cross-cutting views so they are visible to both operators and developers.',
      'Where is the privacy constraint visible in your documentation?'],
    ['Decisions and alternatives', 'Show decisions with alternatives.',
      'Each key decision lists alternatives and why they lost. This makes the case study honest about trade-offs.',
      'Reminder delivery: alternative one, call the provider inside the booking request (simple, but a provider outage blocks bookings); alternative two, a queue (more parts, but outages only delay reminders). The queue won because availability of booking matters more.',
      'For each major decision, write the best rejected alternative and the reason it lost.',
      'What is the best rejected alternative for your main decision?'],
    ['Open issues and risks', 'Record open issues and risks honestly.',
      'A good case study ends with what is not yet solved. Risks and open questions show where the design is weakest.',
      'ClinicBook risks: the single queue instance, the dependency on one payment provider, and the lack of a load test above ten times current volume. Each has an owner and a next step.',
      'End every architecture description with a short list of risks, owners and next steps.',
      'What is the weakest part of your design today?'],
    ['Checking the chain', 'Check traceability across views.',
      'A final check walks each chain: is every concern covered by a requirement, every requirement by a decision, every decision by a view and every view by something real in the code?',
      'The check often finds a decision with no recorded requirement, or a requirement with no test. Both are signs of a design you cannot yet defend.',
      'Walk the chain for your top three requirements and list every missing link as a task.',
      'Which link in your chain is weakest?']
  ],
  guide: [
    'A worked example shows how ideas fit together. In earlier lessons you learned to identify stakeholders and constraints, express qualities as scenarios, decompose a system, choose patterns, define interfaces, describe runtime behaviour, plan deployment, decide cross-cutting rules, document and analyse. Here you see these steps applied to one system, with the chain visible from the concern to the implementation.',
    'The point of the chain is accountability. When someone asks "why is it built this way?", you can answer by following the links: this is the concern, here is the requirement, here is the decision and the alternatives, here is where it appears in the views and here is the code and the test. If a link is missing, you have found something to fix or to explain.',
    'You do not need a perfect case study. Start with three requirements that matter most and trace them fully. Be honest about open issues. A short, honest chain is more useful than a long document that claims everything is solved.'
  ],
  case: 'Illustrative case. Before ClinicBook’s launch review, the architect picks three requirements and traces them. For double booking the chain is complete and a test proves it. For reminders at local time, she finds no test for the daylight-saving change, so she adds one and it fails: reminders shift by an hour. For privacy, the constraint appears in the deployment view but not in the cross-cutting concepts, and one block has no clinic check. Fixing these three gaps takes two days. The review that follows asks fewer questions, because the answers are written down and checked.',
  lab: {
    title: 'Trace three requirements end to end',
    intro: 'Use your own system or ClinicBook. You will pick three important requirements or constraints and trace each from concern to implementation, then list what is missing.',
    tasks: [
      'Choose three important requirements or constraints, at least one of them a quality requirement, and write each as a concern and a requirement.',
      'For each, name the decision that answers it and the best alternative you rejected with the reason.',
      'For each, name the view where the decision appears and the code or test that realises it.',
      'List every missing link in the three chains as a task, each with an owner.'
    ],
    evidence: 'Three chains in a table, and a task list for the missing links.',
    model: '| Concern | Requirement | Decision (rejected alternative) | View | Realised in |\n|---|---|---|---|---|\n| No double booking | One booking per slot, under simultaneous requests | Calendar holds slots with a database constraint (application-level lock: fails with several servers) | Runtime: booking | Constraint plus concurrency test |\n| Reminders at wrong hour | Within 5 min of local time | UTC plus time zone name, convert at edge (store local time: breaks at daylight-saving changes) | Cross-cutting: time | Time module, DST test |\n| Privacy | Staff see only their clinic; data stays in country | Membership check in every data block (check in UI only: can be bypassed) | Deployment, cross-cutting security | Cross-clinic tests, in-country region |\n\n**Missing links:** DST test missing (owner: reminders lead); Admin block has no clinic check (owner: platform lead); privacy constraint absent from concepts page (owner: architect).'
  },
  rubric: [
    ['Chains', 'Technology listed only', 'Some links missing', 'Concern, requirement, decision, view and realisation for all three'],
    ['Alternatives', 'None', 'Alternative without reason', 'A real alternative with the reason it lost'],
    ['Quality requirement', 'None among the three', 'Named but not measurable', 'At least one with a measurable response'],
    ['Gaps', 'None found', 'Found but not owned', 'Missing links listed as tasks with owners']
  ],
  quiz: [
    ['What does end-to-end traceability show?', ['The number of requirements', 'Why each decision was made and where it is realised', 'The team size', 'The release date'], 1, 'It links concerns to requirements, decisions, views and implementation.'],
    ['What should a decision record list besides the decision?', ['Nothing', 'The alternatives considered and why they lost', 'The author’s hobbies', 'The tool used'], 1, 'Alternatives and reasons show the trade-off that was made.'],
    ['What is a good sign in a final traceability check?', ['A decision with no requirement', 'Every chain complete, or its gaps listed with owners', 'Many unnamed risks', 'Undocumented tests'], 1, 'Complete chains and owned gaps show a design that can be defended.'],
    ['Where should a privacy constraint appear?', ['Only in marketing', 'In the views and concepts where operators and developers will see it', 'Nowhere', 'Only in logs'], 1, 'A constraint must be visible where decisions that depend on it are made.'],
    ['How should a case study end?', ['With a claim that everything is solved', 'With open issues and risks, owners and next steps', 'With a logo', 'With the code'], 1, 'Honesty about open issues makes the document more useful.']
  ],
  sources: [
    'arc42 documentation, sections 1 Introduction and Goals through 12 Glossary. docs.arc42.org',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapters on architecture and requirements. Addison-Wesley, 2021'
  ]
},
{
  n: 13, title: 'AI-Assisted Architecture Work',
  lead: 'AI assistants can draft, summarise and suggest, and they can be wrong in fluent, convincing ways. This lesson is Intellica extension content. You will learn where assistants help, where they mislead and how to verify, protect and record what they produce.',
  slides: [
    ['Where this lesson fits', 'Place AI-assisted work within architecture practice.',
      'This lesson goes beyond the 2025.1 Foundation curriculum. The next curriculum release candidate includes AI topics, but it is not final, so treat this lesson as Intellica practice guidance.',
      'The iSAQB Foundation curriculum 2027.1 release candidate dated 13 November 2026 was published as a candidate, not a final version. Exam content follows the version in force at the time you sit it, so check with the certification body.',
      'Use this lesson for professional practice, and check the current curriculum before relying on it for exam preparation.',
      'Why should you not assume that a release candidate is exam content?'],
    ['Where assistants help', 'Describe tasks where AI assistance is useful.',
      'Assistants can draft text, propose options, summarise long documents, generate first versions of diagrams and list questions to ask.',
      'For ClinicBook, an assistant can suggest a list of cross-cutting concerns to consider, draft a decision record from your notes, or summarise a long meeting. Each output is a draft for a person to check.',
      'Use an assistant to widen your options and to speed up drafts, and keep the decision with a person.',
      'Which task in your work would benefit from a first draft?'],
    ['Where they mislead', 'Describe common failure modes.',
      'Assistants can state wrong things confidently. They can invent constraints, requirements, standards and references, and can produce text that sounds right but is unrelated to your system.',
      'An assistant asked to describe ClinicBook’s architecture may invent a message broker that does not exist, cite a standard clause that is not in the standard, or describe a data flow that the code does not implement.',
      'Treat every claim as unverified until you have checked it against the code, the documents or the standard itself.',
      'What is the most convincing error you have seen an assistant make?'],
    ['Verify against the source', 'Apply a verification workflow.',
      'Verification means checking a claim against the authoritative source: the code, the running system, the original document or the standard.',
      'If an assistant says the Reminders block calls the Payments block, search the code for that call. If it cites a section of a standard, open the standard. If it says a rate limit is 100 per minute, read the provider’s documentation.',
      'For every output that goes into documentation, record how each important claim was checked.',
      'How would you check the claim that a block depends on another?'],
    ['Diagrams and code can disagree', 'Recognise mismatch between generated documents and code.',
      'A generated diagram or description reflects the prompt and the model, not necessarily the system. It can drift as the code changes.',
      'A diagram generated from a description of ClinicBook may show a clean layered structure while the code has a cycle between Booking and Calendar. The diagram is then misleading.',
      'Prefer diagrams generated from the code or configuration, and compare any drawn diagram with the code before sharing it.',
      'Which diagram in your project was last checked against the code?'],
    ['Protect confidential material', 'Protect confidential architecture information.',
      'Architecture descriptions can reveal security weaknesses, customer data handling and business plans. Sending them to an external service may be forbidden or risky.',
      'Before pasting ClinicBook’s deployment view into an external assistant, check the organisation’s rules, remove secrets and personal data, and prefer an approved tool or a local one if the material is sensitive.',
      'Know your organisation’s policy and show yourself what data you are about to send, before you send it.',
      'What in your architecture documents should never leave the company?'],
    ['Accountability and provenance', 'Keep human accountability and a provenance record.',
      'A person remains accountable for architecture decisions and documents, whatever tool helped. A short record of where AI contributed helps others judge the content.',
      'A one line provenance note on a decision record, such as "first draft produced with an assistant; context, alternatives and consequences checked against the code and the incident log by the architect", tells readers how much to trust it.',
      'Add a note to AI-assisted documents saying what was generated and what was checked, and by whom.',
      'Who would you name as accountable for an AI-drafted decision record?'],
    ['Checklist for ClinicBook', 'Apply an AI-use checklist.',
      'A safe workflow: choose a task, remove sensitive data, draft with the assistant, verify claims against sources, edit, record provenance and decide as a person.',
      'ClinicBook: the team uses an approved assistant for decision record drafts, never pastes patient data, verifies each claim and adds a provenance note.',
      'Write your team’s rules for AI use on one page and review them every few months.',
      'Which rule would your team most need to write down?']
  ],
  guide: [
    'AI assistants are tools that can speed up architecture work and also add new risks. They are good at producing drafts, lists of options and summaries. They are not good at knowing what is true of your system. They produce fluent text whether or not it is correct, and they can invent details, including references. That makes verification, not drafting, the skill that matters.',
    'A simple workflow keeps you safe. Decide what the assistant is for. Remove confidential or personal data before you share anything. Treat the output as a draft. Check each important claim against the code, the running system or the original document. Edit, and record in a line what was generated and what you checked. The decision stays with a person who is accountable.',
    'Be modest about what the curriculum requires. The current Foundation curriculum in force when this course was written is 2025.1-rev2. A newer release candidate adds AI topics but is not final. Use this lesson for good practice at work, and check the exam body’s current documents when you prepare for an exam.'
  ],
  case: 'Illustrative case. A ClinicBook developer asks an assistant to draft the architecture overview. The text is clear and confident. It mentions a message broker the team never installed, and says that patient data is encrypted with a specific algorithm. The architect checks both claims against the code and finds neither true. She removes the broker, corrects the encryption statement after reading the actual configuration, and adds a note: "Draft assisted by an AI tool; every technical claim checked against the repository on the date shown." The reviewers trust the document more because the note shows what was checked.',
  lab: {
    title: 'Write your AI-use rules and verify one draft',
    intro: 'Use your own system or ClinicBook. You will write a short set of rules for AI-assisted architecture work and verify a short draft against its sources.',
    tasks: [
      'Write five rules for AI use in your architecture work, covering allowed tasks, forbidden data, verification and accountability.',
      'Take a short draft text about your system, from an assistant or written by hand, and list every technical claim in it.',
      'For each claim write how you would verify it and what the authoritative source is, and mark it verified, wrong or unknown.',
      'Write a provenance note for the document that says what was generated, what was checked and who is accountable.'
    ],
    evidence: 'The five rules, the claim table and the provenance note.',
    model: '**Rules:** 1 Assistants may draft text, options and summaries. 2 Never paste personal data, secrets or customer names. 3 Every technical claim is checked against code, configuration or the original document before it is used. 4 Every AI-assisted document carries a provenance note. 5 The named architect is accountable for the final text.\n\n| Claim | Source | Result |\n|---|---|---|\n| Reminders uses a message broker | Deployment config and code | Wrong: a database queue is used |\n| Booking calls Payments | Code search | Verified |\n| Patient data is encrypted at rest | Cloud configuration | Unknown: ask operations |\n\n**Provenance:** "First draft produced with an AI assistant on 24 November. Claims 1 and 2 checked against the repository, claim 3 pending. Accountable: the architect."'
  },
  rubric: [
    ['Rules', 'Fewer than three', 'Rules without verification or data limits', 'Five rules covering tasks, data, verification and accountability'],
    ['Claims', 'Not listed', 'Listed without sources', 'Claims with an authoritative source for each'],
    ['Results', 'All marked correct', 'Some checked', 'Each marked verified, wrong or unknown honestly'],
    ['Provenance', 'None', 'Note without what was checked', 'Note with generated, checked and accountable parts']
  ],
  quiz: [
    ['What is the main risk of trusting an assistant’s technical claims?', ['They are always slow', 'They can sound confident and be wrong or invented', 'They are always correct', 'They cannot write text'], 1, 'Fluent output is not evidence, so claims must be checked at the source.'],
    ['What should you do before pasting architecture material into an external tool?', ['Nothing', 'Check the policy and remove secrets and personal data', 'Add more detail', 'Rename the files'], 1, 'Architecture material can be confidential and the tool may be outside your control.'],
    ['What is a provenance note?', ['A legal contract', 'A short record of what was generated, what was checked and who is accountable', 'A tool licence', 'A diagram legend'], 1, 'It lets readers judge how far to trust the document.'],
    ['Who is accountable for an AI-assisted architecture decision?', ['The assistant', 'A named person', 'Nobody', 'The vendor'], 1, 'Responsibility for a decision stays with a named person, whatever tool helped to draft it.'],
    ['How should you treat the 2027.1 curriculum release candidate?', ['As final exam content', 'As provisional until final publication and effective date are confirmed', 'As irrelevant forever', 'As a legal document'], 1, 'A release candidate may change, so check the exam body’s current documents.']
  ],
  sources: [
    'iSAQB, CPSA-F Foundation curriculum, release candidate 2027.1 (provisional). public.isaqb.org/curriculum-foundation/release-candidate/',
    'Intellica guidance. Verify claims against the code, configuration or the original document before use'
  ]
},
{
  n: 14, title: 'Exam Strategy and the Final Mock',
  lead: 'This lesson prepares you for the format and discipline of a multiple-choice architecture exam, and shows how to use the Intellica mock exams and your readiness report. The exam itself is run by iSAQB certification bodies and is booked separately.',
  slides: [
    ['What this lesson is and is not', 'Set realistic expectations about exam preparation.',
      'Intellica Level 1 is independent self-study that follows the topics of the public iSAQB CPSA-F curriculum. It is not an iSAQB course, and training is not required to sit the exam.',
      'The exam is booked with an iSAQB certification body. Its format and rules are controlled by iSAQB and its certification bodies, and they can change. Check the current rules before you book.',
      'Use the Intellica mocks to practise reading, timing and gaps, and use the certification body for the official rules.',
      'Where will you check the current exam rules before you book?'],
    ['How the exam is described', 'State the commonly published exam format.',
      'The Foundation exam is described as about 40 multiple-choice questions in about 75 minutes, with a 60 percent pass mark. Confirm the current numbers with your certification body.',
      'Topics follow the curriculum chapters. R1 goals will be examined, R2 goals may be, R3 goals will not be, and the chapter of examples is not examined. Weight your revision by that order.',
      'Plan your study time by relevance: R1 first, R2 next, R3 only for context.',
      'Which chapters would you revise first, and why?'],
    ['Question types', 'Recognise common question formats.',
      'Typical formats are single choice (one correct answer), choose several (select a stated number) and allocation (assign statements to categories). Read the instruction each time.',
      'A single choice stem may ask for the correct or for the incorrect option. Missing a word such as NOT changes the answer. Choose-several items state how many to select.',
      'Underline the instruction words in every question before reading the options.',
      'Which instruction words would most change an answer?'],
    ['Reading a question', 'Apply a reading routine.',
      'Read the last line first to learn what is asked, then read the scenario, then think of the answer before reading the options.',
      'If you think of an answer first, you are less likely to be pulled toward a plausible-sounding wrong option. Then check each option against your answer and the scenario.',
      'Answer in your head first, then compare with the options.',
      'Try this on the next practice question and note whether it helps.'],
    ['Eliminating options', 'Use elimination.',
      'Remove options that contradict the scenario, state something false about the topic, or answer a different question. Then choose among what remains.',
      'Distractors are often plausible half-truths: true in general but wrong for this scenario, or true but not answering the question asked.',
      'Cross out wrong options with a reason. If two remain, pick the one that best fits the scenario.',
      'Why is an option that is true but irrelevant still wrong?'],
    ['Time and calibration', 'Manage time and confidence.',
      'With about 40 questions and 75 minutes you have under two minutes per question. Do the easy questions first, flag uncertain ones and return to them.',
      'Confidence calibration means knowing when you know: rate your confidence for each practice answer. If you are often sure and wrong, revise the topic; if you are often unsure and right, trust your reasoning more.',
      'In practice mocks, record your confidence and compare it with your result.',
      'How often are you sure and wrong?'],
    ['Using the Intellica mocks', 'Use the mocks and readiness report correctly.',
      'The mocks are original Intellica practice questions, not real exam questions, graded with Intellica’s practice scoring. The report is guidance, not a prediction.',
      'The report shows scores by chapter and goal, time used and confidence. Practice-ready guidance: 80 percent on three different mocks, no chapter below 70 percent. Not a guarantee.',
      'Take each mock once under exam conditions, review every wrong answer, then study the weak chapters before the next mock.',
      'What would you do if one chapter stays below 70 percent?'],
    ['Exam-day plan', 'Plan the exam day.',
      'Prepare logistics, rest and a simple plan: read instructions, pace yourself, flag and return, and use the last minutes to check unanswered items.',
      'Check the certification body’s rules for identification, equipment and breaks in advance. Have a pacing mark, for example half the questions done by the halfway time.',
      'Write your plan on one page the day before, and follow it.',
      'What is your pacing mark?']
  ],
  guide: [
    'Exam preparation has two parts: knowing the material and managing the exam. The first part is the work of the earlier lessons. This lesson covers the second: how a multiple-choice exam works, how to read a question, how to eliminate wrong options, how to use your time and how to judge your own readiness honestly.',
    'The Intellica mock exams are practice tools. They are written by Intellica from the public curriculum topics. They are not real exam questions, and Intellica does not claim they predict your result. Use them to find gaps. After each mock, review every question you got wrong or guessed, and trace it back to the lesson and learning goal. Then study, and take the next mock.',
    'Keep the readiness report in perspective. Intellica’s practice-ready guide is a high bar on purpose: at least 80 percent on each of three different mocks and no chapter below 70 percent. Reaching it is a good sign. It does not guarantee a pass, and failing it does not mean you will fail. The external certification body decides the result of the real exam.'
  ],
  case: 'Illustrative case. A ClinicBook developer takes her first Intellica mock and scores 62 percent. The report shows strong results in chapters 1 and 2 and weak results in chapter 4, with two wrong answers caused by missing the word NOT. She reviews chapter 4, marks instruction words in practice, and takes the second mock the following week: 74 percent and no chapter below 65. After the third mock she scores 83 percent with every chapter at 70 or above, finishing with ten minutes spare. She checks the certification body’s current rules, books the exam and brings her one page plan.',
  lab: {
    title: 'Build your exam plan from a mock result',
    intro: 'Take the first Intellica mock in the course under timed conditions, then use the report to write a study and exam-day plan.',
    tasks: [
      'Record your mock score, your score for each chapter and the time you used, and note the chapter that was weakest.',
      'List three questions you got wrong or guessed and trace each one to a lesson and a learning goal.',
      'Write a revision plan for the next two weeks that names the lessons you will revisit and when you will take the next mock.',
      'Write your one page exam-day plan: pacing marks, how you handle flagged questions, and the rules you need to check with the certification body.'
    ],
    evidence: 'The mock numbers, the three traced questions, the revision plan and the exam-day plan.',
    model: '**Mock 1:** 62 percent; chapters 1 to 5: 80, 70, 60, 45, 60 percent; 68 minutes used of 75. Weakest: chapter 4.\n\n**Traced questions:** (1) missed NOT in a documentation question, lesson 10, goal 04-02; (2) confused view and notation, lesson 10, goal 04-05; (3) guessed a deployment single point of failure item, lesson 8.\n\n**Plan:** days 1 to 4 revisit lesson 10 and redo its quiz; days 5 to 7 revisit lesson 8; day 8 take mock 2; mark instruction words on every question.\n\n**Exam day:** half the questions by the 37 minute mark; flag anything over two minutes; use the last five minutes for flagged items; confirm ID and equipment rules with the certification body in advance.'
  },
  rubric: [
    ['Mock analysis', 'Score only', 'Score and weakest chapter', 'Score, chapters, time and weakest chapter'],
    ['Tracing', 'None', 'Questions listed without goals', 'Three questions traced to lessons and goals'],
    ['Revision plan', 'None', 'General intention', 'Dated plan with named lessons and the next mock'],
    ['Exam-day plan', 'None', 'Pacing only', 'Pacing, flagging and rules to check']
  ],
  quiz: [
    ['Who controls the format and rules of the real exam?', ['Intellica', 'The iSAQB and its certification bodies', 'The learner', 'A training provider'], 1, 'Check the current rules with the certification body before you book.'],
    ['What should you do first with a question?', ['Pick the longest option', 'Read what is asked, including words such as NOT, then think of an answer', 'Skip it always', 'Answer at random'], 1, 'Instruction words change the answer, so read them first.'],
    ['What are the Intellica mocks?', ['Real exam questions', 'Original practice questions written from public curriculum topics', 'A guarantee of passing', 'A legal certificate'], 1, 'They are practice tools and not real exam questions.'],
    ['What does the practice-ready guidance mean?', ['A promise of a pass', 'Intellica guidance: 80 percent on three different mocks and no chapter below 70 percent', 'An iSAQB requirement', 'A certificate'], 1, 'It is Intellica’s own guidance, not an iSAQB rule or a guarantee.'],
    ['Which goals are examined according to the curriculum relevance categories?', ['R3 only', 'R1 will be examined and R2 may be, while R3 will not be', 'Every goal equally', 'None of them'], 1, 'Relevance categories tell you where to concentrate your study.']
  ],
  sources: [
    'iSAQB, CPSA-F Foundation curriculum 2025.1-rev2-EN. public.isaqb.org/curriculum-foundation/curriculum-foundation-en.html',
    'iSAQB, exam information and rules. isaqb.org. Check the current rules with your certification body before you book'
  ]
}
];
