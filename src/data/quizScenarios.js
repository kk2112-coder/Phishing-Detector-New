export const QUIZ_SCENARIOS = [
  {
    id: 'quiz-1',
    title: 'Microsoft 365 Password Expiration Alert',
    difficulty: 'easy',
    category: 'email',
    isPhishing: true,
    scenarioDescription: 'You receive an urgent notification in your inbox stating your company Office 365 password will expire in 3 hours.',
    content: {
      sender: '"IT Help Desk Support" <no-reply@m365-security-update-portal.xyz>',
      subject: 'URGENT: Your Office 365 Password Expires in 3 Hours - Action Required',
      date: 'Today, 09:14 AM',
      body: `Dear Employee,\n\nYour organization Microsoft 365 corporate account password will expire today at 12:00 PM. Failure to retain your current password will result in immediate suspension of your email and cloud files.\n\nPlease click the button below immediately to keep your current credentials:\n\n[ KEEP MY SAME PASSWORD ] -> (Points to: http://login-microsoft365-verify.com.auth-token.xyz/login)\n\nThank you,\nGlobal IT Support Team`,
    },
    redFlags: [
      {
        element: 'm365-security-update-portal.xyz',
        explanation: 'Suspicious sender domain ending in .xyz instead of an official company or microsoft.com domain.'
      },
      {
        element: 'URGENT: ... Expires in 3 Hours',
        explanation: 'Artificial sense of urgency designed to trigger panic and bypass critical thinking.'
      },
      {
        element: 'http://login-microsoft365-verify.com.auth-token.xyz/login',
        explanation: 'The actual destination is a subdomain of auth-token.xyz on insecure HTTP, not microsoft.com.'
      },
      {
        element: 'Keep your current credentials',
        explanation: 'Legitimate password expiration systems never let you click an email link to "keep your old password" without authenticating through your company SSO/MFA.'
      }
    ],
    explanation: 'This is a classic credential harvesting email disguised as an internal IT notification. It employs high urgency, a spoofed sender name with an untrusted .xyz domain, and directs to a fraudulent domain.',
    tips: [
      'Always inspect the sender email address after the @ symbol, not just the display name.',
      'Hover over links or inspect the URL before clicking to verify the real destination.',
      'Check with your internal IT department through known channels (Slack, Teams, internal ticketing).'
    ]
  },
  {
    id: 'quiz-2',
    title: 'PayPal Unauthorized Payment Notification',
    difficulty: 'medium',
    category: 'email',
    isPhishing: true,
    scenarioDescription: 'An email arrives with PayPal branding claiming a $849.99 crypto purchase was made from your account in another country.',
    content: {
      sender: '"PayPal Service" <service@paypal.com.verify-billing-center.work>',
      subject: 'Receipt for your payment of $849.99 to Coinbase Inc.',
      date: 'Yesterday, 11:42 PM',
      body: `Hello Customer,\n\nYou sent a payment of $849.99 USD to Coinbase Global Inc. using your linked debit card.\n\nTransaction ID: 9X29104882193\nDate: 28 Aug 2026\n\nIf you DID NOT authorize this transaction, click Cancel & Dispute immediately within 12 hours:\n\n[ CANCEL THIS TRANSACTION NOW ] -> (Points to: http://paypa1-dispute-resolution.net/signin)\n\nNote: If you do not dispute within 12 hours, funds will be permanently transferred.`,
    },
    redFlags: [
      {
        element: 'service@paypal.com.verify-billing-center.work',
        explanation: 'Subdomain trickery: "paypal.com" is placed as a subdomain in front of the actual domain "verify-billing-center.work".'
      },
      {
        element: 'paypa1-dispute-resolution.net',
        explanation: 'Typosquatting: Uses the numeral "1" instead of the letter "l" in paypa1.'
      },
      {
        element: 'Generic greeting "Hello Customer"',
        explanation: 'PayPal always addresses users by their registered first and last name, never generic terms.'
      },
      {
        element: 'Threat of permanent fund transfer',
        explanation: 'Coercive psychological pressure to force an impulsive click.'
      }
    ],
    explanation: 'A counterfeit PayPal receipt exploiting panic over unauthorized charges. It uses typosquatting (paypa1), subdomain camouflage, and a generic greeting to siphon your login and financial credentials.',
    tips: [
      'Legitimate financial institutions like PayPal will always address you by your real full name.',
      'Never click dispute links in unexpected receipts. Open your PayPal app or go directly to paypal.com in a new browser tab.'
    ]
  },
  {
    id: 'quiz-3',
    title: 'GitHub Security Alert - New SSH Key Added',
    difficulty: 'hard',
    category: 'email',
    isPhishing: false,
    scenarioDescription: 'You receive a notification from GitHub alerting you that a new SSH public key was added to your account.',
    content: {
      sender: '"GitHub" <noreply@github.com>',
      subject: '[GitHub] A new public key was added to your account',
      date: 'Today, 02:15 PM',
      body: `Hi dev-alex,\n\nA new SSH public key (SHA256:7uK...9aB) was recently added to your account @dev-alex by user agent Git/2.44.\n\nIf you did this, you can safely ignore this email.\n\nIf you did not add this key, please visit your account security settings to delete it and review your active sessions:\nhttps://github.com/settings/keys\n\nTo learn more about SSH keys, visit https://docs.github.com/articles/about-ssh`,
    },
    redFlags: [],
    explanation: 'This is a 100% LEGITIMATE security notification from GitHub. It comes from the official @github.com domain, addresses the user by their exact username (@dev-alex), contains no alarmist threats or coercive countdowns, and links directly to official https://github.com URLs.',
    tips: [
      'Legitimate notifications do not panic you with artificial 1-hour countdowns.',
      'The sender domain matches the official root domain (@github.com) with valid SPF/DKIM authentication.',
      'Links point directly to genuine HTTPS endpoints with no redirected proxy domains.'
    ]
  },
  {
    id: 'quiz-4',
    title: 'FedEx Package Incomplete Address (Smishing)',
    difficulty: 'easy',
    category: 'sms',
    isPhishing: true,
    scenarioDescription: 'You receive an SMS on your mobile phone claiming your parcel delivery failed due to a missing house number.',
    content: {
      smsSender: '+1 (833) 492-0199',
      body: `[FedEx-Tracking]: Your package #FDX-83921 cannot be delivered due to an incomplete street address. Please update your delivery address & pay the $1.95 redelivery fee to avoid return to sender: https://fedx-parcel-schedule.top/update`,
    },
    redFlags: [
      {
        element: 'fedx-parcel-schedule.top',
        explanation: 'Typosquatting missing the "e" (fedx) coupled with a high-risk .top TLD.'
      },
      {
        element: '$1.95 redelivery fee',
        explanation: 'Classic credit card harvesting lure: Asking for a tiny amount (under $2) to get users to input full card number, CVV, and billing address.'
      },
      {
        element: 'Random toll-free / spoofed VoIP phone number',
        explanation: 'Official carriers do not text from random VoIP numbers with .top domains.'
      }
    ],
    explanation: 'This is a rampant form of SMS Phishing ("Smishing"). The scammer seeks to harvest your credit card details and personal identity by charging a nominal fee for a fake delayed parcel.',
    tips: [
      'Logistics companies do not hold packages hostage over tiny $1-$2 online fees via text.',
      'Use the carrier official app or track directly on fedex.com using your original receipt tracking number.'
    ]
  },
  {
    id: 'quiz-5',
    title: 'Google Account Storage Full Warning',
    difficulty: 'medium',
    category: 'website',
    isPhishing: true,
    scenarioDescription: 'A browser popup claims your Google Drive storage is 100% full and your emails will be permanently deleted.',
    content: {
      landingPageMock: {
        title: 'Google One - Critical Storage Alert',
        logoText: 'Google',
        inputs: ['Email or phone', 'Enter your current password'],
        actionBtnText: 'Sign In to Claim +50GB Free Storage',
        fakeDomain: 'https://accounts-google.com-storage-upgrade.site/signin',
        lockIcon: true,
        countdown: '08:42 remaining before mailbox deletion'
      },
      body: 'Your Google Drive & Gmail storage limit has been exceeded (15.2 GB / 15 GB). Upgrade for free today before incoming emails are bounced.',
    },
    redFlags: [
      {
        element: 'accounts-google.com-storage-upgrade.site',
        explanation: 'Domain hierarchy deception: The actual root domain is "com-storage-upgrade.site", not "google.com".'
      },
      {
        element: 'Countdown timer: 08:42 remaining',
        explanation: 'Fake urgency mechanism to rush the victim into submitting their password.'
      },
      {
        element: 'Password field on non-google page',
        explanation: 'Never enter your Google password into any domain other than accounts.google.com.'
      }
    ],
    explanation: 'A cloned Google One landing page designed to capture credentials. The domain ends in .site, not google.com, and features an artificial countdown timer.',
    tips: [
      'Google authentication always happens exclusively on https://accounts.google.com.',
      'Check the browser address bar for the domain immediately preceding the first single slash "/".'
    ]
  },
  {
    id: 'quiz-6',
    title: 'Bank of America Two-Factor Auth Verification',
    difficulty: 'hard',
    category: 'sms',
    isPhishing: true,
    scenarioDescription: 'A text message claims an unrecognized login attempt occurred in another state, followed by an immediate phone prompt.',
    content: {
      smsSender: 'BOA-ALERTS',
      body: `BofA Fraud Alert: Did you attempt a $1,200.00 Zelle transfer from Dallas, TX? If NO, reply STOP or immediately verify your identity to cancel at: https://bofa-fraud-prevention.live/auth`,
    },
    redFlags: [
      {
        element: 'bofa-fraud-prevention.live',
        explanation: 'Unofficial domain ending in .live. Bank of America exclusively uses bankofamerica.com.'
      },
      {
        element: 'Reply STOP or link click',
        explanation: 'Replying confirms your phone number is active for further spam; clicking the link leads to a 2FA token harvesting portal.'
      }
    ],
    explanation: 'An advanced smishing attack known as a Reverse 2FA Proxy. When you enter your credentials on the fake site, the attackers trigger a real bank login and prompt you for the SMS OTP code to drain funds.',
    tips: [
      'If you receive an alert about a suspicious bank transfer, hang up and call the number on the back of your debit/credit card.',
      'Banks will never send links asking you to enter your online banking credentials or OTP to "cancel" a transaction.'
    ]
  },
  {
    id: 'quiz-7',
    title: 'Restaurant Table QR Code Quishing Trap',
    difficulty: 'medium',
    category: 'qr',
    isPhishing: true,
    scenarioDescription: 'You scan a physical sticker placed on a restaurant dining table that promises "Scan for 20% Off Bill & Digital Menu".',
    content: {
      url: 'http://dine-rewards-menu.xyz/login?ref=table4&promo=20OFF',
      body: 'Sticker scanned on table: Directs to a webpage requesting you to log in with your Google or Facebook account to unlock the menu discount.',
    },
    redFlags: [
      {
        element: 'dine-rewards-menu.xyz',
        explanation: 'Untrusted .xyz domain hosted over unencrypted HTTP.'
      },
      {
        element: 'Physical QR Code Overlay',
        explanation: 'Attackers frequently stick fraudulent QR stickers over genuine restaurant or parking meter QR codes (Quishing).'
      },
      {
        element: 'Social login required to view a menu',
        explanation: 'Legitimate digital menus do not require logging in with your OAuth credentials or passwords.'
      }
    ],
    explanation: 'QR Code Phishing ("Quishing") leverages physical tampering. Scammers paste malicious QR stickers over real menus or parking meters to route users to credential-stealing portals.',
    tips: [
      'Check physical QR codes for signs of tampering (e.g. a sticker slapped on top of the original print).',
      'Always inspect the preview URL displayed by your camera app before tapping to open it.'
    ]
  },
  {
    id: 'quiz-8',
    title: 'DocuSign Electronic Signature Request',
    difficulty: 'easy',
    category: 'email',
    isPhishing: true,
    scenarioDescription: 'An email states that an urgent Non-Disclosure Agreement (NDA) and bonus settlement agreement has been shared with you.',
    content: {
      sender: '"DocuSign System" <dse@docusign-contracts-review.net>',
      subject: 'Please DocuSign: 2026 Compensation & Bonus Revision Agreement.pdf',
      date: 'Today, 04:20 PM',
      body: `DocuSign Electronic Signature Service\n\nHR Department has sent you a document for signature.\n\nDocument: 2026_Executive_Compensation.pdf\nAccess Code: None\n\n[ REVIEW & SIGN DOCUMENT ] -> (Points to: http://docusign.net.login-session-check.com/dse/auth)`,
    },
    redFlags: [
      {
        element: 'docusign-contracts-review.net',
        explanation: 'Unofficial sender domain. Official DocuSign notifications come from @docusign.net or @docusign.com.'
      },
      {
        element: 'docusign.net.login-session-check.com',
        explanation: 'Subdomain spoofing: "login-session-check.com" is the real destination domain.'
      },
      {
        element: 'Financial lure: "Compensation & Bonus Revision"',
        explanation: 'Exploiting curiosity and personal greed to provoke instant clicks.'
      }
    ],
    explanation: 'DocuSign is one of the most heavily spoofed brands for corporate phishing. Attackers use compensation-themed lures to steal corporate credentials.',
    tips: [
      'You can verify DocuSign documents safely by going directly to docusign.com and entering the unique Security Code at the bottom of the document.'
    ]
  }
];
