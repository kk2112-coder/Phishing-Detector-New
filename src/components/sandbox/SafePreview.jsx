import React, { useState } from 'react';
import { AlertTriangle, Eye, ShieldAlert, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

const SANDBOX_TEMPLATES = [
  {
    id: 'paypal',
    name: 'PayPal Phishing Portal',
    url: 'http://paypa1-security-verify.xyz/webscr?cmd=_login',
    brand: 'PayPal',
    clonedLogoText: 'Pay',
    clonedLogoSub: 'Pal',
    brandColor: 'text-blue-700',
    bannerText: '⚠️ Account Temporarily Suspended! Verify within 04:59 to avoid permanent restriction.',
    input1Label: 'Email or mobile number',
    input2Label: 'Password',
    buttonText: 'Log In & Verify Identity',
    notes: [
      { id: 1, title: 'Cloned Trademark Assets', desc: 'Attacker directly scraped official SVGs and fonts to mimic the authentic PayPal login dialog.' },
      { id: 2, title: 'Artificial Urgency Clock', desc: 'A 5-minute countdown induces panic so victims overlook the address bar.' },
      { id: 3, title: 'Unencrypted Form Action', desc: 'Form submits credentials directly to an unverified PHP backend on an .xyz domain.' }
    ]
  },
  {
    id: 'm365',
    name: 'Microsoft 365 / Entra ID Clone',
    url: 'https://login.microsoftonline.com-auth-verify.top/common/oauth2',
    brand: 'Microsoft',
    clonedLogoText: 'Microsoft',
    clonedLogoSub: '',
    brandColor: 'text-slate-800',
    bannerText: '⚠️ Organizational Compliance: Update credentials for Office 365 Single Sign-On.',
    input1Label: 'someone@example.com',
    input2Label: 'Password',
    buttonText: 'Sign in to Office 365',
    notes: [
      { id: 1, title: 'Subdomain Confusion', desc: 'Prepends the official hostname "login.microsoftonline.com" as a subdomain of attacker root ".top".' },
      { id: 2, title: 'AiTM Reverse Proxy', desc: 'Behind this form sits Evilginx, capturing live session tokens and bypassing 2FA prompts.' },
      { id: 3, title: 'Corporate Theming', desc: 'Often auto-populates the target company logo based on the email domain entered.' }
    ]
  },
  {
    id: 'metamask',
    name: 'MetaMask Secret Recovery Phrase Drainer',
    url: 'http://metamask-io-wallet-restore.site/sync',
    brand: 'MetaMask',
    clonedLogoText: 'Meta',
    clonedLogoSub: 'Mask',
    brandColor: 'text-amber-600',
    bannerText: '⚠️ Critical Security Patch: Validate your 12-word seed phrase to avoid node desync.',
    input1Label: '12 or 24 word Secret Recovery Phrase',
    input2Label: 'Wallet Password (Optional)',
    buttonText: 'Restore & Secure Wallet',
    notes: [
      { id: 1, title: 'Complete Asset Drainage', desc: 'Submitting seed phrases gives threat actors permanent, irrevocable access to all crypto assets.' },
      { id: 2, title: 'Zero Legitimate Reason', desc: 'No legitimate decentralized app or wallet support team EVER asks for your secret recovery phrase.' },
      { id: 3, title: 'Unregistered Domain', desc: 'Hosted on ephemeral .site registrar with WHOIS privacy masking.' }
    ]
  }
];

export const SafePreview = () => {
  const [activeTemplateId, setActiveTemplateId] = useState('paypal');
  const [activeTooltip, setActiveTooltip] = useState(null);

  const template = SANDBOX_TEMPLATES.find(t => t.id === activeTemplateId) || SANDBOX_TEMPLATES[0];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Isolated Threat Sandbox & Landing Page Inspector
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Inspect deceptive login pages in an isolated visual sandbox without executing malicious payloads
            </p>
          </div>
        </div>

        {/* Template switcher tabs */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl glass-card self-start md:self-auto">
          {SANDBOX_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTemplateId(t.id);
                setActiveTooltip(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTemplateId === t.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.brand}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-300 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl bg-slate-900">
        {/* Mock Browser Top Nav */}
        <div className="bg-slate-800/90 dark:bg-slate-900/90 px-4 py-3 border-b border-slate-700 dark:border-white/10 flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 border border-red-500/40 text-xs font-mono">
            <div className="flex items-center space-x-2 text-red-400 truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{template.url}</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40 shrink-0 ml-2">
              UNTRUSTED ORIGIN
            </span>
          </div>
        </div>

        {/* Sandboxed Deceptive Page Canvas */}
        <div className="p-8 sm:p-12 relative min-h-[380px] flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl p-7 shadow-2xl space-y-5 relative border border-slate-300">
            {/* Cloned Logo */}
            <div
              onMouseEnter={() => setActiveTooltip(1)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative flex items-center justify-center p-2 border-2 border-dashed border-red-500 rounded-xl cursor-help bg-red-50"
            >
              <div className={`text-2xl font-black ${template.brandColor} tracking-tight`}>
                {template.clonedLogoText}<span className="text-cyan-600">{template.clonedLogoSub}</span>
              </div>
              <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                1
              </span>
            </div>

            {/* Artificial Urgency Banner */}
            <div
              onMouseEnter={() => setActiveTooltip(2)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative p-2.5 rounded-lg bg-amber-50 border-2 border-dashed border-amber-500 text-center cursor-help"
            >
              <span className="text-xs font-bold text-amber-900 leading-tight block">
                {template.bannerText}
              </span>
              <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                2
              </span>
            </div>

            {/* Harvesting Form */}
            <div
              onMouseEnter={() => setActiveTooltip(3)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative space-y-2.5 p-3 border-2 border-dashed border-red-500 rounded-xl cursor-help bg-red-50/50"
            >
              <input
                disabled
                type="text"
                placeholder={template.input1Label}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 font-mono"
              />
              <input
                disabled
                type="password"
                placeholder={template.input2Label}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 font-mono"
              />
              <button
                disabled
                className="w-full py-2.5 rounded-lg bg-blue-700 text-white font-bold text-xs shadow opacity-90"
              >
                {template.buttonText}
              </button>
              <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Sandbox Annotation Legend */}
        <div className="bg-slate-800/90 dark:bg-slate-900/90 p-4 border-t border-slate-700 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {template.notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-xl border transition-all ${
                activeTooltip === note.id
                  ? 'bg-red-500/20 border-red-500 text-red-200'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
              }`}
            >
              <span className="font-bold text-white block mb-0.5">
                {note.id}. {note.title}
              </span>
              <span className="leading-snug">{note.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
