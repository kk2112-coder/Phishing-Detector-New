import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScannerHub } from './components/scanner/ScannerHub';
import { IncidentReport } from './components/response/IncidentReport';
import { EmergencyTriage } from './components/triage/EmergencyTriage';
import { ApiSettings } from './components/settings/ApiSettings';
import { NetworkBanner } from './components/layout/NetworkBanner';
import { useNetworkStatus } from './utils/networkStatus';
import { ShieldCheck, Shield, Lock, Eye } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'history' | 'guide' | 'settings'
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('phishguard_scan_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse scan history', e);
    }
    return [];
  });
  const [selectedScanForAbuse, setSelectedScanForAbuse] = useState(null);
  const [activeTarget, setActiveTarget] = useState(null);
  const [activeResult, setActiveResult] = useState(null);

  const networkStatus = useNetworkStatus();

  const handleScanComplete = (result) => {
    setScanHistory((prev) => {
      const updated = [result, ...prev.filter((item) => item.id !== result.id)].slice(0, 30);
      try {
        localStorage.setItem('phishguard_scan_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save scan history', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('phishguard_scan_history');
  };

  const handleSelectScan = (result) => {
    setActiveResult(result);
    setActiveTarget(null);
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAbuse = (result) => {
    setSelectedScanForAbuse(result);
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Network Connectivity Status Banner (only displays if offline/slow) */}
      <NetworkBanner networkStatus={networkStatus} />

      {/* Clean Navbar with global Theme Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalScans={scanHistory.length}
      />

      {/* Clean, Human Hero Header */}
      {activeTab === 'scanner' && (
        <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private & Client-Side Phishing Protection</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Check links, messages, and QR codes before you click
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Detect deceptive URLs, spoofed sender domains, brand impersonation, and scam text messages with clear, plain-language safety verdicts.
            </p>

            <div className="pt-2 flex items-center justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Data Uploaded</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Brand Verification</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Tab 1: Scanner */}
        {activeTab === 'scanner' && (
          <div className="animate-fadeIn">
            <ScannerHub
              key={activeResult?.id || activeTarget || 'scanner-hub'}
              onScanComplete={handleScanComplete}
              onOpenAbuse={handleOpenAbuse}
              initialTarget={activeTarget}
              initialResult={activeResult}
              isSlowConnection={networkStatus.isSlowConnection}
            />
          </div>
        )}

        {/* Tab 2: Recent Checks & History */}
        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <IncidentReport
              scanHistory={scanHistory}
              onClearHistory={handleClearHistory}
              onSelectScan={handleSelectScan}
              initialScanResult={selectedScanForAbuse}
            />
          </div>
        )}

        {/* Tab 3: What to Do If Phished */}
        {activeTab === 'guide' && (
          <div className="animate-fadeIn">
            <EmergencyTriage />
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <ApiSettings />
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
