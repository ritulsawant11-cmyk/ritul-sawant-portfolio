/**
 * PensionQuest - Playable Web-Game Prototype Runtime
 * Independent UK Workplace Pension Administration Educational Game
 * Zero-dependency standalone browser runtime.
 */

// --- 1. React Mini-Runtime with SVG support ---
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
        children: children.flat(Infinity).filter(c => c !== null && c !== undefined && c !== false),
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

const SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
  'ellipse', 'text', 'g', 'defs', 'clipPath', 'mask'
]);

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
  const domNode = renderVNode(vdom, false);
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

function renderVNode(vnode, isSvgContext) {
  if (vnode === null || vnode === undefined || vnode === false) {
    return document.createTextNode('');
  }
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach(child => {
      const childNode = renderVNode(child, isSvgContext);
      if (childNode) fragment.appendChild(childNode);
    });
    return fragment;
  }

  if (vnode.type === 'Fragment') {
    const fragment = document.createDocumentFragment();
    (vnode.props.children || []).forEach(child => {
      const childNode = renderVNode(child, isSvgContext);
      if (childNode) fragment.appendChild(childNode);
    });
    return fragment;
  }

  if (typeof vnode.type === 'function') {
    const childVNode = vnode.type(vnode.props);
    return renderVNode(childVNode, isSvgContext);
  }

  if (!vnode.type || typeof vnode.type !== 'string') {
    return document.createTextNode('');
  }

  const isSvg = isSvgContext || SVG_TAGS.has(vnode.type.toLowerCase());
  const el = isSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.type)
    : document.createElement(vnode.type);

  const props = vnode.props || {};

  Object.keys(props).forEach(key => {
    if (key === 'children') return;

    if (key.startsWith('on') && typeof props[key] === 'function') {
      const eventName = key.substring(2).toLowerCase();
      el.addEventListener(eventName, props[key]);
    } else if (key === 'className') {
      if (isSvg) {
        el.setAttribute('class', props[key]);
      } else {
        el.className = props[key];
      }
    } else if (key === 'style' && typeof props[key] === 'object') {
      Object.assign(el.style, props[key]);
    } else if (key === 'htmlFor') {
      el.setAttribute('for', props[key]);
    } else if (key === 'disabled') {
      el.disabled = Boolean(props[key]);
      if (props[key]) {
        el.setAttribute('disabled', '');
      } else {
        el.removeAttribute('disabled');
      }
    } else if (key === 'checked') {
      el.checked = Boolean(props[key]);
      if (props[key]) {
        el.setAttribute('checked', '');
      } else {
        el.removeAttribute('checked');
      }
    } else if (key === 'value') {
      el.value = props[key];
    } else if (key === 'autoFocus') {
      if (props[key]) {
        setTimeout(() => {
          if (el && typeof el.focus === 'function') el.focus();
        }, 10);
      }
    } else {
      const attrName = isSvg ? mapSvgAttr(key) : key;
      if (props[key] !== null && props[key] !== undefined && props[key] !== false) {
        el.setAttribute(attrName, String(props[key]));
      } else if (props[key] === false && key.startsWith('aria-')) {
        el.setAttribute(attrName, 'false');
      } else {
        el.removeAttribute(attrName);
      }
    }
  });

  (props.children || []).forEach(child => {
    const childNode = renderVNode(child, isSvg);
    if (childNode) el.appendChild(childNode);
  });

  return el;
}

function mapSvgAttr(attr) {
  const map = {
    strokeWidth: 'stroke-width',
    strokeLinecap: 'stroke-linecap',
    strokeLinejoin: 'stroke-linejoin',
    strokeDasharray: 'stroke-dasharray',
    fillOpacity: 'fill-opacity',
    strokeOpacity: 'stroke-opacity'
  };
  return map[attr] || attr;
}

const h = React.createElement;

// --- 2. Storage Helpers ---

const STORAGE_KEYS = {
  COMPLETED: 'pensionquest_completed_v1',
  JOURNAL: 'pensionquest_journal_v1'
};

function safeGetStorage(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item);
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('localStorage read error:', e);
    }
  }
  return fallback;
}

function safeSetStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('localStorage write error:', e);
    }
  }
}

function safeRemoveStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('localStorage remove error:', e);
    }
  }
}

// --- 3. Educational Game Data ---

const CHAPTERS_DATA = [
  {
    id: 'ch1',
    number: 1,
    title: 'Alex changes jobs',
    subtitle: 'Leaving an employer and defined contribution pensions',
    status: 'available',
    isPlayable: true,
    topic: 'Job Changes & DC Pensions',
    summary:
      'Help Alex understand what happens to their workplace Defined Contribution pension pot after moving on to a new opportunity.',
    storyIntro: [
      'Alex has worked at Apex Retail for nearly four years and has just accepted an exciting new job offer across town.',
      'During their employment, Alex was enrolled in a defined contribution (DC) workplace pension, where both Alex and the company contributed each payday.',
      'As Alex packs up their desk on the final afternoon, an automated leaver notification email arrives from the HR department.'
    ],
    keyFacts: [
      'Alex was enrolled in a Defined Contribution (DC) workplace pension.',
      'Both Alex and the previous employer contributed regularly from pay.',
      'The pension pot is managed by an independent scheme provider (Horizon Pension Trustees, fictional) on Alex’s behalf.'
    ],
    document: {
      title: 'Leaver Pension Enrolment Summary',
      issuer: 'Apex Retail Operations — People & Pensions Team (Fictional Scheme)',
      recipient: 'Alex Morgan (Employee ID: APX-4921)',
      date: '30 September 2024',
      referenceNumber: 'HOR-DC-849201-A (Fictional Record)',
      summary:
        'Official departure notification regarding status of workplace pension contributions and scheme administration.',
      keyDetails: [
        { label: 'Scheme Type', value: 'Defined Contribution (Group Personal Pension)' },
        { label: 'Leaving Date', value: '30 September 2024' },
        { label: 'Payroll Deductions', value: 'Stopped with final salary' },
        { label: 'Employer Contributions', value: 'Stopped with final salary' },
        { label: 'Pension Administrator', value: 'Horizon Pension Trustees Ltd (Fictional Provider)' },
        { label: 'Status of Accumulated Pot', value: 'Preserved under member’s ownership' }
      ],
      importantNotice:
        'Fictional document for educational purposes only. Your pension pot remains held by the independent provider and is not retained by Apex Retail.'
    },
    questionPrompt: 'Does leaving the job mean Alex loses that pension?',
    choices: [
      {
        id: 'A',
        label: 'A',
        text: 'Yes, the previous employer now owns it.',
        isCorrect: false,
        shortFeedback:
          'Your former employer does not keep or reclaim your defined contribution pot. Every penny contributed by you, employer contributions, and tax relief belongs to you.'
      },
      {
        id: 'B',
        label: 'B',
        text: 'No, it remains Alex’s pension.',
        isCorrect: true,
        shortFeedback:
          'Leaving a job does not mean losing your workplace pension. Contributions from that job normally stop, but the existing provider generally continues managing the pension. It does not automatically move to the new employer’s scheme.'
      },
      {
        id: 'C',
        label: 'C',
        text: 'No, because it automatically moves to the new employer.',
        isCorrect: false,
        shortFeedback:
          'Workplace pensions in the UK do not automatically follow you or transfer themselves to your next employer. It stays where it is unless you actively arrange a transfer.'
      }
    ],
    correctChoiceId: 'B',
    primaryFeedback:
      'Leaving a job does not mean losing your workplace pension. Contributions from that job normally stop, but the existing provider generally continues managing the pension. It does not automatically move to the new employer’s scheme.',
    schemeDependenceNote:
      'What depends on the provider: Ongoing annual management fees continue to apply to your invested pot. Investment options and online access features depend on your provider’s specific rules.',
    nextStepsAdvice:
      'What Alex should do next: Check that personal contact details are up to date with the provider, make a note of the scheme policy number, and set up online member access.',
    enquiryTask: {
      prompt: 'Prepare Alex’s enquiry to the pension provider',
      scenario:
        'Alex decides to contact Horizon Pension Trustees (the provider) after leaving the job. Select the useful questions Alex should ask to keep their records in order.',
      options: [
        {
          id: 'enq-address',
          question: 'Can you verify my personal contact address and email address on file?',
          isUseful: true,
          category: 'address',
          whyItHelps:
            'Crucial practical step: When leaving a job, people often change home or lose access to workplace email. Keeping contact details current ensures annual statements and retirement notices reach you.',
          practicalContext: 'Prevents pensions from becoming “lost pots” over time.'
        },
        {
          id: 'enq-charges',
          question: 'What ongoing annual management charges (AMC) apply to my pot now that contributions have stopped?',
          isUseful: true,
          category: 'charges',
          whyItHelps:
            'Important financial awareness: Providers continue charging annual management fees for running the investments even when you are no longer making active contributions.',
          practicalContext: 'Helps you understand ongoing costs and fund choices.'
        },
        {
          id: 'enq-online',
          question: 'How do I register for online member portal access to view annual statements and update my expression of wish (beneficiary) form?',
          isUseful: true,
          category: 'online_portal',
          whyItHelps:
            'Empowers self-management: Online portal access lets Alex track fund performance, download annual statements, and ensure nominated beneficiaries are current.',
          practicalContext: 'Makes tracking multiple pension pots much simpler.'
        },
        {
          id: 'enq-cash',
          question: 'Can you pay out my entire pension pot as cash directly into my bank account next week?',
          isUseful: false,
          category: 'cash_withdrawal',
          whyItHelps:
            'Inappropriate request under UK rules: Workplace pensions are for retirement and cannot normally be taken as cash before age 55 (rising to 57 in April 2028). Attempting early withdrawals usually triggers heavy 55%+ tax charges or points to unauthorized scams.',
          practicalContext: 'Early cash release is generally illegal under UK pension law except in severe ill health.'
        },
        {
          id: 'enq-guarantee',
          question: 'Can you guarantee that my pension investments will not fluctuate or drop in value over the next 10 years?',
          isUseful: false,
          category: 'investment_guarantee',
          whyItHelps:
            'Unrealistic request for DC schemes: Defined contribution pots are invested in market funds (equities, bonds, multi-asset funds). Values rise and fall with markets; standard workplace schemes do not offer guaranteed returns.',
          practicalContext: 'DC pension pots reflect market performance and investment risk.'
        }
      ]
    },
    keyTakeaway:
      'Your Defined Contribution pension pot remains yours when you leave an employer. It stays invested with the original provider unless you actively transfer it.',
    journalEntry: {
      title: 'Chapter 1: Job Changes & Defined Contribution Ownership',
      keyTakeaway:
        'Leaving an employer does not mean losing your workplace pension pot. It remains yours and continues to be managed by the existing provider.',
      misconceptionClarified:
        'Common Misconception: Many people worry their ex-employer keeps their pension, or assume it automatically transfers to their new job. In reality, ownership stays with you, and it stays with the original provider until you decide otherwise.',
      whatAlexLearned: [
        'Ownership stays with you: All employee and employer contributions, plus tax relief, remain in your pot.',
        'Contributions stop: Regular deductions and employer top-ups end with your final payslip.',
        'No automatic transfer: The pot does not magically follow you to your next job; each workplace creates its own scheme unless combined.',
        'Provider still manages it: The provider continues to hold and invest the pot under its standard annual charges.'
      ],
      usefulQuestionsToAsk: [
        '“Can you confirm my personal postal and email address on file?”',
        '“What annual management charge (AMC) applies while I am not contributing?”',
        '“How do I access my online portal to check annual statements and nomination of beneficiaries?”'
      ],
      practicalTip:
        'Create a dedicated folder for your pension reference numbers. Whenever you move home or change your personal email, update all your former pension providers promptly.'
    },
    moneyHelper: {
      title: 'MoneyHelper: Changing jobs and your pension',
      topic: 'UK Workplace Pension Guidance',
      description:
        'Free, impartial guidance backed by HM Government on what happens to workplace pension pots when moving employers.',
      url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/changing-jobs-and-your-pension',
      verifiedSource: 'Money and Pensions Service (MaPS) / HM Government',
      reviewDate: 'Guidance verified against public UK pension standards (October 2024 / current legislation)'
    }
  },
  {
    id: 'ch2',
    number: 2,
    title: 'New job, new scheme',
    subtitle: 'Auto-enrolment rules, opt-out periods, and minimum contributions',
    status: 'locked',
    isPlayable: false,
    comingSoonLabel: 'Coming later',
    topic: 'Automatic Enrolment',
    summary:
      'Learn how automatic enrolment works when joining a new UK employer, including eligibility criteria, opt-out rights, and employer matching.',
    storyIntro: [],
    keyFacts: [],
    questionPrompt: '',
    choices: [],
    correctChoiceId: 'B',
    primaryFeedback: '',
    schemeDependenceNote: '',
    nextStepsAdvice: '',
    keyTakeaway: '',
    journalEntry: {
      title: 'Chapter 2: New job, new scheme',
      keyTakeaway: 'Coming in a future update.',
      misconceptionClarified: 'Coming soon.',
      whatAlexLearned: [],
      usefulQuestionsToAsk: [],
      practicalTip: ''
    },
    moneyHelper: {
      title: 'MoneyHelper: Automatic enrolment explained',
      topic: 'Workplace Pensions',
      description: 'Understanding automatic enrolment criteria and employee rights.',
      url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment',
      verifiedSource: 'Money and Pensions Service (MaPS)',
      reviewDate: 'October 2024'
    }
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Tracking old pots',
    subtitle: 'Using the Pension Tracing Service and tracing lost paperwork',
    status: 'locked',
    isPlayable: false,
    comingSoonLabel: 'Coming later',
    topic: 'Pension Tracing Service',
    summary:
      'Discover how the government Pension Tracing Service helps locate former schemes when contact details or paperwork have been misplaced.',
    storyIntro: [],
    keyFacts: [],
    questionPrompt: '',
    choices: [],
    correctChoiceId: 'B',
    primaryFeedback: '',
    schemeDependenceNote: '',
    nextStepsAdvice: '',
    keyTakeaway: '',
    journalEntry: {
      title: 'Chapter 3: Tracking old pots',
      keyTakeaway: 'Coming in a future update.',
      misconceptionClarified: 'Coming soon.',
      whatAlexLearned: [],
      usefulQuestionsToAsk: [],
      practicalTip: ''
    },
    moneyHelper: {
      title: 'GOV.UK: Find pension contact details',
      topic: 'Pension Tracing Service',
      description: 'Free public service to trace contact information for previous employers and providers.',
      url: 'https://www.gov.uk/find-pension-contact-details',
      verifiedSource: 'Department for Work and Pensions (DWP) / GOV.UK',
      reviewDate: 'October 2024'
    }
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Statements & contact details',
    subtitle: 'Understanding annual pension statements and avoiding lost pots',
    status: 'locked',
    isPlayable: false,
    comingSoonLabel: 'Coming later',
    topic: 'Annual Statements',
    summary:
      'Learn how to read an annual benefit statement, check projections, and understand the difference between active and deferred member records.',
    storyIntro: [],
    keyFacts: [],
    questionPrompt: '',
    choices: [],
    correctChoiceId: 'B',
    primaryFeedback: '',
    schemeDependenceNote: '',
    nextStepsAdvice: '',
    keyTakeaway: '',
    journalEntry: {
      title: 'Chapter 4: Statements & contact details',
      keyTakeaway: 'Coming in a future update.',
      misconceptionClarified: 'Coming soon.',
      whatAlexLearned: [],
      usefulQuestionsToAsk: [],
      practicalTip: ''
    },
    moneyHelper: {
      title: 'MoneyHelper: Understanding your annual pension statement',
      topic: 'Pension Records',
      description: 'Impartial guide to reading defined contribution annual summaries.',
      url: 'https://www.moneyhelper.org.uk',
      verifiedSource: 'Money and Pensions Service (MaPS)',
      reviewDate: 'October 2024'
    }
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Checking your options',
    subtitle: 'Keeping pots separate vs consolidation facts and transfer safeguards',
    status: 'locked',
    isPlayable: false,
    comingSoonLabel: 'Coming later',
    topic: 'Pension Transfer Facts',
    summary:
      'Impartial facts comparing keeping multiple pots versus combining them, including exit fees, safeguarded benefits, and avoiding transfer scams.',
    storyIntro: [],
    keyFacts: [],
    questionPrompt: '',
    choices: [],
    correctChoiceId: 'B',
    primaryFeedback: '',
    schemeDependenceNote: '',
    nextStepsAdvice: '',
    keyTakeaway: '',
    journalEntry: {
      title: 'Chapter 5: Checking your options',
      keyTakeaway: 'Coming in a future update.',
      misconceptionClarified: 'Coming soon.',
      whatAlexLearned: [],
      usefulQuestionsToAsk: [],
      practicalTip: ''
    },
    moneyHelper: {
      title: 'MoneyHelper: Transferring your defined contribution pension',
      topic: 'Transfer Considerations',
      description: 'Impartial considerations before combining or transferring pensions.',
      url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/transferring-your-defined-contribution-pension',
      verifiedSource: 'Money and Pensions Service (MaPS)',
      reviewDate: 'October 2024'
    }
  }
];

// --- 4. UI Components ---

// Friendly Fictional Avatar Alex (SVG Shapes with storybook palette)
function Avatar({ mood = 'neutral', size = 120, className = '', caption = 'Alex' }) {
  return h('div', {
    className: `avatar-wrapper ${className}`,
    style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' },
    'aria-label': `Alex, friendly pension learner avatar (${mood})`
  }, [
    h('svg', {
      width: size,
      height: size,
      viewBox: '0 0 160 160',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-hidden': 'true',
      style: { overflow: 'visible' }
    }, [
      // Soft warm background disk
      h('circle', { cx: '80', cy: '80', r: '72', fill: '#F2EFE8', stroke: '#E5DFD3', strokeWidth: '3.5' }),
      // Gold dashed accent ring
      h('circle', { cx: '80', cy: '80', r: '77', fill: 'none', stroke: '#F2BD57', strokeWidth: '2.5', strokeDasharray: '6 6' }),
      // Torso / Teal knit sweater (#087F8C)
      h('path', { d: 'M32 152 C32 120, 52 110, 80 110 C108 110, 128 120, 128 152 Z', fill: '#087F8C' }),
      // Sweater collar
      h('path', { d: 'M68 110 Q80 122 92 110', stroke: '#F8F6F1', strokeWidth: '4', fill: 'none', strokeLinecap: 'round' }),
      // Neck
      h('rect', { x: '73', y: '90', width: '14', height: '24', rx: '6', fill: '#FBD5B5' }),
      // Face
      h('ellipse', { cx: '80', cy: '74', rx: '36', ry: '40', fill: '#FCD9B8' }),
      // Cheeks
      h('ellipse', { cx: '58', cy: '82', rx: '7', ry: '4', fill: '#F8B4A6', fillOpacity: '0.6' }),
      // Hair
      h('path', {
        d: 'M44 68 C44 42, 60 30, 80 30 C100 30, 116 42, 116 68 C116 72, 112 60, 104 54 C94 48, 66 48, 56 54 C48 60, 44 72, 44 68 Z',
        fill: '#4A3428'
      }),
      // Hair tufts
      h('path', { d: 'M44 64 C42 70, 44 78, 48 80', stroke: '#4A3428', strokeWidth: '4', strokeLinecap: 'round' }),
      h('path', { d: 'M116 64 C118 70, 116 78, 112 80', stroke: '#4A3428', strokeWidth: '4', strokeLinecap: 'round' }),
      // Spectacles
      h('rect', { x: '53', y: '64', width: '22', height: '16', rx: '5', fill: '#FFFFFF', fillOpacity: '0.4', stroke: '#17253F', strokeWidth: '2.8' }),
      h('rect', { x: '85', y: '64', width: '22', height: '16', rx: '5', fill: '#FFFFFF', fillOpacity: '0.4', stroke: '#17253F', strokeWidth: '2.8' }),
      h('line', { x1: '75', y1: '71', x2: '85', y2: '71', stroke: '#17253F', strokeWidth: '2.8' }),
      // Eyes based on mood
      ...(mood === 'thinking' ? [
        h('circle', { cx: '64', cy: '70', r: '3', fill: '#17253F' }),
        h('circle', { cx: '96', cy: '70', r: '3', fill: '#17253F' }),
        h('circle', { cx: '65', cy: '69', r: '1', fill: '#FFFFFF' }),
        h('circle', { cx: '97', cy: '69', r: '1', fill: '#FFFFFF' }),
        h('path', { d: 'M57 59 Q64 58 71 61', stroke: '#4A3428', strokeWidth: '2.2', strokeLinecap: 'round', fill: 'none' }),
        h('path', { d: 'M89 60 Q96 55 103 57', stroke: '#4A3428', strokeWidth: '2.2', strokeLinecap: 'round', fill: 'none' }),
        h('path', { d: 'M74 95 Q80 94 86 96', stroke: '#8E4233', strokeWidth: '2.5', strokeLinecap: 'round', fill: 'none' })
      ] : mood === 'celebrating' ? [
        h('path', { d: 'M60 72 Q64 67 68 72', stroke: '#17253F', strokeWidth: '2.5', fill: 'none', strokeLinecap: 'round' }),
        h('path', { d: 'M92 72 Q96 67 100 72', stroke: '#17253F', strokeWidth: '2.5', fill: 'none', strokeLinecap: 'round' }),
        h('path', { d: 'M57 60 Q64 57 71 60', stroke: '#4A3428', strokeWidth: '2.2', strokeLinecap: 'round', fill: 'none' }),
        h('path', { d: 'M89 60 Q96 57 103 60', stroke: '#4A3428', strokeWidth: '2.2', strokeLinecap: 'round', fill: 'none' }),
        h('path', { d: 'M71 93 Q80 102 89 93', stroke: '#8E4233', strokeWidth: '2.5', strokeLinecap: 'round', fill: '#8E4233' })
      ] : [
        h('circle', { cx: '64', cy: '72', r: '3', fill: '#17253F' }),
        h('circle', { cx: '96', cy: '72', r: '3', fill: '#17253F' }),
        h('circle', { cx: '65', cy: '71', r: '1', fill: '#FFFFFF' }),
        h('circle', { cx: '97', cy: '71', r: '1', fill: '#FFFFFF' }),
        h('path', { d: 'M57 60 Q64 57 71 60', stroke: '#4A3428', strokeWidth: '2.2', strokeLinecap: 'round', fill: 'none' }),
        h('path', { d: 'M89 60 Q96 57 103 60', stroke: '#4A3428', strokeWidth: '2.2', strokeLinecap: 'round', fill: 'none' }),
        h('path', { d: 'M73 94 Q80 99 87 94', stroke: '#8E4233', strokeWidth: '2.5', strokeLinecap: 'round', fill: 'none' })
      ]),
      h('path', { d: 'M78 77 Q81 81 78 84', stroke: '#DCA27C', strokeWidth: '2.2', fill: 'none', strokeLinecap: 'round' })
    ]),
    caption ? h('span', {
      style: {
        fontSize: '0.8rem',
        fontWeight: 700,
        backgroundColor: 'var(--gold-surface)',
        border: '1px solid var(--gold-border)',
        color: 'var(--gold-text)',
        padding: '0.15rem 0.55rem',
        borderRadius: 'var(--radius-full)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem'
      }
    }, [
      h('span', { style: { display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--teal-primary)' } }),
      caption
    ]) : null
  ]);
}

// Tasteful Illustrated Scene for Hero Right Column
function HeroSceneIllustration() {
  return h('div', { className: 'hero-scene-wrapper', 'aria-label': 'Illustrated scene of Alex and workplace pension decision' }, [
    h('div', { className: 'hero-scene-card' }, [
      // Speech Bubble
      h('div', { className: 'scene-floating-bubble', role: 'region', 'aria-label': 'Alex question' }, [
        h('span', { style: { color: 'var(--teal-primary)', marginRight: '0.4rem', fontSize: '1.1rem' } }, '💬'),
        '“Do I lose my pension when I leave?”'
      ]),

      // Center Visual Row: Alex + Dotted Connector + Job Offer Letter
      h('div', { className: 'scene-center-row' }, [
        // Consistent Alex Avatar
        h('div', { style: { position: 'relative', zIndex: 2 } }, [
          h(Avatar, { mood: 'thinking', size: 96, caption: 'Alex' })
        ]),

        // Decorative Curved Dotted Path
        h('svg', {
          width: '84',
          height: '60',
          viewBox: '0 0 84 60',
          fill: 'none',
          'aria-hidden': 'true',
          style: { flexShrink: 0 }
        }, [
          h('path', {
            d: 'M 10 46 C 30 10, 54 50, 74 16',
            stroke: '#F2BD57',
            strokeWidth: '2.5',
            strokeDasharray: '4 4',
            strokeLinecap: 'round'
          }),
          h('circle', { cx: '10', cy: '46', r: '4', fill: '#087F8C' }),
          h('circle', { cx: '74', cy: '16', r: '4', fill: '#F2BD57' })
        ]),

        // Job Offer Letter Graphic
        h('div', {
          style: {
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 0.85rem',
            boxShadow: 'var(--shadow-sm)',
            width: '132px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2
          }
        }, [
          h('div', {
            style: {
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--gold-surface)',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold-text)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.3rem auto'
            }
          }, '★'),
          h('div', { style: { fontSize: '0.785rem', fontWeight: 800, color: 'var(--text-navy-headings)' } }, 'New Job Offer'),
          h('div', { style: { fontSize: '0.7rem', color: 'var(--text-navy-muted)', marginTop: '0.15rem' } }, 'Starting Next Month')
        ])
      ]),

      // Floating card labelled "Your old workplace pension"
      h('div', {
        className: 'scene-floating-pension-card'
      }, [
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' } }, [
          h('span', { className: 'scene-card-label' }, 'Your old workplace pension'),
          h('span', {
            style: {
              fontSize: '0.7rem',
              backgroundColor: 'var(--teal-surface)',
              color: 'var(--teal-text)',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700
            }
          }, 'Defined Contribution')
        ]),
        h('div', { className: 'scene-card-title' }, 'Apex Retail Pension Pot'),
        h('div', { className: 'scene-card-sub' }, 'Pot stays held and invested by existing scheme provider')
      ])
    ])
  ]);
}

// Chapter Progress Stepper
function ChapterProgress({ currentScreen, chapterNumber }) {
  const steps = [
    { key: 'story', label: '1. Situation' },
    { key: 'document', label: '2. Document' },
    { key: 'question', label: '3. Decision' },
    { key: 'feedback', label: '4. Reasoning' },
    { key: 'enquiry', label: '5. Enquiry Task' },
    { key: 'completion', label: '6. Takeaway' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentScreen);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return h('nav', { className: 'chapter-stepper', 'aria-label': 'Chapter progress steps' }, [
    h('div', { className: 'stepper-label' }, `Chapter ${chapterNumber} Journey`),
    h('div', { className: 'stepper-steps' },
      steps.map((step, idx) => {
        const isActive = idx === activeIndex;
        const isDone = idx < activeIndex;

        return h('span', {
          key: step.key,
          className: `stepper-step ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`,
          'aria-current': isActive ? 'step' : undefined
        }, [
          isDone ? h('svg', { width: '12', height: '12', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '20 6 9 17 4 12' })
          ]) : null,
          step.label
        ]);
      })
    )
  ]);
}

// Top Navbar
function Navbar({ currentScreen, onNavigate, unlockedJournalCount, onOpenDisclaimer, onOpenRestartModal, hasSavedProgress, onStartStory }) {
  return h('header', { className: 'navbar', role: 'banner' }, [
    h('div', { className: 'navbar-inner' }, [
      h('button', {
        className: 'brand-group',
        onClick: () => onNavigate('welcome'),
        'aria-label': 'PensionQuest Home'
      }, [
        h('div', { className: 'brand-icon', 'aria-hidden': 'true' }, [
          h('svg', { width: '22', height: '22', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.4', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
            h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
            h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' })
          ])
        ]),
        h('div', null, [
          h('span', { className: 'brand-title' }, 'PensionQuest'),
          h('span', { className: 'brand-badge' }, 'An interactive pension story')
        ])
      ]),

      h('nav', { className: 'nav-actions', 'aria-label': 'Main Navigation' }, [
        h('button', {
          type: 'button',
          className: `btn btn-sm ${currentScreen === 'welcome' ? 'btn-teal' : 'btn-ghost'}`,
          onClick: () => onNavigate('welcome'),
          'aria-current': currentScreen === 'welcome' ? 'page' : undefined
        }, [
          h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
            h('polyline', { points: '9 22 9 12 15 12 15 22' })
          ]),
          'Home & Map'
        ]),

        h('button', {
          type: 'button',
          className: `btn btn-sm ${currentScreen === 'journal' ? 'btn-teal' : 'btn-ghost'}`,
          onClick: () => onNavigate('journal'),
          'aria-current': currentScreen === 'journal' ? 'page' : undefined
        }, [
          h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
            h('polyline', { points: '14 2 14 8 20 8' }),
            h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
            h('line', { x1: '16', y1: '17', x2: '8', y2: '17' })
          ]),
          'Learning Journal',
          unlockedJournalCount > 0 ? h('span', {
            style: {
              backgroundColor: 'var(--gold-badge)',
              color: 'var(--gold-text)',
              borderRadius: 'var(--radius-full)',
              padding: '0.1rem 0.45rem',
              fontSize: '0.75rem',
              fontWeight: 800
            },
            'aria-label': `${unlockedJournalCount} journal entry unlocked`
          }, String(unlockedJournalCount)) : null
        ]),

        h('button', {
          type: 'button',
          className: 'btn btn-sm btn-ghost',
          onClick: onOpenDisclaimer,
          title: 'Read about PensionQuest, safeguards, and disclaimers',
          'aria-label': 'About & safeguards'
        }, [
          h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('circle', { cx: '12', cy: '12', r: '10' }),
            h('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
            h('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
          ]),
          'About & safeguards'
        ]),

        currentScreen === 'welcome' || currentScreen === 'journal' ? h('button', {
          type: 'button',
          className: 'btn btn-sm btn-teal',
          onClick: () => onStartStory('ch1'),
          'aria-label': hasSavedProgress ? 'Continue your story' : 'Start Alex’s story'
        }, [
          hasSavedProgress ? 'Continue story →' : 'Start story →'
        ]) : null,

        h('button', {
          type: 'button',
          className: 'btn btn-sm btn-secondary',
          onClick: onOpenRestartModal,
          title: 'Reset progress and start over',
          'aria-label': 'Restart progress'
        }, [
          h('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '1 4 1 10 7 10' }),
            h('path', { d: 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10' })
          ]),
          'Restart'
        ])
      ])
    ])
  ]);
}

// 2. Chapter Journey Map Component (Requirement 2)
function ChapterJourneyMap({ chapters, completedChapterIds, onStartStory }) {
  const chapterIcons = {
    ch1: h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2', ry: '2' }),
      h('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
    ]),
    ch2: h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2' }),
      h('line', { x1: '9', y1: '22', x2: '9', y2: '22.01' }),
      h('line', { x1: '15', y1: '22', x2: '15', y2: '22.01' }),
      h('line', { x1: '9', y1: '6', x2: '9', y2: '6.01' }),
      h('line', { x1: '15', y1: '6', x2: '15', y2: '6.01' })
    ]),
    ch3: h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
      h('circle', { cx: '11', cy: '11', r: '3' })
    ]),
    ch4: h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
      h('polyline', { points: '22,6 12,13 2,6' })
    ]),
    ch5: h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('line', { x1: '12', y1: '3', x2: '12', y2: '21' }),
      h('polyline', { points: '3 7 12 5 21 7' }),
      h('path', { d: 'M6 13a3 3 0 0 0 6 0H6z' }),
      h('path', { d: 'M18 17a3 3 0 0 0 6 0h-6z' })
    ])
  };

  return h('section', { className: 'journey-map-section', id: 'journey-map', 'aria-labelledby': 'journey-map-heading' }, [
    h('div', { className: 'journey-header' }, [
      h('span', { className: 'card-header-tag tag-gold' }, 'Story Journey Map'),
      h('h2', { id: 'journey-map-heading', className: 'journey-map-title' }, 'Explore Alex’s Pension Journey'),
      h('p', { className: 'journey-map-subtitle' },
        'Follow Alex through critical UK workplace pension crossroads. Start with the complete, playable first chapter below.'
      )
    ]),

    h('div', { className: 'journey-map-grid' },
      chapters.map((chapter) => {
        const isCompleted = completedChapterIds.includes(chapter.id);
        const isPlayable = chapter.isPlayable;
        const icon = chapterIcons[chapter.id] || chapterIcons.ch1;

        return h('div', {
          key: chapter.id,
          className: `journey-node-card ${isPlayable ? 'available' : 'locked'} ${isCompleted ? 'completed' : ''}`,
          role: 'region',
          'aria-label': `Chapter ${chapter.number}: ${chapter.title}`
        }, [
          h('div', null, [
            h('div', { className: 'node-header' }, [
              h('div', { className: 'node-badge-group' }, [
                h('div', {
                  className: `node-milestone-circle ${isCompleted ? 'milestone-teal' : isPlayable ? 'milestone-gold' : 'milestone-neutral'}`
                }, [
                  isCompleted ? h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
                    h('polyline', { points: '20 6 9 17 4 12' })
                  ]) : String(chapter.number)
                ]),
                h('div', { className: 'node-icon-box', 'aria-hidden': 'true' }, icon)
              ]),

              // Distinguish state with text and icons
              isCompleted ? h('span', { className: 'card-header-tag tag-teal', style: { margin: 0 } }, [
                h('svg', { width: '12', height: '12', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' }, [
                  h('polyline', { points: '20 6 9 17 4 12' })
                ]),
                'Completed'
              ]) : isPlayable ? h('span', { className: 'card-header-tag tag-gold', style: { margin: 0 } }, [
                h('svg', { width: '12', height: '12', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' }, [
                  h('polygon', { points: '5 3 19 12 5 21 5 3' })
                ]),
                'Available'
              ]) : h('span', { className: 'card-header-tag tag-neutral', style: { margin: 0 } }, [
                h('svg', { width: '12', height: '12', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }, [
                  h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
                  h('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
                ]),
                'Coming later'
              ])
            ]),

            h('h3', { className: 'node-title' }, chapter.title),
            h('p', { className: 'node-summary' }, chapter.summary)
          ]),

          h('div', { className: 'node-footer' }, [
            isPlayable ? h('button', {
              type: 'button',
              className: 'btn btn-teal',
              onClick: () => onStartStory(chapter.id),
              style: { width: '100%' },
              'aria-label': isCompleted ? `Replay Chapter 1: ${chapter.title}` : `Play Chapter 1: ${chapter.title}`
            }, [
              isCompleted ? 'Replay Chapter 1 →' : 'Play Chapter 1 →'
            ]) : h('div', {
              className: 'node-locked-notice',
              'aria-label': `Chapter ${chapter.number} is planned and coming later`
            }, [
              h('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2' }, [
                h('circle', { cx: '12', cy: '12', r: '10' }),
                h('polyline', { points: '12 6 12 12 16 14' })
              ]),
              'Planned module · Not playable'
            ])
          ])
        ]);
      })
    )
  ]);
}

// 1. Redesigned Welcome Screen (Requirements 1, 2, 3)
function WelcomeScreen({ chapters, completedChapterIds, onStartStory, onOpenJournal, unlockedJournalCount, onOpenSafeguards }) {
  const workingChapter = chapters.find(c => c.isPlayable) || chapters[0];
  const hasSavedProgress = completedChapterIds.length > 0 || unlockedJournalCount > 0;

  const scrollToJourneyMap = () => {
    const el = document.getElementById('journey-map');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return h('div', { className: 'screen-container' }, [
    // Short Opening Notice
    h('div', { className: 'safeguard-banner', role: 'note', 'aria-label': 'Educational Notice' }, [
      h('div', { className: 'safeguard-banner-icon', 'aria-hidden': 'true' }, [
        h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
          h('circle', { cx: '12', cy: '12', r: '10' }),
          h('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
          h('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
        ])
      ]),
      h('div', null,
        'Independent educational prototype using fictional scenarios. Not financial advice or a pension account service.'
      )
    ]),

    // 1. Two-Column Desktop Hero Layout
    h('section', { className: 'hero-two-column', 'aria-labelledby': 'hero-heading' }, [
      // Left Column
      h('div', { className: 'hero-left' }, [
        h('span', { className: 'hero-label-tag' }, [
          h('span', { style: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--gold-accent)' } }),
          'An interactive pension story'
        ]),

        h('h1', { id: 'hero-heading', className: 'hero-headline' },
          'A new job. An old pension. What happens next?'
        ),

        h('p', { className: 'hero-description' },
          'Meet Alex. Help them navigate everyday workplace pension situations through short stories and choices. Help Alex explore workplace pension questions—one decision at a time.'
        ),

        h('div', { className: 'hero-cta-group' }, [
          h('button', {
            type: 'button',
            className: 'btn btn-teal btn-lg',
            onClick: () => onStartStory(workingChapter.id),
            autoFocus: true,
            'aria-label': hasSavedProgress ? 'Continue your story' : 'Start Alex’s story'
          }, [
            h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.4', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
              h('polygon', { points: '5 3 19 12 5 21 5 3' })
            ]),
            hasSavedProgress ? 'Continue your story →' : 'Start Alex’s story →'
          ]),

          h('button', {
            type: 'button',
            className: 'btn btn-secondary btn-lg',
            onClick: scrollToJourneyMap
          }, [
            'Explore the chapters'
          ])
        ]),

        h('div', { className: 'hero-supporting-line' }, [
          h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--teal-primary)', strokeWidth: '2.5', 'aria-hidden': 'true' }, [
            h('polyline', { points: '20 6 9 17 4 12' })
          ]),
          'Fictional scenarios · No timers · Retry freely'
        ])
      ]),

      // Right Column: Illustrated Scene
      h('div', { className: 'hero-right' }, [
        h(HeroSceneIllustration)
      ])
    ]),

    // 2. Compact Gameplay Preview
    h('section', { className: 'preview-section', 'aria-labelledby': 'preview-heading' }, [
      h('div', { className: 'preview-card', role: 'region', 'aria-label': 'Story preview' }, [
        h('div', { className: 'preview-quote-box' }, [
          h(Avatar, { mood: 'thinking', size: 84, caption: 'Alex' }),
          h('div', { style: { flex: 1 } }, [
            h('span', { className: 'card-header-tag tag-teal', style: { marginBottom: '0.35rem' } }, 'Chapter 1 Dilemma'),
            h('blockquote', { className: 'preview-speech-bubble', style: { margin: 0 } },
              '“I’m leaving my job. Does that mean I lose my pension?”'
            ),
            h('p', { style: { fontSize: '0.875rem', color: 'var(--text-navy-muted)', marginTop: '0.45rem' } },
              'Help Alex inspect leaver paperwork and find out what happens to their workplace pot.'
            )
          ])
        ]),

        h('button', {
          type: 'button',
          className: 'btn btn-teal-outline btn-lg',
          onClick: () => onStartStory(workingChapter.id),
          'aria-label': 'Explore Chapter 1: Alex changes jobs'
        }, [
          'Explore this chapter →'
        ])
      ])
    ]),

    // 3. Chapter Journey Map
    h(ChapterJourneyMap, {
      chapters,
      completedChapterIds,
      onStartStory
    }),

    // Disclaimers Link
    h('div', { style: { textAlign: 'center', marginTop: '3rem' } }, [
      h('button', {
        type: 'button',
        className: 'btn btn-ghost btn-sm',
        onClick: onOpenSafeguards,
        style: { textDecoration: 'underline' }
      }, 'Read full educational disclaimers & non-affiliation details')
    ])
  ]);
}

// 2. Story Screen (Step 1: Situation)
function StoryScreen({ chapter, onProceedToDocument, onBackToHome }) {
  return h('div', { className: 'screen-container' }, [
    h(ChapterProgress, { currentScreen: 'story', chapterNumber: chapter.number }),

    h('div', { style: { marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
      h('button', {
        type: 'button',
        className: 'btn btn-sm btn-ghost',
        onClick: onBackToHome
      }, [
        h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
          h('line', { x1: '19', y1: '12', x2: '5', y2: '12' }),
          h('polyline', { points: '12 19 5 12 12 5' })
        ]),
        'Back to Home'
      ]),
      h('span', { className: 'card-header-tag tag-lavender', style: { margin: 0 } },
        'Step 1: The Situation'
      )
    ]),

    h('div', { className: 'card', style: { marginBottom: '1.5rem' } }, [
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' } }, [
        h(Avatar, { mood: 'thinking', size: 120, caption: 'Alex — Contemplating the move' }),
        h('h1', { className: 'screen-title', style: { marginTop: '1rem', marginBottom: '0.35rem' } }, chapter.title),
        h('p', { className: 'screen-subtitle' }, chapter.subtitle)
      ]),

      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.05rem', color: 'var(--text-navy-body)', lineHeight: '1.65' } },
        chapter.storyIntro.map((paragraph, idx) => h('p', { key: idx }, paragraph))
      ),

      h('div', {
        style: {
          backgroundColor: 'var(--amber-surface)',
          border: '1.5px solid var(--amber-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginTop: '1.5rem'
        },
        role: 'region',
        'aria-label': 'Key Scenario Facts'
      }, [
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } }, [
          h('span', { style: { fontWeight: 800, color: 'var(--amber-text)', fontSize: '0.95rem' } },
            'Scenario Summary & Key Facts'
          )
        ]),
        h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--text-navy-dark)' } },
          chapter.keyFacts.map((fact, idx) => h('li', { key: idx }, fact))
        )
      ]),

      h('div', { style: { marginTop: '2rem', display: 'flex', justifyContent: 'center' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onProceedToDocument,
          autoFocus: true
        }, [
          'Inspect Alex’s departure document',
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
            h('polyline', { points: '12 5 19 12 12 19' })
          ])
        ])
      ])
    ])
  ]);
}

// 3. Document Screen (Step 2: Inspect Fictional Document)
function DocumentScreen({ chapter, onProceedToQuestion, onBackToStory }) {
  const doc = chapter.document;

  return h('div', { className: 'screen-container' }, [
    h(ChapterProgress, { currentScreen: 'document', chapterNumber: chapter.number }),

    h('div', { style: { marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
      h('button', {
        type: 'button',
        className: 'btn btn-sm btn-ghost',
        onClick: onBackToStory
      }, [
        h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
          h('line', { x1: '19', y1: '12', x2: '5', y2: '12' }),
          h('polyline', { points: '12 19 5 12 12 5' })
        ]),
        'Back to Situation'
      ]),
      h('span', { className: 'card-header-tag tag-lavender', style: { margin: 0 } },
        'Step 2: Inspect Document'
      )
    ]),

    h('div', { className: 'card', style: { marginBottom: '1.5rem' } }, [
      h('div', { style: { textAlign: 'center', marginBottom: '1.5rem' } }, [
        h('h1', { className: 'screen-title', style: { fontSize: '1.65rem', marginBottom: '0.35rem' } },
          'Alex’s Departure Paperwork'
        ),
        h('p', { className: 'screen-subtitle' },
          'Inspect the departure summary email from Alex’s employer to find clues about their pension pot.'
        )
      ]),

      doc ? h('div', { className: 'fictional-doc-wrapper', role: 'region', 'aria-label': 'Fictional Departure Document' }, [
        h('div', { className: 'fictional-watermark', 'aria-label': 'Notice: Fictional document' },
          'Fictional Document · For Educational Use Only'
        ),

        h('div', { className: 'fictional-doc-header' }, [
          h('h2', { className: 'fictional-doc-title' }, doc.title),
          h('div', { className: 'fictional-doc-issuer' }, doc.issuer),
          h('div', { style: { fontSize: '0.85rem', color: 'var(--text-navy-muted)', marginTop: '0.2rem' } },
            `Recipient: ${doc.recipient} · Date: ${doc.date} · Ref: ${doc.referenceNumber}`
          )
        ]),

        h('p', { style: { fontSize: '0.95rem', color: 'var(--text-navy-body)', marginBottom: '1.25rem', lineHeight: '1.55' } },
          doc.summary
        ),

        h('div', { className: 'fictional-grid' },
          doc.keyDetails.map((detail, idx) =>
            h('div', { key: idx, className: 'fictional-cell' }, [
              h('div', { className: 'fictional-cell-label' }, detail.label),
              h('div', { className: 'fictional-cell-value' }, detail.value)
            ])
          )
        ),

        h('div', {
          style: {
            backgroundColor: 'var(--amber-surface)',
            border: '1px solid var(--amber-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            color: 'var(--amber-text)',
            fontWeight: 600
          }
        }, [
          h('strong', null, 'Important Notice: '),
          doc.importantNotice
        ])
      ]) : null,

      h('div', { style: { marginTop: '2rem', display: 'flex', justifyContent: 'center' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onProceedToQuestion,
          autoFocus: true
        }, [
          'Continue to Alex’s Decision',
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
            h('polyline', { points: '12 5 19 12 12 19' })
          ])
        ])
      ])
    ])
  ]);
}

// 4. Question Screen (Step 3: Decision)
function QuestionScreen({ chapter, selectedChoiceId, onSelectChoice, onSubmitAnswer, onBackToDocument }) {
  return h('div', { className: 'screen-container' }, [
    h(ChapterProgress, { currentScreen: 'question', chapterNumber: chapter.number }),

    h('div', { style: { marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
      h('button', {
        type: 'button',
        className: 'btn btn-sm btn-ghost',
        onClick: onBackToDocument
      }, [
        h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
          h('line', { x1: '19', y1: '12', x2: '5', y2: '12' }),
          h('polyline', { points: '12 19 5 12 12 5' })
        ]),
        'Re-inspect Document'
      ]),
      h('span', { className: 'card-header-tag tag-lavender', style: { margin: 0 } },
        'Step 3: Your Decision'
      )
    ]),

    h('div', { className: 'card', style: { marginBottom: '1.5rem' } }, [
      h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' } }, [
        h(Avatar, { mood: 'thinking', size: 90, caption: 'Alex' }),
        h('div', { style: { flex: 1, minWidth: '240px' } }, [
          h('span', { style: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' } },
            'Workplace Pension Dilemma'
          ),
          h('h1', { className: 'screen-title', style: { fontSize: '1.65rem', marginTop: '0.25rem', lineHeight: '1.3' } },
            chapter.questionPrompt
          ),
          h('p', { style: { fontSize: '0.95rem', color: 'var(--text-navy-muted)', marginTop: '0.4rem' } },
            'Select the best answer below to advise Alex. You can retry freely without penalties.'
          )
        ])
      ]),

      h('fieldset', { style: { border: 'none', padding: 0, margin: 0 } }, [
        h('legend', { style: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 } },
          chapter.questionPrompt
        ),

        h('div', { className: 'choices-list', role: 'radiogroup', 'aria-label': 'Pension answer choices' },
          chapter.choices.map(choice => {
            const isSelected = selectedChoiceId === choice.id;

            return h('button', {
              key: choice.id,
              type: 'button',
              role: 'radio',
              'aria-checked': isSelected,
              className: `choice-card ${isSelected ? 'selected' : ''}`,
              onClick: () => onSelectChoice(choice.id),
              onKeyDown: (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelectChoice(choice.id);
                }
              }
            }, [
              h('div', { className: 'choice-letter', 'aria-hidden': 'true' }, choice.label),
              h('div', { style: { flex: 1 } }, [
                h('div', { className: 'choice-text' }, choice.text)
              ]),
              isSelected ? h('div', { style: { color: 'var(--teal-primary)', marginLeft: '0.5rem', alignSelf: 'center' }, 'aria-hidden': 'true' }, [
                h('svg', { width: '22', height: '22', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
                  h('polyline', { points: '20 6 9 17 4 12' })
                ])
              ]) : null
            ]);
          })
        )
      ]),

      h('div', { style: { marginTop: '2rem', display: 'flex', justifyContent: 'center' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onSubmitAnswer,
          disabled: !selectedChoiceId,
          style: { minWidth: '220px' }
        }, [
          'Submit Answer',
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '9 18 15 12 9 6' })
          ])
        ])
      ])
    ])
  ]);
}

// 5. Feedback Screen (Step 4: Reasoning & Retry)
function FeedbackScreen({ chapter, selectedAnswerId, onRetry, onProceedToEnquiryTask }) {
  const selectedChoice = chapter.choices.find(c => c.id === selectedAnswerId);
  const isCorrect = selectedChoice?.isCorrect ?? false;

  return h('div', { className: 'screen-container' }, [
    h(ChapterProgress, { currentScreen: 'feedback', chapterNumber: chapter.number }),

    h('div', { className: 'card-header-tag tag-lavender', style: { marginBottom: '1rem', display: 'inline-flex' }, role: 'note' },
      'Step 4: Educational Feedback & Reasoning'
    ),

    h('div', { className: 'card', style: { marginBottom: '1.5rem' } }, [
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' } }, [
        h(Avatar, {
          mood: isCorrect ? 'celebrating' : 'thinking',
          size: 90,
          caption: isCorrect ? 'Alex understands!' : 'Let’s look closer'
        }),
        h('div', null, [
          h('span', { style: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-navy-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' } },
            `Your Response: Choice ${selectedChoice?.label}`
          ),
          h('h1', { className: 'screen-title', style: { fontSize: '1.6rem', marginTop: '0.2rem' } },
            isCorrect ? 'Spot on — Alex keeps the pension!' : 'Not quite — let’s unpack why'
          )
        ])
      ]),

      h('div', {
        style: {
          padding: '0.9rem 1.1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--border-medium)',
          marginBottom: '1.25rem',
          fontSize: '1rem',
          color: 'var(--text-navy-body)'
        }
      }, [
        h('strong', null, 'You chose: '),
        `“${selectedChoice?.text}”`
      ]),

      h('div', {
        className: `feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`,
        role: 'alert'
      }, [
        h('div', { className: 'feedback-header' }, [
          isCorrect ? h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '20 6 9 17 4 12' })
          ]) : h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('circle', { cx: '12', cy: '12', r: '10' }),
            h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
            h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
          ]),
          h('span', null, isCorrect ? 'Accurate Understanding' : 'Helpful Clarification')
        ]),

        h('div', { className: 'feedback-body' }, [
          h('p', { style: { marginBottom: '0.75rem', fontWeight: 600 } }, selectedChoice?.shortFeedback),

          h('div', { style: { backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginTop: '0.75rem' } }, [
            h('div', { style: { fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-navy-muted)', marginBottom: '0.35rem' } },
              'Key Principle:'
            ),
            h('p', { style: { fontStyle: 'italic', color: 'var(--text-navy-dark)', lineHeight: '1.55' } },
              `“${chapter.primaryFeedback}”`
            )
          ])
        ])
      ]),

      // What remains dependent on scheme/provider
      h('div', {
        style: {
          backgroundColor: 'var(--bg-subtle)',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.1rem',
          marginBottom: '1.25rem',
          fontSize: '0.925rem',
          color: 'var(--text-navy-body)',
          lineHeight: '1.55'
        }
      }, [
        h('strong', { style: { color: 'var(--text-navy-dark)', display: 'block', marginBottom: '0.35rem' } },
          'What depends on the scheme provider:'
        ),
        chapter.schemeDependenceNote
      ]),

      // What Alex could check next
      h('div', {
        style: {
          backgroundColor: 'var(--teal-surface)',
          border: '1.5px solid var(--teal-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.1rem',
          marginBottom: '1.5rem',
          fontSize: '0.925rem',
          color: 'var(--teal-text)',
          lineHeight: '1.55'
        }
      }, [
        h('strong', { style: { display: 'block', marginBottom: '0.35rem' } },
          'What Alex should check or ask next:'
        ),
        chapter.nextStepsAdvice
      ]),

      h('div', { style: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' } }, [
        !isCorrect ? h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onRetry,
          autoFocus: true
        }, [
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '1 4 1 10 7 10' }),
            h('path', { d: 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10' })
          ]),
          'Try Again (No Penalty)'
        ]) : h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onProceedToEnquiryTask,
          autoFocus: true
        }, [
          'Apply This Lesson: Prepare Alex’s Enquiry',
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
            h('polyline', { points: '12 5 19 12 12 19' })
          ])
        ])
      ])
    ])
  ]);
}

// 6. Enquiry Task Screen (Step 5: Customer Service Task)
function EnquiryTaskScreen({ chapter, selectedEnquiryIds, onToggleEnquiry, onCompleteChapter, onBackToFeedback }) {
  const task = chapter.enquiryTask;
  if (!task) return null;

  const usefulCount = task.options.filter(o => o.isUseful).length;
  const selectedUsefulCount = task.options.filter(o => o.isUseful && selectedEnquiryIds.includes(o.id)).length;
  const selectedInappropriateCount = task.options.filter(o => !o.isUseful && selectedEnquiryIds.includes(o.id)).length;

  return h('div', { className: 'screen-container' }, [
    h(ChapterProgress, { currentScreen: 'enquiry', chapterNumber: chapter.number }),

    h('div', { style: { marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
      h('button', {
        type: 'button',
        className: 'btn btn-sm btn-ghost',
        onClick: onBackToFeedback
      }, [
        h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
          h('line', { x1: '19', y1: '12', x2: '5', y2: '12' }),
          h('polyline', { points: '12 19 5 12 12 5' })
        ]),
        'Back to Reasoning'
      ]),
      h('span', { className: 'card-header-tag tag-lavender', style: { margin: 0 } },
        'Step 5: Customer Service Activity'
      )
    ]),

    h('div', { className: 'card', style: { marginBottom: '1.5rem' } }, [
      h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' } }, [
        h(Avatar, { mood: 'neutral', size: 80, caption: 'Alex preparing enquiry' }),
        h('div', { style: { flex: 1, minWidth: '240px' } }, [
          h('span', { style: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' } },
            'Interactive Task'
          ),
          h('h1', { className: 'screen-title', style: { fontSize: '1.65rem', marginTop: '0.25rem', lineHeight: '1.3' } },
            task.prompt
          ),
          h('p', { style: { fontSize: '0.95rem', color: 'var(--text-navy-muted)', marginTop: '0.4rem', lineHeight: '1.5' } },
            task.scenario
          )
        ])
      ]),

      h('div', {
        style: {
          backgroundColor: 'var(--bg-subtle)',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.25rem'
        }
      }, [
        h('span', { style: { fontSize: '0.9rem', color: 'var(--text-navy-body)', fontWeight: 600 } },
          'Select the questions below to inspect how each affects Alex’s pension:'
        ),
        h('span', {
          className: `card-header-tag ${selectedUsefulCount === usefulCount && selectedInappropriateCount === 0 ? 'tag-teal' : 'tag-amber'}`,
          style: { margin: 0 }
        }, `${selectedUsefulCount} of ${usefulCount} Essential Questions Selected`)
      ]),

      h('div', { className: 'enquiry-list', role: 'group', 'aria-label': 'Questions for pension provider' },
        task.options.map(option => {
          const isSelected = selectedEnquiryIds.includes(option.id);

          return h('div', {
            key: option.id,
            className: `enquiry-item-card ${isSelected ? 'selected' : ''}`
          }, [
            h('button', {
              type: 'button',
              className: 'enquiry-interactive-btn',
              onClick: () => onToggleEnquiry(option.id),
              'aria-pressed': isSelected
            }, [
              h('div', { className: 'enquiry-checkbox-box', 'aria-hidden': 'true' },
                isSelected ? h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
                  h('polyline', { points: '20 6 9 17 4 12' })
                ]) : null
              ),
              h('div', { style: { flex: 1 } }, [
                h('span', { className: 'enquiry-item-text' }, option.question)
              ])
            ]),

            isSelected ? h('div', {
              className: `enquiry-feedback-panel ${option.isUseful ? 'enquiry-feedback-useful' : 'enquiry-feedback-not-useful'}`,
              role: 'note'
            }, [
              h('div', { style: { fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' } }, [
                option.isUseful ? h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
                  h('polyline', { points: '20 6 9 17 4 12' })
                ]) : h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
                  h('circle', { cx: '12', cy: '12', r: '10' }),
                  h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
                  h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
                ]),
                h('span', null, option.isUseful ? 'Effective Question:' : 'Inappropriate or Unrealistic Request:')
              ]),
              h('p', null, option.whyItHelps),
              h('p', { style: { marginTop: '0.35rem', fontStyle: 'italic', opacity: 0.9 } },
                `Context: ${option.practicalContext}`
              )
            ]) : null
          ]);
        })
      ),

      h('div', { style: { marginTop: '2rem', display: 'flex', justifyContent: 'center' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onCompleteChapter,
          disabled: selectedUsefulCount === 0,
          style: { minWidth: '260px' }
        }, [
          'Complete Chapter & Save to Journal',
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '20 6 9 17 4 12' })
          ])
        ])
      ])
    ])
  ]);
}

// 7. Completion Screen (Step 6: Takeaway)
function CompletionScreen({ chapter, onOpenJournal, onBackToHome, onReplayChapter }) {
  return h('div', { className: 'screen-container' }, [
    h(ChapterProgress, { currentScreen: 'completion', chapterNumber: chapter.number }),

    h('div', { className: 'card', style: { textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem' } }, [
      h('div', { style: { marginBottom: '1.25rem' } }, [
        h('span', { className: 'card-header-tag tag-teal' }, [
          h('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '20 6 9 17 4 12' })
          ]),
          'Chapter Complete & Saved'
        ])
      ]),

      h('div', { style: { marginBottom: '1.5rem' } }, [
        h(Avatar, { mood: 'celebrating', size: 130, caption: 'Alex — Confident and prepared' })
      ]),

      h('h1', { className: 'screen-title', style: { fontSize: '2.1rem', marginBottom: '0.5rem' } },
        'Well Done! Chapter 1 Complete'
      ),

      h('p', { style: { fontSize: '1.1rem', color: 'var(--text-navy-body)', maxWidth: '620px', margin: '0 auto 1.75rem auto', lineHeight: '1.6' } },
        'You helped Alex understand their Defined Contribution pension pot and prepare the right questions for the provider.'
      ),

      h('div', {
        style: {
          maxWidth: '640px',
          margin: '0 auto 2rem auto',
          backgroundColor: 'var(--bg-subtle)',
          border: '2px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'left'
        }
      }, [
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' } }, [
          h('span', { style: { fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--teal-primary)' } },
            'Summary Logged to Journal'
          )
        ]),
        h('h2', { style: { fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.5rem' } },
          chapter.journalEntry.title
        ),
        h('p', { style: { fontSize: '1rem', color: 'var(--text-navy-body)', lineHeight: '1.55', marginBottom: '1rem' } },
          chapter.keyTakeaway
        ),
        h('div', {
          style: {
            borderTop: '1px solid var(--border-medium)',
            paddingTop: '0.75rem',
            fontSize: '0.875rem',
            color: 'var(--text-navy-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
            h('polyline', { points: '14 2 14 8 20 8' })
          ]),
          'Permanent reference saved to your local device Learning Journal'
        ])
      ]),

      h('div', { style: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-teal btn-lg',
          onClick: onOpenJournal,
          autoFocus: true
        }, [
          h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
            h('polyline', { points: '14 2 14 8 20 8' })
          ]),
          'Open Learning Journal'
        ]),

        h('button', {
          type: 'button',
          className: 'btn btn-secondary btn-lg',
          onClick: onReplayChapter
        }, [
          h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '1 4 1 10 7 10' }),
            h('path', { d: 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10' })
          ]),
          'Replay Chapter'
        ]),

        h('button', {
          type: 'button',
          className: 'btn btn-ghost btn-lg',
          onClick: onBackToHome
        }, 'Return to Homepage')
      ])
    ])
  ]);
}

// 8. Learning Journal Screen
function JournalScreen({ chapters, unlockedChapterIds, onBackToHome, onSelectChapter }) {
  const [showSampleEntry, setShowSampleEntry] = React.useState(false);
  const ch1 = chapters.find(c => c.id === 'ch1') || chapters[0];
  const hasUnlockedEntries = unlockedChapterIds.length > 0;

  return h('div', { className: 'screen-container' }, [
    h('div', { className: 'screen-header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' } }, [
      h('div', null, [
        h('span', { className: 'card-header-tag tag-lavender' }, 'Learner Reference Base'),
        h('h1', { className: 'screen-title' }, 'Learning Journal'),
        h('p', { className: 'screen-subtitle' },
          'Your personal log of UK workplace pension principles, misconceptions clarified, and useful questions for providers.'
        )
      ]),

      h('div', { style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-secondary btn-sm',
          onClick: () => window.print(),
          title: 'Print or export journal notes'
        }, [
          h('svg', { width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('polyline', { points: '6 9 6 2 18 2 18 9' }),
            h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
            h('rect', { x: '6', y: '14', width: '12', height: '8' })
          ]),
          'Print Notes'
        ]),
        h('button', {
          type: 'button',
          className: 'btn btn-teal btn-sm',
          onClick: onBackToHome
        }, [
          h('svg', { width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
            h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' })
          ]),
          'Home & Map'
        ])
      ])
    ]),

    // Storage Disclosure
    h('div', {
      style: {
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        color: 'var(--text-navy-muted)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }
    }, [
      h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
        h('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
      ]),
      'Saved locally in your browser storage on this device. No personal data, cookies, or account synchronisation.'
    ]),

    // Empty state if nothing completed yet
    !hasUnlockedEntries ? h('div', { className: 'journal-empty-state', role: 'region', 'aria-label': 'Journal empty state' }, [
      h('svg', { width: '48', height: '48', viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--teal-primary)', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', style: { margin: '0 auto 1rem auto', display: 'block' } }, [
        h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
        h('polyline', { points: '14 2 14 8 20 8' }),
        h('line', { x1: '12', y1: '18', x2: '12', y2: '12' }),
        h('line', { x1: '9', y1: '15', x2: '15', y2: '15' })
      ]),
      h('h2', { style: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.5rem' } },
        'Your Learning Journal is currently empty'
      ),
      h('p', { style: { color: 'var(--text-navy-muted)', maxWidth: '520px', margin: '0 auto 1.25rem auto', lineHeight: '1.5' } },
        'As you guide Alex through workplace scenarios, your key lessons, clarified misconceptions, and useful provider enquiry questions will appear here.'
      ),
      h('div', { style: { display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' } }, [
        h('button', {
          type: 'button',
          className: 'btn btn-teal',
          onClick: () => onSelectChapter(ch1.id)
        }, 'Start Chapter 1 to unlock notes'),
        h('button', {
          type: 'button',
          className: 'sample-toggle-pill',
          onClick: () => setShowSampleEntry(!showSampleEntry),
          'aria-expanded': showSampleEntry
        }, showSampleEntry ? 'Hide sample journal entry' : 'Preview sample journal entry')
      ])
    ]) : null,

    // Sample Preview if toggled
    !hasUnlockedEntries && showSampleEntry ? h('div', { style: { marginBottom: '1.5rem' } }, [
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' } }, [
        h('span', { className: 'sample-badge' }, 'Sample Preview'),
        h('span', { style: { fontSize: '0.85rem', color: 'var(--text-navy-muted)', fontStyle: 'italic' } },
          'This is how your journal entry will look after finishing Chapter 1.'
        )
      ]),
      h('article', { className: 'card', style: { borderLeft: '6px solid var(--amber-primary)', backgroundColor: '#FFFFFF' } }, [
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' } }, [
          h('span', { className: 'card-header-tag tag-amber', style: { margin: 0 } }, 'Sample Preview · Chapter 1'),
          h('span', { style: { fontSize: '0.85rem', color: 'var(--text-navy-muted)' } }, ch1.topic)
        ]),
        h('h2', { style: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.75rem' } }, ch1.journalEntry.title),
        h('div', {
          style: {
            backgroundColor: 'var(--bg-subtle)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--teal-primary)',
            marginBottom: '1.25rem',
            fontSize: '1.025rem',
            fontWeight: 600,
            color: 'var(--text-navy-dark)'
          }
        }, ch1.journalEntry.keyTakeaway),

        h('h3', { style: { fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' } }, '1. What Alex Learned:'),
        h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text-navy-body)', lineHeight: '1.55' } },
          ch1.journalEntry.whatAlexLearned.map((pt, i) => h('li', { key: i }, pt))
        ),

        h('div', {
          style: {
            backgroundColor: 'var(--amber-surface)',
            border: '1.5px solid var(--amber-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.925rem',
            color: 'var(--amber-text)'
          }
        }, [
          h('strong', { style: { display: 'block', marginBottom: '0.25rem' } }, '2. Misconception Clarified:'),
          ch1.journalEntry.misconceptionClarified
        ]),

        h('h3', { style: { fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' } }, '3. Useful Questions to Ask a Pension Provider:'),
        h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--teal-text)', fontWeight: 600 } },
          ch1.journalEntry.usefulQuestionsToAsk.map((q, i) => h('li', { key: i }, q))
        ),

        h('div', {
          style: {
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1rem',
            fontSize: '0.875rem'
          }
        }, [
          h('strong', { style: { color: 'var(--text-navy-dark)', display: 'block', marginBottom: '0.25rem' } }, '4. Verified Public Guidance:'),
          h('p', { style: { color: 'var(--text-navy-body)', marginBottom: '0.35rem' } }, ch1.moneyHelper.description),
          h('div', { style: { fontSize: '0.8rem', color: 'var(--text-navy-muted)', marginBottom: '0.5rem' } },
            `Source: ${ch1.moneyHelper.verifiedSource} · ${ch1.moneyHelper.reviewDate}`
          ),
          h('a', {
            href: ch1.moneyHelper.url,
            target: '_blank',
            rel: 'noreferrer',
            style: { color: 'var(--teal-primary)', fontWeight: 700, textDecoration: 'underline' }
          }, 'Visit MoneyHelper workplace guidance →')
        ])
      ])
    ]) : null,

    // Unlocked Entries
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1.75rem' } },
      chapters.map(chapter => {
        const isUnlocked = unlockedChapterIds.includes(chapter.id);

        if (isUnlocked) {
          return h('article', {
            key: chapter.id,
            className: 'card',
            style: { borderLeft: '6px solid var(--teal-primary)' },
            'aria-labelledby': `journal-entry-${chapter.id}`
          }, [
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' } }, [
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } }, [
                h('span', { className: 'card-header-tag tag-teal', style: { margin: 0 } }, [
                  h('svg', { width: '12', height: '12', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
                    h('polyline', { points: '20 6 9 17 4 12' })
                  ]),
                  `Chapter ${chapter.number} Mastered`
                ]),
                h('span', { style: { fontSize: '0.85rem', color: 'var(--text-navy-muted)' } }, chapter.topic)
              ]),

              h('button', {
                type: 'button',
                className: 'btn btn-secondary btn-sm',
                onClick: () => onSelectChapter(chapter.id),
                'aria-label': `Replay Chapter ${chapter.number}: ${chapter.title}`
              }, [
                h('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
                  h('polyline', { points: '1 4 1 10 7 10' }),
                  h('path', { d: 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10' })
                ]),
                `Replay Chapter ${chapter.number}`
              ])
            ]),

            h('h2', { id: `journal-entry-${chapter.id}`, style: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.75rem' } },
              chapter.journalEntry.title
            ),

            h('div', {
              style: {
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--teal-primary)',
                marginBottom: '1.25rem',
                fontSize: '1.025rem',
                fontWeight: 600,
                color: 'var(--text-navy-dark)'
              }
            }, chapter.journalEntry.keyTakeaway),

            h('h3', { style: { fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' } },
              '1. What Alex Learned:'
            ),
            h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text-navy-body)', lineHeight: '1.55' } },
              chapter.journalEntry.whatAlexLearned.map((point, idx) => h('li', { key: idx }, point))
            ),

            h('div', {
              style: {
                backgroundColor: 'var(--amber-surface)',
                border: '1.5px solid var(--amber-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.925rem',
                color: 'var(--amber-text)'
              }
            }, [
              h('strong', { style: { display: 'block', marginBottom: '0.25rem' } }, '2. Misconception Clarified:'),
              chapter.journalEntry.misconceptionClarified
            ]),

            h('h3', { style: { fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' } },
              '3. Useful Questions to Ask Your Pension Provider:'
            ),
            h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--teal-text)', fontWeight: 600 } },
              chapter.journalEntry.usefulQuestionsToAsk.map((q, idx) => h('li', { key: idx }, q))
            ),

            chapter.journalEntry.practicalTip ? h('div', {
              style: {
                backgroundColor: 'var(--lavender-surface)',
                border: '1.5px solid var(--lavender-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                color: 'var(--lavender-text)'
              }
            }, [
              h('strong', null, 'Practical Tip: '),
              chapter.journalEntry.practicalTip
            ]) : null,

            h('div', {
              style: {
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.95rem 1rem',
                fontSize: '0.875rem'
              }
            }, [
              h('strong', { style: { color: 'var(--text-navy-dark)', display: 'block', marginBottom: '0.25rem' } },
                '4. Verified Public Guidance:'
              ),
              h('p', { style: { color: 'var(--text-navy-body)', marginBottom: '0.35rem' } }, chapter.moneyHelper.description),
              h('div', { style: { fontSize: '0.8rem', color: 'var(--text-navy-muted)', marginBottom: '0.5rem' } },
                `Official source: ${chapter.moneyHelper.verifiedSource} · ${chapter.moneyHelper.reviewDate}`
              ),
              h('a', {
                href: chapter.moneyHelper.url,
                target: '_blank',
                rel: 'noreferrer',
                style: { color: 'var(--teal-primary)', fontWeight: 700, textDecoration: 'underline' }
              }, 'Visit official guidance on MoneyHelper →')
            ])
          ]);
        }

        return h('div', {
          key: chapter.id,
          className: 'card',
          style: {
            backgroundColor: 'var(--bg-subtle)',
            opacity: 0.8,
            borderStyle: 'dashed'
          }
        }, [
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' } }, [
            h('span', { className: 'card-header-tag tag-neutral', style: { margin: 0 } },
              `Chapter ${chapter.number} — Coming later`
            ),
            h('span', { style: { fontSize: '0.85rem', color: 'var(--text-navy-muted)' } }, chapter.topic)
          ]),
          h('h2', { style: { fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-navy-muted)', margin: '0.5rem 0 0.25rem 0' } }, chapter.title),
          h('p', { style: { fontSize: '0.875rem', color: 'var(--text-navy-muted)', margin: 0 } },
            `This learning journal entry will unlock when Chapter ${chapter.number} is released and completed.`
          )
        ]);
      })
    )
  ]);
}

// 9. About & Safeguards Modal
function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return h('div', {
    className: 'modal-backdrop',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'disclaimer-modal-title',
    onClick: (e) => { if (e.target === e.currentTarget) onClose(); }
  }, [
    h('div', { className: 'modal-dialog' }, [
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' } }, [
        h('h2', { id: 'disclaimer-modal-title', style: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-navy-dark)' } },
          'About PensionQuest & Safeguards'
        ),
        h('button', {
          type: 'button',
          className: 'btn btn-sm btn-ghost',
          onClick: onClose,
          'aria-label': 'Close about and safeguards dialog'
        }, '✕')
      ]),

      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-navy-body)', fontSize: '0.95rem', lineHeight: '1.6' } }, [
        h('div', { className: 'tag-amber', style: { padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' } }, [
          h('strong', null, 'Educational Purpose: '),
          'Independent prototype explaining UK Defined Contribution workplace pension administration through fictional stories.'
        ]),

        h('p', null, [
          h('strong', null, 'What this prototype is: '),
          'An interactive learning experience designed to help adult learners understand everyday workplace pension situations, key terms, and practical questions.'
        ]),

        h('p', null, [
          h('strong', null, 'What this prototype is NOT:')
        ]),
        h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' } }, [
          h('li', null, 'It is NOT financial, legal, or regulated advice.'),
          h('li', null, 'It is NOT a pension provider, scheme administrator, or portal.'),
          h('li', null, 'It provides NO access to real pension accounts, balances, or records.'),
          h('li', null, 'It does NOT submit any requests or instructions to real pension schemes.'),
          h('li', null, 'It has NO affiliation with Prudential, M&G, or any commercial employer or scheme provider.')
        ]),

        h('p', null, [
          h('strong', null, 'General Learning vs Scheme-Specific Rules:')
        ]),
        h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' } }, [
          h('li', null, 'Defined contribution pension rules, fees, processing timescales, transfer options, and investment selections vary between schemes.'),
          h('li', null, 'This game does not make universal claims about processing times, tax outcomes, or scheme rules. Real scheme enquiries should always be confirmed with your specific scheme provider.'),
          h('li', null, 'All scenario documents, dates, and account figures are strictly fictional draft educational material.')
        ]),

        h('p', null, [
          h('strong', null, 'Local Device Storage:')
        ]),
        h('p', { style: { fontSize: '0.875rem', color: 'var(--text-navy-muted)', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' } },
          'Completed chapter progress and journal entries are stored strictly on your local browser (using localStorage) on this device. No personal data, tracking cookies, or remote accounts are used.'
        ),

        h('div', { style: { backgroundColor: 'var(--teal-surface)', border: '1px solid var(--teal-border)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginTop: '0.25rem' } }, [
          h('strong', { style: { color: 'var(--teal-text)', display: 'block', marginBottom: '0.25rem' } }, 'Free Impartial Public Guidance:'),
          h('p', { style: { fontSize: '0.875rem' } }, [
            'For government-backed, free, and impartial guidance on workplace pensions, visit ',
            h('a', {
              href: 'https://www.moneyhelper.org.uk',
              target: '_blank',
              rel: 'noreferrer',
              style: { color: 'var(--teal-text)', fontWeight: 700, textDecoration: 'underline' }
            }, 'MoneyHelper (moneyhelper.org.uk)'),
            ' or the government’s ',
            h('a', {
              href: 'https://www.gov.uk/find-pension-contact-details',
              target: '_blank',
              rel: 'noreferrer',
              style: { color: 'var(--teal-text)', fontWeight: 700, textDecoration: 'underline' }
            }, 'Pension Tracing Service'),
            '.'
          ])
        ])
      ]),

      h('div', { style: { marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' } }, [
        h('button', { type: 'button', className: 'btn btn-teal', onClick: onClose }, 'Close & Continue')
      ])
    ])
  ]);
}

// 10. Restart Confirmation Modal
function RestartConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return h('div', {
    className: 'modal-backdrop',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'restart-modal-title',
    onClick: (e) => { if (e.target === e.currentTarget) onCancel(); }
  }, [
    h('div', { className: 'modal-dialog' }, [
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' } }, [
        h('h2', { id: 'restart-modal-title', style: { fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy-dark)' } },
          'Confirm Restart Progress'
        ),
        h('button', {
          type: 'button',
          className: 'btn btn-sm btn-ghost',
          onClick: onCancel,
          'aria-label': 'Cancel restart'
        }, '✕')
      ]),

      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-navy-body)', fontSize: '0.95rem', lineHeight: '1.6' } }, [
        h('div', { className: 'tag-amber', style: { padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' } }, [
          h('strong', null, 'What will be deleted:')
        ]),
        h('p', null, 'Restarting will permanently clear:'),
        h('ul', { style: { paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' } }, [
          h('li', null, 'Your completed chapter status for Chapter 1 (“Alex changes jobs”).'),
          h('li', null, 'All unlocked reference entries saved in your Learning Journal.'),
          h('li', null, 'Active choices stored in this browser’s local storage on this device.')
        ]),
        h('p', { style: { fontSize: '0.875rem', color: 'var(--text-navy-muted)', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' } },
          'You will be returned to the Welcome screen with a fresh start. No external accounts or cloud data are affected.'
        )
      ]),

      h('div', { style: { marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' } }, [
        h('button', { type: 'button', className: 'btn btn-secondary', onClick: onCancel }, 'Keep My Progress'),
        h('button', {
          type: 'button',
          className: 'btn btn-teal',
          onClick: onConfirm,
          style: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' }
        }, 'Yes, Reset All Progress')
      ])
    ])
  ]);
}


// =====================================================================
// --- 4.9 COMODO REFERENCE VISUAL IMPLEMENTATION (12 SECTIONS) ---
// =====================================================================

function VideoModal({ onClose }) {
  return h('div', { className: 'modal-backdrop', onClick: onClose }, [
    h('div', { className: 'modal-content-box', onClick: (e) => e.stopPropagation() }, [
      h('button', { className: 'modal-close-btn', onClick: onClose, 'aria-label': 'Close video' }, '✕'),
      h('h3', { style: { color: '#3fcaff', fontFamily: 'Rajdhani', fontSize: '24px', marginBottom: '16px' } }, 'Comodo Gaming Experience Showcase'),
      h('div', { style: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', background: '#17103d', marginBottom: '20px' } }, [
        h('div', { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: '20px' } }, [
          h('div', { className: 'video-play-button', style: { pointerEvents: 'none', marginBottom: '20px' } }, [h('span', null)]),
          h('h4', { style: { fontFamily: 'Rajdhani', fontSize: '22px', color: '#a4ffb0', marginTop: '10px' } }, 'Next-Gen Esports & Story Adventures'),
          h('p', { style: { color: '#ccc', maxWidth: '440px', fontSize: '13px' } }, 'Experience immersive tactical arena battles, story-driven branching quests, and cross-platform live streaming tournaments.')
        ])
      ]),
      h('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, [
        h('button', { className: 'primary_btn', onClick: onClose }, 'Close Preview')
      ])
    ])
  ]);
}

function LightboxModal({ image, onClose }) {
  if (!image) return null;
  return h('div', { className: 'modal-backdrop', onClick: onClose }, [
    h('div', { className: 'modal-content-box', style: { maxWidth: '750px', textAlign: 'center' }, onClick: (e) => e.stopPropagation() }, [
      h('button', { className: 'modal-close-btn', onClick: onClose, 'aria-label': 'Close image lightbox' }, '✕'),
      h('img', { src: image.src, alt: image.title, style: { width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', marginBottom: '16px' } }),
      h('h3', { style: { fontFamily: 'Rajdhani', fontSize: '24px', color: '#3fcaff', marginBottom: '8px' } }, image.title),
      h('p', { style: { color: '#ddd', fontSize: '14px', marginBottom: '20px' } }, image.desc),
      h('button', { className: 'primary_btn', onClick: onClose }, 'Close Gallery Lightbox')
    ])
  ]);
}

function OrderModal({ plan, onClose }) {
  if (!plan) return null;
  return h('div', { className: 'modal-backdrop', onClick: onClose }, [
    h('div', { className: 'modal-content-box', style: { maxWidth: '480px', textAlign: 'center' }, onClick: (e) => e.stopPropagation() }, [
      h('button', { className: 'modal-close-btn', onClick: onClose, 'aria-label': 'Close plan order modal' }, '✕'),
      h('div', { style: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(90deg, #3fcaff, #a4ffb0)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22195e', fontSize: '28px', fontWeight: 'bold' } }, '✓'),
      h('h3', { style: { fontFamily: 'Rajdhani', fontSize: '26px', color: '#ffffff', marginBottom: '8px' } }, plan + ' Confirmed!'),
      h('div', { style: { fontSize: '36px', fontFamily: 'Rajdhani', fontWeight: 'bold', color: '#3fcaff', marginBottom: '16px' } }, '$69.00'),
      h('p', { style: { color: '#dddddd', fontSize: '14px', marginBottom: '24px' } }, 'Your demo access pass has been reserved with all features unlocked. Zero real billing required in this preview prototype.'),
      h('button', { className: 'primary_btn', onClick: onClose }, 'Continue Exploring')
    ])
  ]);
}

function ComodoPage({ onStartStory, onOpenSafeguards }) {
  const [activeTab, setActiveTab] = React.useState('live');
  const [testiIndex, setTestiIndex] = React.useState(0);
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);
  const [lightboxImage, setLightboxImage] = React.useState(null);
  const [orderModalPlan, setOrderModalPlan] = React.useState(null);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterMsg, setNewsletterMsg] = React.useState('');
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [pagesDropdown, setPagesDropdown] = React.useState(false);
  const [blogDropdown, setBlogDropdown] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      if (typeof window !== 'undefined' && window.scrollY > 80) {
        if (!isSticky) setIsSticky(true);
      } else {
        if (isSticky) setIsSticky(false);
      }
    };
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [isSticky]);

  const testimonials = [
    {
      author: 'Fanny Spencer',
      text: 'As conscious traveling Paup ers we must always be oncerned about our dear Mother Earth. If you think about it, you travel across her face and She is the host to your journey.'
    },
    {
      author: 'Marcus Vance',
      text: 'Comodo combines competitive esports thrills with gripping story campaigns. The visual fidelity and smooth responsive feel are unlike any gaming portal.'
    },
    {
      author: 'Elena Rostova',
      text: 'Navigating Alex’s workplace pension decisions inside PensionQuest is brilliant. Engaging, story-driven education presented with stunning visual aesthetics.'
    }
  ];

  const galleryItems = [
    { src: 'img/gallery_img1.svg', title: 'Neon Metropolis 2088', desc: 'Cyberpunk open-world exploration with ray-traced reflections.' },
    { src: 'img/gallery_img2.svg', title: 'Championship Coliseum', desc: 'Real-time multi-player arena battles with dynamic spectators.' },
    { src: 'img/gallery_img3.svg', title: 'Global Tournament Panorama', desc: 'Full stadium view of the international Esports World Cup.' },
    { src: 'img/gallery_img4.svg', title: 'Mecha Titan Interaction', desc: 'Customizable cyber armor suits and tactical weaponry loadouts.' }
  ];

  const handleNewsletterSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }
    setNewsletterMsg('✓ Thank you for subscribing! We will keep you updated without spam.');
    setNewsletterEmail('');
  };

  return h('div', { className: 'comodo-page-root' }, [
    // 1. Header Menu Area
    h('header', { className: 'header_area' + (isSticky ? ' navbar_fixed' : '') }, [
      h('div', { className: 'main_menu' }, [
        h('nav', { className: 'navbar navbar-expand-lg navbar-light' }, [
          h('div', { className: 'container' }, [
            h('a', { className: 'navbar-brand logo_h', href: '#' }, [
              h('img', { src: 'img/logo.svg', alt: 'Comodo Logo', fetchpriority: 'high' })
            ]),
            h('button', {
              className: 'navbar-toggler',
              type: 'button',
              onClick: () => setMobileNavOpen(!mobileNavOpen),
              'aria-label': 'Toggle navigation'
            }, [
              h('span', { className: 'icon-bar' }),
              h('span', { className: 'icon-bar' }),
              h('span', { className: 'icon-bar' })
            ]),
            h('div', { className: 'collapse navbar-collapse offset' + (mobileNavOpen ? ' show' : ''), id: 'navbarSupportedContent' }, [
              h('ul', { className: 'nav navbar-nav menu_nav justify-content-center' }, [
                h('li', { className: 'nav-item active' }, [h('a', { className: 'nav-link', href: '#' }, 'Home')]),
                h('li', { className: 'nav-item' }, [h('a', { className: 'nav-link', href: '#about-us' }, 'About')]),
                h('li', { className: 'nav-item' }, [h('a', { className: 'nav-link', href: '#gallery' }, 'Gallery')]),
                h('li', { className: 'nav-item submenu dropdown' }, [
                  h('a', {
                    className: 'nav-link dropdown-toggle',
                    href: '#upcoming-games',
                    onClick: (e) => { e.preventDefault(); setPagesDropdown(!pagesDropdown); }
                  }, 'Pages'),
                  h('ul', { className: 'dropdown-menu' + (pagesDropdown ? ' show' : '') }, [
                    h('li', { className: 'nav-item' }, [h('a', { className: 'dropdown-item', href: '#pricing' }, 'Pricing')]),
                    h('li', { className: 'nav-item' }, [h('a', { className: 'dropdown-item', href: '#upcoming-games' }, 'Games')]),
                    h('li', { className: 'nav-item' }, [h('a', { className: 'dropdown-item', href: '#', onClick: (e) => { e.preventDefault(); onStartStory('ch1'); } }, 'Play Alex’s Story')])
                  ])
                ]),
                h('li', { className: 'nav-item submenu dropdown' }, [
                  h('a', {
                    className: 'nav-link dropdown-toggle',
                    href: '#blog',
                    onClick: (e) => { e.preventDefault(); setBlogDropdown(!blogDropdown); }
                  }, 'Blog'),
                  h('ul', { className: 'dropdown-menu' + (blogDropdown ? ' show' : '') }, [
                    h('li', { className: 'nav-item' }, [h('a', { className: 'dropdown-item', href: '#blog' }, 'Blog')]),
                    h('li', { className: 'nav-item' }, [h('a', { className: 'dropdown-item', href: '#blog' }, 'Blog Details')])
                  ])
                ]),
                h('li', { className: 'nav-item' }, [h('a', { className: 'nav-link', href: '#newsletter' }, 'Contact')])
              ]),
              h('ul', { className: 'nav navbar-nav navbar-right' }, [
                h('li', { className: 'nav-item' }, [
                  h('a', {
                    href: '#upcoming-games',
                    className: 'primary_btn',
                    onClick: (e) => { e.preventDefault(); onStartStory('ch1'); }
                  }, 'join us')
                ])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 2. Home Banner Area (Hero)
    h('section', { className: 'home_banner_area' }, [
      h('div', { className: 'banner_inner' }, [
        h('div', { className: 'container' }, [
          h('div', { className: 'row align-items-center' }, [
            h('div', { className: 'col-lg-6' }, [
              h('div', { className: 'home_left_img' }, [
                h('img', { className: 'img-fluid', src: 'img/banner/home-left.svg', alt: 'Comodo Character', fetchpriority: 'high' })
              ])
            ]),
            h('div', { className: 'col-lg-6' }, [
              h('div', { className: 'banner_content' }, [
                h('h2', null, [
                  'For All Occasion ', h('br'),
                  'HairStyle is a Must ', h('br'),
                  'Try Fashion'
                ]),
                h('p', null,
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temp or incididunt ut labore et dolore magna aliqua. Ut enim ad minim.'
                ),
                h('div', { className: 'hero-actions d-flex align-items-center' }, [
                  h('a', {
                    id: 'play-home-video',
                    className: 'video-play-button',
                    href: '#',
                    onClick: (e) => { e.preventDefault(); setVideoModalOpen(true); }
                  }, [h('span', null)]),
                  h('div', {
                    className: 'watch_video text-uppercase',
                    onClick: () => setVideoModalOpen(true),
                    style: { cursor: 'pointer' }
                  }, 'watch the video'),
                  h('button', {
                    className: 'primary_btn',
                    style: { marginLeft: '20px' },
                    onClick: () => onStartStory('ch1')
                  }, 'Start Alex’s story →')
                ])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 3. About Us Area
    h('section', { className: 'about_us_area section_gap_top', id: 'about-us' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row about_content align-items-center' }, [
          h('div', { className: 'col-lg-6' }, [
            h('div', { className: 'section_content' }, [
              h('h6', null, 'About Us'),
              h('h1', null, ['We Believe that ', h('br'), 'Interior beauty Lasts Long']),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              ),
              h('a', { className: 'primary_btn', href: '#upcoming-games' }, 'Learn More')
            ])
          ]),
          h('div', { className: 'col-lg-6' }, [
            h('div', { className: 'about_us_image_box justify-content-center' }, [
              h('img', { className: 'img-fluid w-100', src: 'img/about_img.svg', alt: 'About Comodo Rig' })
            ])
          ])
        ])
      ])
    ]),

    // 4. Upcoming Games Area
    h('section', { className: 'upcoming_games_area', id: 'upcoming-games' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-lg-12' }, [
            h('div', { className: 'main_title' }, [
              h('h2', null, 'Upcoming Games'),
              h('h1', null, 'Upcoming Games')
            ])
          ])
        ]),
        h('div', { className: 'row text-center' }, [
          // Game 1
          h('div', { className: 'col-lg-3 col-md-6 col-sm-6' }, [
            h('div', { className: 'new_games_item' }, [
              h('img', { src: 'img/b_map1.svg', alt: 'Best Ps4 Games' }),
              h('div', { className: 'upcoming_title' }, [
                h('h3', null, [h('a', { href: '#upcoming-games' }, 'Best Ps4 Games')])
              ])
            ])
          ]),
          // Game 2 - Features PensionQuest Playable Chapter
          h('div', { className: 'col-lg-3 col-md-6 col-sm-6' }, [
            h('div', {
              className: 'new_games_item',
              onClick: () => onStartStory('ch1'),
              title: 'Click to play Alex’s story Chapter 1!'
            }, [
              h('img', { src: 'img/b_map2.svg', alt: 'World Dart 2019 / PensionQuest' }),
              h('div', { className: 'upcoming_title' }, [
                h('h3', null, [
                  h('a', {
                    href: '#',
                    onClick: (e) => { e.preventDefault(); onStartStory('ch1'); }
                  }, 'World Dart 2019')
                ])
              ])
            ])
          ]),
          // Game 3
          h('div', { className: 'col-lg-3 col-md-6 col-sm-6' }, [
            h('div', { className: 'new_games_item' }, [
              h('img', { src: 'img/b_map3.svg', alt: 'New XBox Games' }),
              h('div', { className: 'upcoming_title' }, [
                h('h3', null, [h('a', { href: '#upcoming-games' }, 'New XBox Games')])
              ])
            ])
          ]),
          // Game 4
          h('div', { className: 'col-lg-3 col-md-6 col-sm-6' }, [
            h('div', { className: 'new_games_item' }, [
              h('img', { src: 'img/b_map4.svg', alt: 'Amarican Football' }),
              h('div', { className: 'upcoming_title' }, [
                h('h3', null, [h('a', { href: '#upcoming-games' }, 'Amarican Football')])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 5. Recent Update Area (Tabbed Content)
    h('section', { className: 'recent_update_area section_gap' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'recent_update_inner' }, [
          h('ul', { className: 'nav nav-tabs', id: 'myTab', role: 'tablist' }, [
            h('li', { className: 'nav-item' }, [
              h('button', {
                className: activeTab === 'live' ? 'active' : '',
                onClick: () => setActiveTab('live')
              }, 'Live Streaming')
            ]),
            h('li', { className: 'nav-item' }, [
              h('button', {
                className: activeTab === 'challenges' ? 'active' : '',
                onClick: () => setActiveTab('challenges')
              }, 'Upcoming Challanges')
            ]),
            h('li', { className: 'nav-item' }, [
              h('button', {
                className: activeTab === 'recent' ? 'active' : '',
                onClick: () => setActiveTab('recent')
              }, 'Recent Famous Games')
            ])
          ]),
          h('div', { className: 'tab-content', id: 'myTabContent' }, [
            h('div', { className: 'tab-pane show active' }, [
              h('div', { className: 'row recent_update_text align-items-center' }, [
                h('div', { className: 'col-lg-6' }, [
                  h('div', { className: 'chart_img' }, [
                    h('img', { className: 'img-fluid', src: 'img/recent_up.svg', alt: 'Recent Update Metrics' })
                  ])
                ]),
                h('div', { className: 'col-lg-6' }, [
                  h('div', { className: 'section_content' }, [
                    h('h6', null, 'About Us'),
                    h('h1', null, ['We Believe that ', h('br'), 'Interior beauty Lasts Long']),
                    h('p', null,
                      activeTab === 'live'
                        ? 'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
                        : activeTab === 'challenges'
                        ? 'Join our global seasonal challenges and compete in verified community tournaments with real-time stats and leaderboards.'
                        : 'Explore iconic story chapters and acclaimed indie adventures, including Alex’s defined contribution workplace pension decisions.'
                    ),
                    h('a', { className: 'primary_btn', href: '#gallery' }, 'Learn More')
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 6. Screens Gallery Area
    h('section', { className: 'gallery_area', id: 'gallery' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-lg-12' }, [
            h('div', { className: 'main_title' }, [
              h('h2', null, 'Screens Gallery'),
              h('h1', null, 'Screens Gallery')
            ])
          ])
        ]),
        h('div', { className: 'row' }, [
          h('div', { className: 'col-lg-8' }, [
            h('div', { className: 'row' }, [
              h('div', { className: 'col-lg-6 col-md-6 col-sm-6' }, [
                h('div', {
                  className: 'single-gallery',
                  onClick: () => setLightboxImage(galleryItems[0])
                }, [
                  h('div', { className: 'overlay' }),
                  h('img', { className: 'img-fluid w-100', src: galleryItems[0].src, alt: galleryItems[0].title }),
                  h('div', { className: 'content' }, [
                    h('div', { className: 'eye-icon' }, [
                      h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: '#22195e' }, [
                        h('path', { d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' })
                      ])
                    ])
                  ])
                ])
              ]),
              h('div', { className: 'col-lg-6 col-md-6 col-sm-6' }, [
                h('div', {
                  className: 'single-gallery',
                  onClick: () => setLightboxImage(galleryItems[1])
                }, [
                  h('div', { className: 'overlay' }),
                  h('img', { className: 'img-fluid w-100', src: galleryItems[1].src, alt: galleryItems[1].title }),
                  h('div', { className: 'content' }, [
                    h('div', { className: 'eye-icon' }, [
                      h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: '#22195e' }, [
                        h('path', { d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' })
                      ])
                    ])
                  ])
                ])
              ]),
              h('div', { className: 'col-lg-12' }, [
                h('div', {
                  className: 'single-gallery',
                  onClick: () => setLightboxImage(galleryItems[2])
                }, [
                  h('div', { className: 'overlay' }),
                  h('img', { className: 'img-fluid w-100', src: galleryItems[2].src, alt: galleryItems[2].title }),
                  h('div', { className: 'content' }, [
                    h('div', { className: 'eye-icon' }, [
                      h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: '#22195e' }, [
                        h('path', { d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' })
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ]),
          h('div', { className: 'col-lg-4 hidden-md hidden-sm' }, [
            h('div', {
              className: 'single-gallery',
              onClick: () => setLightboxImage(galleryItems[3])
            }, [
              h('div', { className: 'overlay' }),
              h('img', { className: 'img-fluid w-100', src: galleryItems[3].src, alt: galleryItems[3].title }),
              h('div', { className: 'content' }, [
                h('div', { className: 'eye-icon' }, [
                  h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: '#22195e' }, [
                    h('path', { d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' })
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 7. Testimonials Area
    h('section', { className: 'testimonials_area section_gap' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'testi_slider' }, [
          h('div', { className: 'testi_item' }, [
            h('img', { className: 'quote_icon', src: 'img/quote.svg', alt: 'Testimonial Quote' }),
            h('h4', null, testimonials[testiIndex].author),
            h('div', { className: 'star-rating' },
              [0, 1, 2, 3, 4].map(idx =>
                h('svg', { key: idx, viewBox: '0 0 24 24' }, [
                  h('path', { d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' })
                ])
              )
            ),
            h('p', null, testimonials[testiIndex].text),
            h('div', { className: 'testi_controls' }, [
              h('button', {
                className: 'testi_btn',
                onClick: () => setTestiIndex((testiIndex + 2) % 3),
                'aria-label': 'Previous testimonial'
              }, '‹'),
              h('button', {
                className: 'testi_btn',
                onClick: () => setTestiIndex((testiIndex + 1) % 3),
                'aria-label': 'Next testimonial'
              }, '›')
            ])
          ])
        ])
      ])
    ]),

    // 8. Pricing Plans Area
    h('section', { className: 'pricing_area section_gap', id: 'pricing' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-lg-12' }, [
            h('div', { className: 'main_title' }, [
              h('h2', null, 'Pricing Plans'),
              h('h1', null, 'Pricing Plans')
            ])
          ])
        ]),
        h('div', { className: 'row' }, [
          // Silver
          h('div', { className: 'col-lg-4 col-md-6' }, [
            h('div', { className: 'pricing_item' }, [
              h('h3', { className: 'p_title' }, 'Silver Package'),
              h('h1', { className: 'p_price' }, '$69.00'),
              h('ul', { className: 'p_list' }, [
                h('li', null, 'Basic hair Cut'),
                h('li', null, 'Basic hair Cut'),
                h('li', null, 'Basic hair Cut')
              ]),
              h('div', { className: 'p_btn' }, [
                h('button', {
                  className: 'gradient_btn',
                  onClick: () => setOrderModalPlan('Silver Package')
                }, [h('span', null, 'Order Now')])
              ])
            ])
          ]),
          // Golden (Featured / Active)
          h('div', { className: 'col-lg-4 col-md-6' }, [
            h('div', { className: 'pricing_item active' }, [
              h('h3', { className: 'p_title' }, 'Golden Package'),
              h('h1', { className: 'p_price' }, '$69.00'),
              h('ul', { className: 'p_list' }, [
                h('li', null, 'Basic hair Cut'),
                h('li', null, 'Basic hair Cut'),
                h('li', null, 'Basic hair Cut')
              ]),
              h('div', { className: 'p_btn' }, [
                h('button', {
                  className: 'gradient_btn',
                  onClick: () => setOrderModalPlan('Golden Package')
                }, [h('span', null, 'Order Now')])
              ])
            ])
          ]),
          // Platinum
          h('div', { className: 'col-lg-4 hidden-md' }, [
            h('div', { className: 'pricing_item' }, [
              h('h3', { className: 'p_title' }, 'Platinum Package'),
              h('h1', { className: 'p_price' }, '$69.00'),
              h('ul', { className: 'p_list' }, [
                h('li', null, 'Basic hair Cut'),
                h('li', null, 'Basic hair Cut'),
                h('li', null, 'Basic hair Cut')
              ]),
              h('div', { className: 'p_btn' }, [
                h('button', {
                  className: 'gradient_btn',
                  onClick: () => setOrderModalPlan('Platinum Package')
                }, [h('span', null, 'Order Now')])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 9. Frequently Asked Questions Area
    h('section', { className: 'frequently_area', id: 'faq' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-lg-12' }, [
            h('div', { className: 'main_title' }, [
              h('h2', null, 'Frequently Asked Questions'),
              h('h1', null, 'Frequently Asked Questions')
            ])
          ])
        ]),
        h('div', { className: 'row frequent_inner' }, [
          h('div', { className: 'col-lg-5 col-md-5' }, [
            h('div', { className: 'frequent_item' }, [
              h('h3', null, 'We Believe that Interior beauty Lasts Long'),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              )
            ])
          ]),
          h('div', { className: 'offset-lg-2 col-lg-5 offset-md-2 col-md-5' }, [
            h('div', { className: 'frequent_item' }, [
              h('h3', null, 'We Believe that Interior beauty Lasts Long'),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              )
            ])
          ]),
          h('div', { className: 'col-lg-5 col-md-5' }, [
            h('div', { className: 'frequent_item' }, [
              h('h3', null, 'We Believe that Interior beauty Lasts Long'),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              )
            ])
          ]),
          h('div', { className: 'offset-lg-2 col-lg-5 offset-md-2 col-md-5' }, [
            h('div', { className: 'frequent_item' }, [
              h('h3', null, 'We Believe that Interior beauty Lasts Long'),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              )
            ])
          ]),
          h('div', { className: 'col-lg-5 col-md-5' }, [
            h('div', { className: 'frequent_item last-child' }, [
              h('h3', null, 'We Believe that Interior beauty Lasts Long'),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              )
            ])
          ]),
          h('div', { className: 'offset-lg-2 col-lg-5 offset-md-2 col-md-5' }, [
            h('div', { className: 'frequent_item last-child' }, [
              h('h3', null, 'We Believe that Interior beauty Lasts Long'),
              h('p', null,
                'inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that as women.'
              )
            ])
          ])
        ])
      ])
    ]),

    // 10. Latest Blog Posts Area
    h('section', { className: 'blog_area', id: 'blog' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-lg-12' }, [
            h('div', { className: 'main_title' }, [
              h('h2', null, 'Latest Blog Posts'),
              h('h1', null, 'Latest Blog Posts')
            ])
          ])
        ]),
        h('div', { className: 'row' }, [
          // Post 1
          h('div', { className: 'col-lg-4 col-md-6' }, [
            h('div', { className: 'blog_items' }, [
              h('div', { className: 'blog_img_box' }, [
                h('img', { className: 'img-fluid', src: 'img/blog_img1.svg', alt: 'Blog 1' })
              ]),
              h('div', { className: 'blog_content' }, [
                h('a', { className: 'title', href: '#blog' }, 'Portable Fashion for women'),
                h('p', null,
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
                ),
                h('div', { className: 'date' }, [
                  h('span', null, '📅 13th Dec'),
                  h('span', null, '❤️ 15'),
                  h('span', null, '💬 05')
                ])
              ])
            ])
          ]),
          // Post 2
          h('div', { className: 'col-lg-4 col-md-6' }, [
            h('div', { className: 'blog_items' }, [
              h('div', { className: 'blog_img_box' }, [
                h('img', { className: 'img-fluid', src: 'img/blog_img2.svg', alt: 'Blog 2' })
              ]),
              h('div', { className: 'blog_content' }, [
                h('a', { className: 'title', href: '#blog' }, 'Portable Fashion for women'),
                h('p', null,
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
                ),
                h('div', { className: 'date' }, [
                  h('span', null, '📅 13th Dec'),
                  h('span', null, '❤️ 15'),
                  h('span', null, '💬 05')
                ])
              ])
            ])
          ]),
          // Post 3
          h('div', { className: 'col-lg-4 hidden-md' }, [
            h('div', { className: 'blog_items' }, [
              h('div', { className: 'blog_img_box' }, [
                h('img', { className: 'img-fluid', src: 'img/blog_img3.svg', alt: 'Blog 3' })
              ]),
              h('div', { className: 'blog_content' }, [
                h('a', { className: 'title', href: '#blog' }, 'Portable Fashion for women'),
                h('p', null,
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
                ),
                h('div', { className: 'date' }, [
                  h('span', null, '📅 13th Dec'),
                  h('span', null, '❤️ 15'),
                  h('span', null, '💬 05')
                ])
              ])
            ])
          ])
        ])
      ])
    ]),

    // 11. Newsletter Area
    h('section', { className: 'newsletter_area', id: 'newsletter' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row align-items-center' }, [
          h('div', { className: 'col-lg-6 col-md-6 col-sm-12' }, [
            h('div', { className: 'newsletter_inner' }, [
              h('h1', null, 'Subscribe Our Newsletter'),
              h('p', null, 'We won’t send any kind of spam')
            ])
          ]),
          h('div', { className: 'col-lg-6 col-md-6 col-sm-12' }, [
            h('aside', { className: 'newsletter_widget' }, [
              h('form', { className: 'subscribe_form', onSubmit: handleNewsletterSubmit }, [
                h('div', { className: 'input-group d-flex flex-row' }, [
                  h('input', {
                    name: 'EMAIL',
                    placeholder: 'Enter email address',
                    type: 'email',
                    value: newsletterEmail,
                    onChange: (e) => setNewsletterEmail(e.target.value),
                    required: true
                  }),
                  h('button', { className: 'btn primary_btn', type: 'submit' }, 'Subscribe')
                ])
              ]),
              newsletterMsg && h('div', { className: 'newsletter-success' }, newsletterMsg)
            ])
          ])
        ])
      ])
    ]),

    // 12. Footer Area
    h('footer', { className: 'footer_area section_gap_top' }, [
      h('div', { className: 'container' }, [
        h('div', { className: 'row footer_inner' }, [
          h('div', { className: 'col-lg-3 col-sm-6' }, [
            h('aside', { className: 'f_widget ab_widget' }, [
              h('div', { className: 'f_title' }, [h('h4', null, 'About Farfly')]),
              h('ul', null, [
                h('li', null, 'For Business'),
                h('li', null, 'Premium Plans'),
                h('li', null, 'Reviews'),
                h('li', null, 'How it Works'),
                h('li', null, 'Farfly Blog')
              ])
            ])
          ]),
          h('div', { className: 'col-lg-3 col-sm-6' }, [
            h('aside', { className: 'f_widget ab_widget' }, [
              h('div', { className: 'f_title' }, [h('h4', null, 'Company')]),
              h('ul', null, [
                h('li', null, 'Product Tour'),
                h('li', null, 'Pricing'),
                h('li', null, 'Founding Members'),
                h('li', null, 'Case Studies'),
                h('li', null, 'Product Updates')
              ])
            ])
          ]),
          h('div', { className: 'col-lg-3 col-sm-6' }, [
            h('aside', { className: 'f_widget ab_widget' }, [
              h('div', { className: 'f_title' }, [h('h4', null, 'Support')]),
              h('ul', null, [
                h('li', null, 'Documentation'),
                h('li', null, 'Data Securiry'),
                h('li', null, 'Site Performance'),
                h('li', null, 'Action Plan'),
                h('li', null, 'Resources')
              ])
            ])
          ]),
          h('div', { className: 'col-lg-3 col-sm-6' }, [
            h('aside', { className: 'f_widget ab_widget' }, [
              h('div', { className: 'f_title' }, [h('h4', null, 'Legal')]),
              h('ul', null, [
                h('li', null, 'Terms and conditions'),
                h('li', null, 'Privacy Policy'),
                h('li', null, 'Cookie Information'),
                h('li', null, 'Opt - Out')
              ])
            ])
          ])
        ]),
        h('div', { className: 'row single-footer-widget' }, [
          h('div', { className: 'col-lg-6 col-md-6 col-sm-12' }, [
            h('div', { className: 'copy_right_text' }, [
              h('p', null, [
                'Copyright © 2026 All rights reserved | This template is made with ♡ by ',
                h('a', { href: 'https://colorlib.com', target: '_blank', rel: 'noopener' }, 'Colorlib')
              ])
            ])
          ]),
          h('div', { className: 'col-lg-6 col-md-6 col-sm-12' }, [
            h('div', { className: 'social_widget' }, [
              h('a', { href: '#', 'aria-label': 'Facebook' }, 'f'),
              h('a', { href: '#', 'aria-label': 'Twitter' }, 't'),
              h('a', { href: '#', 'aria-label': 'Dribbble' }, 'd'),
              h('a', { href: '#', 'aria-label': 'Behance' }, 'b')
            ])
          ])
        ])
      ])
    ]),

    // Modals
    videoModalOpen && h(VideoModal, { onClose: () => setVideoModalOpen(false) }),
    lightboxImage && h(LightboxModal, { image: lightboxImage, onClose: () => setLightboxImage(null) }),
    orderModalPlan && h(OrderModal, { plan: orderModalPlan, onClose: () => setOrderModalPlan(null) })
  ]);
}

// --- 5. Main App Controller ---

function App() {
  const [currentScreen, setCurrentScreen] = React.useState('welcome');
  const [activeChapterId, setActiveChapterId] = React.useState('ch1');
  const [selectedAnswerId, setSelectedAnswerId] = React.useState(null);
  const [selectedEnquiryIds, setSelectedEnquiryIds] = React.useState([]);
  const [completedChapterIds, setCompletedChapterIds] = React.useState(() =>
    safeGetStorage(STORAGE_KEYS.COMPLETED, [])
  );
  const [unlockedJournalChapterIds, setUnlockedJournalChapterIds] = React.useState(() =>
    safeGetStorage(STORAGE_KEYS.JOURNAL, [])
  );
  const [showDisclaimerModal, setShowDisclaimerModal] = React.useState(false);
  const [showRestartModal, setShowRestartModal] = React.useState(false);

  const activeChapter = CHAPTERS_DATA.find(c => c.id === activeChapterId) || CHAPTERS_DATA[0];

  // Sync to local storage
  React.useEffect(() => {
    safeSetStorage(STORAGE_KEYS.COMPLETED, completedChapterIds);
  }, [completedChapterIds]);

  React.useEffect(() => {
    safeSetStorage(STORAGE_KEYS.JOURNAL, unlockedJournalChapterIds);
  }, [unlockedJournalChapterIds]);

  const handleStartStory = (chapterId) => {
    setActiveChapterId(chapterId);
    setSelectedAnswerId(null);
    setSelectedEnquiryIds([]);
    setCurrentScreen('story');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleProceedToDocument = () => {
    setCurrentScreen('document');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleProceedToQuestion = () => {
    setSelectedAnswerId(null);
    setCurrentScreen('question');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleSelectChoice = (choiceId) => {
    setSelectedAnswerId(choiceId);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerId) {
      setCurrentScreen('feedback');
      if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
    }
  };

  const handleRetryQuestion = () => {
    setSelectedAnswerId(null);
    setCurrentScreen('question');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleProceedToEnquiryTask = () => {
    setCurrentScreen('enquiry');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleToggleEnquiry = (id) => {
    setSelectedEnquiryIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCompleteChapter = () => {
    if (!completedChapterIds.includes(activeChapter.id)) {
      setCompletedChapterIds(prev => [...prev, activeChapter.id]);
    }
    if (!unlockedJournalChapterIds.includes(activeChapter.id)) {
      setUnlockedJournalChapterIds(prev => [...prev, activeChapter.id]);
    }
    setCurrentScreen('completion');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleReplayChapter = () => {
    setSelectedAnswerId(null);
    setSelectedEnquiryIds([]);
    setCurrentScreen('story');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  const handleConfirmRestart = () => {
    safeRemoveStorage(STORAGE_KEYS.COMPLETED);
    safeRemoveStorage(STORAGE_KEYS.JOURNAL);
    setCompletedChapterIds([]);
    setUnlockedJournalChapterIds([]);
    setSelectedAnswerId(null);
    setSelectedEnquiryIds([]);
    setActiveChapterId('ch1');
    setShowRestartModal(false);
    setCurrentScreen('welcome');
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  };

  return h('div', { className: 'app-container' }, [
    h(Navbar, {
      currentScreen,
      onNavigate: (s) => {
        setCurrentScreen(s);
        if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
      },
      unlockedJournalCount: unlockedJournalChapterIds.length,
      onOpenDisclaimer: () => setShowDisclaimerModal(true),
      onOpenRestartModal: () => setShowRestartModal(true),
      hasSavedProgress: completedChapterIds.length > 0 || unlockedJournalChapterIds.length > 0,
      onStartStory: handleStartStory
    }),

    h('main', { className: 'main-content', id: 'main-content' }, [
      currentScreen === 'welcome' && h(WelcomeScreen, {
        chapters: CHAPTERS_DATA,
        completedChapterIds,
        onStartStory: handleStartStory,
        onOpenJournal: () => setCurrentScreen('journal'),
        unlockedJournalCount: unlockedJournalChapterIds.length,
        onOpenSafeguards: () => setShowDisclaimerModal(true)
      }),

      currentScreen === 'story' && h(StoryScreen, {
        chapter: activeChapter,
        onProceedToDocument: handleProceedToDocument,
        onBackToHome: () => setCurrentScreen('welcome')
      }),

      currentScreen === 'document' && h(DocumentScreen, {
        chapter: activeChapter,
        onProceedToQuestion: handleProceedToQuestion,
        onBackToStory: () => setCurrentScreen('story')
      }),

      currentScreen === 'question' && h(QuestionScreen, {
        chapter: activeChapter,
        selectedChoiceId: selectedAnswerId,
        onSelectChoice: handleSelectChoice,
        onSubmitAnswer: handleSubmitAnswer,
        onBackToDocument: () => setCurrentScreen('document')
      }),

      currentScreen === 'feedback' && selectedAnswerId && h(FeedbackScreen, {
        chapter: activeChapter,
        selectedAnswerId,
        onRetry: handleRetryQuestion,
        onProceedToEnquiryTask: handleProceedToEnquiryTask
      }),

      currentScreen === 'enquiry' && h(EnquiryTaskScreen, {
        chapter: activeChapter,
        selectedEnquiryIds,
        onToggleEnquiry: handleToggleEnquiry,
        onCompleteChapter: handleCompleteChapter,
        onBackToFeedback: () => setCurrentScreen('feedback')
      }),

      currentScreen === 'completion' && h(CompletionScreen, {
        chapter: activeChapter,
        onOpenJournal: () => setCurrentScreen('journal'),
        onBackToHome: () => setCurrentScreen('welcome'),
        onReplayChapter: handleReplayChapter
      }),

      currentScreen === 'journal' && h(JournalScreen, {
        chapters: CHAPTERS_DATA,
        unlockedChapterIds: unlockedJournalChapterIds,
        onBackToHome: () => setCurrentScreen('welcome'),
        onSelectChapter: handleStartStory
      })
    ]),

    h('footer', { className: 'footer', role: 'contentinfo' }, [
      h('div', { className: 'footer-inner' }, [
        h('p', null, [
          h('strong', null, 'PensionQuest Prototype'),
          ' — Independent educational game about UK workplace defined contribution pensions.'
        ]),
        h('p', { style: { fontSize: '0.8rem', color: 'var(--text-navy-muted)' } },
          'Not affiliated with Prudential, M&G, or any employer. Contains draft educational content for review. For official guidance, visit MoneyHelper.'
        )
      ])
    ]),

    h(DisclaimerModal, {
      isOpen: showDisclaimerModal,
      onClose: () => setShowDisclaimerModal(false)
    }),

    h(RestartConfirmModal, {
      isOpen: showRestartModal,
      onConfirm: handleConfirmRestart,
      onCancel: () => setShowRestartModal(false)
    })
  ]);
}

// Mount runtime
function mountApp() {
  rootElement = document.getElementById('root');
  rootComponentFn = App;
  performRender();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
  } else {
    mountApp();
  }
}
