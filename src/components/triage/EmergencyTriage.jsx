import React, { useState } from 'react';
import {
  LifeBuoy,
  Printer,
  RotateCcw,
  ExternalLink,
  Lock,
  CreditCard,
  Key,
  FileDown,
  ShieldAlert,
  CheckCircle2
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
    title: 'Entered Password',
    desc: 'Submitted account password on the fraudulent page.',
    severity: 'critical',
    steps: [
      { id: 'p1', text: 'IMMEDIATELY navigate to the official website directly and change your password.' },
      { id: 'p2', text: 'If you reuse this password on ANY other service (email, banking, shopping), change those passwords right away.' },
      { id: 'p3', text: 'Log out of all active sessions across all devices in the account security settings ("Sign out of all sessions").' },
      { id: 'p4', text: 'Enable Multi-Factor Authentication (MFA/2FA) using an Authenticator App (Google Authenticator, Microsoft Authenticator) or Passkey.' },
      { id: 'p5', text: 'Review account recovery emails and phone numbers to ensure the attacker did not add their own backup email.' }
    ]
  },
  {
    id: 'entered_2fa',
    icon: Lock,
    title: 'Gave 2FA / SMS Code',
    desc: 'Provided a live one-time SMS verification passcode.',
    severity: 'critical',
    steps: [
      { id: 'm1', text: 'Immediately revoke all active session tokens and trusted devices from the official account dashboard.' },
      { id: 'm2', text: 'Change your account password immediately.' },
      { id: 'm3', text: 'Check recent account login history for unfamiliar IP addresses, browsers, or geographic regions.' },
      { id: 'm4', text: 'Switch 2FA method away from SMS text codes to Authenticator Apps, Hardware Security Keys (YubiKey), or Passkeys.' }
    ]
  },
  {
    id: 'entered_financial',
    icon: CreditCard,
    title: 'Entered Card / Banking',
    desc: 'Submitted card numbers, expiration, CVV, or bank details.',
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
    title: 'Downloaded a File',
    desc: 'Downloaded an attachment, macro document, ZIP archive, or installer.',
    severity: 'critical',
    steps: [
      { id: 'd1', text: 'Immediately disconnect your computer from Wi-Fi and unplug network cables to sever potential malware connection.' },
      { id: 'd2', text: 'Do NOT open or execute the downloaded file. Delete it from your Downloads folder and empty your Recycle Bin.' },
      { id: 'd3', text: 'Run a full offline antimalware scan (e.g. Microsoft Defender Offline Scan or bootable USB scanner).' },
      { id: 'd4', text: 'If on a corporate device, notify your IT Security department immediately.' }
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
    try {
      localStorage.setItem('phishguard_triage_progress', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetChecklist = () => {
    setCompletedSteps({});
    localStorage.removeItem('phishguard_triage_progress');
  };

  const completedCount = scenario.steps.filter(s => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / scenario.steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="clean-card rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Incident Response Guide</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              What To Do If You Were Phished
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Select what happened below to get an actionable step-by-step checklist to secure your accounts.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleResetChecklist}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Scenario Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {SCENARIOS.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedScenarioId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`p-3.5 rounded-xl text-left transition-colors flex flex-col justify-between space-y-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${
                    s.severity === 'critical'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {s.severity}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white block">{s.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">{s.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Plan & Official Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Action Plan */}
        <div className="lg:col-span-8 clean-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Action Plan: {scenario.title}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Check off each step as you complete it
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {completedCount} of {scenario.steps.length} completed
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="space-y-2.5 pt-1">
            {scenario.steps.map((step, index) => {
              const isChecked = !!completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-3.5 rounded-xl border transition-colors flex items-start space-x-3 cursor-pointer select-none ${
                    isChecked
                      ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/80 opacity-75'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 rounded mt-0.5 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-0 cursor-pointer"
                  />

                  <div className="space-y-0.5 flex-1">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                      Step {index + 1}
                    </span>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Official Reporting Centers */}
        <div className="lg:col-span-4 clean-card rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
            Official Reporting Centers
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Report fraudulent sites and scam senders to official security and consumer protection organizations:
          </p>

          <div className="space-y-2 text-xs">
            <a
              href="https://reportfraud.ftc.gov"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
            >
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">FTC Fraud Reporting</span>
                <span className="text-[11px] text-slate-500">Federal Trade Commission</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
            >
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">FBI IC3 Division</span>
                <span className="text-[11px] text-slate-500">Internet Crime Complaint Center</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://safebrowsing.google.com/safebrowsing/report_phish/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
            >
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Google Safe Browsing</span>
                <span className="text-[11px] text-slate-500">Block in Chrome & browsers</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://apwg.org/reportphishing/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
            >
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">APWG Database</span>
                <span className="text-[11px] text-slate-500">Anti-Phishing Working Group</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
