# All on Deck – Generic E-commerce Storefront

A modern, highly flexible, premium e-commerce platform built as a baseline template for retail brands. It is designed to be elegant, simple, fast, and completely generic so you can customize it for any category (sports, apparel, toys, electronics, and more).

This version is pre-seeded with beautiful **fishing and boating merch** (Rods & Reels, Tackle, Apparel, Safety gear).

---

## Technical Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Vanilla Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Database / Auth / Storage**: Supabase (PostgreSQL)
- **Payments**: Stripe Checkout integration

---

## Features

### 🛍️ Premium Public Storefront
- **Dynamic Homepage Builder**: Configure slideshows, featured products, categories, features, value grids, and banners directly from the dashboard settings.
- **Advanced Filtering**: Clean, responsive search combined with filters for Price, Sale, In Stock, Featured, New arrivals, Low stock, and Promotions.
- **Product Gallery**: High-performance image loading, interactive zoom, stock indicators, and customer reviews.
- **Persistent Cart**: Works instantly for guests and signed-in accounts.
- **Stripe Checkout**: Seamlessly redirects to Stripe Checkout with automatic stock reservation.

### 👤 Customer Accounts
- Sign up, sign in, address book management, and rich order history logs.

### 📊 Admin / Owner Dashboard
- **Role-Based Access**: Owner, Staff, and Read-Only admin roles.
- **Sales Analytics**: Dynamic revenue charts, average order value, sales counts, and weekday charts.
- **Order Management**: Process statuses (Pending, Paid, Processing, Shipped, Delivered, Cancelled), add tracking numbers, and manage notes.
- **Bulk Operations**: Bulk publish, unpublish, change prices, adjust stock levels, or change order statuses in one click.
- **Inventory & Coupons**: Advanced stock control, threshold warnings, fixed-price or percentage-off coupons, and product combos/deals.

---

## Quick Start

### 1. Database Setup
See **[SETUP.md](./SETUP.md)** to configure your Supabase project in minutes.

### 2. Install & Boot Locally
Ensure you have [Node.js](https://nodejs.org) installed.

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Deployment

Configure these environment variables on your hosting provider (e.g. Vercel, Netlify):

- `VITE_SUPABASE_URL`: Your Supabase API endpoint.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public key.
