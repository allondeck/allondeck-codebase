-- Migration 005: Add image_url to product variants

ALTER TABLE product_variants 
  ADD COLUMN IF NOT EXISTS image_url TEXT;
