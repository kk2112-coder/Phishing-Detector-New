import React, { useState } from 'react';
import { Smartphone, RefreshCw, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { analyzeSms } from '../../services/smsAnalyzer';
import { ScanResults } from './ScanResults';
import { ScanLoader } from './ScanLoader';
import { playScanSweep, playSafePing, playWarningBlip, playDangerAlert } from '../../utils/audioEffects';

const SAMPLE_SMS = [
  {
    label: 'USPS Incomplete Address ($1.95 Fee)',
    sender: '+1 (833) 891-2091',
    text: '[USPS Tracking]: Your parcel #US94812 cannot be dispatched due to an incomplete street address. Please update your address and pay the $1.95 redelivery fee to avoid item return: https://usps-redelivery-address.top/update',
    desc: 'Credit card harvesting micro-payment lure'
  },
  {
    label: 'Chase Bank Zelle Fraud Alert',
    sender: 'CHASE-ALERT',
    text: 'CHASE FRAUD ALERT: Did you attempt a $2,450.00 Zelle transfer to Michael B.? If NO, immediately verify your account to freeze funds: https://bit.ly/chase-fraud-cancel-98',
    desc: 'Shortened link + 2FA credential harvest'
  },
  {
    label: 'E-ZPass Toll Violation Notice',
    sender: '+1 (800) 555-0144',
    text: 'E-ZPass Toll Services: You have an overdue toll balance of $12.50. Late fees of $50 will be assessed if not resolved within 24h: https://ezpass-toll-settlement.buzz/pay',
    desc: 'Fake municipal agency payment smish'
  },
  {
    label: 'IRS Direct Deposit Stimulus',
    sender: '+1 (888) 492-9102',
    text: 'IRS Notification: Your 2026 economic rebate of $1,400.00 is ready for direct deposit disbursement. Confirm your SSN & bank routing: https://irs-treasury-claim.icu/auth',
    desc: 'SSN and identity theft lure'
  }
];

export const SmsScanner = ({ onScanComplete, onOpenAbuse, isSlowConnection }) => {
  const [senderPhone, setSenderPhone] = useState('');
  const [smsText, setSmsText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const handleScan = (text, sender) => {
    const textToScan = (text !== undefined ? text : smsText).trim();
    const senderToScan = sender !== undefined ? sender : senderPhone;
    if (!textToScan) return;

    setScanning(true);
    setCurrentResult(null);
    playScanSweep();

    const scanDuration = isSlowConnection ? 1400 : 700;

    setTimeout(() => {
      const result = analyzeSms(textToScan, senderToScan);
      setCurrentResult(result);
      setScanning(false);

      if (result.threatLevel === 'malicious') playDangerAlert();
      else if (result.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(result);
    }, scanDuration);
  };

  const handleLoadSample = (sample) => {
    setSenderPhone(sample.sender);
    setSmsText(sample.text);
    handleScan(sample.text, sample.sender);
  };

  const handleClear = () => {
    setSenderPhone('');
    setSmsText('');
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              SMS Smishing & Mobile Threat Scanner
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Micro-payment toll traps, package delivery lures, shortened URLs, and toll-free sender reputation
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sender Number or Alpha ID (Optional)
            </label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="e.g. +1 (833) 891-2091, USPS-TRACK, CHASE-ALERT"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              SMS Message Body
            </label>
            <textarea
              rows={4}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste the suspicious text message here (including any links or shortcodes)..."
              className="glass-input w-full p-3.5 rounded-xl text-xs font-mono outline-none resize-y"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {smsText.length} characters
            </span>

            <div className="flex items-center gap-2">
              {(smsText || senderPhone) && (
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
                disabled={scanning || !smsText.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Smish Patterns...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Analyze SMS Threat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Load Known Smishing Campaigns:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_SMS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample)}
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
        <ScanLoader target={smsText.slice(0, 60)} isSlowConnection={isSlowConnection} />
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
