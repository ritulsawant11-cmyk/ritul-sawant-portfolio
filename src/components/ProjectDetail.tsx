import React, { useEffect, useState } from 'react';
import { ProjectData } from '../types';

interface ProjectDetailProps {
  project: ProjectData;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [showLiveEmbed, setShowLiveEmbed] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${project.title} | Ritul Sawant Portfolio`;
    return () => {
      document.title = 'Ritul Sawant | Economics, Strategic Partnerships & Operations';
    };
  }, [project.title]);

  const isPensionSteps = project.slug === 'pension-steps';
  const isPensionQuest = project.slug === 'pension-quest';
  const isPartnershipLab = project.slug === 'partnership-lab';
  const isInteractiveTool = isPensionSteps || isPensionQuest || isPartnershipLab;

  let detailLiveLabel = 'View on Partnership Lab ↗';
  if (isPartnershipLab) detailLiveLabel = 'Visit Live Website ↗';
  else if (isPensionQuest) detailLiveLabel = 'Play Game Prototype ↗';
  else if (isPensionSteps) detailLiveLabel = 'Launch Web Application ↗';

  const embedSrc = project.embedUrl || project.liveUrl;

  return (
    <main id="main-content" className="case-study-view" role="main">
      <div className="container container-narrow">
        <a
          href="#/work"
          className="back-nav-btn"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          &larr; Back to all selected work
        </a>

        <header className="case-study-hero">
          <div className="case-study-tag">{project.tag}</div>
          <h1 className="case-study-title">{project.title}</h1>
          <div className="case-study-sub">{project.subtitle}</div>

          <div className="case-study-meta-bar">
            <span className="card-status-badge">{project.statusBadge}</span>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-editorial btn-primary-dark"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                {detailLiveLabel}
              </a>
            )}
          </div>
        </header>

        {/* Live Interactive Embed for Tools & Platforms */}
        {isInteractiveTool && embedSrc && (
          <section className="live-tool-preview-card" aria-label="Live interactive application preview">
            <div className="live-tool-header">
              <div className="live-tool-badge">
                <span className="pulse-dot" aria-hidden="true"></span>
                <span>
                  {isPartnershipLab
                    ? 'Live Research Platform'
                    : isPensionQuest
                    ? 'Live Interactive Educational Game'
                    : 'Live Interactive Web Application'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-editorial btn-outline-dark"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  onClick={() => setShowLiveEmbed(!showLiveEmbed)}
                >
                  {showLiveEmbed ? 'Hide interactive preview' : 'Show interactive preview'}
                </button>
                <a
                  href={project.liveUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial btn-teal-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  {isPartnershipLab
                    ? 'Open website in new tab ↗'
                    : isPensionQuest
                    ? 'Play fullscreen in new tab ↗'
                    : 'Open fullscreen in new tab ↗'}
                </a>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {isPartnershipLab
                ? 'Explore the live Partnership Lab research publication below (browse multi-chapter case studies, the Opportunity Lab, and the 7-step methodology):'
                : isPensionQuest
                ? 'Play Chapter 1 ("Alex changes jobs") below with interactive document inspection, unpunished decision retries, and customer service enquiry tasks:'
                : 'Test the 3-stage customer preparation workflow below (select an enquiry, view the tailored documentation checklist, and preview the call plan worksheet):'}
            </p>

            {showLiveEmbed && (
              <div className="tool-iframe-wrapper">
                <iframe
                  src={embedSrc}
                  title={
                    isPartnershipLab
                      ? 'Partnership Lab Research Platform'
                      : isPensionQuest
                      ? 'PensionQuest Playable Educational Game'
                      : 'PensionSteps Interactive Customer Preparation Tool'
                  }
                  className="tool-iframe"
                  loading="lazy"
                />
              </div>
            )}
          </section>
        )}

        {project.safeguardNotice && (
          <aside className="safeguards-editorial-box" aria-label="Evidence and research safeguards">
            <div className="safeguards-title">// Evidence Classification &amp; Boundaries</div>
            <p>{project.safeguardNotice}</p>
          </aside>
        )}

        <div className="case-study-sections-container">
          {project.sections.map((sec, idx) => (
            <article key={idx} className="case-study-section-card">
              <div className="cs-section-header">
                <h2 className="cs-section-title">{sec.title}</h2>
                {sec.label && (
                  <span className={`cs-label-badge ${sec.label}`}>
                    {sec.label}
                  </span>
                )}
              </div>

              <div className="cs-body-text">{sec.body}</div>

              {sec.table && (
                <div className="editorial-table-wrapper">
                  <table className="editorial-table">
                    <thead>
                      <tr>
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>
                              {cIdx === 0 ? <strong>{cell}</strong> : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sec.bulletPoints && (
                <ul className="cs-bullet-list">
                  {sec.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx}>{bp}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-line)' }}>
          <button
            type="button"
            className="btn-editorial btn-primary-dark"
            onClick={onBack}
          >
            &larr; Return to portfolio
          </button>
        </div>
      </div>
    </main>
  );
};
