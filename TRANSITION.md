# Store Handoff & Deployment Transition Guide

This document outlines the step-by-step process for transitioning the storefront from development to the store owner's production accounts. 

By separating duties, the owner retains master ownership of all financial and legal accounts, while inviting you (the developer) as a collaborator to handle code deployment, database setup, and payment integrations safely.

---

## Phase 1: Accounts Setup & Developer Access

To maintain security, the owner must sign up for master accounts and invite you to each platform with a **Developer/Collaborator** role.

### 1. GitHub (Code Repository)
If the owner wants to own the codebase repository directly:
* **Owner Action:** Sign up at [github.com](https://github.com) and create an organization or personal account.
* **Owner Action:** Navigate to the project repository $\rightarrow$ **Settings** $\rightarrow$ **Collaborators** $\rightarrow$ **Add people** and invite your GitHub username.
* **Developer Action:** Accept the invite and push the final codebase to the owner's repository.

### 2. Supabase (Database & Backend)
* **Owner Action:** Create a free account at [supabase.com](https://supabase.com).
* **Owner Action:** Create a new project (choose a region close to the target customers). Save the database password securely!
* **Owner Action:** Go to **Project Settings** $\rightarrow$ **Team** $\rightarrow$ **Invite** and send an invitation to your email.
* **Developer Action:** Accept the invite. You will now be able to run migrations, inspect tables, and configure Edge Functions without requiring the owner's master password.

### 3. Stripe (Payment Gateway)
* **Owner Action:** Sign up at [stripe.com](https://stripe.com) and complete business verification (submitting bank, tax, and address details to receive payouts).
* **Owner Action:** Go to **Settings** $\rightarrow$ **Team** (under Business settings) $\rightarrow$ **+ New member** and invite your email with the **Developer** role.

### 4. Hosting & Domain (e.g., Vercel or Netlify)
* **Owner Action:** Create an account at [vercel.com](https://vercel.com) (or similar hosting provider) using their GitHub login.
* **Owner Action:** Go to **Settings** $\rightarrow$ **Members** and invite your email as a collaborator.
* **Developer Action:** Connect the GitHub repository, set up the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), and deploy the site.

---

## Phase 2: Copy-Pasteable Invite Requests

Send these messages to the owner when you are ready to start setting up each platform.

### Message A: Stripe & Supabase Setup (Draft)
```markdown
Hi [Owner Name],

I am preparing the database and secure payment integrations for your online store! To do this safely while keeping your financial information private, could you please complete these account setups:

1. **Supabase (Our Secure Database):**
   * Go to https://supabase.com and sign up for a free account.
   * Create a new project (you can name it after your business). Save the database password in a safe place.
   * Navigate to **Project Settings** ➔ **Team** ➔ **Invite** and invite my email: [Your Email]

2. **Stripe (Our Payment Processor):**
   * Go to https://stripe.com, sign up for an account, and complete the business activation details so they can deposit customer payments into your bank account.
   * Go to **Settings** (gear icon in top right) ➔ **Team** ➔ **+ New Member**.
   * Invite my email: [Your Email] and assign the **Developer** role. (This gives me access to technical API keys without letting me see your balance statements or bank account numbers).

Let me know once you have sent the invites, and I will begin configuring the database and payment links!
```

---

## Phase 3: Developer Deployment Steps

Once access is granted, perform the following steps to push the store live:

### 1. Database Migrations
Deploy the tables and seed data to the owner's Supabase instance:
```bash
# Login to Supabase CLI under owner's project
supabase login
supabase link --project-ref <OWNER_PROJECT_REF>

# Apply schema migrations
supabase db push
```

### 2. Stripe Webhook & Secret Provisioning
1. Log into the Stripe dashboard, toggle **Live Mode** (or **Test Mode** first for verification).
2. Go to **Developers** $\rightarrow$ **API Keys** and grab the Secret Key (`sk_live_...`).
3. Set the secret in Supabase:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   ```
4. Go to **Developers** $\rightarrow$ **Webhooks** $\rightarrow$ **Add Endpoint**.
   * **Endpoint URL:** `https://<OWNER_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
   * **Select Events:** `checkout.session.completed`
5. Reveal the **Signing Secret** (`whsec_...`) and configure it in Supabase:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 3. Deploy Edge Functions
Deploy the pre-written checkout functions to the owner's project:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### 4. Deploy Storefront (Vercel)
1. Import the repository into the owner's Vercel account.
2. Configure Environment Variables:
   * `VITE_SUPABASE_URL` = (obtained from Supabase Project Settings $\rightarrow$ API)
   * `VITE_SUPABASE_ANON_KEY` = (obtained from Supabase Project Settings $\rightarrow$ API)
3. Connect the custom domain in Vercel settings and deploy!
