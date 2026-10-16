import React from 'react';
import { PortfolioProfile, ProjectData } from '../types';

interface HeroProps {
  profile: PortfolioProfile;
  featuredProject?: ProjectData;
  onNavigateSection: (sectionId: string) => void;
  onSelectProject: (slug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  featuredProject,
  onNavigateSection,
  onSelectProject,
}) => {
  return (
    <section className="hero-editorial" aria-label="Introduction and summary">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Narrative & Positioning */}
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
                Explore my work &darr;
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

          {/* Right Column: Featured Case Study Spotlight Card */}
          {featuredProject && (
            <div className="hero-spotlight-col">
              <aside className="featured-spotlight-card" aria-label="Featured Research Project">
                <div className="spotlight-eyebrow">
                  <span className="spotlight-badge">// FEATURED CASE STUDY</span>
                  <span className="spotlight-status">COMPLETE</span>
                </div>

                <h2 className="spotlight-title">{featuredProject.title}</h2>
                <div className="spotlight-subtitle">{featuredProject.subtitle}</div>

                <p className="spotlight-summary">
                  Independent analysis evaluating how a legacy DC pension provider paired with an Open Finance fintech to address member disengagement, tackle the £31.1B lost pensions problem, and design an employer onboarding pilot.
                </p>

                <div className="spotlight-stats-row">
                  <div className="spotlight-stat-item">
                    <span className="stat-key">Sector</span>
                    <span className="stat-val">Open Finance / DC Pensions</span>
                  </div>
                  <div className="spotlight-stat-item">
                    <span className="stat-key">Framework</span>
                    <span className="stat-val">FCA Consumer Duty</span>
                  </div>
                </div>

                <div className="spotlight-actions">
                  <button
                    type="button"
                    className="btn-editorial btn-primary-dark"
                    style={{ flex: 1 }}
                    onClick={() => onSelectProject(featuredProject.slug)}
                  >
                    Read case study &rarr;
                  </button>
                  {featuredProject.liveUrl && (
                    <a
                      href={featuredProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-editorial btn-outline-dark"
                      aria-label="View live case study on Partnership Lab"
                    >
                      Live link &nearr;
                    </a>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
