import React, { useState } from 'react';
import { PortfolioProfile } from '../types';

interface HeaderProps {
  profile: PortfolioProfile;
  currentHash: string;
  onNavigateHome: (sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, currentHash, onNavigateHome }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Websites', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateHome(id);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="site-header" role="banner">
        <div className="container header-inner">
          <a
            href="#/"
            className="brand-wrapper"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            aria-label="Ritul Sawant Portfolio Home"
          >
            <span className="brand-monogram">RS</span>
            <div className="brand-details">
              <span className="brand-name">{profile.name}</span>
              <span className="brand-tag">Economics · Partnerships</span>
            </div>
          </a>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-nav-menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>

          <nav
            id="main-nav-menu"
            className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}
            role="navigation"
            aria-label="Main Portfolio Navigation"
          >
            <ul className="nav-links">
              {navItems.map((item) => {
                const isActive = currentHash === `#${item.id}` || currentHash === `#/${item.id}`;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`nav-item-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <a
              href="#contact"
              className="nav-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigateHome('contact');
              }}
            >
              Get in touch
            </a>
          </nav>
        </div>
      </header>
    </>
  );
};
