import React, { useEffect, useRef } from 'react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 id="disclaimer-modal-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-navy-dark)' }}>
            About PensionQuest & Safeguards
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onClose}
            aria-label="Close about and safeguards dialog"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-navy-body)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <div className="tag-amber" style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
            <strong>Educational Purpose:</strong> Independent prototype explaining UK Defined Contribution workplace pension administration through fictional stories.
          </div>

          <p>
            <strong>What this prototype is:</strong>
            An interactive learning experience designed to help adult learners understand common workplace pension administration scenarios, terminology, and practical questions.
          </p>

          <p>
            <strong>What this prototype is NOT:</strong>
          </p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>It is <strong>not</strong> financial, legal, or regulated advice.</li>
            <li>It is <strong>not</strong> a pension provider, scheme administrator, or portal.</li>
            <li>It provides <strong>no access</strong> to real pension accounts, balances, or records.</li>
            <li>It does <strong>not submit</strong> any requests, enquiries, or instructions to real pension schemes.</li>
            <li>It has <strong>no affiliation</strong> with Prudential, M&G, or any specific commercial employer or provider.</li>
          </ul>

          <p>
            <strong>General Learning vs Scheme-Specific Rules:</strong>
          </p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Defined contribution pension rules, fees, processing times, transfer options, and investment selections vary between schemes.</li>
            <li>This game does not make universal claims about processing timescales, tax outcomes, or scheme rules. Real scheme enquiries should always be confirmed directly with your scheme provider or administrator.</li>
            <li>All scenario documents, dates, and account figures are strictly fictional draft educational material.</li>
          </ul>

          <p>
            <strong>Local Device Storage:</strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-navy-muted)', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            Completed chapter progress and journal entries are stored strictly on your local browser (using localStorage) on this device. No personal data, tracking cookies, or remote accounts are used.
          </p>

          <div style={{ backgroundColor: 'var(--teal-surface)', border: '1px solid var(--teal-border)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginTop: '0.25rem' }}>
            <strong style={{ color: 'var(--teal-text)', display: 'block', marginBottom: '0.25rem' }}>
              Free Impartial Public Guidance:
            </strong>
            <p style={{ fontSize: '0.875rem' }}>
              For government-backed, free, and impartial guidance on workplace pensions, visit{' '}
              <a
                href="https://www.moneyhelper.org.uk"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--teal-text)', fontWeight: 700, textDecoration: 'underline' }}
              >
                MoneyHelper (moneyhelper.org.uk)
              </a>{' '}
              or the government’s{' '}
              <a
                href="https://www.gov.uk/find-pension-contact-details"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--teal-text)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Pension Tracing Service
              </a>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-teal" onClick={onClose}>
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
