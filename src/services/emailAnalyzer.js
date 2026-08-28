import { POPULAR_BRANDS, HIGH_RISK_KEYWORDS } from '../data/brandDatabase';
import { analyzeUrl } from './urlAnalyzer';
import { getMitreTechnique } from '../utils/mitreMapping';

export function analyzeEmail(rawEmail) {
  const indicators = [];
  let score = 0;
  const content = (rawEmail || '').trim();

  const fromMatch = content.match(/From:\s*([^<\r\n]*)(?:<([^>\r\n]+)>)?/i);
  const replyToMatch = content.match(/Reply-To:\s*([^<\r\n]*)(?:<([^>\r\n]+)>)?/i);
  const subjectMatch = content.match(/Subject:\s*([^\r\n]+)/i);

  const displayName = fromMatch ? fromMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const senderEmail = fromMatch ? (fromMatch[2] || fromMatch[1]).trim() : '';
  const replyToEmail = replyToMatch ? (replyToMatch[2] || replyToMatch[1]).trim() : '';
  const subject = subjectMatch ? subjectMatch[1].trim() : '';

  let senderDomain = '';
  if (senderEmail && senderEmail.includes('@')) {
    senderDomain = senderEmail.split('@')[1].toLowerCase().replace(/[>]/g, '').trim();
  }

  let replyToDomain = '';
  if (replyToEmail && replyToEmail.includes('@')) {
    replyToDomain = replyToEmail.split('@')[1].toLowerCase().replace(/[>]/g, '').trim();
  }

  // 1. Display Name Spoofing
  if (displayName && senderDomain) {
    for (const brand of POPULAR_BRANDS) {
      if (displayName.toLowerCase().includes(brand.name.toLowerCase())) {
        const brandDomain = brand.domain.toLowerCase();
        if (!senderDomain.endsWith(brandDomain)) {
          indicators.push({
            id: `ind-email-display-spoof-${brand.name}`,
            name: `Display Name Spoofing (${brand.name})`,
            category: 'brand_impersonation',
            severity: 'danger',
            description: `The email displays the trusted name "${displayName}", but was sent from an untrusted domain ("${senderDomain}") instead of official "${brandDomain}".`,
            evidence: `"${displayName}" <${senderEmail}>`,
            scoreImpact: 45,
            mitreTechniqueId: 'T1566.002'
          });
          score += 45;
          break;
        }
      }
    }
  }

  // 2. Reply-To Mismatch
  if (replyToDomain && senderDomain && replyToDomain !== senderDomain) {
    indicators.push({
      id: 'ind-reply-to-mismatch',
      name: 'Reply-To Address Divergence',
      category: 'technical',
      severity: 'danger',
      description: `Replies are routed to a different domain (${replyToDomain}) than the stated sender (${senderDomain}), typical of business email compromise (BEC).`,
      evidence: `From: ${senderDomain} | Reply-To: ${replyToDomain}`,
      scoreImpact: 35,
      mitreTechniqueId: 'T1598'
    });
    score += 35;
  }

  // 3. Security Headers
  const spfFail = /spf=(?:fail|softfail)/i.test(content) || /spf\s*:\s*(?:fail|softfail)/i.test(content);
  const dkimFail = /dkim=(?:fail|neutral)/i.test(content) || /dkim\s*:\s*fail/i.test(content);
  const dmarcFail = /dmarc=(?:fail|reject)/i.test(content) || /dmarc\s*:\s*fail/i.test(content);

  const secHeaders = {
    spfStatus: spfFail ? 'fail' : /spf=pass/i.test(content) ? 'pass' : 'none',
    dkimStatus: dkimFail ? 'fail' : /dkim=pass/i.test(content) ? 'pass' : 'none',
    dmarcStatus: dmarcFail ? 'fail' : /dmarc=pass/i.test(content) ? 'pass' : 'none',
    details: ''
  };

  if (spfFail || dkimFail || dmarcFail) {
    indicators.push({
      id: 'ind-auth-headers-failed',
      name: 'Email Authentication Verification Failed',
      category: 'technical',
      severity: 'danger',
      description: 'SPF, DKIM, or DMARC authentication checks failed. This indicates the sender IP address was unauthorized to transmit on behalf of the domain.',
      evidence: `SPF: ${secHeaders.spfStatus} | DKIM: ${secHeaders.dkimStatus} | DMARC: ${secHeaders.dmarcStatus}`,
      scoreImpact: 35,
      mitreTechniqueId: 'T1566.002'
    });
    score += 35;
  }

  // 4. Urgency Analysis
  const lowerContent = content.toLowerCase();
  const matchedKeywords = [];
  HIGH_RISK_KEYWORDS.forEach(kw => {
    if (lowerContent.includes(kw)) {
      matchedKeywords.push(kw);
    }
  });

  if (matchedKeywords.length > 0) {
    const severity = matchedKeywords.length >= 3 ? 'danger' : 'warning';
    const impact = Math.min(40, matchedKeywords.length * 12);
    indicators.push({
      id: 'ind-psycholinguistic-urgency',
      name: 'High-Pressure Urgency & Coercive Language',
      category: 'psycholinguistic',
      severity,
      description: 'The message utilizes psychological triggers (urgency, panic, account termination, immediate legal consequences) to force hasty compliance.',
      evidence: `Detected phrases: "${matchedKeywords.slice(0, 4).join('", "')}"`,
      scoreImpact: impact,
      mitreTechniqueId: 'T1598'
    });
    score += impact;
  }

  // 5. Extracted URLs and Link vs Anchor Text
  const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
  const extractedUrls = Array.from(new Set(content.match(urlRegex) || []));

  const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let anchorMatch;
  while ((anchorMatch = anchorRegex.exec(content)) !== null) {
    const href = anchorMatch[1].trim();
    const visibleText = anchorMatch[2].replace(/<[^>]+>/g, '').trim();

    if (visibleText.includes('http') || visibleText.includes('.com') || visibleText.includes('.net')) {
      try {
        const hrefHost = new URL(href).hostname.toLowerCase();
        if (visibleText.includes('paypal') && !hrefHost.includes('paypal.com')) {
          indicators.push({
            id: 'ind-anchor-divergence',
            name: 'Deceptive Hyperlink Text Mismatch',
            category: 'brand_impersonation',
            severity: 'danger',
            description: `Visible link text claims to go to "${visibleText}", but the underlying href leads to a different server ("${hrefHost}").`,
            evidence: `Text: ${visibleText} -> Href: ${href}`,
            scoreImpact: 50,
            mitreTechniqueId: 'T1566.002'
          });
          score += 50;
        }
      } catch {}
    }
  }

  for (const url of extractedUrls.slice(0, 3)) {
    const urlScan = analyzeUrl(url);
    if (urlScan.threatLevel === 'malicious' || urlScan.threatLevel === 'suspicious') {
      indicators.push({
        id: `ind-embedded-url-${urlScan.id}`,
        name: `Malicious Embedded Link (${urlScan.targetDomain || 'URL'})`,
        category: 'heuristic',
        severity: urlScan.threatLevel === 'malicious' ? 'danger' : 'warning',
        description: `Embedded link exhibits high-risk phishing characteristics: ${urlScan.summary}`,
        evidence: url,
        scoreImpact: Math.round(urlScan.riskScore * 0.4),
        mitreTechniqueId: 'T1566.002'
      });
      score += Math.round(urlScan.riskScore * 0.4);
    }
  }

  // 6. Dangerous Attachment
  const attachmentRegex = /\.(exe|iso|scr|vbs|docm|xlsm|pptm|hta|html|bat|ps1|zip|rar|7z)\b/i;
  const attachMatch = content.match(attachmentRegex);
  if (attachMatch) {
    indicators.push({
      id: 'ind-suspicious-attachment',
      name: `High-Risk Attachment Format (.${attachMatch[1]})`,
      category: 'content',
      severity: 'danger',
      description: `Referenced attachment format (.${attachMatch[1]}) is frequently weaponized to execute malware payloads or local credential harvest scripts.`,
      evidence: `File pattern: *.${attachMatch[1]}`,
      scoreImpact: 35,
      mitreTechniqueId: 'T1566.001'
    });
    score += 35;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let threatLevel = 'safe';
  if (finalScore >= 70) threatLevel = 'malicious';
  else if (finalScore >= 40) threatLevel = 'suspicious';
  else if (finalScore >= 20) threatLevel = 'low';

  const recommendations = [];
  if (threatLevel === 'malicious') {
    recommendations.push('DO NOT click any buttons, links, or download attachments.');
    recommendations.push('Report the email to your Security Operations Center (SOC) / IT department.');
    recommendations.push('Mark as Phishing in your email client to update collective spam filters.');
  } else if (threatLevel === 'suspicious') {
    recommendations.push('Verify the sender identity via an out-of-band communication channel (phone, internal chat).');
    recommendations.push('Do not input credentials on any page linked from this email.');
  } else {
    recommendations.push('Standard email security practices apply. Verify unexpected requests for financial transfers.');
  }

  let summary = '';
  if (threatLevel === 'malicious') {
    summary = `MALICIOUS EMAIL DETECTED: High confidence phishing attempt. Contains ${indicators.length} critical indicators including deceptive sender headers, psychological urgency lures, or dangerous embedded destinations.`;
  } else if (threatLevel === 'suspicious') {
    summary = `SUSPICIOUS EMAIL: Multiple red flags identified. The sender address or email body exhibits anomalies consistent with social engineering.`;
  } else {
    summary = `SAFE / LOW RISK: No obvious malicious indicators or header anomalies detected.`;
  }

  const mitreTechniqueSet = new Map();
  indicators.forEach(ind => {
    if (ind.mitreTechniqueId) {
      const tech = getMitreTechnique(ind.mitreTechniqueId);
      if (tech) mitreTechniqueSet.set(tech.id, tech);
    }
  });

  return {
    id: `email-scan-${Date.now().toString(36)}`,
    target: subject || senderEmail || 'Email Content Analysis',
    category: 'email',
    timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
    riskScore: finalScore,
    threatLevel,
    summary,
    targetDomain: senderDomain,
    indicators,
    securityHeaders: secHeaders,
    extractedUrls,
    mitreTechniques: Array.from(mitreTechniqueSet.values()),
    recommendations,
    meta: {
      from: displayName ? `${displayName} <${senderEmail}>` : senderEmail,
      subject,
      replyTo: replyToEmail,
      urlsFound: extractedUrls.length
    }
  };
}
