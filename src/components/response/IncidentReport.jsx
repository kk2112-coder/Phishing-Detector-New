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
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-white/5 pb-3">
        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'glass-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Session Scan Logs ({scanHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('abuse')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'abuse'
              ? 'bg-red-600 text-white shadow-sm'
              : 'glass-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Abuse & Takedown Notices</span>
        </button>
      </div>

      {activeSubTab === 'abuse' ? (
        <AbuseGenerator initialScanResult={latestMalicious} />
      ) : (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Session Threat Scan Logs
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                All URLs, Emails, SMS, and Code snippets evaluated during this session
              </p>
            </div>

            {scanHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-500 hover:text-rose-600 dark:hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center space-y-2 glass-card rounded-xl border-dashed">
              <FileText className="w-8 h-8 text-slate-400" />
              <span>No scans recorded yet. Run a scan from the Threat Scanner tab.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                        scan.threatLevel === 'malicious'
                          ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                          : scan.threatLevel === 'suspicious'
                          ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                          : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      }`}>
                        {scan.threatLevel} ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{scan.timestamp}</span>
                      <span className="text-xs font-mono text-sky-700 dark:text-cyan-300 uppercase font-bold">[{scan.category}]</span>
                    </div>

                    <p className="font-mono text-xs text-slate-900 dark:text-white font-semibold truncate max-w-lg">
                      {scan.target}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => exportScanResultAsJson(scan)}
                      className="p-2 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white text-xs cursor-pointer"
                      title="Download JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => printIncidentReport(scan)}
                      className="p-2 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white text-xs cursor-pointer"
                      title="Print Report"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectScan(scan)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-cyan-500/20 hover:bg-sky-100 dark:hover:bg-cyan-500/30 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/40 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>View Details</span>
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
