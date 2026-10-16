import React from 'react';
import { Chapter } from '../types/game';
import { Avatar } from './Avatar';
import { ChapterProgress } from './ChapterProgress';

interface CompletionScreenProps {
  chapter: Chapter;
  onOpenJournal: () => void;
  onBackToHome: () => void;
  onReplayChapter: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  chapter,
  onOpenJournal,
  onBackToHome,
  onReplayChapter
}) => {
  return (
    <div className="screen-container">
      {/* Chapter Step Progress */}
      <ChapterProgress currentScreen="completion" chapterNumber={chapter.number} />

      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="card-header-tag tag-teal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Chapter Complete & Saved
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <Avatar mood="celebrating" size={130} caption="Alex — Confident and prepared" />
        </div>

        <h1 className="screen-title" style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>
          Well Done! Chapter 1 Complete
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-navy-body)', maxWidth: '620px', margin: '0 auto 1.75rem auto', lineHeight: '1.6' }}>
          You helped Alex understand their Defined Contribution pension pot and prepare the right questions for the provider.
        </p>

        {/* Takeaway Card */}
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto 2rem auto',
            backgroundColor: 'var(--bg-subtle)',
            border: '2px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--teal-primary)' }}>
              Summary Logged to Journal
            </span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.5rem' }}>
            {chapter.journalEntry.title}
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-navy-body)', lineHeight: '1.55', marginBottom: '1rem' }}>
            {chapter.keyTakeaway}
          </p>

          <div
            style={{
              borderTop: '1px solid var(--border-medium)',
              paddingTop: '0.75rem',
              fontSize: '0.875rem',
              color: 'var(--text-navy-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Permanent reference saved to your local device Learning Journal
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-teal btn-lg"
            onClick={onOpenJournal}
            autoFocus
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Open Learning Journal
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onReplayChapter}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Replay Chapter
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-lg"
            onClick={onBackToHome}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
