import React, { useState } from 'react';
import { AbuseGenerator } from './AbuseGenerator';
import { FileText, Download, Printer, ShieldAlert, History, Trash2, ArrowRight, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { exportScanResultAsJson, printIncidentReport } from '../../utils/reportGenerator';
import { useAuth } from '../../context/AuthContext';

export const IncidentReport = ({
  scanHistory = [],
  onClearHistory,
  onSelectScan,
  initialScanResult = null,
  onRefreshCloud,
  cloudSyncing = false
}) => {
  const [activeSubTab, setActiveSubTab] = useState(initialScanResult ? 'abuse' : 'history');
  const { currentUser } = useAuth();
  const latestMalicious = initialScanResult || scanHistory.find((s) => s.threatLevel === 'malicious') || scanHistory[0] || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recent Checks ({scanHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('abuse')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'abuse'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Takedown & Abuse Notice</span>
        </button>
      </div>

      {activeSubTab === 'abuse' ? (
        <AbuseGenerator initialScanResult={latestMalicious} />
      ) : (
        <div className="clean-card rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Scan History
                </h3>
                {currentUser ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                    <Cloud className="w-3 h-3" />
                    <span>Firestore Synced</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold border border-slate-200 dark:border-slate-700">
                    <CloudOff className="w-3 h-3" />
                    <span>Local Only</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser
                  ? `Authenticated as ${currentUser.email || currentUser.displayName} — Previous scans preserved in cloud.`
                  : 'Websites, messages, and QR codes checked during this session. Sign in to sync across devices.'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {currentUser && onRefreshCloud && (
                <button
                  onClick={onRefreshCloud}
                  disabled={cloudSyncing}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  title="Reload from Firestore"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              )}

              {scanHistory.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </div>

          {scanHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center space-y-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <FileText className="w-8 h-8 text-slate-400" />
              <span>No scans recorded yet. Go to the Scanner tab to test any link or message.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                        scan.threatLevel === 'malicious' || scan.threatLevel === 'Critical Threat' || scan.threatLevel === 'High Threat'
                          ? 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900'
                          : scan.threatLevel === 'suspicious' || scan.threatLevel === 'Medium Risk' || scan.threatLevel === 'Low Risk'
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900'
                      }`}>
                        {scan.threatLevel} ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {typeof scan.timestamp === 'number'
                          ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : scan.timestamp}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 uppercase font-mono font-bold">[{scan.category}]</span>
                    </div>

                    <p className="font-mono text-xs text-slate-900 dark:text-slate-100 font-semibold truncate max-w-lg">
                      {scan.target}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => exportScanResultAsJson(scan)}
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs cursor-pointer"
                      title="Download JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => printIncidentReport(scan)}
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs cursor-pointer"
                      title="Print Report"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectScan(scan)}
                      className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
