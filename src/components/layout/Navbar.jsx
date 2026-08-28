import React from 'react';
import { Shield, Radar, GraduationCap, FileText, Settings, Volume2, VolumeX, Terminal, ShieldCheck } from 'lucide-react';
import { setAudioMuted } from '../../utils/audioEffects';

export const Navbar = ({
  activeTab,
  setActiveTab,
  muted,
  setMuted,
  totalScans,
}) => {
  const toggleSound = () => {
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  };

  const navItems = [
    { id: 'scanner', label: 'Threat Scanner', icon: Shield },
    { id: 'radar', label: 'Threat Radar', icon: Radar },
    { id: 'academy', label: 'Cyber Academy', icon: GraduationCap },
    { id: 'response', label: 'Incident Response', icon: FileText },
    { id: 'settings', label: 'API & Config', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-cyan-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('scanner')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400">
                  PHISHGUARD
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  v3.4 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                <span>Multi-Vector Cyber Defense AI</span>
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40 border border-cyan-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-3">
            {/* Total Scans Counter */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 font-mono">Scans:</span>
              <span className="text-cyan-300 font-mono font-bold">{totalScans}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={muted ? 'Unmute Cyber SFX' : 'Mute Cyber SFX'}
              className={`p-2 rounded-lg border transition-all ${
                muted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-cyan-950/60 border-cyan-800/50 text-cyan-400 shadow-sm shadow-cyan-500/20'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
