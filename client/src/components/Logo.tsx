import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
      >
        <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
        <path
          d="M10 11L6 16L10 21"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 11L26 16L22 21"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="3" fill="#22d3ee" />
        <line x1="16" y1="16" x2="11" y2="13" stroke="#22d3ee" strokeWidth="1.5" />
        <line x1="16" y1="16" x2="21" y2="19" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="11" cy="13" r="1.5" fill="white" />
        <circle cx="21" cy="19" r="1.5" fill="white" />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500">
        CodeViz
      </span>
    </div>
  );
};
