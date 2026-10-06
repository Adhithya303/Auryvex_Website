# Launch Blockers

These items must be resolved before the site goes public.

## Essential
- [ ] Mobile navigation tested end-to-end on a real device or BrowserStack (360 px, 390 px)
- [ ] Contact form submits successfully and enquiry appears in the admin panel
- [ ] Admin login, enquiry detail, status update, and logout all work correctly
- [ ] Unauthenticated access to /admin/* is rejected (verify with curl, no active session)
- [ ] SQLite automated backup runs and restore procedure has been tested once
- [ ] Strong SECRET_KEY generated (`openssl rand -hex 32`) and set in production `.env`
- [ ] Strong ADMIN_PASSWORD set in production `.env` (not the example value)

## Domain and Contact
- [ ] Register `auryvex.com` (or confirm chosen domain)
- [ ] Set up `hello@auryvex.com` (or equivalent contact email)
- [ ] Update `ALLOWED_ORIGINS` in backend `.env` to the production domain
- [ ] Update `og:url`, `og:image`, `sitemap.xml`, and `robots.txt` Sitemap directive once domain is confirmed

## Legal (required when collecting name/email)
- [ ] Add a Privacy Policy page
- [ ] Add Terms of Service if applicable

## Content
- [ ] Confirm service descriptions are accurate and complete with the delivery team
- [ ] Confirm budget currency symbol and ranges in `frontend/src/config/brand.ts`
- [ ] Remove or replace any remaining placeholder text

## Post-Launch Improvements (not blockers)
- Add verified social media links to `brand.ts` once official accounts exist
- Set up lightweight analytics (e.g. Plausible or Umami — privacy-first, cookie-free)
- Introduce authenticated client case studies to replace concept projects once completed
- Design a high-resolution 1200x630 custom `og-image.png`
