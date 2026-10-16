import React from 'react';
import { Screen } from '../types/game';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  unlockedJournalCount: number;
  onOpenDisclaimer: () => void;
  onOpenRestartModal: () => void;
  hasSavedProgress?: boolean;
  onStartStory?: (chapterId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  unlockedJournalCount,
  onOpenDisclaimer,
  onOpenRestartModal,
  hasSavedProgress = false,
  onStartStory
}) => {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <button
          className="brand-group"
          onClick={() => onNavigate('welcome')}
          aria-label="PensionQuest Home"
        >
          <div className="brand-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <span className="brand-title">PensionQuest</span>
            <span className="brand-badge">An interactive pension story</span>
          </div>
        </button>

        <nav className="nav-actions" aria-label="Main Navigation">
          <button
            type="button"
            className={`btn btn-sm ${currentScreen === 'welcome' || currentScreen === 'map' ? 'btn-teal' : 'btn-ghost'}`}
            onClick={() => onNavigate('welcome')}
            aria-current={currentScreen === 'welcome' ? 'page' : undefined}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home & Map
          </button>

          <button
            type="button"
            className={`btn btn-sm ${currentScreen === 'journal' ? 'btn-teal' : 'btn-ghost'}`}
            onClick={() => onNavigate('journal')}
            aria-current={currentScreen === 'journal' ? 'page' : undefined}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Learning Journal
            {unlockedJournalCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--gold-badge)',
                  color: 'var(--gold-text)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
                aria-label={`${unlockedJournalCount} journal entry unlocked`}
              >
                {unlockedJournalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onOpenDisclaimer}
            title="Read about PensionQuest, safeguards, and disclaimers"
            aria-label="About & safeguards"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            About & safeguards
          </button>

          {(currentScreen === 'welcome' || currentScreen === 'journal') && onStartStory && (
            <button
              type="button"
              className="btn btn-sm btn-teal"
              onClick={() => onStartStory('ch1')}
              aria-label={hasSavedProgress ? 'Continue your story' : 'Start Alex’s story'}
            >
              {hasSavedProgress ? 'Continue story →' : 'Start story →'}
            </button>
          )}

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={onOpenRestartModal}
            title="Reset progress and start over"
            aria-label="Restart progress"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Restart
          </button>
        </nav>
      </div>
    </header>
  );
};
