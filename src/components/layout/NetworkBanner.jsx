import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';

export const NetworkBanner = ({ networkStatus }) => {
  if (!networkStatus) return null;
  const { isOnline, isSlowConnection, simulatedSlow, effectiveType } = networkStatus;

  if (!isSlowConnection && !simulatedSlow && isOnline) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span>
            {!isOnline
              ? 'You are currently offline. Scans are running entirely inside your browser.'
              : `Slow connection detected (${effectiveType || 'slow'}). PhishGuard runs locally in your browser.`}
          </span>
        </div>
      </div>
    </div>
  );
};
