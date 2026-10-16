/*
 * OPPORTUNITY LAB — original, hypothetical partnership proposals.
 *
 * Every proposal is shown with the label:
 *   "Hypothetical proposal—not an announced partnership."
 *
 * HOW TO EDIT
 * - Text accepts simple Markdown (see case-studies.js).
 * - Empty strings / empty lists show "Research to be added".
 * - Comparison matrix: `scores` has one row per criterion, one value per candidate
 *   (1–5, or null if not yet scored). Weights are percentages and should total 100.
 */
window.PL = window.PL || {};

PL.opportunities = [
  {
    slug: "workplace-pension-partner-discovery",
    title: "Workplace Pension Partner Discovery",
    sector: "Financial services",
    partnershipType: "Workplace distribution & native refactor",
    summary:
      "A strategic exploration of whether partnering with third-party workplace benefits platforms (e.g. Perkbox, Benifex) " +
      "or procuring enterprise messaging tools justifies its cost over an in-house journey refactor to drive auto-enrolled pension activation.",
    status: "complete",
    featured: true,
    lastReviewed: "2026-10-12",

    researchQuestion:
      "Does supplementing an in-house registration journey refactor with third-party workplace-platform distribution deliver sufficient incremental registration and activation uplift to justify external partnership fees?",

    targetCompany: {
      name: "Nest (National Employment Savings Trust)",
      rationale:
        "Nest is the UK’s largest auto-enrolment workplace pension scheme, serving over 13 million members across more than 1 million employers. " +
        "Operating on a public-interest remit with a digital-first, low-cost operating model, Nest faces a structural disengagement challenge: " +
        "millions of members are auto-enrolled but never complete initial digital setup or activate their online account, limiting engagement with their retirement savings."
    },

    customerProblem: {
      body:
        "### Structural Auto-Enrolment Disengagement\n\n" +
        "- **The Enrolment Paradox:** Auto-enrolment successfully brought millions into pension saving, but default enrolment produces passive members rather than active users.\n" +
        "- **Credential Friction:** Newly enrolled members receive physical or digital enrolment notices requiring account setup with member IDs that are frequently misplaced or overlooked.\n" +
        "- **Early Setup Drop-Off:** If a member does not register within the first 30 days of enrolment, the likelihood of self-directed registration drops dramatically, leading to dormant accounts and lost retirement visibility."
    },

    shortlist: [
      {
        name: "Perkbox",
        category: "Employee-benefits & perks platform",
        note: "Everyday employee perks and discount hub with high weekly active mobile usage."
      },
      {
        name: "Benifex",
        category: "Flexible benefits & total reward software",
        note: "Enterprise benefits portal integrated into employer HR and onboarding workflows."
      },
      {
        name: "Braze",
        category: "Customer engagement & multichannel messaging",
        note: "Enterprise marketing automation for real-time mobile push, SMS, and in-app triggers."
      }
    ],

    matrix: {
      scale: "1 = weak fit, 5 = strong fit. Evaluated for auto-enrolment activation.",
      criteria: [
        { name: "Customer overlap", weight: 20, description: "Does the partner reach the same newly enrolled workforce?" },
        { name: "Strategic alignment", weight: 20, description: "Does the partner's model align with financial wellbeing?" },
        { name: "Capability complementarity", weight: 20, description: "Does the partner provide distribution touchpoints Nest lacks?" },
        { name: "Mutual commercial benefit", weight: 15, description: "Does each side capture clear economic or retention value?" },
        { name: "Execution complexity", weight: 15, description: "Technical integration and employer onboarding effort (higher = simpler)." },
        { name: "Regulatory and reputational risk", weight: 10, description: "FCA Consumer Duty, GDPR, and scheme governance (higher = lower risk)." }
      ],
      candidates: ["Perkbox", "Benifex", "Braze"],
      scores: [
        [4, 4, 2],
        [4, 4, 3],
        [4, 3, 4],
        [3, 3, 2],
        [3, 2, 3],
        [4, 4, 4]
      ]
    },

    recommended: {
      name: "Perkbox / Benifex (Workplace Benefits Platforms) alongside In-House Native Refactor",
      rationale:
        "A multi-arm empirical test is recommended to isolate whether external benefits-platform distribution delivers cost-effective incremental reach over an internal journey refactor.\n\n" +
        "Before committing to enterprise software licensing, Nest should benchmark a native refactor (highlighting 'No Nest ID needed' and streamlined reminders) against the same journey amplified by workplace discovery banners on Perkbox or Benifex."
    },

    rejected: [
      {
        name: "Standalone Messaging SaaS Procurement (e.g. Braze)",
        reason: "Procuring expensive third-party messaging software without fixing core setup friction or establishing new workplace distribution touchpoints adds recurring SaaS overhead. Existing internal communication channels should be evaluated first."
      }
    ],

    parties: [
      {
        name: "Nest",
        role: "company",
        note: "Workplace Pension Master Trust",
        contributes: [
          "Auto-enrolled member base and employer scheme network",
          "Account creation infrastructure and pension management dashboard",
          "Regulatory compliance, master trust governance, and default fund administration"
        ],
        gains: [
          "Increased digital member registration and self-service account adoption",
          "Lower inbound postal and contact-centre support servicing costs",
          "Risks: Partner integration overhead, member support spikes, and platform fee leakage"
        ]
      },
      {
        name: "Workplace Benefits Platforms (Perkbox / Benifex)",
        role: "company",
        note: "Employee Benefits & Engagement Partners",
        contributes: [
          "High-frequency employee touchpoints and mobile app discovery banners",
          "Employer HR benefit portal integration",
          "Financial wellbeing content placement within everyday perks context"
        ],
        gains: [
          "Enhanced financial wellbeing proposition for corporate clients",
          "Recurring partnership licensing and delivery revenue",
          "Validation as an essential employee benefits distribution rail"
        ]
      },
      {
        name: "Members & Employers",
        role: "customer",
        note: "Auto-Enrolled Scheme Members & Participating Employers",
        contributes: [
          "Initial registration time and basic identification verification",
          "Employer participation in benefit portal communication tests"
        ],
        gains: [
          "Frictionless account setup without needing misplaced physical Nest IDs",
          "Immediate visibility of accumulated pension savings and employer contributions",
          "Integrated view of retirement alongside workplace wellbeing benefits"
        ]
      }
    ],

    pilot: {
      body:
        "# Section 6: Illustrative Pilot Economics and Decision Rules\n\n" +
        "**Author:** Ritul Sawant\n\n" +
        "**Date:** October 2026\n\n" +
        "> **Disclaimer:** All numerical inputs, conversion rates, and cost figures in this section are **author-selected illustrative assumptions**. They do not represent Nest's actual scheme performance, internal budgets, or commercial pricing from Perkbox, Benifex, or Braze.\n\n" +
        "---\n\n" +
        "## 1. Mathematical Model & Formula Definitions\n\n" +
        "To evaluate whether adding workplace-platform distribution (Arm C) justifies its cost over an in-house baseline refactor (Arm B), the pilot economics are calculated using incremental metrics relative to the preceding baseline arm.\n\n" +
        "### Core Metrics & Formulas\n\n" +
        "$$\\text{Primary Outcome (30-Day Registration Rate)} = \\frac{\\text{Total Members Completing Setup within 30 Days}}{\\text{Total Assigned Eligible Members in Arm}}$$\n\n" +
        "$$\\text{Secondary Outcome (Assigned-Member Activation Rate)} = \\frac{\\text{Total Assigned Members Registering within 30 Days \\& Activating within 14 Days}}{\\text{Total Assigned Eligible Members in Arm}}$$\n\n" +
        "$$\\text{Incremental Cost per Additional Registration (B vs. A)} = \\frac{\\text{Incremental Cost of Arm B}}{\\text{Registrations}_{\\text{Arm B}} - \\text{Registrations}_{\\text{Arm A}}}$$\n\n" +
        "$$\\text{Incremental Cost per Additional Activated Member (C vs. B)} = \\frac{\\text{Incremental Cost of Arm C} - \\text{Incremental Cost of Arm B}}{\\text{Activated Members}_{\\text{Arm C}} - \\text{Activated Members}_{\\text{Arm B}}}$$\n\n" +
        "---\n\n" +
        "## 2. Illustrative Pilot Scenario Inputs & Results\n\n" +
        "### Baseline Assumptions (5,000 Assigned Eligible Members per Arm)\n\n" +
        "- **Cohort Size:** $N = 5,000$ newly auto-enrolled, unregistered members per arm drawn from participating employers.\n" +
        "- **Arm A (Baseline Control):** Standard guidance. Assumed **8.0% registration** (400 members) and **5.0% assigned-member activation** (250 members).\n" +
        "- **Arm B (In-House Refactor):** Prominent \"No Nest ID needed\" guidance + native reminder flow. Assumed **11.0% registration** (550 members) and **7.0% assigned-member activation** (350 members).\n" +
        "- **Arm C (Workplace Distribution):** Arm B refactor + Perkbox/Benifex discovery banners. Assumed **14.0% registration** (700 members) and **9.0% assigned-member activation** (450 members).\n\n" +
        "### Cost Categorization & Allocations\n\n" +
        "| Cost Category | Arm B (In-House Refactor) | Arm C (Workplace Distribution) |\n" +
        "| --- | --- | --- |\n" +
        "| **One-Off Setup Costs** *(Content, Integration, Legal, Review)* | £7,000 | £15,000 *(Includes partner setup)* |\n" +
        "| **Recurring Operating Costs** *(Messaging, Platform, Support)* | £3,000 | £10,000 *(Includes platform delivery)* |\n" +
        "| **Total Intervention Cost** | **£10,000** | **£25,000** |\n\n" +
        "---\n\n" +
        "## 3. Comparative Incremental Conversion & Economics Matrix\n\n" +
        "| Metric Dimension | Arm A (Baseline) | Arm B (In-House Refactor) | Arm C (Workplace Distribution) | Principal Comparison |\n" +
        "| --- | --- | --- | --- | --- |\n" +
        "| **Assigned Cohort Size** | 5,000 | 5,000 | 5,000 | Equal assigned cohorts |\n" +
        "| **30-Day Registrations (Rate %)** | 400 (8.0%) | 550 (11.0%) | 700 (14.0%) | **+150** (B vs A) / **+150** (C vs B) |\n" +
        "| **Assigned-Member Activations (Rate %)** | 250 (5.0%) | 350 (7.0%) | 450 (9.0%) | **+100** (B vs A) / **+100** (C vs B) |\n" +
        "| **Descriptive Activation Rate** *(Activated / Registered)* | 62.5% | 63.6% | 64.3% | Quality of setup conversion |\n" +
        "| **Total Intervention Cost** | £0 | £10,000 | £25,000 | Incremental spend |\n" +
        "| **Incremental Cost vs. Arm A** | — | **£66.67** / Reg.<br>**£100.00** / Act. | — | **Arm B vs. Arm A** |\n" +
        "| **Incremental Cost vs. Arm B (Marginal)** | — | — | **£100.00** / Reg.<br>**£150.00** / Act. | **Arm C vs. Arm B** *(Value of Added Distribution)* |\n\n" +
        "---\n\n" +
        "## 4. Quantitative Decision Rules Framework\n\n" +
        "To determine rollout policy, clear decision gates are established around practical performance, cost thresholds, and operational safeguards.\n\n" +
        "```\n" +
        "┌─────────────────────────────────────────────────────────────────────────┐\n" +
        "│                      PILOT DECISION GATES & RULES                       │\n" +
        "└────────────────────────────────────┬────────────────────────────────────┘\n" +
        "                                     │\n" +
        "         ┌───────────────────────────┼───────────────────────────┐\n" +
        "         ▼                           ▼                           ▼\n" +
        "┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐\n" +
        "│ GATE 1: Native  │         │ GATE 2: Added   │         │ GATE 3: Red     │\n" +
        "│ Improvement (B) │         │ Distribution (C)│         │ Flags & Pause   │\n" +
        "└────────┬────────┘         └────────┬────────┘         └────────┬────────┘\n" +
        "         │                           │                           │\n" +
        "         ▼                           ▼                           ▼\n" +
        "  Is Inc. Cost per            Is Inc. Cost per           Does setup create\n" +
        "  Reg < £100 & Inc.           Reg (vs B) < £150 &        support overload or\n" +
        "  Activation > +1.5%?         Inc. Act. > +1.5%?         privacy friction?\n" +
        "         │                           │                           │\n" +
        "  ┌──────┴──────┐             ┌──────┴──────┐             ┌──────┴──────┐\n" +
        "  │ Yes    No   │             │ Yes    No   │             │ Yes    No   │\n" +
        "  ▼        ▼    ▼             ▼        ▼    ▼             ▼        ▼    ▼\n" +
        "Adopt   Maintain            Expand   Retain              Pause & Review\n" +
        "Native  Control             Partner  Native              Immediately\n" +
        "```\n\n" +
        "### Actionable Policy Thresholds\n\n" +
        "| Observed Pilot Result | Recommended Policy Action | Strategic & Commercial Rationale |\n" +
        "| --- | --- | --- |\n" +
        "| **Arm B improves registration & activation at an incremental cost $< £100$ per registration.** | **Adopt & Extend Native Refactor** | Streamlining the native journey and highlighting \"No Nest ID needed\" produces cost-effective conversion using internal capabilities. |\n" +
        "| **Arm C provides meaningful additional uplift over Arm B at an incremental cost $< £150$ per registration.** | **Test Workplace Distribution More Widely** | Workplace-platform distribution demonstrates sufficient marginal reach and activation to justify partner platform fees. |\n" +
        "| **Arm C yields little or no incremental uplift over Arm B (Marginal Inc. Cost $> £200$).** | **Do Not Pursue Platform Partnership** | Added distribution fails to justify partner licensing costs; retain the native Arm B improvement. |\n" +
        "| **Any arm causes material customer support spikes, privacy friction, or drop-off after credential creation.** | **Pause & Redesign Journey** | Operational friction or user confusion overrides conversion lift regardless of unit cost. |\n" +
        "| **Existing CRM systems cannot support required targeting or experiment tracking.** | **Assess Messaging Procurement (e.g. Braze)** | Proceed to vendor procurement review only if internal IT capabilities present a verified delivery blocker. |\n\n" +
        "---\n\n" +
        "## 5. Synthesis & Final Proposal Conclusion\n\n" +
        "> **Final Recommendation:** First assess baseline registration performance and identify participating employers where a benefits-platform test is feasible. Compare improved existing-channel communications (Arm B) against the same intervention supplemented by workplace-platform discovery (Arm C). Recommend wider platform distribution only if it delivers meaningful incremental registration and activation at an acceptable cost per member, without unresolved customer or privacy concerns. Consider additional messaging procurement only where existing internal systems cannot support the required delivery and measurement."
    },

    successMeasures: [
      "Primary: 30-Day Registration Rate across assigned eligible members (Arm A: 8.0%, Arm B: 11.0%, Arm C: 14.0%).",
      "Secondary: Assigned-Member Activation Rate within 14 days of registration (Arm A: 5.0%, Arm B: 7.0%, Arm C: 9.0%).",
      "Setup Conversion Quality: Descriptive Activation Rate maintained above 60% across all arms.",
      "Cost Efficiency: Incremental cost per additional registration below £100 for Arm B and below £150 for Arm C."
    ],

    risks: [
      "Customer Support Overload: Multi-step verification or credential friction creates support ticket spikes that override conversion gains.",
      "Privacy & Data Sharing Friction: Transferring member data or co-branding with external benefits platforms requires strict GDPR and Consumer Duty compliance.",
      "Marginal Cost Inefficiency: If Arm C yields little incremental uplift over Arm B (marginal cost > £200), external distribution fails to justify partner licensing costs."
    ],

    assumptions: [
      "All numerical inputs, conversion rates, and cost figures in this section are author-selected illustrative assumptions.",
      "Assumes 5,000 newly auto-enrolled, unregistered members per arm across participating employers (N = 15,000 total).",
      "Assumes incremental pilot costs of £10,000 for Arm B (In-House Refactor) and £25,000 for Arm C (Workplace Distribution)."
    ],

    openQuestions: [
      "What proportion of participating employers currently use Perkbox, Benifex, or equivalent benefits portals?",
      "Can existing internal messaging systems support cohort randomisation and event tracking without procuring third-party marketing software?",
      "What are the actual member drop-off points between receiving an enrolment letter and completing Nest account setup?"
    ]
  }
];
