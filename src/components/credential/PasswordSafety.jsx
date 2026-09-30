import React, { useState } from 'react';
import { evaluatePasswordSafety } from '../../services/passwordPhishChecker';
import {
  KeyRound,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Cpu,
  Info
} from 'lucide-react';

const SAMPLE_PASSWORDS = [
  { label: 'Common Phished Pattern', val: 'Summer2026!' },
  { label: 'Keyboard Walk', val: 'qwerty123456' },
  { label: 'Short & Simple', val: 'charlie9' },
  { label: 'Strong Passphrase', val: 'solar-falcon-orbit-99$secure' },
  { label: 'High-Entropy Random', val: 'k8#P!mZ92$wQ1^xL' }
];

export const PasswordSafety = () => {
  const [password, setPassword] = useState('Summer2026!');
  const [showPassword, setShowPassword] = useState(false);

  const analysis = evaluatePasswordSafety(password);

  const getScoreColor = () => {
    if (analysis.score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10';
    if (analysis.score >= 55) return 'text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-50 dark:bg-sky-500/10';
    if (analysis.score >= 35) return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10';
    return 'text-red-600 dark:text-red-400 border-red-500/30 bg-red-50 dark:bg-red-500/10';
  };

  const getProgressBarColor = () => {
    if (analysis.score >= 80) return 'from-emerald-500 to-teal-400';
    if (analysis.score >= 55) return 'from-sky-500 to-cyan-400';
    if (analysis.score >= 35) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Header glass card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-cyan-400 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Zero-Transmission Credential Safety</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Credential Phish-Check & Strength Lab
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Test how easily a password is intercepted, brute-forced, or cracked via automated phishing kits, rainbow tables, and credential-stuffing databases. Evaluated 100% locally in your browser.
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl glass-card text-center border border-slate-200 dark:border-white/10 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">Privacy Guarantee</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 justify-center mt-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Only</span>
            </span>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or passphrase to inspect..."
              className="glass-input w-full pl-10 pr-12 py-3.5 rounded-xl text-sm font-mono outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Test sample patterns:</span>
            {SAMPLE_PASSWORDS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => setPassword(sample.val)}
                className="px-2.5 py-1 rounded-lg glass-card text-xs text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 font-mono transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Score & Crack Time */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 ${getScoreColor()}`}>
              <span className="text-3xl font-extrabold font-mono">{analysis.score}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">/ 100</span>
            </div>

            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{analysis.label}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Resistance to automated phishing dumps</p>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressBarColor()} transition-all duration-500`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>

            <div className="w-full pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-3 text-left">
              <div className="glass-card p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">Crack Time</span>
                <span className="text-xs font-semibold font-mono text-sky-600 dark:text-cyan-300 block truncate mt-0.5">
                  {analysis.crackTime}
                </span>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">Entropy</span>
                <span className="text-xs font-semibold font-mono text-indigo-600 dark:text-indigo-300 block mt-0.5">
                  ~{analysis.entropy} bits
                </span>
              </div>
            </div>
          </div>

          {/* Character Diversity Checklist */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Entropy Building Blocks
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Lowercase letters (a-z)</span>
                <span className={analysis.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                  {analysis.hasLower ? '✓ Included' : '✗ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Uppercase letters (A-Z)</span>
                <span className={analysis.hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                  {analysis.hasUpper ? '✓ Included' : '✗ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Numbers (0-9)</span>
                <span className={analysis.hasDigits ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                  {analysis.hasDigits ? '✓ Included' : '✗ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Special symbols (!@#$)</span>
                <span className={analysis.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                  {analysis.hasSpecial ? '✓ Included' : '✗ Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Phishing Vulnerabilities & Modern Defense Tips */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vulnerabilities detected */}
          {analysis.vulnerabilities.length > 0 && (
            <div className="rounded-2xl p-6 border border-red-200 dark:border-red-500/20 bg-red-50/70 dark:bg-red-950/20 space-y-3">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Detected Phishing & Stuffing Weaknesses</span>
              </div>
              <div className="space-y-2">
                {analysis.vulnerabilities.map((vuln, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{vuln}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How Phishing Bypasses Passwords */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Info className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>How Phishing Attacks Harvest Credentials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="glass-card p-4 rounded-xl space-y-2">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>AiTM (Adversary-in-the-Middle)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Modern phishing toolkits (like Evilginx) act as proxy servers between the victim and the legitimate service. When you enter your password and 2FA code, the attacker captures your live session cookies, bypassing passwords completely.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl space-y-2">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                  <span>Credential Stuffing Botnets</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Once a password is phished on an unverified site, automated bots test that identical email/password combination across hundreds of high-value services (banking, email, crypto, shopping) within seconds.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Gold Standard Defense: Passkeys & FIDO2 WebAuthn</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Passkeys bind cryptographic keys directly to the browser's verified domain origin. Even if a user visits a fake lookalike page (like <code>paypa1-security.xyz</code>), the browser strictly refuses to provide the passkey credentials, making phishing mathematically impossible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
