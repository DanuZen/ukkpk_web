-- Create table for home slideshow images
CREATE TABLE public.home_slideshow (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  order_index integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.home_slideshow ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view slideshow
CREATE POLICY "Anyone can view slideshow"
ON public.home_slideshow
FOR SELECT
USING (true);

-- Allow admins to manage slideshow
CREATE POLICY "Admins can insert slideshow"
ON public.home_slideshow
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update slideshow"
ON public.home_slideshow
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete slideshow"
ON public.home_slideshow
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_home_slideshow_updated_at
BEFORE UPDATE ON public.home_slideshow
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();