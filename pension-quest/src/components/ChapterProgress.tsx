import React from 'react';
import { Screen } from '../types/game';

interface ChapterProgressProps {
  currentScreen: Screen;
  chapterNumber: number;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  currentScreen,
  chapterNumber
}) => {
  const steps: { key: Screen; label: string; number: number }[] = [
    { key: 'story', label: '1. Situation', number: 1 },
    { key: 'document', label: '2. Document', number: 2 },
    { key: 'question', label: '3. Decision', number: 3 },
    { key: 'feedback', label: '4. Reasoning', number: 4 },
    { key: 'enquiry', label: '5. Enquiry', number: 5 },
    { key: 'completion', label: '6. Takeaway', number: 6 }
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentScreen);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <nav className="chapter-stepper" aria-label="Chapter progress steps">
      <div className="stepper-label">
        Chapter {chapterNumber} Story
      </div>

      <div className="stepper-steps">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isDone = idx < activeIndex;

          return (
            <span
              key={step.key}
              className={`stepper-step ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : null}
              {step.label}
            </span>
          );
        })}
      </div>
    </nav>
  );
};
