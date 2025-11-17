-- Add view_count and likes_count to news table
ALTER TABLE public.news
ADD COLUMN view_count integer DEFAULT 0 NOT NULL,
ADD COLUMN likes_count integer DEFAULT 0 NOT NULL;

-- Add view_count and likes_count to articles table
ALTER TABLE public.articles
ADD COLUMN view_count integer DEFAULT 0 NOT NULL,
ADD COLUMN likes_count integer DEFAULT 0 NOT NULL;

-- Create table to track individual likes
CREATE TABLE public.content_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('article', 'news')),
  user_identifier text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(content_id, content_type, user_identifier)
);

-- Enable RLS on content_likes
ALTER TABLE public.content_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view likes
CREATE POLICY "Anyone can view likes"
ON public.content_likes
FOR SELECT
USING (true);

-- Allow anyone to insert likes (using user_identifier from local storage)
CREATE POLICY "Anyone can insert likes"
ON public.content_likes
FOR INSERT
WITH CHECK (true);

-- Allow users to delete their own likes
CREATE POLICY "Users can delete their own likes"
ON public.content_likes
FOR DELETE
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_content_likes_content ON public.content_likes(content_id, content_type);
CREATE INDEX idx_content_likes_user ON public.content_likes(user_identifier);