import React from 'react';
import { Chapter } from '../types/game';
import { ChapterProgress } from './ChapterProgress';
import { Avatar } from './Avatar';

interface EnquiryTaskScreenProps {
  chapter: Chapter;
  selectedEnquiryIds: string[];
  onToggleEnquiry: (id: string) => void;
  onCompleteChapter: () => void;
  onBackToFeedback: () => void;
}

export const EnquiryTaskScreen: React.FC<EnquiryTaskScreenProps> = ({
  chapter,
  selectedEnquiryIds,
  onToggleEnquiry,
  onCompleteChapter,
  onBackToFeedback
}) => {
  const task = chapter.enquiryTask;
  if (!task) return null;

  const usefulCount = task.options.filter((o) => o.isUseful).length;
  const selectedUsefulCount = task.options.filter(
    (o) => o.isUseful && selectedEnquiryIds.includes(o.id)
  ).length;
  const selectedInappropriateCount = task.options.filter(
    (o) => !o.isUseful && selectedEnquiryIds.includes(o.id)
  ).length;

  return (
    <div className="screen-container">
      {/* Chapter Step Progress */}
      <ChapterProgress currentScreen="enquiry" chapterNumber={chapter.number} />

      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onBackToFeedback}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Reasoning
        </button>

        <span className="card-header-tag tag-lavender" style={{ margin: 0 }}>
          Step 5: Customer Service Activity
        </span>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Avatar mood="neutral" size={80} caption="Alex preparing enquiry" />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Interactive Task
            </span>
            <h1 className="screen-title" style={{ fontSize: '1.65rem', marginTop: '0.25rem', lineHeight: '1.3' }}>
              {task.prompt}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-navy-muted)', marginTop: '0.4rem', lineHeight: '1.5' }}>
              {task.scenario}
            </p>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}
        >
          <span style={{ fontSize: '0.9rem', color: 'var(--text-navy-body)', fontWeight: 600 }}>
            Select the questions below to inspect how each affects Alex’s pension:
          </span>
          <span
            className={`card-header-tag ${
              selectedUsefulCount === usefulCount && selectedInappropriateCount === 0
                ? 'tag-teal'
                : 'tag-amber'
            }`}
            style={{ margin: 0 }}
          >
            {selectedUsefulCount} of {usefulCount} Essential Questions Selected
          </span>
        </div>

        {/* Interactive Questions List */}
        <div className="enquiry-list" role="group" aria-label="Questions for pension provider">
          {task.options.map((option) => {
            const isSelected = selectedEnquiryIds.includes(option.id);

            return (
              <div
                key={option.id}
                className={`enquiry-item-card ${isSelected ? 'selected' : ''}`}
              >
                <button
                  type="button"
                  className="enquiry-interactive-btn"
                  onClick={() => onToggleEnquiry(option.id)}
                  aria-pressed={isSelected}
                >
                  <div className="enquiry-checkbox-box" aria-hidden="true">
                    {isSelected ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span className="enquiry-item-text">
                      {option.question}
                    </span>
                  </div>
                </button>

                {/* Educational Feedback Panel upon selection */}
                {isSelected && (
                  <div
                    className={`enquiry-feedback-panel ${
                      option.isUseful
                        ? 'enquiry-feedback-useful'
                        : 'enquiry-feedback-not-useful'
                    }`}
                    role="note"
                  >
                    <div style={{ fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {option.isUseful ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Effective Question:</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span>Inappropriate or Unrealistic Request:</span>
                        </>
                      )}
                    </div>
                    <p>{option.whyItHelps}</p>
                    <p style={{ marginTop: '0.35rem', fontStyle: 'italic', opacity: 0.9 }}>
                      Context: {option.practicalContext}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-teal btn-lg"
            onClick={onCompleteChapter}
            disabled={selectedUsefulCount === 0}
            style={{ minWidth: '260px' }}
          >
            Complete Chapter & Save to Journal
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
