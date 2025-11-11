-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true);

-- Storage policies for uploads bucket
CREATE POLICY "Anyone can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Admins can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'uploads' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create profile_settings table for banner
CREATE TABLE public.profile_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_url text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile_settings
CREATE POLICY "Anyone can view profile settings"
ON public.profile_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert profile settings"
ON public.profile_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update profile settings"
ON public.profile_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_profile_settings_updated_at
BEFORE UPDATE ON public.profile_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default profile settings
INSERT INTO public.profile_settings (description)
VALUES ('Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang fokus pada pengembangan keterampilan komunikasi, jurnalistik, dan penyiaran.');