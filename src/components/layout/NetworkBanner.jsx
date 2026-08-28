import React from 'react';
import { WifiOff, AlertTriangle, ShieldCheck, Gauge, Zap } from 'lucide-react';

export const NetworkBanner = ({ networkStatus }) => {
  const { isOnline, isSlowConnection, simulatedSlow, toggleSimulateSlow, effectiveType, rtt } = networkStatus;

  if (!isSlowConnection && !simulatedSlow && isOnline) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-slate-950 to-amber-950/90 border-b border-amber-800/60 px-4 py-2 text-xs text-amber-200 backdrop-blur-md animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          {!isOnline ? (
            <div className="p-1 rounded bg-red-950 text-red-400 border border-red-800 shrink-0">
              <WifiOff className="w-4 h-4 animate-pulse" />
            </div>
          ) : (
            <div className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-800 shrink-0">
              <Gauge className="w-4 h-4 animate-spin" />
            </div>
          )}

          <div>
            <span className="font-bold text-white">
              {!isOnline
                ? 'System Offline Detected'
                : `Slow Internet Connection Detected (${effectiveType.toUpperCase()} • ${rtt}ms latency)`}
            </span>
            <span className="text-slate-300 ml-1.5 hidden md:inline">
              — PhishGuard AI is running in <strong>100% Local Heuristic Engine Mode</strong> with zero external server dependencies.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Engine: Active</span>
          </span>

          <button
            onClick={toggleSimulateSlow}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              simulatedSlow
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {simulatedSlow ? 'Disable Slow 3G Mode' : 'Test Slow Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
