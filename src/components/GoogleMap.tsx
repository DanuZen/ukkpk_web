import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MapSettings {
  location_name: string;
  embed_url: string | null;
}

export const GoogleMap = () => {
  const [mapSettings, setMapSettings] = useState<MapSettings | null>(null);

  useEffect(() => {
    fetchMapSettings();
  }, []);

  const fetchMapSettings = async () => {
    const { data } = await supabase
      .from('map_settings')
      .select('location_name, embed_url')
      .maybeSingle();

    if (data) setMapSettings(data);
  };

  if (!mapSettings?.embed_url) return null;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{mapSettings.location_name}</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={mapSettings.embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
