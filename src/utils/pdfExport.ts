
interface ProjectData {
  projectName: string;
  clientName: string;
  architectName: string;
  designerName: string;
  notes: string;
}

interface Appliance {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  quantity: number;
  wattage?: number;
  specifications: Record<string, any>;
}

interface Room {
  id: string;
  name: string;
  type: string;
  appliances: Appliance[];
}

export const generatePDF = (projectData: ProjectData, rooms: Room[]) => {
  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${projectData.projectName} - Project Summary</title>
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
        .project-info h2 {
          color: #0891b2;
          margin-top: 0;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          color: #64748b;
          font-size: 14px;
        }
        .info-value {
          color: #1e293b;
          font-size: 16px;
        }
        .summary-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: linear-gradient(135deg, #0891b2, #0e7490);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }
        .room-section {
          margin-bottom: 40px;
          break-inside: avoid;
        }
        .room-header {
          background: #0891b2;
          color: white;
          padding: 15px 20px;
          border-radius: 8px 8px 0 0;
          margin: 0;
        }
        .room-content {
          border: 1px solid #e2e8f0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          padding: 20px;
        }
        .appliance-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .appliance-item:last-child {
          border-bottom: none;
        }
        .appliance-info {
          flex: 1;
        }
        .appliance-name {
          font-weight: 600;
          color: #1e293b;
        }
        .appliance-category {
          font-size: 12px;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
          margin-top: 4px;
        }
        .appliance-specs {
          text-align: right;
          color: #64748b;
          font-size: 14px;
        }
        .category-summary {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .category-summary h2 {
          color: #0891b2;
          margin-top: 0;
        }
        .category-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .category-item:last-child {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .room-section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Project Summary</h1>
        <p style="margin: 10px 0; color: #64748b;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="project-info">
        <h2>Project Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Project Name</div>
            <div class="info-value">${projectData.projectName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Client</div>
            <div class="info-value">${projectData.clientName}</div>
          </div>
          ${projectData.architectName ? `
          <div class="info-item">
            <div class="info-label">Architect</div>
            <div class="info-value">${projectData.architectName}</div>
          </div>
          ` : ''}
          ${projectData.designerName ? `
          <div class="info-item">
            <div class="info-label">Interior Designer</div>
            <div class="info-value">${projectData.designerName}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="summary-stats">
        <div class="stat-card">
          <div class="stat-number">${rooms.length}</div>
          <div class="stat-label">Total Rooms</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${rooms.reduce((total, room) => total + room.appliances.reduce((sum, app) => sum + app.quantity, 0), 0)}</div>
          <div class="stat-label">Total Appliances</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${rooms.reduce((total, room) => total + room.appliances.reduce((sum, app) => sum + (app.wattage || 0) * app.quantity, 0), 0)}W</div>
          <div class="stat-label">Total Power</div>
        </div>
      </div>

      ${generateCategorySummary(rooms)}

      ${rooms.map(room => `
        <div class="room-section">
          <h3 class="room-header">${room.name} (${room.type})</h3>
          <div class="room-content">
            ${room.appliances.length > 0 ? 
              room.appliances.map(appliance => `
                <div class="appliance-item">
                  <div class="appliance-info">
                    <div class="appliance-name">${appliance.name}</div>
                    <span class="appliance-category">${appliance.category}</span>
                    ${appliance.subcategory ? `<span class="appliance-category">${appliance.subcategory}</span>` : ''}
                  </div>
                  <div class="appliance-specs">
                    <div>Qty: ${appliance.quantity}</div>
                    ${appliance.wattage ? `<div>${appliance.wattage}W each</div>` : ''}
                  </div>
                </div>
              `).join('') 
              : '<p style="color: #64748b; font-style: italic;">No appliances added</p>'
            }
          </div>
        </div>
      `).join('')}

      ${projectData.notes ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h2 style="color: #0891b2; margin-top: 0;">Project Notes</h2>
          <p style="white-space: pre-wrap; color: #1e293b;">${projectData.notes}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>Home Automation Planning System</strong></p>
        <p>Professional electrical and appliance planning made simple</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
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

function generateCategorySummary(rooms: Room[]) {
  const categoryTotals = rooms.reduce((acc, room) => {
    room.appliances.forEach(appliance => {
      if (!acc[appliance.category]) {
        acc[appliance.category] = { count: 0, totalWattage: 0 };
      }
      acc[appliance.category].count += appliance.quantity;
      acc[appliance.category].totalWattage += (appliance.wattage || 0) * appliance.quantity;
    });
    return acc;
  }, {} as Record<string, { count: number; totalWattage: number }>);

  return `
    <div class="category-summary">
      <h2>Summary by Category</h2>
      ${Object.entries(categoryTotals).map(([category, data]) => `
        <div class="category-item">
          <span><strong>${category}</strong></span>
          <span>${data.count} items${data.totalWattage > 0 ? ` • ${data.totalWattage}W` : ''}</span>
        </div>
      `).join('')}
    </div>
  `;
}
