-- Add author and editor columns to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS editor TEXT;