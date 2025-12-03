# Contact Form Setup Guide

This guide explains how to set up a free, automated email system for your website's contact form using Google Apps Script and Google Sheets.

## Overview

This integration allows your website's contact form to:
-   Send emails directly to the website owner.
-   Store all submissions in a Google Sheet.
-   Support multiple clients from a single script.
-   Handle CORS automatically.

## Setup Steps

### 1. Create Google Sheet
1.  Create a new Google Sheet (e.g., "Website Contact Forms").
2.  Create a **"Clients"** tab with columns: `ClientID`, `OwnerEmail`, `BusinessName`.
3.  Add your client's details. Example:
    -   `ClientID`: `salon`
    -   `OwnerEmail`: `orders@salon.com`
    -   `BusinessName`: `Salon Beauty`

### 2. Set Up Apps Script
1.  In the Google Sheet, go to **Extensions** → **Apps Script**.
2.  Paste the code from `docs/ORDER_TRACKING_SCRIPT.js` (or the relevant contact form script).
3.  Save the project.

### 3. Deploy as Web App
1.  Click **Deploy** → **New deployment**.
2.  Select type: **Web app**.
3.  Execute as: **Me**.
4.  Who has access: **Anyone**.
5.  Click **Deploy** and authorize the script.

### 4. Configure in Website Builder
1.  Go to the Website Builder.
2.  Open **Settings** (gear icon).
3.  Paste the **Web App URL** into the "Contact Form Script URL" field.
4.  Enter the **Client ID** (e.g., `salon`) into the "Client ID" field.
5.  Save settings.

## Testing
Submit a test message through the contact form on the published website. You should receive an email and see the entry in the "Inquiries" tab of your Google Sheet.
