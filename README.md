# 🚤 All On Deck — Complete Platform & Owner Operations Manual

Welcome to the **All On Deck** management manual! This document is the definitive guide for operating, updating, and maintaining the All On Deck digital platform. It covers everything that can be managed across the customer-facing storefront and the owner dashboard, alongside technical deployment references and video walkthrough guidelines.

---

## 📑 Table of Contents

1. [🌟 Platform Overview](#-platform-overview)
2. [🔑 Access, Security & Initial Setup](#-access-security--initial-setup)
   - [Logging In](#logging-in)
   - [Initial Owner Account Setup](#initial-owner-account-setup)
   - [Transferring Ownership](#transferring-ownership)
3. [🧭 Master Navigation Map](#-master-navigation-map)
4. [📊 Dashboard Home & Analytics Overview](#-dashboard-home--analytics-overview)
   - [Key Metrics & Summary Cards](#key-metrics--summary-cards)
   - [Visual Trend Charts](#visual-trend-charts)
   - [Customizing Your Dashboard Widgets](#customizing-your-dashboard-widgets)
5. [🛠️ Services Management](#️-services-management)
   - [Adding or Editing a Service](#adding-or-editing-a-service)
   - [Reordering & Activating Services](#reordering--activating-services)
6. [📸 Project Gallery Showcase](#-project-gallery-showcase)
   - [Adding a Completed Boat Project](#adding-a-completed-boat-project)
   - [Categorizing by Service Type](#categorizing-by-service-type)
   - [Reordering & Deleting Gallery Images](#reordering--deleting-gallery-images)
7. [🎨 Designs: Foam Colors & CNC Routing Patterns](#-designs-foam-colors--cnc-routing-patterns)
   - [Managing Foam Color Swatches](#managing-foam-color-swatches)
   - [Managing Router Patterns](#managing-router-patterns)
8. [🛍️ E-Commerce Products & Merch Catalog](#️-e-commerce-products--merch-catalog)
   - [Browsing & Filtering Products](#browsing--filtering-products)
   - [Adding a New Product (Step-by-Step)](#adding-a-new-product-step-by-step)
   - [Managing Product Variants (Sizes & Colors)](#managing-product-variants-sizes--colors)
   - [Stock Thresholds & Low Stock Warnings](#stock-thresholds--low-stock-warnings)
   - [Editing, Unpublishing & Deleting Products](#editing-unpublishing--deleting-products)
9. [📥 Bulk Inventory & Stock Import](#-bulk-inventory--stock-import)
   - [CSV Stock File Format](#csv-stock-file-format)
   - [Previewing and Applying Stock Updates](#previewing-and-applying-stock-updates)
10. [🗂️ Product Categories](#️-product-categories)
    - [Adding & Editing Categories](#adding--editing-categories)
    - [Display Order & Visibility](#display-order--visibility)
11. [📦 Orders, Invoices & Fulfillment](#-orders-invoices--fulfillment)
    - [Order Tracking & Status Lifecycle](#order-tracking--status-lifecycle)
    - [Viewing Order Details & Customer Shipping](#viewing-order-details--customer-shipping)
    - [Stripe Payment Verification](#stripe-payment-verification)
    - [Adding Carrier Tracking Numbers](#adding-carrier-tracking-numbers)
    - [Cancelling Orders & Restoring Inventory](#cancelling-orders--restoring-inventory)
    - [Creating Manual Orders (Phone / In-Person)](#creating-manual-orders-phone--in-person)
    - [Importing Orders from Invoices (CSV / Excel)](#importing-orders-from-invoices-csv--excel)
12. [👥 Customers & Private CRM Notes](#-customers--private-crm-notes)
    - [Customer Directory & Lifetime Spend](#customer-directory--lifetime-spend)
    - [Customer Purchase History](#customer-purchase-history)
    - [Private Owner Notes per Customer](#private-owner-notes-per-customer)
13. [⭐ Product Reviews & Moderation](#-product-reviews--moderation)
    - [Filtering & Searching Reviews](#filtering--searching-reviews)
    - [Hiding vs. Deleting Inappropriate Reviews](#hiding-vs-deleting-inappropriate-reviews)
14. [🏷️ Coupons & Promotional Discounts](#️-coupons--promotional-discounts)
    - [Creating a Discount Code](#creating-a-discount-code)
    - [Setting Discount Scopes (All, Categories, Specific Products)](#setting-discount-scopes)
    - [Setting Expiration Dates & Usage Limits](#setting-expiration-dates--usage-limits)
15. [✉️ Inquiries & Free Estimate Leads](#️-inquiries--free-estimate-leads)
    - [Reviewing Free Estimate Requests](#reviewing-free-estimate-requests)
    - [Contact Form & Footer Messages](#contact-form--footer-messages)
    - [Following Up & Deleting Messages](#following-up--deleting-messages)
16. [⚙️ Storefront & System Settings](#️-storefront--system-settings)
    - [Shipping & Estimated Delivery Text](#shipping--estimated-delivery-text)
    - [Allowed Shipping Destination Countries](#allowed-shipping-destination-countries)
    - [Storefront Display Options & Out-of-Stock Visibility](#storefront-display-options)
    - [Product Filters Customization](#product-filters-customization)
    - [Media Storage Cleanup Utility](#media-storage-cleanup-utility)
    - [AI Chatbot Instructions](#ai-chatbot-instructions)
17. [🎥 Video Tutorials & Walkthroughs](#-video-tutorials--walkthroughs)
18. [💻 Technical Quick-Start (Developers & Deployment)](#-technical-quick-start-developers--deployment)
    - [Tech Stack](#tech-stack)
    - [Environment Variables](#environment-variables)
    - [Running Locally](#running-locally)
    - [Database & Migrations](#database--migrations)
19. [📞 Support & Developer Contact](#-support--developer-contact)

---

<a id="-platform-overview"></a>
## 🌟 Platform Overview

The **All On Deck** web platform unites custom marine flooring fabrication with an integrated e-commerce catalog into a single high-performance website:

1. **The Public Storefront & Portfolio:**
   - **Custom Decking Presentation:** Highlights CAD templating, CNC marine manufacturing, and installation services.
   - **Completed Boat Gallery:** Visual showcase categorized by craft and service.
   - **Material & Color Palette:** Interactive swatches showing dual-color combinations and CNC patterns.
   - **Free Estimate Estimator:** Lead capture form collecting boat make, model, length, and custom requests.
   - **E-Commerce Store:** Full shopping cart, variant selections (sizes/colors), discounts, and Stripe Checkout.
   - **Order Lookup:** Self-service tracking for customers by email and order ID.

2. **The Owner Control Room (`/account/owner` & `/owner`):**
   - Protected back-office where the owner updates services, uploads boat photos, edits foam color palettes, manages products and stock, fulfills orders, manages customer notes, moderates reviews, creates coupons, and tunes store settings without touching code.

---

<a id="-access-security--initial-setup"></a>
## 🔑 Access, Security & Initial Setup

### Logging In
1. Visit your site and click **Account / Sign In** (or navigate directly to `/login?redirect=/account/owner`).
2. Enter your **Owner Email and Password**.
3. Upon authentication, you will be redirected to the **Owner Dashboard**.
4. The dashboard is accessible anytime via the **Owner Dashboard** button in the header or at `/account/owner`.

> [!NOTE]
> Owner routes are secured by database-level Row Level Security (RLS) and authentication guards (`OwnerGuard`). Non-owner users attempting to access `/account/owner` will be redirected to `/account`.

### Initial Owner Account Setup
When setting up a brand-new database instance:
1. Run the project locally (`npm run dev`) or visit the hosted site at `/setup`.
2. Fill out your owner name, email address, and strong password.
3. Click **Create owner account**.
4. Once created, the `/setup` route is permanently locked.

### Transferring Ownership
If the owner account needs to be transferred to a new email address:
1. Have the new owner sign up for a normal account on the site.
2. In the Supabase SQL Editor, run [`002_transfer_owner.sql`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/supabase/migrations/002_transfer_owner.sql) with the new owner's email address.

---

<a id="-master-navigation-map"></a>
## 🧭 Master Navigation Map

All management areas are accessible from the sidebar menu inside the **Owner Dashboard** (or top scrolling pills on mobile):

```
+----------------------------------------------------------------------------------------------------+
|                                    OWNER DASHBOARD MENU                                            |
+----------------------+-----------------------------------+-----------------------------------------+
| Sidebar Link         | URL Path                          | Primary Management Purpose              |
+----------------------+-----------------------------------+-----------------------------------------+
| 📊 Overview          | /account/owner                    | Sales KPIs, trend charts & quick alerts |
| 📦 Orders            | /owner/orders                     | Order fulfillment, tracking & invoices  |
| 🛍️ Products          | /account/owner/products           | Items, variants, prices & stock levels  |
| 👥 Customers         | /account/owner/customers          | Directory, spend totals & private notes |
| ⭐ Reviews           | /account/owner/reviews            | Moderate & hide product reviews         |
| 🗂️ Categories        | /account/owner/categories         | Merch catalog organization & slugs      |
| 🏷️ Discounts         | /account/owner/coupons            | Promotional coupon codes & limits       |
| ✉️ Contact           | /account/owner/contact            | Free estimate leads & contact messages  |
| 🎨 Designs           | /account/owner/designs            | Foam color swatches & CNC patterns      |
| 🛠️ Services          | /account/owner/services           | Services cards & boat project gallery   |
| ⚙️ Store Settings    | /account/owner/settings           | Shipping, filters, widgets & cleanup    |
+----------------------+-----------------------------------+-----------------------------------------+
```

---

<a id="-dashboard-home--analytics-overview"></a>
## 📊 Dashboard Home & Analytics Overview

**Path:** `/account/owner`  
**All Widgets View:** `/account/owner/widgets`

The dashboard overview gives you a real-time snapshot of your business health.

### Key Metrics & Summary Cards
- **Total Revenue:** Gross earnings from completed and paid Stripe transactions.
- **Total Orders:** Count of all customer and manual orders.
- **Product Catalog:** Number of active items in the merchandise store.
- **Low Stock Summary:** High-priority warning badge displaying products at or below their alert threshold. Clicking this badge takes you directly to the low-stock inventory list.

### Visual Trend Charts
- **Revenue Trend (14 Days):** Day-by-day revenue progression.
- **Orders by Status:** Visual breakdown of orders in *Pending*, *Paid*, *Processing*, *Shipped*, and *Completed* stages.
- **Orders Over Time (14 Days):** Order volume trajectory.
- **Average Order Value (AOV):** Mean spend per customer checkout.
- **Orders by Day of Week:** Identifies your peak purchasing days.
- **Top Selling Products:** Ranked list of your most popular store products.
- **Low Stock Alerts List:** Direct list of products needing reordering.

### Customizing Your Dashboard Widgets
You can choose which cards and charts appear on your overview screen:
1. Go to **Store Settings** (`/account/owner/settings`).
2. Scroll to the **Dashboard widgets** section.
3. Toggle widgets on or off (up to 4 stats, 4 charts, and 2 lists).
4. Drag and drop items into your preferred viewing order.
5. Click **Save all settings** at the bottom.

---

<a id="️-services-management"></a>
## 🛠️ Services Management

**Path:** `/account/owner/services?tab=services`

This section controls the custom marine decking services highlighted on your homepage and the `/services` page (e.g. *Custom Deck Designs*, *Floor Manufacturing*, *Cutting & Installation*).

### Adding or Editing a Service
1. In the owner menu, click **Services** and ensure the **Services** tab is active.
2. Click **Add Service** (or click the **Edit (pencil)** icon on an existing service).
3. Fill out the fields:
   - **Title:** The headline name of the service (e.g., `Custom Deck Designs`).
   - **Card Title:** The abbreviated title used on visual cards (supports line breaks).
   - **Description:** The primary service description.
   - **Secondary Description:** Supplemental details or technical specifications.
   - **Featured Image:** Click **Upload Image** to select a photo from your computer (automatically uploaded to your secure storage bucket).
   - **Call-to-Action Text:** Text for the button (e.g., `View Gallery` or `Request Estimate`).
   - **Call-to-Action Link:** Where the button directs (e.g., `/gallery?category=custom_deck_designs` or `/estimate`).
   - **Display Order:** Number determining the display order (1, 2, 3...).
   - **Active Status:** Check **Active** so it is visible to the public.
4. Click **Save Service**.

### Reordering & Activating Services
- **Move Up / Down:** Click the **Up Arrow** or **Down Arrow** buttons to shift a service's position instantly.
- **Hide / Unhide:** Click the **Eye icon** to toggle a service between active and inactive without deleting it.
- **Delete:** Click the **Trash icon** to permanently remove a service.

---

<a id="-project-gallery-showcase"></a>
## 📸 Project Gallery Showcase

**Path:** `/account/owner/services?tab=gallery` *(or `/gallery` for public view)*

The Gallery showcase gives boat owners visual proof of your precision craftsmanship across different boat styles and marine applications.

### Adding a Completed Boat Project
1. Navigate to **Services** and switch to the **Gallery** tab.
2. Click **Add Gallery Image**.
3. Provide the project details:
   - **Title:** e.g., `Sea Ray 320 Sundancer — Teak & Black Diamond`.
   - **Description:** Details about the install (e.g., `Complete cockpit and swim platform laser scanning with custom helm pad`).
   - **Service Type Category:** Select which service category this project belongs to:
     - `Custom Deck Designs`
     - `Floor Manufacturing`
     - `Cutting & Installation`
   - **Project Photo:** Click **Upload Image** to upload a high-resolution photo of the finished boat.
   - **Display Order:** Enter a numeric rank for ordering.
4. Click **Save Image**.

### Categorizing by Service Type
Customers can filter the public gallery by category tabs. Selecting the correct **Service Type** ensures the photo shows up under the relevant filter on the public `/gallery` page.

### Reordering & Deleting Gallery Images
- Use the **Move Up** and **Move Down** buttons on any gallery item to reorder how pictures appear in the customer portfolio.
- Click the **Trash icon** to delete a photo.

---

<a id="-designs-foam-colors--cnc-routing-patterns"></a>
## 🎨 Designs: Foam Colors & CNC Routing Patterns

**Path:** `/account/owner/designs` *(or `/designs` for public view)*

The Designs page allows potential clients to explore your dual-layer EVA foam color swatches and CNC router groove patterns.

### Managing Foam Color Swatches
1. In the sidebar, click **Designs** and select the **Colors** tab.
2. Click **Add Color Swatch** (or click the **Edit** icon on an existing swatch).
3. Configure the color swatch:
   - **Color Name:** e.g., `Camel / Black`, `Slate Grey / Orange`, `Teak / White`.
   - **Hex Color Code (Optional):** Enter a hex code (e.g., `#B58842`) to display a color accent dot.
   - **Swatch Preview Image:** Upload a crisp close-up photo of the dual-layer foam material.
4. Click **Save Swatch**.

### Managing Router Patterns
1. Switch to the **Patterns** tab under **Designs**.
2. Click **Add Pattern** (or click **Edit** on an existing pattern).
3. Configure the pattern:
   - **Pattern Name:** e.g., `Classic Plank`, `Hexagon Diamond`, `Fish Scale`, `Faux Teak`.
   - **Pattern Preview Image:** Upload a sample image or CAD render showing the routing groove style.
4. Click **Save Pattern**.
- You can delete any unused color or pattern anytime with the **Trash icon**.

---

<a id="️-e-commerce-products--merch-catalog"></a>
## 🛍️ E-Commerce Products & Merch Catalog

**Path:** `/account/owner/products`  
**New Product Form:** `/account/owner/products/new`

Manage your online store merchandise (apparel, boat accessories, decking cleaner kits, branded gear).

### Browsing & Filtering Products
- **Filter by Category:** Narrow down items by category.
- **Filter by Featured:** View only products marked for the homepage spotlight.
- **Low Stock Filter:** Check the **Low stock only** box to immediately isolate products needing replenishment.
- **Sort By:** Sort by *Newest*, *Price: Low to High*, *Price: High to Low*, or *Stock: Low to High*.

### Adding a New Product (Step-by-Step)
1. Click **Add product** (`/account/owner/products/new`).
2. Fill out the core information:
   - **Name:** e.g., `All On Deck Technical Performance Hoodie`.
   - **Slug:** Auto-generated from name or customize the URL (e.g. `technical-hoodie`).
   - **Description:** Detailed product write-up (fabric, sizing, marine UV rating).
   - **Base Price ($):** Selling price (e.g., `49.99`).
   - **Compare-at Price ($):** Optional original price to display a strike-through discount (e.g., `64.99`).
   - **SKU:** Stock Keeping Unit code (e.g., `AOD-HD-001`).
   - **Stock Quantity:** Starting inventory count.
   - **Low Stock Threshold:** The number at which low-stock warnings fire (default: `5`).
   - **Categories:** Check up to 3 categories that apply.
   - **Published:** Check to make visible on the public store. Uncheck to save as draft.
   - **Featured:** Check to spotlight this product on the home page and top of shop.
   - **Product Image:** Upload the primary product photo (max 5 MB; compressed automatically).

### Managing Product Variants (Sizes & Colors)
If an item comes in multiple sizes, colors, or options:
1. In the product form, locate the **Variants** section.
2. Click **Add Variant**.
3. Fill out the variant properties:
   - **Variant Name:** e.g., `Medium / Navy Blue` or `XL / Heather Grey`.
   - **Variant SKU:** e.g., `AOD-HD-NV-M`.
   - **Price & Compare-at Price:** Can be the same as base price or customized.
   - **Stock Quantity:** Specific stock count for this exact variant.
   - **Variant Image:** Upload a dedicated picture for this option.
   - **Default Variant:** Select which option is pre-selected when customers open the page.
4. Repeat for all options.

### Stock Thresholds & Low Stock Warnings
Whenever a variant or base product drops to or below its **Low stock threshold**, the system:
- Flags the product in the owner product table with a highlighted low-stock pill.
- Surfaces it on the Owner Dashboard overview under **Low Stock Alerts**.

### Editing, Unpublishing & Deleting Products
- **Editing:** Click on any product name or its **Edit** link to modify info.
- **Draft / Unpublish:** Simply uncheck **Published** and save. The product disappears from public view while preserving sales records.
- **Deleting:** Open the product and click **Delete Product**. (Confirm when prompted).

---

<a id="-bulk-inventory--stock-import"></a>
## 📥 Bulk Inventory & Stock Import

**Path:** `/account/owner/products/import`

When you receive a new inventory shipment from suppliers, you can adjust stock quantities in seconds via CSV instead of clicking through products one-by-one.

### CSV Stock File Format
Prepare a simple CSV spreadsheet (`.csv`) with columns:

```csv
sku,quantity
AOD-HD-NV-M,25
AOD-HD-NV-L,30
AOD-CAP-001,50
```

> [!TIP]
> The system automatically recognizes common column headers: `sku`, `item_sku`, `name`, `product_name`, `qty`, `quantity`, `add_quantity`, `stock`.

### Previewing and Applying Stock Updates
1. Navigate to **Products** and click **Import stock from CSV**.
2. Choose your `.csv` file.
3. The system parses the file and presents a **Live Match Preview**:
   - **Matched Items:** Shows the product, current stock, and the incoming adjustment.
   - **Unmatched Items:** Lists any SKUs not found in the database.
4. You can edit any quantity directly in the preview table before applying.
5. Click **Apply stock updates**. The database updates instantly.

---

<a id="️-product-categories"></a>
## 🗂️ Product Categories

**Path:** `/account/owner/categories`  
**New Category Form:** `/account/owner/categories/new`

Organize your store merchandise into clean, browsable categories (e.g. *Apparel*, *Headwear*, *Boat Accessories*, *Care & Maintenance*).

### Adding & Editing Categories
1. Click **Categories** in the sidebar.
2. Click **Add category**.
3. Enter:
   - **Name:** e.g., `Deck Care & Cleaning`.
   - **Slug:** Auto-generated URL string (e.g., `deck-care-cleaning`).
   - **Description:** Short customer-facing description.
   - **Sort Order:** Numerical display rank (e.g., `1`, `2`, `3`).
   - **Visible:** Toggle whether this category appears in the store sidebar and navigation.
4. Click **Save category**.

---

<a id="-orders-invoices--fulfillment"></a>
## 📦 Orders, Invoices & Fulfillment

**Path:** `/owner/orders`  
**Manual Order Entry:** `/owner/orders/create-manual`  
**Invoice Import:** `/owner/orders/from-invoice`

The Orders center manages customer purchases from online checkouts, phone orders, and wholesale invoices.

### Order Tracking & Status Lifecycle
Every order moves through a standard fulfillment lifecycle:

```
[ pending ] ──▶ [ paid ] ──▶ [ processing ] ──▶ [ shipped ] ──▶ [ completed ]
      │
      └───▶ [ cancelled ] (Option to restore stock to inventory)
      │
      └───▶ [ refunded ]
```

- **Pending:** Order placed, awaiting payment confirmation.
- **Paid:** Customer paid successfully via Stripe Checkout.
- **Processing / In Progress:** You are packing or manufacturing the merchandise.
- **Shipped:** The parcel has been dispatched to the carrier.
- **Completed / Delivered:** The order reached the customer.
- **Cancelled:** The order was called off.
- **Refunded:** Payment was returned to the buyer.

> [!NOTE]
> You can update an order's status directly from the orders list table using the inline status dropdown!

### Viewing Order Details & Customer Shipping
Click on any order `#ID` to open the full order file (`/owner/orders/:id`):
- **Customer Email & Contact Info.**
- **Shipping Address:** Full mailing address and recipient telephone.
- **Item Breakdown:** List of ordered products, variant selections, quantities, and line subtotals.
- **Discount & Coupon:** Displays any applied coupon code and total discount saved.
- **Financial Breakdown:** Subtotal, Tax, Shipping, and Final Total.

### Stripe Payment Verification
For online purchases, the order detail screen highlights a green **"Payment received via Stripe"** badge with the linked Stripe Checkout Session reference.

### Adding Carrier Tracking Numbers
When dispatching an order:
1. Open the order detail page.
2. Set status to **Shipped**.
3. If tracking was provided during manual entry or fulfillment, the tracking number and carrier appear on the order file and in the customer's `/lookup-order` screen.

### Cancelling Orders & Restoring Inventory
If an order is cancelled:
1. Change status to **Cancelled** and confirm the prompt.
2. A button will appear: **"Add back to stock"**.
3. Click it to automatically restore the purchased item quantities back into your product inventory.
4. Once restored, the system records the timestamp (`Stock restored on [date]`).

### Creating Manual Orders (Phone / In-Person)
If a client buys merchandise in your shop or orders over the phone:
1. Navigate to `/owner/orders/create-manual`.
2. Add products from your catalog and set quantities and prices.
3. Enter the customer's email and shipping address.
4. Click **Create order**. The inventory is deducted and the order is added to your records.

### Importing Orders from Invoices (CSV / Excel)
If you generate invoices through third-party accounting or POS tools:
1. Navigate to `/owner/orders/from-invoice`.
2. Upload a `.csv` or `.xlsx` spreadsheet.
3. The parser detects customer emails, names, line items, and quantities.
4. Confirm the preview to batch-generate the orders.

---

<a id="-customers--private-crm-notes"></a>
## 👥 Customers & Private CRM Notes

**Path:** `/account/owner/customers`  
**Customer Profile:** `/account/owner/customers/:customerKey`

A lightweight built-in CRM that aggregates every client who has completed a purchase.

### Customer Directory & Lifetime Spend
The customer directory ranks buyers by:
- Customer email.
- Total orders placed.
- Lifetime gross spend.
- Most recent order date.

### Customer Purchase History
Clicking any customer opens their complete transaction ledger:
- Chronological list of every past order.
- Current status of each order.
- Direct links into individual order breakdowns.

### Private Owner Notes per Customer
Every customer profile includes a **Private Owner Notes** workspace:
- Keep track of their boat make and model (e.g., *2021 Boston Whaler 280 Outrage*).
- Note preferred foam colors (*Teak over Black, Hexagon pattern*).
- Log phone call notes and special requests.
- Click **Save note** to store. Notes are private and never visible to the customer.

---

<a id="-product-reviews--moderation"></a>
## ⭐ Product Reviews & Moderation

**Path:** `/account/owner/reviews`

Protect your brand reputation and monitor customer feedback on store merchandise.

### Filtering & Searching Reviews
- **Filter by Product:** View reviews for a specific item.
- **Filter by Rating:** Inspect 1-star through 5-star ratings.
- **Date Range:** Filter by *Last 7 days*, *Last 30 days*, *Last 90 days*, or *All time*.
- **Search:** Search review text by keyword.
- **Status Filter:** Toggle between *All*, *Visible only*, and *Hidden only*.

### Hiding vs. Deleting Inappropriate Reviews
- **Hide / Unhide (Recommended):** Click **Hide** on any questionable or spam review. The review will disappear immediately from the public product page while keeping a record in your dashboard. You can unhide it at any time.
- **Delete:** Permanently remove the review from the database.

---

<a id="️-coupons--promotional-discounts"></a>
## 🏷️ Coupons & Promotional Discounts

**Path:** `/account/owner/coupons`  
**New Coupon Form:** `/account/owner/coupons/new`

Drive sales with targeted discount codes for holiday events, boat shows, and social media campaigns.

### Creating a Discount Code
1. Click **Discounts** in the sidebar.
2. Click **Create coupon**.
3. Configure the discount:
   - **Coupon Code:** The code the customer enters at checkout (e.g., `SUMMER20`, `BOATSHOW50`, `WELCOME10`).
   - **Discount Type:**
     - **Percentage:** Deducts a percentage (e.g., `20%`).
     - **Fixed Amount:** Deducts a dollar amount (e.g., `$50.00`).
   - **Discount Value:** Enter the numeric value (e.g., `20` or `50`).

### Setting Discount Scopes
You can control where the discount applies:
- **All items:** Applies to any product in the store.
- **Featured items only:** Applies only to items marked as Featured.
- **Specific categories:** Select one or more categories eligible for the promotion.
- **Specific products:** Select exact products eligible for the code.

### Setting Expiration Dates & Usage Limits
- **Start & End Dates:** Set valid date ranges. The code will activate and expire automatically.
- **Usage Limit:** Maximum total times the code can be redeemed (e.g. `100` for the first 100 customers).
- Click **Save Coupon**.

---

<a id="️-inquiries--free-estimate-leads"></a>
## ✉️ Inquiries & Free Estimate Leads

**Path:** `/account/owner/contact`

All customer leads and communications land in this unified inbox.

### Reviewing Free Estimate Requests
Whenever a boater completes the **"Get Free Estimate"** form on `/estimate`:
- The submission appears with a high-visibility orange **`ESTIMATE`** badge.
- Contains:
  - Customer name, email, and phone number.
  - Vessel details: Make, model, boat length, and decking requirements.
  - Timestamp of inquiry.

### Contact Form & Footer Messages
- General questions from the contact form or footer appear alongside estimate requests, with their respective subject lines.

### Following Up & Deleting Messages
- Click any message row to expand the full text.
- Click the customer's email or phone number to initiate direct follow-up.
- Once handled, click **Delete message** to keep your inbox clean.

---

<a id="️-storefront--system-settings"></a>
## ⚙️ Storefront & System Settings

**Path:** `/account/owner/settings`

Fine-tune global storefront behaviors, checkout countries, filter widgets, and database storage.

### Shipping & Estimated Delivery Text
- **Estimated Delivery:** Customize the delivery estimate shown to customers during browsing and checkout (e.g., `2–3 business days` or `Ships within 48 hours`).

### Allowed Shipping Destination Countries
- Choose which countries appear in the checkout address selector.
- Add or remove countries depending on your shipping capabilities (United States, Canada, Bahamas, etc.).

### Storefront Display Options
- **Show Out-of-Stock Items:** 
  - *Checked:* Products with 0 stock remain visible on the storefront with an "Out of stock" indicator.
  - *Unchecked:* Out-of-stock products are hidden from the catalog automatically.
- **New Arrivals Window:** Number of days a product is considered "New" for the *New Arrivals* filter (default: `30` days).
- **Collapsible Sidebar Defaults:**
  - *Categories collapsed by default.*
  - *Filters collapsed by default.*

### Product Filters Customization
Select which filter checkboxes are available to customers on the `/products` page:
- Price range (`price`)
- On sale (`sale`)
- In stock only (`in_stock`)
- Featured only (`featured`)
- New arrivals (`new_arrivals`)
- Low stock (`low_stock`)
- Deals (`deals`)

### Media Storage Cleanup Utility
Over time, uploading new product pictures or logos can leave unreferenced files in storage.
- Click **Clean up unused storage** in the **Maintenance** section.
- The utility scans the Supabase `products` and `store` storage buckets, detects files not linked to any active product or setting, and safely deletes them to prevent storage bloat.

### AI Chatbot Instructions
Provide guidance or custom business facts for the AI customer assistant widget.

---

<a id="-video-tutorials--walkthroughs"></a>
## 🎥 Video Tutorials & Walkthroughs

The following video walkthroughs provide visual demonstrations of key owner management workflows:

| # | Tutorial Topic | Description | Video Link |
|---|----------------|-------------|------------|
| 1 | 🎬 **Owner Dashboard Overview** | Tour of the sidebar menu, sales metrics, and customizing widgets. | _[Coming Soon]_ |
| 2 | 🛠️ **Managing Services & Gallery** | Editing service descriptions, uploading boat photos, and reordering. | _[Coming Soon]_ |
| 3 | 🎨 **Updating Foam Colors & Patterns** | Adding new EVA foam swatches, hex codes, and CNC router styles. | _[Coming Soon]_ |
| 4 | 🛍️ **Adding Products & Managing Stock** | Creating merch, setting variants (sizes/colors), and CSV stock import. | _[Coming Soon]_ |
| 5 | 📦 **Fulfilling Orders & Tracking** | Updating order statuses, viewing Stripe receipts, and adding tracking. | _[Coming Soon]_ |
| 6 | ✉️ **Reviewing Quotes & Estimate Requests** | Checking free estimate submissions and boat details. | _[Coming Soon]_ |
| 7 | ⚙️ **Storefront Settings & Maintenance** | Configuring delivery time, shipping countries, and storage cleanup. | _[Coming Soon]_ |

---

<a id="-technical-quick-start-developers--deployment"></a>
## 💻 Technical Quick-Start (Developers & Deployment)

### Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons, Framer Motion
- **Backend & Database:** Supabase (PostgreSQL, Row-Level Security, Storage, Edge Functions)
- **Payment Processing:** Stripe Checkout + Supabase Edge Functions (`create-checkout-session`, `stripe-webhook`)
- **Hosting & CI/CD:** Vercel

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Optional (only needed if using Stripe Elements on client):
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Running Locally
1. Ensure [Node.js](https://nodejs.org) (v18+) is installed.
2. Clone repository and install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database & Migrations
Database migrations are located in [`supabase/migrations/`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/supabase/migrations):
- `001_schema.sql`: Core schema (products, categories, store settings, profiles, cart, orders, coupons, reviews).
- `002_transfer_owner.sql`: Store owner permission transfer helper.
- `003_contact_requests_extra_fields.sql`: Estimate requests & phone fields.
- `004_product_variants.sql`: Product sizes, colors, and SKU variants.
- `005_variant_images.sql`: Variant image mapping.
- `006_designs_tables.sql`: `design_colors` and `design_patterns`.
- `007_gallery_images.sql`: Completed vessel gallery and service category tags.
- `008_services.sql`: Dynamic services table, card titles, CTA links, and RLS policies.

To apply migrations using the Supabase CLI:
```bash
supabase db push
```

For Stripe payment setup instructions and Edge Function deployment, refer to [`PAYMENTS.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/PAYMENTS.md).  
For client account handoff procedures, refer to [`TRANSITION.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/TRANSITION.md).  
For the checklist of pending launch items and email automations, refer to [`PENDING_TASKS.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/PENDING_TASKS.md).

---

<a id="-support--developer-contact"></a>
## 📞 Support & Developer Contact

For technical assistance, architecture inquiries, or custom feature expansion, reach out to your engineering team:

- 📞 **Phone:** (561) 410-6673
- ✉️ **Email:** [leandroalfonso14@gmail.com](mailto:leandroalfonso14@gmail.com)
- 🌐 **Project Repository:** [All On Deck Codebase](https://github.com/leandroalfonso/allondeck-codebase)
