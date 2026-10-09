import React from 'react';

export const PhishGuardLogo = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="navShieldGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <filter id="navShieldShadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e3a8a" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Modern Outer Shield */}
    <path
      d="M24 3.5C32.8 7.5 40 8.5 41 9.5C41.8 17.5 40.5 30 24 43.5C7.5 30 6.2 17.5 7 9.5C8 8.5 15.2 7.5 24 3.5Z"
      fill="url(#navShieldGrad)"
      filter="url(#navShieldShadow)"
    />

    {/* Inner Translucent Bevel */}
    <path
      d="M24 7.5C30.8 10.8 36.4 11.6 37.2 12.4C37.8 18.8 36.7 28.5 24 39C11.3 28.5 10.2 18.8 10.8 12.4C11.6 11.6 17.2 10.8 24 7.5Z"
      fill="#1e40af"
      opacity="0.45"
    />

    {/* Crisp Security Checkmark */}
    <path
      d="M17.5 24.5L22 29L31 18.5"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Cyber Spark */}
    <circle cx="31" cy="18.5" r="2.2" fill="#38bdf8" />
  </svg>
);
