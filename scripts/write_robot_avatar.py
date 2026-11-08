"""Write the new RobotAvatar.tsx (ink-toned, single data hue)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'components', 'common', 'RobotAvatar.tsx'))

JSX = r'''import React from 'react';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  return (
    <div
      className={`relative rounded-2xl bg-ink border border-ink/20 flex items-center justify-center text-white shadow-xs shadow-ink shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/4 h-3/4"
      >
        {/* Antenna */}
        <circle cx="24" cy="5" r="2.5" fill="#1D5FBF" />
        <rect x="22.5" y="6" width="3" height="7" rx="1.5" fill="#141414" />
        {/* Head */}
        <rect x="8" y="13" width="32" height="26" rx="8" fill="#141414" />
        {/* Visor Screen */}
        <rect x="12" y="17" width="24" height="16" rx="5" fill="#0A0A0A" />
        {/* Glowing Eyes */}
        <circle cx="18" cy="25" r="2.8" fill="#1D5FBF" />
        <circle cx="30" cy="25" r="2.8" fill="#1D5FBF" />
        {/* Ear nubs */}
        <rect x="5" y="21" width="3" height="8" rx="1.5" fill="#141414" />
        <rect x="40" y="21" width="3" height="8" rx="1.5" fill="#141414" />
        {/* Smile curve */}
        <path d="M21 30C22.5 31.2 25.5 31.2 27 30" stroke="#1D5FBF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* Tiny online pip */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-[#1D5FBF] shadow-sm" />
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
