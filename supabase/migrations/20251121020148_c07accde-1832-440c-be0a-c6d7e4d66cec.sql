-- Add testimonial fields to contact_submissions
ALTER TABLE public.contact_submissions
ADD COLUMN is_testimonial BOOLEAN DEFAULT false,
ADD COLUMN testimonial_rating INTEGER DEFAULT 5 CHECK (testimonial_rating >= 1 AND testimonial_rating <= 5),
ADD COLUMN testimonial_order INTEGER DEFAULT 0;

-- Drop the separate testimonials table as we'll use contact_submissions
DROP TABLE IF EXISTS public.testimonials;