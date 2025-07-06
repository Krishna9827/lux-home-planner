
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

export const generateCostPDF = (
  projectData: ProjectData, 
  rooms: Room[], 
  categoryTotals: Record<string, number>, 
  grandTotal: number
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Cost Estimate - ${projectData.projectName}</title>
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
        .category-breakdown {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .category-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .category-item:last-child {
          border-bottom: none;
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
        <h1>Cost Estimate</h1>
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
        <div class="total-amount">₹${grandTotal.toLocaleString()}</div>
        <div>Total Estimated Project Cost</div>
      </div>

      <div class="category-breakdown">
        <h2 style="color: #0891b2; margin-top: 0;">Category-wise Breakdown</h2>
        ${Object.entries(categoryTotals).map(([category, total]) => `
          <div class="category-item">
            <span><strong>${category}</strong></span>
            <span>₹${total.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>

      <div class="disclaimer">
        <div class="disclaimer-title">⚠️ Important Disclaimer</div>
        <div class="disclaimer-text">
          This is a preliminary estimate based on standard pricing. Final quotation may vary based on 
          site conditions, customization requirements, brand preferences, and current market rates. 
          Please contact us for a detailed quotation.
        </div>
      </div>

      <div class="footer">
        <p><strong>Home Automation Planning System</strong></p>
        <p>Professional electrical and appliance planning made simple</p>
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
