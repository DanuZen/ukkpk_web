-- Add show_image column to popup_settings table
ALTER TABLE public.popup_settings 
ADD COLUMN IF NOT EXISTS show_image boolean DEFAULT true;
