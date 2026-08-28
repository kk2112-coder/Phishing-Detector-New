import jsQR from 'jsqr';
import { analyzeUrl } from './urlAnalyzer';

export async function decodeQrFromImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          const payload = code.data.trim();
          let scanResult;

          if (/^https?:\/\//i.test(payload) || payload.includes('.')) {
            scanResult = analyzeUrl(payload);
            scanResult.category = 'qr';
            scanResult.target = `QR Payload: ${payload}`;
          } else {
            scanResult = {
              id: `qr-${Date.now().toString(36)}`,
              target: payload,
              category: 'qr',
              timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
              riskScore: 20,
              threatLevel: 'low',
              summary: 'QR contains plain text or non-URL data.',
              indicators: [{
                id: 'ind-qr-text',
                name: 'Plain Text QR Payload',
                category: 'content',
                severity: 'info',
                description: 'Payload is not an executable link or web domain.',
                evidence: payload,
                scoreImpact: 10
              }],
              recommendations: ['Verify text content before trusting instructions.']
            };
          }

          resolve({ payload, scanResult });
        } else {
          reject(new Error('No valid QR code detected in this image. Please ensure the QR code is clear and well-lit.'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for scanning'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
