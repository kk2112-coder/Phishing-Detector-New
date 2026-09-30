import React, { useState, useEffect } from 'react';
import { RefreshCw, Shield, Cpu, Activity, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ScanLoader = ({ target, isSlowConnection }) => {
  const [progress, setProgress] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Initializing Heuristic Engine & Format Parser...', weight: 25 },
    { label: 'Levenshtein & Unicode Homoglyph Matrix Check...', weight: 55 },
    { label: 'Analyzing Path Entropy, TLD Reputation, & Brand Cloaking...', weight: 85 },
    { label: 'Synthesizing MITRE ATT&CK Mapping & Risk Gauge...', weight: 100 },
  ];

  useEffect(() => {
    const stepInterval = isSlowConnection ? 280 : 160;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        const next = prev + Math.floor(Math.random() * 12 + 8);
        return Math.min(next, 98);
      });
    }, stepInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepInterval * 1.5);

    return () => {
      clearInterval(interval);
      clearInterval(stepTimer);
    };
  }, [isSlowConnection]);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden animate-fadeIn border border-sky-300 dark:border-sky-500/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-cyan-500/50 text-sky-600 dark:text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Threat Matrix Evaluation in Progress
              </h3>
              <span className="text-[10px] font-mono uppercase font-extrabold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 border border-sky-200 dark:border-cyan-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-mono text-sky-700 dark:text-cyan-300 truncate max-w-md mt-0.5 font-medium">
              Target: {target || 'Payload Inspection'}
            </p>
          </div>
        </div>

        {/* Slow network indicator banner */}
        {isSlowConnection && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Slow Connection • Running 100% Locally</span>
          </div>
        )}
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 animate-spin" />
            <span>{steps[currentStep]?.label}</span>
          </span>
          <span className="text-sky-600 dark:text-cyan-300 font-bold text-sm">{progress}%</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tactical Sub-routine Step Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-xs transition-all ${
                isDone
                  ? 'bg-emerald-50 dark:bg-slate-950/60 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                  : isCurrent
                  ? 'bg-sky-50 dark:bg-cyan-950/40 border-sky-300 dark:border-cyan-500/40 text-sky-800 dark:text-cyan-200 shadow-sm font-semibold'
                  : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <RefreshCw className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0 animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
              )}
              <span className="truncate font-mono text-[11px]">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
