# Order Tracking Setup Guide

This guide explains how to set up automated order tracking using Google Spreadsheets and Google Apps Script.

## Overview

-   Automatically save orders to Google Spreadsheet.
-   Organize orders by website in a Drive folder.
-   Track order status with dropdown menus.
-   Send prefilled messages to Messenger.

## Setup Steps

### 1. Create Google Apps Script
1.  Go to [script.google.com](https://script.google.com).
2.  Create a new project.
3.  Paste the code from `docs/ORDER_TRACKING_SCRIPT.js`.
4.  Update `ADMIN_EMAIL` with your email address.

### 2. Deploy as Web App
1.  Click **Deploy** → **New deployment**.
2.  Select type: **Web app**.
3.  Execute as: **Me**.
4.  Who has access: **Anyone**.
5.  Click **Deploy** and authorize.

### 3. Configure in Website Builder
1.  Go to **Settings** in the Website Builder.
2.  Paste the **Web App URL** into the "Order Script URL" field.
3.  Save settings.

## How it Works
1.  Customer places an order and clicks "Checkout via Messenger".
2.  Order data is sent to the Google Apps Script.
3.  Script saves the order to a spreadsheet (one per website) in the "Messenger/Order Tracking" folder.
4.  Messenger opens with a prefilled order message.
5.  Business owner can track orders in the spreadsheet.
