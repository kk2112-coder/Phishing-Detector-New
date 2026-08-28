import React, { useState } from 'react';
import { ThreatGauge } from './ThreatGauge';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  Layers,
  Bug,
  Copy,
  Check,
  Globe,
  Mail,
  Smartphone,
  QrCode,
  Code
} from 'lucide-react';
import { exportScanResultAsJson, printIncidentReport } from '../../utils/reportGenerator';

export const ScanResults = ({
  result,
  onOpenAbuse,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedIndicators, setExpandedIndicators] = useState({});

  if (!result) return null;

  const toggleIndicator = (id) => {
    setExpandedIndicators(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = () => {
    switch (result.category) {
      case 'url': return Globe;
      case 'email': return Mail;
      case 'sms': return Smartphone;
      case 'qr': return QrCode;
      case 'html': return Code;
      default: return Globe;
    }
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="space-y-6 mt-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-cyan-900/40 rounded-xl p-4 sm:p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 shrink-0">
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                {result.category} Inspection
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {result.timestamp}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {result.id}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono mt-1 break-all">
              {result.target}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => exportScanResultAsJson(result)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => printIncidentReport(result)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {onOpenAbuse && result.threatLevel === 'malicious' && (
            <button
              onClick={() => onOpenAbuse(result)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/60 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Generate Abuse Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Gauge & Brand Spoof */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
            <ThreatGauge score={result.riskScore} threatLevel={result.threatLevel} size={190} />

            <div className="mt-6 w-full pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-left text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Red Flags</span>
                <span className="text-base font-bold font-mono text-cyan-300">{result.indicators?.length || 0} detected</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">MITRE Tactics</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {result.mitreTechniques?.length || 0} mapped
                </span>
              </div>
            </div>
          </div>

          {result.brandImpersonation && (
            <div className="bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Targeted Brand Impersonation</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Spoofed Brand:</span>
                  <span className="font-bold text-white">{result.brandImpersonation.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Official Domain:</span>
                  <span className="font-mono text-emerald-400 font-medium">{result.brandImpersonation.canonicalDomain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spoof Vector:</span>
                  <span className="font-mono uppercase text-amber-300 text-[11px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                    {result.brandImpersonation.matchType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Similarity Index:</span>
                  <span className="font-mono text-red-400 font-bold">{result.brandImpersonation.similarityScore}%</span>
                </div>
              </div>
            </div>
          )}

          {result.securityHeaders && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Authentication Status</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2 rounded-lg border ${
                  result.securityHeaders.spfStatus === 'pass'
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                    : result.securityHeaders.spfStatus === 'fail'
                    ? 'bg-red-950/50 border-red-800/50 text-red-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <span className="text-[10px] uppercase font-bold block">SPF</span>
                  <span className="font-mono font-bold uppercase">{result.securityHeaders.spfStatus}</span>
                </div>
                <div className={`p-2 rounded-lg border ${
                  result.securityHeaders.dkimStatus === 'pass'
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                    : result.securityHeaders.dkimStatus === 'fail'
                    ? 'bg-red-950/50 border-red-800/50 text-red-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <span className="text-[10px] uppercase font-bold block">DKIM</span>
                  <span className="font-mono font-bold uppercase">{result.securityHeaders.dkimStatus}</span>
                </div>
                <div className={`p-2 rounded-lg border ${
                  result.securityHeaders.dmarcStatus === 'pass'
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                    : result.securityHeaders.dmarcStatus === 'fail'
                    ? 'bg-red-950/50 border-red-800/50 text-red-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <span className="text-[10px] uppercase font-bold block">DMARC</span>
                  <span className="font-mono font-bold uppercase">{result.securityHeaders.dmarcStatus}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Heuristic Engine Verdict
            </h4>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {result.summary}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <Bug className="w-4 h-4 text-cyan-400" />
                <span>Detected Red Flags & Heuristics ({result.indicators?.length || 0})</span>
              </h4>
              <span className="text-xs text-slate-400">
                Sorted by threat severity
              </span>
            </div>

            {(!result.indicators || result.indicators.length === 0) ? (
              <div className="p-6 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-slate-400 text-sm flex flex-col items-center justify-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <span>No suspicious indicators detected during deep heuristic analysis.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.indicators.map((indicator) => {
                  const isExpanded = expandedIndicators[indicator.id] || false;
                  return (
                    <div
                      key={indicator.id}
                      className={`rounded-lg border transition-all ${
                        indicator.severity === 'danger'
                          ? 'bg-red-950/20 border-red-900/50 hover:border-red-700/60'
                          : indicator.severity === 'warning'
                          ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-700/60'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div
                        onClick={() => toggleIndicator(indicator.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider font-mono ${
                            indicator.severity === 'danger'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : indicator.severity === 'warning'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-sky-950 text-sky-400 border border-sky-800'
                          }`}>
                            {indicator.severity}
                          </span>
                          <span className="font-semibold text-slate-200 text-sm">
                            {indicator.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono text-red-400 font-bold hidden sm:inline">
                            +{indicator.scoreImpact} pts
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 space-y-2 border-t border-slate-800/60 mt-1">
                          <p className="leading-relaxed">{indicator.description}</p>
                          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
                            <span className="text-slate-500 select-none block mb-0.5">EVIDENCE ARTIFACT:</span>
                            {indicator.evidence}
                          </div>
                          {indicator.mitreTechniqueId && (
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                              <span>MITRE ATT&CK:</span>
                              <span className="font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                                {indicator.mitreTechniqueId}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {result.mitreTechniques && result.mitreTechniques.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mapped MITRE ATT&CK Techniques</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.mitreTechniques.map((tech) => (
                  <div key={tech.id} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-cyan-400">{tech.id}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Tactic</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">{tech.name}</p>
                    <p className="text-[11px] text-slate-400 leading-snug">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Security Actions</span>
            </h4>
            <ul className="space-y-2">
              {result.recommendations?.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
