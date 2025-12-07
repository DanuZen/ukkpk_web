-- Update RLS policies for Articles (Jurnalistik)
-- Run this AFTER adding the new roles!

DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;

CREATE POLICY "Admins and Jurnalistik can insert articles"
  ON public.articles FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_jurnalistik')
  );

CREATE POLICY "Admins and Jurnalistik can update articles"
  ON public.articles FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_jurnalistik')
  );

CREATE POLICY "Admins and Jurnalistik can delete articles"
  ON public.articles FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_jurnalistik')
  );

-- Update RLS policies for News (Jurnalistik)
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;

CREATE POLICY "Admins and Jurnalistik can insert news"
  ON public.news FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_jurnalistik')
  );

CREATE POLICY "Admins and Jurnalistik can update news"
  ON public.news FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_jurnalistik')
  );

CREATE POLICY "Admins and Jurnalistik can delete news"
  ON public.news FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_jurnalistik')
  );

-- Update RLS policies for Radio Programs (Radio)
DROP POLICY IF EXISTS "Admins can insert radio programs" ON public.radio_programs;
DROP POLICY IF EXISTS "Admins can update radio programs" ON public.radio_programs;
DROP POLICY IF EXISTS "Admins can delete radio programs" ON public.radio_programs;

CREATE POLICY "Admins and Radio can insert radio programs"
  ON public.radio_programs FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_radio')
  );

CREATE POLICY "Admins and Radio can update radio programs"
  ON public.radio_programs FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_radio')
  );

CREATE POLICY "Admins and Radio can delete radio programs"
  ON public.radio_programs FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_radio')
  );

-- Update RLS policies for Radio Settings (Radio)
DROP POLICY IF EXISTS "Admins can update radio settings" ON public.radio_settings;
DROP POLICY IF EXISTS "Admins can insert radio settings" ON public.radio_settings;

CREATE POLICY "Admins and Radio can update radio settings"
  ON public.radio_settings FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_radio')
  );

CREATE POLICY "Admins and Radio can insert radio settings"
  ON public.radio_settings FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'admin_radio')
  );
