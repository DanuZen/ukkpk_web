import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideshowImage {
  id: string;
  image_url: string;
  order_index: number | null;
}

export const HomeSlideshow = () => {
  const [images, setImages] = useState<SlideshowImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase
      .from('home_slideshow')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data && data.length > 0) {
      setImages(data);
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
      <section className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Selamat Datang di UKKPK
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unit Kegiatan Komunikasi dan Penyiaran Kampus
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[600px] overflow-hidden group">
      {/* Slideshow Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.image_url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80"></div>
          </div>
        ))}
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Selamat Datang di UKKPK
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
