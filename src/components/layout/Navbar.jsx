import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  Radar,
  GraduationCap,
  FileText,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Menu,
  X,
  Terminal,
  Layers,
  Brain,
  KeyRound,
  LifeBuoy
} from 'lucide-react';
import { setAudioMuted } from '../../utils/audioEffects';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({
  activeTab,
  setActiveTab,
  muted,
  setMuted,
  totalScans,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  };

  const navItems = [
    { id: 'scanner', label: 'Scanner', icon: Shield },
    { id: 'lookalike', label: 'Lookalike Studio', icon: Layers },
    { id: 'simulator', label: 'Simulator', icon: Brain },
    { id: 'credentials', label: 'Password Lab', icon: KeyRound },
    { id: 'radar', label: 'Radar', icon: Radar },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'triage', label: 'Triage', icon: LifeBuoy },
    { id: 'response', label: 'Incident Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleTabSelect('scanner')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleTabSelect('scanner')}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 p-0.5 shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/35 transition-all">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-cyan-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  PhishGuard<span className="text-sky-600 dark:text-cyan-400"> AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-cyan-300 border border-sky-500/20 dark:border-cyan-500/30">
                  AI DEFENSE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Multi-Vector Phishing & Fraud Detector
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-sky-500/20 text-sky-600 dark:text-cyan-300 shadow-sm border border-slate-200/80 dark:border-cyan-400/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600 dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions (Theme, Sound, Scans Counter, Mobile Menu) */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Total Scans Counter */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl glass-card text-xs">
              <Terminal className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
              <span className="text-slate-500 dark:text-slate-400">Scans:</span>
              <span className="text-slate-900 dark:text-cyan-300 font-mono font-bold">{totalScans}</span>
            </div>

            {/* Global Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl glass-card text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center border border-slate-200 dark:border-slate-700/80"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 scale-100" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              aria-label={muted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
              title={muted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
              className={`p-2 rounded-xl glass-card transition-all cursor-pointer flex items-center justify-center border border-slate-200 dark:border-slate-700/80 ${
                muted
                  ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  : 'text-sky-600 dark:text-cyan-400'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="xl:hidden p-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-200 dark:border-slate-700/80"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick-Scroll Bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 space-x-1.5 border-t border-slate-200 dark:border-white/5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 dark:bg-cyan-500/20 text-white dark:text-cyan-300 shadow-sm border border-sky-600 dark:border-cyan-400/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-slate-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Expanded Drawer Modal */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer border ${
                      isActive
                        ? 'bg-sky-50 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-300 border-sky-300 dark:border-cyan-400/40'
                        : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600 dark:text-cyan-300' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
