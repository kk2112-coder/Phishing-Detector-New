import React, { useState } from 'react';
import { AlertTriangle, Eye } from 'lucide-react';

export const SafePreview = ({ url = 'http://paypa1-security-verify.xyz/login' }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            Isolated Threat Sandbox & Visualizer
          </h2>
          <p className="text-xs text-slate-400">
            Safely render and inspect deceptive landing page layouts without executing malicious payloads
          </p>
        </div>
      </div>

      <div className="border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl bg-slate-950">
        {/* Browser Top Nav */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 border border-red-900/40 text-xs font-mono">
            <div className="flex items-center space-x-2 text-red-400 truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{url}</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 shrink-0 ml-2">
              UNTRUSTED ORIGIN
            </span>
          </div>
        </div>

        {/* Sandboxed Page View */}
        <div className="p-8 sm:p-12 relative min-h-[420px] flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl p-8 shadow-2xl space-y-6 relative border border-slate-300">
            <div
              onMouseEnter={() => setActiveTooltip('logo')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative flex items-center justify-center p-2 border-2 border-dashed border-red-500 rounded-xl cursor-help bg-red-50"
            >
              <div className="text-2xl font-black text-blue-800 tracking-tight">
                Pay<span className="text-cyan-600">Pal</span>
              </div>
              <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                1
              </span>
            </div>

            <div
              onMouseEnter={() => setActiveTooltip('timer')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative p-2.5 rounded-lg bg-amber-100 border-2 border-dashed border-amber-500 text-center cursor-help"
            >
              <span className="text-xs font-bold text-amber-900">
                ⚠️ Account Locked! Verify within 04:59 to avoid termination.
              </span>
              <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                2
              </span>
            </div>

            <div
              onMouseEnter={() => setActiveTooltip('form')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative space-y-3 p-3 border-2 border-dashed border-red-500 rounded-xl cursor-help bg-red-50/50"
            >
              <input
                disabled
                type="text"
                placeholder="Email or mobile number"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700"
              />
              <input
                disabled
                type="password"
                placeholder="Password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700"
              />
              <button
                disabled
                className="w-full py-2.5 rounded-lg bg-blue-700 text-white font-bold text-xs shadow"
              >
                Log In & Verify Identity
              </button>
              <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Sandbox Annotation Legend */}
        <div className="bg-slate-900 p-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-lg border transition-all ${
            activeTooltip === 'logo' ? 'bg-red-950/80 border-red-500 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold text-white block mb-0.5">1. Cloned Trademark Assets</span>
            <span>Attackers scrape authentic SVG logos to establish immediate visual credibility.</span>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${
            activeTooltip === 'timer' ? 'bg-amber-950/80 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold text-white block mb-0.5">2. Artificial Urgency Clock</span>
            <span>Countdowns induce adrenaline and prevent the victim from checking the browser address bar.</span>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${
            activeTooltip === 'form' ? 'bg-red-950/80 border-red-500 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold text-white block mb-0.5">3. Unencrypted Form Action</span>
            <span>Input fields post password credentials directly to the attacker's harvesting webhook.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
