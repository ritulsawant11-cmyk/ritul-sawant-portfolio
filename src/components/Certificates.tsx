import React from 'react';
import { CertificateItem } from '../types';

interface CertificatesProps {
  certificates: CertificateItem[];
}

export const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <section id="certificates" className="portfolio-section" aria-labelledby="certificates-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-eyebrow">Continuing Education</span>
          <h2 id="certificates-heading" className="section-title">Certificates & Completed Courses</h2>
          <p className="section-subtitle">
            Targeted professional coursework and executive learning in governance, emerging technology policy, retirement principles, and financial analysis.
          </p>
        </header>

        <div className="safeguard-box" style={{ marginBottom: '2rem' }}>
          <div className="safeguard-box-title">Coursework Status Note</div>
          <p style={{ margin: 0 }}>
            These credentials represent completed executive and online education courses, not university degrees, regulated chartered qualifications, or accredited licenses to provide financial advice.
          </p>
        </div>

        <div className="cert-grid">
          {certificates.map((cert, idx) => (
            <article key={idx} className="cert-card">
              <div>
                <h3 className="cert-title">{cert.title}</h3>
                <div className="cert-issuer">
                  {cert.issuer} {cert.platform ? `(${cert.platform})` : ''}
                </div>
                <div className="cert-date">{cert.dateCompleted}</div>
                {cert.note && <p className="cert-note">{cert.note}</p>}
              </div>

              <div className="cert-meta">
                {cert.credentialId && (
                  <div>
                    <span className="cert-credential-id">ID: {cert.credentialId}</span>
                  </div>
                )}
                {cert.verificationUrl ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-teal"
                      style={{ fontSize: '0.825rem', display: 'inline-block', padding: '4px 10px', borderRadius: '4px' }}
                      aria-label={`Verify certificate for ${cert.title} on Coursera (opens in new tab)`}
                    >
                      Verify Credential &nearr;
                    </a>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                    Completed Course
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
