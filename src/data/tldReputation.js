export const TLD_REPUTATION_MAP = {
  // Ultra-Trusted / Restricted
  'gov': { score: 0, category: 'trusted_gov', reason: 'Restricted government domain with strict identity verification.' },
  'gov.uk': { score: 0, category: 'trusted_gov', reason: 'Official UK government domain hierarchy.' },
  'mil': { score: 0, category: 'trusted_gov', reason: 'US Military restricted domain.' },
  'edu': { score: 5, category: 'trusted_edu', reason: 'Accredited educational institution.' },
  'ac.uk': { score: 5, category: 'trusted_edu', reason: 'Accredited UK educational institution.' },

  // Standard Commercial & Regional
  'com': { score: 15, category: 'standard', reason: 'Standard global commercial domain. Widely used by legitimate brands and attackers alike.' },
  'org': { score: 15, category: 'standard', reason: 'Standard organization domain.' },
  'net': { score: 20, category: 'standard', reason: 'Standard infrastructure / network domain.' },
  'io': { score: 15, category: 'standard', reason: 'Popular tech startup and developer domain.' },
  'co': { score: 25, category: 'standard', reason: 'Common commercial alternative.' },
  'ai': { score: 15, category: 'standard', reason: 'Popular AI technology domain.' },
  'app': { score: 10, category: 'standard', reason: 'Google-managed TLD requiring mandatory HTTPS.' },
  'dev': { score: 10, category: 'standard', reason: 'Google-managed TLD requiring mandatory HTTPS.' },

  // Elevated / High-Abuse New gTLDs
  'xyz': { score: 70, category: 'high_risk', reason: 'High statistical incidence in automated spam, disposable phishing campaigns, and malware distribution.' },
  'top': { score: 85, category: 'high_risk', reason: 'Consistently ranked among the top TLDs for phishing and malicious botnet command infrastructure.' },
  'work': { score: 80, category: 'high_risk', reason: 'Cheap registration frequently abused for fake invoice & HR spearphishing.' },
  'click': { score: 80, category: 'high_risk', reason: 'Commonly weaponized in deceptive SMS/email clickbait and credential harvests.' },
  'buzz': { score: 75, category: 'high_risk', reason: 'Frequently abused in automated bulk phishing campaigns.' },
  'icu': { score: 85, category: 'high_risk', reason: 'Historically heavily associated with malicious campaigns and low-cost domain churn.' },
  'tk': { score: 95, category: 'abused_free', reason: 'Free registration domain historically notorious for massive phishing campaigns.' },
  'ml': { score: 90, category: 'abused_free', reason: 'Free registration domain with widespread abuse patterns.' },
  'ga': { score: 90, category: 'abused_free', reason: 'Free registration domain with high malware/phishing density.' },
  'cf': { score: 90, category: 'abused_free', reason: 'Free registration domain with high abuse index.' },
  'gq': { score: 90, category: 'abused_free', reason: 'Free registration domain with high phishing rates.' },
  'zip': { score: 75, category: 'high_risk', reason: 'Mimics file extensions (.zip) causing confusion and deceptive link cloaking.' },
  'mov': { score: 75, category: 'high_risk', reason: 'Mimics video file extensions (.mov) used for deceptive social engineering.' },
  'surf': { score: 70, category: 'high_risk', reason: 'High abuse density in credential phishing.' },
  'monster': { score: 70, category: 'high_risk', reason: 'Elevated rate of fraudulent domain generation.' },
  'live': { score: 55, category: 'elevated', reason: 'Moderate abuse for fake streaming & live crypto scam events.' },
  'link': { score: 65, category: 'elevated', reason: 'Frequently used in SMS phishing (smishing) links.' },
  'online': { score: 50, category: 'elevated', reason: 'Moderate abuse for fake banking / portal replicas.' },
  'site': { score: 55, category: 'elevated', reason: 'Moderate abuse rate across phishing toolkits.' },
  'store': { score: 45, category: 'elevated', reason: 'Used in counterfeit retail and credit card skimming sites.' },
  'ru': { score: 65, category: 'high_risk', reason: 'High incidence of fast-flux phishing hosting and bulletproof networks.' },
  'cn': { score: 60, category: 'elevated', reason: 'Elevated incidence of counterfeit goods and phishing portals.' }
};

export function getTldReputation(tld) {
  const normalized = (tld || '').toLowerCase().replace(/^\.+/, '');
  if (TLD_REPUTATION_MAP[normalized]) {
    return TLD_REPUTATION_MAP[normalized];
  }
  return {
    score: 30,
    category: 'standard',
    reason: `Standard generic or country-code TLD (.${normalized}). Heuristic checks applied.`
  };
}
