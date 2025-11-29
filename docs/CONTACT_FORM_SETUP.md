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
   - In Row 2, add your client's information:
     - `A2`: `rose` (or any unique identifier)
     - `B2`: `rose@likhasiteworks.studio` (client's email)
     - `C2`: `Rose Flowers` (business name)

6. **Create the "Inquiries" tab:**
   - This will be auto-created by the script, but you can create it manually:
   - Add a new sheet named "Inquiries"
   - The script will add headers automatically when first submission comes in

**Example Clients Tab:**
```
| ClientID | OwnerEmail              | BusinessName      |
|----------|-------------------------|-------------------|
| rose     | rose@likhasiteworks.studio | Rose Flowers    |
| bakery   | orders@goldencrumb.com     | The Golden Crumb |
| mike     | mike@autoshop.com          | Mike's Auto      |
```

---

## Step 2: Set Up Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Copy and paste the following code:

```javascript
// ============================================
// CONFIGURATION
// ============================================
const ADMIN_EMAIL = "your-email@gmail.com"; // YOUR email (backup/always receives copy)
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
    for (let i = 1; i < clientData.length; i++) {
      if (clientData[i][0] == clientId) {
        ownerEmail = clientData[i][1];
        businessName = clientData[i][2] || clientId;
        break;
      }
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
      <h3>New Lead for ${businessName}</h3>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Inquiry Type:</strong> ${data.type || "General Inquiry"}</p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr/>
      <p style="color: #666; font-size: 12px;">This inquiry was submitted through your website contact form.</p>
    `;

    MailApp.sendEmail({
      to: ownerEmail,
      bcc: ADMIN_EMAIL, // You always get a backup copy
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
     https://script.google.com/macros/s/AKfycby.../exec
     ```
   - **Copy this entire URL** - you'll need it in the next step

**⚠️ Important Notes:**
- The URL will only work after you click "Deploy"
- If you make changes to the script, you need to create a "New deployment" (not just save)
- Each deployment gets a new version number
- Keep the URL safe - anyone with it can submit forms (but they can't see your data)

---

## Step 4: Configure in Website Builder

1. **Open your website in the Website Builder**
2. **Go to "Content Management" tab**
3. **Scroll down to "Contact" section**
4. **Find "Contact Form Configuration"** (below Contact Details)
5. **Enable Email Submissions:**
   - Toggle the switch to "ON"
6. **Paste your Web App URL:**
   - Paste the URL you copied from Step 3
   - It should start with `https://script.google.com/macros/s/...`
7. **Enter Client ID:**
   - Enter the ClientID from your "Clients" tab (e.g., `rose`, `bakery`)
   - This must **exactly match** the ClientID in your Google Sheet
8. **Verify Configuration:**
   - You should see a green status indicator: "Configuration complete"
   - If you see yellow, check that both fields are filled

**Example Configuration:**
```
✅ Enable Email Submissions: ON
📋 Google Apps Script Web App URL: https://script.google.com/macros/s/AKfycby.../exec
🆔 Client ID: rose
```

9. **Save your website:**
   - Click the "Save" button in the top right
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

1. **In your Google Sheet, go to the "Clients" tab**
2. **Add a new row:**
   ```
   | ClientID | OwnerEmail           | BusinessName    |
   |----------|----------------------|-----------------|
   | newclient| client@example.com   | New Business    |
   ```
3. **In the Website Builder:**
   - Open the website for the new client
   - Go to Contact Form Configuration
   - Use the **same Web App URL** (from your script)
   - Enter the **new ClientID** (e.g., `newclient`)
   - Save

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
2. **Verify ClientID** - Must exactly match the sheet (case-sensitive)
3. **Check Google Sheet** - Look in "Inquiries" tab to see if data was saved
4. **Check Apps Script execution log:**
   - Go to Apps Script editor
   - Click "Executions" (clock icon)
   - Check for errors

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

