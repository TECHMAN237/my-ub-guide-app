import React from 'react';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2">
        <path
          d="M12 2.25 14.35 9.65 21.75 12 14.35 14.35 12 21.75 9.65 14.35 2.25 12 9.65 9.65Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
