import React from 'react';
import { Mail, Smartphone, Globe, QrCode, AlertTriangle, CheckCircle } from 'lucide-react';

export const ScenarioCard = ({
  scenario,
  showRedFlags,
}) => {
  if (!scenario) return null;
  const { content, category, redFlags } = scenario;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {category === 'email' && <Mail className="w-4 h-4 text-cyan-400" />}
          {category === 'sms' && <Smartphone className="w-4 h-4 text-cyan-400" />}
          {category === 'website' && <Globe className="w-4 h-4 text-cyan-400" />}
          {category === 'qr' && <QrCode className="w-4 h-4 text-cyan-400" />}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {category?.toUpperCase()} SCENARIO INSPECTION
          </span>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
          scenario.difficulty === 'easy'
            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            : scenario.difficulty === 'medium'
            ? 'bg-amber-950 text-amber-400 border border-amber-800'
            : 'bg-purple-950 text-purple-400 border border-purple-800'
        }`}>
          {scenario.difficulty} DIFFICULTY
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <p className="text-xs sm:text-sm text-slate-300 font-medium bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <strong>Scenario:</strong> {scenario.scenarioDescription}
        </p>

        {/* 1. Email Mockup */}
        {category === 'email' && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-3 font-sans">
            <div className="border-b border-slate-800 pb-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-slate-500 font-semibold w-14">From:</span>
                <span className={`font-mono ${showRedFlags && scenario.isPhishing ? 'bg-red-950/80 text-red-300 px-1 rounded border border-red-800' : 'text-slate-200'}`}>
                  {content.sender}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-slate-500 font-semibold w-14">Subject:</span>
                <span className={`font-bold ${showRedFlags && scenario.isPhishing ? 'bg-red-950/80 text-red-300 px-1 rounded border border-red-800' : 'text-white'}`}>
                  {content.subject}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-1.5 text-[11px] text-slate-500">
                <span className="w-14">Date:</span>
                <span>{content.date}</span>
              </div>
            </div>

            <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans pt-1">
              {content.body}
            </div>
          </div>
        )}

        {/* 2. SMS Mockup */}
        {category === 'sms' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="text-center border-b border-slate-800 pb-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 font-bold mx-auto flex items-center justify-center text-xs mb-1">
                SMS
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                {content.smsSender}
              </span>
            </div>

            <div className="flex justify-start">
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                showRedFlags && scenario.isPhishing
                  ? 'bg-red-950/90 text-red-200 border border-red-800'
                  : 'bg-slate-800 text-slate-100'
              }`}>
                {content.body}
              </div>
            </div>
          </div>
        )}

        {/* 3. Website Mockup */}
        {category === 'website' && content.landingPageMock && (
          <div className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center space-x-2 text-xs">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className={`flex-1 mx-2 px-3 py-1 rounded bg-slate-900 font-mono text-[11px] truncate ${
                showRedFlags && scenario.isPhishing ? 'bg-red-950 text-red-300 border border-red-800' : 'text-slate-300'
              }`}>
                🔒 {content.landingPageMock.fakeDomain}
              </div>
            </div>

            <div className="p-6 text-center space-y-4 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-white tracking-wide">
                {content.landingPageMock.title}
              </h3>
              {content.landingPageMock.countdown && (
                <div className={`p-2 rounded text-xs font-bold font-mono ${
                  showRedFlags ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400'
                }`}>
                  ⏳ {content.landingPageMock.countdown}
                </div>
              )}

              <div className="space-y-2">
                {content.landingPageMock.inputs.map((inp, i) => (
                  <input
                    key={i}
                    disabled
                    type={inp.toLowerCase().includes('password') ? 'password' : 'text'}
                    placeholder={inp}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400"
                  />
                ))}
                <button
                  disabled
                  className="w-full py-2 rounded bg-cyan-600 text-white font-bold text-xs shadow"
                >
                  {content.landingPageMock.actionBtnText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. QR Code Quishing Mockup */}
        {category === 'qr' && (
          <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 text-center space-y-3">
            <div className="p-4 inline-block bg-white rounded-xl shadow-md">
              <QrCode className="w-24 h-24 text-slate-950" />
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              {content.body}
            </p>
            {content.url && (
              <div className={`p-2 rounded font-mono text-xs max-w-md mx-auto ${
                showRedFlags ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-950 text-cyan-300'
              }`}>
                Detected Payload: {content.url}
              </div>
            )}
          </div>
        )}

        {/* Red Flags Breakdown */}
        {showRedFlags && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Cybersecurity Red Flag Breakdown ({redFlags?.length || 0} Clues)</span>
            </div>

            {(!redFlags || redFlags.length === 0) ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Zero red flags found! This is an authentic communication.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {redFlags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-xs space-y-1">
                    <span className="font-mono font-bold text-red-300 block">
                      🚩 {flag.element}
                    </span>
                    <p className="text-slate-300">{flag.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
