import React from 'react';
import { PortfolioProfile, ProjectData } from '../types';

interface HeroProps {
  profile: PortfolioProfile;
  onNavigateSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  onNavigateSection,
}) => {
  return (
    <section className="hero-editorial" aria-label="Introduction and summary">
      <div className="container">
        <div className="hero-grid">
          {/* Narrative & Positioning */}
          <div className="hero-text-col">
            <div className="hero-status-pill">
              <span className="pulse-dot" aria-hidden="true"></span>
              <span>Stirling, Scotland · Strategic Partnerships &amp; Operations</span>
            </div>

            <h1 className="hero-title-main">
              Economics, <span className="serif-accent">partnerships</span>, and practical analysis.
            </h1>

            <p className="hero-paragraph">
              {profile.heroParagraph}
            </p>

            <div className="hero-cta-group">
              <a
                href="#work"
                className="btn-editorial btn-primary-dark"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('work');
                }}
              >
                Explore websites &darr;
              </a>

              <a
                href="#contact"
                className="btn-editorial btn-outline-dark"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('contact');
                }}
              >
                Get in touch &rarr;
              </a>

              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  download="Ritul_Sawant_CV.pdf"
                  className="btn-editorial btn-teal-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Ritul Sawant's verified CV PDF"
                >
                  Download CV (PDF) &nearr;
                </a>
              )}
            </div>

            <div className="hero-metadata-grid">
              <div className="meta-col">
                <span className="meta-label">Background</span>
                <span className="meta-value">Economics &amp; Sports Mgmt</span>
              </div>
              <div className="meta-col">
                <span className="meta-label">Current Role</span>
                <span className="meta-value">Diligenta (DC Pensions)</span>
              </div>
              <div className="meta-col">
                <span className="meta-label">Core Focus</span>
                <span className="meta-value">Strategic Partnerships</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
