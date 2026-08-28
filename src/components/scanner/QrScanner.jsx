import React, { useState, useRef } from 'react';
import { QrCode, Upload, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
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
    setDecodedPayload(payloadUrl);
    playScanSweep();

    setTimeout(() => {
      const scanResult = analyzeUrl(payloadUrl);
      scanResult.category = 'qr';
      scanResult.target = `QR Payload: ${payloadUrl}`;
      setCurrentResult(scanResult);
      setScanning(false);

      if (scanResult.threatLevel === 'malicious') playDangerAlert();
      else if (scanResult.threatLevel === 'suspicious') playWarningBlip();
      else playSafePing();

      if (onScanComplete) onScanComplete(scanResult);
    }, 500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md overflow-hidden">
        {scanning && <div className="scanline" />}

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              QR Code (Quishing) Image Threat Scanner
            </h2>
            <p className="text-xs text-slate-400">
              Decode physical QR stickers, email QR attachments, and inspect embedded malicious redirection targets
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-cyan-900/60 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          <div className="p-4 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop a QR code image here, or <span className="text-cyan-400 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, WEBP, and camera snapshots
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {decodedPayload && (
          <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 block mb-1">DECODED QR PAYLOAD:</span>
            <span className="text-cyan-300 break-all">{decodedPayload}</span>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Real-World Quishing (QR Phishing) Attacks:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUISHING_PAYLOADS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSamplePayload(sample.payload)}
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
