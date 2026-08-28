export const POPULAR_BRANDS = [
  // Tech & Cloud Giants
  { name: 'Google', domain: 'google.com', aliases: ['gmail', 'googlemail', 'googledrive', 'google-security'], category: 'tech', riskKeywords: ['login', 'account', 'verify', 'storage', 'password-reset'] },
  { name: 'Microsoft', domain: 'microsoft.com', aliases: ['office365', 'outlook', 'live', 'msn', 'sharepoint', 'onedrive', 'azure', 'teams'], category: 'tech', riskKeywords: ['login', 'security-alert', 'password', 'm365', 'admin-verify', 'quarantine'] },
  { name: 'Apple', domain: 'apple.com', aliases: ['icloud', 'appleid', 'itunes', 'appstore'], category: 'tech', riskKeywords: ['icloud-locked', 'id-verify', 'findmy', 'billing-issue', 'unlock'] },
  { name: 'Amazon', domain: 'amazon.com', aliases: ['prime', 'aws', 'amazonpay'], category: 'e-commerce', riskKeywords: ['order-cancelled', 'giftcard', 'suspended-account', 'unusual-order', 'refund'] },
  { name: 'Netflix', domain: 'netflix.com', aliases: ['netflix-payment', 'netflix-verify'], category: 'tech', riskKeywords: ['payment-declined', 'membership-suspended', 'update-billing', 'subscription'] },
  { name: 'Meta / Facebook', domain: 'facebook.com', aliases: ['meta', 'fb', 'meta-support', 'fb-security'], category: 'social', riskKeywords: ['copyright-violation', 'appeal-form', 'business-manager', 'account-disabled'] },
  { name: 'Instagram', domain: 'instagram.com', aliases: ['ig', 'insta-verify'], category: 'social', riskKeywords: ['badge-verification', 'copyright-infringement', 'unusual-login'] },
  { name: 'LinkedIn', domain: 'linkedin.com', aliases: ['linked-in', 'linkedin-jobs'], category: 'social', riskKeywords: ['new-message', 'profile-viewed', 'job-offer', 'security-pin'] },
  { name: 'Twitter / X', domain: 'x.com', aliases: ['twitter'], category: 'social', riskKeywords: ['blue-badge', 'appeal', 'suspended'] },
  { name: 'WhatsApp', domain: 'whatsapp.com', aliases: ['wa', 'whatsapp-web'], category: 'social', riskKeywords: ['web-login', 'sms-code', 'backup-restore'] },
  { name: 'Telegram', domain: 'telegram.org', aliases: ['t.me', 'tele-gram'], category: 'social', riskKeywords: ['session-expired', 'crypto-airdrop', 'bot-login'] },

  // Financial Institutions & Banking
  { name: 'PayPal', domain: 'paypal.com', aliases: ['pay-pal', 'paypal-service', 'paypal-security'], category: 'finance', riskKeywords: ['resolution-center', 'unauthorized-transaction', 'account-limited', 'confirm-identity', 'webscr'] },
  { name: 'Chase Bank', domain: 'chase.com', aliases: ['jpmorganchase', 'chase-online'], category: 'finance', riskKeywords: ['fraud-alert', 'card-locked', 'verify-wire', 'secure-signon'] },
  { name: 'Bank of America', domain: 'bankofamerica.com', aliases: ['bofa', 'boa-online'], category: 'finance', riskKeywords: ['passcode', 'security-lock', 'online-id', 'safepass'] },
  { name: 'Wells Fargo', domain: 'wellsfargo.com', aliases: ['wellsfargobank', 'wf-online'], category: 'finance', riskKeywords: ['account-hold', 'signon-notice', 'protect-access'] },
  { name: 'Citibank', domain: 'citi.com', aliases: ['citibank', 'citicards'], category: 'finance', riskKeywords: ['card-activation', 'unusual-charge', 'citi-alert'] },
  { name: 'American Express', domain: 'americanexpress.com', aliases: ['amex', 'amex-rewards'], category: 'finance', riskKeywords: ['statement-ready', 'fraud-notice', 'confirm-card'] },
  { name: 'Stripe', domain: 'stripe.com', aliases: ['stripe-billing', 'stripe-connect'], category: 'finance', riskKeywords: ['payout-hold', 'kyc-upload', 'merchant-review'] },
  { name: 'Capital One', domain: 'capitalone.com', aliases: ['cap-one'], category: 'finance', riskKeywords: ['fraud-warning', 'account-update'] },

  // Cryptocurrency & Web3
  { name: 'Binance', domain: 'binance.com', aliases: ['binance-us', 'bnb-chain'], category: 'crypto', riskKeywords: ['withdrawal-request', 'kyc-renewal', 'airdrop-claim', 'security-2fa'] },
  { name: 'Coinbase', domain: 'coinbase.com', aliases: ['coinbase-pro', 'coinbase-wallet'], category: 'crypto', riskKeywords: ['vault-unlock', 'anti-phishing-code', 'unauthorized-withdrawal'] },
  { name: 'MetaMask', domain: 'metamask.io', aliases: ['meta-mask', 'metamask-wallet'], category: 'crypto', riskKeywords: ['seed-phrase', 'secret-recovery', 'sync-wallet', 'v2-migration'] },
  { name: 'OpenSea', domain: 'opensea.io', aliases: ['open-sea'], category: 'crypto', riskKeywords: ['nft-airdrop', 'offer-accepted', 'urgent-mint'] },
  { name: 'Ledger', domain: 'ledger.com', aliases: ['ledger-live'], category: 'crypto', riskKeywords: ['firmware-update', 'backup-seed', 'compromise-notice'] },
  { name: 'Trust Wallet', domain: 'trustwallet.com', aliases: ['trust-wallet'], category: 'crypto', riskKeywords: ['passphrase-verify', 'token-claim'] },

  // Logistics & Delivery
  { name: 'DHL', domain: 'dhl.com', aliases: ['dhl-express', 'dhl-parcel'], category: 'logistics', riskKeywords: ['customs-duty', 'delivery-failed', 'tracking-update', 'redelivery-fee'] },
  { name: 'FedEx', domain: 'fedex.com', aliases: ['fed-ex', 'fedex-shipping'], category: 'logistics', riskKeywords: ['package-pending', 'pay-clearance', 'address-correction'] },
  { name: 'UPS', domain: 'ups.com', aliases: ['ups-tracking', 'united-parcel-service'], category: 'logistics', riskKeywords: ['delivery-fee', 'shipping-status', 'package-hold'] },
  { name: 'USPS', domain: 'usps.com', aliases: ['us-postal', 'postal-service'], category: 'logistics', riskKeywords: ['redelivery-schedule', 'incomplete-address', 'postage-due'] },

  // Productivity & Business Services
  { name: 'DocuSign', domain: 'docusign.com', aliases: ['docu-sign', 'docusign-net'], category: 'productivity', riskKeywords: ['sign-document', 'completed-invoice', 'urgent-signature', 'view-agreement'] },
  { name: 'Dropbox', domain: 'dropbox.com', aliases: ['drop-box'], category: 'productivity', riskKeywords: ['shared-invoice', 'file-access', 'password-needed'] },
  { name: 'Adobe', domain: 'adobe.com', aliases: ['adobe-sign', 'acrobat-cloud'], category: 'productivity', riskKeywords: ['pdf-shared', 'sign-in-to-view', 'cloud-storage'] },
  { name: 'Zoom', domain: 'zoom.us', aliases: ['zoom-video', 'zoom-meeting'], category: 'productivity', riskKeywords: ['missed-meeting', 'voicemail-recording', 'webinar-invite'] },
  { name: 'Slack', domain: 'slack.com', aliases: ['slack-workspace'], category: 'productivity', riskKeywords: ['workspace-login', 'urgent-message', 'admin-permission'] },

  // Gaming & Entertainment
  { name: 'Steam / Valve', domain: 'steampowered.com', aliases: ['steamcommunity', 'steam-store'], category: 'tech', riskKeywords: ['trade-offer', 'free-csgo-skins', 'api-key-verify', 'account-vac'] },
  { name: 'Roblox', domain: 'roblox.com', aliases: ['rbx-rewards', 'free-robux'], category: 'tech', riskKeywords: ['free-robux', 'redeem-code', 'moderation-appeal'] },
  { name: 'Epic Games', domain: 'epicgames.com', aliases: ['fortnite-vbucks'], category: 'tech', riskKeywords: ['vbucks-generator', 'account-recovery'] },
  { name: 'Spotify', domain: 'spotify.com', aliases: ['spotify-family'], category: 'tech', riskKeywords: ['premium-renewal', 'payment-failed'] },

  // Government & Tax
  { name: 'IRS (Internal Revenue Service)', domain: 'irs.gov', aliases: ['irs-tax', 'us-treasury'], category: 'government', riskKeywords: ['tax-refund', 'stimulus-check', 'audit-notice', 'immediate-payment'] },
  { name: 'Gov.UK / HMRC', domain: 'gov.uk', aliases: ['hmrc-tax', 'uk-tax-rebate'], category: 'government', riskKeywords: ['tax-rebate', 'claim-refund', 'council-tax'] },
];

export const SUSPICIOUS_SUBDOMAINS = [
  'login', 'secure', 'verify', 'update', 'account', 'banking', 'support', 'portal',
  'billing', 'service', 'client', 'webscr', 'auth', 'signin', 'admin', 'recovery',
  'security-check', 'customer-service', 'id-verify', 'mfa-challenge'
];

export const HIGH_RISK_KEYWORDS = [
  'urgent', 'immediate action required', 'account suspended', 'unauthorized access',
  'wire transfer', 'password expired', 'tax refund', 'bitcoin payout', 'gift card',
  'seed phrase', 'secret key', 'verify within 24 hours', 'limited access',
  'security breach', 'click here to confirm', 'billing failure', 'legal lawsuit'
];
