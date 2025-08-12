# LumiMaid Website

Welcome to the source code for **LumiMaid**, a modern cleaning service website built with Next.js 14 and Tailwind CSS. The project focuses on conversion‑first layouts, SEO optimisation and simple integration points for analytics, lead capture, Calendly booking and CRM/email notifications.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   The site will be available at <http://localhost:3000>. Edits to files in `app/`, `components/` or `content/` will hot‑reload.

## Environment Variables

The application relies on several environment variables. When deploying on Vercel you can create them via the dashboard:

| Variable                    | Description                                                             |
|----------------------------|---------------------------------------------------------------------------|
| `NEXT_PUBLIC_GTM_ID`       | Google Tag Manager ID. When set, GTM is loaded on every page.            |
| `NEXT_PUBLIC_GA4_ID`       | GA4 measurement ID. Typically loaded via GTM.                           |
| `NEXT_PUBLIC_META_PIXEL_ID`| Facebook/Meta Pixel ID. Also usually managed in GTM.                    |
| `NEXT_PUBLIC_BOOKING_LINK` | Calendly booking URL for the `/book` page.                              |
| `RESEND_API_KEY`           | API key for Resend email service; sends confirmation emails to leads.    |
| `CRM_WEBHOOK_URL`          | URL to post lead data to your CRM.                                       |
| `CRM_API_KEY`              | API key for CRM (optional – not currently used).                         |

All environment variables can be left blank if you’re not ready to enable a feature; the site will gracefully degrade.

## Project Structure

```
app/               Next.js app directory with pages and API routes
  (marketing)/     Public marketing pages
    services/      Services landing page
    about/         About page
    book/          Booking page (Calendly or lead form)
  blog/[slug]/     Dynamic MDX blog posts
  locations/[city]/Location‑specific landing pages
  api/lead/        API route for handling lead submissions
components/        Reusable React components styled with Tailwind
content/           JSON and MDX content powering pages
lib/               Helper utilities (config, SEO, schema, CRM, email, db)
public/            Static assets (logo, gallery images, Open Graph images)
site.config.json   Centralised business configuration used across the site
tailwind.config.ts Tailwind customisation
next.config.mjs    Next.js configuration
``` 

### Adding a New Location Page

1. Create a JSON file in `content/locations/` with the city name (e.g. `st-louis-park.json`).
2. Include `seo`, `headline`, `body`, `popular` (array of package names) and `cta` fields.
3. The route `/locations/[city]` will automatically generate static params for the new city.

### Adding a New Blog Post

1. Add an `.mdx` file to `content/blog/` with front‑matter containing `title`, `excerpt` and optional `keywords` array.
2. Write your post using Markdown/MDX. Internal links should point to `/services`, `/book` or other relevant pages.
3. The slug is derived from the filename.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Log into [Vercel](https://vercel.com) and **Import Project** from GitHub.
3. During setup:
   - Assign the environment variables listed above (values can be empty).
   - Set the **Production Branch** to `main`.
   - Enable the **Next.js** project framework detection.
4. After deployment, add the custom domain `lumimaid.com` under **Settings → Domains**. Point your DNS A/ALIAS record at Vercel and create a CNAME for `www` pointing to the apex domain.
5. Vercel will automatically handle SSL and edge caching. Once propagated, the site will be live on your domain.

## Integrations

* **Calendly** – Set `NEXT_PUBLIC_BOOKING_LINK` to your Calendly scheduling URL. The `/book` page will render an embedded booking widget and dispatch a `begin_checkout` event when loaded.
* **CRM** – Provide `CRM_WEBHOOK_URL` to post form submissions. The payload includes all lead fields plus UTM parameters and GCLID when present.
* **Email** – Add your Resend API key to `RESEND_API_KEY` to send an auto‑reply to leads. The email originates from `LumiMaid <hello@mail.lumimaid.com>`.
* **Analytics** – Load Google Tag Manager by setting `NEXT_PUBLIC_GTM_ID`. GA4 and Meta Pixel tags can be configured via GTM.

## SEO Notes

* Each page exposes exactly one `<h1>` and includes “Minneapolis” where natural.
* Titles follow the pattern `%PAGE% | LumiMaid — Luxury Cleaning Minneapolis` via the helper in `lib/seo.ts`.
* Meta descriptions are kept under 155 characters.
* Structured data: the homepage outputs a **LocalBusiness** JSON‑LD. The services page could be extended to output **Service** schema. FAQ data is exposed in semantic markup.
* All images include descriptive `alt` attributes and are served via the `public` folder. The hero image is preloaded for improved Largest Contentful Paint (LCP).

## Contributing

Use conventional file names and follow the existing folder structure. Prefer Tailwind utility classes for styling. Ensure any new pages have proper metadata and internal links to drive conversions.

---

_This project was generated for LumiMaid with a focus on conversion, local SEO and ease of maintenance._
