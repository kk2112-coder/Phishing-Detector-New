import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Skull } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThreatGauge = ({
  score = 0,
  threatLevel = 'safe',
  size = 180,
}) => {
  const { isDark } = useTheme();
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // emerald
  let badgeClasses = 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50';
  let Icon = ShieldCheck;
  let levelLabel = 'SAFE';

  if (threatLevel === 'malicious') {
    strokeColor = '#ef4444'; // red
    badgeClasses = 'border-red-500/40 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60';
    Icon = Skull;
    levelLabel = 'MALICIOUS';
  } else if (threatLevel === 'suspicious') {
    strokeColor = '#f59e0b'; // amber
    badgeClasses = 'border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50';
    Icon = AlertTriangle;
    levelLabel = 'SUSPICIOUS';
  } else if (threatLevel === 'low') {
    strokeColor = '#0284c7'; // sky
    badgeClasses = 'border-sky-500/40 text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50';
    Icon = ShieldAlert;
    levelLabel = 'LOW RISK';
  }

  const trackColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        className="relative flex items-center justify-center rounded-full p-2"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out, stroke 0.4s ease',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon className="w-6 h-6 mb-1" style={{ color: strokeColor }} />
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-black tracking-tight font-mono text-slate-900 dark:text-white">
              {score}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-0.5">/100</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">
            Risk Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border flex items-center space-x-1.5 ${badgeClasses}`}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }}></span>
        <span>{levelLabel} THREAT</span>
      </div>
    </div>
  );
};
