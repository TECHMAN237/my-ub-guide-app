import React from 'react';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-b from-[#1463F3] to-[#0D4CBF] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/4 h-3/4"
      >
        {/* Antenna */}
        <circle cx="24" cy="7" r="3" fill="#60A5FA" />
        <rect x="22.5" y="9" width="3" height="6" rx="1.5" fill="#93C5FD" />
        {/* Head */}
        <rect x="8" y="14" width="32" height="24" rx="8" fill="white" />
        {/* Visor Screen */}
        <rect x="12" y="18" width="24" height="15" rx="5" fill="#102A56" />
        {/* Glowing Eyes */}
        <circle cx="18" cy="25.5" r="2.8" fill="#38BDF8" />
        <circle cx="30" cy="25.5" r="2.8" fill="#38BDF8" />
        {/* Ear nubs */}
        <rect x="5" y="21" width="3" height="8" rx="1.5" fill="#93C5FD" />
        <rect x="40" y="21" width="3" height="8" rx="1.5" fill="#93C5FD" />
        {/* Smile curve */}
        <path d="M21 30C22.5 31.2 25.5 31.2 27 30" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* Tiny online pip */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
    </div>
  );
};
