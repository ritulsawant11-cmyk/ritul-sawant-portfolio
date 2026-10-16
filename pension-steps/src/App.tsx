import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { JourneyCards } from './components/JourneyCards';
import { JourneyFlow } from './components/JourneyFlow';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';
import { JOURNEYS } from './data/journeys';
import { JourneyId, JourneyState } from './types';

const createInitialJourneyState = (): JourneyState => ({
  situationAnswers: {},
  checkedItems: {},
  selectedQuestionIds: {},
  userNotes: '',
  activeStep: 1,
});

export const App: React.FC = () => {
  const [selectedJourneyId, setSelectedJourneyId] = useState<JourneyId | null>(null);
  const [journeyStates, setJourneyStates] = useState<Record<JourneyId, JourneyState>>({
    'old-pension-letter': createInitialJourneyState(),
    'address-update': createInitialJourneyState(),
    'third-party-help': createInitialJourneyState(),
  });
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const activeJourney = JOURNEYS.find((j) => j.id === selectedJourneyId);

  const handleSelectJourney = (id: JourneyId | string) => {
    setSelectedJourneyId(id as JourneyId);
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

  const handleUpdateJourneyState = (updates: Partial<JourneyState>) => {
    if (!selectedJourneyId) return;
    setJourneyStates((prev) => ({
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

  return (
    <>
      <Header
        onHomeClick={handleHomeClick}
        onAboutClick={() => setIsAboutOpen(true)}
        onJourneysClick={handleScrollToJourneys}
        onHowItWorksClick={handleScrollToHowItWorks}
      />

      <main id="main-content" tabIndex={-1}>
        {!activeJourney ? (
          <>
            {/* 1. Hero Section */}
            <Hero
              onFindNextStep={handleScrollToJourneys}
              onHowItWorksClick={handleScrollToHowItWorks}
            />

            {/* 2. Supported Journey Selection Grid */}
            <JourneyCards
              journeys={JOURNEYS}
              onSelectJourney={handleSelectJourney}
            />

            {/* 3. Three-Step Process Section */}
            <section
              id="how-it-works-section"
              className="section how-it-works-section"
              aria-labelledby="how-it-works-title"
            >
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">02 / HOW IT WORKS</div>
                  <h2 id="how-it-works-title" className="section-title section-main-heading">
                    Three simple <em>steps.</em>
                  </h2>
                  <p className="section-sub section-lead-paragraph">
                    Prepare in three simple steps. Preparing beforehand keeps your call structured, prevents missed questions, and avoids delays.
                  </p>
                </div>

                <div className="how-it-works-grid">
                  <div className="how-step-card">
                    <span className="how-step-badge">01</span>
                    <h3 className="how-step-title">Choose your enquiry</h3>
                    <p className="how-step-desc">
                      Select the situation you want to discuss with your provider—an unexpected letter, an address update, or representative help.
                    </p>
                  </div>

                  <div className="how-step-card">
                    <span className="how-step-badge">02</span>
                    <h3 className="how-step-title">Prepare your questions</h3>
                    <p className="how-step-desc">
                      Work through a targeted checklist and select the specific questions you need to ask your pension provider.
                    </p>
                  </div>

                  <div className="how-step-card">
                    <span className="how-step-badge">03</span>
                    <h3 className="how-step-title">Print your plan</h3>
                    <p className="how-step-desc">
                      Keep your plan beside you when you contact your provider. Print your call plan or download a 1-page PDF worksheet with space for reference numbers and notes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. About PensionSteps */}
            <section
              id="about-section"
              className="section safeguards-split-section"
              aria-labelledby="about-section-title"
            >
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">03 / ABOUT</div>
                  <h2 id="about-section-title" className="section-title section-main-heading">
                    About <em>PensionSteps.</em>
                  </h2>
                </div>

                <div className="about-grid safeguards-split-grid">
                  <div className="about-content-col safeguards-content-col">
                    <p className="about-copy">
                      PensionSteps helps you prepare for pension administration conversations with clearer questions and a practical call plan.
                    </p>
                    <p className="about-sub section-lead-paragraph">
                      Pension administration can feel daunting when you are unfamiliar with provider terminology. Having your reference details and questions ready helps you get clear answers without awkward pauses or delay.
                    </p>

                    <div className="safeguards-btn-wrap" style={{ marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-primary-teal"
                        onClick={() => setIsAboutOpen(true)}
                      >
                        <span>Read our full safeguards &amp; service boundaries</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>

                  <div className="about-skills-col">
                    <ul className="skill-list safeguards-pill-list">
                      <li>&#10003; Free to use</li>
                      <li>&#10003; No account needed</li>
                      <li>&#10003; Zero personal data collected</li>
                      <li>&#10003; Independent preparation — not financial advice</li>
                      <li>&#10003; Not a pension provider</li>
                      <li>&#10003; Plain English checklists</li>
                      <li>&#10003; Printable 1-page call plan</li>
                      <li>&#10003; In-memory browser session only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. FAQ Section */}
            <section className="section faq-section" id="faq-section" aria-labelledby="faq-main-title">
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">04 / FAQ</div>
                  <h2 id="faq-main-title" className="section-title section-main-heading">
                    Frequently asked <em>questions.</em>
                  </h2>
                  <p className="section-sub section-lead-paragraph">
                    Understanding the purpose and service boundaries of PensionSteps before you contact your provider.
                  </p>
                </div>

                <div className="faq-grid">
                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> Is PensionSteps a pension provider?
                    </h3>
                    <p className="faq-answer-text">
                      No. PensionSteps is an independent customer-preparation tool. It is not a pension provider, financial adviser, account portal, or service that submits requests to pension providers. It does not manage, hold, or administer pension funds. Receiving correspondence does not confirm entitlement to benefits.
                    </p>
                  </article>

                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> Can PensionSteps access my pension account?
                    </h3>
                    <p className="faq-answer-text">
                      No. This website cannot access or modify your pension records. All checklists and custom notes stay purely in your browser’s temporary memory during your current visit and reset when you start again. Zero personal data collected.
                    </p>
                  </article>

                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> Does this website provide financial advice?
                    </h3>
                    <p className="faq-answer-text">
                      No. PensionSteps provides administrative organisation checklists and suggested conversational wording. It is Not Regulated Financial Advice under the UK Financial Services and Markets Act 2000. General authority is not a substitute for a registered Lasting Power of Attorney.
                    </p>
                  </article>

                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> What should I check with my provider?
                    </h3>
                    <p className="faq-answer-text">
                      Check identity verification requirements, policy reference formats, scheme administrator contact details, and expected processing timescales directly with your verified scheme administrator.
                    </p>
                  </article>
                </div>
              </div>
            </section>

            {/* 6. Fieldnotes Contact Panel Callout */}
            <section className="section cta-callout-section" aria-labelledby="cta-callout-heading">
              <div className="container">
                <div className="contact-panel cta-callout-card">
                  <div className="contact-panel-content cta-callout-text">
                    <h2 id="cta-callout-heading" className="cta-callout-title">
                      Ready to prepare your <em>enquiry?</em>
                    </h2>
                    <p className="cta-callout-desc">
                      Pick your situation, check off what you have, and print your 1-page worksheet in minutes. Prepare for my enquiry with confidence.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary btn-callout-action"
                      onClick={handleScrollToJourneys}
                    >
                      <span>Prepare for my enquiry</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <JourneyFlow
            journey={activeJourney}
            state={journeyStates[activeJourney.id]}
            onUpdateState={handleUpdateJourneyState}
            onHomeClick={handleHomeClick}
            onStartAgain={handleStartAgain}
          />
        )}
      </main>

      <Footer
        onAboutClick={() => setIsAboutOpen(true)}
        onJourneysClick={handleScrollToJourneys}
        onSelectJourney={handleSelectJourney}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </>
  );
};
