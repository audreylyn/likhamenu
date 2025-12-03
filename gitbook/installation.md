# Installation Guide

This guide will walk you through setting up WebGen AI on a new computer from scratch.

## Step 1: Install Prerequisites

### Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version (v18 or higher)
3. Run the installer and follow the installation wizard
4. Verify installation by opening a terminal/command prompt and running:
   ```
   node --version
   npm --version
   ```
   Both commands should display version numbers.

## Step 2: Clone the Repository

1. Open a terminal/command prompt
2. Navigate to the directory where you want to install the project
3. Clone the repository:
   ```
   git clone https://github.com/audreylyn/webgen.git
   ```
4. Navigate into the project directory:
   ```
   cd webgen
   ```

## Step 3: Install Dependencies

1. In the project directory, run:
   ```
   npm install
   ```
2. Wait for all packages to be installed. This may take a few minutes.

## Step 4: Set Up Supabase

### Create a Supabase Account

1. Visit [app.supabase.com](https://app.supabase.com)
2. Sign up for a free account or log in if you already have one
3. Click "New Project"
4. Fill in the project details:
   - Name: Choose a name for your project (e.g., "webgen")
   - Database Password: Create a strong password and save it securely
   - Region: Choose the region closest to you
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

### Get Supabase Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon)
2. Click on "API" in the left sidebar
3. Copy the following values:
   - Project URL (under "Project URL")
   - anon public key (under "Project API keys" → "anon public")

### Create Storage Bucket

1. In your Supabase dashboard, click on "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Name it: `webgen-images`
4. Set it to "Public bucket" (toggle ON)
5. Click "Create bucket"
6. After creation, click on the bucket name
7. Go to "Policies" tab
8. Click "New Policy"
9. Select "For full customization" and create a policy that allows authenticated users to upload files

### Set Up Authentication

1. In your Supabase dashboard, click on "Authentication" in the left sidebar
2. Click on "Settings"
3. Under "Auth Providers", ensure "Email" is enabled
4. Configure email templates if needed (optional)
5. Under "URL Configuration", add your redirect URLs:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add `http://localhost:3000/**` for development

### Run Database Migrations

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the file `migrations/001_create_or_alter_websites_table.sql` from the project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. Repeat steps 3-6 for the following migration files in order:
   - `migrations/002_create_chat_support_config.sql`
   - `migrations/003_update_rls_for_admins.sql`
   - `migrations/004_update_chat_config_rls.sql`

## Step 5: Get Google Gemini API Key

1. Visit [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Save it securely - you'll need it in the next step

## Step 6: Configure Environment Variables

1. In the project root directory, create a new file named `.env`
2. Open the `.env` file in a text editor
3. Add the following content, replacing the placeholder values with your actual credentials:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_IMAGE_BUCKET=webgen-images

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Admin Configuration
VITE_ADMIN_EMAIL=your_admin_email@example.com

# Domain Configuration
VITE_MAIN_DOMAIN=yourdomain.com

# Google Apps Script URLs (Optional - can be added later)
VITE_ORDER_TRACKING_SCRIPT_URL=
VITE_CONTACT_FORM_SCRIPT_URL=
```

4. Replace the values:
   - `your_supabase_project_url`: The Project URL from Supabase (Step 4)
   - `your_supabase_anon_key`: The anon public key from Supabase (Step 4)
   - `your_gemini_api_key`: The API key from Google Gemini (Step 5)
   - `your_admin_email@example.com`: Your email address (this will be your admin account)
   - `yourdomain.com`: Your main domain (can be a placeholder for now)

5. Save the file

## Step 7: Create Admin User

### Option A: Using the Script (Recommended)

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the "service_role" key (keep this secret - it has admin privileges)
3. Open a terminal/command prompt in the project directory
4. For Windows PowerShell, run:
   ```
   $env:SUPABASE_URL = "https://your-project.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY = "your_service_role_key"; node .\scripts\create_admin.js your_email@example.com "your_password"
   ```
   For Linux/Mac or Git Bash, run:
   ```
   SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/create_admin.js your_email@example.com "your_password"
   ```
5. Replace:
   - `https://your-project.supabase.co` with your Supabase project URL
   - `your_service_role_key` with the service role key from Supabase
   - `your_email@example.com` with your email address
   - `your_password` with a secure password

### Option B: Manual Method

1. Start the development server (see Step 8)
2. Navigate to `http://localhost:3000`
3. Click "Sign Up" and create an account with your email
4. In your Supabase dashboard, go to "Authentication" → "Users"
5. Find your user and click on it
6. Scroll down to "Raw User Meta Data"
7. Click "Edit" and add:
   ```json
   {
     "role": "admin"
   }
   ```
8. Click "Save"

## Step 8: Start the Development Server

1. In the project directory, run:
   ```
   npm run dev
   ```
2. Wait for the server to start
3. You should see output indicating the server is running, typically at `http://localhost:3000`
4. Open your web browser and navigate to the URL shown in the terminal

## Step 9: Verify Installation

1. You should see the login page
2. Log in with your admin account credentials
3. You should be redirected to the dashboard
4. If you see the dashboard, installation is complete

## Troubleshooting

### Node.js version issues

If you encounter errors related to Node.js version:
- Ensure you have Node.js v18 or higher installed
- You can check your version with: `node --version`
- If needed, update Node.js from the official website

### Supabase connection errors

- Verify your `.env` file has the correct Supabase URL and anon key
- Check that your Supabase project is active (not paused)
- Ensure you've run all migration files in order

### Port already in use

If port 3000 is already in use:
- The server will automatically try the next available port
- Check the terminal output for the actual port number
- Or modify `vite.config.ts` to use a different port

### Environment variables not loading

- Ensure the `.env` file is in the root directory (same level as `package.json`)
- Restart the development server after changing `.env` file
- Ensure variable names start with `VITE_` prefix

### Admin user not working

- Verify the user has `"role": "admin"` in their metadata in Supabase
- Ensure `VITE_ADMIN_EMAIL` in `.env` matches your admin email
- Try logging out and logging back in

## Next Steps

Once installation is complete, proceed to the [Usage Guide](usage.md) to learn how to use WebGen AI.

