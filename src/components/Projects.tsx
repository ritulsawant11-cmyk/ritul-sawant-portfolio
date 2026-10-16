import React from 'react';
import { ProjectData } from '../types';

interface ProjectsProps {
  projects: ProjectData[];
  onSelectProject: (slug: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, onSelectProject }) => {
  return (
    <section id="work" className="editorial-section" aria-labelledby="work-heading">
      <div className="container">
        <header>
          <div className="section-eyebrow">// 01. SELECTED WORK</div>
          <h2 id="work-heading" className="section-heading-editorial">
            Strategic research &amp; operational prototypes
          </h2>
          <p className="section-subhead">
            Independent research portfolios, commercial frameworks, and pensions customer-service web applications exploring partner fit, member clarity, and Consumer Duty governance.
          </p>
        </header>

        <div className="projects-editorial-grid">
          {projects.map((project) => {
            const isPensionSteps = project.slug === 'pension-steps';
            const isPensionQuest = project.slug === 'pension-quest';
            const isPartnershipLab = project.slug === 'partnership-lab';
            const isWebTool = isPensionSteps || isPensionQuest || isPartnershipLab;

            let primaryBtnLabel = 'View live site ↗';
            if (isPartnershipLab) primaryBtnLabel = 'Visit Website ↗';
            else if (isPensionQuest) primaryBtnLabel = 'Play Game Prototype ↗';
            else if (isPensionSteps) primaryBtnLabel = 'Launch Website Tool ↗';

            let secondaryBtnLabel = 'Read case study →';
            if (isPartnershipLab) secondaryBtnLabel = 'Platform Overview & Rationale →';
            else if (isPensionQuest) secondaryBtnLabel = 'Game Design & Rationale →';
            else if (isPensionSteps) secondaryBtnLabel = 'Architecture & Rationale →';

            return (
              <article
                key={project.slug}
                className="project-editorial-card"
                style={isWebTool ? { borderColor: 'rgba(45, 212, 191, 0.25)', background: 'linear-gradient(180deg, #0e121a 0%, #0a0c10 100%)' } : {}}
              >
                <div>
                  <div className="card-top-meta">
                    <span className="card-tag">{project.tag}</span>
                    <span
                      className="card-status-badge"
                      style={isWebTool ? { borderColor: 'var(--accent-teal)', color: 'var(--accent-mint)', background: 'rgba(52, 245, 164, 0.08)' } : {}}
                    >
                      {project.statusBadge}
                    </span>
                  </div>

                  <h3 className="card-title">{project.title}</h3>
                  <div className="card-subtitle">{project.subtitle}</div>

                  <p className="card-description">{project.summary}</p>

                  <div className="card-inquiry-box">
                    <div className="inquiry-label">
                      {isWebTool ? 'Operational Problem Solved' : 'Problem / Research Question'}
                    </div>
                    <div className="inquiry-text">{project.problem}</div>
                  </div>

                  <div className="card-methods-list" aria-label="Methods and frameworks used">
                    {project.methods.map((method, idx) => (
                      <span key={idx} className="method-pill">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-actions">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-editorial btn-primary-dark"
                      style={isWebTool ? { background: 'var(--accent-teal)', color: '#050607', flex: '1 1 auto' } : {}}
                      aria-label={`Launch ${project.title} live in a new tab`}
                    >
                      {primaryBtnLabel}
                    </a>
                  )}

                  <button
                    type="button"
                    className={`btn-editorial ${isWebTool ? 'btn-outline-dark' : 'btn-primary-dark'}`}
                    style={isWebTool ? {} : { flex: '1 1 auto' }}
                    onClick={() => onSelectProject(project.slug)}
                    aria-label={`View architecture and design details for ${project.title}`}
                  >
                    {secondaryBtnLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
