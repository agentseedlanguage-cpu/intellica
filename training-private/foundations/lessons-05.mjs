// Level 1 (Foundations), lessons 10-11. Independent Intellica self-study following the topics of the public iSAQB CPSA-F curriculum 2025.1-rev2. Not an iSAQB course.
// ClinicBook is a synthetic case. Cases marked "Illustrative" are invented. Numbers in examples are invented for teaching.
// arc42 (arc42.org) is licensed CC BY-SA 4.0; this lesson describes its structure in the author's own words.
export default [
{
  n: 10, title: 'Documenting and Communicating Architecture',
  lead: 'Architecture only helps people if they can understand it. You will learn what good documentation must do, how to choose views and notations for different readers, how to record decisions with their alternatives, and how arc42 can serve as one practical structure.',
  slides: [
    ['What documentation is for', 'Explain the requirements of technical documentation.',
      'Architecture documentation exists to be understood and used: to onboard people, to support decisions, to allow review and to remember why the system is the way it is.',
      'A 200 page document that nobody reads fails its purpose. A 15 page description with a clear context, a few diagrams and a list of decisions, kept next to the code, is more likely to be read and corrected.',
      'Ask of every document: who reads it, what do they need to decide or do, and what is the shortest form that serves them?',
      'Who is the most important reader of your architecture documentation?'],
    ['Readers and their questions', 'Adapt communication to stakeholders.',
      'Different readers ask different questions. Developers want structure and rules, operators want deployment and failure behaviour, managers want risks and cost, testers want quality scenarios.',
      'ClinicBook’s clinic owners do not need the building block view in detail; they need to know what the system can do, what it costs to run and what the main risks are. Developers need the opposite.',
      'List your readers and for each one the three questions they most need answered.',
      'What are the three questions your project manager asks about the architecture?'],
    ['Views', 'Explain and use architectural views.',
      'A view shows the system from one point of view. No single diagram can show everything, so use a few complementary views.',
      'Common views: a context view (the system and its neighbours), a building block view (static structure), a runtime view (behaviour over time) and a deployment view (where it runs). Together they answer most questions.',
      'Choose the views your readers need and keep each one focused on one question.',
      'Which view would help a new developer most in the first week?'],
    ['Notations and diagrams', 'Describe notations and the purpose of diagrams.',
      'A notation is a way of drawing or writing a model. UML, the C4 model and informal box-and-line diagrams are all used. Any notation works if the legend is clear and the diagram has one purpose.',
      'The C4 model by Simon Brown describes four levels: context, containers, components and code. It is a helpful way to choose how much detail to show. UML is a standardised family of diagram types. A diagram with unlabelled arrows and unexplained colours helps nobody.',
      'Give every diagram a title, a legend and one message. Prefer abstraction over completeness.',
      'Which diagram in your project cannot be understood without the person who drew it?'],
    ['Recording decisions', 'Explain and document architectural decisions.',
      'A decision record states the context, the decision, the alternatives considered and the consequences. Its job is to preserve the reason, not only the result.',
      'Michael Nygard proposed short decision records in 2011. A record might say: Context: reminders must reach patients at local time. Decision: store times in UTC and convert at the edge. Alternatives: store local time; store both. Consequences: conversion logic is needed in two blocks.',
      'Write one short record per significant decision, and keep it near the code.',
      'Which past decision in your system has lost its reason?'],
    ['arc42 as a structure', 'Describe arc42 as one practical documentation structure.',
      'arc42 is a twelve-section template, freely usable under Creative Commons BY-SA 4.0; credit arc42.org when you adapt it.',
      'Sections: introduction and goals, constraints, context, solution strategy, building blocks, runtime, deployment, cross-cutting concepts, decisions, quality, risks, glossary. Fill only those you need.',
      'Use a template as a checklist to avoid forgetting topics, and keep every section short.',
      'Which arc42 section would you fill first for your system?'],
    ['Keeping documentation alive', 'Explain how to keep documentation current.',
      'Documentation decays unless it is part of the work. Keep it small, near the code, reviewed with changes and generated where possible.',
      'A diagram generated from the code or a configuration file cannot drift from it. A decision record added in the same change as the code makes the reason travel with the change.',
      'Make a documentation update part of the definition of done for architectural changes.',
      'How would you notice that a diagram is out of date?'],
    ['Checklist for ClinicBook', 'Apply a documentation checklist to a small system.',
      'Good documentation names its readers, offers a few focused views, records decisions with alternatives and has a plan to stay current.',
      'ClinicBook: readers listed with questions, four views, five decision records, a glossary of clinic terms and an update step in the release checklist.',
      'Review the documentation against the checklist before sharing it.',
      'Which item on the checklist is weakest in your project?']
  ],
  guide: [
    'Start documentation from the reader, not from the template. Ask who needs to understand the architecture and what they must do with that understanding. A new developer needs the context and the structure. An operator needs the deployment and failure behaviour. A manager needs risks and trade-offs. One document with a clear table of contents can serve all of them, as long as each section is short and has one purpose.',
    'Use views and diagrams to communicate, not to decorate. A good diagram has a title, a legend and one message. Choose a notation your team already understands, and explain any special symbols. Abstraction is the point: leave out what the reader does not need.',
    'Record decisions with their reasons and the alternatives you rejected. The reasons are what future readers cannot reconstruct from the code. A template such as arc42 can help you remember what to cover, but filling every section for its own sake is a waste. Keep it short, keep it close to the code and keep it current.'
  ],
  case: 'Illustrative case. A new ClinicBook developer takes three weeks to understand the system because the documentation is a 120 page document written before development started. The team replaces it with a 14 page description: a one page goals and constraints summary, a context diagram, a building block view with one sentence per block, three runtime scenarios, a deployment diagram, a page of cross-cutting rules and eight decision records. The next new developer submits a first change in four days and fixes two small mistakes in the document while reading it.',
  lab: {
    title: 'Plan your documentation and write two decision records',
    intro: 'Use your own system or ClinicBook. You will name your readers, choose the views to provide and write two short decision records.',
    tasks: [
      'List three readers of your architecture documentation and the three questions each one needs answered.',
      'Choose the views you will provide and say which reader and which question each view serves.',
      'Write a decision record for one important decision with its context, the decision, two alternatives and the consequences.',
      'Write a second record for a decision that was hard to reverse, and note the review date or trigger for revisiting it.'
    ],
    evidence: 'The readers and questions, the view list, and two decision records.',
    model: '**Readers:** developer (where does code go? what rules apply? how do I run it?), operator (where does it run? what fails? how do I roll back?), clinic owner (what can it do? what are the risks? what does it cost?).\n\n**Views:** context (owner), building blocks (developer), runtime scenarios (developer, operator), deployment (operator).\n\n**Decision 1.** Context: reminders must arrive at local time in several time zones. Decision: store all times in UTC and convert at the edge. Alternatives: store local time; store both. Consequences: conversion code in two blocks; daylight-saving tests required.\n\n**Decision 2.** Context: choice of database. Decision: one relational database for all blocks, each block owning its tables. Alternatives: separate databases; document store. Consequences: simple operation, harder to split later. Revisit if a second team needs independent deployment.'
  },
  rubric: [
    ['Readers', 'Not named', 'Named without questions', 'Three readers with three questions each'],
    ['Views', 'None chosen', 'Views listed without purpose', 'Each view tied to a reader and question'],
    ['Decision records', 'Decision only', 'Context and decision', 'Context, decision, alternatives and consequences'],
    ['Reversibility', 'Not considered', 'Mentioned', 'Review trigger recorded for the hard-to-reverse decision']
  ],
  quiz: [
    ['What is the best test of whether a document is useful?', ['Its length', 'Whether its readers can use it to understand or decide', 'The number of diagrams', 'The tool used'], 1, 'Documentation exists for its readers and for the tasks they need to do with it.'],
    ['What should a decision record contain?', ['Only the decision', 'Context, decision, alternatives and consequences', 'Only the date', 'Only the author'], 1, 'The reasons and alternatives are what future readers cannot reconstruct.'],
    ['Which is a purpose of using several views?', ['To make the document longer', 'To answer different questions from different points of view', 'To avoid diagrams', 'To hide decisions'], 1, 'No single view can answer every question, so several focused views are used.'],
    ['What licence covers the arc42 template?', ['Proprietary, no reuse', 'Creative Commons BY-SA 4.0', 'Public domain', 'GPL'], 1, 'arc42 is available under CC BY-SA 4.0, with credit to arc42.org.'],
    ['How can documentation be kept current?', ['Write it once at the start', 'Keep it small, near the code and update it with changes', 'Store it on paper', 'Never change it'], 1, 'Documentation that is part of the work is more likely to stay correct.']
  ],
  sources: [
    'arc42 documentation and template overview. docs.arc42.org, license CC BY-SA 4.0 (arc42.org/license)',
    'Nygard, M. Documenting Architecture Decisions. cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
    'Brown, S. The C4 model for visualising software architecture. c4model.com',
    'ISO/IEC/IEEE 42010:2022, Architecture description. iso.org'
  ]
},
{
  n: 11, title: 'Analysing and Assessing Architecture',
  lead: 'A design is a set of claims. This lesson shows you how to test those claims: why we analyse architecture, which evidence we can use and how far to trust it, and how to check that the system still follows its decisions.',
  slides: [
    ['Why analyse architecture', 'Know the reasons for architecture analysis.',
      'We analyse architecture to find risks and to check that the design meets its goals while changes are still cheap.',
      'Typical reasons are: before building, to check the plan against quality goals; during building, to confirm decisions are followed; and before a major change, to understand risk. A short review of ClinicBook’s reminder design before launch is cheaper than an outage afterwards.',
      'Decide what question the analysis answers, and when it is cheapest to ask.',
      'What is the biggest unanswered question about your design?'],
    ['Analysing qualities with scenarios', 'Use quality scenarios in analysis.',
      'A quality scenario with a measurable response turns "is it fast enough?" into a claim you can test.',
      'Scenario: during Monday morning peak, 300 booking requests a minute are confirmed within two seconds for 95 percent of requests. You can check this by reading the design for bottlenecks, by building a prototype or by running a load test.',
      'Pick the most important scenarios and ask, for each, what evidence would convince you.',
      'Which scenario in your system is both important and unproven?'],
    ['Sources of evidence', 'Name sources of evidence.',
      'Evidence can come from documents, models, source code, metrics, tests, logs and measurements on a running system. Each tells you something different.',
      'Documents show intent. Code shows what was built. Tests show what was checked. Production metrics show real behaviour. Where they disagree, the running system is the most reliable about what it does, but it cannot tell you what it was meant to do.',
      'Combine sources and say how strong each is for the claim you want to test.',
      'Which source would you trust most for response times, and which for intent?'],
    ['Limits of evidence', 'Recognise the limits of evidence.',
      'Every source has limits: documents age, code is large, tests cover only what was thought of, and measurements depend on the test conditions.',
      'A load test on a laptop with a small data set may say little about a production database with five years of data. A review done only by the authors may miss shared blind spots.',
      'State the conditions and limits of each result, and avoid claiming more than you showed.',
      'What condition of your last performance test differed from production?'],
    ['Reviews and scenario-based evaluation', 'Describe a lightweight review.',
      'A review brings people together to check a design against scenarios. Methods such as ATAM from the Software Engineering Institute structure this; a small team can do a short version.',
      'A short review of ClinicBook might run for two hours with the architect, two developers and an operator: list the top five quality scenarios, walk the design for each, and note risks, sensitivity points and trade-offs.',
      'Invite someone who did not design it, and end with a list of risks with owners.',
      'Who in your team could review your design with fresh eyes?'],
    ['Conformance to decisions', 'Evaluate conformance to architectural decisions.',
      'A decision only helps if the implementation follows it. Checking conformance compares the code and the running system with the decisions.',
      'If the decision says only Booking writes appointment data, a check can search the code for other writers, or a dependency rule in the build can fail when another block accesses the table.',
      'Turn important decisions into checks, manual at first and automated when possible.',
      'Which decision in your system could be checked automatically?'],
    ['Risks and findings', 'Turn analysis results into risks and actions.',
      'Findings are useful only when they become risks with an owner and an action: fix, accept, or investigate further.',
      'A finding such as "reminder queue has one instance" becomes a risk: reminders may be delayed if the queue fails; impact medium; owner named; action accept for now, review in three months.',
      'Record each finding as a risk with impact, owner and decision.',
      'Which risk in your system has no owner?'],
    ['Checklist for ClinicBook', 'Apply an analysis checklist to a small system.',
      'A good analysis names its question, chooses scenarios, collects evidence with limits, and ends with risks and owners.',
      'ClinicBook: question is whether the booking design holds at peak load; evidence is a code review and a load test; limits are a test database one tenth the production size; result is two risks with owners.',
      'Use this checklist before and after each review.',
      'What question would your next review answer?']
  ],
  guide: [
    'Analysing architecture means testing the claims a design makes. A design says "this will be fast enough", "this can be changed in a day", "this will keep working if one server fails". Each claim can be checked, and the earlier you check it, the cheaper the answer. Start by choosing the few claims that matter most, usually the top quality scenarios, and ask what evidence would convince you.',
    'Evidence comes in several kinds, and none is complete. Documents show intent but age. Code shows what was built but is hard to read at scale. Tests show only what someone thought to test. Measurements show what happened under the conditions of the measurement. Good analysis combines sources and states their limits honestly, so that readers know how far to trust the result.',
    'Finish every analysis with action. Turn findings into risks, give each an owner and a decision: fix it, accept it for now, or look into it further. Check also that the code and the running system follow the decisions you recorded. A decision that nobody checks slowly turns into a wish.'
  ],
  case: 'Illustrative case. Two weeks before launch, the ClinicBook team runs a two hour review. They list the top five quality scenarios, walk the design for each and find that nothing in the design limits how fast reminders are sent to the messaging provider, which has a rate limit. A load test with ten times the expected number of reminders confirms that messages would be rejected. They add a queue with a rate limiter and record the decision. They also add a build check that fails if any block other than Reminders calls the messaging provider.',
  lab: {
    title: 'Plan an architecture analysis',
    intro: 'Use your own system or ClinicBook. You will choose scenarios, name the evidence you would collect and record the risks that result.',
    tasks: [
      'Write the question your analysis should answer and say when in the project it is cheapest to ask it.',
      'Choose three quality scenarios with measurable responses that the analysis will test.',
      'For each scenario name the evidence you would collect and state one limit of that evidence.',
      'Write two risks that you expect to find, each with impact, owner and a decision to fix, accept or investigate.'
    ],
    evidence: 'The analysis question, three scenarios, the evidence and its limits, and two risks with owners.',
    model: '**Question:** will the booking design meet peak load and survive the loss of one server? Cheapest to ask before launch.\n\n| Scenario | Evidence | Limit |\n|---|---|---|\n| 300 bookings a minute confirmed in 2 s for 95 percent | Load test on test environment | Test database is one tenth of production size |\n| One app server fails; bookings continue within 30 s | Failover drill | Drill run on a quiet afternoon only |\n| Reminder rate stays under provider limit | Code review plus test with 10x volume | Provider sandbox may not enforce limits |\n\n**Risk 1:** reminders could exceed the provider rate limit. Impact medium. Owner: reminders lead. Decision: fix with a queue and rate limiter.\n\n**Risk 2:** queue service has one instance. Impact low. Owner: operations. Decision: accept, review in three months.'
  },
  rubric: [
    ['Question', 'None', 'Vague question', 'Clear question with timing'],
    ['Scenarios', 'No numbers', 'Some measurable', 'Three with measurable responses'],
    ['Evidence and limits', 'Evidence only', 'Limits for some', 'Evidence and a limit for each scenario'],
    ['Risks', 'None', 'Risks without owners', 'Risks with impact, owner and decision']
  ],
  quiz: [
    ['What is the main reason to analyse architecture early?', ['To produce documents', 'To find risks while changes are cheap', 'To avoid testing', 'To satisfy auditors only'], 1, 'Early analysis finds problems when they are still cheap to fix.'],
    ['Which source best shows what a running system really does?', ['The original plan', 'Measurements from the running system', 'A diagram', 'A meeting note'], 1, 'Measurements reflect actual behaviour, within the limits of how they were taken.'],
    ['Why state the limits of evidence?', ['To weaken the result', 'So readers know how far to trust it', 'To delay decisions', 'It is not needed'], 1, 'Every result holds only under the conditions in which it was produced.'],
    ['What makes a finding useful?', ['It is written down', 'It becomes a risk with an owner and a decision', 'It is long', 'It is private'], 1, 'Findings need owners and decisions to lead to action.'],
    ['What does conformance checking compare?', ['Two documents', 'The implementation with the recorded decisions', 'Two teams', 'Two prices'], 1, 'It checks that the system follows the decisions made about it.']
  ],
  sources: [
    'SEI, Architecture Tradeoff Analysis Method (ATAM) collection. sei.cmu.edu',
    'arc42 documentation, sections 10 Quality Requirements and 11 Risks and Technical Debt. docs.arc42.org',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapters on evaluating architecture. Addison-Wesley, 2021'
  ]
}
];
