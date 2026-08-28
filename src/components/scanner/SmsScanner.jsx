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
      <div className="relative bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md overflow-hidden">
        {scanning && <div className="scanline" />}

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              SMS & Smishing Mobile Message Scanner
            </h2>
            <p className="text-xs text-slate-400">
              Shortened URL cloaking, fake delivery micro-fees, 2FA theft hooks, and urgency lexicon analysis
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Sender Phone Number / Caller ID (Optional):
            </label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="+1 (833) 891-2091 or BOA-ALERTS"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-mono transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              SMS Message Text Content:
            </label>
            <textarea
              rows={4}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste suspicious SMS text message (e.g. Your package delivery is on hold...)"
              className="w-full p-4 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-mono transition-all outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-mono">
              Detects bit.ly, tinyurl, and credential capture links
            </div>

            <div className="flex items-center gap-2">
              {(smsText || senderPhone) && (
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
                disabled={scanning || !smsText.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Smish Heuristics...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Analyze SMS Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load High-Volume Smishing Scenarios:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_SMS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample)}
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
