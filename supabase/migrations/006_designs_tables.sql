-- Create design_colors table
CREATE TABLE public.design_colors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    hex_color TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for design_colors
ALTER TABLE public.design_colors ENABLE ROW LEVEL SECURITY;

-- Policies for design_colors
CREATE POLICY "Design colors are publicly viewable" 
    ON public.design_colors FOR SELECT 
    USING (true);

CREATE POLICY "Owner can insert design colors" 
    ON public.design_colors FOR INSERT 
    WITH CHECK (public.is_owner());

CREATE POLICY "Owner can update design colors" 
    ON public.design_colors FOR UPDATE 
    USING (public.is_owner());

CREATE POLICY "Owner can delete design colors" 
    ON public.design_colors FOR DELETE 
    USING (public.is_owner());

-- Create design_patterns table
CREATE TABLE public.design_patterns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for design_patterns
ALTER TABLE public.design_patterns ENABLE ROW LEVEL SECURITY;

-- Policies for design_patterns
CREATE POLICY "Design patterns are publicly viewable" 
    ON public.design_patterns FOR SELECT 
    USING (true);

CREATE POLICY "Owner can insert design patterns" 
    ON public.design_patterns FOR INSERT 
    WITH CHECK (public.is_owner());

CREATE POLICY "Owner can update design patterns" 
    ON public.design_patterns FOR UPDATE 
    USING (public.is_owner());

CREATE POLICY "Owner can delete design patterns" 
    ON public.design_patterns FOR DELETE 
    USING (public.is_owner());


-- Seed data
INSERT INTO public.design_colors (name, hex_color) VALUES
    ('Classic Teak', '#c19a6b'),
    ('Arctic White', '#f5f5f0'),
    ('Carbon Black', '#1a1a1a'),
    ('Ocean Navy', '#1b3a6b'),
    ('Coral Drift', '#d4704a'),
    ('Desert Sand', '#c2a06e'),
    ('Slate Grey', '#5a6475'),
    ('Ivory Pearl', '#ede8d9'),
    ('Deep Ebony', '#2c1810'),
    ('Sea Foam', '#4a9e8b'),
    ('Driftwood', '#8b7355'),
    ('Marine Blue', '#044155');

INSERT INTO public.design_patterns (name, image_url) VALUES
    ('TEAK CLASSIC', '/assets/images/2.jpg'),
    ('CARBON WEAVE', '/assets/images/3.jpg'),
    ('ARCTIC WHITE', '/assets/images/4.jpg'),
    ('NAVY STRIPE', '/assets/images/5.jpg'),
    ('CORAL DRIFT', '/assets/images/10.jpg'),
    ('EBONY MARINE', '/assets/images/11.jpg');
