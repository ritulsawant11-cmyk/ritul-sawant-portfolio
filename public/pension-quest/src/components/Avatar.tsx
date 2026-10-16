import React from 'react';

interface AvatarProps {
  mood?: 'neutral' | 'thinking' | 'celebrating';
  size?: number;
  className?: string;
  caption?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  mood = 'neutral',
  size = 120,
  className = '',
  caption = 'Alex'
}) => {
  return (
    <div
      className={`avatar-wrapper ${className}`}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      aria-label={`Alex, friendly pension learner avatar (${mood})`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        {/* Soft Lavender Halo / Background Disk */}
        <circle cx="80" cy="80" r="72" fill="#EDE9FE" stroke="#DDD6FE" strokeWidth="4" />

        {/* Soft Yellow Decorative Accent Ring */}
        <circle cx="80" cy="80" r="77" fill="none" stroke="#FDE68A" strokeWidth="2" strokeDasharray="6 6" />

        {/* Torso / Teal Jumper */}
        <path
          d="M32 152 C32 120, 52 110, 80 110 C108 110, 128 120, 128 152 Z"
          fill="#0D7A75"
        />
        {/* Jumper Collar */}
        <path
          d="M68 110 Q80 122 92 110"
          stroke="#FAF6EE"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect x="73" y="90" width="14" height="24" rx="6" fill="#FBD5B5" />

        {/* Head / Face */}
        <ellipse cx="80" cy="74" rx="36" ry="40" fill="#FCD9B8" />

        {/* Soft Cheeks */}
        <ellipse cx="58" cy="82" rx="7" ry="4" fill="#F8B4A6" opacity="0.6" />
        <ellipse cx="102" cy="82" rx="7" ry="4" fill="#F8B4A6" opacity="0.6" />

        {/* Friendly Brown Hair */}
        <path
          d="M44 68 C44 42, 60 30, 80 30 C100 30, 116 42, 116 68 C116 72, 112 60, 104 54 C94 48, 66 48, 56 54 C48 60, 44 72, 44 68 Z"
          fill="#4A3428"
        />
        {/* Sideburns / Tufts */}
        <path d="M44 64 C42 70, 44 78, 48 80" stroke="#4A3428" strokeWidth="4" strokeLinecap="round" />
        <path d="M116 64 C118 70, 116 78, 112 80" stroke="#4A3428" strokeWidth="4" strokeLinecap="round" />

        {/* Glasses - Teal Frames */}
        <rect
          x="53"
          y="64"
          width="22"
          height="16"
          rx="5"
          fill="#FFFFFF"
          fillOpacity="0.4"
          stroke="#0F2338"
          strokeWidth="2.8"
        />
        <rect
          x="85"
          y="64"
          width="22"
          height="16"
          rx="5"
          fill="#FFFFFF"
          fillOpacity="0.4"
          stroke="#0F2338"
          strokeWidth="2.8"
        />
        {/* Glasses Bridge */}
        <line x1="75" y1="71" x2="85" y2="71" stroke="#0F2338" strokeWidth="2.8" />

        {/* Eyes (behind glasses) */}
        {mood === 'thinking' ? (
          <>
            {/* Looking slightly upward/questioning */}
            <circle cx="64" cy="70" r="3" fill="#0D1F33" />
            <circle cx="96" cy="70" r="3" fill="#0D1F33" />
            <circle cx="65" cy="69" r="1" fill="#FFFFFF" />
            <circle cx="97" cy="69" r="1" fill="#FFFFFF" />
          </>
        ) : mood === 'celebrating' ? (
          <>
            {/* Happy smiling eyes (curved arcs) */}
            <path d="M60 72 Q64 67 68 72" stroke="#0D1F33" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M92 72 Q96 67 100 72" stroke="#0D1F33" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Friendly open eyes */}
            <circle cx="64" cy="72" r="3" fill="#0D1F33" />
            <circle cx="96" cy="72" r="3" fill="#0D1F33" />
            <circle cx="65" cy="71" r="1" fill="#FFFFFF" />
            <circle cx="97" cy="71" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows */}
        {mood === 'thinking' ? (
          <>
            {/* Raised right eyebrow */}
            <path d="M57 59 Q64 58 71 61" stroke="#4A3428" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M89 60 Q96 55 103 57" stroke="#4A3428" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M57 60 Q64 57 71 60" stroke="#4A3428" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M89 60 Q96 57 103 60" stroke="#4A3428" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Nose */}
        <path d="M78 77 Q81 81 78 84" stroke="#DCA27C" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* Mouth */}
        {mood === 'thinking' ? (
          /* Slight contemplative pursed smile */
          <path d="M74 95 Q80 94 86 96" stroke="#8E4233" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : mood === 'celebrating' ? (
          /* Warm open smile */
          <path d="M71 93 Q80 102 89 93" stroke="#8E4233" strokeWidth="2.5" strokeLinecap="round" fill="#8E4233" />
        ) : (
          /* Gentle smile */
          <path d="M73 94 Q80 99 87 94" stroke="#8E4233" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
      {caption && (
        <span className="avatar-badge">
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0D7A75' }}></span>
          {caption}
        </span>
      )}
    </div>
  );
};
