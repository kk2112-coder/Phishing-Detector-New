export const INITIAL_THREAT_FEED = [
  {
    id: 'threat-101',
    type: 'credential_harvest',
    targetBrand: 'Microsoft 365',
    domainOrPayload: 'login.microsoftonline.com-auth-sync.xyz/oauth2',
    originCountry: 'RU',
    severity: 'malicious',
    detectedAt: '12 seconds ago',
    confidenceScore: 99,
    tags: ['Reverse-Proxy', 'AiTM', 'Evilginx', 'MFA-Bypass']
  },
  {
    id: 'threat-102',
    type: 'financial_fraud',
    targetBrand: 'PayPal',
    domainOrPayload: 'paypa1-security-resolution.top/cgi-bin/webscr',
    originCountry: 'NG',
    severity: 'malicious',
    detectedAt: '45 seconds ago',
    confidenceScore: 97,
    tags: ['Typosquatting', 'CreditCard-Harvester', 'Brand-Spoof']
  },
  {
    id: 'threat-103',
    type: 'smishing',
    targetBrand: 'USPS',
    domainOrPayload: 'usps-tracking-redelivery.buzz/claim',
    originCountry: 'CN',
    severity: 'malicious',
    detectedAt: '2 minutes ago',
    confidenceScore: 94,
    tags: ['Smishing', 'Package-Scam', 'SMS-Vector']
  },
  {
    id: 'threat-104',
    type: 'qr_quishing',
    targetBrand: 'DocuSign',
    domainOrPayload: 'docusign.net.esign-vault-portal.live/view',
    originCountry: 'BR',
    severity: 'malicious',
    detectedAt: '4 minutes ago',
    confidenceScore: 92,
    tags: ['Quishing', 'QR-Payload', 'Executive-Lure']
  },
  {
    id: 'threat-105',
    type: 'spearphishing',
    targetBrand: 'Chase Bank',
    domainOrPayload: 'chase-online-fraud-prevention.icu/verify',
    originCountry: 'RO',
    severity: 'malicious',
    detectedAt: '7 minutes ago',
    confidenceScore: 96,
    tags: ['Wire-Fraud', 'OTP-Interception', 'Banking']
  },
  {
    id: 'threat-106',
    type: 'malware_delivery',
    targetBrand: 'Adobe',
    domainOrPayload: 'adobe-acrobat-cloud-share.site/invoice.pdf.iso',
    originCountry: 'IN',
    severity: 'malicious',
    detectedAt: '11 minutes ago',
    confidenceScore: 98,
    tags: ['Double-Extension', 'ISO-Payload', 'Infostealer']
  },
  {
    id: 'threat-107',
    type: 'credential_harvest',
    targetBrand: 'MetaMask',
    domainOrPayload: 'metamask-io-wallet-restore.top/sync',
    originCountry: 'UA',
    severity: 'malicious',
    detectedAt: '15 minutes ago',
    confidenceScore: 99,
    tags: ['Crypto-Drainer', 'Seed-Phrase-Theft', 'Web3']
  }
];

export const ATTACK_VECTOR_STATS = [
  { name: 'Credential Harvesting', percentage: 46, color: '#ef4444', count: '1.42M' },
  { name: 'Financial & Wire Fraud', percentage: 24, color: '#f97316', count: '744K' },
  { name: 'Malware & Infostealers', percentage: 16, color: '#eab308', count: '496K' },
  { name: 'SMS Smishing & Voice', percentage: 9, color: '#06b6d4', count: '279K' },
  { name: 'QR Code Quishing', percentage: 5, color: '#a855f7', count: '155K' },
];

export const TOP_TARGETED_BRANDS = [
  { brand: 'Microsoft', share: 29.4, trend: '+4.2%' },
  { brand: 'Google', share: 18.1, trend: '+1.8%' },
  { brand: 'PayPal', share: 14.3, trend: '-0.5%' },
  { brand: 'Amazon', share: 11.2, trend: '+2.1%' },
  { brand: 'Apple', share: 8.7, trend: '+0.9%' },
  { brand: 'DHL / Logistics', share: 7.5, trend: '+6.4%' },
  { brand: 'Meta / Facebook', share: 5.9, trend: '-1.2%' },
  { brand: 'Crypto Wallets', share: 4.9, trend: '+8.3%' },
];

export const TOP_ABUSED_TLDS = [
  { tld: '.top', riskLevel: 'Critical', abuseRate: '84.2%' },
  { tld: '.xyz', riskLevel: 'High', abuseRate: '68.9%' },
  { tld: '.icu', riskLevel: 'Critical', abuseRate: '79.1%' },
  { tld: '.work', riskLevel: 'High', abuseRate: '72.4%' },
  { tld: '.buzz', riskLevel: 'High', abuseRate: '65.8%' },
  { tld: '.site', riskLevel: 'Elevated', abuseRate: '48.3%' },
  { tld: '.zip', riskLevel: 'High', abuseRate: '61.7%' },
];
