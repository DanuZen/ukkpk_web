-- Create struktur_organisasi table
CREATE TABLE public.struktur_organisasi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  angkatan TEXT NOT NULL,
  foto_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.struktur_organisasi ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view struktur organisasi"
ON public.struktur_organisasi
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert struktur organisasi"
ON public.struktur_organisasi
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update struktur organisasi"
ON public.struktur_organisasi
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete struktur organisasi"
ON public.struktur_organisasi
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_struktur_organisasi_updated_at
BEFORE UPDATE ON public.struktur_organisasi
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();