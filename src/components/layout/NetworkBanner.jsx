import React from 'react';
import { WifiOff, AlertTriangle, ShieldCheck, Gauge } from 'lucide-react';

export const NetworkBanner = ({ networkStatus }) => {
  if (!networkStatus) return null;
  const { isOnline, isSlowConnection, simulatedSlow, toggleSimulateSlow, effectiveType, rtt } = networkStatus;

  if (!isSlowConnection && !simulatedSlow && isOnline) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/90 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2 text-xs text-amber-800 dark:text-amber-200 backdrop-blur-md animate-fadeIn transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          {!isOnline ? (
            <div className="p-1 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 shrink-0">
              <WifiOff className="w-4 h-4 animate-pulse" />
            </div>
          ) : (
            <div className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
              <Gauge className="w-4 h-4 animate-spin" />
            </div>
          )}

          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              {!isOnline
                ? 'System Offline Detected'
                : `Slow Connection Detected (${effectiveType.toUpperCase()} • ${rtt}ms latency)`}
            </span>
            <span className="text-slate-600 dark:text-slate-300 ml-1.5 hidden md:inline">
              — PhishGuard AI is running in <strong>100% Local Heuristic Engine Mode</strong> with zero external server dependencies.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Engine Active</span>
          </span>

          <button
            onClick={toggleSimulateSlow}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              simulatedSlow
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {simulatedSlow ? 'Disable Slow 3G' : 'Test Slow Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
