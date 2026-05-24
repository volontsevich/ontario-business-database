# Codex Prompt for Future Edits

You are editing a static GitHub Pages landing page for a planned product called "Ontario Business Database CSV".

Goal:
- Keep the site static and deployable on GitHub Pages.
- Keep the design clean, mobile-friendly, and fast.
- Do not add paid services.
- Do not add a backend.
- Preserve Google Apps Script lead capture via `LEAD_ENDPOINT` in `script.js`.
- Preserve GA4 event tracking.

Current files:
- `index.html`
- `styles.css`
- `script.js`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `favicon.svg`
- `og-image.svg`
- `apps-script/Code.gs`

Product positioning:
- Downloadable Ontario business database.
- CSV format.
- Planned launch price: C$15.
- No payment collected today.
- The page validates interest and collects email before real database delivery exists.

Important UX rules:
- Do not say "Pay now".
- Use "Reserve early access" or "Join early access list".
- Be transparent that no payment is collected today.
- Keep the CTA focused on purchase intent.
- Keep the page credible and simple.

Tracking requirements:
- Track CTA clicks as `cta_reserve_click`.
- Track sample clicks as `sample_click`.
- Track form attempts as `form_submit_attempt`.
- Track successful form submissions as `form_submit`.
- Track "Yes" payment intent as `price_interest_yes`.

Lead form fields:
- Email
- Use case
- Region
- Pay intent
- Required fields
- Consent checkbox

When making changes:
1. Preserve accessibility labels.
2. Preserve mobile responsiveness.
3. Do not remove the privacy note.
4. Do not remove schema markup unless replacing it with better valid schema.
5. Keep SEO metadata updated if URL or product title changes.
