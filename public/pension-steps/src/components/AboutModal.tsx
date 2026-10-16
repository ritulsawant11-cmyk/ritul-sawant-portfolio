import React, { useEffect, useRef } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-dialog-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="about-dialog-heading" className="modal-title">
            About PensionSteps &amp; Important Safeguards
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p>
            <strong>PensionSteps</strong> is an independent UK pension-enquiry preparation tool. It helps users prepare for administrative enquiries, organise questions, and print a useful call plan.
          </p>

          <h4>What PensionSteps Is Not</h4>
          <p>
            PensionSteps is <strong>not</strong> a pension provider, financial adviser, account portal, or live account service. It cannot submit requests or make changes to your pension accounts.
          </p>

          <h4>Independent Portfolio Prototype</h4>
          <p>
            This website is an independent educational tool. It is not affiliated with, endorsed by, or connected to any employer, pension provider, third-party administrator, master trust, or government authority (such as the DWP, MoneyHelper, or The Pensions Regulator).
          </p>

          <h4>Not Regulated Financial Advice</h4>
          <p>
            PensionSteps provides administrative organisation checklists and suggested conversational wording. It does not provide regulated financial advice, investment recommendations, or legal guidance under the UK Financial Services and Markets Act 2000. It does not evaluate the suitability of pension consolidation, transfers, withdrawals, or investment allocations.
          </p>

          <h4>Scheme Rules &amp; Provider Procedures Differ</h4>
          <p>
            All UK pension schemes operate under distinct trust deeds, scheme rules, and administrator procedures. Processing timescales and required identification documents vary between providers. Requirements must always be checked directly with your scheme administrator.
          </p>

          <h4>Zero Personal Data Collection</h4>
          <p>
            This tool does not collect, ask for, or store personal identification data. Do not enter names, full addresses, National Insurance numbers, or policy account figures. All checklist selections and notes remain strictly in your browser’s temporary memory during your current visit and are cleared upon reset.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-primary-teal"
            onClick={onClose}
          >
            Close &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
};
