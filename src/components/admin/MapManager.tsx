import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const MapManager = () => {
  const [formData, setFormData] = useState({
    location_name: "Lokasi UKKPK",
    embed_url: "",
    latitude: "",
    longitude: "",
  });
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMapSettings();
  }, []);

  const fetchMapSettings = async () => {
    const { data, error } = await supabase
      .from("map_settings")
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Error fetching map settings:", error);
      return;
    }

    if (data) {
      setExistingId(data.id);
      setFormData({
        location_name: data.location_name || "Lokasi UKKPK",
        embed_url: data.embed_url || "",
        latitude: data.latitude?.toString() || "",
        longitude: data.longitude?.toString() || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave = {
      location_name: formData.location_name,
      embed_url: formData.embed_url || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    if (existingId) {
      const { error } = await supabase
        .from("map_settings")
        .update(dataToSave)
        .eq("id", existingId);

      if (error) {
        toast.error("Gagal memperbarui pengaturan map");
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("map_settings")
        .insert([dataToSave])
        .select()
        .single();

      if (error) {
        toast.error("Gagal menyimpan pengaturan map");
        return;
      }

      setExistingId(data.id);
    }

    toast.success("Pengaturan map berhasil disimpan");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Lokasi Map</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Lokasi</Label>
            <Input
              placeholder="Lokasi UKKPK"
              value={formData.location_name}
              onChange={(e) =>
                setFormData({ ...formData, location_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={formData.embed_url}
              onChange={(e) =>
                setFormData({ ...formData, embed_url: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Buka Google Maps → Pilih lokasi → Share → Embed a map → Copy HTML (ambil URL dari src)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitude (opsional)</Label>
              <Input
                type="number"
                step="any"
                placeholder="-0.9139"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude (opsional)</Label>
              <Input
                type="number"
                step="any"
                placeholder="100.3571"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Simpan Pengaturan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
