import React from 'react';
import { Chapter } from '../types/game';
import { Avatar } from './Avatar';

interface WelcomeScreenProps {
  chapters: Chapter[];
  completedChapterIds: string[];
  onStartStory: (chapterId: string) => void;
  onOpenJournal: () => void;
  unlockedJournalCount: number;
  onOpenSafeguards: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  chapters,
  completedChapterIds,
  onStartStory,
  onOpenJournal,
  unlockedJournalCount,
  onOpenSafeguards
}) => {
  const workingChapter = chapters.find((c) => c.isPlayable) || chapters[0];
  const hasSavedProgress = completedChapterIds.length > 0 || unlockedJournalCount > 0;

  const scrollToJourneyMap = () => {
    const el = document.getElementById('journey-map');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const chapterIcons: Record<string, React.ReactNode> = {
    ch1: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    ch2: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="9" y1="22" x2="9" y2="22.01" />
        <line x1="15" y1="22" x2="15" y2="22.01" />
        <line x1="9" y1="6" x2="9" y2="6.01" />
        <line x1="15" y1="6" x2="15" y2="6.01" />
      </svg>
    ),
    ch3: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <circle cx="11" cy="11" r="3" />
      </svg>
    ),
    ch4: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    ch5: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <polyline points="3 7 12 5 21 7" />
        <path d="M6 13a3 3 0 0 0 6 0H6z" />
        <path d="M18 17a3 3 0 0 0 6 0h-6z" />
      </svg>
    )
  };

  return (
    <div className="screen-container">
      {/* Short Opening Notice */}
      <div className="safeguard-banner" role="note" aria-label="Educational Notice">
        <div className="safeguard-banner-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div>
          Independent educational prototype using fictional scenarios. Not financial advice or a pension account service.
        </div>
      </div>

      {/* 1. Redesigned Two-Column Desktop Hero Layout */}
      <section className="hero-two-column" aria-labelledby="hero-heading">
        {/* Left Column */}
        <div className="hero-left">
          <span className="hero-label-tag">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--gold-accent)' }} />
            An interactive pension story
          </span>

          <h1 id="hero-heading" className="hero-headline">
            A new job. An old pension. What happens next?
          </h1>

          <p className="hero-description">
            Meet Alex. Help them navigate everyday workplace pension situations through short stories and choices. Help Alex explore workplace pension questions—one decision at a time.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-teal btn-lg"
              onClick={() => onStartStory(workingChapter.id)}
              autoFocus
              aria-label={hasSavedProgress ? 'Continue your story' : 'Start Alex’s story'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {hasSavedProgress ? 'Continue your story →' : 'Start Alex’s story →'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={scrollToJourneyMap}
            >
              Explore the chapters
            </button>
          </div>

          <div className="hero-supporting-line">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Fictional scenarios · No timers · Retry freely
          </div>
        </div>

        {/* Right Column: Illustrated Scene */}
        <div className="hero-right">
          <div className="hero-scene-wrapper" aria-label="Illustrated scene of Alex and their workplace pension decision">
            <div className="hero-scene-card">
              {/* Speech bubble */}
              <div className="scene-floating-bubble" role="region" aria-label="Alex question">
                <span style={{ color: 'var(--teal-primary)', marginRight: '0.4rem', fontSize: '1.1rem' }}>💬</span>
                “Do I lose my pension when I leave?”
              </div>

              {/* Center row with Alex + connector + job offer */}
              <div className="scene-center-row">
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <Avatar mood="thinking" size={96} caption="Alex" />
                </div>

                <svg width="84" height="60" viewBox="0 0 84 60" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M 10 46 C 30 10, 54 50, 74 16" stroke="#F2BD57" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
                  <circle cx="10" cy="46" r="4" fill="#087F8C" />
                  <circle cx="74" cy="16" r="4" fill="#F2BD57" />
                </svg>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid var(--gold-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.85rem',
                    boxShadow: 'var(--shadow-sm)',
                    width: '132px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--gold-surface)',
                      border: '1px solid var(--gold-border)',
                      color: 'var(--gold-text)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.3rem auto'
                    }}
                  >
                    ★
                  </div>
                  <div style={{ fontSize: '0.785rem', fontWeight: 800, color: 'var(--text-navy-headings)' }}>New Job Offer</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-navy-muted)', marginTop: '0.15rem' }}>Starting Next Month</div>
                </div>
              </div>

              {/* Floating card labelled "Your old workplace pension" */}
              <div className="scene-floating-pension-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                  <span className="scene-card-label">Your old workplace pension</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor: 'var(--teal-surface)',
                      color: 'var(--teal-text)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700
                    }}
                  >
                    Defined Contribution
                  </span>
                </div>
                <div className="scene-card-title">Apex Retail Pension Pot</div>
                <div className="scene-card-sub">Pot stays held and invested by existing scheme provider</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Gameplay Preview */}
      <section className="preview-section" aria-labelledby="preview-heading">
        <div className="preview-card" role="region" aria-label="Story preview">
          <div className="preview-quote-box">
            <Avatar mood="thinking" size={84} caption="Alex" />
            <div style={{ flex: 1 }}>
              <span className="card-header-tag tag-teal" style={{ marginBottom: '0.35rem' }}>
                Chapter 1 Dilemma
              </span>
              <blockquote className="preview-speech-bubble" style={{ margin: 0 }}>
                “I’m leaving my job. Does that mean I lose my pension?”
              </blockquote>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-navy-muted)', marginTop: '0.45rem' }}>
                Help Alex inspect leaver paperwork and find out what happens to their workplace pot.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-teal-outline btn-lg"
            onClick={() => onStartStory(workingChapter.id)}
            aria-label="Explore Chapter 1: Alex changes jobs"
          >
            Explore this chapter →
          </button>
        </div>
      </section>

      {/* 3. Chapter Journey Map */}
      <section className="journey-map-section" id="journey-map" aria-labelledby="journey-map-heading">
        <div className="journey-header">
          <span className="card-header-tag tag-gold">Story Journey Map</span>
          <h2 id="journey-map-heading" className="journey-map-title">
            Explore Alex’s Pension Journey
          </h2>
          <p className="journey-map-subtitle">
            Follow Alex through critical UK workplace pension crossroads. Start with the complete, playable first chapter below.
          </p>
        </div>

        <div className="journey-map-grid">
          {chapters.map((chapter) => {
            const isCompleted = completedChapterIds.includes(chapter.id);
            const isPlayable = chapter.isPlayable;
            const icon = chapterIcons[chapter.id] || chapterIcons.ch1;

            return (
              <div
                key={chapter.id}
                className={`journey-node-card ${isPlayable ? 'available' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                role="region"
                aria-label={`Chapter ${chapter.number}: ${chapter.title}`}
              >
                <div>
                  <div className="node-header">
                    <div className="node-badge-group">
                      <div
                        className={`node-milestone-circle ${isCompleted ? 'milestone-teal' : isPlayable ? 'milestone-gold' : 'milestone-neutral'}`}
                      >
                        {isCompleted ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          String(chapter.number)
                        )}
                      </div>
                      <div className="node-icon-box" aria-hidden="true">
                        {icon}
                      </div>
                    </div>

                    {isCompleted ? (
                      <span className="card-header-tag tag-teal" style={{ margin: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Completed
                      </span>
                    ) : isPlayable ? (
                      <span className="card-header-tag tag-gold" style={{ margin: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Available
                      </span>
                    ) : (
                      <span className="card-header-tag tag-neutral" style={{ margin: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Coming later
                      </span>
                    )}
                  </div>

                  <h3 className="node-title">{chapter.title}</h3>
                  <p className="node-summary">{chapter.summary}</p>
                </div>

                <div className="node-footer">
                  {isPlayable ? (
                    <button
                      type="button"
                      className="btn btn-teal"
                      onClick={() => onStartStory(chapter.id)}
                      style={{ width: '100%' }}
                      aria-label={isCompleted ? `Replay Chapter 1: ${chapter.title}` : `Play Chapter 1: ${chapter.title}`}
                    >
                      {isCompleted ? 'Replay Chapter 1 →' : 'Play Chapter 1 →'}
                    </button>
                  ) : (
                    <div
                      className="node-locked-notice"
                      aria-label={`Chapter ${chapter.number} is planned and coming later`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Planned module · Not playable
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimers Link */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onOpenSafeguards}
          style={{ textDecoration: 'underline' }}
        >
          Read full educational disclaimers & non-affiliation details
        </button>
      </div>
    </div>
  );
};
