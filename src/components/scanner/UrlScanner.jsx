import React, { useState } from 'react';
import { Globe, Search, RefreshCw, Sparkles, Shield, ArrowRight, X } from 'lucide-react';
import { analyzeUrl } from '../../services/urlAnalyzer';
import { ScanResults } from './ScanResults';
import { ScanLoader } from './ScanLoader';
import { playScanSweep, playSafePing, playWarningBlip, playDangerAlert } from '../../utils/audioEffects';

const SAMPLE_URLS = [
  { label: 'PayPal Typosquatting', url: 'http://paypa1-security-center.xyz/webscr?cmd=_login-run', desc: 'Levenshtein typo + .xyz TLD + phishing path' },
  { label: 'Microsoft 365 Spoof', url: 'https://login.microsoftonline.com-auth-verify.top/login', desc: 'Subdomain spoofing on high-risk .top TLD' },
  { label: 'MetaMask Seed Drainer', url: 'http://metamask-io-wallet-restore.site/sync', desc: 'Crypto wallet lure keyword combo' },
  { label: 'Raw IP Hostname', url: 'http://192.168.1.105:8080/secure/bank/login.php', desc: 'Unregistered IP server + non-standard port' },
  { label: 'Legitimate Google', url: 'https://google.com', desc: 'Official canonical search domain' },
];

export const UrlScanner = ({ onScanComplete, onOpenAbuse, isSlowConnection }) => {
  const [urlInput, setUrlInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const handleScan = (urlToAnalyze) => {
    const target = (urlToAnalyze !== undefined ? urlToAnalyze : urlInput).trim();
    if (!target) return;

    setScanning(true);
    setCurrentResult(null);
    playScanSweep();

    const scanDuration = isSlowConnection ? 1400 : 700;

    setTimeout(() => {
      const result = analyzeUrl(target);
      setCurrentResult(result);
      setScanning(false);

      if (result.threatLevel === 'malicious') playDangerAlert();
      else if (result.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(result);
    }, scanDuration);
  };

  const handleLoadSample = (sampleUrl) => {
    setUrlInput(sampleUrl);
    handleScan(sampleUrl);
  };

  const handleClear = () => {
    setUrlInput('');
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              URL & Domain Deep Inspection
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Heuristic typosquatting, IDN homoglyphs, TLD reputation, and path entropy scanner
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter suspicious URL or domain (e.g. paypa1-login.xyz/verify)"
              className="glass-input w-full pl-10 pr-10 py-3 rounded-xl text-sm font-mono outline-none"
            />
            {urlInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={scanning || !urlInput.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Deep Analyze</span>
                </>
              )}
            </button>

            {urlInput && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-3 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Load Quick Threat Benchmark Samples:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.url)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 text-xs transition-all text-left cursor-pointer"
                title={sample.desc}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                <span className="font-medium">{sample.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {scanning && (
        <ScanLoader target={urlInput} isSlowConnection={isSlowConnection} />
      )}

      {currentResult && !scanning && (
        <ScanResults
          result={currentResult}
          onOpenAbuse={onOpenAbuse}
        />
      )}
    </div>
  );
};
