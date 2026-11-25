// Level 1 (Foundations), lessons 8-9. Independent Intellica self-study following the topics of the public iSAQB CPSA-F curriculum 2025.1-rev2. Not an iSAQB course.
// ClinicBook is a synthetic case. Cases marked "Illustrative" are invented. Numbers in examples are invented for teaching.
export default [
{
  n: 8, title: 'Deployment and Infrastructure',
  lead: 'Software only helps people once it runs somewhere. You will learn to describe where building blocks run, which environments exist, and how infrastructure choices affect quality goals, cost and risk.',
  slides: [
    ['Why deployment is architecture', 'Explain why deployment belongs in the architecture.',
      'Where and how a system runs affects availability, performance, security, cost and how fast the team can change it, so it is an architectural concern.',
      'Two copies of ClinicBook with identical code can behave very differently: one on a single small server in a clinic back office, the other on managed cloud services with a standby database in another zone. Their availability, cost and operating effort differ.',
      'Decide early what the system must survive, and let that decide how it is deployed.',
      'What must your system survive: a server crash, a data centre outage, or neither?'],
    ['The deployment view', 'Describe the deployment view.',
      'A deployment view shows the nodes the system runs on, such as servers, containers or managed services, and which building blocks run on each, with the links between them.',
      'A simple ClinicBook deployment view: a web front end on a content network, application servers in two zones behind a load balancer, one database with a standby, and connections out to the payment and messaging providers.',
      'Draw nodes, the blocks on them and the network links, and mark the external providers.',
      'Which block in your system runs in more than one place?'],
    ['Environments', 'Explain why separate environments matter.',
      'Development, test and production should be separate so that mistakes and experiments cannot harm real users or real data.',
      'If a tester runs a load test against a production database that holds patient records, it risks outages and exposure of data. A separate test environment with synthetic data avoids both.',
      'Keep production data out of other environments, and keep the environments as alike as practical.',
      'Do your tests ever touch production data?'],
    ['Single points of failure', 'Identify single points of failure.',
      'A single point of failure is one part whose failure stops the whole system. Finding them is a core deployment review activity.',
      'In ClinicBook, one database server without a standby is a single point of failure. So is a single person who knows the deployment steps. Each can be reduced by duplication or documentation.',
      'List every part that has only one instance and decide whether the requirement allows it.',
      'What is the single point of failure in your system today?'],
    ['Infrastructure constraints', 'Recognise infrastructure constraints.',
      'Infrastructure may be a constraint: a company cloud, a data residency rule or a hosting contract can limit your choices before design begins.',
      'If patient data must stay in a given country, the database and backups must be placed there, which limits which cloud regions and which managed services ClinicBook can use.',
      'Collect infrastructure constraints early and record them with the other constraints.',
      'Which infrastructure rule limits your options today?'],
    ['Delivery and change', 'Explain how deployment affects the speed of change.',
      'How easy it is to build, test and release a change affects how often the team can safely change the system.',
      'If a release takes a manual six hour checklist, the team will release rarely and in large, risky batches. An automated pipeline that builds, tests and deploys in minutes makes small, frequent releases possible.',
      'Treat the path from commit to production as part of the architecture and keep it short and repeatable.',
      'How long does a small change take to reach production in your team?'],
    ['Operations concerns', 'Name operations concerns the architecture should address.',
      'Someone has to run the system: monitor it, back it up, update it and respond when it fails. The architecture should make that practical.',
      'ClinicBook needs backups that are tested by restoring them, health checks that tell operators which block is unwell and a way to roll back a bad release.',
      'Write down what operations needs from the design, and check the design provides it.',
      'When did you last restore a backup to prove it works?'],
    ['Checklist for ClinicBook', 'Apply a deployment checklist to a small system.',
      'A deployment review checks the nodes, the environments, single points of failure, constraints, the release path and operations needs.',
      'ClinicBook: two application servers in two zones, a database with a standby, three environments with synthetic test data, an automated pipeline and a monthly restore test.',
      'Walk the checklist and record every gap as a risk with an owner.',
      'Which gap would you close first?']
  ],
  guide: [
    'Deployment is where an architecture meets the real world. A design that looks sound on paper can fail because of where it runs: a single server, a network link that is slower than assumed, an environment that does not match production. The deployment view makes these facts visible so they can be judged against the quality goals.',
    'Start from what the system must survive and how fast it must change. If a crash of one server must not stop bookings, you need more than one server. If changes must reach users within a day, you need an automated and repeatable release path. Constraints such as hosting contracts or data residency rules narrow the options and should be recorded early.',
    'Also remember the people who run the system. Backups, monitoring, upgrades and rollbacks are architecture topics because the design can make them easy or very hard. A system that nobody can safely operate is not a good architecture, however elegant it is on a diagram.'
  ],
  case: 'Illustrative case. ClinicBook starts on one virtual server with the database on the same machine. After the first outage the clinic owners ask for bookings to work even if one server fails. The team moves to two application servers behind a load balancer and a database with a standby in a second zone, adds a separate test environment with synthetic patient data, and automates releases. They also schedule a monthly restore of the latest backup into the test environment. The first restore reveals that the backup did not include uploaded consent forms. They fix it before it matters.',
  lab: {
    title: 'Draw the deployment view and review it',
    intro: 'Use your own system or ClinicBook. You will describe where the blocks run, list environments and find single points of failure.',
    tasks: [
      'List the nodes your system runs on and which building blocks run on each.',
      'List your environments and say what data each one holds.',
      'Find every single point of failure and say whether your requirements accept it or not.',
      'Write two operations needs, for example backup and rollback, and say how the design provides each one.'
    ],
    evidence: 'The node list with blocks, the environment table, the single points of failure with decisions and the two operations needs.',
    model: '**Nodes:** CDN (web front end); app server A and B in different zones (Booking, Calendar, Payments, Reminders, Accounts, Admin); database primary with standby; queue service (reminder jobs).\n\n| Environment | Data |\n|---|---|\n| Development | synthetic |\n| Test | synthetic, same shape as production |\n| Production | real patient data |\n\n**Single points of failure:** the queue service has one instance. Decision: accepted for now, because delayed reminders do not harm patients. The release script is known to one person: not accepted, to be documented and automated.\n\n**Operations:** backup (daily database snapshot, restored monthly into test), rollback (previous release kept for one week and redeployed by the pipeline in under ten minutes).'
  },
  rubric: [
    ['Nodes and blocks', 'Nodes only', 'Some blocks placed', 'Every block placed on a node'],
    ['Environments', 'Not listed', 'Listed without data', 'Listed with the data each holds'],
    ['Single points of failure', 'None found', 'Found without a decision', 'Found, each with an accept or fix decision'],
    ['Operations', 'Not considered', 'One need named', 'Two needs with how the design supports them']
  ],
  quiz: [
    ['What does a deployment view show?', ['Class names', 'The nodes the system runs on and the blocks on each', 'The team structure', 'The user interface'], 1, 'It maps building blocks to the infrastructure they run on.'],
    ['What is a single point of failure?', ['A very fast component', 'A part whose failure stops the whole system', 'A test case', 'A requirement'], 1, 'If it fails, everything depending on it stops.'],
    ['Why keep production data out of test environments?', ['It saves disk space', 'To protect real data and avoid harming real users', 'Because tests are slow', 'It is never possible'], 1, 'Test work can cause outages or expose sensitive data.'],
    ['How does the release path relate to architecture?', ['It does not', 'It affects how often and how safely the team can change the system', 'It only matters for marketing', 'It is a legal matter'], 1, 'A short repeatable path makes small safe changes possible.'],
    ['Which is an infrastructure constraint?', ['A colour palette', 'A rule that patient data must stay in a given country', 'A variable name', 'A button size'], 1, 'Data residency limits where the system can be hosted.']
  ],
  sources: [
    'arc42 documentation, section 7 Deployment View. docs.arc42.org/section-7/',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapters on deployability and availability. Addison-Wesley, 2021'
  ]
},
{
  n: 9, title: 'Cross-Cutting Concepts',
  lead: 'Some decisions do not belong to one block: security, error handling, logging, persistence and more. You will learn to find these concerns, decide them once, apply them consistently and document them where everyone can find them.',
  slides: [
    ['What a cross-cutting concern is', 'Explain what cross-cutting concerns are.',
      'A cross-cutting concern is a topic that touches many building blocks and needs one consistent solution, such as security, logging, error handling or persistence.',
      'In ClinicBook, every block must know who the user is, log important events, handle errors and read configuration. If each block solves these alone, the system behaves inconsistently and every fix is repeated.',
      'List the concerns that appear in more than one block and decide each of them once.',
      'Name three concerns that touch every block in your system.'],
    ['Typical concerns', 'Name typical cross-cutting concerns.',
      'Common concerns are persistence, communication, authentication and authorisation, error handling, logging and monitoring, transactions, configuration, internationalisation and the user interface approach.',
      'The arc42 template has a section for such concepts. Which ones matter depends on the system; a clinic booking system must take security and privacy seriously.',
      'Use a list of typical concerns as a prompt, then keep only those that matter.',
      'Which typical concern is most important for your system?'],
    ['Decide once', 'Explain the benefit of a single decision.',
      'One agreed approach lets developers work in the same way, makes behaviour predictable and makes later change easier.',
      'If ClinicBook decides that all errors reach the user as a short message plus a reference number and are logged with that number, support staff can find a problem in seconds, in any block.',
      'Write the approach as a short rule that every block follows.',
      'What is your system’s rule for reporting an error?'],
    ['Security as a concern', 'Describe security as a cross-cutting concern.',
      'Authentication proves who someone is; authorisation decides what they may do. Both must be applied in every block that holds protected data.',
      'A receptionist at one clinic must not see appointments of another clinic. If only the web page checks this, a direct call to the interface can bypass it. The check belongs in the blocks that own the data.',
      'Apply security checks where the data lives, not only at the edge.',
      'Where does your system check that a user may see a record?'],
    ['Error handling and robustness', 'Explain consistent error handling.',
      'A consistent approach separates errors the user can fix from system failures, reports them clearly, and avoids leaking internal detail.',
      'A patient who picks a slot that has just been taken should see "that time is no longer free, please choose another". A database failure should show a generic message and write the detail to the log.',
      'Define error categories and what each shows to users and what each logs.',
      'Which errors in your system should never show their details to a user?'],
    ['Logging and monitoring', 'Describe logging and monitoring as concerns.',
      'Logs and measurements tell you what the system is doing. They need a common format and care about what they record.',
      'ClinicBook logs should carry a request reference and never contain full patient details. A common format means one search finds the story across blocks.',
      'Agree the format, the levels and what must never be logged.',
      'What sensitive data could accidentally end up in your logs?'],
    ['Documenting concepts', 'Explain how to document cross-cutting concepts.',
      'Each concept is described once, with its purpose, the rule and an example, and the blocks refer to it instead of repeating it.',
      'In arc42, cross-cutting concepts have their own section. A short entry can say: Error handling: all blocks return error code, message and reference; details are logged only.',
      'Write each concept briefly and link every block that uses it.',
      'Where would a new developer read your logging rule?'],
    ['Checklist for ClinicBook', 'Apply a cross-cutting checklist to a small system.',
      'A concepts review asks whether each concern has an owner, a short rule, an example and a way to check it is followed.',
      'ClinicBook: security (clinic separation), errors (code plus reference), logging (reference and no patient details), persistence (each block owns its tables), configuration (environment variables).',
      'Walk the list and mark any concern that lacks a rule.',
      'Which concern in your list has no rule yet?']
  ],
  guide: [
    'Cross-cutting concepts are the decisions that no single block owns but all blocks must respect. If they are left to chance, every block will solve them differently, and the system will feel inconsistent and be difficult to secure or operate. If they are decided once and written down, new developers can follow the same rules without asking.',
    'Start by listing the concerns that appear in more than one block. Typical examples are security, error handling, logging, persistence, configuration and the approach to the user interface. For each, write a short rule, one example, and name where the rule is implemented, for example a shared library or a framework setting.',
    'Keep the descriptions short and findable. A long document nobody reads does not help. A page of short rules, linked from each block description, does. Review them when the system changes, because a rule that no longer matches the code is worse than none.'
  ],
  case: 'Illustrative case. Support at a ClinicBook customer reports that a receptionist saw an appointment belonging to another clinic. The team finds that the clinic check exists in the web page but not in the calendar interface. They decide that every block that owns data checks clinic membership on every request, add the rule to a short concepts page and add a test that tries cross-clinic access in each block. They also agree that logs hold request references only. A month later, a similar mistake in a new block is caught by the cross-clinic test before release.',
  lab: {
    title: 'Write the cross-cutting concepts page',
    intro: 'Use your own system or ClinicBook. You will identify cross-cutting concerns and write a short rule for each one.',
    tasks: [
      'List at least five concerns that touch more than one building block in your system.',
      'For each concern write a one or two sentence rule that every block must follow.',
      'Choose one concern and write an example showing the rule in use.',
      'For one concern describe a check, such as a test or review step, that shows the rule is followed.'
    ],
    evidence: 'The concern list, the rules, one example and one check.',
    model: '**Concerns:** security, error handling, logging, persistence, configuration.\n\n**Rules**\n- Security: every block that owns data checks user identity and clinic membership on every request.\n- Error handling: errors carry a code, a short message and a reference; internal detail goes to the log only.\n- Logging: each request has a reference; logs never contain names, phone numbers or card data.\n- Persistence: each block owns its tables; others use its interface.\n- Configuration: settings come from the environment, never from code.\n\n**Example (errors):** a taken slot returns code SLOT_TAKEN, message "That time is no longer free", reference R-48213.\n\n**Check (security):** an automated test calls each data interface with a user from another clinic and expects a refusal.'
  },
  rubric: [
    ['Concerns', 'Fewer than three', 'Three or four', 'Five or more that really cross blocks'],
    ['Rules', 'No rules', 'Vague rules', 'A short rule for every concern'],
    ['Example', 'None', 'Example unrelated to the rule', 'Example that shows the rule in use'],
    ['Check', 'None', 'Check named but not specific', 'A specific test or review step']
  ],
  quiz: [
    ['What is a cross-cutting concern?', ['A concern of one block only', 'A topic that touches many blocks and needs one consistent approach', 'A type of diagram', 'A project risk'], 1, 'It cuts across building blocks, so it needs a shared decision.'],
    ['Where should an authorisation check be applied?', ['Only in the user interface', 'In the blocks that own the protected data', 'Only in the logs', 'Nowhere if users are trusted'], 1, 'A check only at the edge can be bypassed by calling the interface directly.'],
    ['What should logs avoid?', ['Request references', 'Sensitive personal data', 'Timestamps', 'Levels'], 1, 'Logs are widely read and kept, so they must not hold sensitive data.'],
    ['Why document a concept once?', ['To save paper', 'So blocks can refer to one rule instead of repeating it', 'To hide it', 'To avoid reviews'], 1, 'A single description stays consistent and is easy to find and update.'],
    ['What should a user see for an internal database failure?', ['The full stack trace', 'A generic message with a reference, with detail in the log', 'Nothing at all', 'The database password'], 1, 'Internal detail should not leak, but support needs a reference to find it.']
  ],
  sources: [
    'arc42 documentation, section 8 Cross-cutting Concepts. docs.arc42.org/section-8/',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapter on security. Addison-Wesley, 2021'
  ]
}
];
