import React from 'react';
import { ProjectData } from '../types';

interface ProjectsProps {
  projects: ProjectData[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="work" className="editorial-section" aria-labelledby="work-heading">
      <div className="container">
        <header>
          <div className="section-eyebrow">// 01. WEBSITES &amp; INTERACTIVE PROJECTS</div>
          <h2 id="work-heading" className="section-heading-editorial">
            Websites &amp; Interactive Projects
          </h2>
          <p className="section-subhead">
            A selection of websites and interactive tools I have created, bringing together strategic research, pensions knowledge, and practical customer-focused ideas.
          </p>
        </header>

        <div className="projects-editorial-grid">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="project-editorial-card"
              style={{
                borderColor: 'rgba(45, 212, 191, 0.25)',
                background: 'linear-gradient(180deg, #0e121a 0%, #0a0c10 100%)',
              }}
            >
              <div>
                <div className="card-top-meta">
                  <span className="card-tag">{project.tag}</span>
                  <span
                    className="card-status-badge"
                    style={{
                      borderColor: 'var(--accent-teal)',
                      color: 'var(--accent-mint)',
                      background: 'rgba(52, 245, 164, 0.08)',
                    }}
                  >
                    {project.statusBadge}
                  </span>
                </div>

                <h3 className="card-title">{project.title}</h3>
                <div className="card-subtitle">{project.subtitle}</div>

                <p className="card-description">{project.summary}</p>
              </div>

              <div className="card-actions" style={{ marginTop: '1.5rem' }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-editorial btn-primary-dark"
                    style={{
                      background: 'var(--accent-teal)',
                      color: '#050607',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    aria-label={`Visit ${project.title} in a new tab`}
                  >
                    Visit Website &nearr;
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
