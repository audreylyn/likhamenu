# Chatbot Integration Guide

## Overview

The Chat Support system allows website owners to provide automated, context-aware support to their visitors using Google Gemini AI. The system uses a **Google Sheet** as a dynamic Knowledge Base, allowing non-technical users to update the bot's knowledge simply by editing a spreadsheet.

## Architecture

The system connects the frontend React widget with a Google Apps Script backend (which reads the Google Sheet) and the Google Gemini API for response generation.

1.  **Visitor** sends a message via the Chat Widget.
2.  **Frontend** fetches the configuration from Supabase.
3.  **Frontend** calls the Google Apps Script to retrieve the Knowledge Base content.
4.  **Frontend** constructs a prompt with the user's message and the Knowledge Base content.
5.  **Frontend** sends the prompt to Google Gemini API.
6.  **Gemini** returns a response, which is displayed to the visitor.

## Setup Guide for Clients

1.  **Google Sheet**: Open the client's Order Management Sheet.
2.  **Admin Menu**: Click `Admin Controls` -> `Initialize Chatbot Knowledge Base`. This creates the "KnowledgeBase" tab.
3.  **Fill Data**: Add Q&A pairs or general information into the sheet (e.g., "Opening Hours: 9 AM - 5 PM").
4.  **Deploy**: Deploy the script as a Web App (Anyone with the link).
5.  **Connect**: Copy the Web App URL into the Website Builder's "Chat Support" settings.

## Debugging Guide

### Issue: Chatbot Not Understanding Messages

If the chatbot is returning "I'm sorry, I didn't understand that. Could you please rephrase?", follow these steps:

#### 1. Check Browser Console
Open Developer Tools (F12) and check the Console tab for messages starting with `[Chatbot]`.
- `[Chatbot] Sending message:` - Confirms message is being sent
- `[Chatbot] Knowledge base loaded successfully` - Confirms KB was loaded
- `[Chatbot] Gemini response:` - Shows the actual response

#### 2. Verify Configuration
- **Enabled**: Ensure "Enable Chat Support" is checked in Website Builder settings.
- **API Key**: Verify `VITE_GEMINI_API_KEY` is set in `.env` or `chatbot_api_key` in the database.
- **URL**: Verify the Google Apps Script URL is correct and deployed as a Web App.

#### 3. Test Knowledge Base Fetch
Test the URL directly in your browser:
`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?mode=kb&website=YOUR_SUBDOMAIN`

Expected response: Plain text with knowledge base content.

#### 4. Common Issues
- **"No config found"**: Ensure chat support is enabled.
- **"Knowledge base is empty"**: Check Google Sheets has a "KnowledgeBase" tab with content.
- **CORS errors**: Ensure Google Apps Script is deployed with "Anyone" access.
