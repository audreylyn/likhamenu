# Quick Start: Contact Form Setup (For Developers)

## 🎯 Quick Overview

**Who does what:**
- **You (Developer)**: Set up Google Sheet, Apps Script, create ClientID
- **Client**: Provides their email and business name
- **System**: Automatically routes inquiries to the right email

---

## 📝 Step-by-Step (5 Minutes)

### 1. Create Google Sheet (2 min)

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Add sheet named **"Clients"**
4. Add headers in Row 1:
   ```
   | ClientID | OwnerEmail | BusinessName |
   ```
5. Add your first client (Row 2):
   ```
   | salon | orders@salon.com | Salon Beauty |
   ```
   - **ClientID**: You create this (e.g., `salon`)
   - **OwnerEmail**: Ask client for this
   - **BusinessName**: Ask client for this

### 2. Add Apps Script (1 min)

1. In Google Sheet: **Extensions** → **Apps Script**
2. Paste the code from `CONTACT_FORM_SETUP.md` (Step 2)
3. Update `ADMIN_EMAIL` to your email
4. Save

### 3. Deploy as Web App (1 min)

1. Click **Deploy** → **New deployment**
2. Select **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️
4. Click **Deploy**
5. **Authorize** when prompted
6. **Copy the Web App URL**

### 4. Configure in Website Builder (1 min)

1. Open website in builder
2. Go to **"Content Management"** tab
3. Scroll to **"Contact"** section
4. Find **"Contact Form Configuration"** (below Contact Details)
5. Enable toggle
6. Paste Web App URL
7. Enter ClientID (e.g., `salon`)
8. Save

### 5. Test (30 sec)

1. Preview website
2. Fill out contact form
3. Submit
4. Check client's email inbox
5. Check Google Sheet "Inquiries" tab

---

## ❓ FAQ

**Q: Where is Contact Form Configuration?**
A: Content Management tab → Scroll to Contact section → Below Contact Details

**Q: Who creates the ClientID?**
A: You (the developer). Keep it simple: `salon`, `bakery`, `rose`

**Q: What does the client provide?**
A: Their email address and business name. That's it.

**Q: Can I use the same Web App URL for all clients?**
A: Yes! One script handles all clients. Just use different ClientIDs.

**Q: What if I don't see Contact Form Configuration?**
A: Make sure the Contact section is enabled in Settings → Section Visibility

---

## 📋 Checklist

- [ ] Google Sheet created with "Clients" tab
- [ ] Client provided email and business name
- [ ] ClientID created and added to sheet
- [ ] Apps Script code added and ADMIN_EMAIL updated
- [ ] Script deployed as Web App (Anyone access)
- [ ] Web App URL copied
- [ ] Contact Form Configuration filled in website builder
- [ ] Test submission sent and verified

---

## 🆘 Need Help?

See the full guide: `CONTACT_FORM_SETUP.md`

