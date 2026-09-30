// Password and Credential Phish-Resistance Evaluator

const COMMON_LEAKED_WORDS = [
  'password', '123456', 'qwerty', 'admin', 'welcome', 'login', 'security',
  'football', 'iloveyou', 'charlie', 'princess', 'monkey', 'starwars',
  'summer2026', 'winter2025', 'spring2026', 'pass123', 'trustno1', 'secret'
];

export function evaluatePasswordSafety(password) {
  const pwd = password || '';
  let score = 0;
  const feedback = [];
  const vulnerabilities = [];

  if (!pwd) {
    return {
      score: 0,
      label: 'Empty',
      crackTime: 'Instant',
      phishVulnerability: 'None',
      feedback: ['Enter a password to evaluate its phishing and brute-force vulnerability.'],
      vulnerabilities: [],
      entropy: 0
    };
  }

  // Length calculation
  if (pwd.length >= 16) {
    score += 40;
    feedback.push('Excellent length (16+ characters) makes brute-forcing computationally prohibitive.');
  } else if (pwd.length >= 12) {
    score += 25;
    feedback.push('Good length (12-15 characters).');
  } else if (pwd.length >= 8) {
    score += 10;
    vulnerabilities.push('Short length (8-11 characters). Modern GPUs can crack this in hours or days.');
  } else {
    vulnerabilities.push('Critical: Fewer than 8 characters is cracked nearly instantaneously.');
  }

  // Character sets
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigits = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

  let poolSize = 0;
  if (hasLower) { score += 10; poolSize += 26; }
  if (hasUpper) { score += 10; poolSize += 26; }
  if (hasDigits) { score += 10; poolSize += 10; }
  if (hasSpecial) { score += 15; poolSize += 32; }

  // Diversity advice
  if (!hasSpecial) {
    vulnerabilities.push('Lacks special symbols (!@#$%^&*). Phishing credential-stuffing dictionaries test alphanumeric variations first.');
  }
  if (!hasDigits) {
    vulnerabilities.push('Lacks numbers.');
  }

  // Dictionary check
  const lowerPwd = pwd.toLowerCase();
  for (const leaked of COMMON_LEAKED_WORDS) {
    if (lowerPwd.includes(leaked)) {
      score -= 30;
      vulnerabilities.push(`Contains dictionary term "${leaked}", widely present in leaked phishing combo lists.`);
      break;
    }
  }

  // Sequential or repeating characters
  if (/([a-zA-Z0-9])\1{2,}/.test(pwd)) {
    score -= 15;
    vulnerabilities.push('Contains repetitive sequential characters (e.g., "aaa", "111").');
  }
  if (/(123|abc|qwerty|asdf)/i.test(pwd)) {
    score -= 20;
    vulnerabilities.push('Contains predictable keyboard walks (e.g. "123", "qwerty").');
  }

  const finalScore = Math.max(5, Math.min(100, score));

  // Shannon Entropy
  const entropy = Math.round(pwd.length * Math.log2(Math.max(2, poolSize)));

  // Crack Time estimation
  let crackTime = 'Instantly';
  let phishRisk = 'Critical';
  let label = 'Very Weak';

  if (finalScore >= 85) {
    crackTime = 'Centuries (Quadrillions of guesses)';
    phishRisk = 'Low (Requires direct phishing prompt)';
    label = 'Strong & Resilient';
  } else if (finalScore >= 65) {
    crackTime = 'Several Years';
    phishRisk = 'Moderate (Vulnerable if reused on compromised sites)';
    label = 'Good';
  } else if (finalScore >= 40) {
    crackTime = 'Few Days to Weeks';
    phishRisk = 'High (Targeted in rainbow tables & credential stuffing)';
    label = 'Moderate';
  } else {
    crackTime = 'Seconds to Hours';
    phishRisk = 'Severe (Instantly tested in mass automated bot attacks)';
    label = 'Weak';
  }

  return {
    score: finalScore,
    label,
    crackTime,
    phishVulnerability: phishRisk,
    entropy,
    feedback,
    vulnerabilities,
    hasLower,
    hasUpper,
    hasDigits,
    hasSpecial
  };
}
