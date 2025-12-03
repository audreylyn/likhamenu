# LikhaSiteWorks

A powerful React-based website generator with AI-assisted content creation and comprehensive admin management. Build beautiful, responsive websites with multiple templates, AI-powered content generation, and integrated features like contact forms, order tracking, and chat support.

## Features

- **Multiple Website Types**: Portfolio, E-commerce, Landing Page, Restaurant, Service Agency, Event/Conference, Blog, and Custom
- **AI Content Generation**: Powered by Google Gemini for automatic content creation
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS
- **Supabase Backend**: Database, authentication, and file storage
- **Contact Forms**: Google Apps Script integration for form submissions
- **Order Tracking**: Integrated order management with Google Sheets
- **Chat Support**: AI-powered chatbot with knowledge base integration
- **Admin Dashboard**: Manage multiple websites, users, and content

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) and npm
- **Supabase Account** - [Create one here](https://app.supabase.com)
- **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)
- **Google Account** (for Apps Script integration - optional)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/audreylyn/webgen.git
cd webgen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
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

# Google Apps Script URLs (Optional)
VITE_ORDER_TRACKING_SCRIPT_URL=https://script.google.com/macros/s/...
VITE_CONTACT_FORM_SCRIPT_URL=https://script.google.com/macros/s/...
```

### 4. Set Up Supabase

#### Create the Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration files from the `migrations/` folder in order:
   - `001_create_or_alter_websites_table.sql`
   - `002_create_chat_support_config.sql`
   - `003_update_rls_for_admins.sql`
   - `004_update_chat_config_rls.sql`

#### Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `webgen-images` (or match your `VITE_SUPABASE_IMAGE_BUCKET` value)
3. Set it to **Public** so images can be accessed
4. Configure bucket policies to allow authenticated users to upload

#### Set Up Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Configure email templates if needed
4. Set up redirect URLs for your domain

### 5. Create Your First Admin User

After setting up Supabase, you can create an admin user using the provided script:

```bash
node scripts/create_admin.js
```

Or manually sign up through the app and update the user role in Supabase:
- Go to **Authentication** → **Users**
- Find your user and edit the `raw_user_meta_data`
- Add: `{ "role": "admin" }`

### 6. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

### Creating a Website

1. **Log in** with your admin account
2. Click **"Create New Website"** or navigate to the website builder
3. Choose a **Website Type** (Portfolio, E-commerce, Restaurant, etc.)
4. Configure your website:
   - **General Settings**: Title, subdomain, logo, favicon
   - **Sections**: Enable/disable sections (Hero, About, Products, etc.)
   - **Visual Style**: Colors, fonts, theme presets
   - **Content**: Use AI wizard or manually edit each section
5. **Save** your website
6. **Preview** your website before publishing

### AI Content Generation

1. In the website builder, go to the **AI Content Wizard** tab
2. Enter your business details:
   - Business name
   - Industry/type
   - Key features or services
   - Target audience
3. Click **"Generate Content"**
4. Review and customize the AI-generated content
5. Save your changes

### Managing Multiple Websites

- View all websites in the **Dashboard**
- Edit any website by clicking on it
- Delete websites (with confirmation)
- Each website can have its own subdomain

### Contact Form Setup

See detailed instructions in [`docs/QUICK_START_CONTACT_FORM.md`](docs/QUICK_START_CONTACT_FORM.md)

### Order Tracking Setup

See detailed instructions in [`docs/ORDER_TRACKING_QUICK_START.md`](docs/ORDER_TRACKING_QUICK_START.md)

## Project Structure

```
webgen/
├── components/          # React components
│   ├── preview/        # Preview components for website sections
│   └── website-builder/ # Builder UI components
├── contexts/           # React contexts (Auth, etc.)
├── docs/               # Documentation files
├── hooks/              # Custom React hooks
├── migrations/         # Supabase SQL migrations
├── pages/              # Main page components
├── services/           # API and service integrations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

The project includes a `vercel.json` configuration file.

### Other Platforms

The app is a standard Vite React app and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any static hosting service

Make sure to set all environment variables in your hosting platform.

## Documentation

- [Website Types Guide](docs/WEBSITE_TYPES.md) - Detailed information about each website type
- [Contact Form Setup](docs/QUICK_START_CONTACT_FORM.md) - Setting up contact forms
- [Order Tracking Setup](docs/ORDER_TRACKING_QUICK_START.md) - Setting up order tracking
- [Supabase Migration Guide](MIGRATE_TO_SUPABASE.md) - Migration details
- [Subdomain Setup](SETUP_SUBDOMAINS.md) - Configuring subdomains

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend (PostgreSQL, Auth, Storage)
- **Google Gemini** - AI content generation
- **React Router** - Routing
- **Framer Motion** - Animations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with React, Supabase, and Google Gemini**

