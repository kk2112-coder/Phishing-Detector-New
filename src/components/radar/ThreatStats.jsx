import React from 'react';
import { ATTACK_VECTOR_STATS, TOP_TARGETED_BRANDS, TOP_ABUSED_TLDS } from '../../data/threatIntelFeed';
import { TrendingUp, Globe2, Layers } from 'lucide-react';

export const ThreatStats = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Attack Vectors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Primary Phishing Vectors
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Q3 Global Census</span>
        </div>

        <div className="space-y-3">
          {ATTACK_VECTOR_STATS.map((vec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{vec.name}</span>
                <span className="font-mono text-cyan-300 font-bold">{vec.percentage}% <span className="text-slate-500 font-normal">({vec.count})</span></span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${vec.percentage}%`,
                    backgroundColor: vec.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Targeted Brands */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Impersonated Brands
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Real-Time Share</span>
        </div>

        <div className="space-y-2.5">
          {TOP_TARGETED_BRANDS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-slate-500 font-bold text-[11px] w-4">
                  0{idx + 1}
                </span>
                <span className="font-semibold text-slate-200">{item.brand}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-cyan-300">{item.share}%</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  item.trend.startsWith('+')
                    ? 'text-red-400 bg-red-950/50 border border-red-900/40'
                    : 'text-emerald-400 bg-emerald-950/50 border border-emerald-900/40'
                }`}>
                  {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Abused TLDs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Malicious TLDs
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Abuse Ratio</span>
        </div>

        <div className="space-y-2.5">
          {TOP_ABUSED_TLDS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {item.tld}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono text-red-400 font-bold">{item.abuseRate}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  item.riskLevel === 'Critical'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : item.riskLevel === 'High'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
