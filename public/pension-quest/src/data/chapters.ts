import { Chapter } from '../types/game';

export const CHAPTERS_DATA: Chapter[] = [
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
