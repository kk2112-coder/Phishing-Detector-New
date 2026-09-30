import { analyzeUrl } from './urlAnalyzer';
import { getMitreTechnique } from '../utils/mitreMapping';

const SHORTENER_DOMAINS = [
  'bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'ow.ly', 'rb.gy',
  'buff.ly', 'shorturl.at', 'tiny.cc', 'bl.ink', 'v.gd'
];

const SMISHING_PATTERNS = [
  { pattern: /(package|parcel|shipment|delivery|redelivery|usps|fedex|dhl|ups)/i, name: 'Package / Postal Delivery Lure', impact: 25 },
  { pattern: /(fee|unpaid|\$1\.|\$2\.|\$0\.|customs|postage due|redelivery fee)/i, name: 'Micro-Payment Credit Card Harvester', impact: 35 },
  { pattern: /(bank|zelle|wire|unauthorized|fraud alert|card suspended|locked|otp|passcode)/i, name: 'Financial & 2FA Theft Lure', impact: 35 },
  { pattern: /(toll|e-zpass|turnpike|infraction|traffic ticket|overdue fine)/i, name: 'Toll & Violation Smishing Lure', impact: 30 },
  { pattern: /(tax refund|stimulus|rebate|irs|hmrc|payout)/i, name: 'Tax / Government Rebate Scam', impact: 30 },
  { pattern: /(reply stop|reply 1 to confirm|within 12 hours|immediately)/i, name: 'High Urgency Response Trigger', impact: 20 },
];

export function analyzeSms(rawText, senderPhone) {
  const indicators = [];
  let score = 0;
  const content = (rawText || '').trim();

  // 1. Check Smishing Patterns
  for (const item of SMISHING_PATTERNS) {
    if (item.pattern.test(content)) {
      indicators.push({
        id: `ind-smish-pattern-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: item.name,
        category: 'psycholinguistic',
        severity: item.impact >= 30 ? 'danger' : 'warning',
        description: `Message content closely matches active smishing templates designed to elicit immediate emotional reaction.`,
        evidence: `Pattern match: ${item.name}`,
        scoreImpact: item.impact,
        mitreTechniqueId: 'T1566.003'
      });
      score += item.impact;
    }
  }

  // 2. Shortened URLs
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const rawUrls = content.match(urlRegex) || [];
  const extractedUrls = Array.from(new Set(rawUrls));

  for (const url of extractedUrls) {
    try {
      const urlObj = new URL(url);
      const host = urlObj.hostname.toLowerCase();

      if (SHORTENER_DOMAINS.includes(host)) {
        indicators.push({
          id: `ind-shortener-${host}`,
          name: `URL Shortener Cloaking (${host})`,
          category: 'technical',
          severity: 'warning',
          description: `The message uses a shortened URL to conceal the true destination server from mobile preview scanners.`,
          evidence: url,
          scoreImpact: 30,
          mitreTechniqueId: 'T1566.002'
        });
        score += 30;
      } else {
        const urlScan = analyzeUrl(url);
        if (urlScan.threatLevel === 'malicious' || urlScan.threatLevel === 'suspicious') {
          indicators.push({
            id: `ind-sms-malicious-url-${urlScan.id}`,
            name: `Deceptive SMS Target Domain (${urlScan.targetDomain})`,
            category: 'brand_impersonation',
            severity: 'danger',
            description: `Embedded link exhibits high-risk phishing markers: ${urlScan.summary}`,
            evidence: url,
            scoreImpact: 40,
            mitreTechniqueId: 'T1566.002'
          });
          score += 40;
        }
      }
    } catch {
      // ignore url parsing error
    }
  }

  // 3. Sender Number
  if (senderPhone) {
    const cleanSender = senderPhone.trim();
    if (/^\+?(1800|1888|1877|1866|1855|1844|1833)/.test(cleanSender)) {
      indicators.push({
        id: 'ind-sender-toll-free',
        name: 'VoIP / Disposable Toll-Free Sender',
        category: 'technical',
        severity: 'info',
        description: 'Message originates from a virtual toll-free VoIP routing number commonly leased for automated blast smishing campaigns.',
        evidence: cleanSender,
        scoreImpact: 10
      });
      score += 10;
    }
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let threatLevel = 'safe';
  if (finalScore >= 65) threatLevel = 'malicious';
  else if (finalScore >= 35) threatLevel = 'suspicious';
  else if (finalScore >= 20) threatLevel = 'low';

  const recommendations = [];
  if (threatLevel === 'malicious') {
    recommendations.push('DO NOT tap or open any links in the SMS message.');
    recommendations.push('DO NOT reply with "STOP" or personal info, which confirms your active phone line.');
    recommendations.push('Forward the message to your cellular carrier spam reporting service (SMS 7726 / "SPAM").');
  } else if (threatLevel === 'suspicious') {
    recommendations.push('Verify the communication directly through the official app or customer service telephone line.');
  } else {
    recommendations.push('Always be cautious when receiving unexpected links over SMS messaging.');
  }

  const mitreTechniqueSet = new Map();
  indicators.forEach(ind => {
    if (ind.mitreTechniqueId) {
      const tech = getMitreTechnique(ind.mitreTechniqueId);
      if (tech) mitreTechniqueSet.set(tech.id, tech);
    }
  });

  return {
    id: `sms-scan-${Date.now().toString(36)}`,
    target: senderPhone || (content.length > 50 ? content.slice(0, 50) + '...' : content),
    category: 'sms',
    timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
    riskScore: finalScore,
    threatLevel,
    summary: threatLevel === 'malicious'
      ? `CRITICAL SMISHING THREAT: Detected highly deceptive SMS phishing lures with disguised URLs or financial urgency hooks.`
      : threatLevel === 'suspicious'
      ? `SUSPICIOUS SMS: Contains potential urgency triggers or shortened links typical of mobile lures.`
      : `LOW RISK SMS: No obvious smishing templates or deceptive links detected.`,
    indicators,
    extractedUrls,
    mitreTechniques: Array.from(mitreTechniqueSet.values()),
    recommendations,
    meta: {
      sender: senderPhone || 'Unknown Sender',
      urlsDetected: extractedUrls.length
    }
  };
}
