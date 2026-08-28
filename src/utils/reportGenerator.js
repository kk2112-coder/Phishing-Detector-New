export function exportScanResultAsJson(result) {
  const jsonStr = JSON.stringify(result, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `phishguard-incident-report-${result.id}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printIncidentReport(result) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cyber Incident Report - ${result.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; padding: 40px; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
          .danger { background: #fee2e2; color: #b91c1c; }
          .warning { background: #fef3c7; color: #b45309; }
          .safe { background: #dcfce7; color: #15803d; }
          .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
          .indicator { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
          .indicator:last-child { border-bottom: none; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { text-align: left; padding: 8px 12px; border: 1px solid #e2e8f0; }
          th { background: #f8fafc; font-weight: 600; }
          .footer { margin-top: 40px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">🛡️ PhishGuard AI - Incident & Threat Analysis Report</div>
          <div>Report ID: <strong>${result.id}</strong> | Timestamp: ${result.timestamp}</div>
        </div>

        <div class="card">
          <h3>Target Overview</h3>
          <p><strong>Category:</strong> ${result.category.toUpperCase()}</p>
          <p><strong>Target Analyzed:</strong> <code>${escapeHtml(result.target)}</code></p>
          <p><strong>Overall Risk Score:</strong> <strong>${result.riskScore}/100</strong> (<span class="badge ${result.threatLevel === 'malicious' ? 'danger' : result.threatLevel === 'suspicious' ? 'warning' : 'safe'}">${result.threatLevel}</span>)</p>
          <p><strong>Threat Summary:</strong> ${result.summary}</p>
        </div>

        ${result.brandImpersonation ? `
          <div class="card">
            <h3>Brand Impersonation Detected</h3>
            <p><strong>Targeted Brand:</strong> ${result.brandImpersonation.brandName}</p>
            <p><strong>Canonical Domain:</strong> ${result.brandImpersonation.canonicalDomain}</p>
            <p><strong>Spoof Type:</strong> ${result.brandImpersonation.matchType}</p>
            <p><strong>Similarity Rating:</strong> ${result.brandImpersonation.similarityScore}%</p>
          </div>
        ` : ''}

        <div class="card">
          <h3>Indicators of Compromise (IoCs) & Red Flags</h3>
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Indicator</th>
                <th>Description</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              ${result.indicators.map(ind => `
                <tr>
                  <td><span class="badge ${ind.severity === 'danger' ? 'danger' : ind.severity === 'warning' ? 'warning' : 'safe'}">${ind.severity}</span></td>
                  <td><strong>${ind.name}</strong></td>
                  <td>${ind.description}</td>
                  <td><code>${escapeHtml(ind.evidence)}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3>Recommended Mitigation Actions</h3>
          <ul>
            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">
          Generated automatically by PhishGuard AI Threat Intelligence Engine.
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
