import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Radio as RadioIcon, Play, BookOpen, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SlideshowImage {
  id: string;
  image_url: string;
  order_index: number | null;
}

interface SlideshowSettings {
  auto_play_speed: number;
}

export const HomeSlideshow = () => {
  const [images, setImages] = useState<SlideshowImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000);
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchImages();
    fetchSettings();
  }, []);

  // Scroll tracking for blur effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }, autoPlaySpeed);
    return () => clearInterval(interval);
  }, [images.length, autoPlaySpeed]);

  const fetchImages = async () => {
    const { data } = await supabase
      .from('home_slideshow')
      .select('*')
      .order('order_index', { ascending: true });
    if (data && data.length > 0) {
      setImages(data);
    }
  };

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('slideshow_settings')
      .select('auto_play_speed')
      .maybeSingle();
    if (data) {
      setAutoPlaySpeed(data.auto_play_speed);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  if (images.length === 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20 -mt-16">
        <div className="absolute inset-0 flex items-center justify-center px-4 pt-16">
          <div className="text-center z-10 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Selamat Datang di UKKPK
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Unit Kegiatan Komunikasi dan Penyiaran Kampus
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Calculate blur and opacity based on scroll
  const blurAmount = Math.min(scrollY / 300, 1); // 0 to 1
  const opacity = Math.max(1 - scrollY / 400, 0); // 1 to 0
  
  // Reduce blur on mobile for better readability
  const maxBlur = isMobile ? 3 : 8; // 3px on mobile, 8px on desktop

  // Hide indicators when scrolling
  const shouldShowIndicators = scrollY < 50;

  return (
    <section className="relative w-full h-screen overflow-hidden group -mt-16">
      {/* Slideshow Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.image_url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
          </div>
        ))}
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pt-16 pb-24 md:pb-0">
        <div
          className="max-w-3xl text-left z-10 px-4 sm:px-6 animate-fade-in transition-all duration-300"
          style={{
            filter: `blur(${blurAmount * maxBlur}px)`,
            opacity: opacity
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3 sm:mb-6">
            <RadioIcon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
            <span className="text-[10px] sm:text-sm font-medium text-white">
              Unit Kegiatan Komunikasi & Penyiaran Kampus
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6 text-white drop-shadow-2xl leading-tight">
            Media Kampus
            <br />
            Profesional dari UNP
          </h1>
          
          {/* Subtitle */}
          <p
            className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-8 leading-relaxed max-w-2xl animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Platform media kampus yang menghubungkan Anda dengan berita terkini, 
            artikel berkualitas, dan siaran radio kampus dari UKKPK UNP.
          </p>

          {/* CTA Buttons */}
          <div
            style={{ animationDelay: '0.4s' }}
            className="gap-1.5 sm:gap-2 mb-4 sm:mb-8 animate-fade-up flex-row flex items-center justify-start flex-wrap"
          >
            <Link to="/artikel">
              <Button size="sm" className="text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                <BookOpen className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                Baca Artikel
              </Button>
            </Link>
            <Link to="/berita">
              <Button size="sm" className="text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                <Newspaper className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                Lihat Berita
              </Button>
            </Link>
            <Link to="/radio">
              <Button size="sm" variant="outline" className="text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white shadow-lg hover:shadow-xl transition-all">
                <RadioIcon className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                Dengar Radio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity h-12 w-12"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity h-12 w-12"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Dots Indicator - Even smaller and lower */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-2 sm:bottom-2.5 md:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 sm:gap-1.5 md:gap-2 transition-opacity duration-300"
          style={{ opacity: shouldShowIndicators ? 1 : 0 }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-0.5 sm:h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-3 sm:w-4 md:w-6'
                  : 'bg-white/50 hover:bg-white/75 w-0.5 sm:w-1 md:w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};