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
    .addSeparator()
    .addItem('Initialize Chatbot Knowledge Base', 'setupChatbot')
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

/**
 * One-Click Setup: Creates the Knowledge Base sheet for the Chatbot.
 */
function setupChatbot() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("KnowledgeBase");
  
  if (sheet) {
    SpreadsheetApp.getUi().alert('KnowledgeBase sheet already exists!');
    return;
  }
  
  sheet = ss.insertSheet("KnowledgeBase");
  
  // Set Headers
  const headers = [["Business Information & FAQ"]];
  sheet.getRange(1, 1, 1, 1).setValues(headers);
  
  // Style Headers
  sheet.getRange(1, 1, 1, 1).setFontWeight("bold").setBackground("#4285f4").setFontColor("white");
  sheet.setColumnWidth(1, 600);
  
  // Add Sample Data
  const sampleData = [
    ["Business Name: " + BUSINESS_NAME],
    ["Contact Email: " + BUSINESS_EMAIL],
    ["We are an online store that delivers to your doorstep within the city."],
    ["Standard delivery fee is ₱50 within the city limits."],
    ["We accept GCash, Bank Transfer, and Cash on Delivery (COD) payments."],
    ["Our menu and prices are available on the 'Products' section of this website."],
    ["Customers can order directly through our website by adding items to cart and checking out."],
    ["We typically process orders within 24 hours and provide status updates via email."],
    ["For urgent inquiries, customers can contact us directly at " + BUSINESS_EMAIL + "."],
    ["We offer a satisfaction guarantee - if there are any issues with your order, please contact us immediately."]
  ];
  
  sheet.getRange(2, 1, sampleData.length, 1).setValues(sampleData);
  
  SpreadsheetApp.getUi().alert('Success! KnowledgeBase sheet created.\n\nAdd your business information, policies, and FAQ details in column A. The AI will use this information to answer customer questions.\n\n1. Go to Extensions > Deploy as Web App\n2. Set "Who has access" to "Anyone"\n3. Copy the URL and use it in your website Chat Widget.');
}

// ============================================
// CHATBOT API (doGet)
// ============================================

/**
 * API Endpoint for the Chatbot
 * Usage: 
 * - Get knowledge base content: GET https://script.google.com/.../exec?mode=kb&website=subdomain
 * - Get AI response: GET https://script.google.com/.../exec?q=hello&website=subdomain
 */
function doGet(e) {
  const params = e.parameter;
  const mode = params.mode || "";
  const query = (params.q || "").trim();
  const website = params.website || "default";
  
  // Mode: Return raw knowledge base content (for chatbot service to use with Gemini)
  if (mode === "kb") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("KnowledgeBase");
    
    if (sheet) {
      // Get all knowledge base information
      const data = sheet.getDataRange().getValues();
      
      // Combine all knowledge base entries into context
      let knowledgeBase = "";
      for (let i = 1; i < data.length; i++) { // Skip header row
        if (data[i][0] && data[i][0].toString().trim()) {
          knowledgeBase += data[i][0].toString().trim() + "\n";
        }
      }
      
      // Return plain text knowledge base content
      return ContentService.createTextOutput(knowledgeBase.trim())
        .setMimeType(ContentService.MimeType.TEXT);
    } else {
      // No knowledge base sheet found
      return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT);
    }
  }
  
  // Mode: Process query and return AI response (legacy/fallback mode)
  const result = {
    answer: "I'm sorry, I didn't understand that. Could you please rephrase?",
    found: false,
    website: website
  };
  
  if (query) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("KnowledgeBase");
    
    if (sheet) {
      // Get all knowledge base information
      const data = sheet.getDataRange().getValues();
      
      // Combine all knowledge base entries into context
      let knowledgeBase = "";
      for (let i = 1; i < data.length; i++) { // Skip header row
        if (data[i][0] && data[i][0].toString().trim()) {
          knowledgeBase += data[i][0].toString().trim() + "\n";
        }
      }
      
      if (knowledgeBase.trim()) {
        // Use AI to generate response based on knowledge base
        const aiResponse = generateAIResponse(query, knowledgeBase);
        if (aiResponse) {
          result.answer = aiResponse;
          result.found = true;
        }
      }
    }
  }
  
  // Return JSON
  const output = ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
    
  return output;
}

/**
 * Generate AI response using knowledge base context
 */
function generateAIResponse(userQuery, knowledgeBase) {
  try {
    // Create a prompt for AI to answer based on knowledge base
    const prompt = `You are a helpful customer service assistant for ${BUSINESS_NAME}. 
    
Use the following business information to answer the customer's question:

BUSINESS INFORMATION:
${knowledgeBase}

CUSTOMER QUESTION: ${userQuery}

INSTRUCTIONS:
- Answer in a friendly, helpful tone
- Use only information from the business information provided above
- If the information isn't available in the business details, politely say you don't have that information and suggest contacting ${BUSINESS_EMAIL}
- Keep responses concise but informative
- Don't make up information not provided in the business details

ANSWER:`;

    // Use a simple pattern matching as fallback if no AI service available
    // You can replace this with actual AI service calls (OpenAI, Gemini, etc.)
    return generateSimpleResponse(userQuery, knowledgeBase);
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return null;
  }
}

/**
 * Enhanced AI-like response generation with better context understanding
 */
function generateSimpleResponse(query, knowledgeBase) {
  const lowerQuery = query.toLowerCase();
  const kbLines = knowledgeBase.split('\n').filter(line => line.trim());
  
  // Greeting responses
  if (lowerQuery.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return `Hello! Welcome to ${BUSINESS_NAME}. How can I help you today?`;
  }
  
  // Extract key topics from the query
  const queryTopics = extractTopics(lowerQuery);
  
  // Score each knowledge base line based on relevance
  const scoredLines = kbLines.map(line => {
    const score = calculateRelevanceScore(lowerQuery, queryTopics, line);
    return { line, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
  
  // If we found relevant information
  if (scoredLines.length > 0) {
    // Combine top relevant lines (up to 3)
    const topLines = scoredLines.slice(0, 3).map(item => item.line);
    
    // If query is a question, format as an answer
    if (isQuestion(lowerQuery)) {
      return formatAnswer(lowerQuery, topLines);
    }
    
    // Return the most relevant information
    return topLines.join(' ');
  }
  
  // No relevant info found
  return `I don't have specific information about that. Please contact us at ${BUSINESS_EMAIL} for more details.`;
}

/**
 * Extract topics and keywords from query
 */
function extractTopics(query) {
  const topics = {
    price: ['price', 'cost', 'how much', 'expensive', 'cheap', 'rate', 'fee', 'charge', 'pesos', '₱'],
    delivery: ['delivery', 'shipping', 'deliver', 'ship', 'courier', 'send', 'freight'],
    payment: ['payment', 'pay', 'gcash', 'cash', 'bank', 'transfer', 'cod', 'debit', 'credit'],
    contact: ['contact', 'phone', 'number', 'email', 'reach', 'call', 'message', 'text'],
    order: ['order', 'buy', 'purchase', 'cart', 'checkout', 'get', 'want'],
    location: ['location', 'where', 'address', 'find', 'area', 'place', 'store', 'branch'],
    hours: ['hours', 'open', 'close', 'time', 'schedule', 'when', 'available'],
    menu: ['menu', 'items', 'products', 'list', 'what do you', 'sell', 'offer', 'have'],
    policy: ['policy', 'rule', 'refund', 'return', 'cancel', 'guarantee', 'warranty']
  };
  
  const foundTopics = [];
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      foundTopics.push(topic);
    }
  }
  
  return foundTopics;
}

/**
 * Calculate relevance score between query and knowledge base line
 */
function calculateRelevanceScore(query, topics, kbLine) {
  const lowerLine = kbLine.toLowerCase();
  let score = 0;
  
  // Topic matching (high weight)
  topics.forEach(topic => {
    if (lowerLine.includes(topic)) score += 10;
  });
  
  // Extract meaningful words from query (3+ characters)
  const queryWords = query.split(/\s+/).filter(word => word.length > 2);
  
  // Word matching (medium weight)
  queryWords.forEach(word => {
    if (lowerLine.includes(word)) {
      score += 5;
    }
  });
  
  // Partial word matching (low weight)
  queryWords.forEach(word => {
    if (word.length > 4) {
      const partial = word.substring(0, word.length - 1);
      if (lowerLine.includes(partial)) {
        score += 2;
      }
    }
  });
  
  // Boost score if the line contains numbers and query asks about amounts
  if (query.match(/\b(how much|cost|price|fee)\b/) && kbLine.match(/₱|\d+/)) {
    score += 8;
  }
  
  return score;
}

/**
 * Check if the query is a question
 */
function isQuestion(query) {
  return query.includes('?') || 
         query.match(/\b(what|where|when|who|why|how|can|do|does|is|are)\b/);
}

/**
 * Format knowledge base information as a natural answer
 */
function formatAnswer(query, relevantLines) {
  const lowerQuery = query.toLowerCase();
  
  // For "what" questions
  if (lowerQuery.startsWith('what')) {
    return relevantLines.join(' ');
  }
  
  // For "where" questions
  if (lowerQuery.startsWith('where')) {
    return relevantLines.join(' ');
  }
  
  // For "how much" / "how many" questions
  if (lowerQuery.includes('how much') || lowerQuery.includes('how many')) {
    return relevantLines.join(' ');
  }
  
  // For "can I" / "do you" questions
  if (lowerQuery.match(/\b(can i|do you|can you)\b/)) {
    const info = relevantLines.join(' ');
    if (info.toLowerCase().includes('accept') || info.toLowerCase().includes('offer')) {
      return 'Yes! ' + info;
    }
    return info;
  }
  
  // Default: return the information
  return relevantLines.join(' ');
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
