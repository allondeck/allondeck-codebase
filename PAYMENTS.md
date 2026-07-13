# Payments with Stripe + Supabase

This guide explains how to enable **Stripe** payments so customers pay at checkout and orders are marked **paid** in Supabase when payment succeeds.

## Overview

- **Flow:** Customer fills checkout → order is created in Supabase (status `pending`) → customer is redirected to **Stripe Checkout** → after payment, Stripe redirects back to your site and a **webhook** updates the order to `paid`.
- **Backend:** Two **Supabase Edge Functions** handle Stripe: one creates a Checkout Session (redirect URL), the other receives Stripe webhooks and updates the order.

---

## 1. Stripe account and keys

1. Sign up at [stripe.com](https://stripe.com) and complete account setup.
2. In **Developers** → **API keys**:
   - **Publishable key** (e.g. `pk_test_...`) — used only if you add Stripe.js on the client; for redirect Checkout you can skip it.
   - **Secret key** (e.g. `sk_test_...`) — **never** expose this. It is used only in the Edge Function that creates Checkout Sessions.
3. For **live** payments, use the **live** keys and turn on **live mode** in the Dashboard.

---

## 2. Supabase: migration and Edge Function secrets

### 2.1 Run the Stripe-related migration

In **Supabase** → **SQL Editor**, run the migration that adds the Stripe field to orders:

| File | Purpose |
|------|--------|
| `supabase/migrations/014_orders_stripe_checkout_session.sql` | Adds `stripe_checkout_session_id` to `orders` for linking Stripe sessions |

(If you prefer to run migrations in order, add this as step 14 after `013_about_sections.sql`.)

### 2.2 Create Edge Functions and set secrets

1. **Deploy the two Edge Functions** (see “Edge Functions” section below for code):
   - `create-checkout-session` — creates a Stripe Checkout Session for an order and returns the redirect URL.
   - `stripe-webhook` — receives Stripe webhooks and, on `checkout.session.completed`, updates the order to `paid` and stores the session id.

2. In **Supabase** → **Project Settings** → **Edge Functions** → **Secrets**, add:

   | Secret name | Value | Used by |
   |-------------|--------|---------|
   | `STRIPE_SECRET_KEY` | Your Stripe **secret** key (`sk_test_...` or `sk_live_...`) | `create-checkout-session` |
   | `STRIPE_WEBHOOK_SECRET` | Webhook **signing secret** (e.g. `whsec_...`) from step 3 below | `stripe-webhook` |

   Supabase automatically provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions; `create-checkout-session` uses these to read the order and update it if needed.

---

## 3. Stripe webhook endpoint

1. In **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**.
2. **Endpoint URL:**  
   `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`  
   Replace `<PROJECT_REF>` with your Supabase project reference (from Project Settings → API).
3. **Events to send:** Select **`checkout.session.completed`** (and optionally `checkout.session.expired` if you want to handle expiry).
4. After creating the endpoint, open it and reveal the **Signing secret** (`whsec_...`). Set this as `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function secrets (step 2.2).

---

## 4. Environment variables (app / Vercel)

For the **frontend** (e.g. Vercel), you only need your existing Supabase env vars. The Stripe **publishable** key is optional unless you add Stripe.js (e.g. Payment Element) later:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- (Optional) `VITE_STRIPE_PUBLISHABLE_KEY` — only if you use Stripe.js on the client.

No Stripe keys are required in the frontend for the redirect-to-Checkout flow.

---

## 5. Edge Functions (implementation)

### 5.1 `create-checkout-session`

- **Method:** POST.
- **Body:** `{ "orderId": "<uuid>" }`.
- **Behavior:**
  - Uses `SUPABASE_SERVICE_ROLE_KEY` to fetch the order by id and validate that it exists and is still `pending`.
  - Converts order total to cents and creates a Stripe Checkout Session:
    - `mode: 'payment'`
    - `line_items`: one line with the order total (or multiple lines if you pass items).
    - `metadata.order_id`: order id.
    - `success_url`: `https://<your-site>/order-confirmation/<orderId>`.
    - `cancel_url`: `https://<your-site>/checkout`.
  - Returns `{ "url": "<stripe-checkout-url>" }`.
- **Security:** Only the Stripe secret key is server-side; the client only sends the order id they already have.

### 5.2 `stripe-webhook`

- **Method:** POST (raw body).
- **Behavior:**
  - Reads the raw body and `Stripe-Signature` header.
  - Verifies the event with `STRIPE_WEBHOOK_SECRET` using `stripe.webhooks.constructEvent`.
  - On `checkout.session.completed`:
    - Reads `metadata.order_id` and `id` (session id).
    - Uses Supabase service role to update the order: `status = 'paid'`, `stripe_checkout_session_id = session.id`.
  - Returns 200 quickly so Stripe does not retry unnecessarily.

The actual code for both functions lives in `supabase/functions/` (see repository).

---

## 6. Frontend flow (already implemented)

1. **Checkout page:** Customer enters address (and optional coupon). On “Place order”:
   - An order is created in Supabase (status `pending`) and you get back `orderId`.
   - The app calls the Edge Function `create-checkout-session` with `{ orderId }`.
   - It receives `{ url }` and redirects the browser to Stripe Checkout (cart is cleared when redirecting).
2. **Stripe Checkout:** Customer pays. On success, Stripe redirects to `success_url` (e.g. `/order-confirmation/<orderId>`).
3. **Order confirmation page:** Shows the order and “Payment pending” or “Paid” depending on `order.status`. The webhook usually updates the order to `paid` within a few seconds.

---

## 7. Checklist

- [ ] Stripe account created; test (and optionally live) keys available.
- [ ] Migration `014_orders_stripe_checkout_session.sql` run in Supabase.
- [ ] Edge Functions `create-checkout-session` and `stripe-webhook` deployed.
- [ ] Secrets `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` set in Supabase Edge Functions.
- [ ] Stripe webhook endpoint added with URL `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`, event `checkout.session.completed`, and signing secret stored as `STRIPE_WEBHOOK_SECRET`.
- [ ] Frontend env (e.g. Vercel): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (and optional `VITE_STRIPE_PUBLISHABLE_KEY` if using Stripe.js).
- [ ] In Edge Function, `success_url` and `cancel_url` use your real site URL (e.g. production domain).

---

## 8. Testing

1. Use Stripe **test** keys and **test** cards (e.g. `4242 4242 4242 4242`).
2. For local webhook testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli):  
   `stripe listen --forward-to https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`  
   and use the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET` locally.
3. Place a test order: you should be redirected to Stripe Checkout, pay with a test card, then land on the order confirmation page; after the webhook runs, the order should show as **paid** in the dashboard and in the app.

---

## 9. Going live

- Switch to Stripe **live** keys and set `STRIPE_SECRET_KEY` (and live webhook secret) in Supabase.
- In Stripe Dashboard, add a **live** webhook endpoint with the same URL and event.
- Ensure `success_url` and `cancel_url` in `create-checkout-session` use your production domain.
