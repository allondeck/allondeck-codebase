-- =============================================================================
-- All on Deck — Complete Schema (consolidated baseline)
-- Run against a fresh Supabase project.
-- No jewelry-specific tables, no materials, no repair_requests.
-- =============================================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- SECTION 1: Core tables
-- =============================================================================

-- ── Categories ────────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_visible ON categories(is_visible);

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  compare_at_price DECIMAL(12, 2),
  sku TEXT,
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN products.low_stock_threshold IS 'Alert when stock falls below this. Null = use default (10).';

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_published ON products(is_published);
CREATE INDEX idx_products_featured ON products(is_featured);

-- ── Product–Categories junction (many-to-many, up to 3 per product) ───────────
CREATE TABLE product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

CREATE OR REPLACE FUNCTION public.check_product_category_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM product_categories WHERE product_id = NEW.product_id) >= 3 THEN
    RAISE EXCEPTION 'Product can have at most 3 categories';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER product_categories_max_3
  BEFORE INSERT ON product_categories
  FOR EACH ROW EXECUTE FUNCTION public.check_product_category_limit();

-- ── Store settings (key-value store for name, logo, etc.) ─────────────────────
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Profiles (extends auth.users) ─────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner', 'staff', 'readonly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Cart items ────────────────────────────────────────────────────────────────
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX cart_user_product_idx ON cart_items (user_id, product_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX cart_session_product_idx ON cart_items (session_id, product_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_session ON cart_items(session_id);

-- ── Coupons ───────────────────────────────────────────────────────────────────
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  scope TEXT NOT NULL CHECK (scope IN ('all', 'featured', 'categories', 'products')),
  scope_ids JSONB NOT NULL DEFAULT '[]',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_updated ON coupons(updated_at DESC);

-- ── Deals (combo bundles) ─────────────────────────────────────────────────────
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  total_price DECIMAL(12, 2) NOT NULL CHECK (total_price >= 0),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE deal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(deal_id, product_id)
);

CREATE INDEX idx_deals_sort ON deals(sort_order);
CREATE INDEX idx_deal_items_deal ON deal_items(deal_id);
CREATE INDEX idx_deal_items_product ON deal_items(product_id);

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number TEXT,
  carrier TEXT,
  stripe_checkout_session_id TEXT,
  stock_restored_at TIMESTAMPTZ,
  stock_reserved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN orders.stock_restored_at IS 'Set when owner clicks Re-add items to stock (after cancel).';
COMMENT ON COLUMN orders.stock_reserved_at IS 'Set when order is first created (trigger) or when owner clicks Reserve items (from cancelled).';

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe_checkout_session ON orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX idx_orders_tracking ON orders(tracking_number) WHERE tracking_number IS NOT NULL;

-- ── Order items ───────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(12, 2) NOT NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN order_items.deal_id IS 'Set when this line came from a combo deal; used for deal-level analytics.';
CREATE INDEX idx_order_items_deal ON order_items(deal_id) WHERE deal_id IS NOT NULL;

-- ── Product reviews ───────────────────────────────────────────────────────────
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT,
  hidden BOOLEAN NOT NULL DEFAULT false,
  reviewer_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

COMMENT ON COLUMN product_reviews.reviewer_email IS 'Email of the reviewer at time of submission; used by owner to reply.';
CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_created ON product_reviews(created_at DESC);

-- ── Customer notes ────────────────────────────────────────────────────────────
CREATE TABLE customer_notes (
  customer_key TEXT PRIMARY KEY,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Contact form submissions ───────────────────────────────────────────────────
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);



-- =============================================================================
-- SECTION 2: Auth & Owner setup
-- =============================================================================

-- Ensure only one owner exists
CREATE UNIQUE INDEX profiles_single_owner_idx ON profiles (role) WHERE role = 'owner';

-- Trigger: auto-create profile on signup (always as customer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'customer'  -- Always customer; owner is set only via claim_owner RPC
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RPC: Check if owner exists (public, for setup page)
CREATE OR REPLACE FUNCTION public.has_owner()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE role = 'owner');
END;
$$;

-- RPC: Claim owner role (only works when no owner exists)
CREATE OR REPLACE FUNCTION public.claim_owner()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Must be signed in to claim owner';
  END IF;
  IF EXISTS (SELECT 1 FROM profiles WHERE role = 'owner') THEN
    RAISE EXCEPTION 'Owner already exists';
  END IF;
  UPDATE profiles SET role = 'owner' WHERE id = auth.uid();
END;
$$;

-- Helper: Check if current user is owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner');
$$;

-- =============================================================================
-- SECTION 3: Stock management triggers & RPCs
-- =============================================================================

-- Reduce product stock when order_items are inserted
CREATE OR REPLACE FUNCTION public.reduce_stock_on_order_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE products
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_item_insert_reduce_stock
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION public.reduce_stock_on_order_item();

-- Mark order as having reserved stock when order_items are inserted
CREATE OR REPLACE FUNCTION public.set_order_stock_reserved_on_item_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE orders
    SET stock_reserved_at = COALESCE(stock_reserved_at, now())
    WHERE id = NEW.order_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_item_insert_set_stock_reserved
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION public.set_order_stock_reserved_on_item_insert();

-- RPC: Restore product stock for a cancelled order (owner "Re-add items to stock")
CREATE OR REPLACE FUNCTION public.restore_stock_for_order(p_order_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_owner() THEN
    RAISE EXCEPTION 'Only store owner can restore stock for an order';
  END IF;
  UPDATE products p
  SET stock_quantity = p.stock_quantity + oi.quantity
  FROM order_items oi
  WHERE oi.order_id = p_order_id
    AND oi.product_id = p.id;
  UPDATE orders
  SET stock_restored_at = now()
  WHERE id = p_order_id;
END;
$$;

-- RPC: Reserve (reduce) product stock for an order (owner "Reserve items" from cancelled)
CREATE OR REPLACE FUNCTION public.reserve_stock_for_order(p_order_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_owner() THEN
    RAISE EXCEPTION 'Only store owner can reserve stock for an order';
  END IF;
  UPDATE products p
  SET stock_quantity = GREATEST(0, p.stock_quantity - oi.quantity)
  FROM order_items oi
  WHERE oi.order_id = p_order_id
    AND oi.product_id = p.id;
  UPDATE orders
  SET stock_reserved_at = now()
  WHERE id = p_order_id;
END;
$$;

-- =============================================================================
-- SECTION 4: Guest order RPCs
-- =============================================================================

CREATE OR REPLACE FUNCTION get_order_for_guest(lookup_order_id UUID, lookup_email TEXT)
RETURNS SETOF orders
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.* FROM orders o
  WHERE o.id = lookup_order_id
    AND (trim(lower(o.guest_email)) = trim(lower(lookup_email))
         OR trim(lower(o.customer_email)) = trim(lower(lookup_email)));
$$;

GRANT EXECUTE ON FUNCTION get_order_for_guest(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_order_for_guest(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION get_order_items_for_guest(lookup_order_id UUID, lookup_email TEXT)
RETURNS SETOF order_items
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT oi.* FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE oi.order_id = lookup_order_id
    AND (trim(lower(o.guest_email)) = trim(lower(lookup_email))
         OR trim(lower(o.customer_email)) = trim(lower(lookup_email)));
$$;

GRANT EXECUTE ON FUNCTION get_order_items_for_guest(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_order_items_for_guest(UUID, TEXT) TO authenticated;

-- RPC: Check if current user has purchased a product (for verified reviews)
CREATE OR REPLACE FUNCTION public.has_purchased_product(p_product_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.user_id = auth.uid()
      AND oi.product_id = p_product_id
  );
$$;

COMMENT ON FUNCTION public.has_purchased_product(UUID) IS 'True if the current user has at least one order containing the given product.';
GRANT EXECUTE ON FUNCTION public.has_purchased_product(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_purchased_product(UUID) TO anon;

-- =============================================================================
-- SECTION 5: Storage buckets
-- =============================================================================

-- Products bucket (5 MB, images only)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'products') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  END IF;
END $$;

-- Store bucket (logo/assets, 2 MB)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'store') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('store', 'store', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
  END IF;
END $$;

DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Owner can upload product images" ON storage.objects;
CREATE POLICY "Owner can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND public.is_owner());

DROP POLICY IF EXISTS "Owner can update product images" ON storage.objects;
CREATE POLICY "Owner can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND public.is_owner());

DROP POLICY IF EXISTS "Owner can delete product images" ON storage.objects;
CREATE POLICY "Owner can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND public.is_owner());

DROP POLICY IF EXISTS "Store assets are publicly accessible" ON storage.objects;
CREATE POLICY "Store assets are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'store');

DROP POLICY IF EXISTS "Owner can upload store assets" ON storage.objects;
CREATE POLICY "Owner can upload store assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store' AND public.is_owner());

DROP POLICY IF EXISTS "Owner can update store assets" ON storage.objects;
CREATE POLICY "Owner can update store assets" ON storage.objects FOR UPDATE USING (bucket_id = 'store' AND public.is_owner());

DROP POLICY IF EXISTS "Owner can delete store assets" ON storage.objects;
CREATE POLICY "Owner can delete store assets" ON storage.objects FOR DELETE USING (bucket_id = 'store' AND public.is_owner());

-- =============================================================================
-- SECTION 6: Row Level Security (RLS)
-- =============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Published products are viewable by everyone" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Store settings are viewable by everyone" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Anyone can read deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Anyone can read deal_items" ON deal_items FOR SELECT USING (true);

CREATE POLICY "Product categories viewable by everyone" ON product_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      JOIN categories c ON c.id = product_categories.category_id
      WHERE p.id = product_categories.product_id
      AND p.is_published = true
      AND c.is_visible = true
    )
  );

-- Reviews: public for non-hidden, owner sees all, users can manage own
CREATE POLICY "Anyone can read visible reviews" ON product_reviews FOR SELECT USING (hidden = false);
CREATE POLICY "Owner can read all reviews" ON product_reviews FOR SELECT USING (public.is_owner());
CREATE POLICY "Users can read own review" ON product_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own review" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can update reviews" ON product_reviews FOR UPDATE USING (public.is_owner());
CREATE POLICY "Owner can delete reviews" ON product_reviews FOR DELETE USING (public.is_owner());

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cart
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anon can read guest orders" ON orders FOR SELECT TO anon USING (user_id IS NULL);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));
CREATE POLICY "Users can cancel own orders" ON orders FOR UPDATE
  USING (user_id = auth.uid() AND status IN ('pending', 'processing'))
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Owner can view all orders" ON orders FOR SELECT USING (public.is_owner());
CREATE POLICY "Owner can update orders" ON orders FOR UPDATE USING (public.is_owner());
CREATE POLICY "Owner can delete orders" ON orders FOR DELETE USING (public.is_owner());

-- Order items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "Anyone can create order_items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR o.user_id IS NULL)
    )
  );
CREATE POLICY "Owner can view all order_items" ON order_items FOR SELECT USING (public.is_owner());
CREATE POLICY "Owner can delete order_items" ON order_items FOR DELETE USING (public.is_owner());

-- Owner full management
CREATE POLICY "Owner can manage categories" ON categories FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage products" ON products FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage product_categories" ON product_categories FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage store_settings" ON store_settings FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage coupons" ON coupons FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage deals" ON deals FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage deal_items" ON deal_items FOR ALL USING (public.is_owner());
CREATE POLICY "Owner can manage customer_notes" ON customer_notes FOR ALL USING (public.is_owner());

-- Contact requests: public insert, owner read/delete
CREATE POLICY "Anyone can submit a contact request" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner can view and delete contact requests" ON contact_requests FOR ALL USING (public.is_owner());

-- Guest order inserts
GRANT INSERT ON orders TO anon;
GRANT INSERT ON orders TO authenticated;
GRANT INSERT ON order_items TO anon;
GRANT INSERT ON order_items TO authenticated;

-- =============================================================================
-- SECTION 7: Seed data — All on Deck (fishing & boating merch)
-- =============================================================================

-- Store defaults
INSERT INTO store_settings (key, value) VALUES
  ('store_name', '"All on Deck"'),
  ('currency', '"USD"'),
  ('guest_checkout', 'true')
ON CONFLICT (key) DO NOTHING;

-- Categories
INSERT INTO categories (name, slug, description, sort_order, is_visible) VALUES
  ('Rods & Reels', 'rods-and-reels', 'Fishing rods, spinning reels, and combo sets', 1, true),
  ('Tackle & Lures', 'tackle-and-lures', 'Lures, hooks, jigs, and tackle boxes', 2, true),
  ('Boating Accessories', 'boating-accessories', 'Anchors, rope, fenders, and boat gear', 3, true),
  ('Apparel', 'apparel', 'UV-protective shirts, hats, and fishing apparel', 4, true),
  ('Safety & Navigation', 'safety-and-navigation', 'Life jackets, flares, compasses, and safety gear', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Products
DO $$
DECLARE
  cat_rods UUID;
  cat_tackle UUID;
  cat_boating UUID;
  cat_apparel UUID;
  cat_safety UUID;
BEGIN
  SELECT id INTO cat_rods FROM categories WHERE slug = 'rods-and-reels' LIMIT 1;
  SELECT id INTO cat_tackle FROM categories WHERE slug = 'tackle-and-lures' LIMIT 1;
  SELECT id INTO cat_boating FROM categories WHERE slug = 'boating-accessories' LIMIT 1;
  SELECT id INTO cat_apparel FROM categories WHERE slug = 'apparel' LIMIT 1;
  SELECT id INTO cat_safety FROM categories WHERE slug = 'safety-and-navigation' LIMIT 1;

  -- Rods & Reels
  INSERT INTO products (name, slug, description, price, compare_at_price, sku, stock_quantity, is_published, is_featured, category_id) VALUES
    ('Pro Series Spinning Rod 7ft', 'pro-series-spinning-rod-7ft', 'Medium-heavy graphite spinning rod, 7ft. Ideal for bass and inshore saltwater.', 89.99, 109.99, 'ROD-PS7-01', 30, true, true, cat_rods),
    ('Saltwater Spinning Reel 4000', 'saltwater-spinning-reel-4000', 'Corrosion-resistant 4000-series spinning reel with 10 ball bearings.', 119.99, NULL, 'REEL-SW4000-01', 25, true, true, cat_rods),
    ('Freshwater Combo Kit', 'freshwater-combo-kit', '6.5ft rod + 2500 reel combo, pre-spooled. Great for beginners.', 59.99, 74.99, 'COMBO-FW-01', 40, true, false, cat_rods)
  ON CONFLICT (slug) DO NOTHING;

  -- Tackle & Lures
  INSERT INTO products (name, slug, description, price, compare_at_price, sku, stock_quantity, is_published, is_featured, category_id) VALUES
    ('Soft Plastic Shrimp Lures (12-pack)', 'soft-plastic-shrimp-lures-12pk', 'Lifelike shrimp imitation in 3 natural colors. Works great for redfish and trout.', 14.99, NULL, 'LUR-SHR-12', 80, true, true, cat_tackle),
    ('Topwater Popper Lure', 'topwater-popper-lure', 'Classic cupped-face popper for surface action. Attracts bass and pike.', 12.99, 16.99, 'LUR-TOP-01', 60, true, false, cat_tackle),
    ('Tackle Box Organizer 3600', 'tackle-box-organizer-3600', '3600-style waterproof tackle box with adjustable dividers. 28 compartments.', 19.99, NULL, 'BOX-3600-01', 50, true, false, cat_tackle)
  ON CONFLICT (slug) DO NOTHING;

  -- Boating Accessories
  INSERT INTO products (name, slug, description, price, compare_at_price, sku, stock_quantity, is_published, is_featured, category_id) VALUES
    ('Folding Boat Anchor 3.5 lb', 'folding-boat-anchor-3-5lb', 'Compact folding anchor for small boats and kayaks. Holds in sand and mud.', 34.99, NULL, 'ANCH-35-01', 35, true, true, cat_boating),
    ('Marine-Grade Dock Lines (pair)', 'marine-grade-dock-lines-pair', '3/8" x 15ft double-braided nylon dock lines with eye splice. Sold as a pair.', 27.99, 34.99, 'ROPE-DL-15', 45, true, false, cat_boating),
    ('Inflatable Fender Buoys (2-pack)', 'inflatable-fender-buoys-2pk', 'Heavy-duty vinyl fenders for boat-to-dock and boat-to-boat protection.', 24.99, NULL, 'FEND-INF-2', 40, true, false, cat_boating)
  ON CONFLICT (slug) DO NOTHING;

  -- Apparel
  INSERT INTO products (name, slug, description, price, compare_at_price, sku, stock_quantity, is_published, is_featured, category_id) VALUES
    ('UPF 50+ Fishing Shirt – Long Sleeve', 'upf50-fishing-shirt-long-sleeve', 'Lightweight moisture-wicking fishing shirt with UPF 50+ sun protection.', 44.99, 54.99, 'APP-LS-UPF', 60, true, true, cat_apparel),
    ('Waterproof Boating Hat', 'waterproof-boating-hat', 'Wide-brim waterproof hat with chin strap and mesh venting. One size fits most.', 29.99, NULL, 'APP-HAT-WP', 70, true, true, cat_apparel),
    ('Fishing Gloves Cut-Resistant', 'fishing-gloves-cut-resistant', 'Fingerless cut-resistant fishing gloves with grip palm and UV protection.', 18.99, NULL, 'APP-GLV-CR', 55, true, false, cat_apparel)
  ON CONFLICT (slug) DO NOTHING;

  -- Safety & Navigation
  INSERT INTO products (name, slug, description, price, compare_at_price, sku, stock_quantity, is_published, is_featured, category_id) VALUES
    ('Adult Type III Life Jacket', 'adult-type-iii-life-jacket', 'USCG-approved Type III PFD. Universal adult fit. Available in multiple colors.', 49.99, 64.99, 'SAF-PFD-T3', 30, true, true, cat_safety),
    ('Visual Distress Signal Kit', 'visual-distress-signal-kit', 'Coast Guard-approved flare kit with 3 hand flares and 3 parachute signals.', 39.99, NULL, 'SAF-VDS-KIT', 20, true, false, cat_safety),
    ('Waterproof Handheld Compass', 'waterproof-handheld-compass', 'Liquid-filled orienteering compass with luminous markings. Floats if dropped.', 22.99, 27.99, 'NAV-COMP-01', 40, true, false, cat_safety)
  ON CONFLICT (slug) DO NOTHING;

  -- Sync product_categories from category_id for all products
  INSERT INTO product_categories (product_id, category_id, sort_order)
  SELECT p.id, p.category_id, 0
  FROM products p
  WHERE p.category_id IS NOT NULL
  ON CONFLICT (product_id, category_id) DO NOTHING;
END $$;

