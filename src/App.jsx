import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScannerHub } from './components/scanner/ScannerHub';
import { IncidentReport } from './components/response/IncidentReport';
import { EmergencyTriage } from './components/triage/EmergencyTriage';
import { ApiSettings } from './components/settings/ApiSettings';
import { NetworkBanner } from './components/layout/NetworkBanner';
import { AuthModal } from './components/layout/AuthModal';
import { useNetworkStatus } from './utils/networkStatus';
import {
  saveScanToFirestore,
  fetchUserScansFromFirestore,
  clearUserScansFromFirestore
} from './services/firestoreService';
import { ShieldCheck, Shield, Lock, Eye } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'history' | 'guide' | 'settings'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);

  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('phishguard_scan_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse scan history from local storage', e);
    }
    return [];
  });

  const [selectedScanForAbuse, setSelectedScanForAbuse] = useState(null);
  const [activeTarget, setActiveTarget] = useState(null);
  const [activeResult, setActiveResult] = useState(null);

  const networkStatus = useNetworkStatus();
  const { currentUser } = useAuth();

  // Load previous scan data from Cloud Firestore when user logs in
  const syncHistoryFromCloud = useCallback(async (uid) => {
    if (!uid) return;
    setCloudSyncing(true);
    try {
      const firestoreScans = await fetchUserScansFromFirestore(uid, 50);

      setScanHistory((prevLocal) => {
        const map = new Map();
        firestoreScans.forEach((s) => map.set(s.id, s));
        prevLocal.forEach((s) => {
          if (!map.has(s.id)) {
            map.set(s.id, s);
            saveScanToFirestore(uid, s);
          }
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0)
        );

        try {
          localStorage.setItem('phishguard_scan_history', JSON.stringify(merged));
        } catch (e) {
          console.error('Failed to update local storage', e);
        }
        return merged;
      });
    } catch (err) {
      console.error('Failed to sync history from Firestore:', err);
    } finally {
      setCloudSyncing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (currentUser?.uid) {
      // Async call so setState is not synchronous in effect body
      Promise.resolve().then(() => {
        if (isMounted) {
          syncHistoryFromCloud(currentUser.uid);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid, syncHistoryFromCloud]);

  const handleScanComplete = async (result) => {
    setScanHistory((prev) => {
      const updated = [result, ...prev.filter((item) => item.id !== result.id)].slice(0, 50);
      try {
        localStorage.setItem('phishguard_scan_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save scan history locally', e);
      }
      return updated;
    });

    // If user is authenticated, also save directly into Cloud Firestore database!
    if (currentUser) {
      await saveScanToFirestore(currentUser.uid, result);
    }
  };

  const handleClearHistory = async () => {
    setScanHistory([]);
    localStorage.removeItem('phishguard_scan_history');
    if (currentUser) {
      await clearUserScansFromFirestore(currentUser.uid);
    }
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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Network Connectivity Status Banner (only displays if offline/slow) */}
      <NetworkBanner networkStatus={networkStatus} />

      {/* Auth Modal Dialog */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Clean Navbar with global Theme Toggle and Auth Controls */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalScans={scanHistory.length}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Clean, Trustworthy Hero Header with High Contrast */}
      {activeTab === 'scanner' && (
        <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs py-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-3.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Private & Client-Side Phishing Protection</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Check links, messages, and QR codes before you click
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
              Detect deceptive URLs, spoofed sender domains, brand impersonation, and scam text messages with clear, plain-language safety verdicts.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Data Uploaded</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Brand Verification</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
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
              onRefreshCloud={() => currentUser?.uid && syncHistoryFromCloud(currentUser.uid)}
              cloudSyncing={cloudSyncing}
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
