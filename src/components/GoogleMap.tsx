import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const GoogleMap = () => {
  const [embedUrl, setEmbedUrl] = useState("");
  const [locationName, setLocationName] = useState("Lokasi UKKPK UNP");
  const mapsLink = "https://maps.app.goo.gl/EdRi73gdkcyNDZy88";

  useEffect(() => {
    const fetchMapSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("map_settings")
          .select("*")
          .maybeSingle();

        if (error) throw error;
        
        if (data && data.embed_url) {
          // Check if it's already an embed URL or needs conversion
          let finalEmbedUrl = data.embed_url;
          
          // If it's a share link (maps.app.goo.gl), we can't directly convert it
          // Admin needs to provide proper embed URL from Google Maps
          if (data.embed_url.includes('maps.app.goo.gl') || 
              !data.embed_url.includes('google.com/maps/embed')) {
            console.warn('Invalid map URL format. Please set proper embed URL in admin panel.');
            finalEmbedUrl = "";
          }
          
          setEmbedUrl(finalEmbedUrl);
          setLocationName(data.location_name || "Lokasi UKKPK UNP");
        } else {
          // No data, use empty
          setEmbedUrl("");
          setLocationName("Lokasi UKKPK UNP");
        }
      } catch (error) {
        console.error("Error fetching map settings:", error);
        setEmbedUrl("");
      }
    };

    fetchMapSettings();
  }, []);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">{locationName}</h2>
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-md border border-border/50">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi Sekretariat UKKPK UNP"
        />
      </div>
      <div className="text-center mt-6">
        <a 
          href={mapsLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-md font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          View maps
        </a>
      </div>
    </div>
  );
};
