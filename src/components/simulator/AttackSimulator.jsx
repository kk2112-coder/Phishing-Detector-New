import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  Brain,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const ATTACK_ARCHETYPES = [
  {
    id: 'm365-urgent',
    title: 'Microsoft 365 Account Suspension',
    category: 'Credential Harvesting',
    vector: 'email',
    psychTrigger: 'Urgency & Fear',
    sender: 'IT Security Desk <security-admin@m365-verify-identity.xyz>',
    subject: 'URGENT: Your Corporate Password Expires in 2 Hours',
    body: `Dear Colleague,

Your organization single sign-on access will be deactivated today at 5:00 PM due to incomplete password compliance.

To retain uninterrupted access to Outlook, OneDrive, and internal databases, verify your credentials immediately:

[Verify My Password Now -> http://login-microsoftonline.com-auth.xyz/verify]

Failure to confirm will require physical identity verification with Tier 3 IT.

Global IT Helpdesk`,
    scanTarget: 'http://login-microsoftonline.com-auth.xyz/verify',
    hotspots: [
      {
        element: 'Sender Address',
        highlight: 'security-admin@m365-verify-identity.xyz',
        trigger: 'Domain Spoofing',
        explanation: 'Uses a lookalike .xyz domain rather than the authentic @microsoft.com or your employer\'s domain.'
      },
      {
        element: 'Urgency Clock',
        highlight: 'Expires in 2 Hours',
        trigger: 'Artificial Scarcity & Panic',
        explanation: 'Induces rapid emotional reaction, preventing the employee from cross-checking with real IT technicians.'
      },
      {
        element: 'Weaponized Hyperlink',
        highlight: 'http://login-microsoftonline.com-auth.xyz/verify',
        trigger: 'Subdomain Confusion',
        explanation: 'Prepends "login-microsoftonline.com" as a subdomain to an attacker-controlled root domain ".xyz".'
      }
    ]
  },
  {
    id: 'usps-smish',
    title: 'USPS / Postal Missing Delivery Fee',
    category: 'Credit Card Harvester',
    vector: 'sms',
    psychTrigger: 'Curiosity & Micro-Payment Lure',
    sender: '+1 (833) 491-0921',
    subject: 'SMS Text Notification',
    body: `[USPS Tracking]: Your package #US-884920 has arrived at our sorting facility but cannot be dispatched due to an incomplete street address.

Please update your address and pay the $1.95 redelivery handling fee within 24h:
https://usps-redelivery-address.top/update`,
    scanTarget: 'https://usps-redelivery-address.top/update',
    hotspots: [
      {
        element: 'Random Sender Phone',
        highlight: '+1 (833) 491-0921',
        trigger: 'Unregistered VoIP Sender',
        explanation: 'Official USPS tracking notifications utilize shortcodes (e.g. 28777), never 10-digit consumer VoIP numbers.'
      },
      {
        element: '$1.95 Redelivery Fee',
        highlight: '$1.95 redelivery handling fee',
        trigger: 'Micro-Payment Trap',
        explanation: 'Victims readily enter credit card numbers for trivial amounts. The phishing form secretly captures card numbers, CVVs, and billing zip codes.'
      },
      {
        element: 'TLD',
        highlight: '.top TLD',
        trigger: 'Suspicious TLD Choice',
        explanation: 'Legitimate United States Postal Service operates solely on the governmental canonical domain "usps.com".'
      }
    ]
  },
  {
    id: 'geek-invoice',
    title: 'Geek Squad / PayPal Auto-Renewal Scam',
    category: 'Refund & Call-Center Fraud',
    vector: 'email',
    psychTrigger: 'Loss Aversion & Panic',
    sender: 'PayPal Billing Service <invoicing@paypa1-bill-receipts.site>',
    subject: 'Receipt for Order #GK-49102 ($499.00 USD Deducted)',
    body: `Dear Customer,

Thank you for renewing your annual subscription with Geek Squad Total Tech Care.

Amount Charged: $499.00 USD
Payment Method: Auto-Debit from Linked Checking Account
Transaction Date: Today

If you did not authorize this charge, do NOT reply to this email. Call our 24/7 Fraud Dispute Hotline immediately to reverse the charge:
+1 (888) 555-0199

Cancellation link: http://dispute-geeksquad-billing.site/cancel`,
    scanTarget: 'http://dispute-geeksquad-billing.site/cancel',
    hotspots: [
      {
        element: 'High Unauthorized Charge',
        highlight: '$499.00 USD Deducted',
        trigger: 'Loss Aversion',
        explanation: 'The sudden appearance of an unexpected large expense provokes immediate anxiety, prompting victims to call without thinking.'
      },
      {
        element: 'Fake Dispute Hotline',
        highlight: '+1 (888) 555-0199',
        trigger: 'Voice Phishing (Vishing) Bridge',
        explanation: 'Directs the victim to a fraudulent call center where scammers instruct them to install remote-desktop software (AnyDesk, TeamViewer).'
      }
    ]
  },
  {
    id: 'ceo-wire',
    title: 'Executive BEC Wire Transfer Request',
    category: 'Business Email Compromise',
    vector: 'email',
    psychTrigger: 'Authority & Secrecy',
    sender: 'Arthur Pendelton (CEO) <ceo-office@corporate-holding-executive.work>',
    subject: 'Strictly Confidential - Immediate Acquisition Escrow Wire',
    body: `Hi Finance,

I am currently in an offsite executive board meeting finalizing an acquisition and cannot take mobile calls.

We need a confidential wire transfer of $185,000 processed before 4:00 PM cutoff today.

Reply directly to this email and I will send the recipient IBAN details. Do not discuss this with others as NDAs are in effect.

Arthur Pendelton
Chief Executive Officer`,
    scanTarget: 'ceo-office@corporate-holding-executive.work',
    hotspots: [
      {
        element: 'Display Name Spoof',
        highlight: 'Arthur Pendelton (CEO)',
        trigger: 'Authority Bias',
        explanation: 'Employees naturally hesitate to question or delay requests from senior executives.'
      },
      {
        element: 'Call Suppression',
        highlight: 'cannot take mobile calls',
        trigger: 'Channel Severance',
        explanation: 'Preemptively forbids out-of-band verification (such as calling the real CEO on their known cell phone).'
      },
      {
        element: 'Enforced Secrecy',
        highlight: 'Do not discuss this with others',
        trigger: 'Social Isolation',
        explanation: 'Prevents the finance employee from consulting coworkers or standard internal control sign-offs.'
      }
    ]
  }
];

export const AttackSimulator = ({ onInspectTarget }) => {
  const [selectedId, setSelectedId] = useState('m365-urgent');
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const currentAttack = ATTACK_ARCHETYPES.find(a => a.id === selectedId) || ATTACK_ARCHETYPES[0];

  return (
    <div className="space-y-6">
      {/* Header glass card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-cyan-400 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>Social Engineering Anatomy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Phishing Attack & Psychology Simulator
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Deconstruct real-world phishing lures. Click on the interactive elements to uncover the psychological manipulation techniques (Urgency, Authority, Fear, Greed) used to exploit human behavior.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onInspectTarget && currentAttack.scanTarget && (
              <button
                onClick={() => onInspectTarget(currentAttack.scanTarget)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Scan Attack in Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Archetype Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ATTACK_ARCHETYPES.map((attack) => (
            <button
              key={attack.id}
              onClick={() => {
                setSelectedId(attack.id);
                setSelectedHotspot(null);
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedId === attack.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{attack.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Realistic Deconstructed Message Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-white/10">
            {/* Header info */}
            <div className="bg-slate-100/90 dark:bg-slate-900/90 p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 uppercase font-mono font-bold text-[10px]">
                  {currentAttack.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Trigger:</span>
                <span className="text-sky-700 dark:text-cyan-300 font-semibold">{currentAttack.psychTrigger}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono uppercase">
                Vector: {currentAttack.vector}
              </span>
            </div>

            {/* Email / SMS Canvas */}
            <div className="p-6 bg-slate-50/70 dark:bg-slate-950/60 font-sans space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5 pb-4 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                <div className="flex">
                  <span className="w-16 text-slate-500 font-semibold">From:</span>
                  <span className="font-mono text-sky-700 dark:text-cyan-300 break-all">{currentAttack.sender}</span>
                </div>
                <div className="flex">
                  <span className="w-16 text-slate-500 font-semibold">Subject:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentAttack.subject}</span>
                </div>
              </div>

              {/* Body */}
              <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-mono text-xs bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                {currentAttack.body}
              </div>
            </div>

            {/* Hotspot buttons */}
            <div className="p-4 bg-slate-100/90 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Click an anomaly hotspot to deconstruct manipulation tactic:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentAttack.hotspots.map((spot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedHotspot(spot)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedHotspot?.element === spot.element
                        ? 'bg-amber-100 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-400/50 shadow-sm'
                        : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{spot.element}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deconstructive Analysis Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
              <span>Anatomy of Psychological Manipulation</span>
            </h3>

            {selectedHotspot ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl glass-card border border-amber-200 dark:border-amber-500/30 space-y-2 bg-amber-50/40 dark:bg-transparent">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 font-mono">
                      {selectedHotspot.element}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 font-semibold">
                      {selectedHotspot.trigger}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-950/70 p-2.5 rounded border border-slate-200 dark:border-white/5 break-all">
                    "{selectedHotspot.highlight}"
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                    {selectedHotspot.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center space-y-3 glass-card rounded-xl border-dashed">
                <HelpCircle className="w-8 h-8 text-slate-400" />
                <span>Select any anomaly hotspot on the left to see why victims fall for this specific trick.</span>
              </div>
            )}

            {/* Core Anti-Phishing Defense Principle */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-800 dark:text-slate-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>The Golden Rule of Defense</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Whenever an email, text, or alert demands immediate action under threat of penalty or loss, <strong>step away from the message</strong>. Never click links or call provided numbers. Always navigate independently through your official bookmark or verified app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
