# Scripts Reference Guide

This guide explains all the Google Apps Script files and code snippets referenced in the WebGen AI documentation. These scripts are located in the `docs/` folder of the repository.

## Overview

WebGen AI uses Google Apps Script files to integrate with Google Sheets for various features. These scripts need to be copied and deployed in Google Apps Script to enable functionality.

## Script Files

### ORDER_TRACKING_SCRIPT.js

**Location:** `docs/ORDER_TRACKING_SCRIPT.js`

**Purpose:** Main script for handling order tracking and storage in Google Spreadsheets.

**What it does:**
- Receives order data from websites via POST requests
- Creates and organizes spreadsheets in Google Drive (one per website)
- Stores order information (customer details, items, totals, status)
- Creates automatic dashboards with charts and statistics
- Provides API endpoint to read orders for client dashboards
- Handles CORS for web requests

**When to use:**
- Setting up order tracking for e-commerce websites
- Enabling automatic order storage in Google Sheets
- Creating order management dashboards

**How to use:**
1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy the entire code from `docs/ORDER_TRACKING_SCRIPT.js`
4. Paste into Apps Script editor
5. Update `ADMIN_EMAIL` constant with your email
6. Deploy as Web App (Execute as: Me, Who has access: Anyone)
7. Copy the Web App URL and use it in website configuration

**Key Features:**
- Automatic spreadsheet creation per website
- Status tracking with dropdown menus
- Dashboard with KPI cards and charts
- Color-coded order status
- API endpoint for reading orders

**Configuration:**
- `ADMIN_EMAIL`: Your email for error notifications
- `DRIVE_FOLDER_NAME`: Folder name for storing spreadsheets (default: "Messenger/Order Tracking")
- `ORDER_STATUS_OPTIONS`: Available status options for orders

### CLIENT_SHEET_SCRIPT.js

**Location:** `docs/CLIENT_SHEET_SCRIPT.js`

**Purpose:** Client-side script for individual spreadsheets to enable email notifications and chatbot features.

**What it does:**
- Sends email notifications when order status changes
- Creates chatbot knowledge base sheet
- Provides chatbot API endpoint
- Adds admin menu to spreadsheets for easy setup

**When to use:**
- After orders have been created (spreadsheet exists)
- When you want automatic email notifications for status changes
- When you want to set up chatbot knowledge base

**How to use:**
1. Open the specific Google Sheet for a client (e.g., "Salon - Orders")
2. Go to **Extensions** → **Apps Script**
3. Copy the entire code from `docs/CLIENT_SHEET_SCRIPT.js`
4. Paste into Apps Script editor
5. Update `BUSINESS_NAME` and `BUSINESS_EMAIL` constants
6. Save the script
7. In the spreadsheet, use the **Admin Controls** menu to:
   - Enable Email Notifications
   - Initialize Chatbot Knowledge Base

**Key Features:**
- One-click email notification setup
- Automatic email sending when status changes
- Chatbot knowledge base creation
- Admin menu for easy management

**Configuration:**
- `BUSINESS_NAME`: The business/website name (used in emails)
- `BUSINESS_EMAIL`: The business email (used as reply-to address)

**Important Notes:**
- This script is added to EACH client's spreadsheet individually
- Different from ORDER_TRACKING_SCRIPT.js which is deployed once for all websites
- Must be added after the spreadsheet is created by ORDER_TRACKING_SCRIPT.js

### Contact Form Script

**Location:** Code is in `docs/CONTACT_FORM_SETUP.md` (embedded in the documentation)

**Purpose:** Handles contact form submissions from websites.

**What it does:**
- Receives contact form data via POST requests
- Looks up client information from "Clients" sheet
- Sends email to the correct client based on ClientID
- Stores all submissions in "Inquiries" sheet
- Sends BCC copy to admin email

**When to use:**
- Setting up contact forms for websites
- Enabling email routing for multiple clients
- Storing contact form submissions

**How to use:**
1. Create a Google Sheet with "Clients" and "Inquiries" tabs
2. Go to **Extensions** → **Apps Script**
3. Copy the contact form script code from `docs/CONTACT_FORM_SETUP.md`
4. Paste into Apps Script editor
5. Update `ADMIN_EMAIL` constant
6. Deploy as Web App (Execute as: Me, Who has access: Anyone)
7. Copy the Web App URL and use it in website configuration

**Key Features:**
- Multi-client support from single script
- Automatic email routing
- Submission storage
- Professional email templates

## Script Comparison

| Script | Deploy Location | Used For | Number of Deployments |
|--------|----------------|----------|---------------------|
| ORDER_TRACKING_SCRIPT.js | script.google.com (standalone) | All websites | One deployment for all |
| CLIENT_SHEET_SCRIPT.js | Individual spreadsheets | Per client/website | One per spreadsheet |
| Contact Form Script | Google Sheet with Clients tab | Contact forms | One deployment for all |

## Where to Find Script Code

### In the Repository

All scripts are located in the `docs/` folder:

```
docs/
├── ORDER_TRACKING_SCRIPT.js          # Main order tracking script
├── CLIENT_SHEET_SCRIPT.js             # Client spreadsheet script
├── CONTACT_FORM_SETUP.md              # Contact form script (code embedded)
├── ORDER_TRACKING_SETUP.md            # Setup instructions
├── CONTACT_FORM_SETUP.md              # Setup instructions
└── CLIENT_DASHBOARD_SETUP.md          # Dashboard setup instructions
```

### In GitBook Documentation

Script references appear in:
- [Spreadsheet Integration Guide](spreadsheet-integration.md) - Main guide
- [Installation Guide](installation.md) - Initial setup
- [Usage Guide](usage.md) - How to use features

## Script Deployment Checklist

### ORDER_TRACKING_SCRIPT.js

- [ ] Copy code from `docs/ORDER_TRACKING_SCRIPT.js`
- [ ] Create new project at script.google.com
- [ ] Paste code into editor
- [ ] Update `ADMIN_EMAIL` constant
- [ ] Save project
- [ ] Deploy as Web App
- [ ] Set "Execute as: Me"
- [ ] Set "Who has access: Anyone"
- [ ] Authorize script
- [ ] Copy Web App URL
- [ ] Add URL to website configuration

### CLIENT_SHEET_SCRIPT.js

- [ ] Open client's spreadsheet (created by ORDER_TRACKING_SCRIPT.js)
- [ ] Go to Extensions → Apps Script
- [ ] Copy code from `docs/CLIENT_SHEET_SCRIPT.js`
- [ ] Paste into editor
- [ ] Update `BUSINESS_NAME` constant
- [ ] Update `BUSINESS_EMAIL` constant
- [ ] Save script
- [ ] Refresh spreadsheet
- [ ] Use Admin Controls menu to enable features

### Contact Form Script

- [ ] Create Google Sheet with Clients and Inquiries tabs
- [ ] Go to Extensions → Apps Script
- [ ] Copy code from `docs/CONTACT_FORM_SETUP.md`
- [ ] Paste into editor
- [ ] Update `ADMIN_EMAIL` constant
- [ ] Save project
- [ ] Deploy as Web App
- [ ] Set "Execute as: Me"
- [ ] Set "Who has access: Anyone"
- [ ] Authorize script
- [ ] Copy Web App URL
- [ ] Add URL and ClientID to website configuration

## Common Questions

### Do I need all three scripts?

**No.** You only need the scripts for features you want to use:
- **Contact forms**: Use Contact Form Script
- **Order tracking**: Use ORDER_TRACKING_SCRIPT.js
- **Email notifications**: Use CLIENT_SHEET_SCRIPT.js (after orders are set up)
- **Chatbot**: Use CLIENT_SHEET_SCRIPT.js (optional)

### Can I use the same script for multiple websites?

**Yes, for ORDER_TRACKING_SCRIPT.js and Contact Form Script.** These are deployed once and handle all websites automatically.

**No, for CLIENT_SHEET_SCRIPT.js.** This must be added to each individual spreadsheet.

### What if I update a script?

After updating script code:
1. Save the changes
2. Create a **new deployment** (not just save)
3. Go to Deploy → Manage deployments → Edit → Deploy
4. The new version will be active

### Where do I get the script code?

All scripts are in the `docs/` folder of the repository:
- Download from GitHub
- Clone the repository
- Copy code directly from the files

### Do I need to modify the scripts?

**Minimal modifications needed:**
- ORDER_TRACKING_SCRIPT.js: Update `ADMIN_EMAIL` only
- CLIENT_SHEET_SCRIPT.js: Update `BUSINESS_NAME` and `BUSINESS_EMAIL`
- Contact Form Script: Update `ADMIN_EMAIL` only

All other configuration is done through the website builder or spreadsheet setup.

## Troubleshooting

### Script not working after deployment

- Ensure you created a **new deployment** (not just saved)
- Check "Who has access" is set to "Anyone"
- Verify script is authorized
- Check execution logs in Apps Script editor

### Can't find script code

- Scripts are in the `docs/` folder
- ORDER_TRACKING_SCRIPT.js and CLIENT_SHEET_SCRIPT.js are `.js` files
- Contact form script code is embedded in CONTACT_FORM_SETUP.md

### Script errors

- Check execution logs in Apps Script editor
- Verify all constants are updated
- Ensure proper permissions are granted
- Check browser console for CORS errors

## Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Spreadsheet Integration Guide](spreadsheet-integration.md)
- [Order Tracking Setup](https://github.com/your-repo/docs/ORDER_TRACKING_SETUP.md)
- [Contact Form Setup](https://github.com/your-repo/docs/CONTACT_FORM_SETUP.md)

