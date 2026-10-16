/**
 * Ritul Sawant - Professional Portfolio & Case Study Workspace
 * Standalone Client Application & Zero-Dependency Runtime
 * Inspired by contemporary dark editorial & research portfolio aesthetics
 */

// --- 1. React Mini-Runtime ---
const React = (() => {
  let currentComponent = null;
  let hookIndex = 0;

  function useState(initialValue) {
    const component = currentComponent;
    const index = hookIndex++;
    if (!component.hooks[index]) {
      component.hooks[index] = {
        state: typeof initialValue === 'function' ? initialValue() : initialValue,
      };
    }
    const hook = component.hooks[index];
    const setState = (newValue) => {
      const nextState = typeof newValue === 'function' ? newValue(hook.state) : newValue;
      if (nextState !== hook.state) {
        hook.state = nextState;
        scheduleRender();
      }
    };
    return [hook.state, setState];
  }

  function useEffect(callback, deps) {
    const component = currentComponent;
    const index = hookIndex++;
    const oldHook = component.hooks[index];
    const hasChanged = !oldHook || !deps || deps.some((dep, i) => dep !== oldHook.deps[i]);
    if (hasChanged) {
      if (oldHook && oldHook.cleanup) {
        try { oldHook.cleanup(); } catch (e) { console.error(e); }
      }
      component.effects.push({ callback, deps, index });
    }
  }

  function useRef(initialValue) {
    const component = currentComponent;
    const index = hookIndex++;
    if (!component.hooks[index]) {
      component.hooks[index] = { current: initialValue };
    }
    return component.hooks[index];
  }

  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...(props || {}),
        children: children.flat().filter(c => c !== null && c !== undefined && c !== false),
      },
    };
  }

  return {
    useState,
    useEffect,
    useRef,
    createElement,
    Fragment: 'Fragment',
    _setCurrentComponent: (c) => { currentComponent = c; hookIndex = 0; },
  };
})();

// DOM Renderer
let rootElement = null;
let rootComponentFn = null;
let rootInstance = { hooks: [], effects: [] };
let renderScheduled = false;

function scheduleRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    performRender();
  });
}

function performRender() {
  if (!rootElement || !rootComponentFn) return;
  React._setCurrentComponent(rootInstance);
  rootInstance.effects = [];
  const vdom = rootComponentFn();

  rootElement.innerHTML = '';
  const domNode = renderVNode(vdom);
  if (domNode) {
    rootElement.appendChild(domNode);
  }

  rootInstance.effects.forEach(eff => {
    const cleanup = eff.callback();
    rootInstance.hooks[eff.index] = {
      deps: eff.deps,
      cleanup: typeof cleanup === 'function' ? cleanup : null,
    };
  });
}

function renderVNode(vnode) {
  if (vnode === null || vnode === undefined || vnode === false) {
    return document.createTextNode('');
  }
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (vnode.type === 'Fragment') {
    const fragment = document.createDocumentFragment();
    (vnode.props.children || []).forEach(child => {
      const childNode = renderVNode(child);
      if (childNode) fragment.appendChild(childNode);
    });
    return fragment;
  }

  if (typeof vnode.type === 'function') {
    const subVNode = vnode.type(vnode.props);
    return renderVNode(subVNode);
  }

  const el = document.createElement(vnode.type);

  if (vnode.props) {
    Object.keys(vnode.props).forEach(key => {
      if (key === 'children') return;

      if (key === 'className') {
        el.className = vnode.props[key];
      } else if (key === 'style' && typeof vnode.props[key] === 'object') {
        Object.assign(el.style, vnode.props[key]);
      } else if (key.startsWith('on') && typeof vnode.props[key] === 'function') {
        const eventName = key.substring(2).toLowerCase();
        el.addEventListener(eventName, vnode.props[key]);
      } else if (key.startsWith('aria-') || key.startsWith('data-')) {
        el.setAttribute(key, vnode.props[key]);
      } else if (key === 'htmlFor') {
        el.setAttribute('for', vnode.props[key]);
      } else {
        el.setAttribute(key, vnode.props[key]);
      }
    });

    (vnode.props.children || []).forEach(child => {
      const childNode = renderVNode(child);
      if (childNode) el.appendChild(childNode);
    });
  }

  return el;
}

// --- 2. Portfolio Data ---
const portfolioData = {
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
        'Letter of Authority (LOA) gathering and verification to ensure regulatory, data protection, and security compliance.',
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
        'Microsoft Excel: intermediate, including VLOOKUP and XLOOKUP',
        'Microsoft Word, PowerPoint, Outlook',
        'Bancs, LMT and WorkSmart',
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

// --- 3. UI Components ---

function Header({ profile, currentHash, onNavigateHome }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateHome(id);
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('a', { href: '#main-content', className: 'skip-link' }, 'Skip to main content'),
    React.createElement(
      'header',
      { className: 'site-header', role: 'banner' },
      React.createElement(
        'div',
        { className: 'container header-inner' },
        React.createElement(
          'a',
          {
            href: '#/',
            className: 'brand-wrapper',
            onClick: (e) => {
              e.preventDefault();
              onNavigateHome();
            },
            'aria-label': 'Ritul Sawant Portfolio Home',
          },
          React.createElement('span', { className: 'brand-monogram' }, 'RS'),
          React.createElement(
            'div',
            { className: 'brand-details' },
            React.createElement('span', { className: 'brand-name' }, profile.name),
            React.createElement('span', { className: 'brand-tag' }, 'Economics · Partnerships')
          )
        ),
        React.createElement(
          'button',
          {
            className: 'mobile-toggle-btn',
            onClick: () => setMobileMenuOpen(!mobileMenuOpen),
            'aria-expanded': mobileMenuOpen,
            'aria-controls': 'main-nav-menu',
            'aria-label': 'Toggle navigation menu',
          },
          mobileMenuOpen ? 'Close' : 'Menu'
        ),
        React.createElement(
          'nav',
          {
            id: 'main-nav-menu',
            className: `nav-menu ${mobileMenuOpen ? 'open' : ''}`,
            role: 'navigation',
            'aria-label': 'Main Portfolio Navigation',
          },
          React.createElement(
            'ul',
            { className: 'nav-links' },
            navItems.map((item) => {
              const isActive = currentHash === `#${item.id}` || currentHash === `#/${item.id}`;
              return React.createElement(
                'li',
                { key: item.id },
                React.createElement(
                  'a',
                  {
                    href: `#${item.id}`,
                    className: `nav-item-link ${isActive ? 'active' : ''}`,
                    onClick: (e) => handleNavClick(e, item.id),
                  },
                  item.label
                )
              );
            })
          ),
          React.createElement(
            'a',
            {
              href: '#contact',
              className: 'nav-cta-btn',
              onClick: (e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigateHome('contact');
              },
            },
            'Get in touch'
          )
        )
      )
    )
  );
}

function Hero({ profile, featuredProject, onNavigateSection, onSelectProject }) {
  return React.createElement(
    'section',
    { className: 'hero-editorial', 'aria-label': 'Introduction and summary' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        { className: 'hero-grid' },
        React.createElement(
          'div',
          { className: 'hero-text-col' },
          React.createElement(
            'div',
            { className: 'hero-status-pill' },
            React.createElement('span', { className: 'pulse-dot', 'aria-hidden': 'true' }),
            React.createElement('span', null, 'Stirling, Scotland · Strategic Partnerships & Operations')
          ),
          React.createElement(
            'h1',
            { className: 'hero-title-main' },
            'Economics, ',
            React.createElement('span', { className: 'serif-accent' }, 'partnerships'),
            ', and practical analysis.'
          ),
          React.createElement('p', { className: 'hero-paragraph' }, profile.heroParagraph),
          React.createElement(
            'div',
            { className: 'hero-cta-group' },
            React.createElement(
              'a',
              {
                href: '#work',
                className: 'btn-editorial btn-primary-dark',
                onClick: (e) => {
                  e.preventDefault();
                  onNavigateSection('work');
                },
              },
              'Explore my work ↓'
            ),
            React.createElement(
              'a',
              {
                href: '#contact',
                className: 'btn-editorial btn-outline-dark',
                onClick: (e) => {
                  e.preventDefault();
                  onNavigateSection('contact');
                },
              },
              'Get in touch →'
            ),
            profile.cvUrl
              ? React.createElement(
                  'a',
                  {
                    href: profile.cvUrl,
                    download: 'Ritul_Sawant_CV.pdf',
                    className: 'btn-editorial btn-teal-ghost',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    'aria-label': "Download Ritul Sawant's verified CV PDF",
                  },
                  'Download CV (PDF) ↗'
                )
              : null
          ),
          React.createElement(
            'div',
            { className: 'hero-metadata-grid' },
            React.createElement(
              'div',
              { className: 'meta-col' },
              React.createElement('span', { className: 'meta-label' }, 'Background'),
              React.createElement('span', { className: 'meta-value' }, 'Economics & Sports Mgmt')
            ),
            React.createElement(
              'div',
              { className: 'meta-col' },
              React.createElement('span', { className: 'meta-label' }, 'Current Role'),
              React.createElement('span', { className: 'meta-value' }, 'Diligenta (DC Pensions)')
            ),
            React.createElement(
              'div',
              { className: 'meta-col' },
              React.createElement('span', { className: 'meta-label' }, 'Core Focus'),
              React.createElement('span', { className: 'meta-value' }, 'Strategic Partnerships')
            )
          )
        ),
        featuredProject
          ? React.createElement(
              'div',
              { className: 'hero-spotlight-col' },
              React.createElement(
                'aside',
                { className: 'featured-spotlight-card', 'aria-label': 'Featured Research Project' },
                React.createElement(
                  'div',
                  { className: 'spotlight-eyebrow' },
                  React.createElement('span', { className: 'spotlight-badge' }, '// FEATURED CASE STUDY'),
                  React.createElement('span', { className: 'spotlight-status' }, 'COMPLETE')
                ),
                React.createElement('h2', { className: 'spotlight-title' }, featuredProject.title),
                React.createElement('div', { className: 'spotlight-subtitle' }, featuredProject.subtitle),
                React.createElement(
                  'p',
                  { className: 'spotlight-summary' },
                  'Independent analysis evaluating how a legacy DC pension provider paired with an Open Finance fintech to address member disengagement, tackle the £31.1B lost pensions problem, and design an employer onboarding pilot.'
                ),
                React.createElement(
                  'div',
                  { className: 'spotlight-stats-row' },
                  React.createElement(
                    'div',
                    { className: 'spotlight-stat-item' },
                    React.createElement('span', { className: 'stat-key' }, 'Sector'),
                    React.createElement('span', { className: 'stat-val' }, 'Open Finance / DC Pensions')
                  ),
                  React.createElement(
                    'div',
                    { className: 'spotlight-stat-item' },
                    React.createElement('span', { className: 'stat-key' }, 'Framework'),
                    React.createElement('span', { className: 'stat-val' }, 'FCA Consumer Duty')
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'spotlight-actions' },
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'btn-editorial btn-primary-dark',
                      style: { flex: 1 },
                      onClick: () => onSelectProject(featuredProject.slug),
                    },
                    'Read case study →'
                  ),
                  featuredProject.liveUrl
                    ? React.createElement(
                        'a',
                        {
                          href: featuredProject.liveUrl,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className: 'btn-editorial btn-outline-dark',
                          'aria-label': 'View live case study on Partnership Lab',
                        },
                        'Live link ↗'
                      )
                    : null
                )
              )
            )
          : null
      )
    )
  );
}

function Projects({ projects, onSelectProject }) {
  return React.createElement(
    'section',
    { id: 'work', className: 'editorial-section', 'aria-labelledby': 'work-heading' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'section-eyebrow' }, '// 01. SELECTED WORK'),
        React.createElement(
          'h2',
          { id: 'work-heading', className: 'section-heading-editorial' },
          'Strategic research & operational prototypes'
        ),
        React.createElement(
          'p',
          { className: 'section-subhead' },
          'Independent research portfolios, commercial frameworks, and pensions customer-service web applications exploring partner fit, member clarity, and Consumer Duty governance.'
        )
      ),
      React.createElement(
        'div',
        { className: 'projects-editorial-grid' },
        projects.map((project) => {
          const isPensionSteps = project.slug === 'pension-steps';
          const isPensionQuest = project.slug === 'pension-quest';
          const isPartnershipLab = project.slug === 'partnership-lab';
          const isWebTool = isPensionSteps || isPensionQuest || isPartnershipLab;

          let primaryBtnLabel = 'View live site ↗';
          if (isPartnershipLab) primaryBtnLabel = 'Visit Website ↗';
          else if (isPensionQuest) primaryBtnLabel = 'Play Game Prototype ↗';
          else if (isPensionSteps) primaryBtnLabel = 'Launch Website Tool ↗';

          let secondaryBtnLabel = 'Read case study →';
          if (isPartnershipLab) secondaryBtnLabel = 'Platform Overview & Rationale →';
          else if (isPensionQuest) secondaryBtnLabel = 'Game Design & Rationale →';
          else if (isPensionSteps) secondaryBtnLabel = 'Architecture & Rationale →';

          return React.createElement(
            'article',
            {
              key: project.slug,
              className: 'project-editorial-card',
              style: isWebTool ? { borderColor: 'rgba(45, 212, 191, 0.25)', background: 'linear-gradient(180deg, #0e121a 0%, #0a0c10 100%)' } : {},
            },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'card-top-meta' },
                React.createElement('span', { className: 'card-tag' }, project.tag),
                React.createElement(
                  'span',
                  {
                    className: 'card-status-badge',
                    style: isWebTool ? { borderColor: 'var(--accent-teal)', color: 'var(--accent-mint)', background: 'rgba(52, 245, 164, 0.08)' } : {},
                  },
                  project.statusBadge
                )
              ),
              React.createElement('h3', { className: 'card-title' }, project.title),
              React.createElement('div', { className: 'card-subtitle' }, project.subtitle),
              React.createElement('p', { className: 'card-description' }, project.summary),
              React.createElement(
                'div',
                { className: 'card-inquiry-box' },
                React.createElement(
                  'div',
                  { className: 'inquiry-label' },
                  isWebTool ? 'Operational Problem Solved' : 'Problem / Research Question'
                ),
                React.createElement('div', { className: 'inquiry-text' }, project.problem)
              ),
              React.createElement(
                'div',
                { className: 'card-methods-list', 'aria-label': 'Methods and frameworks used' },
                project.methods.map((method, idx) =>
                  React.createElement('span', { key: idx, className: 'method-pill' }, method)
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'card-actions' },
              project.liveUrl
                ? React.createElement(
                    'a',
                    {
                      href: project.liveUrl,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: 'btn-editorial btn-primary-dark',
                      style: isWebTool ? { background: 'var(--accent-teal)', color: '#050607', flex: '1 1 auto' } : {},
                      'aria-label': `Launch ${project.title} live in a new tab`,
                    },
                    primaryBtnLabel
                  )
                : null,
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: `btn-editorial ${isWebTool ? 'btn-outline-dark' : 'btn-primary-dark'}`,
                  style: isWebTool ? {} : { flex: '1 1 auto' },
                  onClick: () => onSelectProject(project.slug),
                  'aria-label': `View architecture and design details for ${project.title}`,
                },
                secondaryBtnLabel
              )
            )
          );
        })
      )
    )
  );
}

function ProjectDetail({ project, onBack }) {
  const [showLiveEmbed, setShowLiveEmbed] = React.useState(true);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${project.title} | Ritul Sawant Portfolio`;
    return () => {
      document.title = 'Ritul Sawant | Economics, Strategic Partnerships & Operations';
    };
  }, [project.title]);

  const isPensionSteps = project.slug === 'pension-steps';
  const isPensionQuest = project.slug === 'pension-quest';
  const isPartnershipLab = project.slug === 'partnership-lab';
  const isInteractiveTool = isPensionSteps || isPensionQuest || isPartnershipLab;

  let detailLiveLabel = 'View on Partnership Lab ↗';
  if (isPartnershipLab) detailLiveLabel = 'Visit Live Website ↗';
  else if (isPensionQuest) detailLiveLabel = 'Play Game Prototype ↗';
  else if (isPensionSteps) detailLiveLabel = 'Launch Web Application ↗';

  const embedSrc = project.embedUrl || project.liveUrl;

  return React.createElement(
    'main',
    { id: 'main-content', className: 'case-study-view', role: 'main' },
    React.createElement(
      'div',
      { className: 'container container-narrow' },
      React.createElement(
        'a',
        {
          href: '#/work',
          className: 'back-nav-btn',
          onClick: (e) => {
            e.preventDefault();
            onBack();
          },
        },
        '← Back to all selected work'
      ),
      React.createElement(
        'header',
        { className: 'case-study-hero' },
        React.createElement('div', { className: 'case-study-tag' }, project.tag),
        React.createElement('h1', { className: 'case-study-title' }, project.title),
        React.createElement('div', { className: 'case-study-sub' }, project.subtitle),
        React.createElement(
          'div',
          { className: 'case-study-meta-bar' },
          React.createElement('span', { className: 'card-status-badge' }, project.statusBadge),
          project.liveUrl
            ? React.createElement(
                'a',
                {
                  href: project.liveUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'btn-editorial btn-primary-dark',
                  style: { padding: '8px 16px', fontSize: '0.8rem' },
                },
                detailLiveLabel
              )
            : null
        )
      ),
      isInteractiveTool && embedSrc
        ? React.createElement(
            'section',
            { className: 'live-tool-preview-card', 'aria-label': 'Live interactive application preview' },
            React.createElement(
              'div',
              { className: 'live-tool-header' },
              React.createElement(
                'div',
                { className: 'live-tool-badge' },
                React.createElement('span', { className: 'pulse-dot', 'aria-hidden': 'true' }),
                React.createElement(
                  'span',
                  null,
                  isPartnershipLab
                    ? 'Live Research Platform'
                    : isPensionQuest
                    ? 'Live Interactive Educational Game'
                    : 'Live Interactive Web Application'
                )
              ),
              React.createElement(
                'div',
                { style: { display: 'flex', gap: '8px' } },
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'btn-editorial btn-outline-dark',
                    style: { padding: '6px 12px', fontSize: '0.75rem' },
                    onClick: () => setShowLiveEmbed(!showLiveEmbed),
                  },
                  showLiveEmbed ? 'Hide interactive preview' : 'Show interactive preview'
                ),
                React.createElement(
                  'a',
                  {
                    href: project.liveUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'btn-editorial btn-teal-ghost',
                    style: { padding: '6px 12px', fontSize: '0.75rem' },
                  },
                  isPartnershipLab
                    ? 'Open website in new tab ↗'
                    : isPensionQuest
                    ? 'Play fullscreen in new tab ↗'
                    : 'Open fullscreen in new tab ↗'
                )
              )
            ),
            React.createElement(
              'p',
              { style: { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' } },
              isPartnershipLab
                ? 'Explore the live Partnership Lab research publication below (browse multi-chapter case studies, the Opportunity Lab, and the 7-step methodology):'
                : isPensionQuest
                ? 'Play Chapter 1 ("Alex changes jobs") below with interactive document inspection, unpunished decision retries, and customer service enquiry tasks:'
                : 'Test the 3-stage customer preparation workflow below (select an enquiry, view the tailored documentation checklist, and preview the call plan worksheet):'
            ),
            showLiveEmbed
              ? React.createElement(
                  'div',
                  { className: 'tool-iframe-wrapper' },
                  React.createElement('iframe', {
                    src: embedSrc,
                    title: isPartnershipLab
                      ? 'Partnership Lab Research Platform'
                      : isPensionQuest
                      ? 'PensionQuest Playable Educational Game'
                      : 'PensionSteps Interactive Customer Preparation Tool',
                    className: 'tool-iframe',
                    loading: 'lazy',
                  })
                )
              : null
          )
        : null,
      project.safeguardNotice
        ? React.createElement(
            'aside',
            { className: 'safeguards-editorial-box', 'aria-label': 'Evidence and research safeguards' },
            React.createElement('div', { className: 'safeguards-title' }, '// Evidence Classification & Boundaries'),
            React.createElement('p', null, project.safeguardNotice)
          )
        : null,
      React.createElement(
        'div',
        { className: 'case-study-sections-container' },
        project.sections.map((sec, idx) =>
          React.createElement(
            'article',
            { key: idx, className: 'case-study-section-card' },
            React.createElement(
              'div',
              { className: 'cs-section-header' },
              React.createElement('h2', { className: 'cs-section-title' }, sec.title),
              sec.label
                ? React.createElement('span', { className: `cs-label-badge ${sec.label}` }, sec.label)
                : null
            ),
            React.createElement('div', { className: 'cs-body-text' }, sec.body),
            sec.table
              ? React.createElement(
                  'div',
                  { className: 'editorial-table-wrapper' },
                  React.createElement(
                    'table',
                    { className: 'editorial-table' },
                    React.createElement(
                      'thead',
                      null,
                      React.createElement(
                        'tr',
                        null,
                        sec.table.headers.map((h, hIdx) =>
                          React.createElement('th', { key: hIdx }, h)
                        )
                      )
                    ),
                    React.createElement(
                      'tbody',
                      null,
                      sec.table.rows.map((row, rIdx) =>
                        React.createElement(
                          'tr',
                          { key: rIdx },
                          row.map((cell, cIdx) =>
                            React.createElement(
                              'td',
                              { key: cIdx },
                              cIdx === 0 ? React.createElement('strong', null, cell) : cell
                            )
                          )
                        )
                      )
                    )
                  )
                )
              : null,
            sec.bulletPoints
              ? React.createElement(
                  'ul',
                  { className: 'cs-bullet-list' },
                  sec.bulletPoints.map((bp, bpIdx) =>
                    React.createElement('li', { key: bpIdx }, bp)
                  )
                )
              : null
          )
        )
      ),
      React.createElement(
        'div',
        { style: { marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-line)' } },
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'btn-editorial btn-primary-dark',
            onClick: onBack,
          },
          '← Return to portfolio'
        )
      )
    )
  );
}

function About({ profile }) {
  return React.createElement(
    'section',
    { id: 'about', className: 'editorial-section', 'aria-labelledby': 'about-heading' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'section-eyebrow' }, '// 02. ABOUT ME'),
        React.createElement(
          'h2',
          { id: 'about-heading', className: 'section-heading-editorial' },
          'Connecting quantitative analysis with front-line operations.'
        )
      ),
      React.createElement(
        'div',
        { className: 'about-split-grid', style: { marginTop: '2.5rem' } },
        React.createElement(
          'div',
          { className: 'about-editorial-prose' },
          profile.aboutText.map((paragraph, idx) =>
            React.createElement('p', { key: idx }, paragraph)
          ),
          React.createElement(
            'div',
            { className: 'safeguards-editorial-box', style: { marginTop: '2rem', marginBottom: 0 } },
            React.createElement('div', { className: 'safeguards-title' }, '// Scope & Professional Boundaries'),
            React.createElement(
              'p',
              { style: { margin: 0 } },
              'This is a personal career portfolio. I do not provide regulated financial advice, investment management, or actuarial services, nor do I represent myself as a professional software developer or senior AI governance practitioner.'
            )
          )
        ),
        React.createElement(
          'aside',
          { className: 'narrative-callout', 'aria-label': 'Background summary' },
          React.createElement('h3', { className: 'callout-title' }, '// Academic & Operational Path'),
          React.createElement(
            'ul',
            { className: 'callout-list' },
            React.createElement(
              'li',
              { className: 'callout-item' },
              React.createElement('span', { className: 'callout-item-label' }, 'Economics Foundation'),
              React.createElement(
                'span',
                { className: 'callout-item-desc' },
                'Quantitative discipline, statistics, micro/macro policy analysis, and financial data interpretation.'
              )
            ),
            React.createElement(
              'li',
              { className: 'callout-item' },
              React.createElement('span', { className: 'callout-item-label' }, 'MSc Sports Management'),
              React.createElement(
                'span',
                { className: 'callout-item-desc' },
                'Strategic governance, operational planning, stakeholder coordination, and evidence-based decision-making.'
              )
            ),
            React.createElement(
              'li',
              { className: 'callout-item' },
              React.createElement('span', { className: 'callout-item-label' }, 'Corporate Pensions (Diligenta)'),
              React.createElement(
                'span',
                { className: 'callout-item-desc' },
                'FCA-regulated DC enquiry handling, Letter of Authority verification, case notes, and Consumer Duty compliance.'
              )
            ),
            React.createElement(
              'li',
              { className: 'callout-item' },
              React.createElement('span', { className: 'callout-item-label' }, 'Store Operations (Domino’s)'),
              React.createElement(
                'span',
                { className: 'callout-item-desc' },
                'Team supervision of 15 staff, customer escalation handling, daily cash reconciliation (£5k) and banking controls.'
              )
            ),
            React.createElement(
              'li',
              { className: 'callout-item' },
              React.createElement('span', { className: 'callout-item-label' }, 'Independent Research'),
              React.createElement(
                'span',
                { className: 'callout-item-desc' },
                'Evaluating strategic partnership models, open finance integrations, and Consumer Duty safeguards.'
              )
            )
          )
        )
      )
    )
  );
}

function Experience({ experience, education, certificates }) {
  return React.createElement(
    'section',
    { id: 'experience', className: 'editorial-section', 'aria-labelledby': 'experience-heading' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'section-eyebrow' }, '// 03. EXPERIENCE & EDUCATION'),
        React.createElement(
          'h2',
          { id: 'experience-heading', className: 'section-heading-editorial' },
          'Career history & academic foundations'
        ),
        React.createElement(
          'p',
          { className: 'section-subhead' },
          'Operational roles demonstrating procedural discipline, customer service resilience, accurate documentation, and quantitative economics training.'
        )
      ),
      React.createElement(
        'div',
        { className: 'timeline-dual-grid', style: { marginTop: '3rem' } },
        React.createElement(
          'div',
          { className: 'timeline-column' },
          React.createElement('h3', { className: 'timeline-column-title' }, '// Professional Experience'),
          React.createElement(
            'div',
            { className: 'timeline-entries' },
            experience.map((item, idx) =>
              React.createElement(
                'article',
                { key: idx, className: 'timeline-entry-card' },
                React.createElement(
                  'div',
                  { className: 'entry-header' },
                  React.createElement('span', { className: 'entry-role' }, item.role),
                  React.createElement('span', { className: 'entry-period' }, item.period)
                ),
                React.createElement('div', { className: 'entry-company' }, `${item.company} · ${item.location}`),
                React.createElement('p', { className: 'entry-summary' }, item.summary),
                React.createElement(
                  'ul',
                  { className: 'entry-bullets' },
                  item.responsibilities.map((resp, rIdx) =>
                    React.createElement('li', { key: rIdx }, resp)
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'entry-tags' },
                  item.tags.map((tag) =>
                    React.createElement('span', { key: tag, className: 'entry-tag-pill' }, tag)
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'timeline-column' },
          React.createElement('h3', { className: 'timeline-column-title' }, '// Education & Completed Courses'),
          React.createElement(
            'div',
            { className: 'timeline-entries' },
            education.map((edu, idx) =>
              React.createElement(
                'article',
                { key: idx, className: 'timeline-entry-card' },
                React.createElement(
                  'div',
                  { className: 'entry-header' },
                  React.createElement('span', { className: 'entry-role' }, edu.degree),
                  React.createElement('span', { className: 'entry-period' }, edu.period)
                ),
                React.createElement('div', { className: 'entry-company' }, `${edu.institution} · ${edu.location}`),
                React.createElement('p', { className: 'entry-summary' }, edu.details)
              )
            ),
            React.createElement(
              'div',
              { style: { marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-line)' } },
              React.createElement(
                'div',
                {
                  style: {
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--accent-teal)',
                    marginBottom: '1rem',
                  },
                },
                '// Targeted Coursework & Executive Learning'
              ),
              React.createElement(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
                certificates.map((cert, cIdx) =>
                  React.createElement(
                    'div',
                    {
                      key: cIdx,
                      style: {
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-line)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1rem',
                      },
                    },
                    React.createElement(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          gap: '8px',
                          marginBottom: '4px',
                        },
                      },
                      React.createElement('strong', { style: { fontSize: '0.9rem', color: 'var(--text-primary)' } }, cert.title),
                      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-teal)' } }, cert.dateCompleted)
                    ),
                    React.createElement(
                      'div',
                      { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' } },
                      `${cert.issuer} ${cert.platform ? `(${cert.platform})` : ''}`
                    ),
                    React.createElement('p', { style: { fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 } }, cert.summary),
                    cert.credentialId
                      ? React.createElement(
                          'div',
                          { style: { marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '0.675rem', color: 'var(--text-dim)' } }, `ID: ${cert.credentialId}`),
                          cert.verificationUrl
                            ? React.createElement(
                                'a',
                                {
                                  href: cert.verificationUrl,
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                                  style: { fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-teal)', textDecoration: 'none' },
                                  'aria-label': `Verify ${cert.title} credential on Coursera`,
                                },
                                'Verify ↗'
                              )
                            : null
                        )
                      : null
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

function Skills({ skills }) {
  return React.createElement(
    'section',
    { id: 'skills', className: 'editorial-section', 'aria-labelledby': 'skills-heading' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'section-eyebrow' }, '// 04. SKILLS & CAPABILITIES'),
        React.createElement(
          'h2',
          { id: 'skills-heading', className: 'section-heading-editorial' },
          'Demonstrated skills & analytical methods'
        ),
        React.createElement(
          'p',
          { className: 'section-subhead' },
          'Core operational proficiencies across pension enquiry handling, enterprise systems, office data tools, and partnership analysis frameworks.'
        )
      ),
      React.createElement(
        'div',
        { className: 'skills-groups-grid' },
        skills.map((group, idx) =>
          React.createElement(
            'article',
            { key: idx, className: 'skill-group-card' },
            React.createElement('h3', { className: 'skill-group-title' }, group.name),
            React.createElement('p', { className: 'skill-group-desc' }, group.description),
            React.createElement(
              'ul',
              { className: 'skill-pills-list' },
              group.skills.map((skill, sIdx) =>
                React.createElement(
                  'li',
                  { key: sIdx },
                  React.createElement('span', { className: 'skill-dash', 'aria-hidden': 'true' }, '→'),
                  React.createElement('span', null, skill)
                )
              )
            )
          )
        )
      )
    )
  );
}

function Contact({ profile }) {
  return React.createElement(
    'section',
    { id: 'contact', className: 'editorial-section', 'aria-labelledby': 'contact-heading' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'section-eyebrow' }, '// 05. CONTACT'),
        React.createElement(
          'h2',
          { id: 'contact-heading', className: 'section-heading-editorial' },
          "Let's connect."
        )
      ),
      React.createElement(
        'div',
        { className: 'contact-editorial-card' },
        React.createElement(
          'div',
          { className: 'contact-flex-layout' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { style: { fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' } },
              'I am actively seeking early-career opportunities in ',
              React.createElement('strong', null, 'Strategic Partnerships'),
              ', ',
              React.createElement('strong', null, 'Partner Operations'),
              ', and ',
              React.createElement('strong', null, 'Financial Services Operations'),
              ' where I can contribute analytical rigour, front-line member empathy, and disciplined execution.'
            ),
            React.createElement(
              'p',
              { style: { color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' } },
              'Based in Stirling, Scotland, with availability for roles across Central Scotland (Edinburgh/Glasgow) and hybrid/remote arrangements.'
            ),
            profile.cvUrl
              ? React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'a',
                    {
                      href: profile.cvUrl,
                      download: 'Ritul_Sawant_CV.pdf',
                      className: 'btn-editorial btn-primary-dark',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                    'Download CV (PDF) ↗'
                  )
                )
              : null
          ),
          React.createElement(
            'div',
            { className: 'contact-methods-box' },
            React.createElement(
              'div',
              { className: 'contact-method-row' },
              React.createElement('div', { className: 'contact-icon-bubble' }, '@'),
              React.createElement(
                'div',
                { className: 'contact-info-col' },
                React.createElement('span', { className: 'contact-info-label' }, 'Direct Email'),
                React.createElement(
                  'a',
                  {
                    href: `mailto:${profile.email}`,
                    className: 'contact-info-link',
                    'aria-label': `Send email to ${profile.email}`,
                  },
                  profile.email
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'contact-method-row' },
              React.createElement('div', { className: 'contact-icon-bubble' }, 'in'),
              React.createElement(
                'div',
                { className: 'contact-info-col' },
                React.createElement('span', { className: 'contact-info-label' }, 'LinkedIn'),
                React.createElement(
                  'a',
                  {
                    href: profile.linkedInUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'contact-info-link',
                    'aria-label': 'View LinkedIn profile (opens in new tab)',
                  },
                  'linkedin.com/in/ritulsawant ↗'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'contact-method-row' },
              React.createElement('div', { className: 'contact-icon-bubble' }, 'loc'),
              React.createElement(
                'div',
                { className: 'contact-info-col' },
                React.createElement('span', { className: 'contact-info-label' }, 'Location'),
                React.createElement('span', { style: { fontSize: '0.95rem', color: 'var(--text-primary)' } }, profile.location)
              )
            )
          )
        )
      )
    )
  );
}

function Footer({ profile, onNavigateHome }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  return React.createElement(
    'footer',
    { className: 'site-footer-editorial', role: 'contentinfo' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        { style: { paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-line)' } },
        React.createElement(
          'p',
          { style: { fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: '720px', margin: 0 } },
          profile.disclaimer
        )
      ),
      React.createElement(
        'div',
        { className: 'footer-content' },
        React.createElement(
          'div',
          null,
          React.createElement('strong', { style: { color: 'var(--text-primary)', marginRight: '12px' } }, profile.name),
          React.createElement('span', null, `© ${new Date().getFullYear()} · Stirling, Scotland, UK`)
        ),
        React.createElement(
          'nav',
          { 'aria-label': 'Footer Navigation' },
          React.createElement(
            'ul',
            { className: 'footer-nav' },
            navItems.map((item) =>
              React.createElement(
                'li',
                { key: item.id },
                React.createElement(
                  'a',
                  {
                    href: `#${item.id}`,
                    onClick: (e) => {
                      e.preventDefault();
                      onNavigateHome(item.id);
                    },
                  },
                  item.label
                )
              )
            )
          )
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'btn-editorial btn-outline-dark',
            style: { padding: '6px 12px', fontSize: '0.75rem' },
            onClick: scrollToTop,
            'aria-label': 'Scroll back to top of page',
          },
          'Top ↑'
        )
      )
    )
  );
}

// --- 4. Main App Container ---
function App() {
  const [currentHash, setCurrentHash] = React.useState(window.location.hash || '#/');
  const [activeSlug, setActiveSlug] = React.useState(null);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentHash(hash);

      if (hash.startsWith('#/case-study/') || hash.startsWith('#/project/')) {
        const slug = hash.replace(/^#\/(case-study|project)\//, '').trim();
        const found = portfolioData.projects.find(
          (p) => p.slug === slug || (slug === 'partnership-lab' && p.slug === 'standard-life-moneyhub')
        );
        if (found) {
          setActiveSlug(found.slug);
          window.scrollTo(0, 0);
          return;
        }
      }

      setActiveSlug(null);

      const sectionMatch = hash.replace(/^#\/?/, '');
      if (sectionMatch && !sectionMatch.startsWith('case-study/') && !sectionMatch.startsWith('project/')) {
        const el = document.getElementById(sectionMatch);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateHome = (sectionId) => {
    setActiveSlug(null);
    if (sectionId) {
      window.location.hash = `#${sectionId}`;
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.hash = '#/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProject = (slug) => {
    window.location.hash = `#/case-study/${slug}`;
  };

  const activeProject = portfolioData.projects.find((p) => p.slug === activeSlug);
  const featuredProject = portfolioData.projects.find((p) => p.featured) || portfolioData.projects[0];

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header, {
      profile: portfolioData.profile,
      currentHash: currentHash,
      onNavigateHome: handleNavigateHome,
    }),
    activeProject
      ? React.createElement(ProjectDetail, {
          project: activeProject,
          onBack: () => handleNavigateHome('work'),
        })
      : React.createElement(
          'main',
          { id: 'main-content', role: 'main' },
          React.createElement(Hero, {
            profile: portfolioData.profile,
            featuredProject: featuredProject,
            onNavigateSection: handleNavigateHome,
            onSelectProject: handleSelectProject,
          }),
          React.createElement(Projects, {
            projects: portfolioData.projects,
            onSelectProject: handleSelectProject,
          }),
          React.createElement(About, {
            profile: portfolioData.profile,
          }),
          React.createElement(Experience, {
            experience: portfolioData.experience,
            education: portfolioData.education,
            certificates: portfolioData.certificates,
          }),
          React.createElement(Skills, {
            skills: portfolioData.skills,
          }),
          React.createElement(Contact, {
            profile: portfolioData.profile,
          })
        ),
    React.createElement(Footer, {
      profile: portfolioData.profile,
      onNavigateHome: handleNavigateHome,
    })
  );
}

// Mount runtime
rootElement = document.getElementById('root');
rootComponentFn = App;
if (rootElement) {
  scheduleRender();
}
