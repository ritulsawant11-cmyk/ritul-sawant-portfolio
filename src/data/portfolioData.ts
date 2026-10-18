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
