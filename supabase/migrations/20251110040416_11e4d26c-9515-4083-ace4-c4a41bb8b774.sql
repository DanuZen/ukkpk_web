-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS policies for events
CREATE POLICY "Anyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create radio_programs table
CREATE TABLE public.radio_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  air_time TIME NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  host TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for radio_programs
ALTER TABLE public.radio_programs ENABLE ROW LEVEL SECURITY;

-- RLS policies for radio_programs
CREATE POLICY "Anyone can view radio programs"
  ON public.radio_programs
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert radio programs"
  ON public.radio_programs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update radio programs"
  ON public.radio_programs
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete radio programs"
  ON public.radio_programs
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create radio_settings table
CREATE TABLE public.radio_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  streaming_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for radio_settings
ALTER TABLE public.radio_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for radio_settings
CREATE POLICY "Anyone can view radio settings"
  ON public.radio_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update radio settings"
  ON public.radio_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert radio settings"
  ON public.radio_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Insert default radio settings
INSERT INTO public.radio_settings (streaming_url)
VALUES ('https://radio.ukkpk.id/stream');

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_radio_programs_updated_at
  BEFORE UPDATE ON public.radio_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_radio_settings_updated_at
  BEFORE UPDATE ON public.radio_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();