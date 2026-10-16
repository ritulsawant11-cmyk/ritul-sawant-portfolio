import React from 'react';
import { AnswerChoiceId, Chapter } from '../types/game';
import { Avatar } from './Avatar';
import { ChapterProgress } from './ChapterProgress';

interface QuestionScreenProps {
  chapter: Chapter;
  selectedChoiceId: AnswerChoiceId | null;
  onSelectChoice: (choiceId: AnswerChoiceId) => void;
  onSubmitAnswer: () => void;
  onBackToDocument: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  chapter,
  selectedChoiceId,
  onSelectChoice,
  onSubmitAnswer,
  onBackToDocument
}) => {
  return (
    <div className="screen-container">
      {/* Chapter Step Progress */}
      <ChapterProgress currentScreen="question" chapterNumber={chapter.number} />

      {/* Top breadcrumb */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={onBackToDocument}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Re-inspect Document
        </button>

        <span className="card-header-tag tag-lavender" style={{ margin: 0 }}>
          Step 3: Your Decision
        </span>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Avatar mood="thinking" size={90} caption="Alex" />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Workplace Pension Dilemma
            </span>
            <h1 className="screen-title" style={{ fontSize: '1.65rem', marginTop: '0.25rem', lineHeight: '1.3' }}>
              {chapter.questionPrompt}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-navy-muted)', marginTop: '0.4rem' }}>
              Select the best answer below to advise Alex. You can retry freely without penalties.
            </p>
          </div>
        </div>

        {/* 3 Answer Cards */}
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {chapter.questionPrompt}
          </legend>

          <div className="choices-list" role="radiogroup" aria-label="Pension answer choices">
            {chapter.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;

              return (
                <button
                  key={choice.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`choice-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectChoice(choice.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      onSelectChoice(choice.id);
                    }
                  }}
                >
                  <div className="choice-letter" aria-hidden="true">
                    {choice.label}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="choice-text">
                      {choice.text}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ color: 'var(--teal-primary)', marginLeft: '0.5rem', alignSelf: 'center' }} aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Action button */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-teal btn-lg"
            onClick={onSubmitAnswer}
            disabled={!selectedChoiceId}
            style={{ minWidth: '220px' }}
          >
            Submit Answer
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
