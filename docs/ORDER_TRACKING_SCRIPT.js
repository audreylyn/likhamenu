/**
 * Google Apps Script for Order Tracking - Unified System
 * 
 * This script handles order submissions from both Website and POS.
 * It separates orders into "Orders Website" and "Orders POS" tabs
 * and provides a unified Dashboard.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Paste this entire code
 * 4. Update ADMIN_EMAIL in the CONFIGURATION section
 * 5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 * 6. Copy the Web App URL and update your website configuration
 */

// ============================================
// 1. CONFIGURATION (Config.gs)
// ============================================
const CONFIG = {
  ADMIN_EMAIL: "likhasiteworks@gmail.com", // Change this to your email
  DRIVE_FOLDER_NAME: "Messenger/Order Tracking",
  SHEET_NAMES: {
    WEBSITE: "Orders Website",
    POS: "Orders POS",
    DASHBOARD: "Dashboard"
  },
  ORDER_STATUS_OPTIONS: ["Pending", "Processing", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"]
};

// ============================================
// 2. API HANDLER (API.gs)
// ============================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for lock

  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Extract order data
    const websiteId = data.websiteId || "unknown";
    const websiteTitle = data.websiteTitle || "Unknown Website";
    const source = data.source || "Website"; // "Website" or "POS"
    const orderData = data.order || {};
    
    // Validate required fields
    if (!orderData.customerName || !orderData.items || !orderData.items.length) {
      throw new Error("Missing required order data: customerName and items are required");
    }

    // Get or create the Drive folder
    const folder = getOrCreateFolder(CONFIG.DRIVE_FOLDER_NAME);
    
    // Get or create spreadsheet for this website
    const spreadsheet = getOrCreateSpreadsheet(folder, websiteId, websiteTitle);
    
    // Determine which sheet to use based on source
    const targetSheetName = (source === "POS") ? CONFIG.SHEET_NAMES.POS : CONFIG.SHEET_NAMES.WEBSITE;
    
    // Get or create the specific Orders sheet
    const sheet = getOrCreateOrdersSheet(spreadsheet, targetSheetName);
    
    // Remove default Sheet1 if it exists
    deleteDefaultSheet(spreadsheet);
    
    // Add the order to the spreadsheet
    addOrderToSheet(sheet, orderData, source);

    // Send New Order Notification to Admin
    sendNewOrderEmail(orderData, source, websiteTitle);
    
    // Update Dashboard (Aggregated)
    createOrUpdateDashboardSheet(spreadsheet, websiteTitle);
    
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "success",
        message: "Order saved successfully",
        spreadsheetUrl: spreadsheet.getUrl()
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error processing order:", error);
    
    // Send error notification email
    try {
      MailApp.sendEmail({
        to: CONFIG.ADMIN_EMAIL,
        subject: "Order Tracking Script Error",
        body: "An error occurred processing an order:\n\n" + error.toString() + "\n\nData: " + JSON.stringify(e.postData.contents)
      });
    } catch (emailError) {
      console.error("Failed to send error email:", emailError);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "error", 
        error: error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "3600"
    });
}

// ============================================
// 3. ORDER CONTROLLER (OrderController.gs)
// ============================================

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();
  
  // Create nested folders if needed
  const parts = folderName.split('/');
  let currentFolder = DriveApp.getRootFolder();
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    
    const subFolders = currentFolder.getFoldersByName(part);
    if (subFolders.hasNext()) {
      currentFolder = subFolders.next();
    } else {
      currentFolder = currentFolder.createFolder(part);
    }
  }
  return currentFolder;
}

function getOrCreateSpreadsheet(folder, websiteId, websiteTitle) {
  const expectedName = websiteTitle + " - Orders";
  const files = folder.getFilesByName(expectedName);
  
  if (files.hasNext()) {
    return SpreadsheetApp.openById(files.next().getId());
  } else {
    const spreadsheet = SpreadsheetApp.create(expectedName);
    const file = DriveApp.getFileById(spreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
    return spreadsheet;
  }
}

function getOrCreateOrdersSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Set up headers
    const headers = [
      "Order ID", "Date/Time", "Customer Name", "Customer Email", 
      "Location", "Items", "Item Details", "Total Amount", 
      "Note", "Status", "Source"
    ];
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    
    // Data Validation for Status
    const statusRange = sheet.getRange(2, 10, 1000, 1); // Column J
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.ORDER_STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .build();
    statusRange.setDataValidation(rule);
    
    // Column Widths
    sheet.setColumnWidth(1, 120); // ID
    sheet.setColumnWidth(2, 150); // Date
    sheet.setColumnWidth(3, 150); // Name
    sheet.setColumnWidth(6, 300); // Items
    sheet.setColumnWidth(7, 400); // Details
    
    sheet.setFrozenRows(1);
    setupStatusColorCoding(sheet);
  }
  
  return sheet;
}

function setupStatusColorCoding(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), 20);
  const dataRange = sheet.getRange(2, 1, lastRow, 10);
  
  const rules = [
    { status: "Pending", color: "#ffffff" },
    { status: "Processing", color: "#e3f2fd" },
    { status: "Preparing", color: "#ffe0b2" },
    { status: "Ready", color: "#c8e6c9" },
    { status: "Out for Delivery", color: "#e1bee7" },
    { status: "Delivered", color: "#a5d6a7" },
    { status: "Cancelled", color: "#ffcdd2" }
  ].map(r => SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`=$J2="${r.status}"`)
    .setBackground(r.color)
    .setRanges([dataRange])
    .build()
  );
  
  sheet.setConditionalFormatRules(rules);
}

function addOrderToSheet(sheet, orderData, source) {
  const orderId = "ORD-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
  const now = new Date();
  const dateTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  
  const itemsList = orderData.items.map(item => `${item.name} x${item.quantity}`).join("\n");
  
  const itemDetails = orderData.items.map(item => {
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const subtotal = unitPrice * item.quantity;
    return `${item.name}\n  Qty: ${item.quantity} | Unit: ${item.unitPrice} | Sub: ₱${subtotal.toFixed(2)}`;
  }).join("\n\n");
  
  const rowData = [
    orderId,
    dateTime,
    orderData.customerName || "",
    orderData.email || "",
    orderData.location || "",
    itemsList,
    itemDetails,
    orderData.totalFormatted || ("₱" + (orderData.total || 0).toFixed(2)),
    orderData.note || "",
    "Pending", // Default Status
    source
  ];
  
  sheet.insertRowBefore(2);
  sheet.getRange(2, 1, 1, rowData.length).setValues([rowData]);
  
  // Re-apply validation to new row
  const statusCell = sheet.getRange(2, 10);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.ORDER_STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .build();
  statusCell.setDataValidation(rule);
}

function deleteDefaultSheet(spreadsheet) {
  const sheet1 = spreadsheet.getSheetByName("Sheet1");
  if (sheet1 && spreadsheet.getSheets().length > 1) {
    try {
      spreadsheet.deleteSheet(sheet1);
    } catch (e) {
      console.warn("Could not delete Sheet1: " + e.toString());
    }
  }
}

function sendNewOrderEmail(orderData, source, websiteTitle) {
  try {
    const subject = `New Order: ${websiteTitle} (${source})`;
    const body = `
      New Order Received!
      
      Website: ${websiteTitle}
      Source: ${source}
      Customer: ${orderData.customerName}
      Email: ${orderData.email || "N/A"}
      Total: ${orderData.totalFormatted || orderData.total}
      
      Items:
      ${orderData.items.map(i => `- ${i.name} x${i.quantity}`).join("\n")}
      
      Please check the spreadsheet for full details.
    `;
    
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: subject,
      body: body
    });
    console.log("New order email sent to admin.");
  } catch (e) {
    console.error("Failed to send new order email:", e);
  }
}

// ============================================
// 4. DASHBOARD (Dashboard.gs)
// ============================================
function createOrUpdateDashboardSheet(spreadsheet, websiteTitle) {
  let dashboardSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.DASHBOARD);
  if (!dashboardSheet) {
    dashboardSheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.DASHBOARD);
    dashboardSheet.setTabColor("#1a73e8");
  } else {
    dashboardSheet.clear();
  }
  
  dashboardSheet.setHiddenGridlines(true);
  
  // Header
  dashboardSheet.getRange("B2:M3").merge()
    .setValue(`${websiteTitle} | UNIFIED DASHBOARD`)
    .setBackground("#202124")
    .setFontColor("#ffffff")
    .setFontSize(18)
    .setFontWeight("bold")
    .setVerticalAlignment("middle");

  // --- AGGREGATED FORMULAS ---
  // We need to sum data from BOTH sheets.
  // Formula strategy: SUM(IFERROR(Sheet1!...), 0) + SUM(IFERROR(Sheet2!...), 0)
  
  const webSheet = CONFIG.SHEET_NAMES.WEBSITE;
  const posSheet = CONFIG.SHEET_NAMES.POS;
  
  // Helper for safe range reference (handles if sheet doesn't exist yet)
  const getSumFormula = (col) => {
      return `SUM(IFERROR(ARRAYFORMULA(VALUE(SUBSTITUTE(SUBSTITUTE(INDIRECT("'${webSheet}'!${col}2:${col}"),"₱",""),",",""))), 0)) + ` +
        `SUM(IFERROR(ARRAYFORMULA(VALUE(SUBSTITUTE(SUBSTITUTE(INDIRECT("'${posSheet}'!${col}2:${col}"),"₱",""),",",""))), 0))`;
  };
  
  const getCountFormula = (col) => {
    // Use SUM + IFERROR + LEN check to avoid counting missing sheets as 1 (which COUNTA does with IFERROR("", ""))
    return `SUM(IFERROR(ARRAYFORMULA(N(LEN(INDIRECT("'${webSheet}'!${col}2:${col}"))>0)), 0)) + ` +
           `SUM(IFERROR(ARRAYFORMULA(N(LEN(INDIRECT("'${posSheet}'!${col}2:${col}"))>0)), 0))`;
  };
  
  const getPendingFormula = () => {
    // Wrap each COUNTIF in IFERROR to handle missing sheets
    return `(IFERROR(COUNTIF(INDIRECT("'${webSheet}'!J2:J"), "Pending"), 0) + IFERROR(COUNTIF(INDIRECT("'${webSheet}'!J2:J"), "Processing"), 0)) + ` +
           `(IFERROR(COUNTIF(INDIRECT("'${posSheet}'!J2:J"), "Pending"), 0) + IFERROR(COUNTIF(INDIRECT("'${posSheet}'!J2:J"), "Processing"), 0))`;
  };

  // KPI Cards
  createModernCard(dashboardSheet, "B5:E8", "TOTAL REVENUE", "=" + getSumFormula("H"), "₱#,##0.00", "#0f9d58");
  createModernCard(dashboardSheet, "F5:I8", "TOTAL ORDERS", "=" + getCountFormula("A"), "0", "#4285f4");
  createModernCard(dashboardSheet, "J5:M8", "PENDING ORDERS", "=" + getPendingFormula(), "0", "#db4437");

  // Charts Data Preparation (Hidden Columns O, P)
  // We use formulas for Status Distribution so it updates in real-time
  
  // Write Status Data Headers
  dashboardSheet.getRange("O1:P1").setValues([["Status", "Count"]]);
  dashboardSheet.getRange("O1:P1").setFontWeight("bold").setBackground("#f1f3f4");
  
  // Write Status Data Formulas
  CONFIG.ORDER_STATUS_OPTIONS.forEach((status, index) => {
    const row = 2 + index;
    dashboardSheet.getRange(row, 15).setValue(status); // Col O (15)
    // Formula: COUNTIF(Web!J2:J, status) + COUNTIF(POS!J2:J, status) using INDIRECT for stable references
    const formula = `=IFERROR(COUNTIF(INDIRECT("'${webSheet}'!J2:J"), "${status}"), 0) + IFERROR(COUNTIF(INDIRECT("'${posSheet}'!J2:J"), "${status}"), 0)`;
    dashboardSheet.getRange(row, 16).setFormula(formula); // Col P (16)
  });
  
  // For Top Products, we still need static calculation because parsing is complex
  const stats = calculateAggregatedStats(spreadsheet);
  
  // Write Top Products Data
  dashboardSheet.getRange("S1:T1").setValues([["Product", "Qty"]]);
  if (stats.productData.length) {
    dashboardSheet.getRange(2, 19, stats.productData.length, 2).setValues(stats.productData);
  }

  // Charts
  const pieChart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dashboardSheet.getRange(1, 15, CONFIG.ORDER_STATUS_OPTIONS.length + 1, 2)) // O1:P8
    .setPosition(10, 2, 0, 0)
    .setOption('title', 'Order Status Distribution (All Sources)')
    .setOption('pieHole', 0.4)
    .setOption('width', 550)
    .setOption('height', 350)
    .build();
  dashboardSheet.insertChart(pieChart);

  const barChart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dashboardSheet.getRange("S1:T6")) // Top 5
    .setPosition(10, 8, 0, 0)
    .setOption('title', 'Top 5 Best Sellers')
    .setOption('legend', {position: 'none'})
    .setOption('width', 550)
    .setOption('height', 350)
    .build();
  dashboardSheet.insertChart(barChart);

  // Remove leftover image named "pic1" if present (some templates include an embedded picture)
  try {
    // Try to remove over-grid images (newer API)
    if (dashboardSheet.getImages) {
      const images = dashboardSheet.getImages();
      images.forEach(img => {
        try {
          const title = (img.getAltTextTitle && img.getAltTextTitle()) || (img.getAltTextDescription && img.getAltTextDescription());
          if (title === 'pic1') {
            img.remove();
            console.log('Removed image pic1 from dashboard');
          }
        } catch (e) {}
      });
    }

    // Try to remove drawings/legacy images
    if (dashboardSheet.getDrawings) {
      const draws = dashboardSheet.getDrawings();
      draws.forEach(d => {
        try {
          if (d.getAltTextTitle && d.getAltTextTitle() === 'pic1') {
            d.remove();
            console.log('Removed drawing pic1 from dashboard');
          }
        } catch (e) {}
      });
    }
  } catch (err) {
    console.warn('Unable to remove image pic1:', err);
  }

  // Write recent orders (Top 8 newest) at the bottom of the dashboard
  writeRecentOrders(spreadsheet, dashboardSheet, webSheet, posSheet);
}

function createModernCard(sheet, rangeStr, title, formula, numFormat, accentColor) {
  const range = sheet.getRange(rangeStr);
  range.merge()
    .setFormula(formula)
    .setNumberFormat(numFormat)
    .setFontSize(28)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground("#ffffff")
    .setBorder(true, true, true, true, null, null, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);
    
  const titleRange = sheet.getRange(range.getRow() - 1, range.getColumn(), 1, range.getNumColumns());
  titleRange.merge()
    .setValue(title)
    .setFontSize(10)
    .setFontWeight("bold")
    .setFontColor(accentColor);
    
  range.setBorder(true, true, true, true, null, null, accentColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function calculateAggregatedStats(spreadsheet) {
  const sheets = [spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.WEBSITE), spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.POS)];
  const statusCounts = {};
  const productCounts = {};
  
  sheets.forEach(sheet => {
    if (!sheet || sheet.getLastRow() < 2) return;
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 10).getValues();
    
    data.forEach(row => {
      // Status
      const status = row[9] || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      // Products
      let itemsStr = row[5].toString();
      let items = itemsStr.includes("\n") ? itemsStr.split("\n") : itemsStr.split(",");
      items.forEach(item => {
        let parts = item.trim().split(" x");
        if (parts.length >= 2) {
          let name = parts[0].trim();
          // Remove options in parentheses
          name = name.replace(/\s*\(.*\)/, "");
          let qty = parseInt(parts[1]) || 1;
          productCounts[name] = (productCounts[name] || 0) + qty;
        }
      });
    });
  });
  
  const statusData = Object.keys(statusCounts).map(s => [s, statusCounts[s]]);
  const productData = Object.keys(productCounts)
    .map(p => [p, productCounts[p]])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
    
  return { statusData, productData };
}

/**
 * Write top 8 recent orders aggregated from Website and POS sheets
 * Writes a styled table starting at row 26, columns B:H on the dashboard
 */
function writeRecentOrders(spreadsheet, dashboardSheet, webSheetName, posSheetName) {
  const sheets = [spreadsheet.getSheetByName(webSheetName), spreadsheet.getSheetByName(posSheetName)];
  const orders = [];

  sheets.forEach((sheet, idx) => {
    if (!sheet || sheet.getLastRow() < 2) return;
    const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues();
    values.forEach(row => {
      const id = row[0];
      const dateCell = row[1];
      let dateObj = null;
      if (dateCell instanceof Date) dateObj = dateCell;
      else if (typeof dateCell === 'string' && dateCell.trim()) {
        // try parse ISO-like string yyyy-MM-dd HH:mm:ss
        const parsed = new Date(dateCell);
        if (!isNaN(parsed.getTime())) dateObj = parsed;
      }
      // fallback: use today's date if parsing fails
      if (!dateObj) dateObj = new Date(0);

      const customer = row[2] || '';
      const items = row[5] || '';
      const total = row[7] || '';
      const status = row[9] || '';
      const source = (idx === 0) ? 'Website' : 'POS';

      orders.push({ id, date: dateObj, customer, items, total, source, status });
    });
  });

  // Sort by date desc
  orders.sort((a, b) => b.date - a.date);
  const top = orders.slice(0, 8);

  // We will write columns B:H as:
  // B: Order ID, C: Date/Time, D: Customer, E: Source, F: Items, G: Total, H: Status
  const startRow = 29;
  const numCols = 7;
  const headers = ["Order ID", "Date/Time", "Customer", "Source", "Items", "Total", "Status"];

  // Clear previous area (header + 20 rows to be safe)
  dashboardSheet.getRange(startRow, 2, 20, numCols).clear();

  // 1. HEADER
  const headerRange = dashboardSheet.getRange(startRow, 2, 1, numCols);
  headerRange.setValues([headers]);
  headerRange.setBackground("#202124");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  headerRange.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);

  // 2. DATA
  if (top.length > 0) {
    const dataRows = top.map(o => {
      // Items: use first line or full items text
      let itemsText = '';
      if (o.items) {
        if (typeof o.items === 'string') {
          itemsText = o.items.split('\n')[0];
        } else {
          itemsText = String(o.items);
        }
      }

      // Total: normalize to number when possible
      let totalVal = o.total;
      if (typeof totalVal === 'string') {
        const cleaned = totalVal.replace(/[^0-9.\-]+/g, '');
        totalVal = cleaned ? parseFloat(cleaned) : '';
      }

      return [
        o.id || '',
        Utilities.formatDate(o.date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
        o.customer || '',
        o.source || '',
        itemsText || '',
        (totalVal === '' ? '' : totalVal),
        o.status || ''
      ];
    });

    const dataRange = dashboardSheet.getRange(startRow + 1, 2, dataRows.length, numCols);
    dataRange.setValues(dataRows);

    // Styling
    dataRange.setVerticalAlignment("middle");
    dataRange.setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);
    dataRange.setFontSize(10);

    // Alternating Row Colors (Zebra Striping)
    for (let i = 0; i < dataRows.length; i++) {
      if (i % 2 === 1) {
        dashboardSheet.getRange(startRow + 1 + i, 2, 1, numCols).setBackground("#f8f9fa");
      }
    }

    // Center specific columns: Date(Col 3), Source(Col 4), Status(Col 7) relative to range start
    // Range starts at Col 2 (B).
    // Date is C (3). Source is E (5). Status is H (8).
    dashboardSheet.getRange(startRow + 1, 3, dataRows.length, 1).setHorizontalAlignment("center"); // Date
    dashboardSheet.getRange(startRow + 1, 5, dataRows.length, 1).setHorizontalAlignment("center"); // Source
    dashboardSheet.getRange(startRow + 1, 8, dataRows.length, 1).setHorizontalAlignment("center"); // Status

    // Format the Total column (G / 7) as currency if values are numeric
    try {
      dashboardSheet.getRange(startRow + 1, 7, dataRows.length, 1).setNumberFormat('₱#,##0.00');
    } catch (e) {
      // Ignore if formatting fails
    }
  }
}

// ============================================
// EMAIL NOTIFICATION SYSTEM
// ============================================

/**
 * NOTE:
 * To enable automatic email notifications when you change the Order Status in the spreadsheet,
 * you must install the "CLIENT_SHEET_SCRIPT.js" directly into the generated spreadsheet.
 * 
 * This script (ORDER_TRACKING_SCRIPT.js) runs as a standalone Web App and cannot 
 * detect edits made inside the spreadsheets it creates.
 */
