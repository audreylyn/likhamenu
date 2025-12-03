# Usage Guide

This guide will walk you through how to use WebGen AI to create and manage websites.

## Logging In

1. Open your web browser and navigate to the application URL (e.g., `http://localhost:3000` for development)
2. Enter your admin email and password
3. Click "Log In"
4. You will be redirected to the Dashboard

## Dashboard Overview

The Dashboard is your main control center where you can:
- View all websites you've created
- Create new websites
- Edit existing websites
- Delete websites
- Manage users (admin only)

## Creating a New Website

### Step 1: Start Creation

1. From the Dashboard, click "Create New Website" button
2. You will be taken to the Website Builder

### Step 2: Choose Website Type

1. In the Website Builder, you'll see a "Website Type" selector
2. Choose from the available types:
   - **Portfolio**: For showcasing work and projects
   - **E-commerce**: For online stores with products
   - **Landing Page**: Single-page marketing sites
   - **Restaurant**: For restaurants and food businesses
   - **Service Agency**: For service-based businesses
   - **Event/Conference**: For events and conferences
   - **Blog**: For blogging and content publishing
   - **Custom**: For fully customizable websites

### Step 3: Configure General Settings

1. Navigate to the "General Settings" tab
2. Fill in the basic information:
   - **Title**: The name of your website
   - **Subdomain**: The subdomain where the website will be accessible (e.g., `mysite` for `mysite.yourdomain.com`)
   - **Logo**: Upload a logo image (optional)
   - **Favicon**: Upload a favicon image (optional)
   - **Title Font**: Choose a font for headings

### Step 4: Configure Section Visibility

1. Navigate to the "Section Visibility" tab
2. Toggle sections on or off based on what you want to include:
   - Hero Section
   - About Section
   - Benefits Section
   - Products Section
   - Pricing Section
   - Gallery Section
   - Testimonials Section
   - Team Section
   - FAQ Section
   - Contact Section
   - Footer

### Step 5: Configure Visual Style

1. Navigate to the "Visual Style" tab
2. Customize the appearance:
   - **Theme Presets**: Choose from predefined color schemes
   - **Primary Color**: Set the main brand color
   - **Secondary Color**: Set the secondary brand color
   - **Accent Color**: Set accent colors
   - **Background Color**: Set background colors
   - **Text Colors**: Customize text colors

### Step 6: Add Content

You have two options for adding content:

#### Option A: AI Content Wizard (Recommended for Quick Setup)

1. Navigate to the "AI Content Wizard" tab
2. Fill in your business details:
   - **Business Name**: Your business or website name
   - **Industry/Type**: What type of business or website
   - **Key Features or Services**: List main features or services
   - **Target Audience**: Who is your target audience
3. Click "Generate Content"
4. Wait for the AI to generate content (this may take a minute)
5. Review the generated content
6. Make any necessary edits
7. Click "Save" to apply the content

#### Option B: Manual Content Editing

1. Navigate to the "Content Management" tab
2. Click on each section to edit:
   - **Hero Section**: Main banner/header content
   - **About Section**: About your business/website
   - **Benefits Section**: Key benefits or features
   - **Products Section**: Product listings (for e-commerce)
   - **Pricing Section**: Pricing plans or packages
   - **Gallery Section**: Image galleries
   - **Testimonials Section**: Customer testimonials
   - **Team Section**: Team member profiles
   - **FAQ Section**: Frequently asked questions
   - **Contact Section**: Contact information and form

3. For each section:
   - Edit text content
   - Upload images
   - Add or remove items
   - Customize styling

### Step 7: Configure Additional Features

#### Contact Form Setup

1. Navigate to the "Content Management" tab
2. Scroll to the "Contact" section
3. Fill in contact details:
   - **Email**: Contact email address
   - **Phone**: Contact phone number
   - **Address**: Physical address (optional)
   - **Social Media Links**: Add social media profiles (optional)

4. To enable contact form submissions:
   - Scroll to "Contact Form Configuration"
   - Enable the toggle
   - Enter the Google Apps Script URL (if configured)
   - Enter the Client ID (if using multi-client setup)
   - See the Contact Form Setup documentation for detailed instructions

#### Order Tracking Setup (E-commerce)

1. Navigate to the "Integrations" tab
2. Enable "Facebook Messenger" if you want Messenger integration
3. Enter your Facebook Page ID
4. Enter the Google Apps Script URL for order tracking (if configured)
   - See the Order Tracking Setup documentation for detailed instructions

#### Chat Support Configuration

1. Navigate to the "Integrations" tab
2. Scroll to "Chat Support"
3. Enable chat support if desired
4. Configure chat settings:
   - Welcome message
   - Knowledge base content
   - Response settings

### Step 8: Preview Your Website

1. Click the "Preview" button in the top right of the Website Builder
2. A new tab will open showing your website
3. Review all sections and content
4. Test functionality:
   - Navigation links
   - Contact form (if enabled)
   - Product pages (if e-commerce)
   - Mobile responsiveness (resize browser window)

### Step 9: Save Your Website

1. Click the "Save" button in the Website Builder
2. Wait for the confirmation message
3. Your website is now saved and can be accessed

## Editing an Existing Website

1. From the Dashboard, click on the website you want to edit
2. You will be taken to the Website Builder with the website loaded
3. Make your changes following the same steps as creating a website
4. Click "Save" when done

## Managing Multiple Websites

### Viewing All Websites

1. From the Dashboard, you'll see a list of all your websites
2. Each website shows:
   - Website title
   - Subdomain
   - Status (Draft/Published)
   - Creation date

### Deleting a Website

1. From the Dashboard, find the website you want to delete
2. Click the delete button (usually a trash icon)
3. Confirm the deletion
4. The website and all its data will be permanently removed

## Managing Users (Admin Only)

1. From the Dashboard, navigate to "Users" or "Admin Users"
2. View all registered users
3. You can:
   - View user details
   - Change user roles
   - Remove users (if needed)

## Publishing Your Website

### Development Preview

- Your website is accessible at: `http://localhost:3000/preview/{subdomain}` during development

### Production Deployment

1. Build the production version:
   ```
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Configure your domain and subdomain routing
4. Set environment variables in your hosting platform
5. Your website will be accessible at: `https://{subdomain}.{yourdomain.com}`

## Advanced Features

### AI Marketing Kit

1. In the Website Builder, navigate to the "AI Marketing Kit" tab
2. Generate marketing materials:
   - Social media posts
   - Email templates
   - Marketing copy
3. Customize and download generated content

### Editor Assignment

1. Navigate to the "Editor Assignment" tab
2. Assign editors to your website
3. Editors can edit content but cannot delete the website
4. Enter editor email addresses

### Section Reordering

1. Navigate to the "Nav Link Reorder" tab
2. Drag and drop navigation items to reorder them
3. Changes will reflect in the website navigation

## Best Practices

### Content Creation

- Use the AI Content Wizard for initial content, then customize
- Keep content concise and focused
- Use high-quality images (optimize before uploading)
- Test all links and forms before publishing

### Design

- Choose colors that match your brand
- Ensure good contrast for readability
- Test on mobile devices
- Keep navigation simple and intuitive

### Performance

- Optimize images before uploading
- Don't enable unnecessary sections
- Regularly review and update content
- Monitor website performance

## Troubleshooting

### Website Not Saving

- Check your internet connection
- Verify Supabase credentials in `.env` file
- Check browser console for errors (F12)
- Ensure you're logged in as admin or owner

### AI Content Not Generating

- Verify `VITE_GEMINI_API_KEY` is set correctly in `.env`
- Check your Google Gemini API quota
- Ensure you have an active internet connection
- Try generating again after a few moments

### Images Not Uploading

- Check Supabase storage bucket is configured correctly
- Verify bucket is set to public
- Check file size (large files may take time)
- Ensure you have proper permissions

### Preview Not Working

- Ensure the website is saved first
- Check that required sections are enabled
- Verify subdomain is set correctly
- Clear browser cache and try again

## Getting Help

If you encounter issues:

1. Check the browser console for error messages (F12)
2. Review the installation guide to ensure setup is correct
3. Check Supabase dashboard for database/storage issues
4. Review the documentation in the `docs/` folder for specific features
5. Check GitHub issues for known problems

## Next Steps

After creating your first website:

1. Set up contact forms (see Contact Form Setup documentation)
2. Configure order tracking (for e-commerce sites)
3. Set up custom domains and subdomains
4. Deploy to production
5. Monitor and update content regularly

