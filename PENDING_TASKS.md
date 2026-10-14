# 📋 Pending Tasks & Production Roadmap — All On Deck

This document serves as the master checklist for all remaining operational, integration, automation, and feature roadmap tasks for the All On Deck platform.

---

## 🚦 Status Overview Matrix

| Workstream | Feature / Task | Current Status | Priority | Notes / Next Step |
| :--- | :--- | :---: | :---: | :--- |
| 💳 **Payments** | Stripe Checkout Redirect | ✅ Built | High | Code ready; requires live API keys & secrets |
| 💳 **Payments** | Stripe Webhook (`paid` status) | ✅ Built | High | Function ready; requires webhook endpoint registration |
| ✉️ **Automations** | Order Confirmation Email to Buyer | ⏳ **Pending** | High | Needs email trigger when order is marked `paid` |
| ✉️ **Automations** | Shipping Notification with Tracking | ⏳ **Pending** | Medium | Needs email trigger when order is marked `shipped` |
| ✉️ **Automations** | Owner Lead Email for Estimates | 🟡 Partial | Medium | Function written (`send-contact-email`); needs DB webhook |
| 🎨 **Feature** | Interactive Pattern & Color Visualizer | ⏳ **In Roadmap** | High | Owner-requested live deck customizer walkthrough |
| 🔍 **SEO** | On-Page SEO, OpenGraph & Sitemaps | 🟢 **90% Done** | Medium | Dynamic tags & schema active; submit to Google on launch |
| 🌐 **Domain & DNS** | Custom Domain & SSL | ⏳ **Pending** | High | Connect domain in Vercel settings |
| 📧 **Domain & DNS** | Email Domain Verification (DKIM/SPF) | ⏳ **Pending** | Medium | Verify domain in Resend to prevent spam filtering |
| 🎥 **Documentation**| Owner Video Tutorials | ⏳ **Pending** | Low | Record short walkthroughs and link in `README.md` |

---

## 1. 💳 Stripe Payment Gateway Setup

The checkout and webhook code is already built in the codebase (`supabase/functions/create-checkout-session` and `supabase/functions/stripe-webhook`). To accept real payments from buyers, the following tasks remain:

### Action Checklist:
- [ ] **Activate Stripe Account:**
  - Complete business identity verification and bank account details on [stripe.com](https://stripe.com) to receive payouts.
- [ ] **Deploy Edge Functions to Supabase:**
  ```bash
  supabase functions deploy create-checkout-session
  supabase functions deploy stripe-webhook
  ```
- [ ] **Set Live Secrets in Supabase:**
  - In Supabase Dashboard ➔ **Project Settings** ➔ **Edge Functions** ➔ **Secrets**, set:
    - `STRIPE_SECRET_KEY`: Your live Stripe secret key (`sk_live_...`).
    - `STRIPE_WEBHOOK_SECRET`: Your webhook signing secret (`whsec_...`).
- [ ] **Configure Stripe Webhook Endpoint:**
  - In Stripe Dashboard ➔ **Developers** ➔ **Webhooks** ➔ **Add Endpoint**:
    - **Endpoint URL:** `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
    - **Events to send:** `checkout.session.completed`
- [ ] **Update Production URLs:**
  - Verify that `create-checkout-session` redirects buyers to the live production domain on success/cancel:
    - `success_url`: `https://yourdomain.com/order-confirmation/<orderId>`
    - `cancel_url`: `https://yourdomain.com/checkout`

*(Detailed reference: [`PAYMENTS.md`](./PAYMENTS.md))*

---

## 2. ✉️ Buyer Email Automations (Order & Shipping Notifications)

Currently, orders update to `paid` in the database, but **no automated email is dispatched to the buyer**. Implementing transactional emails ensures buyers receive instant purchase confirmations and shipping updates.

### Recommended Tool: [Resend](https://resend.com)
The project already includes a Resend integration pattern in `supabase/functions/send-contact-email/index.ts`. Resend is modern, fast, and easily callable from Supabase Edge Functions or Database Webhooks.

---

### Task 2.1: Automated Order Confirmation Email (to Buyer)
When a customer pays via Stripe Checkout, they should receive a branded receipt email.

* **Trigger:** Inside `supabase/functions/stripe-webhook/index.ts` immediately after updating `orders.status = 'paid'`, or via a Supabase Database Webhook on `orders` where `status = 'paid'`.
* **Recipient:** `order.customer_email` or `order.guest_email`.
* **Email Template Contents:**
  - Subject: `Order Confirmation — All On Deck (#<order_id_short>)`
  - Thank-you message and order summary.
  - Itemized list of purchased items (with sizes/colors, quantities, and prices).
  - Shipping address.
  - Subtotal, taxes, shipping fee, discount savings, and total amount charged.
  - Link to self-service order lookup (`https://yourdomain.com/lookup-order`).

---

### Task 2.2: Shipping & Tracking Notification Email (to Buyer)
When the store owner fulfills an order and provides a tracking number, the buyer should receive a dispatch notification.

* **Trigger:** When order status changes to `shipped` in the database (or when the owner clicks "Save" after pasting a tracking number).
* **Recipient:** Customer email.
* **Email Template Contents:**
  - Subject: `Your All On Deck order has shipped! (#<order_id_short>)`
  - Carrier name (e.g., USPS, UPS, FedEx) and Tracking Number.
  - Direct tracking link (e.g., via carrier website).
  - Estimated delivery timeframe (configured in Store Settings).

---

### Task 2.3: Verify Custom Email Sending Domain (DKIM / SPF)
Currently, `send-contact-email` falls back to testing with `onboarding@resend.dev`.
* **Action:**
  1. Add your custom domain (e.g., `allondeckmarine.com`) to your [Resend Domains Dashboard](https://resend.com/domains).
  2. Add the required DNS records (DKIM, SPF, MX) at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
  3. Update sender email address from `onboarding@resend.dev` to `orders@allondeckmarine.com` or `info@allondeckmarine.com`.

---

## 3. 🔔 Owner Lead & Estimate Notifications

Whenever a potential client requests a quote on the `/estimate` page or submits a message through the contact form, the inquiry is saved to the `contact_requests` table.

### Current State:
- Edge Function `supabase/functions/send-contact-email` is already written to email the owner whenever a new inquiry arrives.
- It needs to be hooked up to run automatically on new submissions.

### Action Checklist:
- [ ] **Deploy Function:**
  ```bash
  supabase functions deploy send-contact-email
  ```
- [ ] **Set Edge Function Secrets:**
  - `RESEND_API_KEY`: API key from your Resend account.
  - `OWNER_EMAIL_ADDRESS`: The owner's notification email (e.g., `orders@allondeckmarine.com` or personal email).
- [ ] **Create Database Webhook in Supabase:**
  - Go to Supabase Dashboard ➔ **Database** ➔ **Webhooks** ➔ **Create Webhook**.
  - **Name:** `notify-owner-new-contact`
  - **Table:** `public.contact_requests`
  - **Events:** `INSERT`
  - **Type:** Supabase Edge Function ➔ Select `send-contact-email`.

---

## 4. 🎨 Interactive Deck Studio & Visualizer (Pattern & Color Selector Walkthrough)

**Status:** High-Priority Feature Request from Owners  
**Target Locations:** Accessible on `/designs`, the Homepage, or a dedicated `/studio` configurator.

### Overview & User Experience
The owners want an interactive walkthrough tool that lets boaters visualize custom decking before requesting an estimate. Rather than just looking at static photos, customers can experiment with different foam color combinations and CNC routing grooves on a representative boat layout.

```
+-----------------------------------------------------------------------------------------+
|                              🚤 ALL ON DECK VISUALIZER STUDIO                           |
+---------------------------------------------------+-------------------------------------+
|                                                   |  STEP 1: SELECT VESSEL / DECK AREA  |
|                                                   |  [ Center Console ] [ Helm Pad ]    |
|                [ INTERACTIVE 2D                   |  [ Swim Platform ]  [ Bow Section ] |
|               BOAT DECK PREVIEW ]                 |                                     |
|                                                   |  STEP 2: DUAL-LAYER FOAM COLORS     |
|   - Real-time color rendering                     |  Top Surface:   [ Teak ] [ Slate ]  |
|   - Dynamically applied CNC routing grooves       |  Bottom Accent: [ Black ] [ Orange ]|
|   - Depth shadows simulating dual-layer EVA foam  |                                     |
|                                                   |  STEP 3: CNC ROUTING PATTERN        |
|                                                   |  [ Classic Teak ] [ Hexagon Honey ] |
|                                                   |  [ Diamond Stitch ] [ Fish Scale ]  |
+---------------------------------------------------+-------------------------------------+
|  ⚡ [ Request Free Estimate With This Exact Specification -> Pre-fills /estimate form ] |
+-----------------------------------------------------------------------------------------+
```

### Proposed Functional Specifications:
1. **Step 1 — Vessel / Deck Section Selection:**
   - Boaters choose their vessel layout or target area (e.g., Center Console Cockpit, Swim Platform, Helm Station Pad, Bow Deck).
2. **Step 2 — Dual-Layer Foam Color Chooser:**
   - **Top Layer (Main Tread):** Reads directly from the owner-managed `design_colors` database table (e.g. Camel Tan, Slate Grey, Dark Charcoal, Seafoam).
   - **Bottom Layer (Bevel & Groove Accent):** Reads accent underlayers (e.g. Midnight Black, Safety Orange, Sky Blue, Cool White).
3. **Step 3 — CNC Routing Pattern Selector:**
   - Reads directly from the owner-managed `design_patterns` table (Classic Plank, Hexagon Honeycomb, Diamond Stitch, Fish Scale / Camo).
4. **Step 4 — Real-Time Visual Feedback:**
   - Dynamic SVG vector deck overlay or Canvas rendering that swaps the top fill color, groove stroke color, and pattern geometry instantly with smooth transitions.
5. **Step 5 — Estimate Hand-Off ("Lock In This Spec"):**
   - Clicking *"Request Estimate with this Design"* redirects the boater to `/estimate`, automatically pre-filling the boat details, selected colors, and pattern into the estimate form fields.

---

## 5. 🔍 SEO & Discoverability Audit

**Overall Status:** 🟢 **~90% Complete & Built-In**

Search engine optimization (SEO), social media previews, and crawlability have already been heavily built into the platform.

### ✅ What is Already Completed:
1. **Dynamic `<SEO>` Component:**
   - Configured across all key public routes (`/`, `/services`, `/designs`, `/gallery`, `/products`, `/products/:slug`, `/estimate`, `/about`, `/cart`, `/checkout`, `/lookup-order`, etc.).
   - Dynamically updates `document.title`, `<meta name="description">`, and canonical links on page change.
2. **Open Graph & Twitter Share Previews:**
   - Full social sharing metadata (`og:title`, `og:description`, `og:image`, `og:type`, `twitter:card="summary_large_image"`). Sharing any link on iMessage, WhatsApp, Facebook, or X generates a polished card with branding and images.
3. **Structured Data (JSON-LD) for Google Rich Results:**
   - `index.html` includes official Schema.org `LocalBusiness` structured data:
     - Business Name: *All On Deck*
     - Telephone: `+1-786-575-8870`
     - Region: Florida (`FL, US`)
     - Price Range: `$$`
     - Service description & logo.
4. **Search Engine Crawler Rules (`robots.txt`):**
   - Located at `public/robots.txt`.
   - Allows public indexing of `/`, `/services`, `/about`, `/products`, `/estimate`, `/designs`, `/gallery`.
   - Protects security and crawl budget by explicitly disallowing private admin/account routes (`/owner/`, `/account/`, `/auth/`).
5. **XML Sitemap (`sitemap.xml`):**
   - Located at `public/sitemap.xml`.
   - Contains all core pages with appropriate priority rankings and update frequencies (including `/gallery`).
6. **Core Web Vitals & Speed Optimization:**
   - Critical hero image (`/assets/images/1.jpg`) is preloaded with `fetchpriority="high"`.
   - Primary custom fonts (`Aquatico-Regular`, `Nunito-Regular`) are preloaded to prevent layout shift (CLS).
   - Fast static HTML fallback shell paints before the JavaScript bundle mounts.
7. **Mobile PWA & App Capabilities:**
   - Viewport configured with `viewport-fit=cover`.
   - Web App Manifest (`manifest.webmanifest`), Apple Touch icons, and theme color `#033343`.

### ⏳ Remaining SEO Action Items for Production Launch:
- [ ] **Google Search Console Registration:**
  - Once the live domain (e.g. `allondeckmarine.com`) is pointed to Vercel, submit `https://yourdomain.com/sitemap.xml` in Google Search Console to index all pages immediately.
- [ ] **Bing Webmaster Tools Registration:**
  - Submit the sitemap to Bing for automatic inclusion in Bing and Yahoo search results.
- [ ] **Domain Consistency Check:**
  - If the live production domain differs from `https://allondeck.com`, update the domain URL in:
    - `public/sitemap.xml`
    - `public/robots.txt`
    - `index.html` (JSON-LD schema URL)
- [ ] **Product Schema Markup (Optional Enhancement):**
  - Add dynamic `Product` JSON-LD schema (price, availability, rating) on individual merchandise pages (`/products/:slug`) for Google Shopping rich snippets.

---

## 6. 🌐 Hosting, Custom Domain & Production Launch

- [ ] **Connect Domain to Vercel:**
  - In the Vercel project dashboard, go to **Settings** ➔ **Domains**.
  - Add your custom domain (e.g., `www.allondeckmarine.com`).
  - Update your DNS nameservers or `A` / `CNAME` records per Vercel's instructions.
- [ ] **Verify Environment Variables on Vercel:**
  - `VITE_SUPABASE_URL` = Production Supabase Project URL.
  - `VITE_SUPABASE_ANON_KEY` = Production Supabase Anon Key.
- [ ] **Perform End-to-End Test Checkout:**
  - Use Stripe test cards or a real \$1 test transaction to verify the complete flow:
    - Customer adds product to cart ➔ Checks out ➔ Order created in Supabase ➔ Stripe confirms payment ➔ Webhook marks order `paid`.

---

## 7. 👥 Owner Handoff & Tutorials

- [ ] **Lock Owner Setup Endpoint:**
  - Ensure the owner account has been registered via `/setup` so no other user can access this initial registration endpoint.
- [ ] **Record Walkthrough Videos:**
  - Record short videos demonstrating how to manage products, boat gallery photos, foam colors, and orders.
  - Paste the URLs into the table in [`README.md`](./README.md).
