# Spreadsheet Integration Guide

This guide covers how to set up and use Google Sheets integration with WebGen AI for contact forms, order tracking, and client dashboards.

## Overview

WebGen AI integrates with Google Sheets to provide:
- Contact form submissions stored in spreadsheets
- Order tracking with automatic spreadsheet creation
- Client dashboards that read order data from spreadsheets
- Email notifications based on spreadsheet data

All integrations use Google Apps Script, which is free and requires no paid services.

## Table of Contents

1. [Contact Form Integration](#contact-form-integration)
2. [Order Tracking Integration](#order-tracking-integration)
3. [Client Dashboard Integration](#client-dashboard-integration)
4. [Advanced Features](#advanced-features)
5. [Troubleshooting](#troubleshooting)

## Contact Form Integration

### Overview

Contact form integration allows website contact forms to automatically:
- Send emails to website owners
- Store all submissions in a Google Sheet
- Support multiple clients from a single script
- Route inquiries to the correct email address based on ClientID

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Website Contact Forms" or "Client Inquiries"
4. Create the "Clients" tab:
   - Click the "+" button at the bottom to add a new sheet
   - Rename it to "Clients"
   - Set up headers in Row 1:
     - Column A: **ClientID**
     - Column B: **OwnerEmail**
     - Column C: **BusinessName**

5. Add your first client:
   - Ask the client for their email address and business name
   - Create a ClientID (e.g., `salon`, `bakery`, `rose`) - keep it simple, lowercase, no spaces
   - Add a row with: ClientID, OwnerEmail, BusinessName

6. Create the "Inquiries" tab:
   - Add a new sheet named "Inquiries"
   - The script will automatically add headers when the first submission arrives

### Step 2: Set Up Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code
3. Copy the contact form script code (available in `docs/CONTACT_FORM_SETUP.md` or from the repository). See [Scripts Reference](scripts-reference.md) for details.
4. Paste it into the Apps Script editor
5. Update the `ADMIN_EMAIL` constant with your email address
6. Save the project (File → Save)

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Select type"
3. Select **"Web app"**
4. Configure settings:
   - **Execute as**: Me
   - **Who has access**: **Anyone** (critical - must be set to "Anyone")
5. Click **Deploy**
6. Authorize the script when prompted
7. Copy the Web App URL (starts with `https://script.google.com/macros/s/...`)

### Step 4: Configure in Website Builder

1. Open your website in the Website Builder
2. Go to the **"Content Management"** tab
3. Scroll to the **"Contact"** section
4. Find **"Contact Form Configuration"** (below Contact Details)
5. Enable the toggle
6. Paste the Web App URL
7. Enter the ClientID (must match the ClientID in your Google Sheet)
8. Save the website

### Step 5: Test

1. Preview your website
2. Fill out the contact form
3. Submit the form
4. Verify:
   - Email received at the OwnerEmail address
   - New row added to the "Inquiries" tab in Google Sheet
   - Admin email received a BCC copy (if configured)

### Managing Multiple Clients

To add a new client:
1. Get the client's email and business name
2. Create a unique ClientID
3. Add a row to the "Clients" tab in your Google Sheet
4. Configure the website with the same ClientID

All clients use the same Web App URL - the script routes emails based on ClientID.

## Order Tracking Integration

### Overview

Order tracking integration automatically:
- Saves orders to Google Spreadsheets
- Creates one spreadsheet per website
- Organizes spreadsheets in a Drive folder
- Provides status tracking with dropdown menus
- Still opens Messenger with prefilled messages

### Step 1: Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Open `docs/ORDER_TRACKING_SCRIPT.js` from the repository (see [Scripts Reference](scripts-reference.md) for details)
4. Copy the entire code
5. Paste into the Apps Script editor
6. Update `ADMIN_EMAIL` with your email address
7. Save the project

### Step 2: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon → Select **"Web app"**
3. Configure:
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Authorize the script
6. Copy the Web App URL

### Step 3: Configure in Website Builder

1. Open your website in the Website Builder
2. Go to the **"Integrations"** tab
3. Enable **"Facebook Messenger"** toggle
4. Enter your **Facebook Page ID**
5. Paste the **Google Script URL** in "Google Spreadsheet Integration" field
6. Save the website

### Step 4: Test

1. Preview your website
2. Add items to cart
3. Fill checkout form (name, location)
4. Click **"Checkout via Messenger"**
5. Verify:
   - Messenger opens with prefilled message
   - Check Google Drive → "Messenger/Order Tracking" folder
   - Open spreadsheet → See your order

### Spreadsheet Structure

Each website gets its own spreadsheet named: `{Website Title} - Orders`

The spreadsheet contains:
- **Orders sheet**: All order data with columns:
  - Order ID
  - Date/Time
  - Customer Name
  - Customer Email
  - Location
  - Items
  - Item Details
  - Total Amount
  - Note
  - Status (with dropdown)

- **Dashboard sheet**: Automatic dashboard with:
  - KPI cards (Revenue, Orders, Pending)
  - Charts (Status distribution, Top products)
  - Recent orders table

### Managing Orders

1. Open the spreadsheet for your website
2. View orders in the "Orders" sheet
3. Update status using the dropdown in the Status column
4. View analytics in the "Dashboard" sheet

Status options:
- Pending (default)
- Processing
- Preparing
- Ready
- Out for Delivery
- Delivered
- Cancelled

## Client Dashboard Integration

### Overview

The Client Dashboard allows clients (editors) to view their order statistics and recent orders directly from the WebGen AI interface. Data is fetched from Google Sheets.

### Prerequisites

- Order tracking must be set up (see above)
- Client must be assigned to a website
- Google Apps Script must include the `doGet` function (included in ORDER_TRACKING_SCRIPT.js)

### Step 1: Create Client Account

1. Log in as admin
2. Go to **Users** in the sidebar
3. Enter client's email and password
4. Click **"Create Editor"**
5. Client account is created

### Step 2: Assign Client to Website

1. Go to **Dashboard**
2. Find the client's website
3. Click **"Assign"** in the Editors column
4. Enter the client's email address
5. Click **"Add"**

### Step 3: Client Access

The client can now:
1. Log in with their email/password
2. See their Order Dashboard with:
   - Order statistics (Total, Pending, Delivered, Revenue)
   - Recent orders table
   - Link to open Google Sheets directly
   - Refresh button to reload orders

### How It Works

1. Client logs in → Dashboard loads
2. Dashboard calls Google Apps Script `doGet` endpoint
3. Script reads from Google Sheets
4. Data returned and displayed in dashboard

The dashboard shows:
- **Statistics Cards**: Total Orders, Pending, Delivered, Total Revenue
- **Orders Table**: 20 most recent orders with details
- **Actions**: Refresh, Edit Website, Open in Google Sheets

## Advanced Features

### Email Notifications for Order Status Changes

To enable automatic email notifications when order status changes:

1. Open the specific spreadsheet for a client (e.g., "Salon - Orders")
2. Go to **Extensions** → **Apps Script**
3. Copy the code from `docs/CLIENT_SHEET_SCRIPT.js` (see [Scripts Reference](scripts-reference.md) for details)
4. Paste it into the Apps Script editor
5. Update `BUSINESS_NAME` and `BUSINESS_EMAIL` constants
6. Save the script
7. In the spreadsheet, go to **Extensions** → **Apps Script** → **Admin Controls** menu
8. Click **"Enable Email Notifications"**
9. Authorize when prompted

Now, when you change the order status in the dropdown, customers will automatically receive an email notification.

### Chatbot Knowledge Base

The client sheet script also includes chatbot knowledge base functionality:

1. In the spreadsheet, go to **Extensions** → **Apps Script** → **Admin Controls** menu
2. Click **"Initialize Chatbot Knowledge Base"**
3. A "KnowledgeBase" sheet will be created
4. Add your business information, policies, and FAQ details in column A
5. The AI chatbot will use this information to answer customer questions

### Customizing Order Status Options

To change available status options:

1. Open your Order Tracking Apps Script
2. Find: `const ORDER_STATUS_OPTIONS = [...]`
3. Modify the array with your desired statuses
4. Redeploy the script (Deploy → Manage deployments → Edit → Deploy)

### Changing Drive Folder Name

To use a different folder name:

1. Open your Order Tracking Apps Script
2. Find: `const DRIVE_FOLDER_NAME = "Messenger/Order Tracking";`
3. Change to your preferred name
4. Redeploy the script

## Troubleshooting

### Contact Form Issues

**Problem: Form submits but no email received**
- Check spam folder
- Verify ClientID matches exactly (case-sensitive)
- Check Google Sheet "Inquiries" tab to see if data was saved
- Verify OwnerEmail in "Clients" tab is correct
- Check Apps Script execution log for errors

**Problem: "Something went wrong" error**
- Verify Web App URL is correct and complete
- Ensure script is deployed (not just saved)
- Check browser console (F12) for CORS errors
- Verify "Who has access" is set to "Anyone"

**Problem: CORS errors**
- Ensure script includes `doOptions` function
- Redeploy the script
- Check that deployment settings are correct

### Order Tracking Issues

**Problem: Orders not appearing in spreadsheet**
- Verify script URL is correct (ends with `/exec`)
- Check "Who has access" is set to "Anyone"
- Check browser console for errors
- Verify website title matches spreadsheet name
- Check Google Drive folder exists

**Problem: Folder not created**
- Folder is created on first order
- Verify script has Drive permissions
- Check you're logged into correct Google account
- Try placing a test order

**Problem: Status dropdown not working**
- Ensure you're clicking in the Status column
- Try refreshing the spreadsheet
- Check data validation is applied
- Manually reapply validation if needed

### Client Dashboard Issues

**Problem: "Error Loading Orders"**
- Verify Google Script URL is configured in website settings
- Check script has been deployed with `doGet` function
- Check browser console for detailed errors
- Verify orders have been placed (spreadsheet exists)

**Problem: "Spreadsheet not found"**
- Ensure orders have been placed (spreadsheet created on first order)
- Verify website title matches spreadsheet name
- Check Google Drive folder exists

**Problem: No orders showing**
- Check if any orders have been placed
- Verify Google Script URL is correct
- Try refreshing the dashboard
- Check spreadsheet has data in "Orders" sheet

### General Issues

**Problem: Script execution quota exceeded**
- Google Apps Script has daily quotas
- Free tier: 20,000 emails per day
- Wait 24 hours or upgrade to Google Workspace

**Problem: Script not updating**
- After making changes, you must create a new deployment
- Saving alone does not update the live script
- Go to Deploy → Manage deployments → Edit → Deploy

## Best Practices

### Security

- Don't share Web App URLs publicly
- Keep service role keys secret
- Regularly backup your Google Sheets
- Use strong ClientIDs (not obvious like "test" or "admin")

### Organization

- Use consistent naming for spreadsheets
- Organize by client or website
- Regularly review and clean up old data
- Set up email filters to organize notifications

### Performance

- Google Sheets can handle millions of rows
- Scripts are designed for high volume
- Monitor execution logs for errors
- Set up error notifications

### Maintenance

- Regularly check execution logs
- Monitor email delivery rates
- Update scripts when needed
- Test integrations after updates

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review browser console for errors (F12)
3. Check Apps Script execution logs
4. Verify all configuration steps were completed
5. Test scripts manually using test functions

For detailed setup instructions, refer to:
- Contact Form: `docs/CONTACT_FORM_SETUP.md`
- Order Tracking: `docs/ORDER_TRACKING_SETUP.md`
- Client Dashboard: `docs/CLIENT_DASHBOARD_SETUP.md`

