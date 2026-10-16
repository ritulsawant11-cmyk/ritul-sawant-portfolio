import React, { useState, useEffect } from 'react';
import { portfolioData } from './data/portfolioData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentHash(hash);

      // Support both #/case-study/:slug and #/project/:slug for backwards compatibility
      if (hash.startsWith('#/case-study/') || hash.startsWith('#/project/')) {
        const slug = hash.replace(/^#\/(case-study|project)\//, '').trim();
        const found = portfolioData.projects.find(
          (p) => p.slug === slug || (slug === 'partnership-lab' && p.slug === 'standard-life-moneyhub')
        );
        if (found) {
          setActiveSlug(found.slug);
          window.scrollTo(0, 0);
          return;
        }
      }

      setActiveSlug(null);

      // Smooth section scrolling
      const sectionMatch = hash.replace(/^#\/?/, '');
      if (sectionMatch && !sectionMatch.startsWith('case-study/') && !sectionMatch.startsWith('project/')) {
        const el = document.getElementById(sectionMatch);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateHome = (sectionId?: string) => {
    setActiveSlug(null);
    if (sectionId) {
      window.location.hash = `#${sectionId}`;
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.hash = '#/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProject = (slug: string) => {
    window.location.hash = `#/case-study/${slug}`;
  };

  const activeProject = portfolioData.projects.find((p) => p.slug === activeSlug);
  const featuredProject = portfolioData.projects.find((p) => p.featured) || portfolioData.projects[0];

  return (
    <>
      <Header
        profile={portfolioData.profile}
        currentHash={currentHash}
        onNavigateHome={handleNavigateHome}
      />

      {activeProject ? (
        <ProjectDetail
          project={activeProject}
          onBack={() => handleNavigateHome('work')}
        />
      ) : (
        <main id="main-content" role="main">
          <Hero
            profile={portfolioData.profile}
            featuredProject={featuredProject}
            onNavigateSection={handleNavigateHome}
            onSelectProject={handleSelectProject}
          />
          <Projects
            projects={portfolioData.projects}
            onSelectProject={handleSelectProject}
          />
          <About profile={portfolioData.profile} />
          <Experience
            experience={portfolioData.experience}
            education={portfolioData.education}
            certificates={portfolioData.certificates}
          />
          <Skills skills={portfolioData.skills} />
          <Contact profile={portfolioData.profile} />
        </main>
      )}

      <Footer
        profile={portfolioData.profile}
        onNavigateHome={handleNavigateHome}
      />
    </>
  );
};

export default App;
