import React from 'react';
import { ExperienceData, EducationData, CertificateData } from '../types';

interface ExperienceProps {
  experience: ExperienceData[];
  education: EducationData[];
  certificates: CertificateData[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience, education, certificates }) => {
  return (
    <section id="experience" className="editorial-section" aria-labelledby="experience-heading">
      <div className="container">
        <header>
          <div className="section-eyebrow">// 03. EXPERIENCE &amp; EDUCATION</div>
          <h2 id="experience-heading" className="section-heading-editorial">
            Career history &amp; academic foundations
          </h2>
          <p className="section-subhead">
            Operational roles demonstrating procedural discipline, customer service resilience, accurate documentation, and quantitative economics training.
          </p>
        </header>

        <div className="timeline-dual-grid" style={{ marginTop: '3rem' }}>
          {/* Left Column: Professional Experience */}
          <div className="timeline-column">
            <h3 className="timeline-column-title">// Professional Experience</h3>
            <div className="timeline-entries">
              {experience.map((item, idx) => (
                <article key={idx} className="timeline-entry-card">
                  <div className="entry-header">
                    <span className="entry-role">{item.role}</span>
                    <span className="entry-period">{item.period}</span>
                  </div>
                  <div className="entry-company">
                    {item.company} &middot; {item.location}
                  </div>
                  <p className="entry-summary">{item.summary}</p>

                  <ul className="entry-bullets">
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                  </ul>

                  <div className="entry-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="entry-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Education & Coursework */}
          <div className="timeline-column">
            <h3 className="timeline-column-title">// Education &amp; Completed Courses</h3>
            <div className="timeline-entries">
              {education.map((edu, idx) => (
                <article key={idx} className="timeline-entry-card">
                  <div className="entry-header">
                    <span className="entry-role">{edu.degree}</span>
                    <span className="entry-period">{edu.period}</span>
                  </div>
                  <div className="entry-company">
                    {edu.institution} &middot; {edu.location}
                  </div>
                  <p className="entry-summary">{edu.details}</p>
                </article>
              ))}

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-line)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-teal)', marginBottom: '1rem' }}>
                  // Targeted Coursework &amp; Executive Learning
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {certificates.map((cert, cIdx) => (
                    <div key={cIdx} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-line)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cert.title}</strong>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-teal)' }}>{cert.dateCompleted}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        {cert.issuer} {cert.platform ? `(${cert.platform})` : ''}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {cert.summary}
                      </p>
                      {cert.credentialId && (
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.675rem', color: 'var(--text-dim)' }}>ID: {cert.credentialId}</span>
                          {cert.verificationUrl && (
                            <a
                              href={cert.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-teal)', textDecoration: 'none' }}
                              aria-label={`Verify ${cert.title} credential on Coursera`}
                            >
                              Verify &nearr;
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
