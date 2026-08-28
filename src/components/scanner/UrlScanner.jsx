import React, { useState } from 'react';
import { Globe, Search, RefreshCw, Sparkles, Shield, ArrowRight } from 'lucide-react';
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
      <div className="relative bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md overflow-hidden">
        {scanning && <div className="scanline" />}

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              URL & Domain Deep Inspection
            </h2>
            <p className="text-xs text-slate-400">
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
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter suspicious URL or domain (e.g. paypa1-login.xyz/verify)"
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-mono transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={scanning || !urlInput.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Heuristics...</span>
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
                className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Quick Threat Benchmark Samples:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.url)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 hover:border-cyan-800/60 transition-all text-left"
                title={sample.desc}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="font-medium text-slate-200">{sample.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
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
