# Database Setup – All on Deck Codebase

This project uses **Supabase** (Postgres database, Auth, and Storage) for a powerful, secure, and lightweight backend.

---

## Getting Started (Fresh Project)

### 1. Create your Supabase Project
1. Visit [supabase.com](https://supabase.com) and sign up/sign in.
2. Click **New project** and select/create your organization.
3. Choose a project name (e.g. `all-on-deck-store`), enter a database password, select a region close to your target audience, and click **Create**.
4. Allow 1–2 minutes for the database instance to initialize.

### 2. Run the Baseline Migration
We have consolidated all the legacy database schema files into a clean baseline setup.

1. In the Supabase Dashboard, click on the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Open [001_schema.sql](./supabase/migrations/001_schema.sql), copy its entire contents, paste it into the editor, and click **Run**.
4. This will create:
   - All core database tables (products, categories, store settings, profiles, cart, orders, coupons, deals, reviews, homepage/about sections, etc.).
   - Row-Level Security (RLS) policies.
   - Database triggers for automated stock adjustments.
   - Pre-seeded **fishing & boating** categories, products, and default website sections.

### 3. Setup Environment Variables
1. Copy `.env.example` in the root of the project to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Navigate to your Supabase Project Dashboard → **Settings** (gear icon) → **API**.
3. Copy your **Project URL** and **anon public** API key, then insert them in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Create the Store Owner
1. Launch the application locally:
   ```bash
   npm run dev
   ```
2. Visit [http://localhost:5173/setup](http://localhost:5173/setup).
3. Sign up with your preferred owner email, password, and name.
4. Click **Create owner account**.

Only one owner account is permitted. Once created, the `/setup` endpoint is locked.

---

## Administrative Commands

### Transferring Store Ownership
To transfer the single owner permission to a different email address:
1. Open the Supabase **SQL Editor**.
2. Run the contents of [002_transfer_owner.sql](./supabase/migrations/002_transfer_owner.sql) after updating the target email address at the bottom of the script.
3. The new owner must already have signed up on the store before you run the transfer.
