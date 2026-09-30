import React, { useEffect, useState } from 'react';
import { AlertTriangle, Radio, Play, Pause, ExternalLink } from 'lucide-react';
import { INITIAL_THREAT_FEED } from '../../data/threatIntelFeed';

export const ThreatTicker = ({ onInspectTarget }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INITIAL_THREAT_FEED.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeThreat = INITIAL_THREAT_FEED[currentIndex] || INITIAL_THREAT_FEED[0];

  return (
    <div className="bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/5 px-4 py-1.5 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center space-x-2.5 overflow-hidden flex-1 mr-2">
        <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-[10px] border border-red-500/20 dark:border-red-500/30 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>LIVE INTEL</span>
        </span>

        <div className="flex items-center space-x-2 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Targeting:</span>
          <span className="font-semibold text-slate-900 dark:text-cyan-300">{activeThreat.targetBrand}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs md:max-w-md">
            {activeThreat.domainOrPayload}
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-rose-600 dark:text-rose-400 text-[11px] font-mono font-medium">
            {activeThreat.confidenceScore}% confidence
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0 text-slate-500 dark:text-slate-400 text-[11px]">
        {onInspectTarget && (
          <button
            onClick={() => onInspectTarget(activeThreat.domainOrPayload)}
            className="hidden md:flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-sky-600 dark:text-cyan-400 font-medium transition-colors cursor-pointer"
            title="Scan this domain in Omni-Scanner"
          >
            <span>Scan Threat</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        )}

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          title={isPaused ? 'Resume Feed' : 'Pause Feed'}
          aria-label={isPaused ? 'Resume Feed' : 'Pause Feed'}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>

        <span className="hidden lg:flex items-center space-x-1">
          <Radio className="w-3 h-3 text-sky-500 dark:text-cyan-400 animate-pulse" />
          <span>Feed Active</span>
        </span>
      </div>
    </div>
  );
};
