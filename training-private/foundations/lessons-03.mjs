// Level 1 (Foundations), lessons 6-7. Independent Intellica self-study following the topics of the public iSAQB CPSA-F curriculum 2025.1-rev2. Not an iSAQB course.
// ClinicBook is a synthetic case. Cases marked "Illustrative" are invented. Numbers in examples are invented for teaching.
export default [
{
  n: 6, title: 'Interfaces, Contracts and Data Models',
  lead: 'Blocks meet at interfaces, and interfaces are promises. You will learn to design and document an interface, manage dependencies between blocks, and decide who owns which data.',
  slides: [
    ['What an interface is', 'Explain what an interface is.',
      'An interface is the agreed way for one building block to use another. It states what can be asked, what is returned and what may go wrong.',
      'The Reminders block of ClinicBook may offer one operation: schedule a reminder for an appointment at a given local time. Callers need not know which messaging provider sends it.',
      'Describe each interface by purpose, operations, inputs, outputs and errors before you build it.',
      'What is the smallest useful interface for your most important block?'],
    ['Good interface design', 'Apply simple rules for interface design.',
      'A good interface is small, stable, expressed in the caller’s language, and hard to misuse.',
      'An operation named updateRow(table, id, values) leaks storage detail and lets callers break rules. An operation named moveAppointment(appointmentId, newSlot) states intent and lets the block enforce its rules.',
      'Name operations by intent. Keep the surface small. Validate input at the border.',
      'Which operation in your system exposes storage details instead of intent?'],
    ['Contracts and compatibility', 'Explain interface contracts and compatibility.',
      'A contract is what the caller can rely on: meaning of fields, ordering, limits, errors and timing. Changing it may break callers.',
      'Adding an optional field to a response is usually safe. Renaming a field, changing its unit from minutes to seconds, or making an optional field required breaks existing callers.',
      'Treat published interfaces as promises. Add, do not change. Version when you must break.',
      'Which change to an interface would break a mobile app that cannot be updated at once?'],
    ['Dependencies between blocks', 'Explain how to manage dependencies.',
      'Every dependency is a cost: a change in one block may force a change in another. Keep them few, explicit and pointing in one direction.',
      'If Booking uses Calendar and Calendar also uses Booking, they form a cycle: neither can change or be tested alone. Breaking the cycle with a shared interface or an event removes the knot.',
      'Draw the dependency arrows and look for cycles and for arrows that bypass interfaces.',
      'Is there a cycle between two of your blocks? How would you break it?'],
    ['Data and data models', 'Explain why data and data models matter in architecture.',
      'Data usually outlives the code. How it is structured, who owns it and how it is shared shape many other decisions.',
      'ClinicBook holds patient details, appointments and payments. Each has an owner block. If every block reads and writes every table, any schema change affects everything.',
      'Give each important data item one owner, and let others reach it through the owner’s interface.',
      'Who owns the patient record in your system?'],
    ['Documenting an interface', 'Describe what to document about an interface.',
      'An interface description says what it is for, which operations exist, what each needs and returns, what errors occur, and any rules such as order, limits or timing.',
      'A short table with operation, input, output, errors and notes is often enough. It must be easy to find and kept next to the building block description.',
      'Write the interface description before callers depend on it, and update it with every change.',
      'Where would a new developer find the Reminders interface today?'],
    ['Common mistakes', 'Recognise common interface mistakes.',
      'Common mistakes are sharing a database between blocks, exposing internal types, undocumented side effects and silent breaking changes.',
      'Two teams that share one database table cannot change it independently, because every column is used by both. The shared table is an interface that nobody wrote down, and so nobody owns it.',
      'Treat any shared structure as an interface and manage it as one.',
      'What shared structure in your system is an unwritten interface?'],
    ['Checklist for ClinicBook', 'Apply interface and data rules to a small system.',
      'Every block boundary has a described interface, no cycles, and every important data item has one owner.',
      'ClinicBook: Booking owns appointments; Accounts owns patients; Payments owns payment records; Reminders reads a copy of what it needs through an interface.',
      'Tick the checklist for each block before you call the design ready for review.',
      'Which item would a reviewer find missing first?']
  ],
  guide: [
    'Most architecture problems appear at the borders between blocks. An interface is not only a list of functions. It is the agreement between two teams or two parts of the code about what may be asked, what will happen and what may go wrong. The more precisely it is written, the easier each side is to build, test and change.',
    'Dependencies grow quietly. A single convenience call becomes a habit, and soon two blocks cannot change independently. Draw the dependencies, look for cycles and for shortcuts around interfaces, and remove the ones that do not serve a requirement. A dependency that nobody can justify is a cost with no benefit.',
    'Treat data as an architectural concern. Decide which block owns each important item, how others read it, and what happens when its structure changes. Data models that nobody owns tend to be changed by everybody, which is how systems become impossible to change safely.'
  ],
  case: 'Illustrative case. In ClinicBook, both Booking and Reminders read the appointments table directly. When the team adds time-zone support by changing the appointment time column, reminders silently start sending at the wrong hour. After the incident, they make Booking the owner of appointments and publish a small interface: getAppointmentsForReminder(date, clinic). Reminders no longer touches the table. The interface description lists the fields, the time zone rule and the error cases. The next schema change affects only Booking.',
  lab: {
    title: 'Write one interface and map dependencies and data owners',
    intro: 'Use your own system or ClinicBook. You will describe one important interface, check dependencies and assign data owners.',
    tasks: [
      'Write an interface description for one block with its purpose, operations, inputs, outputs and error cases in a table.',
      'Draw or list the dependencies between your blocks and mark any cycle or shortcut around an interface.',
      'List your five most important data items and name the one block that owns each.',
      'Name one change to the interface that would break callers and describe how you would roll it out safely.'
    ],
    evidence: 'The interface table, the dependency list with problems marked, the data-owner table and the safe change plan.',
    model: '**Interface: Reminders**\n\n| Operation | Input | Output | Errors |\n|---|---|---|---|\n| scheduleReminder | appointmentId, sendAtLocal, channel | reminderId | UnknownAppointment, PastTime |\n| cancelReminder | reminderId | none | UnknownReminder |\n\n**Dependencies:** Booking to Calendar, Booking to Payments, Booking to Reminders. Problem: Calendar also calls Booking, a cycle. Fix: Calendar publishes availability changes as events.\n\n**Data owners:** appointments (Booking), patients (Accounts), payments (Payments), clinic settings (Admin), reminder jobs (Reminders).\n\n**Breaking change:** renaming sendAtLocal. **Rollout:** add the new name, accept both for one release, update callers, then remove the old name.'
  },
  rubric: [
    ['Interface description', 'Operation names only', 'Operations with inputs', 'Operations, inputs, outputs and errors'],
    ['Dependencies', 'Not drawn', 'Drawn without problems marked', 'Cycles and shortcuts marked with a fix'],
    ['Data ownership', 'No owners', 'Owners for some items', 'One owner for each of five items'],
    ['Change safety', 'No plan', 'Plan without compatibility step', 'Plan with a period where both versions work']
  ],
  quiz: [
    ['Which change is most likely to break existing callers?', ['Adding an optional response field', 'Changing a field from minutes to seconds', 'Adding documentation', 'Adding a new operation'], 1, 'Changing the meaning or unit of an existing field breaks callers that rely on it.'],
    ['What is wrong with two blocks sharing one database table?', ['Nothing', 'The table becomes an unwritten interface that neither can change alone', 'It is always faster', 'It is required by law'], 1, 'A shared structure is an interface and needs an owner and a description.'],
    ['What does a cycle between two blocks cause?', ['Better testing', 'Neither can change or be tested independently', 'Lower cost', 'Clearer ownership'], 1, 'In a cycle each block depends on the other, so they behave as one block.'],
    ['Which operation name expresses intent?', ['updateRow', 'setField', 'moveAppointment', 'writeTable'], 2, 'Intent names let the owner enforce rules and hide storage.'],
    ['Why give data one owner?', ['To restrict access for its own sake', 'So its structure and rules can change in one place', 'To make backups smaller', 'To avoid documentation'], 1, 'One owner keeps changes and rules in one place.']
  ],
  sources: [
    'arc42 documentation, section 5 Building Block View (interfaces). docs.arc42.org/section-5/',
    'Parnas, D.L. On the criteria to be used in decomposing systems into modules. Communications of the ACM, 1972',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapter on interfaces. Addison-Wesley, 2021'
  ]
},
{
  n: 7, title: 'Runtime Views and Distributed Systems',
  lead: 'Structure shows what exists; the runtime view shows what happens. You will learn to describe important scenarios and meet the problems that appear once parts talk over a network: delay, failure, duplicates and ordering.',
  slides: [
    ['Why a runtime view', 'Explain what a runtime view adds.',
      'A runtime view shows how building blocks work together in a specific scenario, in order, including failure paths.',
      'Booking an appointment in ClinicBook touches Booking, Calendar, Payments and Reminders. A building block diagram cannot show the order, or what happens if the payment fails after the slot is held.',
      'Describe the three to five scenarios that matter most for risk, not every use case.',
      'Which scenario in your system is riskiest at runtime?'],
    ['Describing a scenario', 'Describe how to write a runtime scenario.',
      'A scenario names a trigger, the blocks involved, the steps in order, and the outcome. A sequence diagram or a numbered list both work.',
      'Scenario: patient books a slot. 1 Booking asks Calendar to hold the slot. 2 Booking asks Payments to take a deposit. 3 On success Booking confirms and asks Reminders to schedule. 4 On failure Booking releases the slot.',
      'Add the failure path to every scenario; it is where the design is tested.',
      'What happens in your scenario if step 2 fails?'],
    ['Synchronous and asynchronous', 'Distinguish synchronous from asynchronous communication.',
      'Synchronous calls wait for an answer. Asynchronous messages continue without waiting. Each has different failure behaviour.',
      'If Booking waits for the messaging provider before confirming, a provider outage blocks bookings. If Booking sends a message asynchronously and confirms at once, the outage delays reminders only.',
      'Choose asynchronous communication where a delay is acceptable and the caller should not wait.',
      'Which call in your system could be asynchronous?'],
    ['Networks fail', 'Describe basic failure modes of distributed systems.',
      'Calls over a network can be slow, fail, or fail after succeeding. A caller often cannot tell which.',
      'If Booking asks Payments to take a deposit and the answer never arrives, the deposit may or may not have been taken. Retrying without care may charge the patient twice.',
      'Assume any remote call can time out, and decide what the caller does then.',
      'What should Booking do if the deposit call times out?'],
    ['Retries and duplicates', 'Explain why retries need idempotence.',
      'A retry can deliver the same request twice. An operation is idempotent if doing it twice has the same effect as doing it once.',
      'A deposit request that carries a unique request key lets Payments recognise a repeat and return the first result instead of charging again.',
      'Give retried operations a unique key and let the receiver ignore repeats.',
      'Which operation in your system would cause harm if it ran twice?'],
    ['Ordering and consistency', 'Explain ordering and consistency problems.',
      'When parts keep their own copies of data or messages arrive out of order, they may briefly disagree. Some disagreement is acceptable; some is not.',
      'A cancellation may reach Reminders before the booking message that created the reminder. If Reminders ignores the cancel and then creates the reminder, a cancelled patient gets a message.',
      'Decide which data must be consistent at once and which may catch up, and design for that.',
      'Which data in your system must never be out of date?'],
    ['Timeouts and graceful failure', 'Apply timeouts and degraded behaviour.',
      'Set explicit timeouts, decide what the user sees when something fails, and keep a failure in one block from stopping everything.',
      'If the messaging provider is down, ClinicBook can still book appointments and queue reminders to send later, and tell the receptionist that reminders are delayed.',
      'For each external dependency, write what the system does when it is slow or down.',
      'What does your system do today when the payment provider is down?'],
    ['Checklist for ClinicBook', 'Apply a runtime checklist to a small system.',
      'A runtime review asks for scenarios, failure paths, retry safety, ordering and degraded behaviour for each external call.',
      'ClinicBook: booking and cancelling scenarios with failure paths, request keys on deposits, a rule for out-of-order cancel messages and a queue for delayed reminders.',
      'Run the checklist on each scenario and note gaps as risks.',
      'Which gap would you fix first?']
  ],
  guide: [
    'A runtime view answers the question the structure diagram cannot: what actually happens, in what order, when something goes wrong. Choose the scenarios that carry risk, such as the most important user action, a failure of an external system and a slow day. Write each as a short numbered list or a sequence diagram that includes the failure path.',
    'Distributed systems add a set of problems that a single program does not have. Calls can be slow, can fail, or can succeed without the caller learning of it. Messages can arrive twice or out of order. Parts can hold different views of the data for a short time. None of this is exotic; it appears as soon as two parts talk over a network.',
    'Foundation level does not ask for deep theory, but it does ask you to recognise these problems and apply simple remedies: explicit timeouts, retries that are safe because they are idempotent, asynchronous messaging where delay is acceptable, and clear rules for what must be consistent at once and what may catch up.'
  ],
  case: 'Illustrative case. On a busy Monday the ClinicBook payment provider answers slowly. Booking waits, requests pile up and receptionists cannot book. The team rewrites the scenario with a three second timeout, a unique request key on deposits and a rule: if the deposit result is unknown, hold the slot for ten minutes, show the patient a pending state and check the result later. Two weeks later a provider outage lasts twenty minutes. Appointments still reach the pending state, no patient is charged twice, and staff are told that confirmations will follow.',
  lab: {
    title: 'Write two runtime scenarios with failure paths',
    intro: 'Use your own system or ClinicBook. You will describe a success scenario and a failure scenario and decide how the system behaves when a dependency is slow.',
    tasks: [
      'Write the main scenario for your system as numbered steps naming the blocks involved in order.',
      'Write a failure scenario for one external dependency and state what the user sees and what the system does.',
      'Identify one operation that must be safe to retry and describe how a repeat is recognised.',
      'State one piece of data that must be consistent at once and one that may catch up, with a reason for each.'
    ],
    evidence: 'Two numbered scenarios, the retry rule, and the two consistency decisions with reasons.',
    model: '**Scenario 1: patient books a slot.**\n1. Booking asks Calendar to hold the slot for 10 minutes.\n2. Booking asks Payments to take a deposit with request key K.\n3. Payments confirms. Booking confirms the appointment and asks Reminders to schedule.\n\n**Scenario 2: payment provider is slow.**\n1. The deposit call times out after 3 seconds.\n2. Booking shows the patient "payment pending" and keeps the hold.\n3. A background check asks Payments for the result of key K. On success confirm; on failure release the slot.\n\n**Retry-safe:** takeDeposit, because Payments returns the stored result for a repeated key.\n\n**Consistent at once:** slot availability, to prevent double booking. **May catch up:** reminder schedule, because a short delay does not harm the patient.'
  },
  rubric: [
    ['Main scenario', 'Blocks listed without order', 'Ordered but incomplete', 'Ordered steps naming every block'],
    ['Failure path', 'None', 'Failure named without behaviour', 'User view and system behaviour stated'],
    ['Retry safety', 'Not considered', 'Retry mentioned', 'Repeat recognised through a unique key'],
    ['Consistency', 'Not considered', 'One item', 'One strict and one relaxed item with reasons']
  ],
  quiz: [
    ['What does a runtime view show that a building block view does not?', ['Colour choices', 'How blocks interact in order, including failures', 'Code size', 'Team structure'], 1, 'It shows behaviour over time for specific scenarios.'],
    ['What does idempotent mean for an operation?', ['It is very fast', 'Doing it twice has the same effect as once', 'It never fails', 'It is asynchronous'], 1, 'Idempotence makes retries safe because repeats do no further harm.'],
    ['Why might a caller be unsure after a timeout?', ['The request may or may not have been processed', 'The network is always down', 'The server is always faster', 'The request was certainly lost'], 0, 'A timeout does not tell the caller whether the work happened.'],
    ['When is asynchronous communication most suitable?', ['When the caller must have the result immediately', 'When a delay is acceptable and the caller should not wait', 'Never in production', 'Only for logging'], 1, 'Asynchronous messaging decouples caller and receiver in time.'],
    ['Which data most needs strict consistency?', ['Reminder text', 'Slot availability to prevent double booking', 'Page colours', 'Log lines'], 1, 'Double booking harms users, so availability must be consistent at once.']
  ],
  sources: [
    'arc42 documentation, section 6 Runtime View. docs.arc42.org/section-6/',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapters on availability and performance. Addison-Wesley, 2021',
    'Kleppmann, M. Designing Data-Intensive Applications, chapter 8 The Trouble with Distributed Systems. O’Reilly, 2017'
  ]
}
];
