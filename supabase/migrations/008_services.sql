-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    card_title TEXT,
    description TEXT NOT NULL,
    secondary_description TEXT,
    image_url TEXT NOT NULL,
    cta_text TEXT DEFAULT 'View Gallery',
    cta_link TEXT DEFAULT '/gallery',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policies for services (idempotent with DROP POLICY IF EXISTS)
DROP POLICY IF EXISTS "Services are publicly viewable" ON public.services;
CREATE POLICY "Services are publicly viewable" 
    ON public.services FOR SELECT 
    USING (is_active = true);

DROP POLICY IF EXISTS "Owner can insert services" ON public.services;
CREATE POLICY "Owner can insert services" 
    ON public.services FOR INSERT 
    WITH CHECK (public.is_owner());

DROP POLICY IF EXISTS "Owner can update services" ON public.services;
CREATE POLICY "Owner can update services" 
    ON public.services FOR UPDATE 
    USING (public.is_owner());

DROP POLICY IF EXISTS "Owner can delete services" ON public.services;
CREATE POLICY "Owner can delete services" 
    ON public.services FOR DELETE 
    USING (public.is_owner());

-- Seed initial default services if table is empty
INSERT INTO public.services (title, card_title, description, secondary_description, image_url, cta_text, cta_link, display_order, is_active)
SELECT 'Custom DECK Designs', 'Custom\nDeck Designs', 'Each vessel is unique. Our CAD team designs custom marine deck templates tailored to your boat''s specific layouts and configuration. We offer custom logo engraving, unique patterns, and stylized borders that fit your style perfectly.', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.', '/assets/images/1.jpg', 'View Gallery', '/gallery?category=custom_deck_designs', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE title ILIKE '%Custom DECK Designs%');

INSERT INTO public.services (title, card_title, description, secondary_description, image_url, cta_text, cta_link, display_order, is_active)
SELECT 'Floor Manufacturing', 'Floor\nManufacturing', 'We manufacture using MarineMat, the leading closed-cell EVA/PE foam material. Resilient to UV rays, salt water, and chemical stains, our materials provide superior non-skid traction even when wet, outstanding noise reduction, and excellent shock absorption.', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.', '/assets/images/2.jpg', 'View Gallery', '/gallery?category=floor_manufacturing', 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE title ILIKE '%Floor Manufacturing%');

INSERT INTO public.services (title, card_title, description, secondary_description, image_url, cta_text, cta_link, display_order, is_active)
SELECT 'Cutting and Installation', 'Cutting and\nInstallation', 'With over two years of experience and outstanding results in Florida, we elevate your boat’s standard through high-precision CNC cutting. Our specialized team, using CAD and CAM software, ensures the millimeter-perfect fabrication of each MarineMat piece, followed by a professional and meticulous installation that guarantees a flawless fit, impeccable aesthetics, and maximum durability at sea.', NULL, '/assets/images/3.jpg', 'View Gallery', '/gallery?category=cutting_installation', 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE title ILIKE '%Cutting and Installation%');

-- Update existing services to new CTA defaults if they were previously inserted with the old values
UPDATE public.services
SET cta_text = 'View Gallery', cta_link = '/gallery?category=custom_deck_designs'
WHERE title ILIKE '%Custom DECK Designs%' AND (cta_text = 'Get Started' OR cta_link = '/estimate');

UPDATE public.services
SET cta_text = 'View Gallery', cta_link = '/gallery?category=floor_manufacturing'
WHERE title ILIKE '%Floor Manufacturing%' AND (cta_text = 'Get Started' OR cta_link = '/estimate');

UPDATE public.services
SET cta_text = 'View Gallery', cta_link = '/gallery?category=cutting_installation'
WHERE title ILIKE '%Cutting and Installation%' AND (cta_text = 'Get Started' OR cta_link = '/estimate');
