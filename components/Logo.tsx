
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Globe - Subtle Earth representation */}
      <circle cx="32" cy="32" r="30" fill="#f0f9ff" />
      <path
        d="M32 2C15.4315 2 2 15.4315 2 32C2 48.5685 15.4315 62 32 62C48.5685 62 62 48.5685 62 32C62 15.4315 48.5685 2 32 2Z"
        stroke="#e0f2fe"
        strokeWidth="2"
      />
      
      {/* Globe Grid Lines */}
      <path d="M32 2V62" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 32H62" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="32" cy="32" rx="18" ry="30" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.5" />

      {/* The 'Grab' / Protecting Hand Shape */}
      <path
        d="M14 44C14 44 18 56 32 56C46 56 50 44 50 44"
        stroke="#15803d"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Central Leaf Growth */}
      <path
        d="M32 56V36"
        stroke="#16a34a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 36C32 36 20 32 20 20C20 30 28 36 32 36Z"
        fill="#4ade80"
        stroke="#16a34a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 36C32 36 44 32 44 20C44 30 36 36 32 36Z"
        fill="#22c55e"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
