import React, { useEffect, useRef } from 'react';

interface RestartConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal-dialog">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 id="restart-modal-title" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy-dark)' }}>
            Confirm Restart Progress
          </h2>
          <button
            ref={cancelBtnRef}
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onCancel}
            aria-label="Cancel restart"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-navy-body)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <div className="tag-amber" style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
            <strong>What will be deleted:</strong>
          </div>

          <p>
            Restarting will permanently clear:
          </p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Your completed chapter status for <strong>Chapter 1 (“Alex changes jobs”)</strong>.</li>
            <li>All unlocked reference entries saved in your <strong>Learning Journal</strong>.</li>
            <li>Any active choices or selections stored in this browser’s local storage on this device.</li>
          </ul>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-navy-muted)', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            You will be returned to the Welcome screen with a fresh start. No external accounts or cloud data are affected.
          </p>
        </div>

        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Keep My Progress
          </button>
          <button
            type="button"
            className="btn btn-teal"
            onClick={onConfirm}
            style={{ backgroundColor: '#B91C1C', borderColor: '#B91C1C' }}
          >
            Yes, Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};
