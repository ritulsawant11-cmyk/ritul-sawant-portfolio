/**
 * PensionSteps - Client Application Runtime
 * Independent UK Pension-Enquiry Preparation Tool
 * Zero-dependency standalone React-compatible runtime.
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
    const childVNode = vnode.type(vnode.props);
    return renderVNode(childVNode);
  }

  const svgTags = new Set(['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text']);
  const el = svgTags.has(vnode.type)
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.type)
    : document.createElement(vnode.type);

  const props = vnode.props || {};

  Object.keys(props).forEach(key => {
    if (key === 'children') return;

    if (key.startsWith('on') && typeof props[key] === 'function') {
      const eventName = key.substring(2).toLowerCase();
      el.addEventListener(eventName, props[key]);
    } else if (key === 'className') {
      if (svgTags.has(vnode.type)) {
        el.setAttribute('class', props[key]);
      } else {
        el.className = props[key];
      }
    } else if (key === 'style' && typeof props[key] === 'object') {
      Object.assign(el.style, props[key]);
    } else if (key === 'htmlFor') {
      el.setAttribute('for', props[key]);
    } else if (key === 'checked') {
      el.checked = Boolean(props[key]);
    } else if (key === 'value') {
      el.value = props[key];
    } else {
      el.setAttribute(key, props[key]);
    }
  });

  (props.children || []).forEach(child => {
    const childNode = renderVNode(child);
    if (childNode) el.appendChild(childNode);
  });

  return el;
}

const h = React.createElement;

// --- 2. Journey Data Definitions ---

const JOURNEYS = [
  {
    id: 'old-pension-letter',
    cardTitle: '1. I received a letter about an old pension.',
    cardSummary: 'Understand why the letter was sent, verify the sender before replying, and prepare clear questions for the scheme provider.',
    tagline: 'Reviewing correspondence about an historic pension scheme',
    overview: 'Letters regarding older workplace or personal pensions often arrive following an administration review, scheme merger, change of administrator, or regulatory trace. Receiving correspondence does not automatically confirm you have an unclaimed fund or guaranteed entitlement. Before replying or disclosing personal identifiers, establish who sent the letter, why it was issued, and what records they hold.',
    regulatoryNotice: 'Important: Receiving correspondence does not confirm entitlement or the value of any pension. Always independently verify the sender’s official contact details using public registers or original scheme documentation before sharing personal details.',
    situationQuestions: [
      {
        id: 'opl-sq1',
        prompt: 'Do you recognise the employer or scheme administrator named on the letter?',
        options: [
          {
            value: 'recognise-yes',
            label: 'Yes, I recognise the employer or scheme provider',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-1a',
                label: 'Note down your approximate dates of joining and leaving that employer',
                hint: 'Having your employment years ready helps administrators match archived personnel records quickly.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'recognise-no',
            label: 'No, I do not recognise this company or provider',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-1b',
                label: 'Search the Pensions Regulator or Companies House for company history',
                hint: 'Check whether this company acquired or merged with an earlier company you worked for.',
                importance: 'essential',
                source: 'tailored',
              },
              {
                id: 'opl-tc-1c',
                label: 'Verify sender authorisation on the FCA Financial Services Register before calling',
                hint: 'Confirm the company is authorised before sharing any personal or pension details.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'recognise-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-1d',
                label: 'Check old CVs, P60 certificates, or historic bank records for company names',
                hint: 'Cross-referencing past tax years can help identify whether this was a workplace pension provider.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'opl-sq2',
        prompt: 'Is there an account, scheme, or member reference number on the correspondence?',
        options: [
          {
            value: 'ref-yes',
            label: 'Yes, a reference number is printed on the letter',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-2a',
                label: 'Keep the letter and reference number directly in front of you',
                hint: 'Quote this exact reference number when you speak to the administrator to locate your file immediately.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'ref-no',
            label: 'No, I cannot see a reference number',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-2b',
                label: 'Gather your National Insurance number and date of birth for identity tracing',
                hint: 'Without a scheme reference, administrators must search their master records by personal identifiers.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'ref-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-2c',
                label: 'Check the header and top-right margins for alphanumeric codes',
                hint: 'Member references often appear near the date or in the letter’s subject line.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'opl-sq3',
        prompt: 'Does the letter request a specific response or state a deadline date?',
        options: [
          {
            value: 'action-yes',
            label: 'Yes, it asks me to respond or return documents',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-3a',
                label: 'Highlight the response deadline and list any requested forms',
                hint: 'Establish whether the administrator requires an address confirmation form, ID proof, or retirement decision.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'action-no',
            label: 'No, it appears to be an informational update or annual statement',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-3b',
                label: 'File the statement safely and ask if ongoing contact is needed',
                hint: 'Informational statements usually require no action unless your personal details have changed.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'action-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-3c',
                label: 'Read the final paragraph or ‘Next Steps’ callout on the letter',
                hint: 'Check whether the letter asks for your confirmation or is just notifying you of scheme changes.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
    ],
    baselineChecklist: [
      {
        id: 'opl-b1',
        label: 'Locate the full name of the sender and any named pension scheme',
        hint: 'Check whether the letter references a former employer, a specific pension trust, or a third-party administration bureau.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'opl-b2',
        label: 'Establish sender legitimacy before replying',
        hint: 'Cross-check the organisation name on the FCA Financial Services Register or The Pensions Regulator website rather than unverified search ads.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'opl-b3',
        label: 'Identify the specific stated purpose of the correspondence',
        hint: 'Determine whether the letter is an informational statement, an address-tracing exercise, or a request for documentation.',
        importance: 'recommended',
        source: 'baseline',
      },
    ],
    suggestedQuestions: [
      {
        id: 'opl-q1',
        question: '“Which specific pension scheme or employer does this correspondence relate to?”',
        context: 'Clarifies whether this covers a defined benefit (final salary) scheme, defined contribution scheme, or an historic group policy.',
        tag: 'Scheme Identity',
      },
      {
        id: 'opl-q2',
        question: '“Why was this letter issued at this time, and what action, if any, is required from me?”',
        context: 'Separates routine administrative housekeeping or address tracing from time-sensitive scheme decisions.',
        tag: 'Purpose & Action',
      },
      {
        id: 'opl-q3',
        question: '“Do your records show an active or deferred pension entitlement for me, or is this an exploratory trace?”',
        context: 'Crucial for establishing whether a verified benefit actually exists under your record.',
        tag: 'Entitlement Verification',
      },
      {
        id: 'opl-q4',
        question: '“What identity checks or reference details do you require before discussing account specifics?”',
        context: 'Allows you to prepare the exact security questions they use without volunteering unnecessary sensitive information up front.',
        tag: 'Security & Access',
      },
      {
        id: 'opl-q5',
        question: '“Can you issue an official, up-to-date summary statement by post to my verified address?”',
        context: 'Provides written confirmation for your personal records rather than relying solely on telephone notes.',
        tag: 'Written Documentation',
      },
    ],
    providerOnlyItems: [
      {
        id: 'opl-po1',
        title: 'Actual benefit entitlement and scheme value',
        detail: 'Only the scheme administrator can confirm whether benefits remain payable, whether a refund was taken in the past, or what transfer/retirement value exists.',
      },
      {
        id: 'opl-po2',
        title: 'Applicable scheme rules and retirement age',
        detail: 'Normal pension age, early retirement options, death benefits, and any guaranteed annuity rates are governed solely by that specific scheme’s legal trust deed.',
      },
      {
        id: 'opl-po3',
        title: 'Official security verification requirements',
        detail: 'The provider must verify your identity according to their own anti-fraud protocols before they can disclose financial data.',
      },
    ],
  },
  {
    id: 'address-update',
    cardTitle: '2. I want to update my address.',
    cardSummary: 'Prepare to ask your provider how they receive address updates, what evidence they require, and how changes are confirmed.',
    tagline: 'Maintaining accurate contact records across your pension providers',
    overview: 'Keeping your contact details current ensures you receive annual benefit statements, regulatory notices, and retirement option packs. This website is an independent customer-preparation tool and does not connect to or update any provider’s database. Providers have strict fraud-prevention procedures for address changes to protect pension assets against identity theft.',
    regulatoryNotice: 'Important: This website cannot access or modify your pension records. You must contact your pension provider directly through their verified channels to submit address changes.',
    situationQuestions: [
      {
        id: 'addr-sq1',
        prompt: 'Are you currently paying into this pension, or is it a past pension pot?',
        options: [
          {
            value: 'status-active',
            label: 'Currently paying into it (Active workplace pension)',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-1a',
                label: 'Check whether your employer’s HR or payroll team updates the provider automatically',
                hint: 'Many workplace schemes receive address updates through company payroll rather than direct member calls.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'status-deferred',
            label: 'Past pension (Deferred / Frozen / Personal policy)',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-1b',
                label: 'Note down the name of the employer linked to this scheme and the year you left',
                hint: 'Providers handling older deferred pots use employment departure dates for secondary security checks.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'status-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-1c',
                label: 'Ask the provider whether your plan is currently active or deferred',
                hint: 'This determines whether address changes must be submitted via your employer or directly to the provider.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'addr-sq2',
        prompt: 'Do you have more than one pension plan or pot with this provider?',
        options: [
          {
            value: 'pots-multiple',
            label: 'Yes, I hold multiple policies or plans with them',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-2a',
                label: 'Prepare to ask the provider to apply the address update across ALL linked policies',
                hint: 'Updating one policy number does not always update linked AVCs, preserved pots, or group policies.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'pots-single',
            label: 'Just one single policy',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-2b',
                label: 'Have your single policy or plan number to hand',
                hint: 'Have your latest policy statement or annual summary available for reference.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'pots-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-2c',
                label: 'Ask the administrator to search for any other historic policies linked to your details',
                hint: 'Ensure no older preserved pots remain registered under your old address.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'addr-sq3',
        prompt: 'Do you have recent proof of your new address (e.g. utility bill or council tax letter)?',
        options: [
          {
            value: 'proof-yes',
            label: 'Yes, I have an official document dated within the last 3 months',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-3a',
                label: 'Keep a clean copy of your recent utility bill or bank statement ready',
                hint: 'Check whether the provider accepts digital uploads, PDF emails, or certified postal paper copies.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'proof-no',
            label: 'Not yet / Recently moved',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-3b',
                label: 'Ask the provider what evidence they require if formal bills have not yet arrived',
                hint: 'Inquire whether a tenancy agreement, solicitor completion letter, or driving licence is accepted.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'proof-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-3c',
                label: 'Ask whether they can update verbal security over the phone or require physical proof',
                hint: 'Some providers update standard addresses via phone security questions; others mandate documentary proof.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
    ],
    baselineChecklist: [
      {
        id: 'addr-b1',
        label: 'Locate your existing policy, scheme, or member reference number',
        hint: 'Find an old annual benefit statement, welcome pack, or payslip showing your scheme reference.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'addr-b2',
        label: 'Write down your exact old address as recorded on past statements',
        hint: 'Providers will ask for your previous address as part of anti-fraud identity verification before updating records.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'addr-b3',
        label: 'Prepare your full new postal address including postcode',
        hint: 'Ensure you have the exact Royal Mail format postcode to prevent delayed correspondence.',
        importance: 'essential',
        source: 'baseline',
      },
    ],
    suggestedQuestions: [
      {
        id: 'addr-q1',
        question: '“What is your official process for updating a member’s address on this scheme?”',
        context: 'Find out whether changes can be completed over the phone, via an online member portal, or require a signed paper form.',
        tag: 'Submission Process',
      },
      {
        id: 'addr-q2',
        question: '“Do you require documentary evidence of my new address, and what formats are accepted?”',
        context: 'Clarifies whether you need to send certified copies of utility bills, council tax statements, or driving licences.',
        tag: 'Verification Requirements',
      },
      {
        id: 'addr-q3',
        question: '“How will you confirm that the address change has been successfully processed?”',
        context: 'Establishes whether written confirmation is posted to the old address, new address, or sent by secure email.',
        tag: 'Confirmation Mechanism',
      },
      {
        id: 'addr-q4',
        question: '“Will this update automatically apply to all pension policies or funds I hold with your organisation?”',
        context: 'Prevents situation where one plan is updated but another historic policy remains under your old address.',
        tag: 'Scope of Update',
      },
      {
        id: 'addr-q5',
        question: '“Can you issue my next annual statement to this new address once the update is complete?”',
        context: 'Ensures your updated records are actively linked to regular statutory communications.',
        tag: 'Future Statements',
      },
    ],
    providerOnlyItems: [
      {
        id: 'addr-po1',
        title: 'Updating the live scheme database',
        detail: 'Only your pension provider’s administration team can alter account records, contact information, and postal destinations.',
      },
      {
        id: 'addr-po2',
        title: 'Deciding acceptable forms of identity verification',
        detail: 'Each provider sets their own risk-based anti-money laundering and address-verification standards in accordance with UK regulations.',
      },
      {
        id: 'addr-po3',
        title: 'Issuing official confirmation letters',
        detail: 'Confirmation notices and amended account documentation can only be generated and issued by the provider’s authorised systems.',
      },
    ],
  },
  {
    id: 'third-party-help',
    cardTitle: '3. I want someone to help with my pension enquiries.',
    cardSummary: 'Understand provider authorisation processes, identify required permissions, and establish the scope of representative support.',
    tagline: 'Navigating third-party authorisation and representative boundaries',
    overview: 'Under UK data protection laws, pension administrators cannot discuss personal details with a relative, friend, or advocate without explicit member consent. Authorisation mechanisms range from single-call verbal permission to formal third-party mandates and registered Powers of Attorney. General authority typically permits information gathering only, not financial transactions.',
    regulatoryNotice: 'Important: General third-party authority does not permit representative financial decision-making or fund withdrawals, and is not a substitute for a registered Lasting Power of Attorney (LPA).',
    situationQuestions: [
      {
        id: 'tph-sq1',
        prompt: 'What level of assistance is needed?',
        options: [
          {
            value: 'help-verbal',
            label: 'Speaking on the phone on the member’s behalf during a single call',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-1a',
                label: 'Ensure the member is present at the start of the call to pass security',
                hint: 'The member can answer initial security checks and grant verbal consent for the helper to speak.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'help-ongoing',
            label: 'Managing correspondence and plan administration ongoing',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-1b',
                label: 'Request the provider’s formal Letter of Authority or Third-Party Mandate form',
                hint: 'Ask what specific authority scope they recognize and how long the mandate remains valid.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'help-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-1c',
                label: 'Ask the provider what forms of third-party authority they support',
                hint: 'Clarify whether telephone verbal authority is sufficient or if written authority is required.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'tph-sq2',
        prompt: 'Is there an officially registered Lasting Power of Attorney (LPA) in place?',
        options: [
          {
            value: 'lpa-yes',
            label: 'Yes, an LPA for Property and Financial Affairs is registered',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-2a',
                label: 'Obtain an Office of the Public Guardian (OPG) digital share code or certified copy',
                hint: 'Most modern UK pension providers verify LPAs digitally via GOV.UK using an OPG access code.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'lpa-no',
            label: 'No registered Power of Attorney',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-2b',
                label: 'Remember: general authority only permits enquiries, not withdrawals or transfers',
                hint: 'Without an LPA, helpers cannot instruct payment withdrawals, investment changes, or scheme transfers.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'lpa-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-2c',
                label: 'Confirm whether any existing mandate covers Property and Financial Affairs',
                hint: 'Health and Welfare LPAs do not grant authority to manage pensions or financial matters.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'tph-sq3',
        prompt: 'Will the pension account holder be able to join the phone call?',
        options: [
          {
            value: 'member-present',
            label: 'Yes, the member will be beside the phone',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-3a',
                label: 'Brief the member on the questions before calling so they can give consent comfortably',
                hint: 'The call handler will ask the member to state their name and confirm permission for you to speak.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'member-unable',
            label: 'No, the member cannot be on the phone call',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-3b',
                label: 'Ensure formal third-party authority is on file with the provider before ringing',
                hint: 'Without the member present or formal paperwork logged, call handlers cannot disclose account information.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'member-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-3c',
                label: 'Ask what communication adjustments the provider offers for vulnerable or unwell members',
                hint: 'Many providers have dedicated vulnerable-customer teams and accessible communication arrangements.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
    ],
    baselineChecklist: [
      {
        id: 'tph-b1',
        label: 'Identify the exact scope of help required',
        hint: 'Decide whether you only need help making a one-off phone enquiry or ongoing management of incoming correspondence.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'tph-b2',
        label: 'Prepare the scheme member’s verification details',
        hint: 'Have the member’s full legal name, date of birth, current address, and scheme reference ready.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'tph-b3',
        label: 'Have the representative’s identification details ready',
        hint: 'Providers will take the representative’s full name, address, relationship to the member, and contact telephone number.',
        importance: 'recommended',
        source: 'baseline',
      },
    ],
    suggestedQuestions: [
      {
        id: 'tph-q1',
        question: '“What is your procedure for logging third-party authority on this account?”',
        context: 'Determines whether verbal consent during the call is adequate or if a formal written mandate form must be completed.',
        tag: 'Authorisation Process',
      },
      {
        id: 'tph-q2',
        question: '“Can the member give verbal authority on this call for me to speak on their behalf?”',
        context: 'Allows immediate assistance on standard queries if the member is present to pass initial security checks.',
        tag: 'Verbal Consent',
      },
      {
        id: 'tph-q3',
        question: '“What specific actions does this third-party authority permit or restrict?”',
        context: 'Clarifies boundaries: usually permits receiving statements and asking administrative questions, but forbids withdrawals.',
        tag: 'Scope & Limits',
      },
      {
        id: 'tph-q4',
        question: '“How long does this third-party authority remain valid on your records?”',
        context: 'Identifies whether permission expires after the single call, after 12 months, or remains indefinitely until revoked.',
        tag: 'Validity Duration',
      },
      {
        id: 'tph-q5',
        question: '“What documentation is required if managing affairs under a Power of Attorney?”',
        context: 'Ensures attorneys provide the exact registration format needed (such as an OPG digital share code or certified copy).',
        tag: 'Power of Attorney',
      },
    ],
    providerOnlyItems: [
      {
        id: 'tph-po1',
        title: 'Validation and recording of third-party mandates',
        detail: 'Only the provider’s legal compliance team can approve third-party representation and log the authorized representative on your file.',
      },
      {
        id: 'tph-po2',
        title: 'Acceptance criteria for Powers of Attorney',
        detail: 'Providers verify donor and attorney identity, check OPG digital access codes, and ensure the LPA is registered for Property and Financial Affairs.',
      },
      {
        id: 'tph-po3',
        title: 'Scheme-specific restrictions on representative instructions',
        detail: 'Certain trust-based schemes prohibit representatives from executing particular scheme options without direct member countersignature.',
      },
    ],
  },
];

// --- 3. UI Components ---

function Header({ onHomeClick, onAboutClick, onJourneysClick, onHowItWorksClick }) {
  return h(
    'header',
    { className: 'site-header', role: 'banner' },
    h(
      'div',
      { className: 'container header-inner' },
      h(
        'button',
        {
          type: 'button',
          onClick: onHomeClick,
          className: 'brand brand-link',
          'aria-label': 'PensionSteps Home',
        },
        h('span', { className: 'brand-mark', 'aria-hidden': 'true' }, 'p'),
        h(
          'div',
          { className: 'brand-title-wrap' },
          h('span', { className: 'brand-name' }, 'PensionSteps'),
          h('span', { className: 'brand-pill-badge' }, 'Pension Enquiry Preparation')
        )
      ),
      h(
        'nav',
        { className: 'site-nav header-nav', 'aria-label': 'Main menu' },
        h('button', { type: 'button', onClick: onJourneysClick, className: 'nav-link' }, 'Enquiry guides'),
        h('button', { type: 'button', onClick: onHowItWorksClick, className: 'nav-link' }, 'How it works'),
        h('button', { type: 'button', onClick: onAboutClick, className: 'nav-link', 'aria-haspopup': 'dialog' }, 'About'),
        h('a', { href: '#faq-main-title', className: 'nav-link' }, 'FAQ')
      ),
      h(
        'div',
        { className: 'header-action-group' },
        h(
          'button',
          { type: 'button', onClick: onJourneysClick, className: 'btn btn-primary btn-sm btn-header-cta' },
          h('span', null, 'Prepare my enquiry')
        )
      )
    )
  );
}

function Hero({ onFindNextStep, onHowItWorksClick }) {
  return h(
    'section',
    { className: 'hero hero-section', 'aria-labelledby': 'hero-main-heading' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'hero-grid' },
        // Left Column Content: Heading, explanation, primary CTA
        h(
          'div',
          { className: 'hero-left-col' },
          h(
            'div',
            { className: 'availability hero-service-badge' },
            'Independent pension-enquiry preparation tool'
          ),
          h(
            'h1',
            { id: 'hero-main-heading', className: 'hero-headline' },
            'Your pension enquiry, ',
            h('em', null, 'organised.')
          ),
          h(
            'p',
            { className: 'hero-intro hero-subtext' },
            'Prepare your questions and create a clear checklist before contacting your pension provider. Know what to ask, what to have ready, and what to note down—before you contact your provider.'
          ),
          h(
            'div',
            { className: 'hero-actions hero-buttons-row' },
            h(
              'button',
              { type: 'button', className: 'btn btn-primary btn-primary-teal', onClick: onFindNextStep, id: 'hero-prepare-btn' },
              h('span', null, 'Prepare my enquiry'),
              h('span', { className: 'btn-arrow-icon', 'aria-hidden': 'true' }, ' →')
            ),
            h(
              'button',
              { type: 'button', className: 'btn btn-ghost btn-secondary-link', onClick: onHowItWorksClick },
              h('span', null, 'See how it works')
            )
          ),
          h(
            'div',
            { className: 'hero-reassurance-text' },
            'Free to use. No account needed. Independent preparation—not financial advice.'
          )
        ),
        // Right Column: Fieldnotes Notebook Call-Plan Preview
        h(
          'div',
          { className: 'hero-preview-col', 'aria-label': 'Example call plan preview' },
          h(
            'div',
            { className: 'notebook example-plan-card' },
            h(
              'div',
              { className: 'notebook-top example-plan-top-bar' },
              h('span', { className: 'example-plan-badge' }, 'PENSIONSTEPS CALL PLAN • YOUR CALL PLAN'),
              h('span', { className: 'example-plan-chip' }, 'A4 Printable • Example')
            ),
            h('h2', { className: 'notebook-title' }, 'Example call plan'),
            h(
              'div',
              { className: 'plan-preview-sections' },
              h(
                'div',
                { className: 'preview-block example-plan-section' },
                h('div', { className: 'preview-block-heading plan-section-label' }, 'What I want to discuss'),
                h('div', { className: 'preview-block-content' }, 'Found an old pension letter from a former employer scheme. Check current status, scheme administrator contact details, and transfer value.')
              ),
              h(
                'div',
                { className: 'preview-block example-plan-section' },
                h('div', { className: 'preview-block-heading plan-section-label' }, 'Information to have ready / Before you call'),
                h(
                  'ul',
                  { className: 'example-checklist-list', style: { listStyle: 'none', padding: 0, margin: 0 } },
                  h('li', null, '✓ Letter reference & policy number'),
                  h('li', null, '✓ National Insurance number'),
                  h('li', null, '✓ Former employer start & leave dates')
                )
              ),
              h(
                'div',
                { className: 'preview-block example-plan-section' },
                h('div', { className: 'preview-block-heading plan-section-label' }, 'Questions to ask'),
                h(
                  'div',
                  { className: 'example-question-box' },
                  h('div', { className: 'example-q-item' }, '1. What information is needed to confirm my record?'),
                  h('div', { className: 'example-q-item' }, '2. What happens next and what are current processing times?')
                )
              ),
              h(
                'div',
                { className: 'preview-block' },
                h('div', { className: 'preview-block-heading' }, 'Notes and next steps'),
                h('div', { className: 'preview-block-content' }, 'Adviser name: ___________________ | Ref: _________')
              )
            ),
            h(
              'div',
              { className: 'stamp', 'aria-hidden': 'true' },
              'EXAMPLE',
              h('br', null),
              'CALL PLAN',
              h('br', null),
              '✳'
            )
          )
        )
      )
    )
  );
}

function JourneyCards({ journeys, onSelectJourney }) {
  const renderCardIcon = (index) => {
    switch (index) {
      case 0:
        return h(
          'svg',
          { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
          h('rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }),
          h('path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' })
        );
      case 1:
        return h(
          'svg',
          { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
          h('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }),
          h('circle', { cx: '12', cy: '10', r: '3' })
        );
      case 2:
      default:
        return h(
          'svg',
          { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
          h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
          h('circle', { cx: '9', cy: '7', r: '4' }),
          h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
          h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
        );
    }
  };

  const getShortTitle = (id, fullTitle) => {
    switch (id) {
      case 'old-pension-letter':
        return 'Old pension letter';
      case 'address-update':
        return 'Address update';
      case 'third-party-help':
        return 'Someone helping you';
      default:
        return fullTitle.replace(/^\d+\.\s*/, '');
    }
  };

  return h(
    'section',
    { id: 'journeys-section', className: 'section journeys-section-area', 'aria-labelledby': 'journeys-heading-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '01 / ENQUIRY GUIDES'),
        h(
          'h2',
          { id: 'journeys-heading-title', className: 'section-title section-main-heading' },
          'What do you need help ',
          h('em', null, 'with?')
        ),
        h('p', { className: 'section-sub section-lead-paragraph' }, 'What would you like help preparing for? Select your pension administration situation below to prepare questions and build your printable call plan.')
      ),
      h(
        'div',
        { className: 'journey-cards-grid', role: 'list' },
        journeys.map((j, index) => {
          const shortTitle = getShortTitle(j.id, j.cardTitle);
          return h(
            'article',
            {
              key: j.id,
              role: 'listitem',
              className: 'project-card journey-selection-card',
              onClick: () => onSelectJourney(j.id),
              onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectJourney(j.id);
                }
              },
              tabIndex: 0,
              'aria-label': `Open preparation guide: ${shortTitle}`,
            },
            h(
              'div',
              { className: 'card-top-header' },
              h('div', { className: 'card-icon-container', 'aria-hidden': 'true' }, renderCardIcon(index))
            ),
            h('div', { className: 'project-meta' }, `GUIDE 0${index + 1}`),
            h('h3', { className: 'card-title-heading' }, shortTitle),
            h('p', { className: 'card-summary-desc' }, j.cardSummary),
            h(
              'div',
              { className: 'card-bottom-action' },
              h(
                'div',
                { className: 'btn-card-link' },
                h('span', null, 'Prepare this enquiry'),
                h('span', { className: 'btn-card-arrow-circle', 'aria-hidden': 'true' }, '→')
              )
            )
          );
        })
      )
    )
  );
}

function HowItWorksSection() {
  return h(
    'section',
    { id: 'how-it-works-section', className: 'section how-it-works-section', 'aria-labelledby': 'how-it-works-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '02 / HOW IT WORKS'),
        h(
          'h2',
          { id: 'how-it-works-title', className: 'section-title section-main-heading' },
          'Three simple ',
          h('em', null, 'steps.')
        ),
        h('p', { className: 'section-sub section-lead-paragraph' }, 'Prepare in three simple steps. Preparing beforehand keeps your call structured, prevents missed questions, and avoids delays.')
      ),
      h(
        'div',
        { className: 'how-it-works-grid' },
        h(
          'div',
          { className: 'how-step-card' },
          h('span', { className: 'how-step-badge' }, '01'),
          h('h3', { className: 'how-step-title' }, 'Choose your enquiry'),
          h('p', { className: 'how-step-desc' }, 'Select the situation you want to discuss with your provider—an unexpected letter, an address update, or representative help.')
        ),
        h(
          'div',
          { className: 'how-step-card' },
          h('span', { className: 'how-step-badge' }, '02'),
          h('h3', { className: 'how-step-title' }, 'Prepare your questions'),
          h('p', { className: 'how-step-desc' }, 'Work through a targeted checklist and select the specific questions you need to ask your pension provider.')
        ),
        h(
          'div',
          { className: 'how-step-card' },
          h('span', { className: 'how-step-badge' }, '03'),
          h('h3', { className: 'how-step-title' }, 'Print your plan'),
          h('p', { className: 'how-step-desc' }, 'Keep your plan beside you when you contact your provider. Print your call plan or download a 1-page PDF worksheet with space for reference numbers and notes.')
        )
      )
    )
  );
}

function SafeguardsSection({ onAboutClick }) {
  return h(
    'section',
    { id: 'about-section', className: 'section safeguards-split-section', 'aria-labelledby': 'about-section-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '03 / ABOUT'),
        h(
          'h2',
          { id: 'about-section-title', className: 'section-title section-main-heading' },
          'About ',
          h('em', null, 'PensionSteps.')
        )
      ),
      h(
        'div',
        { className: 'about-grid safeguards-split-grid' },
        h(
          'div',
          { className: 'about-content-col safeguards-content-col' },
          h('p', { className: 'about-copy' }, 'PensionSteps helps you prepare for pension administration conversations with clearer questions and a practical call plan.'),
          h('p', { className: 'about-sub section-lead-paragraph' }, 'Pension administration can feel daunting when you are unfamiliar with provider terminology. Having your reference details and questions ready helps you get clear answers without awkward pauses or delay.'),
          h(
            'div',
            { className: 'safeguards-btn-wrap', style: { marginTop: '24px' } },
            h(
              'button',
              { type: 'button', className: 'btn btn-secondary btn-primary-teal', onClick: onAboutClick },
              h('span', null, 'Read our full safeguards & service boundaries'),
              h('span', { 'aria-hidden': 'true' }, ' →')
            )
          )
        ),
        h(
          'div',
          { className: 'about-skills-col' },
          h(
            'ul',
            { className: 'skill-list safeguards-pill-list' },
            h('li', null, '✓ Free to use'),
            h('li', null, '✓ No account needed'),
            h('li', null, '✓ Zero personal data collected'),
            h('li', null, '✓ Independent preparation — not financial advice'),
            h('li', null, '✓ Not a pension provider'),
            h('li', null, '✓ Plain English checklists'),
            h('li', null, '✓ Printable 1-page call plan'),
            h('li', null, '✓ In-memory browser session only')
          )
        )
      )
    )
  );
}

function FAQSection() {
  return h(
    'section',
    { id: 'faq-section', className: 'section faq-section', 'aria-labelledby': 'faq-main-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '04 / FAQ'),
        h(
          'h2',
          { id: 'faq-main-title', className: 'section-title section-main-heading' },
          'Frequently asked ',
          h('em', null, 'questions.')
        ),
        h('p', { className: 'section-sub section-lead-paragraph' }, 'Understanding the purpose and service boundaries of PensionSteps before you contact your provider.')
      ),
      h(
        'div',
        { className: 'faq-grid' },
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' Is PensionSteps a pension provider?'),
          h('p', { className: 'faq-answer-text' }, 'No. PensionSteps is an independent customer-preparation tool. It is not a pension provider, financial adviser, account portal, or service that submits requests to pension providers. It does not manage, hold, or administer pension funds. Receiving correspondence does not confirm entitlement to benefits.')
        ),
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' Can PensionSteps access my pension account?'),
          h('p', { className: 'faq-answer-text' }, 'No. This website cannot access or modify your pension records. All checklists and custom notes stay purely in your browser’s temporary memory during your current visit and reset when you start again. Zero personal data collected.')
        ),
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' Does this website provide financial advice?'),
          h('p', { className: 'faq-answer-text' }, 'No. PensionSteps provides administrative organisation checklists and suggested conversational wording. It is Not Regulated Financial Advice under the UK Financial Services and Markets Act 2000. General authority is not a substitute for a registered Lasting Power of Attorney.')
        ),
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' What should I check with my provider?'),
          h('p', { className: 'faq-answer-text' }, 'Check identity verification requirements, policy reference formats, scheme administrator contact details, and expected processing timescales directly with your verified scheme administrator.')
        )
      )
    )
  );
}

function CTACalloutSection({ onFindNextStep }) {
  return h(
    'section',
    { className: 'section cta-callout-section', 'aria-labelledby': 'cta-callout-heading' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'contact-panel cta-callout-card' },
        h(
          'div',
          { className: 'contact-panel-content cta-callout-text' },
          h(
            'h2',
            { id: 'cta-callout-heading', className: 'cta-callout-title' },
            'Ready to prepare your ',
            h('em', null, 'enquiry?')
          ),
          h('p', { className: 'cta-callout-desc' }, 'Pick your situation, check off what you have, and print your 1-page worksheet in minutes. Prepare for my enquiry with confidence.')
        ),
        h(
          'div',
          null,
          h(
            'button',
            { type: 'button', className: 'btn btn-primary btn-callout-action', onClick: onFindNextStep },
            h('span', null, 'Prepare for my enquiry'),
            h('span', { 'aria-hidden': 'true' }, ' →')
          )
        )
      )
    )
  );
}

// --- Journey Flow Components ---

function StepSituation({ questions, answers, onSelectOption, onNext, onBackToJourneys, onStartAgain }) {
  const answeredCount = questions.filter(q => !!answers[q.id]).length;

  return h(
    'div',
    { className: 'content-section-panel', 'aria-labelledby': 'step1-title' },
    h(
      'div',
      { className: 'panel-header-row' },
      h(
        'div',
        null,
        h('div', { className: 'step-counter-pill' }, 'Step 1 of 3'),
        h('h3', { id: 'step1-title', className: 'panel-title' }, 'Your Situation'),
        h('p', { className: 'panel-desc' }, 'Answer these 3 quick questions so we can tailor your preparation checklist. None of these questions ask for your name, dates, or policy numbers.')
      ),
      h('div', { className: 'progress-pill-badge', 'aria-live': 'polite' }, `${answeredCount} of ${questions.length} Answered`)
    ),
    h(
      'div',
      { className: 'situation-questions-stack' },
      questions.map((question, qIndex) => {
        const currentAnswer = answers[question.id];
        return h(
          'fieldset',
          { key: question.id, className: 'situation-question-card' },
          h(
            'legend',
            { className: 'situation-question-prompt' },
            h('span', { className: 'question-number-dot' }, String(qIndex + 1)),
            h('span', null, question.prompt)
          ),
          h(
            'div',
            { className: 'situation-options-group', role: 'radiogroup', 'aria-label': question.prompt },
            question.options.map(option => {
              const isSelected = currentAnswer === option.value;
              return h(
                'label',
                {
                  key: option.value,
                  className: `situation-option-card ${isSelected ? 'selected' : ''}`,
                },
                h('input', {
                  type: 'radio',
                  name: `question-${question.id}`,
                  value: option.value,
                  checked: isSelected,
                  onChange: () => onSelectOption(question.id, option.value),
                  className: 'situation-radio-input',
                }),
                h(
                  'span',
                  { className: 'option-radio-custom', 'aria-hidden': 'true' },
                  isSelected ? h('span', { className: 'option-radio-inner' }) : null
                ),
                h('span', { className: 'option-label-text' }, option.label)
              );
            })
          )
        );
      })
    ),
    h(
      'div',
      { className: 'flow-navigation-bar no-print' },
      h(
        'div',
        { className: 'flow-nav-left' },
        h('button', { type: 'button', className: 'btn-flow-back', onClick: onBackToJourneys }, '← Choose a different enquiry'),
        h('button', { type: 'button', className: 'btn-flow-reset', onClick: onStartAgain }, 'Start again')
      ),
      h(
        'div',
        { className: 'flow-nav-right' },
        h(
          'button',
          { type: 'button', className: 'btn-flow-next', onClick: onNext },
          h('span', null, 'Continue to Step 2: Get ready'),
          h('span', { 'aria-hidden': 'true' }, ' →')
        )
      )
    )
  );
}

function StepChecklist({ checklist, checkedItems, onToggleItem }) {
  const completedCount = checklist.filter(item => !!checkedItems[item.id]).length;
  const totalCount = checklist.length;

  return h(
    'section',
    { className: 'content-sub-block', 'aria-labelledby': 'checklist-title' },
    h(
      'div',
      { className: 'sub-block-header' },
      h(
        'div',
        null,
        h('h4', { id: 'checklist-title', className: 'sub-block-title' }, 'Tailored Preparation Checklist'),
        h('p', { className: 'sub-block-desc' }, 'Check off each item as you locate paperwork and verify key information. This builds your telephone readiness.')
      ),
      h('div', { className: 'progress-pill-badge', 'aria-live': 'polite' }, `${completedCount} of ${totalCount} Completed`)
    ),
    h(
      'div',
      { className: 'checklist-stack', role: 'group', 'aria-label': 'Preparation checklist items' },
      checklist.map(item => {
        const isCompleted = !!checkedItems[item.id];
        return h(
          'div',
          {
            key: item.id,
            className: `checklist-card-row ${isCompleted ? 'completed' : ''}`,
            onClick: () => onToggleItem(item.id),
          },
          h('input', {
            type: 'checkbox',
            id: `check-${item.id}`,
            className: 'checklist-checkbox-input',
            checked: isCompleted,
            onChange: () => onToggleItem(item.id),
            onClick: (e) => e.stopPropagation(),
            'aria-describedby': `hint-${item.id}`,
          }),
          h(
            'div',
            { className: 'checklist-card-content' },
            h(
              'div',
              { className: 'checklist-header-line' },
              h('label', { htmlFor: `check-${item.id}`, className: 'checklist-item-title', onClick: (e) => e.stopPropagation() }, item.label),
              h(
                'span',
                { className: `checklist-state-tag ${isCompleted ? 'done' : 'todo'}`, 'aria-label': `Status: ${isCompleted ? 'Completed' : 'To check'}` },
                h('span', { 'aria-hidden': 'true' }, isCompleted ? '✓ ' : '○ '),
                h('span', null, isCompleted ? 'Completed' : 'To check')
              )
            ),
            h('p', { id: `hint-${item.id}`, className: 'checklist-hint-text' }, item.hint)
          )
        );
      })
    )
  );
}

function StepQuestions({ questions, selectedQuestionIds, onToggleQuestion }) {
  const [copiedId, setCopiedId] = React.useState(null);

  const handleCopy = async (id, text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const selectedCount = questions.filter(q => !!selectedQuestionIds[q.id]).length;

  return h(
    'section',
    { className: 'content-sub-block', 'aria-labelledby': 'questions-heading' },
    h(
      'div',
      { className: 'sub-block-header' },
      h(
        'div',
        null,
        h('h4', { id: 'questions-heading', className: 'sub-block-title' }, 'Suggested Questions to Ask'),
        h('p', { className: 'sub-block-desc' }, 'Add these questions to your call plan so you can read them directly during your call or use them in written correspondence.')
      ),
      h('div', { className: 'progress-pill-badge', 'aria-live': 'polite' }, `${selectedCount} of ${questions.length} Selected`)
    ),
    h(
      'div',
      { className: 'questions-card-stack', role: 'group', 'aria-label': 'Suggested provider questions list' },
      questions.map(q => {
        const isSelected = !!selectedQuestionIds[q.id];
        return h(
          'article',
          { key: q.id, className: `question-card ${isSelected ? 'selected' : ''}` },
          h('span', { className: 'question-tag-chip' }, q.tag),
          h('p', { className: 'question-quote-text' }, q.question),
          h('p', { className: 'question-aim-text' }, h('strong', null, 'Why ask: '), q.context),
          h(
            'div',
            { className: 'question-buttons-row' },
            h(
              'button',
              {
                type: 'button',
                className: `btn-queue-toggle ${isSelected ? 'active' : ''}`,
                onClick: () => onToggleQuestion(q.id),
                'aria-pressed': isSelected,
              },
              h('span', { 'aria-hidden': 'true' }, isSelected ? '✓ ' : '+ '),
              h('span', null, isSelected ? 'Saved to call plan' : 'Add to call plan')
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'btn-copy-chip',
                onClick: () => handleCopy(q.id, q.question),
                'aria-label': `Copy question wording: ${q.question}`,
              },
              h('span', null, copiedId === q.id ? '✓ Copied' : 'Copy question')
            )
          )
        );
      })
    )
  );
}

function StepProviderLimits({ providerOnlyItems }) {
  return h(
    'aside',
    { className: 'provider-limits-wrapper', 'aria-labelledby': 'provider-limits-title' },
    h('div', { className: 'limits-eyebrow' }, 'Important Service Boundaries'),
    h('h4', { id: 'provider-limits-title', className: 'limits-title-text' }, 'What only your authorised pension provider can confirm'),
    h('p', { className: 'limits-intro-p' }, 'PensionSteps is an independent customer-preparation guide. For legal and data security reasons, only your scheme administrator has access to your records and can confirm or process the following:'),
    h(
      'div',
      { className: 'limits-boxes-grid', role: 'list' },
      providerOnlyItems.map(item =>
        h(
          'div',
          { key: item.id, className: 'limit-item-card', role: 'listitem' },
          h('h5', null, item.title),
          h('p', null, item.detail)
        )
      )
    )
  );
}

function StepActionPlan({
  journey,
  situationAnswers,
  fullChecklist,
  checkedItems,
  selectedQuestionIds,
  userNotes,
  onNotesChange,
  onPrint,
  onStartAgain,
  onBackToStep2,
}) {
  const completedChecklist = fullChecklist.filter(item => !!checkedItems[item.id]);
  const pendingChecklist = fullChecklist.filter(item => !checkedItems[item.id]);
  const selectedQuestions = journey.suggestedQuestions.filter(q => !!selectedQuestionIds[q.id]);
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPdf = () => {
    const streamContent = [];
    streamContent.push('BT');
    streamContent.push('/F2 16 Tf');
    streamContent.push('50 780 Td');
    streamContent.push('(PensionSteps - Call Plan) Tj');
    streamContent.push('ET');

    streamContent.push('BT');
    streamContent.push('/F1 10 Tf');
    streamContent.push('50 762 Td');
    streamContent.push(`(Enquiry: ${journey.cardTitle.replace(/[\(\)]/g, '')} | Date: ${currentDate}) Tj`);
    streamContent.push('ET');

    streamContent.push('0.5 w');
    streamContent.push('50 750 m');
    streamContent.push('545 750 l');
    streamContent.push('S');

    const sections = [
      {
        heading: '1. Checklist Items Completed',
        lines: completedChecklist.length > 0 
          ? completedChecklist.map(c => `[x] ${c.text}`)
          : ['(None marked as done yet)']
      },
      {
        heading: '2. Pending Checklist Items to Gather',
        lines: pendingChecklist.length > 0
          ? pendingChecklist.map(c => `[ ] ${c.text}`)
          : ['(All items completed)']
      },
      {
        heading: '3. Questions to Ask Provider',
        lines: selectedQuestions.length > 0
          ? selectedQuestions.map((q, i) => `${i + 1}. ${q.text}`)
          : ['(No specific questions selected)']
      },
      {
        heading: '4. Provider Boundaries',
        lines: journey.providerBoundaries.map(b => `- ${b}`)
      },
      {
        heading: '5. Call Notes & Reference Log',
        lines: [
          'Adviser Name: _______________________  Date & Time: _______________________',
          'Call Reference Number: __________________________________________________',
          userNotes ? `Custom Notes: ${userNotes}` : 'Custom Notes: (Leave blank or write notes during call)'
        ]
      }
    ];

    let currentY = 725;
    for (const sec of sections) {
      streamContent.push('BT');
      streamContent.push('/F2 11 Tf');
      streamContent.push(`50 ${currentY} Td`);
      streamContent.push(`(${sec.heading.replace(/[\(\)]/g, '')}) Tj`);
      streamContent.push('ET');
      currentY -= 16;

      streamContent.push('BT');
      streamContent.push('/F1 9 Tf');
      streamContent.push(`50 ${currentY} Td`);
      for (const line of sec.lines) {
        streamContent.push(`(${line.replace(/[\(\)]/g, '')}) Tj`);
        streamContent.push('0 -13 Td');
        currentY -= 13;
      }
      streamContent.push('ET');
      currentY -= 10;
    }

    // Footer
    streamContent.push('0.5 w');
    streamContent.push('50 55 m');
    streamContent.push('545 55 l');
    streamContent.push('S');
    streamContent.push('BT');
    streamContent.push('/F1 8 Tf');
    streamContent.push('50 42 Td');
    streamContent.push('(PensionSteps - Independent UK Pension Enquiry Preparation - No Personal Data Stored) Tj');
    streamContent.push('ET');

    const streamText = streamContent.join('\n');
    const streamLen = new TextEncoder().encode(streamText).length;

    const body = [
      '%PDF-1.4',
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      `6 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamText}\nendstream\nendobj`
    ];

    const offsets = [];
    let rawPdf = '';
    for (const obj of body) {
      offsets.push(new TextEncoder().encode(rawPdf).length);
      rawPdf += obj + '\n';
    }

    const xrefOffset = new TextEncoder().encode(rawPdf).length;
    rawPdf += 'xref\n0 7\n0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i++) {
      rawPdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    rawPdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([rawPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PensionSteps_Call_Plan_${journey.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return h(
    'div',
    { className: 'call-plan-layout-box' },
    h(
      'div',
      { className: 'call-plan-print-banner', 'aria-hidden': 'true' },
      h('h1', null, 'PensionSteps — Call Plan'),
      h('p', null, `Date prepared: ${currentDate} | Enquiry: ${journey.cardTitle}`),
      h('p', null, 'Independent pension-enquiry preparation plan. Not financial advice.')
    ),
    h(
      'header',
      { className: 'call-plan-head-strip' },
      h('div', { className: 'step-counter-pill' }, 'Step 3 of 3'),
      h('h3', { className: 'call-plan-main-title' }, 'Your Call Plan'),
      h('p', { className: 'call-plan-lead-desc' }, 'Keep this plan beside you during your call or use it when composing a written enquiry to your pension provider.'),
      h(
        'div',
        { className: 'call-plan-meta-strip no-print' },
        h('div', { className: 'call-plan-meta-pill' }, h('strong', null, 'Checklist: '), `${completedChecklist.length} checked (${pendingChecklist.length} to locate)`),
        h('div', { className: 'call-plan-meta-pill' }, h('strong', null, 'Questions queued: '), `${selectedQuestions.length} selected`),
        h('div', { className: 'call-plan-meta-pill' }, h('strong', null, 'Privacy: '), 'In-memory only (never stored)')
      )
    ),
    // Part 1: Situation Summary
    h(
      'section',
      { className: 'plan-section', 'aria-labelledby': 'cp-situation-title' },
      h('h4', { id: 'cp-situation-title', className: 'plan-section-title' }, '1. Your Situation Summary'),
      h(
        'div',
        { className: 'situation-summary-grid' },
        journey.situationQuestions.map(q => {
          const chosenValue = situationAnswers[q.id];
          const chosenOption = q.options.find(opt => opt.value === chosenValue);
          return h(
            'div',
            { key: q.id, className: 'situation-summary-item' },
            h('span', { className: 'situation-summary-label' }, q.prompt),
            h('span', { className: 'situation-summary-value' }, chosenOption ? chosenOption.label : 'Not specified')
          );
        })
      )
    ),
    // Part 2: Checklist Status
    h(
      'section',
      { className: 'plan-section', 'aria-labelledby': 'cp-checklist-title' },
      h('h4', { id: 'cp-checklist-title', className: 'plan-section-title' }, '2. Preparation Checklist Status'),
      h(
        'table',
        { className: 'call-plan-status-table', 'aria-label': 'Checklist status items' },
        h(
          'tbody',
          null,
          completedChecklist.map(item =>
            h(
              'tr',
              { key: item.id, className: 'row-completed' },
              h('td', { className: 'status-icon-td', 'aria-hidden': 'true' }, '✓'),
              h('td', null, h('strong', null, item.label), h('div', { className: 'item-sub-status' }, 'Ready / Located'))
            )
          ),
          pendingChecklist.map(item =>
            h(
              'tr',
              { key: item.id, className: 'row-pending' },
              h('td', { className: 'status-icon-td text-muted', 'aria-hidden': 'true' }, '○'),
              h('td', null, h('strong', null, item.label), h('div', { className: 'item-sub-status' }, 'To check or locate before calling'))
            )
          )
        )
      )
    ),
    // Part 3: Questions
    h(
      'section',
      { className: 'plan-section', 'aria-labelledby': 'cp-questions-title' },
      h('h4', { id: 'cp-questions-title', className: 'plan-section-title' }, '3. Questions to Ask Your Provider'),
      h(
        'div',
        { className: 'questions-card-stack' },
        (selectedQuestions.length > 0 ? selectedQuestions : journey.suggestedQuestions.slice(0, 3)).map(q =>
          h(
            'article',
            { key: q.id, className: 'question-card print-card' },
            h('span', { className: 'question-tag-chip' }, q.tag),
            h('p', { className: 'question-quote-text' }, q.question),
            h('p', { className: 'question-aim-text' }, h('strong', null, 'Why ask: '), q.context)
          )
        )
      )
    ),
    // Part 4: Provider Confirmations
    h(
      'section',
      { className: 'plan-section', 'aria-labelledby': 'cp-limits-title' },
      h('h4', { id: 'cp-limits-title', className: 'plan-section-title' }, '4. Confirmations Only Your Provider Can Provide'),
      h(
        'div',
        { className: 'limits-boxes-grid' },
        journey.providerOnlyItems.map(item =>
          h(
            'div',
            { key: item.id, className: 'limit-item-card' },
            h('h5', null, item.title),
            h('p', null, item.detail)
          )
        )
      )
    ),
    // Part 5: Call Log & Notes
    h(
      'section',
      { className: 'plan-section', 'aria-labelledby': 'cp-notes-title' },
      h('h4', { id: 'cp-notes-title', className: 'plan-section-title' }, '5. Call Reference & Next Steps Log'),
      h('p', { className: 'plan-section-sub' }, 'Record key call details while speaking with your provider.'),
      h(
        'div',
        { className: 'call-log-fields-grid' },
        h('div', { className: 'call-log-field' }, h('span', { className: 'call-log-label' }, 'Date of call:'), h('div', { className: 'call-log-line' })),
        h('div', { className: 'call-log-field' }, h('span', { className: 'call-log-label' }, 'Adviser / Agent name:'), h('div', { className: 'call-log-line' })),
        h('div', { className: 'call-log-field' }, h('span', { className: 'call-log-label' }, 'Reference / Case number:'), h('div', { className: 'call-log-line' })),
        h('div', { className: 'call-log-field' }, h('span', { className: 'call-log-label' }, 'Agreed follow-up date:'), h('div', { className: 'call-log-line' }))
      ),
      h(
        'div',
        { className: 'notes-textarea-wrap no-print' },
        h('label', { htmlFor: 'call-notes-input', className: 'notes-label' }, 'Your call notes & responses:'),
        h('textarea', {
          id: 'call-notes-input',
          className: 'call-plan-notes-textarea',
          value: userNotes,
          onChange: (e) => onNotesChange(e.target.value),
          placeholder: 'e.g. Spoke with Sarah. Reference number 48291. They confirmed my record is deferred and are posting an information statement to my address...',
          'aria-label': 'Notes taken during your pension provider enquiry',
        }),
        h('p', { className: 'call-notes-caution' }, 'Note: Never write down passwords, full payment card numbers, or National Insurance numbers.')
      )
    ),
    // Controls
    h(
      'div',
      { className: 'flow-navigation-bar no-print' },
      h(
        'div',
        { className: 'flow-nav-left' },
        h('button', { type: 'button', className: 'btn-flow-back', onClick: onBackToStep2 }, '← Back to Step 2: Get ready'),
        h('button', { type: 'button', className: 'btn-flow-reset', onClick: onStartAgain }, 'Start again (clear session)')
      ),
      h(
        'div',
        { className: 'flow-nav-right', style: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } },
        h(
          'button',
          {
            type: 'button',
            className: 'btn-print-action',
            style: { backgroundColor: 'var(--color-teal)', borderColor: 'var(--color-teal)' },
            onClick: handleDownloadPdf,
            'aria-label': 'Download call plan as PDF'
          },
          h('span', { 'aria-hidden': 'true' }, '📥 '),
          'Download PDF call plan'
        ),
        h(
          'button',
          { type: 'button', className: 'btn-print-action', onClick: onPrint, 'aria-label': 'Print this call plan' },
          h('span', { 'aria-hidden': 'true' }, '⎙ '),
          'Print call plan'
        )
      )
    )
  );
}

function JourneyFlow({ journey, state, onUpdateState, onHomeClick, onStartAgain }) {
  const { activeStep, situationAnswers, checkedItems, selectedQuestionIds, userNotes } = state;

  // Compute tailored checklist
  const fullChecklist = React.useRef(null);
  const computeFullChecklist = () => {
    const list = [...journey.baselineChecklist];
    journey.situationQuestions.forEach(q => {
      const selectedValue = situationAnswers[q.id];
      if (selectedValue) {
        const option = q.options.find(opt => opt.value === selectedValue);
        if (option && option.tailoredChecklistItems) {
          option.tailoredChecklistItems.forEach(item => {
            if (!list.some(existing => existing.id === item.id)) {
              list.push(item);
            }
          });
        }
      }
    });
    return list;
  };

  fullChecklist.current = computeFullChecklist();

  const handleSelectSituationOption = (questionId, optionValue) => {
    onUpdateState({
      situationAnswers: {
        ...situationAnswers,
        [questionId]: optionValue,
      },
    });
  };

  const handleToggleChecklist = (id) => {
    onUpdateState({
      checkedItems: {
        ...checkedItems,
        [id]: !checkedItems[id],
      },
    });
  };

  const handleToggleQuestion = (id) => {
    onUpdateState({
      selectedQuestionIds: {
        ...selectedQuestionIds,
        [id]: !selectedQuestionIds[id],
      },
    });
  };

  const handleNotesChange = (notes) => {
    onUpdateState({ userNotes: notes });
  };

  const handlePrint = () => {
    window.print();
  };

  const goToStep = (stepNumber) => {
    onUpdateState({ activeStep: stepNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return h(
    'div',
    { className: 'journey-page-wrapper' },
    h(
      'div',
      { className: 'container journey-focused-container' },
      // Breadcrumbs
      h(
        'nav',
        { className: 'breadcrumb-nav-bar no-print', 'aria-label': 'Breadcrumb navigation' },
        h('button', { type: 'button', className: 'btn-breadcrumb-crumb', onClick: onHomeClick }, 'All Guidance Journeys'),
        h('span', { 'aria-hidden': 'true' }, ' › '),
        h('span', null, journey.cardTitle)
      ),
      // Overview Card
      h(
        'header',
        { className: 'journey-top-card' },
        h('h2', { className: 'journey-heading-title' }, journey.cardTitle),
        h('p', { className: 'journey-tagline-text' }, journey.tagline),
        h('p', { className: 'journey-overview-desc' }, journey.overview),
        h(
          'div',
          { className: 'journey-regulatory-notice', role: 'note' },
          h('span', { 'aria-hidden': 'true' }, '⚠️ '),
          h('span', null, journey.regulatoryNotice)
        )
      ),
      // Stepper Bar: 3 Stages
      h(
        'nav',
        { className: 'journey-stepper-bar no-print', 'aria-label': 'Journey progress steps' },
        h(
          'button',
          {
            type: 'button',
            className: `step-tab-button ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`,
            onClick: () => goToStep(1),
          },
          h('span', { className: 'step-badge-number' }, '1'),
          h(
            'span',
            { className: 'step-tab-labels' },
            h('span', { className: 'step-sublabel' }, 'Step 1 of 3'),
            h('span', { className: 'step-mainlabel' }, 'Your Situation')
          )
        ),
        h(
          'button',
          {
            type: 'button',
            className: `step-tab-button ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`,
            onClick: () => goToStep(2),
          },
          h('span', { className: 'step-badge-number' }, '2'),
          h(
            'span',
            { className: 'step-tab-labels' },
            h('span', { className: 'step-sublabel' }, 'Step 2 of 3'),
            h('span', { className: 'step-mainlabel' }, 'Get Ready')
          )
        ),
        h(
          'button',
          {
            type: 'button',
            className: `step-tab-button ${activeStep === 3 ? 'active' : ''}`,
            onClick: () => goToStep(3),
          },
          h('span', { className: 'step-badge-number' }, '3'),
          h(
            'span',
            { className: 'step-tab-labels' },
            h('span', { className: 'step-sublabel' }, 'Step 3 of 3'),
            h('span', { className: 'step-mainlabel' }, 'Your Call Plan')
          )
        )
      ),
      // Step 1: Your Situation
      activeStep === 1
        ? h(StepSituation, {
            questions: journey.situationQuestions,
            answers: situationAnswers,
            onSelectOption: handleSelectSituationOption,
            onNext: () => goToStep(2),
            onBackToJourneys: onHomeClick,
            onStartAgain: onStartAgain,
          })
        : null,
      // Step 2: Get Ready
      activeStep === 2
        ? h(
            'div',
            { className: 'content-section-panel' },
            h(
              'div',
              { className: 'panel-header-row' },
              h(
                'div',
                null,
                h('div', { className: 'step-counter-pill' }, 'Step 2 of 3'),
                h('h3', { className: 'panel-title' }, 'Get Ready'),
                h('p', { className: 'panel-desc' }, 'Review your tailored preparation checklist, select the questions you want to ask, and note what only your provider can confirm.')
              )
            ),
            h(StepChecklist, {
              checklist: fullChecklist.current,
              checkedItems: checkedItems,
              onToggleItem: handleToggleChecklist,
            }),
            h(StepQuestions, {
              questions: journey.suggestedQuestions,
              selectedQuestionIds: selectedQuestionIds,
              onToggleQuestion: handleToggleQuestion,
            }),
            h(StepProviderLimits, {
              providerOnlyItems: journey.providerOnlyItems,
            }),
            h(
              'div',
              { className: 'flow-navigation-bar no-print' },
              h(
                'div',
                { className: 'flow-nav-left' },
                h('button', { type: 'button', className: 'btn-flow-back', onClick: () => goToStep(1) }, '← Back to Step 1: Your situation'),
                h('button', { type: 'button', className: 'btn-flow-reset', onClick: onStartAgain }, 'Start again')
              ),
              h(
                'div',
                { className: 'flow-nav-right' },
                h(
                  'button',
                  { type: 'button', className: 'btn-flow-next', onClick: () => goToStep(3) },
                  h('span', null, 'Continue to Step 3: Your call plan'),
                  h('span', { 'aria-hidden': 'true' }, ' →')
                )
              )
            )
          )
        : null,
      // Step 3: Your Call Plan
      activeStep === 3
        ? h(StepActionPlan, {
            journey: journey,
            situationAnswers: situationAnswers,
            fullChecklist: fullChecklist.current,
            checkedItems: checkedItems,
            selectedQuestionIds: selectedQuestionIds,
            userNotes: userNotes,
            onNotesChange: handleNotesChange,
            onPrint: handlePrint,
            onStartAgain: onStartAgain,
            onBackToStep2: () => goToStep(2),
          })
        : null
    )
  );
}

function AboutModal({ isOpen, onClose }) {
  React.useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return h(
    'div',
    { className: 'modal-overlay', onClick: onClose, role: 'presentation' },
    h(
      'div',
      {
        className: 'modal-dialog',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'about-dialog-heading',
        onClick: (e) => e.stopPropagation(),
      },
      h(
        'div',
        { className: 'modal-header' },
        h('h3', { id: 'about-dialog-heading', className: 'modal-title' }, 'About PensionSteps & Important Safeguards'),
        h('button', { type: 'button', className: 'modal-close-btn', onClick: onClose, 'aria-label': 'Close dialog' }, '×')
      ),
      h(
        'div',
        { className: 'modal-body' },
        h('p', null, h('strong', null, 'PensionSteps'), ' is an independent UK pension-enquiry preparation tool. It helps users prepare for administrative enquiries, organise questions, and print a useful call plan.'),
        h('h4', null, 'What PensionSteps Is Not'),
        h('p', null, 'PensionSteps is not a pension provider, financial adviser, account portal, or live account service. It cannot submit requests or make changes to your pension accounts.'),
        h('h4', null, 'Independent Portfolio Prototype'),
        h('p', null, 'This website is an independent educational tool. It is not affiliated with, endorsed by, or connected to any employer, pension provider, third-party administrator, master trust, or government authority (such as the DWP, MoneyHelper, or The Pensions Regulator).'),
        h('h4', null, 'Not Regulated Financial Advice'),
        h('p', null, 'PensionSteps provides administrative organisation checklists and suggested conversational wording. It does not provide regulated financial advice, investment recommendations, or legal guidance under the UK Financial Services and Markets Act 2000. It does not evaluate the suitability of pension consolidation, transfers, withdrawals, or investment allocations.'),
        h('h4', null, 'Scheme Rules & Provider Procedures Differ'),
        h('p', null, 'All UK pension schemes operate under distinct trust deeds, scheme rules, and administrator procedures. Processing timescales and required identification documents vary between providers. Requirements must always be checked directly with your scheme administrator.'),
        h('h4', null, 'Zero Personal Data Collection'),
        h('p', null, 'This tool does not collect, ask for, or store personal identification data. Do not enter names, full addresses, National Insurance numbers, or policy account figures. All checklist selections and notes remain strictly in your browser’s temporary memory during your current visit and are cleared upon reset.')
      ),
      h(
        'div',
        { className: 'modal-footer' },
        h('button', { type: 'button', className: 'btn-primary-teal', onClick: onClose }, 'Close & Return')
      )
    )
  );
}

function Footer({ onAboutClick, onJourneysClick, onSelectJourney }) {
  return h(
    'footer',
    { className: 'site-footer', role: 'contentinfo' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'footer-row' },
        h(
          'div',
          { className: 'footer-brand' },
          h(
            'div',
            { className: 'brand', style: { display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' } },
            h('span', { className: 'brand-mark', 'aria-hidden': 'true' }, 'p'),
            h('strong', { className: 'brand-name', style: { fontSize: '1.05rem', color: 'var(--ink)' } }, 'PensionSteps')
          ),
          h('p', { style: { fontSize: '0.85rem', color: 'var(--muted)', margin: 0 } }, 'An independent UK pension-enquiry preparation tool. Free to use • No account needed • Zero personal data stored')
        ),
        h(
          'ul',
          { className: 'footer-nav-list' },
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onJourneysClick }, 'Enquiry guides')),
          h('li', null, h('a', { href: '#how-it-works-section', className: 'footer-nav-link' }, 'How it works')),
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onAboutClick }, 'About')),
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onAboutClick }, 'Safeguards'))
        )
      ),
      h(
        'div',
        { style: { borderTop: '1px solid var(--line)', paddingTop: '18px', marginTop: '16px' } },
        h('p', { className: 'footer-disclaimer-text' }, 'PensionSteps is an independent preparation tool. It does not provide financial advice, access pension accounts or submit requests to providers. Requirements vary; check directly with your provider.')
      ),
      h(
        'div',
        { className: 'footer-bottom-bar', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '14px', fontSize: '0.78rem', color: 'var(--muted)' } },
        h('p', { style: { margin: 0 } }, `© ${new Date().getFullYear()} PensionSteps. Independent UK pension-enquiry preparation tool. Zero personal data collected.`),
        h('p', { style: { margin: 0 } }, 'Design inspired by Fieldnotes Student by Colorlib (CC BY 3.0).')
      )
    )
  );
}

// --- 4. Root App Component ---

const createInitialJourneyState = () => ({
  situationAnswers: {},
  checkedItems: {},
  selectedQuestionIds: {},
  userNotes: '',
  activeStep: 1,
});

function App() {
  const [selectedJourneyId, setSelectedJourneyId] = React.useState(null);
  const [journeyStates, setJourneyStates] = React.useState({
    'old-pension-letter': createInitialJourneyState(),
    'address-update': createInitialJourneyState(),
    'third-party-help': createInitialJourneyState(),
  });
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

  const activeJourney = JOURNEYS.find(j => j.id === selectedJourneyId);

  const handleSelectJourney = (id) => {
    setSelectedJourneyId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setSelectedJourneyId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAgain = () => {
    setJourneyStates({
      'old-pension-letter': createInitialJourneyState(),
      'address-update': createInitialJourneyState(),
      'third-party-help': createInitialJourneyState(),
    });
    setSelectedJourneyId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateJourneyState = (updates) => {
    if (!selectedJourneyId) return;
    setJourneyStates(prev => ({
      ...prev,
      [selectedJourneyId]: {
        ...prev[selectedJourneyId],
        ...updates,
      },
    }));
  };

  const handleScrollToJourneys = () => {
    if (activeJourney) {
      setSelectedJourneyId(null);
      setTimeout(() => {
        document.getElementById('journeys-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('journeys-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToHowItWorks = () => {
    if (activeJourney) {
      setSelectedJourneyId(null);
      setTimeout(() => {
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return h(
    'div',
    { className: 'app-root' },
    h('a', { href: '#main-content', className: 'skip-link' }, 'Skip to main content'),
    h(Header, {
      onHomeClick: handleHomeClick,
      onAboutClick: () => setIsAboutOpen(true),
      onJourneysClick: handleScrollToJourneys,
      onHowItWorksClick: handleScrollToHowItWorks,
    }),
    h(
      'main',
      { id: 'main-content', tabIndex: -1 },
      !activeJourney
        ? h(
            React.Fragment,
            null,
            h(Hero, {
              onFindNextStep: handleScrollToJourneys,
              onHowItWorksClick: handleScrollToHowItWorks,
            }),
            h(JourneyCards, {
              journeys: JOURNEYS,
              onSelectJourney: handleSelectJourney,
            }),
            h(HowItWorksSection, null),
            h(SafeguardsSection, {
              onAboutClick: () => setIsAboutOpen(true),
            }),
            h(FAQSection, null),
            h(CTACalloutSection, {
              onFindNextStep: handleScrollToJourneys,
            })
          )
        : h(JourneyFlow, {
            journey: activeJourney,
            state: journeyStates[activeJourney.id],
            onUpdateState: handleUpdateJourneyState,
            onHomeClick: handleHomeClick,
            onStartAgain: handleStartAgain,
          })
    ),
    h(Footer, {
      onAboutClick: () => setIsAboutOpen(true),
      onJourneysClick: handleScrollToJourneys,
      onSelectJourney: handleSelectJourney,
    }),
    h(AboutModal, {
      isOpen: isAboutOpen,
      onClose: () => setIsAboutOpen(false),
    })
  );
}

// --- 5. Mount ---
window.addEventListener('DOMContentLoaded', () => {
  rootElement = document.getElementById('root');
  rootComponentFn = App;
  performRender();
});
