import React, { useState } from 'react';
import { generateLookalikes } from '../../services/lookalikeGenerator';
import {
  Sparkles,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Download,
  Layers,
  ArrowRight
} from 'lucide-react';

const QUICK_DOMAINS = [
  'paypal.com',
  'google.com',
  'microsoft.com',
  'apple.com',
  'netflix.com',
  'chase.com'
];

export const LookalikeStudio = ({ onScanDomain }) => {
  const [inputDomain, setInputDomain] = useState('paypal.com');
  const [results, setResults] = useState(() => generateLookalikes('paypal.com'));
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const handleGenerate = (domainToUse) => {
    const target = domainToUse || inputDomain;
    if (!target.trim()) return;
    const generated = generateLookalikes(target);
    setResults(generated);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportList = () => {
    const content = results.map(r => `${r.domain},${r.type},${r.risk},${r.description}`).join('\n');
    const blob = new Blob([`Domain,Attack Type,Risk,Description\n${content}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lookalike-domains-${inputDomain.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'homoglyph') return r.type.includes('Homoglyph');
    if (filter === 'combosquat') return r.type.includes('Combosquatting');
    if (filter === 'tld') return r.type.includes('TLD');
    if (filter === 'typo') return r.type.includes('Typosquat');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header glass card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-cyan-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Domain Impersonation Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Lookalike & Typosquat Studio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Generate and preemptively uncover deceptive domains, homoglyph visual lookalikes, and combosquats that threat actors can weaponize against your brand or users.
            </p>
          </div>

          {results.length > 0 && (
            <button
              onClick={handleExportList}
              className="self-start md:self-center flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Export SOC Watchlist (CSV)</span>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="mt-6 flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              placeholder="Enter legitimate domain or brand (e.g. chase.com, google.com)"
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Lookalikes</span>
          </button>
        </form>

        {/* Quick Brands */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quick benchmarks:</span>
          {QUICK_DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => {
                setInputDomain(domain);
                handleGenerate(domain);
              }}
              className="px-2.5 py-1 rounded-lg glass-card text-xs text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 font-mono transition-colors cursor-pointer"
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
          {[
            { id: 'all', label: `All Lookalikes (${results.length})` },
            { id: 'homoglyph', label: 'Homoglyphs / IDN' },
            { id: 'combosquat', label: 'Combosquatting' },
            { id: 'tld', label: 'High-Risk TLDs' },
            { id: 'typo', label: 'Typosquats' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-white dark:bg-sky-500/20 text-sky-700 dark:text-cyan-300 shadow-sm border border-slate-200/80 dark:border-cyan-400/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-mono text-sky-600 dark:text-cyan-300 font-bold">{filteredResults.length}</span> spoof candidates
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-xl p-4 flex flex-col justify-between space-y-3 relative group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  item.risk === 'critical'
                    ? 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
                    : item.risk === 'high'
                    ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                    : 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-cyan-400 border-sky-200 dark:border-sky-500/30'
                }`}>
                  {item.risk} risk
                </span>

                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {item.type}
                </span>
              </div>

              <div className="text-base font-bold font-mono text-slate-900 dark:text-white tracking-wide break-all pt-1">
                {item.domain}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(item.domain, item.id)}
                className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-1 cursor-pointer"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Domain</span>
                  </>
                )}
              </button>

              {onScanDomain && (
                <button
                  onClick={() => onScanDomain(item.domain)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-cyan-500/15 hover:bg-sky-100 dark:hover:bg-cyan-500/25 text-sky-700 dark:text-cyan-300 text-xs font-semibold border border-sky-200 dark:border-cyan-500/30 transition-all cursor-pointer"
                >
                  <span>Scan Vector</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
