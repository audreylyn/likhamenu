# Email Notification Setup Guide

This guide explains how to enable the automatic email notification system for the Order Tracking Dashboard.

## Option 1: The "Premium Handover" (Recommended)

This installs the script directly into the client's sheet, giving them a custom "Admin Controls" menu.

1.  **Open the Client's Spreadsheet**: Open the Google Sheet generated for the client.
2.  **Open Apps Script**: Go to **Extensions > Apps Script**.
3.  **Install Code**: Paste the content of `ORDER_TRACKING_SCRIPT.js`.
4.  **Activate Menu**: Refresh the sheet. A new **"Admin Controls"** menu will appear.
5.  **Enable Notifications**: Click **Admin Controls > Enable Email Notifications** and authorize.

**Result**: The client receives emails automatically when they change an order status.

## Option 2: The "Remote Activation"

Enable features silently without the client seeing the code.

1.  **Get Spreadsheet ID**: Copy the ID from the client's spreadsheet URL.
2.  **Open Main Script**: Open your master script.
3.  **Run Activation Function**:
    ```javascript
    function activateClientTrigger() {
      const clientSheetId = "PASTE_THE_CLIENT_SHEET_ID_HERE";
      const sheet = SpreadsheetApp.openById(clientSheetId);
      ScriptApp.newTrigger("sendOrderStatusEmail")
        .forSpreadsheet(sheet)
        .onEdit()
        .create();
    }
    ```
4.  **Run**: Execute the function to set up the trigger.

**Result**: The email trigger is active for that specific sheet.
