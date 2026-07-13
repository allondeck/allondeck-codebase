-- Migration 003: Add optional fields to contact_requests
-- Allows estimate requests, contact form, and footer form to all land in one table.

ALTER TABLE contact_requests
  ADD COLUMN IF NOT EXISTS phone   TEXT,
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS notes   TEXT;
