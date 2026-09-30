import React, { useState } from 'react';
import { Settings, Key, Volume2, VolumeX, ShieldCheck, Database, Check, Plus, Trash2, Sun, Moon } from 'lucide-react';
import { setAudioMuted } from '../../utils/audioEffects';
import { useTheme } from '../../context/ThemeContext';

export const ApiSettings = ({ muted, setMuted }) => {
  const { setTheme, isDark } = useTheme();
  const [vtKey, setVtKey] = useState(() => localStorage.getItem('phishguard_vt_key') || '');
  const [gsbKey, setGsbKey] = useState(() => localStorage.getItem('phishguard_gsb_key') || '');
  const [urlScanKey, setUrlScanKey] = useState(() => localStorage.getItem('phishguard_urlscan_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [whitelist, setWhitelist] = useState(() => {
    try {
      const saved = localStorage.getItem('phishguard_whitelist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['google.com', 'microsoft.com', 'github.com', 'apple.com', 'paypal.com'];
  });
  const [newWhiteDomain, setNewWhiteDomain] = useState('');

  const [blacklist, setBlacklist] = useState(() => {
    try {
      const saved = localStorage.getItem('phishguard_blacklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['malware-traffic-analysis.net', 'evil-phish-kit.xyz', 'crypto-drain-seed.top'];
  });
  const [newBlackDomain, setNewBlackDomain] = useState('');

  const handleSaveKeys = () => {
    localStorage.setItem('phishguard_vt_key', vtKey);
    localStorage.setItem('phishguard_gsb_key', gsbKey);
    localStorage.setItem('phishguard_urlscan_key', urlScanKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const addWhitelistDomain = () => {
    if (!newWhiteDomain.trim()) return;
    const clean = newWhiteDomain.toLowerCase().trim();
    if (!whitelist.includes(clean)) {
      const updated = [...whitelist, clean];
      setWhitelist(updated);
      localStorage.setItem('phishguard_whitelist', JSON.stringify(updated));
    }
    setNewWhiteDomain('');
  };

  const removeWhitelistDomain = (domain) => {
    const updated = whitelist.filter((d) => d !== domain);
    setWhitelist(updated);
    localStorage.setItem('phishguard_whitelist', JSON.stringify(updated));
  };

  const addBlacklistDomain = () => {
    if (!newBlackDomain.trim()) return;
    const clean = newBlackDomain.toLowerCase().trim();
    if (!blacklist.includes(clean)) {
      const updated = [...blacklist, clean];
      setBlacklist(updated);
      localStorage.setItem('phishguard_blacklist', JSON.stringify(updated));
    }
    setNewBlackDomain('');
  };

  const removeBlacklistDomain = (domain) => {
    const updated = blacklist.filter((d) => d !== domain);
    setBlacklist(updated);
    localStorage.setItem('phishguard_blacklist', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Security Engine & UI Configuration
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Configure global theme preference, audio triggers, custom threat domain lists, and optional intelligence API keys
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Global Theme & Audio Preferences */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
          <Sun className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>Appearance & Tactile Audio Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme Selector Card */}
          <div className="p-4 rounded-xl glass-card space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Theme Mode</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose your preferred interface theme
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                  !isDark
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                  isDark
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'glass-card text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Sound Toggle Card */}
          <div className="p-4 rounded-xl glass-card space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Audio Sound Effects</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Synthesize subtle radar sweeps and danger alert sound effects
              </span>
            </div>

            <button
              onClick={() => {
                const next = !muted;
                setAudioMuted(next);
                setMuted(next);
              }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-all border ${
                !muted
                  ? 'bg-sky-50 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-300 border-sky-200 dark:border-cyan-400/40 shadow-sm'
                  : 'glass-card text-slate-500'
              }`}
            >
              {!muted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{!muted ? 'Sound Effects Active' : 'Sound Effects Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* External Intelligence API Keys */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
          <Key className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>External Threat Intelligence APIs (Optional)</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          PhishGuard AI includes an advanced built-in offline heuristic & NLP engine that runs locally with zero configuration. You may optionally supply your own free or enterprise API keys below for federated threat verification.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              VirusTotal API Key
            </label>
            <input
              type="password"
              value={vtKey}
              onChange={(e) => setVtKey(e.target.value)}
              placeholder="Enter your VirusTotal v3 API key..."
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Google Safe Browsing API Key
            </label>
            <input
              type="password"
              value={gsbKey}
              onChange={(e) => setGsbKey(e.target.value)}
              placeholder="Enter your Google Safe Browsing API key..."
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              urlscan.io API Key
            </label>
            <input
              type="password"
              value={urlScanKey}
              onChange={(e) => setUrlScanKey(e.target.value)}
              placeholder="Enter your urlscan.io API key..."
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveKeys}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Save API Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Whitelist & Blacklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted Domain Whitelist</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newWhiteDomain}
              onChange={(e) => setNewWhiteDomain(e.target.value)}
              placeholder="e.g. yourcompany.com"
              className="glass-input flex-1 px-3 py-1.5 rounded-xl text-xs font-mono outline-none"
            />
            <button
              onClick={addWhitelistDomain}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {whitelist.map((d) => (
              <div key={d} className="flex items-center justify-between p-2 rounded-lg glass-card text-xs font-mono text-slate-800 dark:text-slate-200">
                <span>{d}</span>
                <button
                  onClick={() => removeWhitelistDomain(d)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Custom Threat Blacklist</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBlackDomain}
              onChange={(e) => setNewBlackDomain(e.target.value)}
              placeholder="e.g. known-phish.xyz"
              className="glass-input flex-1 px-3 py-1.5 rounded-xl text-xs font-mono outline-none"
            />
            <button
              onClick={addBlacklistDomain}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {blacklist.map((d) => (
              <div key={d} className="flex items-center justify-between p-2 rounded-lg glass-card text-xs font-mono text-slate-800 dark:text-slate-200">
                <span>{d}</span>
                <button
                  onClick={() => removeBlacklistDomain(d)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
