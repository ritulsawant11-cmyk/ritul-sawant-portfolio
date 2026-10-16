import React from 'react';
import { SkillGroup } from '../types';

interface SkillsProps {
  skills: SkillGroup[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <section id="skills" className="editorial-section" aria-labelledby="skills-heading">
      <div className="container">
        <header>
          <div className="section-eyebrow">// 04. SKILLS &amp; CAPABILITIES</div>
          <h2 id="skills-heading" className="section-heading-editorial">
            Demonstrated skills &amp; analytical methods
          </h2>
          <p className="section-subhead">
            Core operational proficiencies across pension enquiry handling, enterprise systems, office data tools, and partnership analysis frameworks.
          </p>
        </header>

        <div className="skills-groups-grid">
          {skills.map((group, idx) => (
            <article key={idx} className="skill-group-card">
              <h3 className="skill-group-title">{group.name}</h3>
              <p className="skill-group-desc">{group.description}</p>

              <ul className="skill-pills-list">
                {group.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="skill-pill-item">
                    <span className="skill-dash" aria-hidden="true">&rarr;</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
