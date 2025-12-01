/**
 * Google Apps Script for Order Tracking
 * 
 * This script handles order submissions from websites and stores them in
 * Google Spreadsheets organized by website in a Drive folder.
 * 
 * FEATURES:
 * - Automatic order processing and storage
 * - Email notifications for new orders
 * - Modern dashboard with KPI cards and charts
 * - Status tracking and conditional formatting
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Paste this entire code
 * 4. Update ADMIN_EMAIL with your email
 * 5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 * 6. Copy the Web App URL and update WEB_APP_URL constant if needed
 * 7. Use the Web App URL in your website configuration
 */

// ============================================
// CONFIGURATION
// ============================================
const ADMIN_EMAIL = "likhasiteworks@gmail.com"; // Change this to your email
const DRIVE_FOLDER_NAME = "Messenger/Order Tracking";
const ORDER_STATUS_OPTIONS = ["Pending", "Processing", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

// ============================================
// ADMIN MENU & TRIGGER SETUP
// ============================================

/**
 * Adds a custom menu to the spreadsheet when opened.
 * NOTE: This only works if the script is bound to the spreadsheet.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Admin Controls')
      .addItem('Enable Email Notifications', 'setupTrigger')
      .addToUi();
  } catch (e) {
    // Ignore errors if running in a context without UI (e.g. standalone web app)
    console.log("Could not create menu: " + e.toString());
  }
}

/**
 * One-Click Setup: Creates the installable trigger for email notifications.
 * Run this from the "Admin Controls" menu in the spreadsheet.
 */
function setupTrigger() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Check if trigger already exists to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    const handlerName = 'sendOrderStatusEmail';
    
    let exists = false;
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === handlerName) {
        exists = true;
        break;
      }
    }
    
    if (exists) {
      ui.alert('Email notifications are already enabled!');
      return;
    }
    
    // Create the trigger
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    ScriptApp.newTrigger(handlerName)
      .forSpreadsheet(sheet)
      .onEdit()
      .create();
      
    ui.alert('Success! Email notifications are now enabled.\n\nCustomers will receive emails when you change the Order Status.');
    
  } catch (error) {
    console.error(error);
    ui.alert('Error setting up trigger: ' + error.toString());
  }
}

// ============================================
// MAIN FUNCTION - Handles Order Submissions
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
    const orderData = data.order || {};
    
    // Validate required fields
    if (!orderData.customerName || !orderData.items || !orderData.items.length) {
      throw new Error("Missing required order data: customerName and items are required");
    }

    // Get or create the Drive folder
    const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
    
    // Get or create spreadsheet for this website
    const spreadsheet = getOrCreateSpreadsheet(folder, websiteId, websiteTitle);
    
    // Get or create the Orders sheet
    const sheet = getOrCreateOrdersSheet(spreadsheet);
    
    // Add the order to the spreadsheet
    addOrderToSheet(sheet, orderData);
    
    // Create or update Dashboard sheet with formulas and charts
    createOrUpdateDashboardSheet(spreadsheet, sheet, websiteTitle);
    
    // Return success response with CORS headers
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "success",
        message: "Order saved successfully",
        spreadsheetUrl: spreadsheet.getUrl()
      })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders({ "Access-Control-Allow-Origin": "*" });

  } catch (error) {
    // Log error for debugging
    console.error("Error processing order:", error);
    
    // Send error notification email
    try {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
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
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders({ "Access-Control-Allow-Origin": "*" });
  } finally {
    lock.releaseLock();
  }
}

// ============================================
// READ ORDERS - For Client Dashboard
// ============================================
function doGet(e) {
  try {
    const websiteId = e.parameter.websiteId || "";
    const websiteTitle = e.parameter.websiteTitle || "";
    
    if (!websiteId && !websiteTitle) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "error", 
          error: "websiteId or websiteTitle parameter required" 
        })
      ).setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*"
      });
    }

    // Get the Drive folder
    const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
    
    // Find the spreadsheet for this website
    let spreadsheet = null;
    if (websiteTitle) {
      const expectedName = websiteTitle + " - Orders";
      const files = folder.getFilesByName(expectedName);
      if (files.hasNext()) {
        const file = files.next();
        spreadsheet = SpreadsheetApp.openById(file.getId());
      }
    }
    
    if (!spreadsheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "error", 
          error: "Spreadsheet not found for this website" 
        })
      ).setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*"
      });
    }

    // Get the Orders sheet
    const sheet = spreadsheet.getSheetByName("Orders");
    if (!sheet) {
      // Create Orders sheet if it doesn't exist
      const ordersSheet = getOrCreateOrdersSheet(spreadsheet);
      // Also create Dashboard sheet
      createOrUpdateDashboardSheet(spreadsheet, ordersSheet, websiteTitle);
      
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "success",
          orders: [],
          stats: {
            total: 0,
            pending: 0,
            processing: 0,
            ready: 0,
            delivered: 0,
            cancelled: 0,
            totalRevenue: 0
          }
        })
      ).setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*"
      });
    }

    // Read all order data (skip header row)
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          result: "success",
          orders: [],
          stats: {
            total: 0,
            pending: 0,
            processing: 0,
            ready: 0,
            delivered: 0,
            cancelled: 0,
            totalRevenue: 0
          }
        })
      ).setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*"
      });
    }

    const dataRange = sheet.getRange(2, 1, lastRow - 1, 9); // All data rows, all columns
    const values = dataRange.getValues();
    
    const orders = values.map(row => ({
      orderId: row[0] || "",
      dateTime: row[1] || "",
      customerName: row[2] || "",
      location: row[3] || "",
      items: row[4] || "",
      itemDetails: row[5] || "",
      totalAmount: row[6] || "",
      note: row[7] || "",
      status: row[8] || "Pending"
    }));

    // Calculate statistics
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "Pending").length,
      processing: orders.filter(o => o.status === "Processing").length,
      ready: orders.filter(o => o.status === "Ready").length,
      delivered: orders.filter(o => o.status === "Delivered").length,
      cancelled: orders.filter(o => o.status === "Cancelled").length,
      totalRevenue: orders.reduce((sum, o) => {
        // Extract number from totalAmount (e.g., "₱1,234.56" -> 1234.56)
        const amountStr = String(o.totalAmount || "0").replace(/[₱,]/g, "");
        return sum + (parseFloat(amountStr) || 0);
      }, 0)
    };

    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "success",
        orders: orders,
        stats: stats,
        spreadsheetUrl: spreadsheet.getUrl()
      })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*"
    });

  } catch (error) {
    console.error("Error reading orders:", error);
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "error", 
        error: error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*"
    });
  }
}

// ============================================
// CORS HANDLER - Required for React/Vite
// ============================================
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
// HELPER FUNCTIONS
// ============================================

/**
 * Get or create the Drive folder for storing spreadsheets
 */
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    // Create the folder structure (handles nested folders)
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
}

/**
 * Get or create a spreadsheet for a specific website
 */
function getOrCreateSpreadsheet(folder, websiteId, websiteTitle) {
  // Search for existing spreadsheet by the expected name pattern
  const expectedName = websiteTitle + " - Orders";
  const files = folder.getFilesByName(expectedName);
  
  if (files.hasNext()) {
    // Found existing spreadsheet - return it
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    // Create new spreadsheet with the expected name
    const spreadsheet = SpreadsheetApp.create(expectedName);
    const file = DriveApp.getFileById(spreadsheet.getId());
    
    // Move to the folder
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
    
    return spreadsheet;
  }
}

/**
 * Get or create the Orders sheet with proper headers and data validation
 */
function getOrCreateOrdersSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName("Orders");
  
  if (!sheet) {
    // Check if Sheet1 exists and handle it
    const sheet1 = spreadsheet.getSheetByName("Sheet1");
    if (sheet1) {
      // Check if Sheet1 is empty (only has default content or is empty)
      const lastRow = sheet1.getLastRow();
      if (lastRow <= 1) {
        // Sheet1 is empty or only has headers - rename it to Orders
        sheet1.setName("Orders");
        sheet = sheet1;
      } else {
        // Sheet1 has data - delete it and create new Orders sheet
        spreadsheet.deleteSheet(sheet1);
        sheet = spreadsheet.insertSheet("Orders");
      }
    } else {
      // No Sheet1, create new Orders sheet
      sheet = spreadsheet.insertSheet("Orders");
    }
    
    // Set up headers
    const headers = [
      "Order ID",
      "Date/Time",
      "Customer Name",
      "Customer Email",
      "Location",
      "Items",
      "Item Details",
      "Total Amount",
      "Note",
      "Status"
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    
    // Set up data validation for Status column (column J now)
    const statusColumn = 10; // Column J
    const statusRange = sheet.getRange(2, statusColumn, 1000, 1); // 1000 rows initially
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(ORDER_STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .setHelpText("Select order status from dropdown")
      .build();
    statusRange.setDataValidation(rule);
    
    // Format columns
    sheet.setColumnWidth(1, 120); // Order ID
    sheet.setColumnWidth(2, 150); // Date/Time
    sheet.setColumnWidth(3, 150); // Customer Name
    sheet.setColumnWidth(4, 200); // Customer Email
    sheet.setColumnWidth(5, 200); // Location
    sheet.setColumnWidth(6, 300); // Items
    sheet.setColumnWidth(7, 400); // Item Details
    sheet.setColumnWidth(8, 120); // Total Amount
    sheet.setColumnWidth(9, 300); // Note
    sheet.setColumnWidth(10, 150); // Status
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Set up status-based color coding (conditional formatting)
    setupStatusColorCoding(sheet);
  } else {
    // Sheet exists, but ensure color coding is set up
    setupStatusColorCoding(sheet);
  }
  
  return sheet;
}

/**
 * Set up conditional formatting based on order status
 */
function setupStatusColorCoding(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // No data rows yet
  
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 10); // All data rows, all columns
  
  // Status-based color rules
  const conditionalFormatRules = [
    // Pending - White
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Pending"')
      .setBackground("#ffffff") // White
      .build(),
    
    // Processing - Light blue
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Processing"')
      .setBackground("#e3f2fd") // Light blue
      .build(),
    
    // Preparing - Light orange
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Preparing"')
      .setBackground("#ffe0b2") // Light orange
      .build(),
    
    // Ready - Light green
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Ready"')
      .setBackground("#c8e6c9") // Light green
      .build(),
    
    // Out for Delivery - Light purple
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Out for Delivery"')
      .setBackground("#e1bee7") // Light purple
      .build(),
    
    // Delivered - Green
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Delivered"')
      .setBackground("#a5d6a7") // Green
      .build(),
    
    // Cancelled - Light red
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$J2="Cancelled"')
      .setBackground("#ffcdd2") // Light red
      .build()
  ];
  
  sheet.setConditionalFormatRules(conditionalFormatRules);
}

/**
 * Add order data to the spreadsheet
 */
function addOrderToSheet(sheet, orderData) {
  // Generate unique Order ID (timestamp + random)
  const orderId = "ORD-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
  
  // Format date/time
  const now = new Date();
  const dateTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  
  // Format items list
  const itemsList = orderData.items.map(item => 
    `${item.name} x${item.quantity}`
  ).join(", ");
  
  // Format item details (more detailed breakdown)
  const itemDetails = orderData.items.map(item => {
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const subtotal = unitPrice * item.quantity;
    return `${item.name}\n  Quantity: ${item.quantity}\n  Unit Price: ${item.unitPrice}\n  Subtotal: ${formatCurrency(subtotal)}`;
  }).join("\n\n");
  
  // Calculate total
  const total = orderData.total || 0;
  
  // Prepare row data
  const rowData = [
    orderId,
    dateTime,
    orderData.customerName || "",
    orderData.email || "",
    orderData.location || "",
    itemsList,
    itemDetails,
    orderData.totalFormatted || formatCurrency(total),
    orderData.note || "",
    "Pending" // Default status
  ];
  
  // Insert new row at row 2 (right after header) instead of appending
  // This makes the latest order appear at the top
  sheet.insertRowBefore(2);
  const newRowRange = sheet.getRange(2, 1, 1, rowData.length);
  newRowRange.setValues([rowData]);
  
  // Apply data validation to the new Status cell (column J, row 2)
  const statusCell = sheet.getRange(2, 10); // Column J, Row 2
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ORDER_STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .setHelpText("Select order status from dropdown")
    .build();
  statusCell.setDataValidation(rule);
  
  // Update status-based color coding to include the new row
  setupStatusColorCoding(sheet);
  
  // Auto-resize columns if needed
  sheet.autoResizeColumns(1, 9);
  
  return orderId;
}

/**
 * Format currency (adjust format as needed)
 */
function formatCurrency(amount) {
  return "₱" + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * REPLACEMENT FUNCTION: Generate "Pro-Level" SaaS Dashboard
 */
function createOrUpdateDashboardSheet(spreadsheet, ordersSheet, websiteTitle) {
  let dashboardSheet = spreadsheet.getSheetByName("Dashboard");
  
  if (!dashboardSheet) {
    dashboardSheet = spreadsheet.insertSheet("Dashboard");
    dashboardSheet.setTabColor("#1a73e8");
  } else {
    dashboardSheet.clear(); // Wipe clean
  }

  // 1. GLOBAL SETTINGS
  dashboardSheet.setHiddenGridlines(true); // Crucial for "App" look
  dashboardSheet.setColumnWidth(1, 20); // Spacer Col A

  // =======================================
  // SECTION 1: HEADER & TITLE
  // =======================================
  const headerRange = dashboardSheet.getRange("B2:M3");
  const title = (websiteTitle || "WEBSITE") + " | ORDER DASHBOARD";
  headerRange.merge()
    .setValue(title.toUpperCase())
    .setBackground("#202124")
    .setFontColor("#ffffff")
    .setFontFamily("Roboto")
    .setFontSize(18)
    .setFontWeight("bold")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left")
    .setWrap(false);
    // Add padding via text indent if possible, or just space in string

  // =======================================
  // SECTION 2: KPI CARDS (The "Scoreboard")
  // =======================================
  const kpiRow = 5;
  
  // Card 1: Revenue (Green Theme)
  createModernCard(dashboardSheet, "B5:E8", "TOTAL REVENUE", 
    `=SUM(ARRAYFORMULA(IF(ISBLANK(Orders!G2:G),0,VALUE(SUBSTITUTE(SUBSTITUTE(Orders!G2:G,"₱",""),",","")))))`, 
    "₱#,##0.00", "#0f9d58");

  // Card 2: Orders Count (Blue Theme)
  createModernCard(dashboardSheet, "F5:I8", "TOTAL ORDERS", 
    `=COUNTA(Orders!A2:A)`, 
    "0", "#4285f4");

  // Card 3: Action Needed (Red Theme)
  createModernCard(dashboardSheet, "J5:M8", "PENDING ORDERS", 
    `=COUNTIF(Orders!I2:I,"Pending") + COUNTIF(Orders!I2:I,"Processing")`, 
    "0", "#db4437");

  // =======================================
  // SECTION 3: DATA PROCESSING (Hidden Engine)
  // =======================================
  // We use columns O, P, Q, R (Hidden) for chart data
  const stats = calculateDashboardStats(ordersSheet);
  
  // 1. STATUS DATA (Dynamic Formulas for Pie Chart)
  // We use formulas so the chart updates instantly when data changes
  dashboardSheet.getRange("O1:P1").setValues([["Status", "Count"]]);
  
  // Use the global ORDER_STATUS_OPTIONS to ensure all statuses are tracked
  ORDER_STATUS_OPTIONS.forEach((status, index) => {
    const row = 2 + index;
    dashboardSheet.getRange(row, 15).setValue(status); // Col O
    dashboardSheet.getRange(row, 16).setFormula(`=COUNTIF(Orders!I:I, "${status}")`); // Col P
  });

  // 2. TOP PRODUCTS DATA (Static Snapshot)
  // This still requires script execution to update as parsing is complex
  dashboardSheet.getRange("S1:T1").setValues([["Product", "Qty"]]);
  if (stats.productData.length > 0) {
    dashboardSheet.getRange(2, 19, stats.productData.length, 2).setValues(stats.productData);
  }

  // =======================================
  // SECTION 4: CHARTS
  // =======================================
  
  // Chart 1: Order Status Distribution (Pie Chart)
  // Position: Row 10, Left side
  const statusDataRange = dashboardSheet.getRange(1, 15, ORDER_STATUS_OPTIONS.length + 1, 2);
  
  const pieChart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(statusDataRange)
    .setPosition(10, 2, 0, 0)
    .setOption('title', 'Order Status Distribution')
    .setOption('pieHole', 0.4) // Doughnut style
    .setOption('width', 550)
    .setOption('height', 350)
    .setOption('backgroundColor', '#ffffff')
    // Google Colors: Blue, Red, Yellow, Green, Purple, Cyan, Orange
    .setOption('colors', ['#4285f4', '#db4437', '#f4b400', '#0f9d58', '#ab47bc', '#00acc1', '#ff7043'])
    .build();
  dashboardSheet.insertChart(pieChart);

  // Chart 2: Top Products (Bar Chart) - NEW!
  // Position: Row 10, Right side
  const barChart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dashboardSheet.getRange("S1:T6")) // Top 5 products
    .setPosition(10, 8, 0, 0) // Col H
    .setOption('title', 'Top 5 Best Sellers')
    .setOption('colors', ['#f4b400']) // Gold color
    .setOption('legend', {position: 'none'})
    .setOption('width', 550)
    .setOption('height', 350)
    .setOption('backgroundColor', '#ffffff')
    .build();
  dashboardSheet.insertChart(barChart);

  // =======================================
  // SECTION 5: RECENT ORDERS TABLE
  // =======================================
  const tableStartRow = 29;
  
  // Table Header
  dashboardSheet.getRange(tableStartRow, 2).setValue("RECENT ORDERS LOG")
    .setFontWeight("bold")
    .setFontColor("#5f6368")
    .setFontSize(12);

  const headers = [["Order ID", "Date", "Customer", "Items Summary", "Total", "Status"]];
  const tableHeaderRange = dashboardSheet.getRange(tableStartRow + 1, 2, 1, 6);
  tableHeaderRange.setValues(headers)
    .setBackground("#f1f3f4")
    .setFontWeight("bold")
    .setFontColor("#202124")
    .setBorder(false, false, true, false, false, false, "#dadce0", SpreadsheetApp.BorderStyle.SOLID); // Bottom border only

  // Generate Formulas for the last 8 orders (Rows 2 to 9 in Orders sheet)
  // We use formulas to ensure REAL-TIME SYNCHRONIZATION
  const numRows = 8;
  const startRow = tableStartRow + 2;
  
  for (let i = 0; i < numRows; i++) {
    const dashboardRow = startRow + i;
    const ordersRow = 2 + i; // Orders start at row 2 (Newest is at top)
    
    // 1. Order ID
    dashboardSheet.getRange(dashboardRow, 2).setFormula(`=IF(Orders!A${ordersRow}<>"", Orders!A${ordersRow}, "")`);
    
    // 2. Date (Truncated for display)
    dashboardSheet.getRange(dashboardRow, 3).setFormula(`=IF(Orders!A${ordersRow}<>"", LEFT(Orders!B${ordersRow}, 16), "")`);
    
    // 3. Customer
    dashboardSheet.getRange(dashboardRow, 4).setFormula(`=IF(Orders!A${ordersRow}<>"", Orders!C${ordersRow}, "")`);
    
    // 4. Items (Truncated)
    dashboardSheet.getRange(dashboardRow, 5).setFormula(`=IF(Orders!A${ordersRow}<>"", LEFT(Orders!E${ordersRow}, 35) & IF(LEN(Orders!E${ordersRow})>35, "...", ""), "")`);
    
    // 5. Total
    dashboardSheet.getRange(dashboardRow, 6).setFormula(`=IF(Orders!A${ordersRow}<>"", Orders!G${ordersRow}, "")`);
    
    // 6. Status
    dashboardSheet.getRange(dashboardRow, 7).setFormula(`=IF(Orders!A${ordersRow}<>"", Orders!I${ordersRow}, "")`);
  }
  
  // Styling Data Rows
  const tableRange = dashboardSheet.getRange(startRow, 2, numRows, 6);
  tableRange.setFontSize(10).setVerticalAlignment("middle");
  tableRange.setBorder(false, false, true, false, false, false, "#f1f3f4", SpreadsheetApp.BorderStyle.SOLID);
  
  // Add Conditional Formatting for Status Column (Col G in Dashboard, which is index 7)
  const statusRange = dashboardSheet.getRange(startRow, 7, numRows, 1);
  
  const newRules = [];
  const createRule = (text, color) => SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text)
    .setFontColor(color)
    .setBold(true)
    .setRanges([statusRange])
    .build();
    
  newRules.push(createRule("Pending", "#db4437")); // Red
  newRules.push(createRule("Processing", "#f4b400")); // Orange/Gold
  newRules.push(createRule("Ready", "#0f9d58")); // Green
  newRules.push(createRule("Delivered", "#137333")); // Dark Green
  newRules.push(createRule("Cancelled", "#9aa0a6")); // Grey
  
  dashboardSheet.setConditionalFormatRules(newRules);

  // Hide the Calculation Engine Columns
  dashboardSheet.hideColumns(15, 6); // Hide O to T
}

/**
 * HELPER: Create a "SaaS Style" KPI Card
 */
function createModernCard(sheet, rangeStr, title, formula, numFormat, accentColor) {
  const range = sheet.getRange(rangeStr);
  range.merge();
  
  // 1. The Value
  range.setFormula(formula)
    .setNumberFormat(numFormat)
    .setFontSize(28)
    .setFontWeight("bold")
    .setFontColor("#202124")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setBackground("#ffffff"); // White Card
    
  // 2. The Border (Simulating Shadow/Card)
  range.setBorder(true, true, true, true, null, null, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);

  // 3. The Title Bar (Inside the card, top)
  // We can't split merged cells easily, so we use the cell ABOVE the range for the "Label"
  // Actually, let's use the layout passed in.
  // We will assume the range passed is the "Value Box". 
  // We will decorate the cell ABOVE it as the title.
  
  const startRow = range.getRow();
  const startCol = range.getColumn();
  const numCols = range.getNumColumns();
  
  const titleRange = sheet.getRange(startRow - 1, startCol, 1, numCols);
  titleRange.merge()
    .setValue(title)
    .setFontSize(10)
    .setFontWeight("bold")
    .setFontColor(accentColor) // Use the accent color for text
    .setHorizontalAlignment("left")
    .setVerticalAlignment("bottom");
    
  // Add a thick colored line at the top of the value card
  range.setBorder(true, true, true, true, null, null, accentColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

/**
 * HELPER: Calculate Stats for Charts (Revenue, Status, Top Products)
 */
function calculateDashboardStats(ordersSheet) {
  const lastRow = ordersSheet.getLastRow();
  if (lastRow < 2) return { statusData: [], revenueData: [], productData: [] };

  const data = ordersSheet.getRange(2, 1, lastRow - 1, 9).getValues();
  
  const dailyTotals = {};
  const statusCounts = {};
  const productCounts = {};

  data.forEach(row => {
    // 1. Revenue
    let dateStr = row[1].toString().substring(0, 10);
    let amount = parseFloat(row[6].toString().replace(/[₱,]/g, "")) || 0;
    dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + amount;

    // 2. Status
    let status = row[8] || "Unknown";
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    // 3. Top Products (Parsing "Item Name xQty")
    // Assumes format: "Product A x2, Product B x1"
    let itemsStr = row[4].toString(); 
    if (itemsStr) {
      let items = itemsStr.split(","); // Split by comma
      items.forEach(item => {
        let parts = item.trim().split(" x"); // Split by " x"
        if (parts.length >= 2) {
          let name = parts[0].trim();
          let qty = parseInt(parts[1]) || 1;
          productCounts[name] = (productCounts[name] || 0) + qty;
        }
      });
    }
  });

  // Format Revenue Data (Last 7 Days)
  let sortedDates = Object.keys(dailyTotals).sort().reverse().slice(0, 7).reverse();
  const revenueData = sortedDates.map(d => [d, dailyTotals[d]]);

  // Format Status Data
  const statusData = Object.keys(statusCounts).map(s => [s, statusCounts[s]]);

  // Format Top Products Data (Top 5)
  const productData = Object.keys(productCounts)
    .map(p => [p, productCounts[p]])
    .sort((a, b) => b[1] - a[1]) // Sort by count desc
    .slice(0, 5);

  return { statusData, revenueData, productData };
}

/**
 * Test function - can be run manually to verify setup
 */
function testSetup() {
  const testOrder = {
    websiteId: "test-website",
    websiteTitle: "Test Website",
    order: {
      customerName: "Test Customer",
      location: "123 Test St",
      items: [
        {
          name: "Test Product",
          quantity: 2,
          unitPrice: "100.00",
          subtotal: 200
        }
      ],
      total: 200,
      totalFormatted: "₱200.00",
      note: "Test order"
    }
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testOrder)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

// ============================================
// EMAIL NOTIFICATION SYSTEM
// ============================================

/**
 * TRIGGER FUNCTION: Send email when order status changes
 * 
 * INSTRUCTIONS TO SET UP TRIGGER:
 * 1. In Apps Script editor, click on "Triggers" (alarm clock icon) on the left.
 * 2. Click "+ Add Trigger" (bottom right).
 * 3. Choose function to run: "onEditTrigger"
 * 4. Select event source: "From spreadsheet"
 * 5. Select event type: "On edit"
 * 6. Click "Save".
 * 
 * NOTE: You must set this up manually for each spreadsheet, OR use a bound script.
 * Since this is a standalone script managing multiple sheets, we need a different approach.
 * 
 * ALTERNATIVE: Since this script manages multiple spreadsheets in a folder, 
 * we cannot easily attach an "onEdit" trigger to all of them automatically.
 * 
 * SOLUTION: We will use a time-driven trigger to check for changes, OR
 * we accept that this feature requires the script to be bound to the sheet.
 * 
 * FOR THIS SPECIFIC REQUEST:
 * The user wants "if i change the dropdown status, automatically sent the order track".
 * This implies an "onEdit" trigger.
 * 
 * Below is the function that SHOULD be triggered.
 * You can manually attach this to your specific spreadsheet if you copy the script there.
 */
function sendOrderStatusEmail(e) {
  // Ensure the event object exists (it comes from the trigger)
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== "Orders") return;

  const range = e.range;
  const column = range.getColumn();
  const row = range.getRow();
  
  // Check if the edited cell is the "Status" column (Column 10 / J)
  // And ensure it's not the header row
  if (column === 10 && row > 1) {
    const newStatus = e.value;
    
    // Get order details from the row
    // Columns: 
    // 1: ID, 2: Date, 3: Name, 4: Email, 5: Location, 6: Items, 7: Details, 8: Total, 9: Note, 10: Status
    const rowData = sheet.getRange(row, 1, 1, 10).getValues()[0];
    
    const orderId = rowData[0];
    const customerName = rowData[2];
    const customerEmail = rowData[3];
    const items = rowData[5];
    const total = rowData[7];
    
    // Validate email
    if (!customerEmail || !customerEmail.includes("@")) {
      console.log("No valid email found for order " + orderId);
      return;
    }
    
    // Prepare email subject and body
    const subject = `Order Update: ${orderId} is ${newStatus}`;
    let body = `
      Hi ${customerName},
      
      Your order status has been updated!
      
      Order ID: ${orderId}
      Status: ${newStatus}
      
      Order Details:
      ${items}
      
      Total: ${total}
      
      Thank you for your business!
    `;
    
    // Customize message based on status
    if (newStatus === "Out for Delivery") {
      body += "\n\nYour order is on the way! Please be ready to receive it.";
    } else if (newStatus === "Delivered") {
      body += "\n\nWe hope you enjoy your purchase! Please let us know if you have any feedback.";
    } else if (newStatus === "Cancelled") {
      body += "\n\nYour order has been cancelled. If this was a mistake, please contact us.";
    }
    
    // Send the email
    try {
      MailApp.sendEmail({
        to: customerEmail,
        subject: subject,
        body: body
      });
      
      // Optional: Log that email was sent (e.g., in a comment or log sheet)
      // e.range.setNote("Email sent to " + customerEmail + " at " + new Date());
      
    } catch (error) {
      console.error("Failed to send email: " + error.toString());
    }
  }
}


