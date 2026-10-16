import React, { useState } from 'react';
import { Chapter } from '../types/game';

interface JournalScreenProps {
  chapters: Chapter[];
  unlockedChapterIds: string[];
  onBackToHome: () => void;
  onSelectChapter: (chapterId: string) => void;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  chapters,
  unlockedChapterIds,
  onBackToHome,
  onSelectChapter
}) => {
  const [showSampleEntry, setShowSampleEntry] = useState<boolean>(false);
  const ch1 = chapters.find((c) => c.id === 'ch1') || chapters[0];

  const hasUnlockedEntries = unlockedChapterIds.length > 0;

  return (
    <div className="screen-container">
      {/* Header and Print action */}
      <div className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="card-header-tag tag-lavender">Learner Reference Base</span>
          <h1 className="screen-title">Learning Journal</h1>
          <p className="screen-subtitle">
            Your personal log of UK workplace pension principles, misconceptions clarified, and useful questions for providers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
            title="Print or export journal notes"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Notes
          </button>

          <button
            type="button"
            className="btn btn-teal btn-sm"
            onClick={onBackToHome}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            Home & Map
          </button>
        </div>
      </div>

      {/* Local Storage Disclosure */}
      <div
        style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          color: 'var(--text-navy-muted)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          Saved locally in your browser storage on this device. No personal data, cookies, or account synchronisation.
        </span>
      </div>

      {/* Clear Empty State (when 0 chapters completed) */}
      {!hasUnlockedEntries && (
        <div className="journal-empty-state" role="region" aria-label="Journal empty state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto', display: 'block' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.5rem' }}>
            Your Learning Journal is currently empty
          </h2>
          <p style={{ color: 'var(--text-navy-muted)', maxWidth: '520px', margin: '0 auto 1.25rem auto', lineHeight: '1.5' }}>
            As you guide Alex through workplace scenarios, your key lessons, clarified misconceptions, and useful provider enquiry questions will appear here.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-teal"
              onClick={() => onSelectChapter(ch1.id)}
            >
              Start Chapter 1 to unlock notes
            </button>

            <button
              type="button"
              className="sample-toggle-pill"
              onClick={() => setShowSampleEntry(!showSampleEntry)}
              aria-expanded={showSampleEntry}
            >
              {showSampleEntry ? 'Hide sample journal entry' : 'Preview sample journal entry'}
            </button>
          </div>
        </div>
      )}

      {/* Sample Entry Preview Banner */}
      {!hasUnlockedEntries && showSampleEntry && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="sample-badge">Sample Preview</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)', fontStyle: 'italic' }}>
              This is how your journal entry will look after finishing Chapter 1.
            </span>
          </div>

          <article
            className="card"
            style={{ borderLeft: '6px solid var(--amber-primary)', backgroundColor: '#FFFFFF' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="card-header-tag tag-amber" style={{ margin: 0 }}>
                Sample Preview · Chapter 1
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)' }}>
                {ch1.topic}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.75rem' }}>
              {ch1.journalEntry.title}
            </h2>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--teal-primary)',
                marginBottom: '1.25rem',
                fontSize: '1.025rem',
                fontWeight: 600,
                color: 'var(--text-navy-dark)'
              }}
            >
              {ch1.journalEntry.keyTakeaway}
            </div>

            {/* Section 1: What Alex Learned */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' }}>
              1. What Alex Learned:
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text-navy-body)', lineHeight: '1.55' }}>
              {ch1.journalEntry.whatAlexLearned.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>

            {/* Section 2: Misconception Clarified */}
            <div
              style={{
                backgroundColor: 'var(--amber-surface)',
                border: '1.5px solid var(--amber-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.925rem',
                color: 'var(--amber-text)'
              }}
            >
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>2. Misconception Clarified:</strong>
              {ch1.journalEntry.misconceptionClarified}
            </div>

            {/* Section 3: Useful Questions to Ask */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' }}>
              3. Useful Questions to Ask a Pension Provider:
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--teal-text)', fontWeight: 600 }}>
              {ch1.journalEntry.usefulQuestionsToAsk.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>

            {/* Section 4: Public Guidance */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1rem',
                fontSize: '0.875rem'
              }}
            >
              <strong style={{ color: 'var(--text-navy-dark)', display: 'block', marginBottom: '0.25rem' }}>
                4. Verified Public Guidance:
              </strong>
              <p style={{ color: 'var(--text-navy-body)', marginBottom: '0.35rem' }}>
                {ch1.moneyHelper.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-navy-muted)', marginBottom: '0.5rem' }}>
                Source: {ch1.moneyHelper.verifiedSource} · {ch1.moneyHelper.reviewDate}
              </div>
              <a
                href={ch1.moneyHelper.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--teal-primary)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Visit MoneyHelper workplace guidance →
              </a>
            </div>
          </article>
        </div>
      )}

      {/* Unlocked Chapters List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {chapters.map((chapter) => {
          const isUnlocked = unlockedChapterIds.includes(chapter.id);

          if (isUnlocked) {
            return (
              <article
                key={chapter.id}
                className="card"
                style={{ borderLeft: '6px solid var(--teal-primary)' }}
                aria-labelledby={`journal-entry-${chapter.id}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="card-header-tag tag-teal" style={{ margin: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Chapter {chapter.number} Mastered
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)' }}>
                      {chapter.topic}
                    </span>
                  </div>

                  {/* Replay Chapter Button */}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectChapter(chapter.id)}
                    aria-label={`Replay Chapter ${chapter.number}: ${chapter.title}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    Replay Chapter {chapter.number}
                  </button>
                </div>

                <h2 id={`journal-entry-${chapter.id}`} style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.75rem' }}>
                  {chapter.journalEntry.title}
                </h2>

                {/* Core takeaway callout */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--teal-primary)',
                    marginBottom: '1.25rem',
                    fontSize: '1.025rem',
                    fontWeight: 600,
                    color: 'var(--text-navy-dark)'
                  }}
                >
                  {chapter.journalEntry.keyTakeaway}
                </div>

                {/* 1. What Alex Learned */}
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' }}>
                  1. What Alex Learned:
                </h3>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text-navy-body)', lineHeight: '1.55' }}>
                  {chapter.journalEntry.whatAlexLearned.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                {/* 2. Misconception Clarified */}
                <div
                  style={{
                    backgroundColor: 'var(--amber-surface)',
                    border: '1.5px solid var(--amber-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.925rem',
                    color: 'var(--amber-text)'
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>2. Misconception Clarified:</strong>
                  {chapter.journalEntry.misconceptionClarified}
                </div>

                {/* 3. Useful Questions to Ask a Provider */}
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.4rem' }}>
                  3. Useful Questions to Ask Your Pension Provider:
                </h3>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--teal-text)', fontWeight: 600 }}>
                  {chapter.journalEntry.usefulQuestionsToAsk.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>

                {/* Practical Tip */}
                {chapter.journalEntry.practicalTip && (
                  <div
                    style={{
                      backgroundColor: 'var(--lavender-surface)',
                      border: '1.5px solid var(--lavender-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem',
                      color: 'var(--lavender-text)'
                    }}
                  >
                    <strong>Practical Tip:</strong> {chapter.journalEntry.practicalTip}
                  </div>
                )}

                {/* 4. Verified Public Guidance Link */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.95rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <strong style={{ color: 'var(--text-navy-dark)', display: 'block', marginBottom: '0.25rem' }}>
                    4. Verified Public Guidance:
                  </strong>
                  <p style={{ color: 'var(--text-navy-body)', marginBottom: '0.35rem' }}>
                    {chapter.moneyHelper.description}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-navy-muted)', marginBottom: '0.5rem' }}>
                    Official source: {chapter.moneyHelper.verifiedSource} · {chapter.moneyHelper.reviewDate}
                  </div>
                  <a
                    href={chapter.moneyHelper.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--teal-primary)',
                      fontWeight: 700,
                      textDecoration: 'underline'
                    }}
                  >
                    Visit official guidance on MoneyHelper →
                  </a>
                </div>
              </article>
            );
          }

          // Unfinished chapters
          return (
            <div
              key={chapter.id}
              className="card"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                opacity: 0.8,
                borderStyle: 'dashed'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="card-header-tag tag-neutral" style={{ margin: 0 }}>
                  Chapter {chapter.number} — Coming later
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)' }}>
                  {chapter.topic}
                </span>
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-navy-muted)', margin: '0.5rem 0 0.25rem 0' }}>
                {chapter.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-navy-muted)', margin: 0 }}>
                This learning journal entry will unlock when Chapter {chapter.number} is released and completed.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
