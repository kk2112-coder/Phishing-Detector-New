import React, { useState } from 'react';
import { Globe, Mail, Smartphone, QrCode, Code } from 'lucide-react';
import { UrlScanner } from './UrlScanner';
import { EmailScanner } from './EmailScanner';
import { SmsScanner } from './SmsScanner';
import { QrScanner } from './QrScanner';
import { HtmlScanner } from './HtmlScanner';

export const ScannerHub = ({
  onScanComplete,
  onOpenAbuse,
}) => {
  const [activeVector, setActiveVector] = useState('url');

  const vectors = [
    { id: 'url', label: 'URL & Domain Scanner', icon: Globe },
    { id: 'email', label: 'Email & Headers', icon: Mail },
    { id: 'sms', label: 'SMS / Smishing', icon: Smartphone },
    { id: 'qr', label: 'QR Quishing Scanner', icon: QrCode, badge: 'NEW' },
    { id: 'html', label: 'HTML DOM Code', icon: Code },
  ];

  return (
    <div className="space-y-6">
      {/* Vector Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md">
        {vectors.map((vector) => {
          const Icon = vector.icon;
          const isActive = activeVector === vector.id;
          return (
            <button
              key={vector.id}
              onClick={() => setActiveVector(vector.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{vector.label}</span>
              {vector.badge && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950">
                  {vector.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Vector Panel */}
      <div>
        {activeVector === 'url' && (
          <UrlScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
        )}
        {activeVector === 'email' && (
          <EmailScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
        )}
        {activeVector === 'sms' && (
          <SmsScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
        )}
        {activeVector === 'qr' && (
          <QrScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
        )}
        {activeVector === 'html' && (
          <HtmlScanner onScanComplete={onScanComplete} onOpenAbuse={onOpenAbuse} />
        )}
      </div>
    </div>
  );
};
