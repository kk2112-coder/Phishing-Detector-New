import React, { useState } from 'react';
import { Mail, RefreshCw, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { analyzeEmail } from '../../services/emailAnalyzer';
import { ScanResults } from './ScanResults';
import { ScanLoader } from './ScanLoader';
import { playScanSweep, playSafePing, playWarningBlip, playDangerAlert } from '../../utils/audioEffects';

const SAMPLE_EMAILS = [
  {
    label: 'Office 365 Password Suspension',
    desc: 'Display spoofing + urgency + malicious link',
    text: `From: "IT Support Desk" <admin@m365-security-update.xyz>
Reply-To: it-support@mail-proxy-auth.top
Subject: URGENT: Your Microsoft 365 Password Expires Today
Date: 28 Aug 2026

Dear User,

Your organization Microsoft 365 account password will expire in 2 hours.
Failure to renew immediately will result in complete account suspension.

Click here to keep your current credentials:
<a href="http://login-microsoft365-verify.com.auth-token.xyz/login">https://microsoft.com/login/renew</a>

Thank you,
IT Global Helpdesk`
  },
  {
    label: 'CEO Executive Wire Fraud (BEC)',
    desc: 'Urgent acquisition wire transfer request',
    text: `From: "Arthur Pendelton (CEO)" <ceo-office-direct@corporate-exec-desk.work>
Reply-To: arthur.pendelton99@gmail.com
Subject: Strictly Confidential - Urgent Wire Transfer
Date: 28 Aug 2026

Hi Finance Team,

I am in a closed-door acquisition meeting and need an immediate wire transfer of $148,000.00 processed before 4:00 PM today.
Please do not call my mobile as I cannot take calls right now.

Reply to this email directly and I will send the recipient routing numbers.

Arthur Pendelton
Chief Executive Officer`
  },
  {
    label: 'PayPal Payment Received Scam',
    desc: 'Fake invoice with refund helpline lure',
    text: `From: "PayPal Billing Department" <service@paypa1-invoice-verify.site>
Subject: Invoice #INV-92818 for Bitcoin Purchase ($699.00)
Date: 28 Aug 2026

Hello,

You sent a payment of $699.00 USD to Binance Global Ltd for 0.012 BTC.
If you did not authorize this purchase, cancel within 24 hours immediately.

Verify and Dispute: http://paypa1-security-dispute.xyz/cancel?id=92818`
  },
  {
    label: 'Authentic GitHub Alert',
    desc: 'Legitimate security email from @github.com',
    text: `From: "GitHub" <noreply@github.com>
Subject: [GitHub] Security advisory: Dependabot alert #42
Date: 28 Aug 2026
spf=pass
dkim=pass

Hi developer,

A potential security vulnerability was discovered in one of your repository dependencies.
View advisory details: https://github.com/org/repo/security/dependabot/42

Best regards,
GitHub Security`
  }
];

export const EmailScanner = ({ onScanComplete, onOpenAbuse, isSlowConnection }) => {
  const [emailInput, setEmailInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const handleScan = (contentToAnalyze) => {
    const target = (contentToAnalyze !== undefined ? contentToAnalyze : emailInput).trim();
    if (!target) return;

    setScanning(true);
    setCurrentResult(null);
    playScanSweep();

    const scanDuration = isSlowConnection ? 1400 : 700;

    setTimeout(() => {
      const result = analyzeEmail(target);
      setCurrentResult(result);
      setScanning(false);

      if (result.threatLevel === 'malicious') playDangerAlert();
      else if (result.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(result);
    }, scanDuration);
  };

  const handleLoadSample = (sampleText) => {
    setEmailInput(sampleText);
    handleScan(sampleText);
  };

  const handleClear = () => {
    setEmailInput('');
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Email Header & Psycholinguistic Inspector
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              SPF/DKIM alignment, display spoofing, link vs anchor text divergence, and coercive urgency analyzer
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
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Paste raw email headers and body content here (e.g. From:, Subject:, Body, Links)..."
            className="glass-input w-full p-4 rounded-xl text-xs font-mono outline-none resize-y"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {emailInput.length > 0 ? `${emailInput.length} characters parsed` : 'Supports full RFC 822 / raw email dumps'}
            </div>

            <div className="flex items-center gap-2">
              {emailInput && (
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
                disabled={scanning || !emailInput.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Headers...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Inspect Email Threat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Load Realistic Email Phishing Scenarios:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_EMAILS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.text)}
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
        <ScanLoader target={emailInput.slice(0, 60)} isSlowConnection={isSlowConnection} />
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
