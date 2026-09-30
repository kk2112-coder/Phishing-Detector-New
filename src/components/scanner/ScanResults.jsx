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
  Copy,
  Check,
  Globe,
  Mail,
  Smartphone,
  QrCode,
  Code,
  Terminal,
  Shield,
  AlertOctagon
} from 'lucide-react';
import { exportScanResultAsJson, printIncidentReport } from '../../utils/reportGenerator';

function CategoryIcon({ category, className }) {
  if (category === 'email') return <Mail className={className} />;
  if (category === 'sms') return <Smartphone className={className} />;
  if (category === 'qr') return <QrCode className={className} />;
  if (category === 'html') return <Code className={className} />;
  return <Globe className={className} />;
}

function VerdictIcon({ level, className }) {
  if (level === 'malicious') return <ShieldAlert className={className} />;
  if (level === 'suspicious') return <AlertTriangle className={className} />;
  return <ShieldCheck className={className} />;
}

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

  const getVerdictDetails = () => {
    if (result.threatLevel === 'malicious') {
      return {
        bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        title: 'Dangerous — Phishing Threat Detected',
        desc: result.summary || 'This content appears to be a fraudulent phishing attempt designed to steal credentials or personal information.',
        color: 'text-red-600 dark:text-red-400',
        label: 'Dangerous',
      };
    }
    if (result.threatLevel === 'suspicious') {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        title: 'Caution — Suspicious Content',
        desc: result.summary || 'Multiple security concerns were found. Do not enter passwords, payment details, or personal information.',
        color: 'text-amber-600 dark:text-amber-400',
        label: 'Suspicious',
      };
    }
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      title: 'Safe — No Phishing Indicators Found',
      desc: result.summary || 'Standard safety checks passed. The link or content does not exhibit known phishing patterns.',
      color: 'text-emerald-600 dark:text-emerald-400',
      label: 'Safe',
    };
  };

  const verdict = getVerdictDetails();

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner / Verdict Card */}
      <div className={`p-6 rounded-2xl border ${verdict.bg} transition-colors duration-200`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0 ${verdict.color}`}>
              <VerdictIcon level={result.threatLevel} className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${verdict.badge}`}>
                  {verdict.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {result.category?.toUpperCase()} • {result.timestamp}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {verdict.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {verdict.desc}
              </p>
            </div>
          </div>

          {/* Risk Score Pill */}
          <div className="flex items-center space-x-3 shrink-0 self-start md:self-center pl-16 md:pl-0">
            <div className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                Risk Score
              </span>
              <span className={`text-2xl font-black font-mono ${verdict.color}`}>
                {result.riskScore}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Target Path Display */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 font-mono text-slate-700 dark:text-slate-300 truncate">
            <CategoryIcon category={result.category} className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate max-w-xl font-medium">{result.target}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={copyToClipboard}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => exportScanResultAsJson(result)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>
            <button
              onClick={() => printIncidentReport(result)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>
            {onOpenAbuse && result.threatLevel === 'malicious' && (
              <button
                onClick={() => onOpenAbuse(result)}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer flex items-center space-x-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report Abuse</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Brand Impersonation Warning Banner (If Present) */}
      {result.brandImpersonation && (
        <div className="clean-card rounded-2xl p-5 border-l-4 border-l-red-500 space-y-3">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4" />
            <span>Targeted Brand Impersonation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Impersonated Brand</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm">
                {result.brandImpersonation.brandName}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Legitimate Official Website</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium text-xs break-all">
                {result.brandImpersonation.canonicalDomain}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Technique</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {result.brandImpersonation.matchType} ({result.brandImpersonation.similarityScore}% match)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Recommended Actions & Detected Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recommended Actions */}
        <div className="lg:col-span-6 clean-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Recommended Actions</span>
          </div>

          <ul className="space-y-3">
            {result.recommendations && result.recommendations.length > 0 ? (
              result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-500">No specific action required. Maintain standard awareness.</li>
            )}
          </ul>
        </div>

        {/* Right: Security Red Flags */}
        <div className="lg:col-span-6 clean-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Security Indicators ({result.indicators?.length || 0})</span>
            </div>
            <span className="text-xs font-normal text-slate-500">
              {result.indicators?.length ? 'Issues identified' : 'Clean'}
            </span>
          </div>

          {!result.indicators || result.indicators.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400">
              No suspicious patterns or anomalies found during analysis.
            </div>
          ) : (
            <div className="space-y-2.5">
              {result.indicators.map((indicator) => {
                const isExpanded = expandedIndicators[indicator.id] || false;
                const isDanger = indicator.severity === 'danger';
                const isWarning = indicator.severity === 'warning';

                return (
                  <div
                    key={indicator.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleIndicator(indicator.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isDanger
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                            : isWarning
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        }`}>
                          {indicator.severity?.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                          {indicator.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                        <p>{indicator.description}</p>
                        {indicator.evidence && (
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                            <span className="text-slate-400 font-sans text-[10px] block uppercase font-bold">Evidence:</span>
                            {indicator.evidence}
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
      </div>

      {/* Advanced Technical Details Collapsible */}
      <div className="clean-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>Technical Details & Metadata</span>
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-normal">
            {showTechnicalDetails ? 'Hide' : 'Show details'}
          </span>
        </button>

        {showTechnicalDetails && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            {result.meta && (
              <div className="space-y-1.5 font-mono">
                {Object.entries(result.meta).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                    <span className="text-slate-500">{key}:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-md">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
