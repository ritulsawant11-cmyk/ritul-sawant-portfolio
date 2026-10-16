import React from 'react';
import { EducationItem } from '../types';

interface EducationProps {
  education: EducationItem[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" className="portfolio-section" aria-labelledby="education-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-eyebrow">Academic Background</span>
          <h2 id="education-heading" className="section-title">Education</h2>
          <p className="section-subtitle">
            Formal university qualifications combining economic theory, analytical foundations, and strategic management.
          </p>
        </header>

        <div className="education-grid">
          {education.map((item, idx) => (
            <article key={idx} className="education-card">
              <h3 className="education-degree">{item.degree}</h3>
              <div className="education-institution">{item.institution}</div>
              <div className="education-period-loc">
                <span>{item.period}</span> &middot; <span>{item.location}</span>
              </div>
              {item.notes && <p className="education-notes">{item.notes}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
