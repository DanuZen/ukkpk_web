import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    fetchImages();
    fetchSettings();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="text-center z-10 px-4 sm:px-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl">
            Selamat Datang di UKKPK
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto px-4">
            Unit Kegiatan Komunikasi dan Penyiaran Kampus
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
