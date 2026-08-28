import React, { useState } from 'react';
import { AbuseGenerator } from './AbuseGenerator';
import { FileText, Download, Printer, ShieldAlert, History, Trash2, ArrowRight } from 'lucide-react';
import { exportScanResultAsJson, printIncidentReport } from '../../utils/reportGenerator';

export const IncidentReport = ({
  scanHistory = [],
  onClearHistory,
  onSelectScan,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('abuse');
  const latestMalicious = scanHistory.find((s) => s.threatLevel === 'malicious') || scanHistory[0] || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('abuse')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'abuse'
              ? 'bg-red-950/80 text-red-300 border border-red-800/60 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Abuse & Takedown Notices</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span>Session Scan Logs ({scanHistory.length})</span>
        </button>
      </div>

      {activeSubTab === 'abuse' ? (
        <AbuseGenerator initialScanResult={latestMalicious} />
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Session Threat Scan Logs
              </h3>
              <p className="text-xs text-slate-400">
                All URLs, Emails, SMS, and Code snippets evaluated during this session
              </p>
            </div>

            {scanHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600" />
              <span>No scans recorded yet. Run a scan from the Threat Scanner tab.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                        scan.threatLevel === 'malicious'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : scan.threatLevel === 'suspicious'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {scan.threatLevel} ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs font-mono text-slate-500">{scan.timestamp}</span>
                      <span className="text-xs font-mono text-cyan-400 uppercase">[{scan.category}]</span>
                    </div>

                    <p className="font-mono text-xs text-slate-200 font-semibold truncate max-w-lg">
                      {scan.target}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => exportScanResultAsJson(scan)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800"
                      title="Download JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => printIncidentReport(scan)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800"
                      title="Print Report"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectScan(scan)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
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
