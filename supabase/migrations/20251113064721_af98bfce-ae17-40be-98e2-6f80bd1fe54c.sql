-- Create table for slideshow settings
CREATE TABLE IF NOT EXISTS public.slideshow_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auto_play_speed INTEGER NOT NULL DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.slideshow_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Anyone can view slideshow settings"
  ON public.slideshow_settings
  FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update slideshow settings"
  ON public.slideshow_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO public.slideshow_settings (auto_play_speed) VALUES (5000);