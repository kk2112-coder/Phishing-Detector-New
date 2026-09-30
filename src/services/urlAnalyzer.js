import { POPULAR_BRANDS, SUSPICIOUS_SUBDOMAINS } from '../data/brandDatabase';
import { getTldReputation } from '../data/tldReputation';
import { getMitreTechnique } from '../utils/mitreMapping';

const HOMOGLYPH_MAP = {
  'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'ѕ': 's', 'ԁ': 'd', 'ԛ': 'q',
  'ԝ': 'w', 'х': 'x', 'у': 'y', 'і': 'i', 'ј': 'j', 'ν': 'v', 'ο': 'o', 'ρ': 'p',
  '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '8': 'b', '@': 'a', '$': 's'
};

function normalizeHomoglyphs(str) {
  let result = '';
  for (const char of (str || '').toLowerCase()) {
    result += HOMOGLYPH_MAP[char] || char;
  }
  return result;
}

function levenshteinDistance(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[bn][an];
}

function calculateEntropy(str) {
  const len = str ? str.length : 0;
  if (len === 0) return 0;
  const frequencies = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  return Object.values(frequencies).reduce((sum, count) => {
    const p = count / len;
    return sum - p * Math.log2(p);
  }, 0);
}

export function analyzeUrl(rawUrl) {
  let urlStr = (rawUrl || '').trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'http://' + urlStr;
  }

  const indicators = [];
  let score = 0;
  let parsedUrl = null;

  try {
    parsedUrl = new URL(urlStr);
  } catch {
    // raw fallback
  }

  const hostname = parsedUrl ? parsedUrl.hostname.toLowerCase() : rawUrl.toLowerCase().split('/')[0];
  const pathname = parsedUrl ? parsedUrl.pathname.toLowerCase() : '';
  const search = parsedUrl ? parsedUrl.search.toLowerCase() : '';
  const fullHref = parsedUrl ? parsedUrl.href : rawUrl;

  // Check custom Whitelist and Blacklist from Settings / localStorage
  try {
    const rawWhite = typeof localStorage !== 'undefined' ? localStorage.getItem('phishguard_whitelist') : null;
    const whitelist = rawWhite ? JSON.parse(rawWhite) : ['google.com', 'microsoft.com', 'github.com', 'apple.com', 'paypal.com'];
    if (whitelist.some(w => hostname === w.toLowerCase() || hostname.endsWith('.' + w.toLowerCase()))) {
      return {
        id: `scan-${Date.now().toString(36)}`,
        target: rawUrl,
        category: 'url',
        timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
        riskScore: 0,
        threatLevel: 'safe',
        summary: `VERIFIED SAFE: Domain matches your trusted custom Whitelist (${hostname}).`,
        targetDomain: hostname,
        brandImpersonation: null,
        indicators: [],
        mitreTechniques: [],
        recommendations: [
          'This domain is in your verified safe whitelist.',
          'Standard safe browsing precautions apply.'
        ],
        meta: {
          protocol: parsedUrl?.protocol || 'https:',
          hostname,
          tld: hostname.split('.').pop() || '',
          entropy: '1.00',
          fullUrl: fullHref
        }
      };
    }

    const rawBlack = typeof localStorage !== 'undefined' ? localStorage.getItem('phishguard_blacklist') : null;
    const blacklist = rawBlack ? JSON.parse(rawBlack) : ['malware-traffic-analysis.net', 'evil-phish-kit.xyz', 'crypto-drain-seed.top'];
    if (blacklist.some(b => hostname === b.toLowerCase() || hostname.includes(b.toLowerCase()))) {
      indicators.push({
        id: 'ind-custom-blacklist',
        name: 'Custom High-Threat Blacklist Match',
        category: 'reputation',
        severity: 'danger',
        description: 'This domain or pattern matches your custom security blacklist policy.',
        evidence: hostname,
        scoreImpact: 100,
        mitreTechniqueId: 'T1566.002'
      });
      score += 100;
    }
  } catch {
    // Ignore storage errors in non-browser environments
  }

  // 1. IP Address as Hostname
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    indicators.push({
      id: 'ind-ip-host',
      name: 'Direct IP Hostname Detected',
      category: 'technical',
      severity: 'danger',
      description: 'The URL uses a raw IP address instead of a registered domain name, a common hallmark of ephemeral phishing servers and botnets.',
      evidence: hostname,
      scoreImpact: 35,
      mitreTechniqueId: 'T1566.002'
    });
    score += 35;
  }

  // 2. Protocol Security (HTTP vs HTTPS)
  if (parsedUrl && parsedUrl.protocol === 'http:') {
    indicators.push({
      id: 'ind-insecure-http',
      name: 'Unencrypted HTTP Protocol',
      category: 'technical',
      severity: 'warning',
      description: 'Communication is unencrypted. Legitimate authentication and sensitive transaction services mandate HTTPS with valid TLS.',
      evidence: 'http://',
      scoreImpact: 15
    });
    score += 15;
  }

  // 3. TLD Reputation Analysis
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  const tldInfo = getTldReputation(tld);
  if (tldInfo.score >= 50) {
    indicators.push({
      id: 'ind-tld-risk',
      name: `High-Risk TLD (.${tld})`,
      category: 'reputation',
      severity: tldInfo.score >= 75 ? 'danger' : 'warning',
      description: tldInfo.reason,
      evidence: `.${tld} (Risk score: ${tldInfo.score}/100)`,
      scoreImpact: Math.round(tldInfo.score * 0.35),
      mitreTechniqueId: 'T1566.002'
    });
    score += Math.round(tldInfo.score * 0.35);
  }

  // 4. Homoglyph / Punycode Deception
  if (hostname.includes('xn--') || /[\u0080-\uFFFF]/.test(hostname)) {
    indicators.push({
      id: 'ind-homoglyph-punycode',
      name: 'Punycode / IDN Homoglyph Detected',
      category: 'brand_impersonation',
      severity: 'danger',
      description: 'Domain contains non-ASCII or Punycode characters used to visually mimic well-known brand names (IDN Homograph attack).',
      evidence: hostname,
      scoreImpact: 40,
      mitreTechniqueId: 'T1566.002'
    });
    score += 40;
  }

  // 5. Brand Impersonation & Typosquatting Check
  let detectedBrand = undefined;
  const cleanHostWithoutTld = domainParts.slice(0, -1).join('.');
  const normalizedHost = normalizeHomoglyphs(cleanHostWithoutTld);

  for (const brand of POPULAR_BRANDS) {
    const brandCore = brand.domain.split('.')[0];

    if (hostname === brand.domain || hostname.endsWith('.' + brand.domain)) {
      detectedBrand = {
        brandName: brand.name,
        canonicalDomain: brand.domain,
        similarityScore: 100,
        matchType: 'exact',
        detectedDomain: hostname
      };
      break;
    }

    if (hostname.includes(brandCore) || hostname.includes(brand.name.toLowerCase())) {
      indicators.push({
        id: `ind-brand-subdomain-${brand.name.toLowerCase()}`,
        name: `Brand Name Cloaking (${brand.name})`,
        category: 'brand_impersonation',
        severity: 'danger',
        description: `The brand "${brand.name}" is embedded in a domain or subdomain that is NOT owned by ${brand.domain}.`,
        evidence: `Found "${brandCore}" in ${hostname}`,
        scoreImpact: 45,
        mitreTechniqueId: 'T1566.002'
      });
      score += 45;
      detectedBrand = {
        brandName: brand.name,
        canonicalDomain: brand.domain,
        similarityScore: 92,
        matchType: 'subdomain_spoof',
        detectedDomain: hostname
      };
      break;
    }

    const dist = levenshteinDistance(normalizedHost, brandCore);
    if (dist > 0 && dist <= 2 && brandCore.length >= 4) {
      indicators.push({
        id: `ind-typosquat-${brand.name.toLowerCase()}`,
        name: `Typosquatting Detected (${brand.name})`,
        category: 'brand_impersonation',
        severity: 'danger',
        description: `Domain "${hostname}" is extremely similar to official ${brand.name} (${brand.domain}) with an edit distance of only ${dist}.`,
        evidence: `${hostname} ~ ${brand.domain}`,
        scoreImpact: 45,
        mitreTechniqueId: 'T1566.002'
      });
      score += 45;
      detectedBrand = {
        brandName: brand.name,
        canonicalDomain: brand.domain,
        similarityScore: Math.round((1 - dist / Math.max(brandCore.length, normalizedHost.length)) * 100),
        matchType: 'typosquatting',
        detectedDomain: hostname
      };
      break;
    }
  }

  // 6. Subdomain Stacking
  if (domainParts.length >= 4) {
    indicators.push({
      id: 'ind-subdomain-stacking',
      name: 'Excessive Subdomain Stacking',
      category: 'syntax',
      severity: 'warning',
      description: `Domain has ${domainParts.length} levels of subdomains, frequently used by phishing kits to mimic deep trust paths.`,
      evidence: hostname,
      scoreImpact: 20
    });
    score += 20;
  }

  for (const sub of SUSPICIOUS_SUBDOMAINS) {
    if (domainParts.slice(0, -2).includes(sub)) {
      indicators.push({
        id: `ind-subdomain-kw-${sub}`,
        name: `Deceptive Subdomain Keyword ("${sub}")`,
        category: 'heuristic',
        severity: 'warning',
        description: `Subdomain contains high-risk authentication lure keyword "${sub}".`,
        evidence: `${sub}.${hostname}`,
        scoreImpact: 15
      });
      score += 15;
      break;
    }
  }

  // 7. Path and Query Credential Harvesting Keywords
  const fullPathQuery = (pathname + search).toLowerCase();
  const phishingKeywords = ['webscr', 'cmd=_login', 'account_update', 'verify-id', 'restore_account', 'password_reset', 'kyc-identity', 'auth-token', 'security_challenge'];
  for (const kw of phishingKeywords) {
    if (fullPathQuery.includes(kw)) {
      indicators.push({
        id: `ind-path-kw-${kw}`,
        name: `Phishing Keyword in URI Path ("${kw}")`,
        category: 'heuristic',
        severity: 'danger',
        description: `The URL path or query string contains authentication lure pattern "${kw}".`,
        evidence: kw,
        scoreImpact: 25,
        mitreTechniqueId: 'T1598'
      });
      score += 25;
      break;
    }
  }

  // 8. Double File Extensions
  const doubleExtRegex = /\.[a-z0-9]{2,4}\.(exe|iso|scr|vbs|bat|cmd|html|zip|hta|dll)$/i;
  if (doubleExtRegex.test(pathname)) {
    indicators.push({
      id: 'ind-double-extension',
      name: 'Double / Deceptive File Extension',
      category: 'technical',
      severity: 'danger',
      description: 'The URL targets a file disguised with a double extension to trick users into executing a malicious payload.',
      evidence: pathname,
      scoreImpact: 40,
      mitreTechniqueId: 'T1036.007'
    });
    score += 40;
  }

  // 9. URL Entropy
  const hostEntropy = calculateEntropy(cleanHostWithoutTld);
  if (hostEntropy > 3.9 && cleanHostWithoutTld.length > 12) {
    indicators.push({
      id: 'ind-high-entropy',
      name: 'High Entropy Domain Name (DGA/Randomized)',
      category: 'heuristic',
      severity: 'warning',
      description: `Domain character randomness is unusually high (${hostEntropy.toFixed(2)}), typical of Domain Generation Algorithms (DGA) or disposable attack domains.`,
      evidence: `Entropy: ${hostEntropy.toFixed(2)} bits`,
      scoreImpact: 20
    });
    score += 20;
  }

  // 10. Embedded Credentials or @ Symbol
  if (rawUrl && rawUrl.includes('@')) {
    indicators.push({
      id: 'ind-at-symbol-spoof',
      name: 'Embedded @ Character Spoofing',
      category: 'syntax',
      severity: 'danger',
      description: 'URL contains the "@" character. Browsers treat text before "@" as credentials, routing the browser to the actual destination host that follows.',
      evidence: rawUrl,
      scoreImpact: 45,
      mitreTechniqueId: 'T1566.002'
    });
    score += 45;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let threatLevel = 'safe';
  if (finalScore >= 70) threatLevel = 'malicious';
  else if (finalScore >= 40) threatLevel = 'suspicious';
  else if (finalScore >= 20) threatLevel = 'low';

  const recommendations = [];
  if (threatLevel === 'malicious') {
    recommendations.push('DO NOT enter any passwords, 2FA codes, seed phrases, or personal details.');
    recommendations.push('Block this domain immediately across your DNS firewall and web gateway.');
    recommendations.push('Submit this URL to Google Safe Browsing, PhishTank, and registrar abuse desks.');
  } else if (threatLevel === 'suspicious') {
    recommendations.push('Exercise caution. Navigate to the verified official website directly by typing the domain.');
    recommendations.push('Verify SSL certificate validity and domain registrar reputation before interacting.');
  } else {
    recommendations.push('No obvious heuristic red flags detected. Maintain standard security vigilance.');
  }

  let summary;
  if (threatLevel === 'malicious') {
    summary = `CRITICAL THREAT: High confidence phishing indicators detected (${indicators.length} red flags). High probability of credential harvesting or brand spoofing.`;
  } else if (threatLevel === 'suspicious') {
    summary = `SUSPICIOUS: Several anomaly indicators detected. The target exhibits characteristics often associated with deceptive or unverified infrastructure.`;
  } else if (threatLevel === 'low') {
    summary = `LOW RISK: Minor non-standard indicators detected (such as HTTP or generic TLD). Proceed with standard care.`;
  } else {
    summary = `SAFE / BENIGN: Standard structural formatting with no malicious heuristics or typosquatting patterns detected.`;
  }

  const mitreTechniqueSet = new Map();
  indicators.forEach(ind => {
    if (ind.mitreTechniqueId) {
      const tech = getMitreTechnique(ind.mitreTechniqueId);
      if (tech) mitreTechniqueSet.set(tech.id, tech);
    }
  });

  return {
    id: `scan-${Date.now().toString(36)}`,
    target: rawUrl,
    category: 'url',
    timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
    riskScore: finalScore,
    threatLevel,
    summary,
    targetDomain: hostname,
    brandImpersonation: detectedBrand,
    indicators,
    mitreTechniques: Array.from(mitreTechniqueSet.values()),
    recommendations,
    meta: {
      protocol: parsedUrl?.protocol || 'unknown',
      hostname,
      tld,
      entropy: hostEntropy.toFixed(2),
      fullUrl: fullHref
    }
  };
}
