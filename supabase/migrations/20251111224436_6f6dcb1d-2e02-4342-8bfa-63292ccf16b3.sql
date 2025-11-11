-- Add organization_image_url column to profile_settings table
ALTER TABLE profile_settings 
ADD COLUMN organization_image_url text;

COMMENT ON COLUMN profile_settings.organization_image_url IS 'URL for organization structure image';