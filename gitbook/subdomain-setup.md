# Guide: Setting Up Custom Subdomains with Vercel and Supabase

This guide will walk you through the process of configuring your WebGen application to serve published websites on custom subdomains of your primary domain (`likhasiteworks.dev`).

The goal is to have:
-   **`my-cool-site.likhasiteworks.dev`** -> Renders the published website.
-   **`likhasiteworks.dev`** -> Renders the main WebGen dashboard and editor.

This process involves three main parts:
1.  **DNS Configuration**: Pointing your custom domain to Vercel.
2.  **Vercel Configuration**: Adding the custom domain to your Vercel project.
3.  **Application Code Changes**: Updating the React app to handle subdomain-based routing.

---

## Step 1: DNS Configuration (At Your Domain Registrar)

Based on your Vercel dashboard, the recommended and most reliable method is to **use Vercel's Nameservers**. This allows Vercel to automatically manage your DNS records, ensuring wildcards and root domains are configured correctly.

### Recommended Method: Use Vercel's Nameservers

1.  **Log in to your domain registrar's dashboard** (where you purchased `likhasiteworks.dev`).
2.  Find the section for managing **"Nameservers"** or "DNS Servers".
3.  **Delete your existing nameservers** (they are usually default ones from your registrar).
4.  Add Vercel's two nameservers:
    -   `ns1.vercel-dns.com`
    -   `ns2.vercel-dns.com`
5.  **Save the changes.** It may take some time (from minutes to a few hours) for these changes to apply globally.
6.  Once you do this, you do **not** need to add the `A` records mentioned below. Vercel handles everything.

### Alternative Method: Manually Configure A Records

Only use this method if you cannot change your nameservers. Vercel may still show a warning for the wildcard domain.

1.  **Log in to your domain registrar's dashboard**.
2.  Navigate to the **DNS management** section for your domain.
3.  Add/Update the following two records, using the IP address Vercel provides:

    **A. Root Domain (`likhasiteworks.dev`)**
    -   **Type**: `A`
    -   **Name / Host**: `@` (or `likhasiteworks.dev`)
    -   **Value / Points to**: `216.198.79.1` (Use the value shown in your Vercel dashboard)
    -   **TTL**: Leave as default.

    **B. Wildcard Subdomain (`*.likhasiteworks.dev`)**
    -   **Type**: `A`
    -   **Name / Host**: `*`
    -   **Value / Points to**: `216.198.79.1` (Use the same IP as above)
    -   **TTL**: Leave as default.

4.  **Save the changes.** DNS propagation can take anywhere from a few minutes to 48 hours, but it's usually fast.

---

## Step 2: Vercel Project Configuration

Now, tell Vercel to associate your domain with your `webgen-xi` project.

1.  Go to your project on the **Vercel Dashboard**.
2.  Navigate to **Settings** -> **Domains**.
3.  Add your root domain: `likhasiteworks.dev`. Vercel will check the DNS configuration and should show "Valid Configuration" once it propagates.
4.  Add your wildcard domain: `*.likhasiteworks.dev`. This will handle all subdomains.
5.  Vercel will automatically provision SSL certificates for both domains.

Once this step is done, visiting `any-subdomain.likhasiteworks.dev` should show your deployed Vercel app (it will show the dashboard for now, we'll fix this in the next step).

---

## Step 3: Application Code Changes

The final step is to update the application to differentiate between the main app and a user's published website based on the subdomain.

### A. Update `App.tsx` to Route Based on Hostname

The router needs to check the subdomain of the URL. If a subdomain exists (and it's not `www`), we show the published website. Otherwise, we show the editor app.

*I can implement this change for you. The logic would look something like this:*

```tsx
// In App.tsx

const SubdomainRouter: React.FC = () => {
  const host = window.location.host; // e.g., "my-site.likhasiteworks.dev"
  const parts = host.split('.');
  
  // Check if it's a custom subdomain
  if (parts.length === 3 && parts[0] !== 'www') {
    const subdomain = parts[0];
    // Render the PreviewTemplate, passing the subdomain to fetch the correct site
    return <PreviewTemplate subdomain={subdomain} />;
  }

  // Otherwise, render the main application with all its routes
  return (
      <Router>
        <Routes>
          <Route path="/" element={...} />
          {/* ... all your other routes ... */}
        </Routes>
      </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubdomainRouter />
    </AuthProvider>
  );
};
```

### B. Update `supabaseService.ts` to Fetch a Website by Subdomain

We need a new function in our service to query the `websites` table using the `subdomain` column.

*I can add this function:*
```ts
// In services/supabaseService.ts

export const getWebsiteBySubdomain = async (subdomain: string) => {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('status', 'published') // Only show published sites
    .single();

  if (error) {
    console.error('Error fetching website by subdomain:', error);
    return null;
  }
  return data;
};
```

### C. Update `WebsiteBuilder.tsx` to Add a Subdomain Field

Users need a way to choose their subdomain when creating or editing a site.

*I can modify the UI to include an input field like this:*
```tsx
// In pages/WebsiteBuilder.tsx

// ... inside the form
<div>
  <label>Subdomain</label>
  <div className="flex items-center">
    <input
      type="text"
      placeholder="my-cool-site"
      value={website.subdomain || ''}
      onChange={(e) => updateWebsite({ ...website, subdomain: e.target.value })}
    />
    <span>.likhasiteworks.dev</span>
  </div>
</div>
```

When the website is saved, the `subdomain` field will be persisted to your Supabase table.

---

This guide provides the complete roadmap. The DNS and Vercel steps must be done by you, but I can implement all the necessary code changes in **Step 3**.

**Would you like me to proceed with implementing the code changes described above?**