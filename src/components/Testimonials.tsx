import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from './ui/card';
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { AnimatedSection } from './AnimatedSection';

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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && testimonials.length > 1) {
      nextSlide();
    }
    if (isRightSwipe && testimonials.length > 1) {
      prevSlide();
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
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
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-xs sm:text-sm font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
              TESTIMONI
            </span>
          </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Apa Pendapat Mereka{' '}
              <span className="text-primary">Tentang Kami?</span>
            </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
            Masukan dan pengalaman mereka adalah bagian penting dari perjalanan kami
          </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <div className="relative">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-8 md:left-12 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
            </div>
          </div>

          {/* Testimonial Card */}
          <Card 
            key={currentTestimonial.id}
            className="relative p-6 md:p-12 pt-12 md:pt-20 shadow-2xl border-0 bg-white transition-all duration-700 animate-in fade-in slide-in-from-right-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Author */}
            <div className="flex flex-col items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <Avatar className="h-12 w-12 md:h-16 md:w-16 ring-2 md:ring-4 ring-primary/20">
                <AvatarFallback className="bg-primary text-white text-lg md:text-xl font-bold">
                  {currentTestimonial.nama.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-base md:text-lg">{currentTestimonial.nama}</h3>
                <p className="text-xs md:text-sm text-primary">{currentTestimonial.email}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4 md:mb-6">
              {Array.from({ length: currentTestimonial.testimonial_rating || 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Message */}
            <p className="text-center text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed italic">
              "{currentTestimonial.message}"
            </p>
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
        </AnimatedSection>

        {/* Dots Navigation */}
        {testimonials.length > 1 && (
          <AnimatedSection animation="fade-up" delay={200}>
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
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};
