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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-red-950 border border-red-800 text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            Automated Abuse & Takedown Report Generator
          </h2>
          <p className="text-xs text-slate-400">
            Generate formal, compliance-grade abuse takedown notices for registrars, hosting providers, and CERT desks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Malicious Target Domain / URL:
          </label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Spoofed Brand / Organization:
          </label>
          <input
            type="text"
            value={targetBrand}
            onChange={(e) => setTargetBrand(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Select Registrar / CDN / Abuse Authority:
        </label>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedProvider === provider.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Recipient: <strong className="text-cyan-300">{activeProvider.email}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied' : 'Copy Notice'}</span>
            </button>
            <button
              onClick={openMailClient}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Mailer</span>
            </button>
            <a
              href={activeProvider.portal}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abuse Web Portal</span>
            </a>
          </div>
        </div>

        <textarea
          readOnly
          rows={14}
          value={emailBody}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 outline-none select-all"
        />
      </div>
    </div>
  );
};
