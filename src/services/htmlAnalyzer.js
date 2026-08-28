import { getMitreTechnique } from '../utils/mitreMapping';

export function analyzeHtml(rawHtml) {
  const indicators = [];
  let score = 0;
  const content = (rawHtml || '').trim();

  // 1. Password input detection
  const hasPasswordInput = /<input[^>]+type=["']password["']/i.test(content);
  if (hasPasswordInput) {
    indicators.push({
      id: 'ind-html-password-field',
      name: 'Authentication Password Input Found',
      category: 'content',
      severity: 'info',
      description: 'Page requests user password credentials. Verifying submission security and form action endpoints.',
      evidence: '<input type="password">',
      scoreImpact: 10
    });
    score += 10;
  }

  // 2. Form action check
  const formActionRegex = /<form[^>]+action=["']([^"']+)["']/gi;
  let formMatch;
  while ((formMatch = formActionRegex.exec(content)) !== null) {
    const actionUrl = formMatch[1].trim();

    if (actionUrl.startsWith('http://') && hasPasswordInput) {
      indicators.push({
        id: 'ind-insecure-form-action',
        name: 'Insecure HTTP Form Action Target',
        category: 'technical',
        severity: 'danger',
        description: 'Password form transmits credentials in plaintext over unencrypted HTTP.',
        evidence: `action="${actionUrl}"`,
        scoreImpact: 45,
        mitreTechniqueId: 'T1598'
      });
      score += 45;
    }

    if (/(telegram\.org\/bot|discord\.com\/api\/webhooks|formsubmit\.co|formspree\.io|getform\.io)/i.test(actionUrl)) {
      indicators.push({
        id: 'ind-exfil-webhook',
        name: 'Credential Exfiltration Webhook Detected',
        category: 'technical',
        severity: 'danger',
        description: 'Form submission directs credentials straight to a public webhook / bot exfiltration channel (Telegram, Discord, FormSpree).',
        evidence: `action="${actionUrl}"`,
        scoreImpact: 50,
        mitreTechniqueId: 'T1598'
      });
      score += 50;
    }
  }

  // 3. Obfuscated JS
  const obfuscationPatterns = [
    { pattern: /eval\s*\(\s*unescape\s*\(/i, name: 'eval(unescape(...)) Obfuscation' },
    { pattern: /String\.fromCharCode\s*\(/i, name: 'String.fromCharCode Payload Packing' },
    { pattern: /document\.write\s*\(\s*(?:decodeURIComponent|atob|unescape)\s*\(/i, name: 'Dynamic DOM Payload Decryption' },
    { pattern: /\\x[0-9a-f]{2}\\x[0-9a-f]{2}\\x[0-9a-f]{2}\\x[0-9a-f]{2}/i, name: 'Hex-Encoded Script Payload' },
  ];

  for (const obf of obfuscationPatterns) {
    if (obf.pattern.test(content)) {
      indicators.push({
        id: `ind-obfuscation-${obf.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: obf.name,
        category: 'technical',
        severity: 'danger',
        description: 'JavaScript source code contains packers or obfuscation techniques designed to evade automated static analysis scanners.',
        evidence: `Matched: ${obf.name}`,
        scoreImpact: 40,
        mitreTechniqueId: 'T1027'
      });
      score += 40;
    }
  }

  // 4. Anti-Analysis Hooks
  const antiAnalysisPatterns = [
    { pattern: /contextmenu\s*=\s*(?:return\s+false|function\s*\(\s*\)\s*\{\s*return\s+false)/i, name: 'Right-Click Disabled' },
    { pattern: /keyCode\s*===?\s*123/i, name: 'F12 DevTools Key Interception' },
    { pattern: /debugger\s*;/i, name: 'Debugger Loop / Anti-Inspection Trap' },
  ];

  for (const anti of antiAnalysisPatterns) {
    if (anti.pattern.test(content)) {
      indicators.push({
        id: `ind-anti-analysis-${anti.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: `Anti-Forensics / Inspection Blocker (${anti.name})`,
        category: 'technical',
        severity: 'warning',
        description: 'Webpage contains code to intentionally disable user inspection, developer tools, or context menus.',
        evidence: anti.name,
        scoreImpact: 25,
        mitreTechniqueId: 'T1027'
      });
      score += 25;
    }
  }

  // 5. Fullscreen Overlay iFrame
  if (/<iframe[^>]+style=["'][^"']*(?:position:\s*fixed|width:\s*100%|height:\s*100%|z-index:\s*999)[^"']*["']/i.test(content)) {
    indicators.push({
      id: 'ind-fullscreen-iframe',
      name: 'Fullscreen Phishing Overlay iFrame',
      category: 'content',
      severity: 'danger',
      description: 'Webpage embeds a fullscreen fixed-position iframe, commonly used to masquerade as an authentic service while stealing input tokens.',
      evidence: '<iframe style="position:fixed; width:100%; height:100%">',
      scoreImpact: 35,
      mitreTechniqueId: 'T1566.002'
    });
    score += 35;
  }

  // 6. Zero-font / Hidden text
  if (/(?:font-size:\s*0(?:px)?|display:\s*none|opacity:\s*0|visibility:\s*hidden)[^>]*>[a-z0-9\s]{20,}/i.test(content)) {
    indicators.push({
      id: 'ind-hidden-text-cloak',
      name: 'Cloaked Invisible Content',
      category: 'content',
      severity: 'warning',
      description: 'Contains hidden or zero-font text blocks often used to poison heuristic filters and spam scanners.',
      evidence: 'font-size: 0px / opacity: 0 text block',
      scoreImpact: 20
    });
    score += 20;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let threatLevel = 'safe';
  if (finalScore >= 65) threatLevel = 'malicious';
  else if (finalScore >= 35) threatLevel = 'suspicious';
  else if (finalScore >= 15) threatLevel = 'low';

  const recommendations = [];
  if (threatLevel === 'malicious') {
    recommendations.push('Do NOT submit any credentials into this webpage form.');
    recommendations.push('Inspect backend POST destinations and report the exfiltration endpoint.');
  } else if (threatLevel === 'suspicious') {
    recommendations.push('Review obfuscated JavaScript blocks and verify submission target origins.');
  } else {
    recommendations.push('Standard HTML structure. No obvious obfuscation or exfiltration webhooks detected.');
  }

  const mitreTechniqueSet = new Map();
  indicators.forEach(ind => {
    if (ind.mitreTechniqueId) {
      const tech = getMitreTechnique(ind.mitreTechniqueId);
      if (tech) mitreTechniqueSet.set(tech.id, tech);
    }
  });

  return {
    id: `html-scan-${Date.now().toString(36)}`,
    target: 'HTML Source Code Inspection',
    category: 'html',
    timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
    riskScore: finalScore,
    threatLevel,
    summary: threatLevel === 'malicious'
      ? `CRITICAL DOM THREAT: Detected credential harvesting forms, external exfiltration webhooks, or obfuscated JS payloads.`
      : threatLevel === 'suspicious'
      ? `SUSPICIOUS SOURCE: Found anti-debugging mechanisms or packed script blocks.`
      : `CLEAN / STANDARD HTML: No malicious webhooks or evasion scripts detected.`,
    indicators,
    mitreTechniques: Array.from(mitreTechniqueSet.values()),
    recommendations,
    meta: {
      hasPasswordField: hasPasswordInput,
      contentLength: content.length
    }
  };
}
