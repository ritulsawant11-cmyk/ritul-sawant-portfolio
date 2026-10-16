import React from 'react';

interface DisclaimerNoticeProps {
  text: string;
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({ text }) => {
  return (
    <aside className="disclaimer-banner" aria-label="Portfolio notice">
      <div className="container">
        <div className="disclaimer-content">
          <span className="disclaimer-icon" aria-hidden="true">ℹ</span>
          <p>{text}</p>
        </div>
      </div>
    </aside>
  );
};
