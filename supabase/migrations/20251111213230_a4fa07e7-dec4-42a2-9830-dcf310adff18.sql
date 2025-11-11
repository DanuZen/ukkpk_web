-- Add author, editor, and cameraman columns to news table
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS editor TEXT,
ADD COLUMN IF NOT EXISTS cameraman TEXT;