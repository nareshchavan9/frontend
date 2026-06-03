import React from 'react';

const ClinicalAIIcon = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sparkle 1 (Large, top-left) */}
      <path
        d="M9 3L10.5 6.5L14 8L10.5 9.5L9 13L7.5 9.5L4 8L7.5 6.5L9 3Z"
        fill="currentColor"
      />
      {/* Heartbeat/ECG Pulse line running through the lower half */}
      <path
        d="M2 17H6.5L8.5 12L11.5 21L13.5 15L15 17H22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkle 2 (Small, top-right) */}
      <path
        d="M19 5L19.75 6.75L21.5 7.5L19.75 8.25L19 10L18.25 8.25L16.5 7.5L18.25 6.75L19 5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ClinicalAIIcon;
