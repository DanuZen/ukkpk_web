-- Add end_time column to radio_programs table
ALTER TABLE public.radio_programs
ADD COLUMN end_time time without time zone;