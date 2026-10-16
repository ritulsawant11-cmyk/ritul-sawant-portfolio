import React from 'react';
import { AnswerChoiceId, Chapter } from '../types/game';
import { Avatar } from './Avatar';
import { ChapterProgress } from './ChapterProgress';

interface FeedbackScreenProps {
  chapter: Chapter;
  selectedAnswerId: AnswerChoiceId;
  onRetry: () => void;
  onProceedToEnquiryTask: () => void;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  chapter,
  selectedAnswerId,
  onRetry,
  onProceedToEnquiryTask
}) => {
  const selectedChoice = chapter.choices.find((c) => c.id === selectedAnswerId);
  const isCorrect = selectedChoice?.isCorrect ?? false;

  return (
    <div className="screen-container">
      {/* Chapter Step Progress */}
      <ChapterProgress currentScreen="feedback" chapterNumber={chapter.number} />

      <div
        className="card-header-tag tag-lavender"
        style={{ marginBottom: '1rem', display: 'inline-flex' }}
        role="note"
      >
        <span>Step 4: Educational Feedback & Reasoning</span>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Avatar
            mood={isCorrect ? 'celebrating' : 'thinking'}
            size={90}
            caption={isCorrect ? 'Alex understands!' : 'Let’s look closer'}
          />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-navy-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Response: Choice {selectedChoice?.label}
            </span>
            <h1 className="screen-title" style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>
              {isCorrect ? 'Spot on — Alex keeps the pension!' : 'Not quite — let’s unpack why'}
            </h1>
          </div>
        </div>

        {/* Selected Answer Recap */}
        <div
          style={{
            padding: '0.9rem 1.1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--border-medium)',
            marginBottom: '1.25rem',
            fontSize: '1rem',
            color: 'var(--text-navy-body)'
          }}
        >
          <strong>You chose:</strong> “{selectedChoice?.text}”
        </div>

        {/* Feedback Box (Icons + Text, not colour alone) */}
        <div className={`feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`} role="alert">
          <div className="feedback-header">
            {isCorrect ? (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Accurate Understanding</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Helpful Clarification</span>
              </>
            )}
          </div>

          <div className="feedback-body">
            {/* Specific feedback on choice */}
            <p style={{ marginBottom: '0.75rem', fontWeight: 600 }}>
              {selectedChoice?.shortFeedback}
            </p>

            {/* Core pension principle */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-navy-muted)', marginBottom: '0.35rem' }}>
                Key Principle:
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-navy-dark)', lineHeight: '1.55' }}>
                “{chapter.primaryFeedback}”
              </p>
            </div>
          </div>
        </div>

        {/* What remains dependent on the scheme or provider */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem',
            marginBottom: '1.25rem',
            fontSize: '0.925rem',
            color: 'var(--text-navy-body)',
            lineHeight: '1.55'
          }}
        >
          <strong style={{ color: 'var(--text-navy-dark)', display: 'block', marginBottom: '0.35rem' }}>
            What depends on the scheme provider:
          </strong>
          {chapter.schemeDependenceNote}
        </div>

        {/* What Alex could check or ask next */}
        <div
          style={{
            backgroundColor: 'var(--teal-surface)',
            border: '1.5px solid var(--teal-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem',
            marginBottom: '1.5rem',
            fontSize: '0.925rem',
            color: 'var(--teal-text)',
            lineHeight: '1.55'
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.35rem' }}>
            What Alex should check or ask next:
          </strong>
          {chapter.nextStepsAdvice}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {!isCorrect ? (
            <button
              type="button"
              className="btn btn-teal btn-lg"
              onClick={onRetry}
              autoFocus
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Try Again (No Penalty)
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-teal btn-lg"
              onClick={onProceedToEnquiryTask}
              autoFocus
            >
              Apply This Lesson: Prepare Alex’s Enquiry
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
