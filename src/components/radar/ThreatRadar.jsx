import React, { useState, useEffect } from 'react';
import { Search, Play, Pause, Activity, ArrowUpRight } from 'lucide-react';
import { INITIAL_THREAT_FEED } from '../../data/threatIntelFeed';
import { ThreatStats } from './ThreatStats';

export const ThreatRadar = ({ onInspectTarget }) => {
  const [threats, setThreats] = useState(INITIAL_THREAT_FEED);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (!isLiveStreaming) return;

    const brands = ['Microsoft 365', 'PayPal', 'Netflix', 'Chase Bank', 'Google', 'MetaMask', 'DocuSign', 'Apple iCloud', 'DHL Express'];
    const tlds = ['.xyz', '.top', '.icu', '.site', '.work', '.live', '.click'];
    const types = ['credential_harvest', 'financial_fraud', 'smishing', 'qr_quishing', 'spearphishing'];
    const countries = ['US', 'RU', 'CN', 'NG', 'BR', 'RO', 'IN', 'DE', 'NL'];

    const interval = setInterval(() => {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const tld = tlds[Math.floor(Math.random() * tlds.length)];
      const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
      const type = types[Math.floor(Math.random() * types.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];

      const newThreat = {
        id: `threat-${Date.now().toString(36)}`,
        type,
        targetBrand: brand,
        domainOrPayload: `${brandSlug}-secure-login-verify${Math.floor(Math.random() * 90 + 10)}${tld}/auth`,
        originCountry: country,
        severity: 'malicious',
        detectedAt: 'Just now',
        confidenceScore: Math.floor(Math.random() * 10 + 90),
        tags: ['AiTM-Proxy', 'Automated-Lure', 'Zero-Day-Kit']
      };

      setThreats((prev) => [newThreat, ...prev.slice(0, 19)]);
    }, 7000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.targetBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.domainOrPayload.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.originCountry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || threat.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header & Global Radar Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Animated Sonar Grid */}
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center rounded-full bg-slate-900 border border-sky-500/30 overflow-hidden shadow-inner">
            <div className="absolute w-44 h-44 rounded-full border border-sky-500/20" />
            <div className="absolute w-28 h-28 rounded-full border border-sky-500/20" />
            <div className="absolute w-12 h-12 rounded-full border border-sky-500/30" />

            <div className="absolute w-full h-[1px] bg-sky-500/20" />
            <div className="absolute h-full w-[1px] bg-sky-500/20" />

            {/* Rotating Radar Sweep Cone */}
            <div className="absolute inset-0 radar-sweep">
              <div
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'linear-gradient(45deg, rgba(14, 165, 233, 0.4), transparent 75%)',
                }}
              />
            </div>

            {/* Glowing Threat Blips */}
            <span className="absolute top-12 left-16 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
            <span className="absolute top-12 left-16 w-2.5 h-2.5 rounded-full bg-red-500 shadow-md shadow-red-500" />

            <span className="absolute bottom-16 right-12 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="absolute bottom-16 right-12 w-2 h-2 rounded-full bg-amber-400" />

            <span className="absolute top-24 right-16 w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500" />
            <span className="absolute bottom-20 left-20 w-1.5 h-1.5 rounded-full bg-sky-400" />
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Active Sonar Array Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Tracking active campaign domains across 140+ countries
          </p>
        </div>

        {/* Live Threat Feed Table */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Live Global Threat Intelligence Stream
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Auto-updating feed of active phishing campaigns and credential harvesters
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isLiveStreaming
                      ? 'bg-sky-50 dark:bg-cyan-500/20 border border-sky-200 dark:border-cyan-400/40 text-sky-700 dark:text-cyan-300'
                      : 'glass-card text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isLiveStreaming ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Live Stream Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Stream Paused</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by brand, domain, or country..."
                  className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono outline-none"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto py-1">
                {['all', 'credential_harvest', 'financial_fraud', 'smishing', 'qr_quishing'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedFilter === filter
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'glass-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {filter === 'all' ? 'All Threats' : filter.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Threat Stream List */}
            <div className="mt-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredThreats.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No threats match your current search query.
                </div>
              ) : (
                filteredThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl glass-card transition-all gap-2"
                  >
                    <div className="flex items-start space-x-3 overflow-hidden">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 shrink-0 mt-0.5">
                        {threat.originCountry}
                      </span>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {threat.targetBrand}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {threat.detectedAt}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-sky-700 dark:text-cyan-300 truncate max-w-sm sm:max-w-md mt-0.5 font-medium">
                          {threat.domainOrPayload}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30">
                        {threat.confidenceScore}% conf
                      </span>
                      {onInspectTarget && (
                        <button
                          onClick={() => onInspectTarget(threat.domainOrPayload)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-cyan-500/15 hover:bg-sky-100 dark:hover:bg-cyan-500/25 text-sky-700 dark:text-cyan-300 text-xs font-semibold border border-sky-200 dark:border-cyan-500/30 transition-colors cursor-pointer"
                        >
                          <span>Analyze</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ThreatStats />
    </div>
  );
};
