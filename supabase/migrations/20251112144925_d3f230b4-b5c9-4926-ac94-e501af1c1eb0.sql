-- Add year column to organization table for multi-year structure
ALTER TABLE organization ADD COLUMN year integer DEFAULT 2025;

-- Create social_media_links table for 8 social media accounts
CREATE TABLE social_media_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL, -- 'instagram', 'youtube', 'facebook', 'tiktok'
  organization text NOT NULL, -- 'UKKPK' or 'SIGMA'
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_media_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social links"
  ON social_media_links FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage social links"
  ON social_media_links FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create map_settings table for Google Maps location
CREATE TABLE map_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name text DEFAULT 'Lokasi UKKPK',
  embed_url text,
  latitude numeric,
  longitude numeric,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE map_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view map settings"
  ON map_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage map settings"
  ON map_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create division_logos table for Jurnalistik, Penyiaran, Kreatif Media, MICU
CREATE TABLE division_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_name text NOT NULL,
  logo_url text NOT NULL,
  order_index integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE division_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view division logos"
  ON division_logos FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage division logos"
  ON division_logos FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_social_media_links_updated_at
  BEFORE UPDATE ON social_media_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_map_settings_updated_at
  BEFORE UPDATE ON map_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_division_logos_updated_at
  BEFORE UPDATE ON division_logos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();