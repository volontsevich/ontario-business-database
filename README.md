# Ontario Business Database Landing Page

A simple zero-cost validation website for a planned downloadable Ontario Business Database CSV.

## What this includes

- Static landing page for GitHub Pages
- Lead capture form
- Google Analytics event tracking hooks
- Google Apps Script endpoint for saving leads to Google Sheets
- SEO basics: title, description, sitemap, robots.txt, FAQ schema, product schema
- Privacy note page

## Recommended GitHub repository name

If you want the site URL to be:

```text
https://volontsevich.github.io/ontario-business-database/
```

use this repository name:

```text
ontario-business-database
```

If you want the site to live at the root:

```text
https://volontsevich.github.io/
```

the repository must be named:

```text
volontsevich.github.io
```

For this MVP, the recommended option is `ontario-business-database`.

## Files to upload to GitHub

Upload all files from this package:

```text
index.html
styles.css
script.js
privacy.html
robots.txt
sitemap.xml
site.webmanifest
favicon.svg
og-image.svg
apps-script/Code.gs
CODEX_PROMPT.md
README.md
```

## Step 1 — Create the GitHub repo

1. Go to GitHub.
2. Create a new public repository.
3. Recommended name: `ontario-business-database`.
4. Upload these files.
5. Commit to the `main` branch.

## Step 2 — Enable GitHub Pages

1. Open the repo.
2. Go to **Settings**.
3. Go to **Pages**.
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.

Your site should become available at:

```text
https://volontsevich.github.io/ontario-business-database/
```

## Step 3 — Update URLs for SEO

Replace these placeholder URLs in the files:

```text
https://volontsevich.github.io/ontario-business-database/
```

Files to update:

```text
index.html
privacy.html
robots.txt
sitemap.xml
```

## Step 4 — Create the Google Sheet lead database

1. Create a new Google Sheet.
2. Name it something like:

```text
Ontario Business Database Leads
```

3. Open **Extensions → Apps Script**.
4. Paste the code from:

```text
apps-script/Code.gs
```

5. Save.

## Step 5 — Deploy the Google Apps Script endpoint

1. In Apps Script, click **Deploy → New deployment**.
2. Select **Web app**.
3. Use:
   - Execute as: `Me`
   - Who has access: `Anyone`
4. Click **Deploy**.
5. Copy the Web App URL.
6. Open `script.js`.
7. Replace:

```js
const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbwpuh7IwXeQcN_XwuD8IFy_qbHGxBeYYqKK6MnUUxqCBtyMpAAd9hRqNaIJ9nlZshdY/exec";
```

with your real Web App URL.

## Step 6 — Add Google Analytics

1. Create a GA4 property.
2. Create a Web data stream.
3. Copy your Measurement ID, for example:

```text
G-ABC1234567
```

4. In `index.html`, replace all instances of:

```text
G-XXXXXXXXXX
```

with your real Measurement ID.

The following events are already tracked:

```text
cta_reserve_click
sample_click
form_submit_attempt
form_submit
price_interest_yes
form_submit_error
```

## Step 7 — Submit to Google Search Console

1. Add your GitHub Pages URL as a property.
2. Submit this sitemap URL:

```text
https://volontsevich.github.io/ontario-business-database/sitemap.xml
```

3. Use URL Inspection to request indexing for the homepage.

## Step 8 — Test the full flow

Open the live page and submit a test lead.

Check that:

- the thank-you message appears;
- the lead appears in Google Sheets;
- GA4 receives events;
- the page works on mobile.

## Important legal/compliance note

This MVP collects emails and validates interest. Before sending marketing emails or selling a database, make sure your collection and communication process follows Canadian privacy and anti-spam requirements. Use clear consent, identify yourself, and include an unsubscribe option in future emails.
