// Service to generate lookalike, typosquat, homoglyph, and combosquat domains

const HOMOGLYPHS = {
  a: ['а', 'ɑ', '4', '@'],
  c: ['с', 'ϲ'],
  e: ['е', '3'],
  i: ['і', '1', 'l', '!'],
  l: ['1', 'i', '|'],
  o: ['о', '0'],
  p: ['р'],
  s: ['ѕ', '5', '$'],
  u: ['υ'],
  v: ['ν'],
  w: ['ԝ', 'vv'],
  x: ['х'],
  y: ['у']
};

const COMMON_TLDS = ['com', 'net', 'org', 'xyz', 'top', 'icu', 'site', 'online', 'info', 'app', 'live', 'click'];
const COMBOSQUAT_KEYWORDS = ['login', 'verify', 'security', 'auth', 'support', 'portal', 'update', 'account', 'secure', 'alert'];

export function generateLookalikes(inputDomain) {
  let domain = (inputDomain || '').trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];

  if (!domain) return [];

  const parts = domain.split('.');
  const name = parts[0];
  const originalTld = parts.length > 1 ? parts.slice(1).join('.') : 'com';

  const results = [];
  const seen = new Set();

  function addResult(variation, type, risk, description) {
    if (variation !== domain && !seen.has(variation)) {
      seen.add(variation);
      results.push({
        id: `sim-${results.length + 1}`,
        domain: variation,
        type,
        risk, // 'critical' | 'high' | 'medium'
        description
      });
    }
  }

  // 1. Homoglyphs (IDN / Punycode Lookalikes)
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (HOMOGLYPHS[char]) {
      HOMOGLYPHS[char].forEach(sub => {
        const mutated = name.slice(0, i) + sub + name.slice(i + 1) + '.' + originalTld;
        addResult(mutated, 'Homoglyph / Visual Spoof', 'critical', `Substituted "${char}" with lookalike character "${sub}"`);
      });
    }
  }

  // 2. Character Omission (Missing letter)
  if (name.length > 3) {
    for (let i = 1; i < name.length - 1; i++) {
      const omitted = name.slice(0, i) + name.slice(i + 1) + '.' + originalTld;
      addResult(omitted, 'Omission Typosquat', 'high', `Omitted the letter "${name[i]}" from brand string`);
    }
  }

  // 3. Character Duplication
  for (let i = 0; i < Math.min(name.length, 4); i++) {
    const duplicated = name.slice(0, i) + name[i] + name.slice(i) + '.' + originalTld;
    addResult(duplicated, 'Duplication Typosquat', 'medium', `Duplicated "${name[i]}" to catch fat-finger misspellings`);
  }

  // 4. Combosquatting (Target Brand + Trust Keywords)
  COMBOSQUAT_KEYWORDS.slice(0, 6).forEach(kw => {
    addResult(`${name}-${kw}.${originalTld}`, 'Combosquatting (Hyphen)', 'critical', `Added trust lure "-${kw}" to trick users`);
    addResult(`${name}${kw}.${originalTld}`, 'Combosquatting (Affix)', 'high', `Direct keyword suffix "${kw}"`);
    addResult(`${kw}-${name}.${originalTld}`, 'Combosquatting (Prefix)', 'high', `Security prefix "${kw}-"`);
  });

  // 5. TLD Swapping (Abuse-prone TLDs)
  ['xyz', 'top', 'icu', 'site', 'live'].forEach(altTld => {
    if (altTld !== originalTld) {
      addResult(`${name}.${altTld}`, 'Malicious TLD Swap', 'critical', `Swapped official .${originalTld} for high-risk .${altTld} TLD`);
    }
  });

  // 6. Transposition (Swapping two adjacent characters)
  if (name.length >= 4) {
    for (let i = 1; i < Math.min(name.length - 1, 4); i++) {
      const swapped = name.slice(0, i) + name[i + 1] + name[i] + name.slice(i + 2) + '.' + originalTld;
      addResult(swapped, 'Transposition Typosquat', 'medium', `Swapped adjacent letters "${name[i]}" and "${name[i + 1]}"`);
    }
  }

  return results.slice(0, 36);
}
