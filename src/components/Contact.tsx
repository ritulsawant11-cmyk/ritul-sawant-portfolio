import React from 'react';
import { PortfolioProfile } from '../types';

interface ContactProps {
  profile: PortfolioProfile;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  return (
    <section id="contact" className="editorial-section" aria-labelledby="contact-heading">
      <div className="container">
        <header>
          <div className="section-eyebrow">// 05. CONTACT</div>
          <h2 id="contact-heading" className="section-heading-editorial">
            Let&apos;s connect.
          </h2>
        </header>

        <div className="contact-editorial-card">
          <div className="contact-flex-layout">
            <div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                I am actively seeking early-career opportunities in <strong>Strategic Partnerships</strong>, <strong>Partner Operations</strong>, and <strong>Financial Services Operations</strong> where I can contribute analytical rigour, front-line member empathy, and disciplined execution.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Based in Stirling, Scotland, with availability for roles across Central Scotland (Edinburgh/Glasgow) and hybrid/remote arrangements.
              </p>

              {profile.cvUrl && (
                <div>
                  <a
                    href={profile.cvUrl}
                    download="Ritul_Sawant_CV.pdf"
                    className="btn-editorial btn-primary-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download CV (PDF) &nearr;
                  </a>
                </div>
              )}
            </div>

            <div className="contact-methods-box">
              <div className="contact-method-row">
                <div className="contact-icon-bubble">@</div>
                <div className="contact-info-col">
                  <span className="contact-info-label">Direct Email</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="contact-info-link"
                    aria-label={`Send email to ${profile.email}`}
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="contact-method-row">
                <div className="contact-icon-bubble">in</div>
                <div className="contact-info-col">
                  <span className="contact-info-label">LinkedIn</span>
                  <a
                    href={profile.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-link"
                    aria-label="View LinkedIn profile (opens in new tab)"
                  >
                    linkedin.com/in/ritulsawant &nearr;
                  </a>
                </div>
              </div>

              <div className="contact-method-row">
                <div className="contact-icon-bubble">loc</div>
                <div className="contact-info-col">
                  <span className="contact-info-label">Location</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
