import React from 'react';
import { Chapter } from '../types/game';
import { ChapterProgress } from './ChapterProgress';

interface DocumentScreenProps {
  chapter: Chapter;
  onProceedToQuestion: () => void;
  onBackToStory: () => void;
}

export const DocumentScreen: React.FC<DocumentScreenProps> = ({
  chapter,
  onProceedToQuestion,
  onBackToStory
}) => {
  const doc = chapter.document;

  return (
    <div className="screen-container">
      {/* Chapter Step Progress */}
      <ChapterProgress currentScreen="document" chapterNumber={chapter.number} />

      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onBackToStory}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Situation
        </button>

        <span className="card-header-tag tag-lavender" style={{ margin: 0 }}>
          Step 2: Inspect Document
        </span>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 className="screen-title" style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
            Alex’s Departure Paperwork
          </h1>
          <p className="screen-subtitle">
            Inspect the departure summary email from Alex’s employer to find clues about their pension pot.
          </p>
        </div>

        {/* Fictional Document Container */}
        {doc && (
          <div className="fictional-doc-wrapper" role="region" aria-label="Fictional Departure Document">
            <div className="fictional-watermark" aria-label="Notice: Fictional document">
              Fictional Document · For Educational Use Only
            </div>

            <div className="fictional-doc-header">
              <h2 className="fictional-doc-title">{doc.title}</h2>
              <div className="fictional-doc-issuer">{doc.issuer}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)', marginTop: '0.2rem' }}>
                Recipient: <strong>{doc.recipient}</strong> · Date: {doc.date} · Ref: {doc.referenceNumber}
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-navy-body)', marginBottom: '1.25rem', lineHeight: '1.55' }}>
              {doc.summary}
            </p>

            <div className="fictional-grid">
              {doc.keyDetails.map((detail, idx) => (
                <div key={idx} className="fictional-cell">
                  <div className="fictional-cell-label">{detail.label}</div>
                  <div className="fictional-cell-value">{detail.value}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: 'var(--amber-surface)',
                border: '1px solid var(--amber-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                color: 'var(--amber-text)',
                fontWeight: 600
              }}
            >
              <strong>Important Notice:</strong> {doc.importantNotice}
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-teal btn-lg"
            onClick={onProceedToQuestion}
            autoFocus
          >
            Continue to Alex’s Decision
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
