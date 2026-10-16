/**
 * CENTRAL PORTFOLIO CONTENT & CASE STUDY DATA
 * Source of truth for Ritul Sawant's portfolio.
 * Verified against CV, Partnership Lab repository, and authentic project work.
 */

export interface CaseStudySection {
  title: string;
  label?: 'fact' | 'analysis' | 'hypothetical' | 'framework' | 'limitations';
  body: string;
  bulletPoints?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  statusBadge: string;
  featured: boolean;
  summary: string;
  problem: string;
  methods: string[];
  keyOutput: string;
  liveUrl?: string | null;
  embedUrl?: string | null;
  toolUrl?: string | null;
  sections: CaseStudySection[];
  safeguardNotice: string;
}

export interface ExperienceData {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  responsibilities: string[];
  tags: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  location: string;
  period: string;
  details: string;
}

export interface CertificateData {
  title: string;
  issuer: string;
  platform: string;
  dateCompleted: string;
  credentialId?: string;
  verificationUrl?: string;
  summary: string;
}

export interface SkillGroup {
  name: string;
  description: string;
  skills: string[];
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    headline: string;
    location: string;
    email: string;
    linkedInUrl: string;
    cvUrl: string | null;
    targetRoles: string[];
    heroParagraph: string;
    aboutText: string[];
    disclaimer: string;
  };
  projects: ProjectData[];
  experience: ExperienceData[];
  education: EducationData[];
  certificates: CertificateData[];
  skills: SkillGroup[];
}

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Ritul Sawant',
    title: 'Financial Services Operations · Strategic Partnerships · Commercial Research',
    headline: 'Economics, partnerships, and practical analysis.',
    location: 'Stirling, Scotland, United Kingdom',
    email: 'ritul.sawant11@gmail.com',
    linkedInUrl: 'https://www.linkedin.com/in/ritulsawant',
    cvUrl: '/ritul-sawant-cv.pdf',
    targetRoles: [
      'Strategic Partnerships Associate',
      'Partnerships Coordinator',
      'Partner Operations',
      'Pensions Administration',
      'Financial Services Operations'
    ],
    heroParagraph:
      'I bring an economics and sports-management background, hands-on customer service experience in corporate pensions at Diligenta, and an analytical focus on how organisations structure strategic partnerships and responsible technology.',
    aboutText: [
      'I am an operations and commercial research professional based in Stirling, Scotland. My background bridges an undergraduate degree in economics (quantitative analysis, macro and microeconomic policy) and a master’s in sports management from the University of Stirling (strategic governance, stakeholder coordination, and evidence-based decision-making).',
      'In my current role at Diligenta, I support Defined Contribution workplace pension members in an FCA-regulated environment. I spend my days explaining complex administrative processes in plain English, reviewing member instructions, verifying Letters of Authority (LOA), and working with specialist technical teams to progress customer cases under Consumer Duty standards.',
      'Prior to financial services, I managed store operations at Domino’s—supervising shifts of up to 15 colleagues, resolving front-line customer issues under peak pressure, and reconciling daily cash takings and banking controls.',
      'Alongside operational delivery, I create independent strategic research in my Partnership Lab, evaluating how financial institutions evaluate partner fit, design structured pilots, and implement Consumer Duty safeguards. I am looking to apply these analytical and relationship-management skills to early-career roles in strategic partnerships, partner operations, and financial-services operations.'
    ],
    disclaimer:
      'Personal career portfolio. This website is independent research and career evidence—not a financial advice service, consultancy, pension scheme provider, or software agency. Case studies represent independent analytical exercises based on publicly available information.'
  },

  projects: [
    {
      slug: 'standard-life-moneyhub',
      title: 'Standard Life × Moneyhub',
      subtitle: 'Workplace Pension Engagement Through Fintech Partnerships',
      category: 'Strategic Partnerships',
      tag: 'FINANCIAL SERVICES · OPEN FINANCE',
      statusBadge: 'Complete Research Analysis',
      featured: true,
      summary:
        'An independent strategic analysis of how a legacy UK workplace pension provider (Standard Life / Phoenix Group) paired its distribution and pension administration with an Open Finance fintech platform (Moneyhub) to address member disengagement, tackle the £31.1B lost pensions problem, and evaluate commercial pilot delivery economics.',
      problem:
        'Over 3.3 million lost pension pots containing £31.1 billion exist in the UK. Auto-enrolment creates passive savers with fragmented pots, while building multi-bank API aggregators in-house is costly outside a provider’s core operations.',
      methods: [
        'Open Banking / Open Finance API ecosystem analysis',
        'FCA Consumer Duty (FG22/5) outcome evaluation',
        '6-month employer-led onboarding experiment design',
        'Alternative-partner assessment matrix',
        'Cost-per-activation commercial modeling'
      ],
      keyOutput:
        'A staged pilot experimental design measuring activation uplift and incremental cost per additional active member, paired with Consumer Duty suitability safeguards.',
      liveUrl: 'https://partnership-lab.vercel.app/#/case-studies/standard-life-moneyhub',
      toolUrl: null,
      safeguardNotice:
        'Independent research portfolio. The case study uses publicly available, cited corporate disclosures and regulatory guidance. It does not represent internal procurement data, contractual terms, or work commissioned by Standard Life, Phoenix Group, or Moneyhub.',
      sections: [
        {
          title: 'Executive Summary',
          label: 'analysis',
          body:
            'Standard Life’s partnership with Moneyhub illustrates how a legacy workplace pension provider can pair its distribution and pension administration with an Open Finance fintech platform’s financial management tools. This analysis evaluates the potential value for members, corporate employers, and both partners while distinguishing publicly reported product features from independent commercial hypotheses.\n\nTo evaluate whether digital engagement drives meaningful action, this study proposes a Six-Month Employer-Led Onboarding Experiment to measure activation, sustained usage, and incremental cost per additional activation. The central analytical conclusion is that engagement metrics alone are insufficient to demonstrate commercial or customer value: increased app interaction does not guarantee improved retirement outcomes or asset retention unless accompanied by clear suitability controls and measurable customer financial progress.'
        },
        {
          title: 'Strategic Dimension & Evidence Classification',
          label: 'fact',
          body:
            'A rigorous partnership review requires clearly distinguishing verified corporate facts from analyst interpretation.',
          table: {
            headers: ['Strategic Dimension', 'Verified Facts & Cited Evidence', 'Analyst Interpretation'],
            rows: [
              [
                'Corporate Priorities',
                'Phoenix Group’s 2023 Results report strategic focus on growing organic retail and workplace market share, driving capital efficiency, and customer retention.',
                'Digital engagement tools support Standard Life’s workplace proposition to strengthen retention and capture asset consolidation opportunities in a competitive master-trust market.'
              ],
              [
                'Target Decision Makers',
                'Corporate employers, scheme trustees, and employee benefit managers act as institutional buyers; scheme members act as end-users.',
                'Solution design must satisfy employer HR wellbeing agendas while providing immediate daily utility to individual employees.'
              ],
              [
                'Capabilities & Gaps',
                'Standard Life provides institutional distribution, pension administration, and investment management.',
                'Partnering reduces in-house development requirements for multi-bank aggregation, but introduces integration and third-party supplier management oversight.'
              ],
              [
                'Governance Framework',
                'Applicable frameworks include FCA Consumer Duty (FG22/5), Pensions Dashboard standards, and IGC value-for-money oversight.',
                'Standard Life must demonstrate tangible good customer outcomes, clear transparency, and accessible support across diverse member cohorts.'
              ]
            ]
          }
        },
        {
          title: 'The Industry & Customer Problem',
          label: 'analysis',
          body:
            'While auto-enrolment brought millions into UK workplace saving, frequent job changes leave savings fragmented across past employers. According to the Pensions Policy Institute (PPI Briefing Note 138, 2024), an estimated 3.3 million lost pension pots containing £31.1 billion exist across the UK.\n\nFor providers, unconsolidated legacy assets represent missed assets under administration (AuA) growth if members migrate off-platform upon changing employers. In-house software development of real-time multi-bank transaction categorisers and Open Finance aggregators involves continuous API maintenance outside a pension provider’s core operating model.',
          bulletPoints: [
            'Structural Disengagement: Default enrolment creates passive members who rarely log in until approaching retirement.',
            'Lost Pensions Scale: 3.3 million dormant or lost pots worth £31.1 billion across the UK.',
            'Build-vs-Partner Trade-off: Procuring specialized open-finance technology accelerates speed-to-market while avoiding heavy custom codebases.'
          ]
        },
        {
          title: 'Proposed Six-Month Pilot Experiment',
          label: 'hypothetical',
          body:
            'To validate whether digital financial management tools genuinely improve member outcomes, this analysis proposes a structured 6-month trial across 10 participating corporate employers (sample: 5,000 auto-enrolled members divided into 2 cohorts).\n\nCohort A receives standard pension communications; Cohort B receives enhanced onboarding with Moneyhub Open Finance visibility. The experiment measures primary activation within 30 days, sustained 90-day engagement, voluntary contribution changes, and incremental cost per active member before committing to full-scale platform rollout.'
        },
        {
          title: 'Learning & Analytical Limitations',
          label: 'limitations',
          body:
            'The research highlighted that technological API integration is rarely the sole barrier in strategic partnerships; operational alignment, data governance, and shared customer-service accountability under the Consumer Duty are paramount.\n\nLimitations: As an independent study, this analysis relies solely on published public reports and does not have access to internal contractual pricing tiers, API latency benchmarks, or private user telemetry.'
        }
      ]
    },
    {
      slug: 'partnership-lab',
      title: 'Partnership Lab',
      subtitle: 'Independent Strategic Partnership Research Platform',
      category: 'Strategic Partnerships & Research Publication',
      tag: 'RESEARCH PLATFORM · WEB APPLICATION',
      statusBadge: 'Live Research Website',
      featured: false,
      summary:
        'An independent research portfolio and publication exploring how organisations combine capabilities, create customer value, and assess strategic partnership opportunities across UK financial services, technology, and pensions.',
      problem:
        'Corporate partnership evaluations frequently suffer from vague strategic rhetoric without rigorous analysis of capability fit, customer journeys, pilot economics, or Consumer Duty safeguards.',
      methods: [
        '7-step empirical partnership assessment methodology',
        'Multi-criteria partner selection and scoring matrix',
        'Build-vs-partner commercial trade-off analysis',
        'Six-month employer onboarding trial blueprint design',
        'FCA Consumer Duty fair-value & vulnerable customer safeguards'
      ],
      keyOutput:
        'A fully deployed, responsive research platform featuring multi-chapter retrospective case studies (Standard Life × Moneyhub, Spotify × Uber), hypothetical proposals in the Opportunity Lab, and an interactive methodology roadmap.',
      liveUrl: 'https://partnership-lab.vercel.app/#/',
      embedUrl: '/partnership-lab/',
      toolUrl: 'https://partnership-lab.vercel.app/#/',
      safeguardNotice:
        'Independent research platform notice: Partnership Lab is an independent personal research portfolio authored by Ritul Sawant. It is not affiliated with, sponsored by, or endorsed by Standard Life, Phoenix Group, Moneyhub, Nest, Uber, Spotify, or any company analysed. Case studies are retrospective evaluations of publicly reported information; proposals in the Opportunity Lab are hypothetical exploratory models.',
      sections: [
        {
          title: 'Purpose & Research Workspace Architecture',
          label: 'framework',
          body:
            'Partnership Lab was built to bridge commercial theory and practical execution in strategic partnerships. Instead of superficial partnership announcements, the platform examines the operational mechanics required to deliver successful multi-organisational collaborations in regulated UK financial services and digital ecosystems.\n\nThe website was architected as a static, dependency-light web application featuring client-side hash routing, structured chapter navigation, and clean typography designed for research reading.'
        },
        {
          title: 'The 7-Step Partnership Methodology',
          label: 'framework',
          body:
            'Every project on Partnership Lab follows an explicit, disciplined analytical framework:',
          bulletPoints: [
            '1. Define the Problem: Start from a specific customer or commercial friction point, never from an attractive partner pairing.',
            '2. Compare Candidates: Evaluate alternative partners across explicit technical, commercial, and operational criteria—including documented reasons for rejecting alternatives.',
            '3. Map Value & Capabilities: Detail what each partner contributes, what they gain, and the net utility delivered to the end consumer.',
            '4. Design an Empirical Pilot: Formulate a concrete trial blueprint with measurable activation rates, sample allocations, and contamination controls.',
            '5. Commercial Economics: Separate upfront campaign costs from ongoing SaaS licensing to model incremental cost per active member.',
            '6. Regulatory Safeguards: Assess Consumer Duty obligations, fair-value benchmarks, and vulnerable customer protections.',
            '7. Go/No-Go Decision Rules: Establish objective performance thresholds that dictate whether to roll out, revise, or terminate the partnership.'
          ]
        },
        {
          title: 'Selected Research Modules',
          label: 'analysis',
          body:
            'The platform encompasses two distinct research environments:\n\n1. Retrospective Case Studies: Deep-dive investigations into publicly reported real-world integrations, evaluating whether initial strategic assumptions held true.\n\n2. The Opportunity Lab: Original, hypothetical proposals identifying unaddressed commercial opportunities—such as master trusts evaluating workplace benefits platforms to solve default enrolment dormancy under the Consumer Duty.'
        },
        {
          title: 'Evidence Classification & Research Integrity',
          label: 'limitations',
          body:
            'To maintain strict intellectual and professional integrity, every section across Partnership Lab is explicitly watermarked with evidence labels:\n\n• Fact: Backed by verified primary sources (regulatory filings, audited accounts, official releases).\n• Analysis: Independent analyst interpretation and strategic synthesis.\n• Hypothetical: Original experimental designs and proposal blueprints.\n• Assumption: Illustrative quantitative models and unit-economics hypotheses.'
        }
      ]
    },
    {
      slug: 'pension-steps',
      title: 'PensionSteps',
      subtitle: 'Interactive Customer-Service Preparation Web Application',
      category: 'Interactive Web Tool & CX Prototype',
      tag: 'INTERACTIVE WEBSITE · REACT & TYPESCRIPT',
      statusBadge: 'Live Web Application',
      featured: false,
      summary:
        'A fully interactive web application designed to help UK Defined Contribution scheme members prepare for common pension administration enquiries before calling their provider. Features a 3-stage interactive decision engine and printable call checklist.',
      problem:
        'In corporate pensions customer service, members frequently call administrators unprepared—lacking policy numbers, Letters of Authority, or bereavement documents—resulting in long call handle times, repeat contacts, and administrative delays.',
      methods: [
        'React, TypeScript & Vite web application architecture',
        'Front-line Defined Contribution customer enquiry mapping',
        '3-stage interactive guidance engine (Situation → Get Ready → Call Plan)',
        'Print-ready telephone checklist and worksheet generator'
      ],
      keyOutput:
        'A working, deployed web application prototype with interactive scenario selectors, customized documentation checklists, and print-ready telephone call worksheets.',
      liveUrl: '/pension-steps/',
      embedUrl: '/pension-steps/',
      toolUrl: '/pension-steps/',
      safeguardNotice:
        'Independent web tool notice: PensionSteps is an independent customer-preparation web tool. It does not provide regulated financial advice, does not access live pension scheme accounts or databases, and is not affiliated with any pension administrator or scheme provider.',
      sections: [
        {
          title: 'The Web Application at a Glance',
          label: 'framework',
          body:
            'PensionSteps is a working front-end web application developed to bridge the preparation gap between pension scheme members and customer service teams. Rather than a static document, it provides an interactive questionnaire that assesses the member\'s enquiry type and generates a tailor-made telephone preparation checklist in real time.'
        },
        {
          title: 'Operational Context & The Preparation Problem',
          label: 'analysis',
          body:
            'Working on the front lines handling corporate Defined Contribution workplace pension enquiries at Diligenta revealed that a major source of call handling delays and member anxiety is unpreparedness. Callers often do not know what a Letter of Authority (LOA) entails, what death benefit documents are legally required, or what questions to ask their provider.\n\nPensionSteps addresses this directly by walking users through their enquiry before they dial, reducing call anxiety and avoidable repeat calls.'
        },
        {
          title: '3-Stage Interactive Journey Architecture',
          label: 'framework',
          body:
            'The application is structured into three clean, progressive steps:',
          bulletPoints: [
            'Step 1: Your Situation — Interactive scenario selector (tracing a lost pension, checking contributions, changing personal details, preparing for retirement, or handling bereavement).',
            'Step 2: Get Ready — Generates an itemized checklist of exact documentation required (National Insurance number, policy references, signed LOA forms, certified death certificates).',
            'Step 3: Your Call Plan — Produces a clean, formatted call plan with targeted questions for the administrator and dedicated space for call notes, optimized for screen viewing and clean printing.'
          ]
        },
        {
          title: 'Technology & Implementation',
          label: 'framework',
          body:
            'The application was engineered using modern front-end standards: React 18, TypeScript, and Vite. It utilizes accessible keyboard navigation, responsive touch-friendly option cards, zero external tracking, and dedicated print stylesheets (print.css) to generate clean single-page physical call plans.'
        },
        {
          title: 'Learning & Boundary Governance',
          label: 'limitations',
          body:
            'Developing the tool underscored the essential regulatory boundary between guidance and advice under FCA Consumer Duty rules. The application strictly provides administrative process guidance—clarifying required documentation and procedural questions—without ever offering opinions on fund selection, investment suitability, or pension consolidation.'
        }
      ]
    },
    {
      slug: 'pension-quest',
      title: 'PensionQuest',
      subtitle: 'An Interactive Storybook Web Game for UK Workplace Pensions',
      category: 'Educational Web Game & CX Prototype',
      tag: 'INTERACTIVE STORY · GAMIFIED EDUCATION',
      statusBadge: 'Playable Game Prototype',
      featured: false,
      summary:
        'An independent educational storybook web game exploring UK Defined Contribution workplace pensions through approachable, scenario-based gamification. Follows Alex through everyday pension decisions with zero timers, non-shaming feedback, unpunished retries, and document inspection.',
      problem:
        'Workplace pension leavers frequently receive dense, jargon-laden statutory booklets that fail to resolve fundamental anxieties—such as "Do I lose my pension when I leave?"—leading to poor engagement and misinformed transfer decisions.',
      methods: [
        'Accessible front-end game architecture (zero timers, WCAG 2.2 contrast)',
        'Fictional leaver statement document inspection engine',
        'Branching decision tree with unpunished retries & non-shaming feedback',
        'Customer-service enquiry preparation simulator',
        'Downloadable & printable learning journal with public guidance references'
      ],
      keyOutput:
        'A fully playable web game chapter ("Alex changes jobs") with interactive document inspection, scenario-based decision trees, enquiry preparation activities, and verified pension guidance.',
      liveUrl: '/pension-quest/',
      toolUrl: '/pension-quest/',
      safeguardNotice:
        'Independent educational game notice: PensionQuest is an independent educational prototype exploring pensions communication and gamified learning. It does not provide regulated financial advice, does not recommend specific financial products or consolidation decisions, and is not affiliated with or endorsed by Prudential, M&G, or any pension provider.',
      sections: [
        {
          title: 'Concept & Narrative Learning Model',
          label: 'framework',
          body:
            'PensionQuest takes an approachable storybook approach to demystify UK Defined Contribution (DC) workplace pensions. Rather than presenting abstract financial formulas or intimidating legal disclaimers, the prototype follows "Alex", an employee who has just changed jobs and is uncertain about what happens to their accumulated pension pot.\n\nPlayers inspect a realistic, watermarked leaver statement, explore core choices, and learn that pensions remain safely invested in their own name regardless of employer changes.'
        },
        {
          title: 'Psychological Safety & Accessible Game Design',
          label: 'analysis',
          body:
            'Pensions anxiety is often exacerbated by tests that make people feel incompetent. PensionQuest implements deliberate design principles to foster confidence and psychological safety:',
          bulletPoints: [
            'Zero Timers: No stressful countdown clocks; players read and decide entirely at their own pace.',
            'Unpunished Retries: Selecting an incorrect option provides immediate, constructive feedback explaining the underlying pension rule without score penalties.',
            'Warm Storybook Tone: Uses an approachable visual aesthetic (warm cream surfaces, deep navy typography, and teal accents) to contrast against bureaucratic administrative portals.',
            'Full WCAG 2.2 Accessibility: High contrast ratios, clear keyboard focus indicators, and strict prefers-reduced-motion compatibility.'
          ]
        },
        {
          title: 'Front-Line Customer Service Integration',
          label: 'analysis',
          body:
            'Drawing directly from front-line corporate pensions customer service experience at Diligenta, the game includes a dedicated interactive task: "Prepare Alex\'s enquiry".\n\nMembers frequently call providers without knowing what questions to ask or what documentation is required. In this interactive activity, players learn how to ask targeted questions about annual management charges (AMCs), default investment strategies, and transfer options before taking action.'
        },
        {
          title: 'Learning Journal & Public Guidance Alignment',
          label: 'framework',
          body:
            'Upon completing the chapter, players unlock a structured Learning Journal summarising what Alex learned, clarifying common misconceptions, and linking directly to impartial public guidance services including MoneyHelper and Pension Wise (Money and Pensions Service).'
        }
      ]
    },
    {
      slug: 'nest-partner-discovery',
      title: 'Workplace Pension Partner Discovery',
      subtitle: 'Evaluating Digital Engagement Partnerships for Auto-Enrolment',
      category: 'Strategic Partnerships',
      tag: 'MASTER TRUST · PARTNER EVALUATION',
      statusBadge: 'Research Proposal in Progress',
      featured: false,
      summary:
        'A strategic proposal exploring whether UK master trusts (such as Nest) can justify procuring third-party workplace benefits platforms (Perkbox, Benifex) or enterprise engagement software (Braze) to resolve auto-enrolee dormancy under the Consumer Duty.',
      problem:
        'Nest serves over 13 million members across 1 million employers, yet default enrolment creates millions of passive members who never complete online registration or check their retirement funds.',
      methods: [
        'Multi-criteria partner evaluation scorecard',
        'Build vs. partner economic trade-off analysis',
        'FCA Consumer Duty fair-value & vulnerable customer safeguards',
        'Digital onboarding drop-off mapping'
      ],
      keyOutput:
        'A weighted 5-dimension partner-selection matrix comparing benefits platforms versus enterprise multichannel messaging against registration uplift potential.',
      liveUrl: 'https://partnership-lab.vercel.app/#/opportunity-lab/workplace-pension-partner-discovery',
      toolUrl: null,
      safeguardNotice:
        'Hypothetical proposal notice: This is an independent research proposal authored solely for academic and professional exploratory purposes. It is not an active procurement submission, nor is it endorsed by Nest (National Employment Savings Trust).',
      sections: [
        {
          title: 'The Enrolment Paradox',
          label: 'analysis',
          body:
            'Auto-enrolment in the UK has been remarkably successful in bringing over 10 million workers into pension savings. However, default enrolment produces passive participants rather than active users. Many members receive enrolment notices that are overlooked, and if registration is not completed within 30 days of enrolment, members rarely log in until approaching retirement.'
        },
        {
          title: 'Proposed Partner-Selection Matrix',
          label: 'framework',
          body:
            'This research investigates whether third-party workplace distribution channels (e.g. employee benefit platforms) or direct multichannel engagement tools provide a superior return on investment compared to an internal native portal rebuild.',
          table: {
            headers: ['Partner Candidate', 'Category', 'Strategic Advantage', 'Operational Risk / Consideration'],
            rows: [
              ['Perkbox', 'Everyday benefits & perks platform', 'High weekly mobile app engagement among younger workforce cohorts.', 'Commercial fee per member; potential dilution of serious pension focus.'],
              ['Benifex', 'Enterprise total reward & flex portal', 'Directly embedded into corporate HR and onboarding workflows.', 'Heavier focus on larger corporate schemes rather than SME auto-enrolment.'],
              ['Braze', 'Multichannel customer messaging', 'Enables automated, event-driven SMS and mobile push onboarding journeys.', 'Requires ongoing internal data science and campaign management resources.']
            ]
          }
        },
        {
          title: 'Consumer Duty Considerations',
          label: 'analysis',
          body:
            'Under the FCA Consumer Duty, any partnership must demonstrate clear customer understanding and prevent foreseeable harm. Digital engagement mechanisms cannot use dark patterns to prompt premature consolidation into inappropriate high-fee products.'
        }
      ]
    },
    {
      slug: 'spotify-uber',
      title: 'Spotify × Uber',
      subtitle: 'Embedded Experience & Cross-Platform Value Mechanics',
      category: 'Commercial Analysis',
      tag: 'CROSS-PLATFORM · API INTEGRATION',
      statusBadge: 'Case Study Archive',
      featured: false,
      summary:
        'An analytical review of the classic Spotify and Uber integration, evaluating how embedded third-party APIs create differentiated customer utility, mutual brand association, and technical operational dependencies.',
      problem:
        'How two high-growth consumer apps created contextual differentiation without diluting core transportation and music streaming utility.',
      methods: [
        'API entitlement and mutual account linking analysis',
        'Customer onboarding friction assessment',
        'Shared brand value vs partner dependency review'
      ],
      keyOutput:
        'Strategic insights on API maintenance overheads, premium conversion triggers, and operational friction in co-branded consumer experiences.',
      liveUrl: 'https://partnership-lab.vercel.app/#/case-studies/spotify-uber',
      toolUrl: null,
      safeguardNotice:
        'Retrospective case study. Independent analysis of publicly reported product integrations and public disclosures.',
      sections: [
        {
          title: 'Context & Value Exchange',
          label: 'analysis',
          body:
            'The Spotify × Uber partnership allowed riders to control in-car audio directly from their Uber app by connecting their Spotify Premium account. For Spotify, the partnership served as a tangible acquisition hook to demonstrate Premium utility in daily life; for Uber, it offered a distinctive premium ride experience that differentiated it from local taxi providers and competitors.'
        },
        {
          title: 'Operational Lessons for Strategic Partnerships',
          label: 'framework',
          body:
            'The case highlights critical operational realities that apply directly to financial services and technology collaborations:',
          bulletPoints: [
            'Dependency Management: In-car hardware and Bluetooth pairing failures created customer service tickets that neither partner alone could easily resolve.',
            'Entitlement Asymmetry: Requiring a paid Spotify Premium subscription limited user reach while preserving premium commercial boundaries.',
            'Core Utility Integrity: Secondary partner features must never interfere with the primary transaction (in this case, ordering and taking a safe ride).'
          ]
        }
      ]
    }
  ],

  experience: [
    {
      company: 'Diligenta',
      role: 'Pensions Service Advisor',
      location: 'Stirling, Scotland',
      period: '2025–Present',
      summary:
        'Delivering Defined Contribution workplace pension and AVC customer support in an FCA-regulated environment, maintaining high accuracy standards and procedural adherence.',
      responsibilities: [
        'Support corporate Defined Contribution (DC) pension and Additional Voluntary Contribution (AVC) members, explaining administrative rules and documentation clearly.',
        'Review member records, instructions, and supporting documentation with high precision to identify missing or inconsistent information.',
        'Gather and verify Letters of Authority (LOA) to ensure rigorous regulatory, data protection, and security compliance.',
        'Prepare concise case notes and supporting evidence for specialist technical teams to investigate non-standard pension enquiries.',
        'Handle complex member enquiries with composure and empathy while strictly working within documented procedural boundaries.',
        'Maintain accurate audit records across multiple enterprise systems (including Bancs, LMT, and WorkSmart) while applying Consumer Duty, GDPR, and Treating Customers Fairly principles.'
      ],
      tags: ['Defined Contribution', 'Letter of Authority', 'Consumer Duty', 'Bancs / LMT / WorkSmart', 'GDPR']
    },
    {
      company: "Domino's",
      role: 'Store Manager',
      location: 'Stirling, Scotland',
      period: '2024–2025',
      summary:
        'Managed daily store operations, supervised front-line teams, and maintained financial controls and cash reconciliation under high-pressure retail conditions.',
      responsibilities: [
        'Managed day-to-day store operations, coordinating customer service, shift rotas, and compliance with health and safety standards.',
        'Supervised and supported shifts of up to 15 team members, resolving customer disputes and allocating tasks during peak operational demand.',
        'Reconciled daily cash takings of approximately £5,000, completed secure banking, and maintained strict financial-control documentation.',
        'Prioritised competing operational demands while upholding service consistency and operational documentation.'
      ],
      tags: ['Cash Reconciliation', 'Team Supervision', 'Operational Control', 'Customer Service', 'Store Operations']
    }
  ],

  education: [
    {
      institution: 'University of Stirling',
      degree: 'MSc Sports Management',
      location: 'Stirling, Scotland',
      period: '2022–2025',
      details:
        'Developed skills in strategic management, stakeholder engagement, research, policy analysis, and evidence-based decision-making.'
    },
    {
      institution: 'Parvatibai Chowgule College of Arts and Science (Autonomous)',
      degree: 'BA (Hons) Economics',
      location: 'Goa, India',
      period: '2018–2021',
      details:
        'Rigorous curriculum covering microeconomics, macroeconomics, statistics, financial-data interpretation, and quantitative analysis.'
    }
  ],

  certificates: [
    {
      title: 'AI Governance',
      issuer: 'Saïd Business School, University of Oxford',
      platform: 'via Coursera',
      dateCompleted: 'Completed September 2026',
      credentialId: 'TA2SPQ9NXQ7E',
      verificationUrl: 'https://coursera.org/verify/TA2SPQ9NXQ7E',
      summary:
        'Executive education covering algorithmic accountability, governance frameworks, and international risk and regulatory compliance.'
    },
    {
      title: 'Generative AI: Governance, Policy, and Emerging Regulation',
      issuer: 'University of Michigan',
      platform: 'via Coursera',
      dateCompleted: 'Completed September 2026',
      credentialId: 'SOT2WGCNHEBB',
      verificationUrl: 'https://coursera.org/verify/SOT2WGCNHEBB',
      summary:
        'Policy trends, institutional AI risk frameworks, and emerging international regulations.'
    },
    {
      title: 'Investment Banking: Financial Analysis and Valuation',
      issuer: 'University of Illinois Urbana-Champaign',
      platform: 'via Coursera',
      dateCompleted: 'Completed June 2026',
      summary:
        'Foundations of financial statements, corporate cash-flow analysis, business performance, and commercial valuation principles.'
    },
    {
      title: 'Retirement Planning Made Easy',
      issuer: 'The Open University',
      platform: 'OpenLearn',
      dateCompleted: 'Completed June 2026',
      summary:
        'UK retirement planning, state and workplace pension principles, and the role of financial services providers in delivering good member outcomes.'
    }
  ],

  skills: [
    {
      name: 'Pensions & Customer Operations',
      description: 'Front-line administration, member communication, and regulatory adherence.',
      skills: [
        'Defined Contribution (DC) pension enquiry handling',
        'AVC member communication & guidance',
        'Letter of Authority (LOA) gathering & verification',
        'Member record review & policy histories',
        'Accurate case notes & complex technical escalations',
        'FCA Consumer Duty & Treating Customers Fairly adherence'
      ]
    },
    {
      name: 'Analysis & Tools',
      description: 'Productivity software, data tools, and operational pension systems.',
      skills: [
        'Microsoft Excel (intermediate: VLOOKUP, XLOOKUP, pivot tables)',
        'Microsoft Word, PowerPoint, Outlook',
        'Bancs (pension administration system)',
        'LMT & WorkSmart operational workflow tools',
        'Cash reconciliation & audit trail documentation',
        'AI-assisted prototype development'
      ]
    },
    {
      name: 'Research & Developing Interests',
      description: 'Analytical evaluation, partnership frameworks, and emerging policy.',
      skills: [
        'Strategic partnership assessment & partner fit analysis',
        'Commercial pilot design & activation modeling',
        'FCA Consumer Duty safeguards & fair value evaluation',
        'Open Finance & digital onboarding journey mapping',
        'AI governance policy & institutional risk frameworks'
      ]
    }
  ]
};
