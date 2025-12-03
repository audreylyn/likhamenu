# Client Dashboard Guide

## Overview

The Client Dashboard allows your clients (editors) to view and track their orders directly from Google Sheets. When a client logs in, they see a dashboard with order statistics and recent orders from their Google Spreadsheet.

## How It Works

1.  **Client Account**: Client is created as an "editor" in Admin → Users.
2.  **Website Assignment**: Admin assigns client to their website in Dashboard.
3.  **Client Login**: Client logs in and sees their Order Dashboard.
4.  **Order Data**: Orders are fetched from Google Sheets (not Supabase).
5.  **Real-time Stats**: Shows total orders, pending, delivered, revenue, etc.

## Setup Steps

### 1. Update Google Apps Script
Ensure your Google Apps Script includes the `doGet` function to read orders (see `docs/ORDER_TRACKING_SCRIPT.js`). **Redeploy** the script as a Web App after updating.

### 2. Create Client Account
1.  Go to **Users** in the sidebar (`/admin/users`).
2.  Enter client's email and password.
3.  Click **"Create Editor"**.

### 3. Assign Client to Website
1.  Go to **Dashboard** (`/`).
2.  Find the client's website.
3.  Click **"Assign"** in the Editors column.
4.  Enter the client's email address and click **"Add"**.

## Features

-   **Statistics Cards**: Total Orders, Pending, Delivered, Total Revenue.
-   **Orders Table**: Shows 20 most recent orders with status badges.
-   **Actions**: Refresh data, Edit Website (content only), Open in Google Sheets.

## Permissions

| Feature | Client (Editor) | Admin |
| :--- | :--- | :--- |
| View Order Dashboard | ✅ | ✅ |
| Edit Website Content | ✅ | ✅ |
| Change Design/Settings | ❌ | ✅ |
| Create/Delete Websites | ❌ | ✅ |
| See Other Websites | ❌ | ✅ |
