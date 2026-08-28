import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Skull } from 'lucide-react';

export const ThreatGauge = ({
  score = 0,
  threatLevel = 'safe',
  size = 180,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981';
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let bgFill = 'from-emerald-950/20 to-emerald-900/10';
  let badgeBorder = 'border-emerald-500/40 text-emerald-400 bg-emerald-950/50';
  let Icon = ShieldCheck;

  if (threatLevel === 'malicious') {
    strokeColor = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.5)';
    bgFill = 'from-red-950/40 to-red-900/10';
    badgeBorder = 'border-red-500/50 text-red-400 bg-red-950/60 animate-pulse';
    Icon = Skull;
  } else if (threatLevel === 'suspicious') {
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    bgFill = 'from-amber-950/30 to-amber-900/10';
    badgeBorder = 'border-amber-500/40 text-amber-400 bg-amber-950/50';
    Icon = AlertTriangle;
  } else if (threatLevel === 'low') {
    strokeColor = '#38bdf8';
    glowColor = 'rgba(56, 189, 248, 0.4)';
    bgFill = 'from-sky-950/30 to-sky-900/10';
    badgeBorder = 'border-sky-500/40 text-sky-400 bg-sky-950/50';
    Icon = ShieldAlert;
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-b ${bgFill} p-2`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
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
              transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon className="w-6 h-6 mb-1" style={{ color: strokeColor }} />
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-black tracking-tight font-mono text-white">
              {score}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-0.5">/100</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Risk Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border flex items-center space-x-1.5 ${badgeBorder}`}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }}></span>
        <span>{threatLevel.toUpperCase()} THREAT</span>
      </div>
    </div>
  );
};
