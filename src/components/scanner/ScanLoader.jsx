import React, { useState, useEffect } from 'react';
import { RefreshCw, Shield, Cpu, Activity, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ScanLoader = ({ target, isSlowConnection }) => {
  const [progress, setProgress] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Initializing Neural Heuristic Engine & Domain Parser...', weight: 25 },
    { label: 'Deep Levenshtein & Unicode Homoglyph Matrix Check...', weight: 55 },
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
    <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fadeIn">
      <div className="scanline" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Deep Threat Matrix Scan in Progress
              </h3>
              <span className="text-[10px] font-mono uppercase font-extrabold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-300 truncate max-w-md mt-0.5">
              Target: {target || 'Payload Inspection'}
            </p>
          </div>
        </div>

        {/* Slow network indicator banner inside loader */}
        {isSlowConnection && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>Slow Connection • Running 100% Locally</span>
          </div>
        )}
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{steps[currentStep]?.label}</span>
          </span>
          <span className="text-cyan-300 font-bold text-sm">{progress}%</span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-cyan-950 shadow-inner">
          <div
            className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-md shadow-cyan-500/50"
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
                  ? 'bg-slate-950/60 border-emerald-900/40 text-emerald-400'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200 shadow-sm'
                  : 'bg-slate-950/30 border-slate-800 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate font-mono text-[11px]">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
