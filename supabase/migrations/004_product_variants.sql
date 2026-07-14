-- Migration 004: Product Variants System

-- 1. Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price DECIMAL(12, 2),
  compare_at_price DECIMAL(12, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can view active product variants" ON product_variants;
    DROP POLICY IF EXISTS "Owner can do everything on product variants" ON product_variants;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Anyone can view active product variants" 
  ON product_variants FOR SELECT 
  USING (is_active = true OR public.is_owner());

CREATE POLICY "Owner can do everything on product variants" 
  ON product_variants FOR ALL 
  USING (public.is_owner());

-- 2. Add variant columns to cart_items and order_items
ALTER TABLE cart_items 
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE;

ALTER TABLE order_items 
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS variant_name TEXT;


-- 3. Update Stock Triggers to handle variants

-- Trigger 1: Reduce stock on order item insert
CREATE OR REPLACE FUNCTION public.reduce_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.variant_id IS NOT NULL THEN
    UPDATE product_variants
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
    WHERE id = NEW.variant_id;
  ELSIF NEW.product_id IS NOT NULL THEN
    UPDATE products
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC 1: Restore stock for order
CREATE OR REPLACE FUNCTION public.restore_stock_for_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  oi RECORD;
BEGIN
  IF NOT public.is_owner() THEN
    RAISE EXCEPTION 'Only store owner can restore stock for an order';
  END IF;

  FOR oi IN (SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = p_order_id) LOOP
    IF oi.variant_id IS NOT NULL THEN
      UPDATE product_variants pv
      SET stock_quantity = pv.stock_quantity + oi.quantity
      WHERE pv.id = oi.variant_id;
    ELSIF oi.product_id IS NOT NULL THEN
      UPDATE products p
      SET stock_quantity = p.stock_quantity + oi.quantity
      WHERE p.id = oi.product_id;
    END IF;
  END LOOP;

  UPDATE orders
  SET stock_restored_at = now()
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC 2: Reserve stock for order
CREATE OR REPLACE FUNCTION public.reserve_stock_for_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  oi RECORD;
BEGIN
  IF NOT public.is_owner() THEN
    RAISE EXCEPTION 'Only store owner can reserve stock for an order';
  END IF;

  FOR oi IN (SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = p_order_id) LOOP
    IF oi.variant_id IS NOT NULL THEN
      UPDATE product_variants pv
      SET stock_quantity = GREATEST(0, pv.stock_quantity - oi.quantity)
      WHERE pv.id = oi.variant_id;
    ELSIF oi.product_id IS NOT NULL THEN
      UPDATE products p
      SET stock_quantity = GREATEST(0, p.stock_quantity - oi.quantity)
      WHERE p.id = oi.product_id;
    END IF;
  END LOOP;

  UPDATE orders
  SET stock_reserved_at = now()
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
