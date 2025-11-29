/**
 * Google Apps Script for Order Tracking
 * 
 * This script handles order submissions from websites and stores them in
 * Google Spreadsheets organized by website in a Drive folder.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Paste this entire code
 * 4. Update ADMIN_EMAIL with your email
 * 5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 * 6. Copy the Web App URL and use it in your website configuration
 */

// ============================================
// CONFIGURATION
// ============================================
const ADMIN_EMAIL = "likhasiteworks@gmail.com"; // Change this to your email
const DRIVE_FOLDER_NAME = "Messenger/Order Tracking";
const ORDER_STATUS_OPTIONS = ["Pending", "Processing", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

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
    
    // Set up data validation for Status column (column I)
    const statusColumn = 9; // Column I
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
    sheet.setColumnWidth(4, 200); // Location
    sheet.setColumnWidth(5, 300); // Items
    sheet.setColumnWidth(6, 400); // Item Details
    sheet.setColumnWidth(7, 120); // Total Amount
    sheet.setColumnWidth(8, 300); // Note
    sheet.setColumnWidth(9, 150); // Status
    
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
  
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 9); // All data rows, all columns
  
  // Status-based color rules
  const conditionalFormatRules = [
    // Pending - White
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Pending"')
      .setBackground("#ffffff") // White
      .build(),
    
    // Processing - Light blue
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Processing"')
      .setBackground("#e3f2fd") // Light blue
      .build(),
    
    // Preparing - Light orange
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Preparing"')
      .setBackground("#ffe0b2") // Light orange
      .build(),
    
    // Ready - Light green
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Ready"')
      .setBackground("#c8e6c9") // Light green
      .build(),
    
    // Out for Delivery - Light purple
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Out for Delivery"')
      .setBackground("#e1bee7") // Light purple
      .build(),
    
    // Delivered - Green
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Delivered"')
      .setBackground("#a5d6a7") // Green
      .build(),
    
    // Cancelled - Light red
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([dataRange])
      .whenFormulaSatisfied('=$I2="Cancelled"')
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
  
  // Apply data validation to the new Status cell (column I, row 2)
  const statusCell = sheet.getRange(2, 9); // Column I, Row 2
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

