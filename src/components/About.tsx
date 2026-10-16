import React from 'react';
import { PortfolioProfile } from '../types';

interface AboutProps {
  profile: PortfolioProfile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="editorial-section" aria-labelledby="about-heading">
      <div className="container">
        <header>
          <div className="section-eyebrow">// 02. ABOUT ME</div>
          <h2 id="about-heading" className="section-heading-editorial">
            Connecting quantitative analysis with front-line operations.
          </h2>
        </header>

        <div className="about-split-grid" style={{ marginTop: '2.5rem' }}>
          <div className="about-editorial-prose">
            {profile.aboutText.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="safeguards-editorial-box" style={{ marginTop: '2rem', marginBottom: 0 }}>
              <div className="safeguards-title">// Scope &amp; Professional Boundaries</div>
              <p style={{ margin: 0 }}>
                This is a personal career portfolio. I do not provide regulated financial advice, investment management, or actuarial services, nor do I represent myself as a professional software developer or senior AI governance practitioner.
              </p>
            </div>
          </div>

          <aside className="narrative-callout" aria-label="Background summary">
            <h3 className="callout-title">// Academic &amp; Operational Path</h3>
            <ul className="callout-list">
              <li className="callout-item">
                <span className="callout-item-label">Economics Foundation</span>
                <span className="callout-item-desc">Quantitative discipline, statistics, micro/macro policy analysis, and financial data interpretation.</span>
              </li>
              <li className="callout-item">
                <span className="callout-item-label">MSc Sports Management</span>
                <span className="callout-item-desc">Strategic governance, operational planning, stakeholder coordination, and evidence-based decision-making.</span>
              </li>
              <li className="callout-item">
                <span className="callout-item-label">Corporate Pensions (Diligenta)</span>
                <span className="callout-item-desc">FCA-regulated DC enquiry handling, Letter of Authority verification, case notes, and Consumer Duty compliance.</span>
              </li>
              <li className="callout-item">
                <span className="callout-item-label">Store Operations (Domino’s)</span>
                <span className="callout-item-desc">Team supervision of 15 staff, customer escalation handling, daily cash reconciliation (£5k) and banking controls.</span>
              </li>
              <li className="callout-item">
                <span className="callout-item-label">Independent Research</span>
                <span className="callout-item-desc">Evaluating strategic partnership models, open finance integrations, and Consumer Duty safeguards.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};
