-- Add category column to organization table to support hierarchical structure
ALTER TABLE public.organization 
ADD COLUMN IF NOT EXISTS category text;

-- Add level column to help with positioning
ALTER TABLE public.organization 
ADD COLUMN IF NOT EXISTS level integer DEFAULT 0;

-- Update existing data with default category
UPDATE public.organization 
SET category = 'anggota' 
WHERE category IS NULL;