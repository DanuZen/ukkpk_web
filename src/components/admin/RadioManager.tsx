import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface RadioProgram {
  id: string;
  name: string;
  description: string;
  air_time: string;
  day_of_week: number;
  host: string;
  created_at: string;
}

interface RadioSettings {
  id: string;
  streaming_url: string;
  banner_image_url?: string;
}

const DAYS = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];

export const RadioManager = () => {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [settings, setSettings] = useState<RadioSettings | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    air_time: "",
    day_of_week: 0,
    host: "",
  });

  useEffect(() => {
    fetchPrograms();
    fetchSettings();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("radio_programs")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("air_time", { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Gagal memuat program radio");
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("radio_settings")
        .select("*")
        .single();

      if (error) throw error;
      setSettings(data);
      setStreamingUrl(data.streaming_url);
      setBannerImageUrl(data.banner_image_url || "");
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSubmitProgram = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.air_time || !formData.host) {
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("radio_programs")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Program berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("radio_programs")
          .insert([formData]);

        if (error) throw error;
        toast.success("Program berhasil ditambahkan");
      }

      setFormData({
        name: "",
        description: "",
        air_time: "",
        day_of_week: 0,
        host: "",
      });
      setEditingId(null);
      fetchPrograms();
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Gagal menyimpan program");
    }
  };

  const handleUpdateSettings = async () => {
    if (!streamingUrl) {
      toast.error("URL streaming tidak boleh kosong");
      return;
    }

    try {
      let uploadedImageUrl = bannerImageUrl;

      // Upload banner image if selected
      if (bannerImage) {
        const fileExt = bannerImage.name.split(".").pop();
        const fileName = `radio-banner-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("uploads")
          .upload(fileName, bannerImage);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("uploads")
          .getPublicUrl(fileName);
        
        uploadedImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("radio_settings")
        .update({ 
          streaming_url: streamingUrl,
          banner_image_url: uploadedImageUrl 
        })
        .eq("id", settings?.id);

      if (error) throw error;
      toast.success("Pengaturan berhasil diperbarui");
      setBannerImage(null);
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Gagal memperbarui pengaturan");
    }
  };

  const handleEdit = (program: RadioProgram) => {
    setEditingId(program.id);
    setFormData({
      name: program.name,
      description: program.description,
      air_time: program.air_time,
      day_of_week: program.day_of_week,
      host: program.host,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus program ini?")) return;

    try {
      const { error } = await supabase
        .from("radio_programs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Program berhasil dihapus");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Gagal menghapus program");
    }
  };

  return (
    <div className="space-y-8">
      {/* Streaming URL Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Radio Streaming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">URL Streaming</label>
            <div className="flex gap-2">
              <Input
                value={streamingUrl}
                onChange={(e) => setStreamingUrl(e.target.value)}
                placeholder="https://radio.ukkpk.id/stream"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              id="radio-banner"
              label="Banner Radio (Hero Image)"
              currentImageUrl={bannerImageUrl}
              onFileSelect={(file) => setBannerImage(file)}
              onRemove={() => {
                setBannerImage(null);
                setBannerImageUrl("");
              }}
            />
          </div>

          <Button onClick={handleUpdateSettings}>Simpan Pengaturan</Button>
        </CardContent>
      </Card>

      {/* Add/Edit Program Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Program" : "Tambah Program Radio"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProgram} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nama Program</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama program"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Deskripsi</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi program"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hari</label>
                <Select
                  value={formData.day_of_week.toString()}
                  onValueChange={(value) => setFormData({ ...formData, day_of_week: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Jam Tayang</label>
                <Input
                  type="time"
                  value={formData.air_time}
                  onChange={(e) => setFormData({ ...formData, air_time: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Host</label>
                <Input
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  placeholder="Nama host"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update Program" : "Tambah Program"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      air_time: "",
                      day_of_week: 0,
                      host: "",
                    });
                  }}
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Programs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Daftar Program Radio yang Terupload</h3>
          <Badge variant="secondary">{programs.length} Program</Badge>
        </div>
        
        {programs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🎙️</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Belum Ada Program Radio</h4>
                <p className="text-muted-foreground">
                  Mulai tambahkan program radio pertama Anda menggunakan form di atas
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => (
            <Card key={program.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{program.name}</h4>
                    <p className="text-muted-foreground mb-2">{program.description}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📅 {DAYS[program.day_of_week]}</p>
                      <p>🕐 {program.air_time}</p>
                      <p>🎙️ Host: {program.host}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(program)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(program.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
