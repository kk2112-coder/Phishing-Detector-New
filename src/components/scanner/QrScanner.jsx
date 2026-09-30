import React, { useState, useRef } from 'react';
import { QrCode, Upload, Sparkles, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { decodeQrFromImageFile } from '../../services/qrScanner';
import { analyzeUrl } from '../../services/urlAnalyzer';
import { ScanResults } from './ScanResults';
import { playScanSweep, playSafePing, playWarningBlip, playDangerAlert } from '../../utils/audioEffects';

const SAMPLE_QUISHING_PAYLOADS = [
  {
    label: 'Restaurant Parking Quishing Overlay',
    payload: 'http://pay-meter-cityparking.xyz/pay?spot=420',
    desc: 'Counterfeit parking meter sticker directing to payment skimmer'
  },
  {
    label: 'DocuSign QR Attachment Lure',
    payload: 'https://docusign.net.esign-vault-portal.live/view',
    desc: 'Quishing PDF asking user to scan QR to sign NDA'
  },
  {
    label: 'Legitimate Wikipedia QR',
    payload: 'https://en.wikipedia.org/wiki/QR_code',
    desc: 'Benign standard reference QR link'
  }
];

export const QrScanner = ({ onScanComplete, onOpenAbuse }) => {
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [decodedPayload, setDecodedPayload] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMsg(null);
    setScanning(true);
    playScanSweep();

    try {
      const { payload, scanResult } = await decodeQrFromImageFile(file);
      setDecodedPayload(payload);
      setCurrentResult(scanResult);
      setScanning(false);

      if (scanResult) {
        if (scanResult.threatLevel === 'malicious') playDangerAlert();
        else if (scanResult.threatLevel === 'suspicious') playWarningBlip();
        else playSafePing();

        if (onScanComplete) onScanComplete(scanResult);
      }
    } catch (err) {
      setScanning(false);
      setErrorMsg(err.message || 'Failed to scan QR code image.');
    }
  };

  const handleLoadSamplePayload = (payloadUrl) => {
    setErrorMsg(null);
    setScanning(true);
    playScanSweep();

    setTimeout(() => {
      const result = analyzeUrl(payloadUrl);
      setDecodedPayload(payloadUrl);
      setCurrentResult(result);
      setScanning(false);

      if (result.threatLevel === 'malicious') playDangerAlert();
      else if (result.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(result);
    }, 600);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              QR Code Quishing & Payload Extractor
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Decode QR images 100% locally in browser to inspect embedded redirection URLs without visiting them
            </p>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-sky-500 dark:hover:border-cyan-400/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Upload or Drop QR Code Screenshot / Photo
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PNG, JPG, WebP, GIF • Processed securely in browser memory
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {decodedPayload && (
          <div className="mt-4 p-3.5 rounded-xl bg-sky-50 dark:bg-slate-900/90 border border-sky-200 dark:border-cyan-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-cyan-400 block tracking-wider">
                Decoded QR Payload URI
              </span>
              <p className="font-mono text-slate-800 dark:text-cyan-200 truncate">
                {decodedPayload}
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shrink-0 self-start sm:self-auto">
              Decoded Locally
            </span>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>Load Known QR Quishing Scam Samples:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUISHING_PAYLOADS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSamplePayload(sample.payload)}
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
