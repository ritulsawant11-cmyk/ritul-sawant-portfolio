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
      slug: 'partnership-lab',
      title: 'Partnership Lab',
      subtitle: 'Strategic Research & Commercial Analysis Platform',
      category: 'Web Application',
      tag: 'RESEARCH PLATFORM · OPEN FINANCE',
      statusBadge: 'Live Website',
      featured: false,
      summary:
        'An independent research website exploring strategic partnerships across financial services, technology, and pensions.',
      liveUrl: 'https://partnership-lab.vercel.app/#/',
      embedUrl: 'https://partnership-lab.vercel.app/#/',
      toolUrl: 'https://partnership-lab.vercel.app/#/'
    },
    {
      slug: 'pension-steps',
      title: 'PensionSteps',
      subtitle: 'Workplace Pension Customer Preparation Tool',
      category: 'Web Application',
      tag: 'PENSIONS · CUSTOMER OPERATIONS',
      statusBadge: 'Interactive Website',
      featured: false,
      summary:
        'An interactive website helping workplace pension members prepare for common customer-service enquiries.',
      liveUrl: 'https://ritul-sawant-portfolio.vercel.app/pension-steps/',
      embedUrl: '/pension-steps/',
      toolUrl: 'https://ritul-sawant-portfolio.vercel.app/pension-steps/'
    },
    {
      slug: 'pension-quest',
      title: 'PensionQuest',
      subtitle: 'Story-Based Workplace Pension Educational Game',
      category: 'Web Game',
      tag: 'PENSIONS EDUCATION · SERIOUS GAME',
      statusBadge: 'Playable Web Game',
      featured: false,
      summary:
        'A story-based educational web game exploring everyday workplace pension decisions.',
      liveUrl: 'https://ritul-sawant-portfolio.vercel.app/pension-quest/',
      embedUrl: '/pension-quest/',
      toolUrl: 'https://ritul-sawant-portfolio.vercel.app/pension-quest/'
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
    { label: 'Websites', id: 'work' },
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

function Hero({ profile, onNavigateSection }) {
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
              'Explore websites ↓'
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
        )
      )
    )
  );
}

function Projects({ projects }) {
  return React.createElement(
    'section',
    { id: 'work', className: 'editorial-section', 'aria-labelledby': 'work-heading' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'header',
        null,
        React.createElement('div', { className: 'section-eyebrow' }, '// 01. WEBSITES & INTERACTIVE PROJECTS'),
        React.createElement(
          'h2',
          { id: 'work-heading', className: 'section-heading-editorial' },
          'Websites & Interactive Projects'
        ),
        React.createElement(
          'p',
          { className: 'section-subhead' },
          'A selection of websites and interactive tools I have created, bringing together strategic research, pensions knowledge, and practical customer-focused ideas.'
        )
      ),
      React.createElement(
        'div',
        { className: 'projects-editorial-grid' },
        projects.map((project) =>
          React.createElement(
            'article',
            {
              key: project.slug,
              className: 'project-editorial-card',
              style: {
                borderColor: 'rgba(45, 212, 191, 0.25)',
                background: 'linear-gradient(180deg, #0e121a 0%, #0a0c10 100%)',
              },
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
                    style: {
                      borderColor: 'var(--accent-teal)',
                      color: 'var(--accent-mint)',
                      background: 'rgba(52, 245, 164, 0.08)',
                    },
                  },
                  project.statusBadge
                )
              ),
              React.createElement('h3', { className: 'card-title' }, project.title),
              React.createElement('div', { className: 'card-subtitle' }, project.subtitle),
              React.createElement('p', { className: 'card-description' }, project.summary)
            ),
            React.createElement(
              'div',
              { className: 'card-actions', style: { marginTop: '1.5rem' } },
              project.liveUrl
                ? React.createElement(
                    'a',
                    {
                      href: project.liveUrl,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: 'btn-editorial btn-primary-dark',
                      style: {
                        background: 'var(--accent-teal)',
                        color: '#050607',
                        width: '100%',
                        justifyContent: 'center',
                      },
                      'aria-label': `Visit ${project.title} in a new tab`,
                    },
                    'Visit Website ↗'
                  )
                : null
            )
          )
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
    { label: 'Websites', id: 'work' },
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

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentHash(hash);

      const sectionMatch = hash.replace(/^#\/?/, '');
      if (sectionMatch) {
        const targetId = (sectionMatch.startsWith('case-study') || sectionMatch.startsWith('project'))
          ? 'work'
          : sectionMatch;
        const el = document.getElementById(targetId);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateHome = (sectionId) => {
    if (sectionId) {
      window.location.hash = '#' + sectionId;
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.hash = '#/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header, {
      profile: portfolioData.profile,
      currentHash: currentHash,
      onNavigateHome: handleNavigateHome,
    }),
    React.createElement(
      'main',
      { id: 'main-content', role: 'main' },
      React.createElement(Hero, {
        profile: portfolioData.profile,
        onNavigateSection: handleNavigateHome,
      }),
      React.createElement(Projects, {
        projects: portfolioData.projects,
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
