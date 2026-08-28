import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ThreatTicker } from './components/layout/ThreatTicker';
import { Footer } from './components/layout/Footer';
import { ScannerHub } from './components/scanner/ScannerHub';
import { ThreatRadar } from './components/radar/ThreatRadar';
import { PhishingQuiz } from './components/academy/PhishingQuiz';
import { IncidentReport } from './components/response/IncidentReport';
import { ApiSettings } from './components/settings/ApiSettings';
import { SafePreview } from './components/sandbox/SafePreview';
import { isAudioMuted, initAudioSettings } from './utils/audioEffects';
import { Cpu } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [muted, setMuted] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScanForAbuse, setSelectedScanForAbuse] = useState(null);

  useEffect(() => {
    initAudioSettings();
    setMuted(isAudioMuted());

    const saved = localStorage.getItem('phishguard_scan_history');
    if (saved) {
      try {
        setScanHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse scan history', e);
      }
    }
  }, []);

  const handleScanComplete = (result) => {
    setScanHistory((prev) => {
      const updated = [result, ...prev.filter((item) => item.id !== result.id)].slice(0, 30);
      localStorage.setItem('phishguard_scan_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('phishguard_scan_history');
  };

  const handleInspectTarget = (targetUrl) => {
    setActiveTab('scanner');
  };

  const handleOpenAbuse = (result) => {
    setSelectedScanForAbuse(result);
    setActiveTab('response');
  };

  const handleSelectScan = (result) => {
    setActiveTab('scanner');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <ThreatTicker />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        muted={muted}
        setMuted={setMuted}
        totalScans={scanHistory.length}
      />

      <div className="relative border-b border-cyan-950/40 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Vector AI Heuristics • Zero Remote Logging</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Next-Gen Phishing & Social Engineering Defense
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Inspect suspicious URLs, spoofed email headers, smishing texts, and weaponized QR codes with deep typosquatting analysis and real-time MITRE ATT&CK mapping.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Heuristics</span>
              <span className="text-lg font-bold font-mono text-cyan-300">25+ Rules</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Brand Catalog</span>
              <span className="text-lg font-bold font-mono text-emerald-400">150+ Brands</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Engine Latency</span>
              <span className="text-lg font-bold font-mono text-purple-400">&lt; 15ms</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            <ScannerHub
              onScanComplete={handleScanComplete}
              onOpenAbuse={handleOpenAbuse}
            />
            <div className="pt-6 border-t border-slate-800/80">
              <SafePreview />
            </div>
          </div>
        )}

        {activeTab === 'radar' && (
          <ThreatRadar onInspectTarget={handleInspectTarget} />
        )}

        {activeTab === 'academy' && (
          <PhishingQuiz />
        )}

        {activeTab === 'response' && (
          <IncidentReport
            scanHistory={scanHistory}
            onClearHistory={handleClearHistory}
            onSelectScan={handleSelectScan}
          />
        )}

        {activeTab === 'settings' && (
          <ApiSettings muted={muted} setMuted={setMuted} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
