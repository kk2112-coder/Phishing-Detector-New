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
  Code,
  Terminal,
  ExternalLink,
  Info
} from 'lucide-react';
import { exportScanResultAsJson, printIncidentReport } from '../../utils/reportGenerator';

export const ScanResults = ({
  result,
  onOpenAbuse,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
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

  const getVerdictStyle = () => {
    if (result.threatLevel === 'malicious') {
      return {
        cardBg: 'bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-500/30',
        badge: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30',
        title: 'High-Risk Phishing Threat Detected',
        desc: 'This target exhibits verified patterns of brand impersonation, credential harvesting, or deceptive social engineering.',
        icon: ShieldAlert,
        color: 'text-red-600 dark:text-red-400'
      };
    }
    if (result.threatLevel === 'suspicious') {
      return {
        cardBg: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30',
        badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
        title: 'Suspicious / Untrusted Content',
        desc: 'Multiple red flags were identified. We recommend caution and avoiding entering sensitive credentials or payment information.',
        icon: AlertTriangle,
        color: 'text-amber-600 dark:text-amber-400'
      };
    }
    return {
      cardBg: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30',
      badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
      title: 'No Malicious Indicators Detected',
      desc: 'Standard security heuristics passed. Maintain routine online vigilance and verify unexpected requests directly.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400'
    };
  };

  const verdict = getVerdictStyle();
  const VerdictIcon = verdict.icon;

  return (
    <div className="space-y-6 mt-6 animate-fadeIn">
      {/* Top Header & Actions Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5 overflow-hidden">
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400 shrink-0">
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 border border-slate-200 dark:border-white/10 font-bold">
                {result.category} Vector
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {result.timestamp}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono mt-1 truncate">
              {result.target}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => exportScanResultAsJson(result)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-card hover:text-sky-600 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => printIncidentReport(result)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-card hover:text-sky-600 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-card hover:text-sky-600 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {onOpenAbuse && result.threatLevel === 'malicious' && (
            <button
              onClick={() => onOpenAbuse(result)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Draft Abuse Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Plain-English Verdict Card */}
      <div className={`rounded-2xl p-6 border ${verdict.cardBg} transition-colors duration-200`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-2xl border ${verdict.badge} shrink-0 mt-0.5`}>
              <VerdictIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${verdict.badge}`}>
                Verdict: {result.threatLevel}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {verdict.title}
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                {result.summary || verdict.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:self-center shrink-0 pl-14 sm:pl-0">
            <div className="text-center px-4 py-2.5 rounded-xl glass-card">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Risk Score
              </span>
              <span className={`text-2xl font-black font-mono ${verdict.color}`}>
                {result.riskScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Gauge & Spoofing Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <ThreatGauge score={result.riskScore} threatLevel={result.threatLevel} size={180} />

            <div className="mt-5 w-full pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-3 text-left text-xs">
              <div className="glass-card p-3 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Red Flags</span>
                <span className="text-base font-bold font-mono text-sky-600 dark:text-cyan-300">
                  {result.indicators?.length || 0} found
                </span>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">MITRE Tactics</span>
                <span className="text-base font-bold font-mono text-sky-600 dark:text-cyan-300">
                  {result.mitreTechniques?.length || 0} mapped
                </span>
              </div>
            </div>
          </div>

          {/* Spoofed Brand Details */}
          {result.brandImpersonation && (
            <div className="rounded-2xl p-5 space-y-3 border border-red-200 dark:border-red-500/30 bg-red-50/70 dark:bg-red-950/20">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Targeted Brand Impersonation</span>
              </div>
              <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Targeted Brand:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{result.brandImpersonation.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Authentic Domain:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{result.brandImpersonation.canonicalDomain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Spoof Vector:</span>
                  <span className="font-mono uppercase text-amber-700 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 font-bold">
                    {result.brandImpersonation.matchType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Similarity Match:</span>
                  <span className="font-mono text-red-600 dark:text-red-400 font-bold">{result.brandImpersonation.similarityScore}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Email Security Headers (if email) */}
          {result.securityHeaders && (
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>Email Authentication Status</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {['spfStatus', 'dkimStatus', 'dmarcStatus'].map((key) => {
                  const label = key.replace('Status', '').toUpperCase();
                  const val = result.securityHeaders[key];
                  const isPass = val === 'pass';
                  const isFail = val === 'fail';
                  return (
                    <div
                      key={key}
                      className={`p-2.5 rounded-xl border ${
                        isPass
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : isFail
                          ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
                          : 'glass-card text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block">{label}</span>
                      <span className="font-mono font-bold uppercase text-xs">{val || 'N/A'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Clear Recommendations & Red Flags */}
        <div className="lg:col-span-8 space-y-6">
          {/* Actionable Next Steps */}
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Recommended Next Actions</span>
            </h4>
            <ul className="space-y-2.5">
              {result.recommendations?.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400 mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags List */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center space-x-2">
                <Bug className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <span>Detected Security Anomalies ({result.indicators?.length || 0})</span>
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sorted by severity impact
              </span>
            </div>

            {(!result.indicators || result.indicators.length === 0) ? (
              <div className="p-8 rounded-xl glass-card text-center text-slate-600 dark:text-slate-300 text-xs flex flex-col items-center justify-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                <span>No suspicious heuristic red flags detected during evaluation.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.indicators.map((indicator) => {
                  const isExpanded = expandedIndicators[indicator.id] || false;
                  return (
                    <div
                      key={indicator.id}
                      className={`rounded-xl border transition-all ${
                        indicator.severity === 'danger'
                          ? 'bg-red-50/70 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                          : indicator.severity === 'warning'
                          ? 'bg-amber-50/70 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                          : 'glass-card'
                      }`}
                    >
                      <div
                        onClick={() => toggleIndicator(indicator.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                            indicator.severity === 'danger'
                              ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                              : indicator.severity === 'warning'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                              : 'bg-sky-100 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-400 border border-sky-200 dark:border-cyan-500/30'
                          }`}>
                            {indicator.severity}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-slate-200 text-xs sm:text-sm">
                            {indicator.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono text-red-600 dark:text-red-400 font-bold hidden sm:inline">
                            +{indicator.scoreImpact} pts
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-700 dark:text-slate-300 space-y-2 border-t border-slate-200 dark:border-white/5 mt-1">
                          <p className="leading-relaxed">{indicator.description}</p>
                          <div className="bg-slate-100 dark:bg-slate-950/80 p-2.5 rounded-lg border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-800 dark:text-cyan-300 break-all">
                            <span className="text-slate-500 block mb-0.5 font-sans font-bold text-[10px]">EVIDENCE ARTIFACT:</span>
                            {indicator.evidence}
                          </div>
                          {indicator.mitreTechniqueId && (
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center space-x-2 pt-1">
                              <span>MITRE ATT&CK:</span>
                              <span className="font-mono text-sky-700 dark:text-cyan-400 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10 font-semibold">
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

          {/* Toggleable Advanced Forensics Drawer */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <span>Advanced Security Forensics & MITRE ATT&CK Mappings</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-sky-600 dark:text-cyan-400 font-semibold">
                  {showTechnicalDetails ? 'Collapse' : 'Expand Details'}
                </span>
                {showTechnicalDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                )}
              </div>
            </button>

            {showTechnicalDetails && (
              <div className="p-6 border-t border-slate-200 dark:border-white/10 space-y-5 animate-fadeIn">
                {/* MITRE Mapping */}
                {result.mitreTechniques && result.mitreTechniques.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                      <span>Mapped MITRE ATT&CK Tactics</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.mitreTechniques.map((tech) => (
                        <div key={tech.id} className="glass-card p-3 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-sky-600 dark:text-cyan-300">{tech.id}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Tactic</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">{tech.name}</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{tech.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {result.meta && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Target Metadata</h5>
                    <div className="bg-slate-100 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-800 dark:text-slate-300 space-y-1">
                      {Object.entries(result.meta).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-500">{k}:</span>
                          <span className="text-sky-700 dark:text-cyan-300 truncate max-w-xs">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
