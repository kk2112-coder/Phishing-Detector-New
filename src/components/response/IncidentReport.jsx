import React, { useState } from 'react';
import { AbuseGenerator } from './AbuseGenerator';
import { FileText, Download, Printer, ShieldAlert, History, Trash2, ArrowRight } from 'lucide-react';
import { exportScanResultAsJson, printIncidentReport } from '../../utils/reportGenerator';

export const IncidentReport = ({
  scanHistory = [],
  onClearHistory,
  onSelectScan,
  initialScanResult = null
}) => {
  const [activeSubTab, setActiveSubTab] = useState(initialScanResult ? 'abuse' : 'history');
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Scan History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Websites, messages, and QR codes checked during your session
              </p>
            </div>

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
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                        scan.threatLevel === 'malicious'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                          : scan.threatLevel === 'suspicious'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}>
                        {scan.threatLevel} ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs text-slate-400">{scan.timestamp}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-medium">[{scan.category}]</span>
                    </div>

                    <p className="font-mono text-xs text-slate-800 dark:text-slate-200 font-medium truncate max-w-lg">
                      {scan.target}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => exportScanResultAsJson(scan)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
                      title="Download JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => printIncidentReport(scan)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
                      title="Print Report"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectScan(scan)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
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
