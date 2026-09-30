import React, { useState, useEffect } from 'react';
import { Globe, Mail, Smartphone, QrCode, Code, Sparkles, Search, Shield, ArrowRight, X } from 'lucide-react';
import { UrlScanner } from './UrlScanner';
import { EmailScanner } from './EmailScanner';
import { SmsScanner } from './SmsScanner';
import { QrScanner } from './QrScanner';
import { HtmlScanner } from './HtmlScanner';
import { analyzeUrl } from '../../services/urlAnalyzer';
import { analyzeEmail } from '../../services/emailAnalyzer';
import { analyzeSms } from '../../services/smsAnalyzer';
import { analyzeHtml } from '../../services/htmlAnalyzer';
import { ScanResults } from './ScanResults';
import { ScanLoader } from './ScanLoader';
import { playScanSweep, playSafePing, playWarningBlip, playDangerAlert } from '../../utils/audioEffects';

export const ScannerHub = ({
  onScanComplete,
  onOpenAbuse,
  initialTarget,
  initialResult,
  isSlowConnection
}) => {
  const [activeVector, setActiveVector] = useState('url');
  const [omniInput, setOmniInput] = useState('');
  const [omniScanning, setOmniScanning] = useState(false);
  const [omniResult, setOmniResult] = useState(null);

  // If initialResult provided from History, display it
  useEffect(() => {
    if (initialResult) {
      setOmniResult(initialResult);
      if (initialResult.category) {
        setActiveVector(initialResult.category);
      }
    }
  }, [initialResult]);

  // If initialTarget provided from Radar or Lookalike, auto scan it
  useEffect(() => {
    if (initialTarget) {
      setOmniInput(initialTarget);
      handleOmniScan(initialTarget);
    }
  }, [initialTarget]);

  // Auto-detect vector type from generic string
  const detectVector = (text) => {
    const trimmed = text.trim();
    if (trimmed.startsWith('<') && (trimmed.includes('<form') || trimmed.includes('<script') || trimmed.includes('<html') || trimmed.includes('<!doctype'))) {
      return 'html';
    }
    if (trimmed.includes('From:') || trimmed.includes('Subject:') || trimmed.includes('Reply-To:') || trimmed.includes('dkim=') || trimmed.includes('spf=')) {
      return 'email';
    }
    if (/^(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(trimmed) || (trimmed.length < 240 && (trimmed.toLowerCase().includes('toll') || trimmed.toLowerCase().includes('usps') || trimmed.toLowerCase().includes('parcel') || trimmed.toLowerCase().includes('code:')))) {
      return 'sms';
    }
    return 'url';
  };

  const handleOmniScan = (customInput) => {
    const text = (customInput !== undefined ? customInput : omniInput).trim();
    if (!text) return;

    setOmniScanning(true);
    setOmniResult(null);
    playScanSweep();

    const vector = detectVector(text);
    setActiveVector(vector);

    setTimeout(() => {
      let result;
      if (vector === 'email') {
        result = analyzeEmail(text);
      } else if (vector === 'sms') {
        result = analyzeSms(text, '');
      } else if (vector === 'html') {
        result = analyzeHtml(text);
      } else {
        result = analyzeUrl(text);
      }

      setOmniResult(result);
      setOmniScanning(false);

      if (result.threatLevel === 'malicious') playDangerAlert();
      else if (result.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(result);
    }, 700);
  };

  const vectors = [
    { id: 'url', label: 'URL & Domain', icon: Globe, desc: 'Links, Typosquatting, TLDs' },
    { id: 'email', label: 'Email & Headers', icon: Mail, desc: 'Spoofing, SPF, DKIM' },
    { id: 'sms', label: 'SMS & Smishing', icon: Smartphone, desc: 'Urgent Text Scams' },
    { id: 'qr', label: 'QR Quishing', icon: QrCode, desc: 'Malicious QR Codes' },
    { id: 'html', label: 'HTML DOM Code', icon: Code, desc: 'Fake Login Forms' },
  ];

  return (
    <div className="space-y-8">
      {/* Universal Smart Omni-Scanner Bar */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs text-sky-600 dark:text-cyan-400 font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Universal Auto-Detect Threat Scanner</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Instant Threat & Phishing Inspection
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-6">
          Paste any suspicious link, domain, email text, SMS message, or login code. PhishGuard automatically classifies the vector and runs multi-layered heuristic analysis.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOmniScan();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={omniInput}
              onChange={(e) => setOmniInput(e.target.value)}
              placeholder="Paste any link, domain, SMS text, or email (e.g. paypa1-login.xyz/verify)"
              className="glass-input w-full pl-10 pr-10 py-3 rounded-xl text-sm font-mono outline-none"
            />
            {omniInput && (
              <button
                type="button"
                onClick={() => setOmniInput('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={omniScanning || !omniInput.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0"
          >
            <Shield className="w-4 h-4" />
            <span>{omniScanning ? 'Evaluating...' : 'Smart Scan'}</span>
          </button>
        </form>

        {/* Quick Demo Benchmark Chips */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quick benchmarks:</span>
          {[
            { label: 'PayPal Typosquat', text: 'http://paypa1-security-center.xyz/login' },
            { label: 'Microsoft 365 Spoof', text: 'https://login.microsoftonline.com-auth.top/login' },
            { label: 'USPS Smishing SMS', text: '[USPS Tracking]: Parcel held due to missing street address. Confirm at: https://usps-redelivery.top/pay' },
            { label: 'Legitimate Google', text: 'https://google.com' }
          ].map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setOmniInput(sample.text);
                handleOmniScan(sample.text);
              }}
              className="px-2.5 py-1 rounded-lg glass-card text-xs text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 font-medium transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>{sample.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Results from Omni-Scan or Deep Link */}
      {omniScanning && (
        <ScanLoader target={omniInput} isSlowConnection={isSlowConnection} />
      )}

      {omniResult && !omniScanning && (
        <ScanResults
          result={omniResult}
          onOpenAbuse={onOpenAbuse}
        />
      )}

      {/* Dedicated Vector Toolkits Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Dedicated Vector Deep-Dive Toolkits
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Select a vector for file uploads, camera QR scanning, or raw header inspection
          </span>
        </div>

        {/* Vector Selection Cards / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 p-1.5 bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5">
          {vectors.map((vector) => {
            const Icon = vector.icon;
            const isActive = activeVector === vector.id;
            return (
              <button
                key={vector.id}
                onClick={() => {
                  setActiveVector(vector.id);
                  setOmniResult(null);
                }}
                className={`flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-2.5 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-normal transition-all cursor-pointer text-center sm:text-left ${
                  isActive
                    ? 'bg-white dark:bg-sky-500/20 text-sky-700 dark:text-cyan-300 border border-slate-200/80 dark:border-cyan-400/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600 dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'}`} />
                <div className="truncate">
                  <span className="block truncate font-bold">{vector.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden lg:block truncate">{vector.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Vector Specific Toolkit Component */}
        <div className="pt-2 animate-fadeIn">
          {activeVector === 'url' && (
            <UrlScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} isSlowConnection={isSlowConnection} />
          )}
          {activeVector === 'email' && (
            <EmailScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} isSlowConnection={isSlowConnection} />
          )}
          {activeVector === 'sms' && (
            <SmsScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} isSlowConnection={isSlowConnection} />
          )}
          {activeVector === 'qr' && (
            <QrScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
          )}
          {activeVector === 'html' && (
            <HtmlScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
          )}
        </div>
      </div>
    </div>
  );
};
