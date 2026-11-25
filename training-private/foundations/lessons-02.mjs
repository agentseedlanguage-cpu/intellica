// Level 1 (Foundations), lessons 4-5. Independent Intellica self-study following the topics of the public iSAQB CPSA-F curriculum 2025.1-rev2. Not an iSAQB course.
// ClinicBook is a synthetic case. Cases marked "Illustrative" are invented. Numbers in examples are invented for teaching.
export default [
{
  n: 4, title: 'Design Approaches and Decomposition',
  lead: 'Design is how requirements turn into structure. You will learn to work top-down and in small iterations, split a system into building blocks with clear responsibilities, and use feedback to find risks early.',
  slides: [
    ['From requirements to structure', 'Explain how an architecture fulfils requirements.',
      'Structure is how a system meets its requirements: each important requirement should be answerable by a named part of the design.',
      'A booking system that must send reminders to patients in many time zones needs a place where time-zone rules live. If no building block owns that responsibility, the rule ends up copied across the code base and is hard to change.',
      'For each important requirement, point to the building block or decision that fulfils it. If you cannot point, the design has a gap.',
      'Pick one ClinicBook requirement. Which building block fulfils it today?'],
    ['Top-down design', 'Describe top-down decomposition.',
      'Top-down design starts with the whole system and its context, then splits it into a few large parts, then splits those parts only when needed.',
      'The context comes first: who and what interacts with ClinicBook (patients, receptionists, the payment provider, the messaging provider). Only then do the first-level building blocks, for example booking, calendar, payments and notifications, make sense.',
      'Draw the context, then at most five to nine first-level blocks, and write one sentence of responsibility for each.',
      'Why is it risky to start by choosing a database and a framework before drawing the context?'],
    ['Bottom-up and middle-out', 'Explain when bottom-up work is useful.',
      'Bottom-up design starts from known parts such as an existing database or a payment library, and builds up from them. It is useful when parts are fixed.',
      'ClinicBook must use a payment provider chosen by the business. That is a given part, so the design has to start from its interface and constraints instead of pretending it can be replaced.',
      'Mix both directions: fix the known parts first, then design the rest top-down around them.',
      'Name one part of your own system that was fixed before the architecture started.'],
    ['Iterate in small steps', 'Describe iterative architecture development.',
      'Architecture is developed in iterations: a small design step, a check against the requirements, and then the next step.',
      'A common loop is: choose the most important requirement, design a solution for it, evaluate the result, record the decision. Doing this for the three hardest requirements first shows most of the risk in a few days.',
      'Plan the work as short loops that each end with a decision and a check, rather than one long design phase.',
      'What is the check at the end of one loop?'],
    ['Building blocks and responsibilities', 'Describe a good building block.',
      'A building block has a clear purpose, a small interface and a name that matches its responsibility. Others should use it without knowing how it works inside.',
      'A block called Utilities that holds dates, email text and payment rules has no single purpose. A block called Reminders that owns reminder rules and talks to the messaging provider can be understood, tested and replaced.',
      'Write the responsibility of every block in one sentence. If the sentence needs the word and twice, consider splitting it.',
      'Which ClinicBook block would you split first if it had three responsibilities?'],
    ['Feedback loops and risk', 'Explain how feedback loops reduce architecture risk.',
      'The longer it takes to learn that a decision is wrong, the more it costs. Short feedback loops expose risks while they are still cheap to fix.',
      'Typical feedback sources are a prototype of the riskiest part, a short review of the design with the team, an automated test or a measurement in a test environment. A decision about message delivery can be tested with a simple spike in a day.',
      'Rank decisions by risk, and use a prototype, review or measurement to get feedback on the riskiest first.',
      'Which decision in ClinicBook could you get feedback on within one day?'],
    ['Misconceptions', 'Recognise common design mistakes.',
      'Many designs fail because of habits, not ignorance: copying a fashionable structure, designing everything before building anything, or treating one view as the whole architecture.',
      'Choosing many small services for a team of four, because it worked for a large company, is a typical example. The structure was chosen for another context. It adds network calls, deployment work and failure modes the team may not need.',
      'Ask of every structural choice: which requirement does this serve, and what does it cost us?',
      'Which fashionable structure have you seen adopted without a requirement for it?'],
    ['Checklist for ClinicBook', 'Apply the design approach to a small system.',
      'A design step is complete when the context is clear, the blocks have responsibilities, the main requirements are matched to blocks, and the biggest risks have a plan for feedback.',
      'For ClinicBook that could be: context diagram with five neighbours, six blocks with one-sentence responsibilities, a table matching the top five requirements to blocks, and a prototype plan for message delivery.',
      'Keep this checklist next to your design and tick it before you call a step done.',
      'Which item on the checklist would you most likely forget?']
  ],
  guide: [
    'Design is not a single moment. Teams that treat it as a phase before coding usually find, late, that an early assumption was wrong. Teams that treat it as a repeating loop of small design steps and checks tend to find the mistake while it is still cheap. The loop is simple: pick the most important or riskiest requirement, design a response, check it, record the decision.',
    'Decomposition gives that loop something to work on. Start with the context so that you know who and what the system talks to. Split the system into a small number of blocks, each with one clear responsibility. Resist both extremes: a single large block that does everything, and dozens of tiny blocks nobody can hold in their head.',
    'Do not treat top-down and bottom-up as rivals. Real projects always have fixed parts: a payment provider, a database the company already runs, a legal rule. Start from those and design the rest around them. What matters is that every important requirement can be traced to a block, and that the riskiest decisions receive feedback first.'
  ],
  case: 'Illustrative case. The ClinicBook team has six weeks. They draw the context (patients, receptionists, payment provider, messaging provider) and six blocks: Booking, Calendar, Payments, Reminders, Accounts and Admin. A table matches the five hardest requirements to blocks. One requirement, reminders at the right local time for clinics in different time zones, has no clear owner, so they add a rule to Reminders and prototype it against three time zones in one afternoon. The prototype shows daylight-saving changes break their first idea. They record the new decision and move to the next requirement.',
  lab: {
    title: 'Context, blocks and a requirements-to-blocks table',
    intro: 'Use your own system or ClinicBook. You will draw the context, split the system into building blocks and check that the important requirements have an owner.',
    tasks: [
      'List the people and systems that interact with your system and say in one line what each exchanges with it.',
      'Name five to nine first-level building blocks and write one sentence of responsibility for each.',
      'Make a table of your five most important requirements and name the block that fulfils each one.',
      'Pick the single riskiest decision and describe a one-day check (prototype, measurement or review) that would give feedback on it.'
    ],
    evidence: 'The context list, the blocks with responsibilities, the requirements-to-blocks table and the plan for one feedback check.',
    model: '**System:** ClinicBook.\n\n**Context:** patients (book and cancel by web or phone), receptionists (manage calendars), payment provider (takes deposits), messaging provider (sends reminders).\n\n**Blocks:** Booking (creates, moves and cancels appointments), Calendar (holds clinic availability), Payments (deposits and refunds through the provider), Reminders (reminder rules and delivery requests), Accounts (patients and staff), Admin (clinic settings).\n\n| Requirement | Block |\n|---|---|\n| Patient books a slot in under three steps | Booking |\n| No double booking | Calendar |\n| Deposit taken at booking | Payments |\n| Reminder at correct local time | Reminders |\n| Clinic data separated | Accounts |\n\n**Riskiest decision:** time-zone handling in Reminders. **Check:** a one-day prototype that schedules reminders for three time zones across a daylight-saving change.'
  },
  rubric: [
    ['Context', 'No neighbours named', 'Some neighbours, no exchanges', 'Every neighbour and what it exchanges'],
    ['Responsibilities', 'Names only', 'Some blocks have a sentence', 'Every block has one clear sentence'],
    ['Traceability', 'No mapping', 'Some requirements mapped', 'All five requirements mapped to blocks'],
    ['Feedback', 'No check planned', 'A check without a decision', 'A one-day check tied to the riskiest decision']
  ],
  quiz: [
    ['What is the main purpose of decomposing a system into building blocks?', ['To make the diagram look complete', 'To give each important responsibility a clear owner', 'To increase the number of components', 'To avoid writing requirements'], 1, 'Each block has a purpose, so requirements can be matched to owners and the structure can be understood and changed.'],
    ['Which describes top-down design?', ['Start from the code and work up', 'Start from the whole system and its context, then split it into parts', 'Start from the database schema', 'Start from the user interface only'], 1, 'Top-down design starts with the whole and its context, then decomposes it in steps.'],
    ['Why is a fixed payment provider relevant to design?', ['It can be ignored until testing', 'It is a given part, so the design starts from its constraints', 'It makes architecture unnecessary', 'It must be replaced first'], 1, 'Fixed parts are design inputs. Bottom-up and top-down work meet around them.'],
    ['What is the benefit of short feedback loops?', ['They remove the need for decisions', 'They expose wrong decisions while they are cheap to change', 'They guarantee a perfect design', 'They replace requirements'], 1, 'The earlier you learn a decision is wrong, the less it costs to change.'],
    ['Which block description is best?', ['Utilities: everything shared', 'Reminders: owns reminder rules and requests delivery from the messaging provider', 'Misc: other things', 'Core: the important code'], 1, 'A good block has one clear responsibility that matches its name.']
  ],
  sources: [
    'arc42 documentation, section 5 Building Block View. docs.arc42.org/section-5/',
    'arc42 documentation, section 3 Context and Scope. docs.arc42.org/section-3/',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapters on design and evaluation. Addison-Wesley, 2021'
  ]
},
{
  n: 5, title: 'Design Principles and Patterns',
  lead: 'Principles help you judge a design; patterns give you proven structures to start from. You will learn the main principles, a handful of architectural patterns, and why a principle or pattern is only right when a requirement asks for it.',
  slides: [
    ['Abstraction and information hiding', 'Explain abstraction and information hiding.',
      'Abstraction shows what matters and hides detail. Information hiding puts a decision likely to change behind a stable interface.',
      'David Parnas described information hiding in 1972: split a system by the design decisions most likely to change, so a change touches one module. In ClinicBook, how reminders are sent is likely to change, so it sits behind a Reminders interface.',
      'List the three decisions most likely to change and hide each behind an interface.',
      'Which decision in your system is likely to change, and who knows its details today?'],
    ['Modularity, coupling and cohesion', 'Explain coupling and cohesion.',
      'Cohesion is how closely the inside of a block belongs together. Coupling is how strongly blocks depend on each other. Aim for high cohesion and low coupling.',
      'A Booking block that reads the Payments tables directly is tightly coupled: a payment schema change breaks booking. A Booking block that calls a small Payments interface is loosely coupled and can survive the change.',
      'Look at dependency arrows: reduce those that cross block borders without a clear interface.',
      'Which dependency in ClinicBook would you remove first?'],
    ['Separation of concerns', 'Describe separation of concerns.',
      'Separation of concerns means each part deals with one aspect, such as business rules, data storage or presentation, so a change in one aspect does not ripple through the rest.',
      'If booking rules are written inside web page code, a mobile app has to copy them. If rules live in one place behind an interface, both clients share them.',
      'Identify the concerns in your system and ask whether each has one home.',
      'Where would you put the rule that a deposit is required for new patients?'],
    ['Dependency direction', 'Explain dependency inversion in simple terms.',
      'High-level rules should not depend on low-level details. Both should depend on abstractions that the high-level code owns.',
      'If Booking calls the payment provider library directly, switching provider means editing Booking. If Booking depends on a PaymentPort interface it defines, a provider adapter can be swapped without touching the rules.',
      'Let the stable, important code define the interface, and let details implement it.',
      'What would change in Booking if the payment provider changed?'],
    ['Patterns are named solutions', 'Describe what an architectural pattern is.',
      'An architectural pattern is a named, proven structure for a recurring problem, with known benefits and costs.',
      'Layers separate responsibilities in rings. Client-server splits a consumer from a provider. Pipes and filters chain processing steps. Event-driven designs react to messages. A modular monolith keeps one deployable unit with strong internal modules. Services split deployable parts that run independently.',
      'Name the problem first, then check which pattern fits and what it costs.',
      'Which pattern does your current system resemble?'],
    ['Cost of a pattern', 'Explain that every pattern has costs.',
      'A pattern solves one problem and creates others. Layers can add indirection, services add network failure, events add ordering questions.',
      'Splitting ClinicBook into many services gives independent deployment but adds network calls, many deployments and distributed failure. For one small team, a modular monolith may meet the same needs at lower cost.',
      'Write down what the pattern costs you before you adopt it, and which requirement pays for that cost.',
      'What requirement would justify splitting ClinicBook into services?'],
    ['Design patterns, briefly', 'Recognise design patterns as smaller scale solutions.',
      'Design patterns such as adapter, strategy or observer solve smaller problems inside a block. They are tools for code structure, not system structure.',
      'An adapter around the payment library is a design pattern. It supports the architectural idea of hiding a changeable decision behind an interface.',
      'Use design patterns inside blocks; use architectural patterns to arrange blocks.',
      'Which design pattern could isolate the messaging provider?'],
    ['Principles conflict: requirements decide', 'Judge a design against competing principles.',
      'Principles can pull in different directions, for example reuse against independence. The requirements and constraints decide which wins.',
      'Sharing one data model across blocks reduces duplication but increases coupling. If independent change matters more than duplication, accepting a small amount of duplicate data is the better choice.',
      'When two principles disagree, name the requirement that settles it and record the decision.',
      'Which principle would you relax for a quality goal of independent change?']
  ],
  guide: [
    'Principles are the questions you ask of a design: does this hide a decision that will change, does it keep related things together, does it depend on details? They do not give answers on their own. A design can follow every principle and still fail its requirements, and a design can break one on purpose because a requirement demands it.',
    'Patterns are names for proven structures. Using a pattern gives the team a shared vocabulary and avoids rediscovering old trade-offs. But a pattern is not a goal. Choose a pattern by the problem and the requirement, check what it costs, and record the reason. The reason is what lets the next person judge whether the choice still holds.',
    'A useful habit is to describe each pattern choice with three lines: the requirement it serves, the benefit it brings, and the cost you accept. If you cannot fill the first line, you probably do not need the pattern yet.'
  ],
  case: 'Illustrative case. A ClinicBook developer proposes splitting the system into twelve services. The team asks which requirement justifies it. The honest answer is that nothing yet demands independent deployment. They choose a modular monolith with strict module boundaries and interfaces, including a PaymentPort and a ReminderPort. They record the reason and a trigger for revisiting: if two teams need to deploy independently, or reminders need to scale separately, they will extract that module. Six months later, reminders do spike on Monday mornings, and extracting them is easy because the interface already exists.',
  lab: {
    title: 'Choose principles and a pattern, with reasons',
    intro: 'Use your own system or ClinicBook. You will name the decisions likely to change, check coupling and choose a pattern with its cost written down.',
    tasks: [
      'List the three decisions in your system most likely to change and the interface that will hide each one.',
      'Find two dependencies that cross block borders without an interface and say how you would fix each.',
      'Choose one architectural pattern for the whole system and write the requirement it serves, the benefit and the cost.',
      'Name one principle you decided to relax and the requirement that justifies it.'
    ],
    evidence: 'The change list with interfaces, two dependency fixes, the pattern with its three lines and the relaxed principle with its reason.',
    model: '**Likely to change:** payment provider (PaymentPort), messaging provider (ReminderPort), clinic opening rules (AvailabilityRules).\n\n**Dependencies to fix:** Booking reads Payments tables directly, so Booking will call PaymentPort instead. The web client holds booking rules, so rules move behind the Booking interface.\n\n**Pattern:** modular monolith. **Requirement:** small team, one deployment, fast change. **Benefit:** simple operation and strong boundaries. **Cost:** a module cannot scale or deploy alone.\n\n**Relaxed principle:** no duplication. Patient name is stored in Booking and Reminders so reminders do not call Accounts at send time. **Reason:** independent change and availability of reminders.'
  },
  rubric: [
    ['Hidden decisions', 'None listed', 'Listed without interfaces', 'Three decisions each behind a named interface'],
    ['Dependencies', 'Not examined', 'One found', 'Two found with a fix each'],
    ['Pattern reasoning', 'Pattern named only', 'Benefit but no cost', 'Requirement, benefit and cost'],
    ['Trade-off', 'No trade-off named', 'A principle relaxed without reason', 'A relaxed principle tied to a requirement']
  ],
  quiz: [
    ['What does information hiding recommend?', ['Hide the documentation', 'Put decisions likely to change behind stable interfaces', 'Make every module public', 'Remove interfaces'], 1, 'Parnas proposed hiding changeable design decisions so that a change touches one module.'],
    ['Which is the desirable combination?', ['Low cohesion, high coupling', 'High cohesion, low coupling', 'High coupling, high cohesion', 'Low coupling, low cohesion'], 1, 'Related things stay together, and blocks depend on each other as little as practical.'],
    ['Why does a pattern have costs?', ['Patterns are always slow', 'Each pattern solves one problem and creates other forces to manage', 'They need a licence', 'They replace requirements'], 1, 'A pattern trades one set of problems for another, so the requirement must pay for it.'],
    ['In dependency inversion, who owns the interface?', ['The low-level detail', 'The high-level code that needs it', 'The database', 'The vendor library'], 1, 'The stable high-level code defines the abstraction and details implement it.'],
    ['When two principles conflict, what decides?', ['The most popular one', 'The requirements and constraints', 'The newest one', 'Alphabetical order'], 1, 'Principles are judgement tools. The requirements settle conflicts.']
  ],
  sources: [
    'Parnas, D.L. On the criteria to be used in decomposing systems into modules. Communications of the ACM, 1972',
    'arc42 documentation, section 4 Solution Strategy. docs.arc42.org/section-4/',
    'Bass, Clements and Kazman, Software Architecture in Practice (4th ed.), chapters on architectural tactics and patterns. Addison-Wesley, 2021'
  ]
}
];
