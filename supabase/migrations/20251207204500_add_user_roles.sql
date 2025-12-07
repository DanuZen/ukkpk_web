-- Add new roles to the enum
-- Run this first!
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin_jurnalistik';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin_radio';
