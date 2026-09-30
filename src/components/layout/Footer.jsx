import React from 'react';
import { Shield, Lock, Eye, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 mt-16 py-12 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 dark:text-cyan-400 font-bold text-sm mb-3">
              <Shield className="w-4 h-4" />
              <span>PHISHGUARD AI PLATFORM</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time multi-vector phishing heuristic analyzer, homoglyph detection engine, and security awareness training sandbox.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Protected Vectors</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                <span>URL & Domain Typosquatting</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                <span>Email Header & SPF/DMARC Spoofing</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                <span>SMS / Smishing Micro-Pay Lures</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                <span>QR Code Quishing & Payload Extraction</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                <span>HTML DOM Credential Harvesters</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 text-[11px]">MITRE ATT&CK Mapping</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              <li>T1566.001 - Spearphishing Attachment</li>
              <li>T1566.002 - Spearphishing Link</li>
              <li>T1566.003 - Spearphishing Service</li>
              <li>T1598 - Phishing for Info</li>
              <li>T1027 - Obfuscated Payloads</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Privacy & Safe Sandbox</h4>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>100% Client-Side Engine</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                Analyzed URLs and text are evaluated safely in your local browser sandbox. No sensitive credentials or scanned payloads are stored on remote servers.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400 text-[11px]">
          <div>
            © 2026 PhishGuard AI Cyber Defense Systems. Built with React & Tailwind CSS.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
              <span>Zero Logging Policy</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>SOC2 Compliant Framework</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
