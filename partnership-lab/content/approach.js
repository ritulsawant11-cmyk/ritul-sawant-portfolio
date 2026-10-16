/*
 * MY APPROACH — the framework used across case studies and proposals.
 * Edit the text freely. Simple Markdown is supported.
 */
window.PL = window.PL || {};

PL.approach = {
  intro:
    "I use the same seven steps for every project. The aim is to start from a real problem, keep evidence separate " +
    "from opinion, and make the reasoning behind each recommendation visible — including the options I rejected.",

  steps: [
    {
      title: "Define the problem",
      purpose: "Start from a specific customer or business problem, not from an attractive company pairing.",
      questions: [
        "Who experiences the problem, and how do we know?",
        "What does the problem cost the customer or the company today?",
        "Why might the company struggle to solve it alone?"
      ],
      output: "A one-sentence research question and a clear description of the target customer."
    },
    {
      title: "Research the company",
      purpose: "Understand strategy, customers, capabilities and constraints using public sources.",
      questions: [
        "What does the company say its priorities are in annual reports and investor materials?",
        "Which customers matter most to it?",
        "Which capabilities appear to be missing?",
        "What regulatory constraints apply?"
      ],
      output: "A company profile in which sourced facts are kept separate from my interpretation."
    },
    {
      title: "Identify possible partners",
      purpose: "Build a broad long list across several categories, including less obvious ones, before narrowing down.",
      questions: [
        "Who already serves the same customer?",
        "Who holds the capability the company lacks?",
        "Who would benefit from access to this company's customers?"
      ],
      output: "A long list, then a shortlist of three to five candidates with a reason for each."
    },
    {
      title: "Compare partner fit",
      purpose: "Score the shortlist against weighted criteria so the comparison is explicit and can be challenged.",
      questions: [
        "How strong is the strategic alignment and customer overlap?",
        "Are the capabilities genuinely complementary?",
        "Does each side have a commercial reason to commit?",
        "How complex and risky would execution be?"
      ],
      output: "A comparison matrix with written reasoning, plus reasons for rejecting each alternative."
    },
    {
      title: "Develop the value proposition",
      purpose: "Set out what each party contributes and gains, and what the customer gets.",
      questions: [
        "Would each side still agree if the other side's benefit were removed?",
        "Is the customer clearly better off, or is the value mainly internal?",
        "Is the value balanced enough to last?"
      ],
      output: "A value map covering both companies and the customer."
    },
    {
      title: "Design a pilot",
      purpose: "Propose a small, time-bound test that could prove or disprove the idea before larger commitments.",
      questions: [
        "What is the smallest meaningful scope?",
        "Which customer segment, for how long?",
        "What would count as success, agreed before the pilot starts?"
      ],
      output: "A pilot outline with success measures and a go / no-go decision point."
    },
    {
      title: "Evaluate risks",
      purpose: "Make risks, assumptions and gaps in the research explicit.",
      questions: [
        "What are the commercial, operational, regulatory and reputational risks?",
        "Which assumptions is the recommendation most sensitive to?",
        "What evidence would change my recommendation?"
      ],
      output: "A list of risks and assumptions, and the questions that need further research."
    }
  ]
};
