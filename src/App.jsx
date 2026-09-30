import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { ThreatTicker } from './components/layout/ThreatTicker';
import { Footer } from './components/layout/Footer';
import { ScannerHub } from './components/scanner/ScannerHub';
import { ThreatRadar } from './components/radar/ThreatRadar';
import { PhishingQuiz } from './components/academy/PhishingQuiz';
import { IncidentReport } from './components/response/IncidentReport';
import { ApiSettings } from './components/settings/ApiSettings';
import { SafePreview } from './components/sandbox/SafePreview';
import { LookalikeStudio } from './components/lookalike/LookalikeStudio';
import { PasswordSafety } from './components/credential/PasswordSafety';
import { AttackSimulator } from './components/simulator/AttackSimulator';
import { EmergencyTriage } from './components/triage/EmergencyTriage';
import { NetworkBanner } from './components/layout/NetworkBanner';
import { useNetworkStatus } from './utils/networkStatus';
import { isAudioMuted, initAudioSettings } from './utils/audioEffects';
import {
  ShieldCheck,
  Shield,
  ArrowRight,
  Layers,
  Brain,
  KeyRound,
  LifeBuoy,
  Lock,
  Zap,
  Globe,
  CheckCircle2
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [muted, setMuted] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScanForAbuse, setSelectedScanForAbuse] = useState(null);
  const [activeTarget, setActiveTarget] = useState(null);
  const [activeResult, setActiveResult] = useState(null);

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

  // Inspect any target string across modules and switch to scanner
  const handleInspectTarget = (targetUrl) => {
    setActiveTarget(targetUrl);
    setActiveResult(null);
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View exact historical scan from session logs
  const handleSelectScan = (result) => {
    setActiveResult(result);
    setActiveTarget(null);
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAbuse = (result) => {
    setSelectedScanForAbuse(result);
    setActiveTab('response');
  };

  const networkStatus = useNetworkStatus();

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-sky-500 selection:text-white overflow-x-hidden cyber-grid-bg transition-colors duration-200">
      {/* Network Connectivity Status Banner (Offline / Slow Connection) */}
      <NetworkBanner networkStatus={networkStatus} />

      {/* Top Threat Ticker */}
      <ThreatTicker onInspectTarget={handleInspectTarget} />

      {/* Modern Responsive Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        muted={muted}
        setMuted={setMuted}
        totalScans={scanHistory.length}
      />

      {/* Hero Section */}
      <section className="relative border-b border-slate-200 dark:border-white/5 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/50 via-transparent to-transparent dark:from-sky-950/20 dark:via-transparent dark:to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Multi-Vector Phishing & Social Engineering Defense Engine</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Phishing Detection Made <span className="text-sky-600 dark:text-cyan-400">Simple & Accurate</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Instantly analyze suspicious links, spoofed emails, smishing SMS messages, QR codes, and credentials. Understand threats with plain-English explanations, simulate attacks, and contain incidents with interactive step-by-step playbooks.
            </p>

            {/* Quick Tool Navigation Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Jump:</span>
              <button
                onClick={() => setActiveTab('scanner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'scanner'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Omni-Scanner</span>
              </button>
              <button
                onClick={() => setActiveTab('lookalike')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'lookalike'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Lookalike Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'simulator'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Attack Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('credentials')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'credentials'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password Lab</span>
              </button>
              <button
                onClick={() => setActiveTab('triage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'triage'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300'
                }`}
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Emergency Triage</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 self-stretch sm:self-auto">
            <div className="px-4 py-3 rounded-2xl glass-card text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Heuristics Engine
              </span>
              <span className="text-base font-bold font-mono text-sky-600 dark:text-cyan-300">25+ Rules</span>
            </div>
            <div className="px-4 py-3 rounded-2xl glass-card text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Brand Catalog
              </span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">150+ Brands</span>
            </div>
            <div className="col-span-2 sm:col-span-1 px-4 py-3 rounded-2xl glass-card text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Local Privacy
              </span>
              <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-300">100% Client-Side</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10">
        {/* Module 1: Unified Threat Scanner */}
        {activeTab === 'scanner' && (
          <div className="space-y-8 animate-fadeIn">
            <ScannerHub
              onScanComplete={handleScanComplete}
              onOpenAbuse={handleOpenAbuse}
              initialTarget={activeTarget}
              initialResult={activeResult}
              isSlowConnection={networkStatus.isSlowConnection}
            />
            <div className="pt-6 border-t border-slate-200 dark:border-white/5">
              <SafePreview />
            </div>
          </div>
        )}

        {/* Module 2: Lookalike & Typosquat Studio */}
        {activeTab === 'lookalike' && (
          <div className="animate-fadeIn">
            <LookalikeStudio onScanDomain={handleInspectTarget} />
          </div>
        )}

        {/* Module 3: Attack & Psychology Simulator */}
        {activeTab === 'simulator' && (
          <div className="animate-fadeIn">
            <AttackSimulator onInspectTarget={handleInspectTarget} />
          </div>
        )}

        {/* Module 4: Password & Credential Lab */}
        {activeTab === 'credentials' && (
          <div className="animate-fadeIn">
            <PasswordSafety />
          </div>
        )}

        {/* Module 5: Threat Radar & Sonar */}
        {activeTab === 'radar' && (
          <div className="animate-fadeIn">
            <ThreatRadar onInspectTarget={handleInspectTarget} />
          </div>
        )}

        {/* Module 6: Cyber Academy Quiz */}
        {activeTab === 'academy' && (
          <div className="animate-fadeIn">
            <PhishingQuiz />
          </div>
        )}

        {/* Module 7: Emergency Incident Triage */}
        {activeTab === 'triage' && (
          <div className="animate-fadeIn">
            <EmergencyTriage />
          </div>
        )}

        {/* Module 8: Incident Report & History Logs */}
        {activeTab === 'response' && (
          <div className="animate-fadeIn">
            <IncidentReport
              scanHistory={scanHistory}
              onClearHistory={handleClearHistory}
              onSelectScan={handleSelectScan}
              initialScanResult={selectedScanForAbuse}
            />
          </div>
        )}

        {/* Module 9: Config & API Settings */}
        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <ApiSettings muted={muted} setMuted={setMuted} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
