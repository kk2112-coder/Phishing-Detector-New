import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, Radio } from 'lucide-react';
import { INITIAL_THREAT_FEED } from '../../data/threatIntelFeed';

export const ThreatTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INITIAL_THREAT_FEED.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeThreat = INITIAL_THREAT_FEED[currentIndex];

  return (
    <div className="bg-slate-950/80 border-b border-cyan-950/60 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between backdrop-blur-md">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-red-950/80 text-red-400 font-semibold uppercase tracking-wider text-[10px] border border-red-800/40 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>LIVE THREAT RADAR</span>
        </span>

        <div className="flex items-center space-x-2 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-400">Targeting:</span>
          <span className="font-semibold text-cyan-300">{activeThreat.targetBrand}</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-300 truncate max-w-xs md:max-w-md">{activeThreat.domainOrPayload}</span>
          <span className="text-slate-500">•</span>
          <span className="text-red-400 text-[11px] font-mono">{activeThreat.confidenceScore}% confidence</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center space-x-4 shrink-0 text-slate-400 text-[11px]">
        <span className="flex items-center space-x-1">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Global Feed Synced</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-cyan-400">Active Defenses: 100%</span>
      </div>
    </div>
  );
};
