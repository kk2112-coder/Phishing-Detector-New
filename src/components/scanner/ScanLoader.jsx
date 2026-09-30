import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const STEPS = [
  'Parsing target and checking structure...',
  'Checking for brand spoofing and lookalike characters...',
  'Evaluating domain reputation and security indicators...',
  'Preparing safety verdict and recommendations...',
];

export const ScanLoader = ({ target, isSlowConnection }) => {
  const [progress, setProgress] = useState(20);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = isSlowConnection ? 260 : 150;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const next = prev + Math.floor(Math.random() * 14 + 10);
        return Math.min(next, 95);
      });
    }, stepInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, stepInterval * 1.4);

    return () => {
      clearInterval(interval);
      clearInterval(stepTimer);
    };
  }, [isSlowConnection]);

  return (
    <div className="clean-card rounded-2xl p-6 sm:p-8 space-y-5 animate-fadeIn">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Analyzing for phishing threats...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
            {target || 'Target content'}
          </p>
        </div>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
          {progress}%
        </span>
      </div>

      {/* Clean Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>{STEPS[currentStep]}</span>
        {isSlowConnection && (
          <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Analyzing locally</span>
          </span>
        )}
      </div>
    </div>
  );
};
