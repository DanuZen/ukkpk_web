import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";

const extractEmbedUrl = (input: string): string => {
  if (!input) return "";
  
  // If it's a full iframe tag, extract src
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  if (iframeMatch) {
    return iframeMatch[1];
  }
  
  // If it's already an embed URL, return it
  if (input.includes('google.com/maps/embed')) {
    return input;
  }
  
  // If it's a share link, return empty (can't convert automatically)
  if (input.includes('maps.app.goo.gl') || input.includes('goo.gl/maps')) {
    console.warn('Share links not supported. Please use embed URL from Google Maps.');
    return "";
  }
  
  return input;
};

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
          const cleanUrl = extractEmbedUrl(data.embed_url);
          setEmbedUrl(cleanUrl);
          setLocationName(data.location_name || "Lokasi UKKPK UNP");
        } else {
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
  );
};
