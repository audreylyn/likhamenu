# Contact Form Setup Guide - Google Apps Script Integration

This guide will walk you through setting up a free, automated email system for your website's contact form using Google Apps Script and Google Sheets.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Google Sheet](#step-1-create-google-sheet)
4. [Step 2: Set Up Apps Script](#step-2-set-up-apps-script)
5. [Step 3: Deploy as Web App](#step-3-deploy-as-web-app)
6. [Step 4: Configure in Website Builder](#step-4-configure-in-website-builder)
7. [Step 5: Test the Integration](#step-5-test-the-integration)
8. [Managing Multiple Clients](#managing-multiple-clients)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Configuration](#advanced-configuration)

---

## Overview

This integration allows your website's contact form to:
- ✅ Send emails directly to the website owner
- ✅ Store all submissions in a Google Sheet (backup database)
- ✅ Support multiple clients from a single script
- ✅ Work completely free (no paid services required)
- ✅ Handle CORS automatically (works with React/Vite)

**How it works:**
1. Customer fills out the contact form on your website
2. Form data is sent to Google Apps Script
3. Script saves the submission to Google Sheet
4. Script sends email to the website owner
5. You receive the inquiry via email and can view it in the sheet

---

## Prerequisites

- ✅ A Google account (Gmail)
- ✅ Access to Google Sheets
- ✅ Access to Google Apps Script
- ✅ Your website deployed and accessible

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Website Contact Forms" or "Client Inquiries"
4. **Create the "Clients" tab:**
   - Click the "+" button at the bottom to add a new sheet
   - Rename it to "Clients"
   - Set up the following columns in Row 1:

| A | B | C |
|---|---|---|
| **ClientID** | **OwnerEmail** | **BusinessName** |

5. **Add your first client:**
   - **First, ask your client for:**
     - Their email address (where they want to receive inquiries)
     - Their business name
   - **Then, create a ClientID** (you choose this - keep it simple):
     - Use their subdomain, business name, or a short identifier
     - Examples: `salon`, `rose`, `bakery`, `mike`
     - Keep it lowercase, no spaces
   - **In Row 2, add the client's information:**
     - `A2`: `salon` (the ClientID you created)
     - `B2`: `orders@salon.com` (the email the client provided)
     - `C2`: `Salon Beauty` (the business name the client provided)

6. **Create the "Inquiries" tab:**
   - This will be auto-created by the script, but you can create it manually:
   - Add a new sheet named "Inquiries"
   - The script will add headers automatically when first submission comes in

**Example Clients Tab:**
```
| ClientID | OwnerEmail              | BusinessName      |
|----------|-------------------------|-------------------|
| salon    | orders@salon.com        | Salon Beauty      |
| rose     | rose@likhasiteworks.studio | Rose Flowers    |
| bakery   | orders@goldencrumb.com     | The Golden Crumb |
| mike     | mike@autoshop.com          | Mike's Auto      |
```

**Who provides what:**
- **ClientID**: You (developer) create this - keep it simple and unique
- **OwnerEmail**: Client provides this - their business email
- **BusinessName**: Client provides this - their business name

---

## Step 2: Set Up Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Copy and paste the following code:

```javascript
// ============================================
// CONFIGURATION
// ============================================
const ADMIN_EMAIL = "likhasiteworks@gmail.com"; // YOUR email (backup/always receives copy)
const SHEET_NAME = "Inquiries"; // Sheet name for storing submissions

// ============================================
// MAIN FUNCTION - Handles Form Submissions
// ============================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for lock

  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const clientId = data.clientId || "default"; // e.g., "rose" or "bakery"

    const doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // ============================================
    // STEP 1: Look up the client in "Clients" tab
    // ============================================
    const clientSheet = doc.getSheetByName("Clients");
    if (!clientSheet) {
      throw new Error("Clients sheet not found. Please create a 'Clients' tab with ClientID, OwnerEmail, and BusinessName columns.");
    }
    
    const clientData = clientSheet.getDataRange().getValues();
    
    let ownerEmail = ADMIN_EMAIL; // Default to admin if not found
    let businessName = "Unknown Business";
    
    // Loop through rows to find the matching ClientID (skip header row)
    // Make sure to trim whitespace and compare as strings
    for (let i = 1; i < clientData.length; i++) {
      const rowClientId = String(clientData[i][0] || '').trim().toLowerCase();
      const searchClientId = String(clientId || '').trim().toLowerCase();
      
      if (rowClientId === searchClientId) {
        ownerEmail = String(clientData[i][1] || '').trim();
        businessName = String(clientData[i][2] || clientId || 'Unknown Business').trim();
        break;
      }
    }
    
    // If client not found, log warning but still send to admin
    if (ownerEmail === ADMIN_EMAIL && businessName === "Unknown Business") {
      console.warn("ClientID not found: " + clientId + ". Sending to admin email.");
    }

    // ============================================
    // STEP 2: Save to "Inquiries" Sheet
    // ============================================
    let sheet = doc.getSheetByName(SHEET_NAME);
    if (!sheet) {
      // Create the sheet if it doesn't exist
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Client ID", "Type", "Name", "Email", "Message"]);
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");
    }
    
    // Append the submission data
    sheet.appendRow([
      new Date(),
      clientId,
      data.type || "General Inquiry",
      data.name,
      data.email,
      data.message
    ]);

    // ============================================
    // STEP 3: Send Email to Client (BCC to Admin)
    // ============================================
    const emailSubject = `New Inquiry for ${businessName}: ${data.type || "General Inquiry"}`;
    const emailBody = `
<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Mobile resets */
            body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            img { border: 0; outline: none; text-decoration: none; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
          
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 20px;">
            <tr>
              <td align="center">
                
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
                  
                  <tr>
                    <td style="background-color: #FCD34D; padding: 32px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">
                        New Website Inquiry
                      </h1>
                      <p style="margin: 8px 0 0 0; color: #374151; font-size: 15px; font-weight: 600;">
                        for ${businessName}
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <table role="presentation" style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
                        
                        <tr>
                          <td style="width: 1%; white-space: nowrap; padding-right: 16px; color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top; padding-top: 2px;">
                            Name
                          </td>
                          <td style="color: #111827; font-size: 16px; font-weight: 500; vertical-align: top;">
                            ${data.name}
                          </td>
                        </tr>

                        <tr>
                          <td style="width: 1%; white-space: nowrap; padding-right: 16px; color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top; padding-top: 2px;">
                            Email
                          </td>
                          <td style="vertical-align: top; word-break: break-all;">
                            <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none; font-size: 16px; font-weight: 500;">
                              ${data.email}
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td style="width: 1%; white-space: nowrap; padding-right: 16px; color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                            Type
                          </td>
                          <td style="vertical-align: middle;">
                            <span style="background-color: #FFFBEB; color: #B45309; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid #FCD34D; display: inline-block;">
                              ${data.type || "General Inquiry"}
                            </span>
                          </td>
                        </tr>

                      </table>

                      <div style="margin-top: 28px;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Message</p>
                        <div style="background-color: #F9FAFB; border-left: 4px solid #FCD34D; padding: 20px; border-radius: 4px;">
                          <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message.replace(/\n/g, '<br>')}</p>
                        </div>
                      </div>

                      <div style="margin-top: 32px; text-align: center;">
                        <a href="mailto:${data.email}?subject=Re: Your Inquiry - ${businessName}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                          Reply to Customer
                        </a>
                      </div>

                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                        Powered by <strong style="color: #4b5563;">LikhaSiteWorks</strong>
                        <br>
                        <span style="font-size: 11px; color: #d1d5db;">Secure Agency Notification System</span>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
    `;

    // Send email to the client (OwnerEmail)
    // If client was found, send to ownerEmail; otherwise send to admin
    const recipientEmail = (ownerEmail !== ADMIN_EMAIL || businessName !== "Unknown Business") 
      ? ownerEmail 
      : ADMIN_EMAIL;
    
    // Only BCC admin if email is going to client (not if already going to admin)
    const bccEmail = (recipientEmail !== ADMIN_EMAIL) ? ADMIN_EMAIL : null;

    MailApp.sendEmail({
      to: recipientEmail,
      bcc: bccEmail, // You get a backup copy only if email goes to client
      subject: emailSubject,
      htmlBody: emailBody,
      name: `${businessName} Bot`,
      replyTo: data.email // Allows direct reply to customer
    });

    // ============================================
    // STEP 4: Return Success Response
    // ============================================
    return ContentService.createTextOutput(
      JSON.stringify({ 
        result: "success",
        message: "Inquiry submitted successfully"
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    console.error("Error processing form submission:", error);
    
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

// ============================================
// CORS HANDLER - Required for React/Vite
// ============================================
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}
```

4. **Update the ADMIN_EMAIL:**
   - Replace `"your-email@gmail.com"` with your actual email address
   - This email will receive a BCC copy of every submission (backup)

5. **Save the script:**
   - Click the floppy disk icon or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)
   - Name your project (e.g., "Contact Form Handler")

---

## Step 3: Deploy as Web App

This is the **most important step**. Follow these instructions carefully:

1. **Click "Deploy"** → **"New deployment"**
2. **Click the gear icon** (⚙️) next to "Select type"
3. **Select "Web app"**
4. **Fill in the deployment settings:**
   - **Description:** `Contact Form v1` (or any description)
   - **Execute as:** `Me` (your Gmail account)
   - **Who has access:** `Anyone` ⚠️ **CRITICAL: Must be "Anyone"**
5. **Click "Deploy"**
6. **Authorize the script:**
   - You'll see an "Authorization required" dialog
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL:**
   - After deployment, you'll see a URL like:
     ```
     https://script.google.com/macros/s/AKfycbylxEq7z1-_8hx37kIfhb6cMw8JM-w-tnd3GgFMKWtQMvuLMAWJ4Zt0w0le-b7VIOhdZg/exec
     ```
   - **Copy this entire URL** - you'll need it in the next step

**⚠️ Important Notes:**
- The URL will only work after you click "Deploy"
- If you make changes to the script, you need to create a "New deployment" (not just save)
- Each deployment gets a new version number
- Keep the URL safe - anyone with it can submit forms (but they can't see your data)

---

## Step 4: Configure in Website Builder

### Where to Find Contact Form Configuration

1. **Open your website in the Website Builder**
2. **Click the "Content Management" tab** (not Settings)
3. **Scroll down to find the "Contact" section**
4. **Look for "Contact Form Configuration"** - it appears **directly below** the "Contact Details" section
   - If you don't see it, make sure the "Contact" section is enabled in Settings → Section Visibility

### Understanding ClientID, OwnerEmail, and BusinessName

**Important:** These are set up by **YOU (the developer/admin)**, not the website owner.

- **ClientID**: A unique identifier you create for each client (e.g., `salon`, `rose`, `bakery`)
  - You create this when adding the client to your Google Sheet
  - Keep it simple: lowercase, no spaces, easy to remember
  
- **OwnerEmail**: The email address where the client wants to receive inquiries
  - **Ask the client for this** - it's their business email
  - Example: `orders@salon.com` or `info@salon.com`
  
- **BusinessName**: The client's business name (for email subject lines)
  - **Ask the client for this** - it's their business name
  - Example: `Salon Beauty`, `Rose Flowers`, `The Golden Crumb`

**Workflow:**
1. Client provides you with: **Email** and **Business Name**
2. You create a **ClientID** (e.g., use their subdomain or business name)
3. You add all three to your Google Sheet "Clients" tab
4. You enter the **ClientID** in the Contact Form Configuration

### Configuration Steps

1. **Enable Email Submissions:**
   - Toggle the switch to "ON"

2. **Paste your Web App URL:**
   - Paste the URL you copied from Step 3
   - It should start with `https://script.google.com/macros/s/...`

3. **Enter Client ID:**
   - Enter the ClientID you created in your Google Sheet
   - Example: If you added `salon` in the sheet, enter `salon` here
   - This must **exactly match** the ClientID in your Google Sheet (case-sensitive)

4. **Verify Configuration:**
   - You should see a green status indicator: "Configuration complete"
   - If you see yellow, check that both fields are filled

**Example Configuration:**
```
✅ Enable Email Submissions: ON
📋 Google Apps Script Web App URL: https://script.google.com/macros/s/AKfycby.../exec
🆔 Client ID: salon
```

5. **Save your website:**
   - Click the "Save Changes" button in the top right
   - Wait for the success message

---

## Step 5: Test the Integration

1. **Preview your website:**
   - Click "View Site" or open your published website
2. **Navigate to the Contact section**
3. **Fill out the contact form:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Inquiry Type: `General Question`
   - Message: `This is a test message`
4. **Click "Send Message"**
5. **Check for success:**
   - You should see: "✓ Message sent successfully! We'll get back to you soon."
6. **Verify in Google Sheet:**
   - Open your Google Sheet
   - Go to the "Inquiries" tab
   - You should see a new row with the test submission
7. **Check your email:**
   - Check the inbox of the email address you set in the "Clients" tab
   - You should receive an email with the form submission
   - Check your ADMIN_EMAIL inbox (you should also receive a BCC copy)

**If everything works:** ✅ You're all set!

**If something doesn't work:** See [Troubleshooting](#troubleshooting) below.

---

## Managing Multiple Clients

This setup supports **unlimited clients** from a single script. Here's how:

### Adding a New Client

**Step 1: Get Information from Client**
- Ask the client for:
  - Their email address (where they want inquiries sent)
  - Their business name

**Step 2: Create ClientID**
- You create a unique ClientID (e.g., `salon`, `bakery`, `mike`)
- Keep it simple: lowercase, no spaces, easy to remember
- Tip: Use their subdomain or a shortened version of their business name

**Step 3: Add to Google Sheet**
1. **In your Google Sheet, go to the "Clients" tab**
2. **Add a new row:**
   ```
   | ClientID | OwnerEmail           | BusinessName    |
   |----------|----------------------|-----------------|
   | salon    | orders@salon.com     | Salon Beauty    |
   ```

**Step 4: Configure in Website Builder**
1. **Open the website for the new client**
2. **Go to "Content Management" tab**
3. **Scroll to "Contact" section**
4. **Find "Contact Form Configuration"** (below Contact Details)
5. **Enable Email Submissions** (toggle ON)
6. **Paste the Web App URL** (same URL for all clients - from your script)
7. **Enter the ClientID** you created (e.g., `salon`)
8. **Save the website**

**That's it!** No code changes needed. The script automatically routes emails based on the ClientID.

### Benefits of This Approach

- ✅ **One Script, Many Clients:** Deploy once, use for all clients
- ✅ **Centralized Database:** All submissions in one Google Sheet
- ✅ **Easy Management:** Add/remove clients by editing the sheet
- ✅ **Kill Switch:** Remove a client's row to disable their form
- ✅ **Backup Emails:** You always get a BCC copy of every submission

---

## Troubleshooting

### Problem: "Message sent successfully" but no email received

**Possible causes:**
1. **Check spam folder** - Gmail might have filtered it
2. **Verify ClientID** - Must match the sheet (case-insensitive, but check for typos)
3. **Check Google Sheet** - Look in "Inquiries" tab to see if data was saved
4. **Check Apps Script execution log:**
   - Go to Apps Script editor
   - Click "Executions" (clock icon)
   - Check for errors
5. **Verify email in Clients tab** - Make sure OwnerEmail column has a valid email address
6. **Check recipient** - Emails go to OwnerEmail (client), not admin. Admin gets BCC copy.

### Problem: "Something went wrong" error message

**Possible causes:**
1. **Invalid Web App URL** - Make sure you copied the entire URL
2. **Script not deployed** - You must click "Deploy", not just save
3. **Authorization failed** - Re-authorize the script
4. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for error messages in Console tab

### Problem: CORS errors in browser console

**Solution:**
- The script includes CORS handling (`doOptions` function)
- Make sure you deployed the script (not just saved)
- Try creating a new deployment

### Problem: "Clients sheet not found" error

**Solution:**
- Make sure you created a sheet named exactly "Clients" (case-sensitive)
- Check that it has headers: ClientID, OwnerEmail, BusinessName
- Verify the client row exists with the correct ClientID

### Problem: Form works but emails go to wrong address

**Solution:**
- Check the "Clients" tab in your Google Sheet
- Verify the ClientID matches exactly (no extra spaces)
- Check the OwnerEmail column for the correct email
- Make sure the row is not empty

### Problem: Script execution quota exceeded

**Solution:**
- Google Apps Script has daily quotas:
  - 20,000 emails per day (free tier)
  - If you exceed this, wait 24 hours or upgrade to Google Workspace
- Check quota: Apps Script → "Executions" → "Quotas"

---

## Advanced Configuration

### Customizing Email Template

Edit the `emailBody` variable in the script to customize the email format:

```javascript
const emailBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px;">
    <h2 style="color: #4285f4;">New Website Inquiry</h2>
    <p><strong>From:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Type:</strong> ${data.type}</p>
    <hr/>
    <p>${data.message}</p>
  </div>
`;
```

### Adding More Fields

If you want to capture additional fields (e.g., phone number):

1. **Update the form** in `PreviewContactSection.tsx` to include the new field
2. **Update the script** to save the new field:
   ```javascript
   sheet.appendRow([
     new Date(),
     clientId,
     data.type,
     data.name,
     data.email,
     data.phone, // New field
     data.message
   ]);
   ```

### Setting Up Email Filters

Create Gmail filters to automatically organize inquiries:

1. Go to Gmail → Settings → Filters and Blocked Addresses
2. Create filter for subject: `New Inquiry for [Business Name]`
3. Apply label: "Website Inquiries"
4. Mark as important

### Monitoring Submissions

Set up Google Sheets notifications:

1. In Google Sheet, click "Tools" → "Notification rules"
2. Add rule: "A user submits a form"
3. Choose notification frequency
4. You'll get email alerts when new submissions arrive

---

## Security Considerations

### Is this secure?

- ✅ **Read-only for public:** The Web App URL only allows POST requests (submissions)
- ✅ **No data exposure:** Visitors can't read your sheet or see other submissions
- ✅ **Email validation:** Consider adding email validation in the script
- ⚠️ **Rate limiting:** Google Apps Script has built-in quotas (prevents abuse)

### Best Practices

1. **Don't share your Web App URL publicly** (only use in your website)
2. **Regular backups:** Export your Google Sheet periodically
3. **Monitor submissions:** Check the sheet regularly for spam
4. **Use strong ClientIDs:** Don't use obvious IDs like "test" or "admin"

---

## Support & Resources

### Google Apps Script Documentation
- [Official Docs](https://developers.google.com/apps-script)
- [MailApp Reference](https://developers.google.com/apps-script/reference/mail/mail-app)
- [SpreadsheetApp Reference](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)

### Common Issues
- Check the [Troubleshooting](#troubleshooting) section above
- Review Apps Script execution logs for detailed error messages
- Test the script manually using the "Run" button in Apps Script editor

---

## Quick Reference Checklist

- [ ] Created Google Sheet with "Clients" tab
- [ ] Added client information to "Clients" tab
- [ ] Created Apps Script with provided code
- [ ] Updated ADMIN_EMAIL in script
- [ ] Deployed script as Web App (with "Anyone" access)
- [ ] Copied Web App URL
- [ ] Configured in Website Builder (URL + ClientID)
- [ ] Tested form submission
- [ ] Verified email received
- [ ] Verified data in Google Sheet

---

**Need help?** Check the troubleshooting section or review the error messages in your browser's developer console (F12).

