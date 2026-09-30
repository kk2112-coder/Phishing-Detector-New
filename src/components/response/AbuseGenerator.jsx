import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, ExternalLink, Send } from 'lucide-react';

const PROVIDERS = [
  { id: 'cloudflare', name: 'Cloudflare Abuse Desk', email: 'abuse@cloudflare.com', portal: 'https://abuse.cloudflare.com/' },
  { id: 'aws', name: 'AWS Trust & Safety', email: 'abuse@amazonaws.com', portal: 'https://aws.amazon.com/forms/report-abuse/' },
  { id: 'namecheap', name: 'Namecheap Abuse', email: 'abuse@namecheap.com', portal: 'https://support.namecheap.com/' },
  { id: 'google', name: 'Google Safe Browsing', email: 'safebrowsing@google.com', portal: 'https://safebrowsing.google.com/safebrowsing/report_phish/' },
  { id: 'cisa', name: 'CISA / US-CERT', email: 'phishing-report@us-cert.gov', portal: 'https://www.cisa.gov/report' },
];

export const AbuseGenerator = ({ initialScanResult }) => {
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0].id);
  const [targetUrl, setTargetUrl] = useState(initialScanResult?.target || 'http://paypa1-security-verify.xyz/login');
  const [targetBrand, setTargetBrand] = useState(initialScanResult?.brandImpersonation?.brandName || 'PayPal');
  const [copied, setCopied] = useState(false);

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  const emailSubject = `[URGENT] Phishing & Credential Harvester Takedown Request: ${targetUrl}`;
  const emailBody = `To: ${activeProvider.name} (${activeProvider.email})
Subject: ${emailSubject}

Dear Trust & Safety / Abuse Team,

I am writing to formally request the immediate suspension / takedown of a malicious phishing website hosted on or routing through your infrastructure.

=== INCIDENT DETAILS ===
- Malicious Target URL: ${targetUrl}
- Impersonated Brand / Organization: ${targetBrand}
- Threat Classification: Credential Harvesting & Brand Impersonation
- Detection Timestamp: ${new Date().toISOString()}
- Automated Heuristic Engine: PhishGuard AI Cyber Defense

=== THREAT EVIDENCE & INDICATORS ===
- The domain exhibits typosquatting and/or unauthorized use of trademarks and copyrighted assets belonging to ${targetBrand}.
- The webpage deceives end-users into submitting confidential credentials, passwords, and 2FA authentication tokens.
- Observed Indicators: Deceptive domain structure, brand name cloaking, and unverified SSL/TLS profile.

Please take urgent action to terminate services, block DNS resolution, or null-route this host to prevent further harm to internet users.

Thank you for your prompt cooperation in keeping the internet secure.

Sincerely,
Cyber Threat Intelligence / Incident Responder
PhishGuard AI Platform`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openMailClient = () => {
    const mailto = `mailto:${activeProvider.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Automated SOC Abuse & Takedown Generator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Generate standardized, legally actionable abuse notices for domain registrars and CDN hosts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Notice Copied' : 'Copy Notice'}</span>
          </button>

          <button
            onClick={openMailClient}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Launch Email Client</span>
          </button>
        </div>
      </div>

      {/* Target Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Hosting / Registrar Provider
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="glass-input w-full p-2.5 rounded-xl text-xs outline-none"
          >
            {PROVIDERS.map((prov) => (
              <option key={prov.id} value={prov.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {prov.name} ({prov.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Malicious Target URL
          </label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="http://paypa1-security.xyz/login"
            className="glass-input w-full p-2.5 rounded-xl text-xs font-mono outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Targeted Brand Name
          </label>
          <input
            type="text"
            value={targetBrand}
            onChange={(e) => setTargetBrand(e.target.value)}
            placeholder="e.g. PayPal, Microsoft"
            className="glass-input w-full p-2.5 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* Provider Details Pill */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
        <div className="space-x-2">
          <span className="text-slate-500">Notice recipient:</span>
          <span className="font-mono text-slate-800 dark:text-cyan-300 font-bold">{activeProvider.email}</span>
        </div>
        <a
          href={activeProvider.portal}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 text-sky-600 dark:text-cyan-400 hover:underline"
        >
          <span>Official Web Form</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Generated Email Notice Preview */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Formal Abuse Notification Draft:
        </span>
        <textarea
          readOnly
          rows={14}
          value={emailBody}
          className="w-full p-4 rounded-xl font-mono text-xs leading-relaxed bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-300 outline-none resize-none select-all"
        />
      </div>
    </div>
  );
};
