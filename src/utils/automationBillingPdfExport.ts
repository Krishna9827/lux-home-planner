
interface ProjectData {
  projectName: string;
  clientName: string;
  architectName: string;
  designerName: string;
  notes: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
  appliances: any[];
}

export const generateAutomationBillingPDF = (
  projectData: ProjectData, 
  rooms: Room[], 
  automationType: 'wired' | 'wireless',
  billingData: any,
  knxWireLength?: number
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${automationType === 'wired' ? 'Wired' : 'Wireless'} Automation Billing - ${projectData.projectName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0891b2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0891b2;
          margin: 0;
          font-size: 28px;
        }
        .automation-type {
          background: ${automationType === 'wired' ? '#f97316' : '#3b82f6'};
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          display: inline-block;
          margin: 10px 0;
          font-weight: bold;
        }
        .project-info {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .total-cost {
          background: linear-gradient(135deg, #0891b2, #0e7490);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }
        .total-amount {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .breakdown-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .breakdown-item:last-child {
          border-bottom: none;
        }
        .optimization-note {
          background: #dcfce7;
          border: 1px solid #16a34a;
          padding: 10px;
          border-radius: 6px;
          margin: 10px 0;
          font-size: 14px;
          color: #166534;
        }
        .requirements {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }
        .requirement-box {
          text-align: center;
          padding: 20px;
          background: #f1f5f9;
          border-radius: 8px;
          min-width: 120px;
        }
        .requirement-number {
          font-size: 24px;
          font-weight: bold;
          color: #0891b2;
        }
        .disclaimer {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin-top: 30px;
        }
        .disclaimer-title {
          font-weight: bold;
          color: #92400e;
          margin-bottom: 5px;
        }
        .disclaimer-text {
          color: #92400e;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Automation Billing Estimate</h1>
        <div class="automation-type">${automationType === 'wired' ? '⚡ Wired' : '📶 Wireless'} Automation</div>
        <p style="margin: 10px 0; color: #64748b;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="project-info">
        <h2 style="color: #0891b2; margin-top: 0;">Project Information</h2>
        <p><strong>Project Name:</strong> ${projectData.projectName}</p>
        <p><strong>Client:</strong> ${projectData.clientName}</p>
        ${projectData.architectName ? `<p><strong>Architect:</strong> ${projectData.architectName}</p>` : ''}
        ${projectData.designerName ? `<p><strong>Interior Designer:</strong> ${projectData.designerName}</p>` : ''}
      </div>

      <div class="total-cost">
        <div class="total-amount">₹${billingData.totalCost.toLocaleString()}</div>
        <div>Total ${automationType === 'wired' ? 'Wired' : 'Wireless'} Automation Cost</div>
      </div>

      ${automationType === 'wired' ? `
        <div class="requirements">
          <div class="requirement-box">
            <div class="requirement-number">${billingData.totalOnOffPoints}</div>
            <div>ON/OFF Points</div>
          </div>
          <div class="requirement-box">
            <div class="requirement-number">${billingData.totalLightingChannels}</div>
            <div>Lighting Channels</div>
          </div>
        </div>

        ${billingData.onOffOptimization.modules.length > 0 ? `
        <div class="breakdown-section">
          <h3 style="color: #0891b2; margin-top: 0;">ON/OFF Actuators</h3>
          ${billingData.onOffOptimization.modules.map((module: any) => `
            <div class="breakdown-item">
              <span><strong>${module.name}</strong> (Qty: ${module.quantity})</span>
              <span>₹${(module.price * module.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          <div class="optimization-note">
            ✓ ${billingData.onOffOptimization.recommendation}
          </div>
        </div>` : ''}

        ${billingData.lightingOptimization.modules.length > 0 ? `
        <div class="breakdown-section">
          <h3 style="color: #0891b2; margin-top: 0;">Lighting Modules</h3>
          ${billingData.lightingOptimization.modules.map((module: any) => `
            <div class="breakdown-item">
              <span><strong>${module.name}</strong> (Qty: ${module.quantity})</span>
              <span>₹${(module.price * module.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          <div class="optimization-note">
            ✓ ${billingData.lightingOptimization.recommendation}
          </div>
        </div>` : ''}

        <div class="breakdown-section">
          <h3 style="color: #0891b2; margin-top: 0;">Mandatory Components</h3>
          ${billingData.mandatoryComponents.map((component: any) => `
            <div class="breakdown-item">
              <span><strong>${component.name}</strong></span>
              <span>₹${component.price.toLocaleString()}</span>
            </div>
          `).join('')}
          ${knxWireLength && knxWireLength > 0 ? `
            <div class="breakdown-item">
              <span><strong>KNX Wiring</strong> (${knxWireLength} meters @ ₹80/meter)</span>
              <span>₹${billingData.wiringCost.toLocaleString()}</span>
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="breakdown-section">
          <h3 style="color: #0891b2; margin-top: 0;">Wireless Device Breakdown</h3>
          ${billingData.breakdown.map((item: any) => `
            <div class="breakdown-item">
              <span><strong>${item.applianceName}</strong> (${item.roomName}) - Qty: ${item.quantity}</span>
              <span>₹${item.totalPrice.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      `}

      <div class="disclaimer">
        <div class="disclaimer-title">⚠️ Important Disclaimer</div>
        <div class="disclaimer-text">
          This is a preliminary estimate based on ${automationType} automation requirements. 
          Final quotation may vary based on site conditions, customization requirements, brand preferences, 
          and current market rates. ${automationType === 'wired' ? 'Wired automation pricing includes optimized module selection for maximum cost efficiency.' : ''}
          Please contact us for a detailed quotation.
        </div>
      </div>

      <div class="footer">
        <p><strong>Home Automation Planning System</strong></p>
        <p>Professional ${automationType} automation planning made simple</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
