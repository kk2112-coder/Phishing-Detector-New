import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  Printer,
  Download,
  RotateCcw,
  ExternalLink,
  Lock,
  CreditCard,
  Key,
  FileDown
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'clicked_only',
    icon: ExternalLink,
    title: 'Clicked Link Only',
    desc: 'Visited the site, but closed the tab without entering credentials or personal info.',
    severity: 'low',
    steps: [
      { id: 'c1', text: 'Clear browser cookies and cached site data for the last 24 hours.' },
      { id: 'c2', text: 'Ensure your web browser and operating system have the latest security updates installed.' },
      { id: 'c3', text: 'Verify that no unauthorized files or browser extensions were automatically downloaded.' },
      { id: 'c4', text: 'Run a standard antimalware scan (Windows Defender or trusted antivirus) to ensure drive-by download exploits did not trigger.' }
    ]
  },
  {
    id: 'entered_password',
    icon: Key,
    title: 'Entered Username & Password',
    desc: 'Submitted account password on the fraudulent page.',
    severity: 'critical',
    steps: [
      { id: 'p1', text: 'IMMEDIATELY navigate to the official, verified website directly and change your password.' },
      { id: 'p2', text: 'If you reuse this password on ANY other service (email, banking, shopping), change those passwords right away.' },
      { id: 'p3', text: 'Log out of all active sessions across all devices in the account security settings ("Sign out of all sessions").' },
      { id: 'p4', text: 'Enable Multi-Factor Authentication (MFA/2FA) using an Authenticator App (Google Authenticator, Microsoft Authenticator) or Passkey.' },
      { id: 'p5', text: 'Review account recovery emails and phone numbers to ensure the attacker didn\'t add their own backup email.' }
    ]
  },
  {
    id: 'entered_2fa',
    icon: Lock,
    title: 'Gave MFA / 2FA SMS Code',
    desc: 'Interacted with an Adversary-in-the-Middle (AiTM) kit and provided live one-time passcode.',
    severity: 'critical',
    steps: [
      { id: 'm1', text: 'Immediately revoke all active session tokens and trusted devices from the official account dashboard.' },
      { id: 'm2', text: 'Change your account password immediately.' },
      { id: 'm3', text: 'Check recent account login history for unfamiliar IP addresses, browsers, or geographic regions.' },
      { id: 'm4', text: 'Switch 2FA method away from SMS text codes to Hardware Security Keys (YubiKey) or FIDO2 Passkeys.' }
    ]
  },
  {
    id: 'entered_financial',
    icon: CreditCard,
    title: 'Entered Credit Card or Bank Details',
    desc: 'Submitted card numbers, expiration, CVV, or bank routing information.',
    severity: 'critical',
    steps: [
      { id: 'f1', text: 'Immediately call your bank or card issuer\'s official fraud department (number on the physical back of your card).' },
      { id: 'f2', text: 'Request an immediate card freeze and reissue of a replacement card with a new number and CVV.' },
      { id: 'f3', text: 'Review bank and credit transactions daily for unauthorized charges or micro-verification debits ($0.01 to $1.99).' },
      { id: 'f4', text: 'Place a free Fraud Alert or Credit Freeze with the major credit bureaus (Equifax, Experian, TransUnion).' }
    ]
  },
  {
    id: 'downloaded_file',
    icon: FileDown,
    title: 'Downloaded or Executed a File',
    desc: 'Downloaded an attachment, macro-enabled document, ZIP archive, or executable.',
    severity: 'critical',
    steps: [
      { id: 'd1', text: 'Immediately disconnect your computer from Wi-Fi and unplug the Ethernet network cable to sever command & control beaconing.' },
      { id: 'd2', text: 'Do NOT open or execute the downloaded file. Delete it from your Downloads folder and empty your Recycle Bin.' },
      { id: 'd3', text: 'Run a full offline antimalware scan (e.g. Microsoft Defender Offline Scan or bootable USB scanner).' },
      { id: 'd4', text: 'If on a corporate device, notify your IT Security / SOC department immediately.' }
    ]
  }
];

export const EmergencyTriage = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState('entered_password');
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('phishguard_triage_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const toggleStep = (stepId) => {
    const updated = { ...completedSteps, [stepId]: !completedSteps[stepId] };
    setCompletedSteps(updated);
    localStorage.setItem('phishguard_triage_progress', JSON.stringify(updated));
  };

  const handleResetChecklist = () => {
    setCompletedSteps({});
    localStorage.removeItem('phishguard_triage_progress');
  };

  const completedCount = scenario.steps.filter(s => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / scenario.steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header glass card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/30 text-rose-700 dark:text-red-400 text-xs font-semibold">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Interactive Incident Containment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Emergency Phishing Response Triage
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              "I clicked a suspicious link or entered information - what do I do right now?" Follow this tailored step-by-step checklist to contain the damage and safeguard your accounts.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Print Checklist</span>
            </button>
            <button
              onClick={handleResetChecklist}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl glass-card text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-300 transition-all cursor-pointer"
              title="Reset Checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Step 1: Select Exposure Type */}
        <div className="mt-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Step 1: Select what information or action took place:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {SCENARIOS.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedScenarioId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-cyan-500/20 border-sky-400 dark:border-cyan-400/50 shadow-sm'
                      : 'glass-card border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-sky-600 dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                      s.severity === 'critical' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {s.severity}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">{s.title}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">{s.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Checklist & Containment Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Checkable Action Plan */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span>Immediate Action Plan: {scenario.title}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Complete each step in sequence to isolate and secure your credentials.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-cyan-300">
                  {completedCount}/{scenario.steps.length} Steps
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{progressPercent}% complete</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-3 pt-2">
              {scenario.steps.map((step, index) => {
                const isChecked = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-xl border transition-all flex items-start space-x-3.5 cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                        : 'glass-card hover:border-sky-400 dark:hover:border-cyan-400/40'
                    }`}
                  >
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-sky-600 border-slate-300 dark:border-slate-700 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-cyan-400">
                          STEP {index + 1}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100 font-medium'
                      }`}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Reporting & Legal Contacts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center space-x-2">
              <LifeBuoy className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Official Phishing Report Centers</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Report the malicious domain or sender to national fraud agencies and cybersecurity working groups to protect others:
            </p>

            <div className="space-y-2 text-xs">
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass-card flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">FTC Fraud Reporting</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Federal Trade Commission</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass-card flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">FBI IC3 Division</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Internet Crime Complaint Center</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://safebrowsing.google.com/safebrowsing/report_phish/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass-card flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Google Safe Browsing</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Block in Chrome & Firefox</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://apwg.org/reportphishing/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass-card flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">APWG Database</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Anti-Phishing Working Group</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
