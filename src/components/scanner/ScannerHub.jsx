import React, { useState, useRef } from 'react';
import {
  Globe,
  Mail,
  QrCode,
  Search,
  Shield,
  X,
  Upload,
  Clipboard,
  AlertCircle
} from 'lucide-react';
import { analyzeUrl } from '../../services/urlAnalyzer';
import { analyzeEmail } from '../../services/emailAnalyzer';
import { analyzeSms } from '../../services/smsAnalyzer';
import { decodeQrFromImageFile } from '../../services/qrScanner';
import { ScanResults } from './ScanResults';
import { ScanLoader } from './ScanLoader';

const URL_SAMPLES = [
  { label: 'PayPal Impersonation', url: 'http://paypa1-security-center.xyz/webscr?cmd=_login-run' },
  { label: 'Fake Microsoft 365 Login', url: 'https://login.microsoftonline.com-auth-verify.top/login' },
  { label: 'USPS Delivery Scam Link', url: 'https://usps-redelivery-address.top/update' },
  { label: 'Safe Link (Google)', url: 'https://google.com' },
];

const MESSAGE_SAMPLES = [
  {
    label: 'Urgent Password Expiry Email',
    text: `From: "IT Helpdesk" <admin@m365-security-update.xyz>
Subject: URGENT: Your Microsoft 365 Password Expires Today
Reply-To: it-support@mail-proxy-auth.top

Your Microsoft 365 account password will expire in 2 hours.
Failure to renew immediately will result in complete account suspension.
Renew here: http://login-microsoft365-verify.com.auth-token.xyz/login`
  },
  {
    label: 'USPS Incomplete Address SMS',
    text: `[USPS Tracking]: Your parcel cannot be dispatched due to an incomplete street address. Please update your address and pay the $1.95 redelivery fee: https://usps-redelivery-address.top/update`
  },
  {
    label: 'CEO Wire Transfer Request',
    text: `From: "Arthur (CEO)" <ceo-office-direct@corporate-exec-desk.work>
Subject: Strictly Confidential - Urgent Wire Transfer

I need an immediate wire transfer of $148,000 processed before 4:00 PM today.
Please reply directly and I will send recipient routing numbers.`
  }
];

const QR_SAMPLES = [
  { label: 'Parking Meter Scam QR', url: 'http://pay-meter-cityparking.xyz/pay?spot=420' },
  { label: 'Fake DocuSign QR', url: 'https://docusign.net.esign-vault-portal.live/view' },
  { label: 'Safe Wikipedia QR', url: 'https://en.wikipedia.org/wiki/QR_code' }
];

export const ScannerHub = ({
  onScanComplete,
  onOpenAbuse,
  initialTarget,
  initialResult,
  isSlowConnection
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (initialResult?.category === 'email' || initialResult?.category === 'sms') return 'message';
    if (initialResult?.category === 'qr') return 'qr';
    return 'url';
  });
  const [urlInput, setUrlInput] = useState(() => initialTarget || (initialResult?.category === 'url' ? initialResult.target : ''));
  const [messageInput, setMessageInput] = useState(() => (initialResult?.category === 'email' || initialResult?.category === 'sms') ? (initialResult.target || '') : '');
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(() => initialResult || (initialTarget ? analyzeUrl(initialTarget) : null));
  const [currentTargetText, setCurrentTargetText] = useState(() => initialTarget || initialResult?.target || '');
  const [qrError, setQrError] = useState(null);
  const fileInputRef = useRef(null);

  const runUrlScan = (targetUrl) => {
    const text = (targetUrl !== undefined ? targetUrl : urlInput).trim();
    if (!text) return;

    setScanning(true);
    setCurrentTargetText(text);
    setCurrentResult(null);

    const duration = isSlowConnection ? 1000 : 500;
    setTimeout(() => {
      const result = analyzeUrl(text);
      setCurrentResult(result);
      setScanning(false);
      if (onScanComplete) onScanComplete(result);
    }, duration);
  };

  const runMessageScan = (targetText) => {
    const text = (targetText !== undefined ? targetText : messageInput).trim();
    if (!text) return;

    setScanning(true);
    setCurrentTargetText(text);
    setCurrentResult(null);

    const duration = isSlowConnection ? 1000 : 500;
    setTimeout(() => {
      // Auto determine if email or SMS
      const isEmailLike = text.includes('From:') || text.includes('Subject:') || text.includes('Reply-To:') || text.length > 280;
      const result = isEmailLike ? analyzeEmail(text) : analyzeSms(text, '');
      setCurrentResult(result);
      setScanning(false);
      if (onScanComplete) onScanComplete(result);
    }, duration);
  };

  const handleQrUpload = async (file) => {
    if (!file) return;
    setQrError(null);
    setScanning(true);
    setCurrentTargetText(file.name);
    setCurrentResult(null);

    try {
      const { scanResult } = await decodeQrFromImageFile(file);
      setScanning(false);
      if (scanResult) {
        setCurrentResult(scanResult);
        if (onScanComplete) onScanComplete(scanResult);
      }
    } catch (err) {
      setScanning(false);
      setQrError(err.message || 'Could not decode QR code from this image. Please ensure the code is clear.');
    }
  };

  const runQrSample = (sampleUrl) => {
    setScanning(true);
    setCurrentTargetText(sampleUrl);
    setCurrentResult(null);

    setTimeout(() => {
      const result = analyzeUrl(sampleUrl);
      result.category = 'qr';
      setCurrentResult(result);
      setScanning(false);
      if (onScanComplete) onScanComplete(result);
    }, 500);
  };

  const pasteFromClipboard = async (setter) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setter(text);
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Mode Selector */}
      <div className="clean-card rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Phishing Scanner
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select what you want to check and get an instant security verdict.
            </p>
          </div>

          {/* High-Contrast Tab Pills */}
          <div className="inline-flex p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Website Link</span>
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'message'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email / SMS</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        {/* Tab 1: URL / Link Scanner */}
        {activeTab === 'url' && (
          <div className="space-y-4 animate-fadeIn">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runUrlScan();
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
                  placeholder="Paste any link or website (e.g. https://example-security-update.com/login)"
                  className="clean-input w-full pl-10 pr-20 py-3 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-500 outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
                  {urlInput ? (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      title="Clear input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pasteFromClipboard(setUrlInput)}
                      className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1 font-semibold"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={scanning || !urlInput.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                <span>{scanning ? 'Scanning...' : 'Check Link'}</span>
              </button>
            </form>

            {/* Quick Benchmark Samples */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Try an example:</span>
              {URL_SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => {
                    setUrlInput(sample.url);
                    runUrlScan(sample.url);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-200/90 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Email & Message Scanner */}
        {activeTab === 'message' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="relative">
              <textarea
                rows={6}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Paste the suspicious email text, headers, or SMS message here..."
                className="clean-input w-full p-3.5 rounded-xl text-sm font-sans text-slate-900 dark:text-white placeholder:text-slate-500 outline-none resize-y"
              />
              <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
                {messageInput ? (
                  <button
                    type="button"
                    onClick={() => setMessageInput('')}
                    className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => pasteFromClipboard(setMessageInput)}
                    className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Try an example:</span>
                {MESSAGE_SAMPLES.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setMessageInput(sample.text);
                      runMessageScan(sample.text);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-200/90 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => runMessageScan()}
                disabled={scanning || !messageInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0 self-end sm:self-auto shadow-sm"
              >
                <Shield className="w-4 h-4" />
                <span>{scanning ? 'Analyzing...' : 'Scan Message'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: QR Code Scanner */}
        {activeTab === 'qr' && (
          <div className="space-y-4 animate-fadeIn">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleQrUpload(file);
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-400 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-600 dark:hover:border-blue-400 transition-colors bg-slate-100/70 dark:bg-slate-900/40"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Upload a QR code image or screenshot
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                PNG, JPG, or WEBP. Safely decodes and inspects the destination without navigating to it.
              </p>
            </div>

            {qrError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{qrError}</span>
              </div>
            )}

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Try sample QR destination:</span>
              {QR_SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => runQrSample(sample.url)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {scanning && (
        <ScanLoader target={currentTargetText} isSlowConnection={isSlowConnection} />
      )}

      {/* Results Display */}
      {currentResult && !scanning && (
        <ScanResults
          result={currentResult}
          onOpenAbuse={onOpenAbuse}
        />
      )}
    </div>
  );
};
