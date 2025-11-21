import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from './ui/card';
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

interface Testimonial {
  id: string;
  nama: string;
  email: string;
  message: string;
  testimonial_rating: number;
}

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('is_testimonial', true)
        .order('testimonial_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else {
        setTestimonials(data || []);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-32 md:py-40 min-h-[85vh] flex items-center scroll-mt-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 animate-pulse mx-auto mb-4 rounded"></div>
            <div className="h-4 w-96 bg-gray-200 animate-pulse mx-auto rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials.length > 0 
    ? testimonials[currentIndex]
    : {
        id: 'default',
        nama: 'Tim UKKPK',
        email: 'ukkpk.office@gmail.com',
        message: 'Belum ada testimoni yang ditampilkan. Admin dapat memilih testimoni dari menu Saran Masuk di dashboard.',
        testimonial_rating: 5
      };

  return (
    <section className="py-32 md:py-40 min-h-[85vh] flex items-center scroll-mt-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 animate-pulse" />
              TESTIMONI
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Apa Kata{' '}
            <span className="text-primary">Klien Kami?</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Kepuasan pelanggan adalah prioritas utama kami
          </p>
        </div>

        <div className="relative">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-8 md:left-12 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
            </div>
          </div>

          {/* Testimonial Card */}
          <Card className="relative p-8 md:p-12 pt-16 md:pt-20 shadow-2xl border-0 bg-white">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: currentTestimonial.testimonial_rating || 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Message */}
            <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed mb-8 italic">
              "{currentTestimonial.message}"
            </p>

            {/* Author */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                  {currentTestimonial.nama.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-lg">{currentTestimonial.nama}</h3>
                <p className="text-sm text-primary">{currentTestimonial.email}</p>
              </div>
            </div>
          </Card>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 rounded-full w-12 h-12 shadow-lg bg-white hover:bg-gray-50 border-2"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 rounded-full w-12 h-12 shadow-lg bg-white hover:bg-gray-50 border-2"
                onClick={nextSlide}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
