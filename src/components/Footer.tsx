import React from 'react';
import { PortfolioProfile } from '../types';

interface FooterProps {
  profile: PortfolioProfile;
  onNavigateHome: (sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigateHome }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <footer className="site-footer-editorial" role="contentinfo">
      <div className="container">
        <div style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: '720px', margin: 0 }}>
            {profile.disclaimer}
          </p>
        </div>

        <div className="footer-content">
          <div>
            <strong style={{ color: 'var(--text-primary)', marginRight: '12px' }}>{profile.name}</strong>
            <span>&copy; {new Date().getFullYear()} &middot; Stirling, Scotland, UK</span>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="footer-nav">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateHome(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="btn-editorial btn-outline-dark"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
};
