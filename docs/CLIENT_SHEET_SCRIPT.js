/**
 * CLIENT-SIDE ORDER SCRIPT
 * 
 * INSTRUCTIONS:
 * 1. Open the specific Google Sheet for the client (e.g., "Salon - Orders").
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code there.
 * 4. Save and Refresh the spreadsheet.
 * 5. Use the "Admin Controls" menu to enable email notifications.
 */

// ============================================
// CONFIGURATION (UPDATE THESE FOR EACH CLIENT)
// ============================================
// BUSINESS_NAME: Should match the website's title/name (e.g., "Big Brew Coffee", "Salon Name")
// This is used in email notifications, chatbot responses, and knowledge base content
const BUSINESS_NAME = "My Shop Name";      // e.g., "Big Brew Coffee"
const BUSINESS_EMAIL = "myshop@gmail.com"; // e.g., "orders@bigbrew.com"

// ============================================
// ADMIN MENU & TRIGGER SETUP
// ============================================

/**
 * Adds a custom menu to the spreadsheet when opened.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Admin Controls')
    .addItem('Enable Email Notifications', 'setupTrigger')
    .addToUi();
}

/**
 * One-Click Setup: Creates the installable trigger for email notifications.
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
// EMAIL NOTIFICATION LOGIC
// ============================================

/**
 * TRIGGER FUNCTION: Send email when order status changes
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
    // getValues() returns 2D array, we want the first row
    const rowData = sheet.getRange(row, 1, 1, 10).getValues()[0];
    
    const orderId = rowData[0];
    const customerName = rowData[2];
    const customerEmail = rowData[3]; // Column D
    const items = rowData[5];         // Column F
    const total = rowData[7];         // Column H
    
    // Validate email
    if (!customerEmail || !customerEmail.includes("@")) {
      console.log("No valid email found for order " + orderId);
      return;
    }
    
    // Determine Status Color
    let statusColor = "#202124"; // Default Black
    if (newStatus === "Pending") statusColor = "#db4437"; // Red
    if (newStatus === "Processing") statusColor = "#f4b400"; // Yellow
    if (newStatus === "Ready") statusColor = "#0f9d58"; // Green
    if (newStatus === "Out for Delivery") statusColor = "#ab47bc"; // Purple
    if (newStatus === "Delivered") statusColor = "#0f9d58"; // Green
    if (newStatus === "Cancelled") statusColor = "#9aa0a6"; // Grey

    // Prepare email subject
    const subject = `Order Update: ${orderId} is ${newStatus}`;
    
    // Prepare HTML Body (Professional Design)
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background-color: #202124; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">ORDER UPDATE</h1>
          <p style="color: #9aa0a6; margin: 5px 0 0; font-size: 14px;">${BUSINESS_NAME}</p>
        </div>

        <!-- Status Banner -->
        <div style="background-color: ${statusColor}; padding: 15px; text-align: center;">
          <span style="color: #ffffff; font-weight: bold; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">${newStatus}</span>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #202124; font-size: 16px; line-height: 1.5; margin-top: 0;">Hi <strong>${customerName}</strong>,</p>
          
          <p style="color: #5f6368; font-size: 16px; line-height: 1.5;">
            Your order <strong>${orderId}</strong> has been updated to <strong style="color: ${statusColor}">${newStatus}</strong>.
          </p>

          <!-- Order Summary Box -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #202124; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Order Summary</h3>
            
            <div style="margin-bottom: 15px;">
              <div style="color: #5f6368; font-size: 14px; margin-bottom: 5px;">Items:</div>
              <div style="color: #202124; font-weight: 500; font-size: 15px; white-space: pre-wrap;">${items}</div>
            </div>
            
            <div style="border-top: 1px solid #dadce0; padding-top: 15px; margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #202124; font-weight: bold;">Total Amount</span>
              <span style="color: #202124; font-weight: bold; font-size: 18px;">${total}</span>
            </div>
          </div>

          <!-- Status Specific Message -->
          ${getStatusMessage(newStatus)}

          <p style="color: #5f6368; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            If you have any questions, please reply to this email.
          </p>
          
          <p style="color: #202124; font-weight: bold; margin-bottom: 0;">Thank you for your business!</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f3f4; padding: 20px; text-align: center; font-size: 12px; color: #5f6368;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${BUSINESS_NAME}. All rights reserved.</p>
        </div>
      </div>
    `;
    
    // Send the email
    try {
      MailApp.sendEmail({
        to: customerEmail,
        bcc: BUSINESS_EMAIL,          // Send copy to business email
        subject: subject,
        htmlBody: htmlBody,           // Use HTML body
        name: BUSINESS_NAME,          // Display Name (Masking)
        replyTo: BUSINESS_EMAIL       // Where replies go
      });
      
    } catch (error) {
      console.error("Failed to send email: " + error.toString());
    }
  }
}

/**
 * Helper to get specific message based on status
 */
function getStatusMessage(status) {
  if (status === "Out for Delivery") {
    return `<div style="background-color: #e8f0fe; color: #1967d2; padding: 15px; border-radius: 4px; font-size: 14px; margin-top: 20px;">
      <strong>On the way!</strong> Please be ready to receive your order at the delivery location.
    </div>`;
  }
  if (status === "Delivered") {
    return `<div style="background-color: #e6f4ea; color: #137333; padding: 15px; border-radius: 4px; font-size: 14px; margin-top: 20px;">
      <strong>Delivered!</strong> We hope you enjoy your purchase.
    </div>`;
  }
  if (status === "Cancelled") {
    return `<div style="background-color: #fce8e6; color: #c5221f; padding: 15px; border-radius: 4px; font-size: 14px; margin-top: 20px;">
      <strong>Order Cancelled.</strong> If this was a mistake, please contact us immediately.
    </div>`;
  }
  return "";
}
