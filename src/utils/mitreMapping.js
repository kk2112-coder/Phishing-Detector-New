export const MITRE_TECHNIQUES = {
  'T1566.001': {
    id: 'T1566.001',
    name: 'Phishing: Spearphishing Attachment',
    tactic: 'Initial Access',
    description: 'Adversaries send malicious files (e.g. ISO, HTML, Office documents with macros) to gain initial execution.',
    url: 'https://attack.mitre.org/techniques/T1566/001/'
  },
  'T1566.002': {
    id: 'T1566.002',
    name: 'Phishing: Spearphishing Link',
    tactic: 'Initial Access',
    description: 'Adversaries send deceptive links (e.g. typosquatted URLs, shortened links) to direct victims to credential harvesting or malware sites.',
    url: 'https://attack.mitre.org/techniques/T1566/002/'
  },
  'T1566.003': {
    id: 'T1566.003',
    name: 'Phishing: Spearphishing via Service',
    tactic: 'Initial Access',
    description: 'Adversaries leverage third-party services (e.g. SMS, messaging apps, social platforms, cloud collaboration tools) for targeted phishing.',
    url: 'https://attack.mitre.org/techniques/T1566/003/'
  },
  'T1598': {
    id: 'T1598',
    name: 'Phishing for Information',
    tactic: 'Reconnaissance',
    description: 'Adversaries elicit sensitive information, credentials, or 2FA tokens via spoofed communication.',
    url: 'https://attack.mitre.org/techniques/T1598/'
  },
  'T1036.007': {
    id: 'T1036.007',
    name: 'Masquerading: Double File Extension',
    tactic: 'Defense Evasion',
    description: 'Adversaries append benign extensions (e.g. .pdf.exe, .invoice.doc.iso) to mislead users regarding file execution behavior.',
    url: 'https://attack.mitre.org/techniques/T1036/007/'
  },
  'T1027': {
    id: 'T1027',
    name: 'Obfuscated Files or Information',
    tactic: 'Defense Evasion',
    description: 'Adversaries use encoding, encryption, or JavaScript string concatenation to conceal malicious logic.',
    url: 'https://attack.mitre.org/techniques/T1027/'
  }
};

export function getMitreTechnique(id) {
  return MITRE_TECHNIQUES[id];
}
