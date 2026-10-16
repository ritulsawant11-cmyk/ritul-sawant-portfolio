import React from 'react';
import { Chapter } from '../types/game';
import { Avatar } from './Avatar';
import { ChapterProgress } from './ChapterProgress';

interface StoryScreenProps {
  chapter: Chapter;
  onProceedToDocument: () => void;
  onBackToHome: () => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({
  chapter,
  onProceedToDocument,
  onBackToHome
}) => {
  return (
    <div className="screen-container">
      {/* Chapter Step Progress */}
      <ChapterProgress currentScreen="story" chapterNumber={chapter.number} />

      {/* Breadcrumb / Navigation */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onBackToHome}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </button>

        <span className="card-header-tag tag-lavender" style={{ margin: 0 }}>
          Step 1: The Situation
        </span>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
          <Avatar mood="thinking" size={120} caption="Alex — Contemplating the move" />
          <h1 className="screen-title" style={{ marginTop: '1rem', marginBottom: '0.35rem' }}>
            {chapter.title}
          </h1>
          <p className="screen-subtitle">
            {chapter.subtitle}
          </p>
        </div>

        {/* Narrative Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.05rem', color: 'var(--text-navy-body)', lineHeight: '1.65' }}>
          {chapter.storyIntro.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Key Background Facts Box */}
        <div
          style={{
            backgroundColor: 'var(--amber-surface)',
            border: '1.5px solid var(--amber-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.5rem'
          }}
          role="region"
          aria-label="Key Scenario Facts"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--amber-text)', fontSize: '0.95rem' }}>
              Scenario Summary & Key Facts
            </span>
          </div>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--text-navy-dark)' }}>
            {chapter.keyFacts.map((fact, idx) => (
              <li key={idx}>{fact}</li>
            ))}
          </ul>
        </div>

        {/* Call to action */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-teal btn-lg"
            onClick={onProceedToDocument}
            autoFocus
          >
            Inspect Alex’s departure document
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
