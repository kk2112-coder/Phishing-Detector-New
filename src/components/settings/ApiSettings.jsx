import React, { useState, useEffect } from 'react';
import { Settings, Key, Volume2, VolumeX, ShieldCheck, Database, Check, Plus, Trash2 } from 'lucide-react';
import { setAudioMuted } from '../../utils/audioEffects';

export const ApiSettings = ({ muted, setMuted }) => {
  const [vtKey, setVtKey] = useState('');
  const [gsbKey, setGsbKey] = useState('');
  const [urlScanKey, setUrlScanKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [whitelist, setWhitelist] = useState(['google.com', 'microsoft.com', 'github.com', 'apple.com', 'paypal.com']);
  const [newWhiteDomain, setNewWhiteDomain] = useState('');

  const [blacklist, setBlacklist] = useState(['malware-traffic-analysis.net', 'evil-phish-kit.xyz', 'crypto-drain-seed.top']);
  const [newBlackDomain, setNewBlackDomain] = useState('');

  useEffect(() => {
    const savedVt = localStorage.getItem('phishguard_vt_key') || '';
    const savedGsb = localStorage.getItem('phishguard_gsb_key') || '';
    const savedUrlScan = localStorage.getItem('phishguard_urlscan_key') || '';
    setVtKey(savedVt);
    setGsbKey(savedGsb);
    setUrlScanKey(savedUrlScan);

    const savedWhite = localStorage.getItem('phishguard_whitelist');
    if (savedWhite) {
      try { setWhitelist(JSON.parse(savedWhite)); } catch {}
    }
    const savedBlack = localStorage.getItem('phishguard_blacklist');
    if (savedBlack) {
      try { setBlacklist(JSON.parse(savedBlack)); } catch {}
    }
  }, []);

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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Security Engine & API Integrations
            </h2>
            <p className="text-xs text-slate-400">
              Configure threat intelligence provider keys, sound triggers, and custom domain access lists
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* External Intelligence API Keys */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>External Threat Intelligence APIs (Optional)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          PhishGuard AI includes an advanced built-in offline heuristic & NLP engine that runs locally with zero configuration. You may optionally supply your own free or enterprise API keys below for federated threat verification.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              VirusTotal API Key:
            </label>
            <input
              type="password"
              value={vtKey}
              onChange={(e) => setVtKey(e.target.value)}
              placeholder="Enter your VirusTotal v3 API key..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Google Safe Browsing API Key:
            </label>
            <input
              type="password"
              value={gsbKey}
              onChange={(e) => setGsbKey(e.target.value)}
              placeholder="Enter your Google Safe Browsing API key..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              urlscan.io API Key:
            </label>
            <input
              type="password"
              value={urlScanKey}
              onChange={(e) => setUrlScanKey(e.target.value)}
              placeholder="Enter your urlscan.io API key..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveKeys}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
            >
              Save API Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Audio SFX & Engine Toggles */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Tactical Audio & UI Preferences</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Web Audio Cyber Sound Effects</span>
            <span className="text-[11px] text-slate-400">Synthesize futuristic radar sweep, danger alarm, and quiz chimes</span>
          </div>

          <button
            onClick={() => {
              const next = !muted;
              setAudioMuted(next);
              setMuted(next);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors ${
              !muted
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {!muted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{!muted ? 'Enabled' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Whitelist & Blacklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted Domain Whitelist</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newWhiteDomain}
              onChange={(e) => setNewWhiteDomain(e.target.value)}
              placeholder="e.g. yourcompany.com"
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 outline-none focus:border-emerald-500"
            />
            <button
              onClick={addWhitelistDomain}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {whitelist.map((d) => (
              <div key={d} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <span>{d}</span>
                <button
                  onClick={() => removeWhitelistDomain(d)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Custom Threat Blacklist</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBlackDomain}
              onChange={(e) => setNewBlackDomain(e.target.value)}
              placeholder="e.g. known-phish.xyz"
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 outline-none focus:border-red-500"
            />
            <button
              onClick={addBlacklistDomain}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {blacklist.map((d) => (
              <div key={d} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <span>{d}</span>
                <button
                  onClick={() => removeBlacklistDomain(d)}
                  className="text-slate-500 hover:text-red-400"
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
