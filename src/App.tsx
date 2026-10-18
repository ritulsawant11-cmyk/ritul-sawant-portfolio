import React, { useState, useEffect } from 'react';
import { portfolioData } from './data/portfolioData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentHash(hash);

      // Smooth section scrolling
      const sectionMatch = hash.replace(/^#\/?/, '');
      if (sectionMatch) {
        const targetId = (sectionMatch.startsWith('case-study') || sectionMatch.startsWith('project'))
          ? 'work'
          : sectionMatch;
        const el = document.getElementById(targetId);
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

  return (
    <>
      <Header
        profile={portfolioData.profile}
        currentHash={currentHash}
        onNavigateHome={handleNavigateHome}
      />

      <main id="main-content" role="main">
        <Hero
          profile={portfolioData.profile}
          onNavigateSection={handleNavigateHome}
        />
        <Projects
          projects={portfolioData.projects}
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

      <Footer
        profile={portfolioData.profile}
        onNavigateHome={handleNavigateHome}
      />
    </>
  );
};

export default App;
