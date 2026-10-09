import React from 'react';
import {
  ShieldAlert,
  Lock,
  ExternalLink,
  Scale,
  FileCheck2,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PhishGuardLogo } from './PhishGuardLogo';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 mt-20 pt-12 pb-8 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Core Mission */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <PhishGuardLogo className="w-8 h-8" />
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-950 dark:text-white block">
                  PhishGuard AI
                </span>
                <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold tracking-wider uppercase">
                  Zero-Trust Security
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Client-resident threat intelligence platform analyzing phishing URLs, social engineering emails, smishing texts, and malicious QR codes without exfiltrating confidential payload data.
            </p>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Heuristic Engine Online</span>
            </div>
          </div>

          {/* Column 2: Vector Defenses (What We Detect) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Cyber Attack Defenses</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Homoglyphs & IDN:</strong> Punycode visual character spoofing</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Typosquatting:</strong> Levenshtein brand impersonation traps</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Email Spoofing:</strong> SPF, DKIM & DMARC header anomalies</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Quishing:</strong> Malicious matrix redirect links</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>DGA Detection:</strong> Shannon entropy randomness scoring</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Incident Response & Emergency Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Incident Response</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.cisa.gov/report"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-between group"
                >
                  <span>CISA US-CERT Incident Report</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-between group"
                >
                  <span>FBI Internet Crime Center (IC3)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://apwg.org/reportphishing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-between group"
                >
                  <span>Anti-Phishing Working Group (APWG)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://attack.mitre.org/techniques/T1566/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-between group"
                >
                  <span>MITRE ATT&CK® T1566 Matrix</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Disclaimer & Privacy Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Legal & Privacy Notice</span>
            </h4>
            <div className="space-y-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Zero-Data Retention</span>
              </div>
              <p>
                PhishGuard does not store, transmit, or monetize scanned messages or private credentials. Scans execute directly in browser memory.
              </p>
              <div className="pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                <strong>Disclaimer:</strong> This tool is an assistive security scanner. Results do not constitute a legal certification of safety or warrant immunity from targeted zero-day attacks.
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Standards Strip */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-3 font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center space-x-1">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>IEEE Std 830-1998 Compliant Architecture</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>GDPR & CCPA Aligned (Client-Local Processing)</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>WCAG 2.2 AA Contrast Standards</span>
          </div>

          <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900 font-medium">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Never enter passwords or OTPs on unverified domains</span>
          </div>
        </div>

        {/* Bottom Copyright & Build info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} <strong>PhishGuard AI</strong>. Open Cybersecurity & Threat Triage Utility. All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <span>Client Engine v2.0</span>
            <span>•</span>
            <span>MITRE ATT&CK Mapped</span>
            <span>•</span>
            <span>Cloud Firestore Synced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
