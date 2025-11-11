-- Add published_at column to articles and news tables
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Set default value to created_at for existing records
UPDATE public.articles SET published_at = created_at WHERE published_at IS NULL;
UPDATE public.news SET published_at = created_at WHERE published_at IS NULL;