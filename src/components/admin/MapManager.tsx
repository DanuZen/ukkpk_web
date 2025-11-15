import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MapSettings {
  id: string;
  location_name: string;
  embed_url: string;
  latitude: number | null;
  longitude: number | null;
}

export const MapManager = () => {
  const [settings, setSettings] = useState<MapSettings | null>(null);
  const [locationName, setLocationName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("map_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setSettings(data);
        setLocationName(data.location_name || "");
        setEmbedUrl(data.embed_url || "");
      }
    } catch (error) {
      console.error("Error fetching map settings:", error);
    }
  };

  const extractEmbedUrl = (input: string): string => {
    // If it's already an embed URL, return it
    if (input.includes("/embed?pb=")) {
      return input;
    }
    
    // Try to extract from iframe code
    const iframeMatch = input.match(/src="([^"]+)"/);
    if (iframeMatch) {
      return iframeMatch[1];
    }
    
    return input;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationName.trim()) {
      toast({
        title: "Error",
        description: "Nama lokasi harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (!embedUrl.trim()) {
      toast({
        title: "Error",
        description: "Google Maps embed URL harus diisi",
        variant: "destructive",
      });
      return;
    }

    // Clean and validate the embed URL
    const cleanEmbedUrl = extractEmbedUrl(embedUrl);
    
    // Validate it's actually an embed URL, not a share link
    if (cleanEmbedUrl.includes('maps.app.goo.gl') || !cleanEmbedUrl.includes('google.com/maps/embed')) {
      toast({
        title: "Error",
        description: "URL harus berupa embed URL dari Google Maps, bukan share link. Ikuti petunjuk untuk mendapatkan embed URL yang benar.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (settings?.id) {
        const { error } = await supabase
          .from("map_settings")
          .update({
            location_name: locationName,
            embed_url: cleanEmbedUrl,
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("map_settings")
          .insert({
            location_name: locationName,
            embed_url: cleanEmbedUrl,
          });

        if (error) throw error;
      }

      toast({
        title: "Berhasil",
        description: "Pengaturan peta berhasil disimpan",
      });

      fetchSettings();
    } catch (error) {
      console.error("Error saving map settings:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan peta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Lokasi & Peta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Nama Lokasi</Label>
              <Input
                id="location-name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Contoh: Sekretariat UKKPK UNP"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="embed-url">Google Maps Embed URL</Label>
              <textarea
                id="embed-url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder='Paste embed URL atau iframe code dari Google Maps'
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
              />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium">⚠️ PENTING: Gunakan EMBED URL, bukan share link!</p>
                <p>Cara mendapatkan embed URL yang benar:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Buka Google Maps di browser</li>
                  <li>Cari dan pilih lokasi yang diinginkan</li>
                  <li>Klik tombol "Share" (Bagikan)</li>
                  <li>Pilih tab <strong>"Embed a map"</strong></li>
                  <li>Copy kode HTML yang muncul</li>
                  <li>Paste di sini</li>
                </ol>
                <p className="text-destructive mt-2">❌ Jangan gunakan link seperti: maps.app.goo.gl/...</p>
                <p className="text-green-600">✅ URL harus berisi: google.com/maps/embed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maps-link">Link Google Maps (Opsional)</Label>
              <Input
                id="maps-link"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
              <p className="text-sm text-muted-foreground">
                Link untuk tombol "View maps"
              </p>
            </div>

            <Button type="submit" className="w-full">
              Simpan Pengaturan
            </Button>
          </form>
        </CardContent>
      </Card>

      {embedUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Peta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] rounded-lg overflow-hidden border">
              <iframe
                src={extractEmbedUrl(embedUrl)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
