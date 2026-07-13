-- =============================================================================
-- Owner Transfer Utility
-- =============================================================================
-- Transfers the 'owner' role to a different user account.
--
-- HOW TO USE:
--   1. Replace 'new-owner@example.com' below with the target user's email.
--      That user MUST already have signed up (exists in auth.users).
--   2. Run this script in your Supabase SQL Editor:
--      Dashboard → SQL Editor → New Query → paste → Run
--   3. The previous owner is demoted to 'customer'.
--   4. You can only run this while an owner already exists.
--      (If no owner exists, just use the /setup page instead.)
--
-- IMPORTANT: This does NOT delete or modify the old owner's account —
-- it just changes their role to 'customer' and promotes the new email.
-- =============================================================================

DO $$
DECLARE
  -- ▼ EDIT THIS: the email address of the new owner
  new_owner_email TEXT := 'new-owner@example.com';

  new_owner_id UUID;
  old_owner_id UUID;
BEGIN
  -- Look up the new owner's user ID from auth.users
  SELECT id INTO new_owner_id
  FROM auth.users
  WHERE email = new_owner_email
  LIMIT 1;

  IF new_owner_id IS NULL THEN
    RAISE EXCEPTION
      'No user found with email "%". Make sure this person has signed up first.',
      new_owner_email;
  END IF;

  -- Find current owner (if any)
  SELECT id INTO old_owner_id
  FROM public.profiles
  WHERE role = 'owner'
  LIMIT 1;

  -- Demote current owner to customer
  IF old_owner_id IS NOT NULL THEN
    UPDATE public.profiles
    SET role = 'customer', updated_at = now()
    WHERE id = old_owner_id;

    RAISE NOTICE 'Previous owner (id: %) demoted to customer.', old_owner_id;
  ELSE
    RAISE NOTICE 'No existing owner found — skipping demotion.';
  END IF;

  -- Promote new user to owner
  UPDATE public.profiles
  SET role = 'owner', updated_at = now()
  WHERE id = new_owner_id;

  IF NOT FOUND THEN
    -- Profile row may not exist yet (edge case: user signed up but trigger failed)
    INSERT INTO public.profiles (id, role)
    VALUES (new_owner_id, 'owner');
    RAISE NOTICE 'Created profile row for new owner (id: %).', new_owner_id;
  END IF;

  RAISE NOTICE 'Success: % (id: %) is now the owner.', new_owner_email, new_owner_id;
END $$;
