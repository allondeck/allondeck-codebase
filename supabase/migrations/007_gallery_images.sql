-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    service_type TEXT NOT NULL, -- 'custom_deck_designs' | 'floor_manufacturing' | 'cutting_installation'
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_images
CREATE POLICY "Gallery images are publicly viewable" 
    ON public.gallery_images FOR SELECT 
    USING (true);

CREATE POLICY "Owner can insert gallery images" 
    ON public.gallery_images FOR INSERT 
    WITH CHECK (public.is_owner());

CREATE POLICY "Owner can update gallery images" 
    ON public.gallery_images FOR UPDATE 
    USING (public.is_owner());

CREATE POLICY "Owner can delete gallery images" 
    ON public.gallery_images FOR DELETE 
    USING (public.is_owner());

-- Seed data for gallery images
INSERT INTO public.gallery_images (title, description, image_url, service_type, display_order) VALUES
    ('Custom Marine Teak Pattern', 'Custom CAD templating and precision EVA foam teak design for 32ft center console.', '/assets/images/1.jpg', 'custom_deck_designs', 1),
    ('Hexagon Diamond Pattern', 'Laser measured custom pattern with contrasting navy border accents.', '/assets/images/2.jpg', 'custom_deck_designs', 2),
    ('CNC Foam Floor Fabrication', 'Precision CNC router fabrication using dual layer closed-cell PE/EVA marine foam.', '/assets/images/3.jpg', 'floor_manufacturing', 3),
    ('Non-Skid Helm Pad', 'High-density helm station pad engineered for shock absorption and maximum traction.', '/assets/images/4.jpg', 'floor_manufacturing', 4),
    ('Full Deck Installation', 'Flawless professional surface prep and full vessel deck flooring installation.', '/assets/images/5.jpg', 'cutting_installation', 5),
    ('Swim Platform & Transom Fit', 'Custom fit installation around transom step and swim platform with bevel edge finish.', '/assets/images/10.jpg', 'cutting_installation', 6);
