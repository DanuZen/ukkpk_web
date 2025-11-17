import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Settings as SettingsIcon } from "lucide-react";
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

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

export const RadioManager = () => {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [settings, setSettings] = useState<RadioSettings | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; time: string } | null>(null);
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
      setShowProgramDialog(false);
      setSelectedSlot(null);
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

      if (bannerImage) {
        const fileExt = bannerImage.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("uploads")
          .upload(fileName, bannerImage);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("uploads")
          .getPublicUrl(fileName);
        
        uploadedImageUrl = publicUrl;
      }

      if (settings) {
        const { error } = await supabase
          .from("radio_settings")
          .update({
            streaming_url: streamingUrl,
            banner_image_url: uploadedImageUrl,
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("radio_settings")
          .insert([{
            streaming_url: streamingUrl,
            banner_image_url: uploadedImageUrl,
          }]);

        if (error) throw error;
      }

      toast.success("Pengaturan berhasil diperbarui");
      setShowSettingsDialog(false);
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
    setShowProgramDialog(true);
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

  const handleSlotClick = (day: number, time: string) => {
    setSelectedSlot({ day, time });
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      air_time: time,
      day_of_week: day,
      host: "",
    });
    setShowProgramDialog(true);
  };

  const getProgramsForSlot = (day: number, hour: string) => {
    return programs.filter(
      (p) => p.day_of_week === day && p.air_time.startsWith(hour)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Jadwal Program Radio</h2>
          <p className="text-gray-600">Kelola jadwal program radio mingguan</p>
        </div>
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Pengaturan Radio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pengaturan Radio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL Streaming</label>
                <Input
                  value={streamingUrl}
                  onChange={(e) => setStreamingUrl(e.target.value)}
                  placeholder="https://streaming-url.com"
                />
              </div>
              <div>
                <ImageUpload
                  id="banner-image"
                  label="Banner Image"
                  currentImageUrl={bannerImageUrl}
                  onFileSelect={setBannerImage}
                />
              </div>
              <Button onClick={handleUpdateSettings} className="w-full">
                Simpan Pengaturan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header with Days */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-2 text-center font-semibold text-gray-500 text-sm">
                  Waktu
                </div>
                {DAYS.map((day, index) => (
                  <div
                    key={index}
                    className="p-2 text-center font-semibold bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-1">
                {TIME_SLOTS.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-1">
                    <div className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded-lg flex items-center justify-center">
                      {time}
                    </div>
                    {DAYS.map((_, dayIndex) => {
                      const programsInSlot = getProgramsForSlot(dayIndex, time.split(":")[0]);
                      const isEmpty = programsInSlot.length === 0;

                      return (
                        <div
                          key={`${dayIndex}-${time}`}
                          className={`min-h-[80px] p-2 rounded-lg border-2 transition-all ${
                            isEmpty
                              ? "border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                              : "border-primary/20 bg-primary/5"
                          }`}
                          onClick={() => isEmpty && handleSlotClick(dayIndex, time)}
                        >
                          {isEmpty ? (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <Plus className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {programsInSlot.map((program) => (
                                <div
                                  key={program.id}
                                  className="bg-white rounded p-2 shadow-sm border border-primary/20 group relative"
                                >
                                  <div className="text-xs font-semibold text-gray-900 truncate">
                                    {program.name}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate">
                                    {program.air_time}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    Host: {program.host}
                                  </div>
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(program);
                                      }}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(program.id);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Dialog */}
      <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Program" : "Tambah Program Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitProgram} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Program</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Morning Show"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deskripsi</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi program"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hari</label>
                <Select
                  value={formData.day_of_week.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, day_of_week: parseInt(value) })
                  }
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
                <label className="block text-sm font-medium mb-2">Waktu Tayang</label>
                <Input
                  type="time"
                  value={formData.air_time}
                  onChange={(e) => setFormData({ ...formData, air_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Host/Penyiar</label>
              <Input
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="Nama penyiar"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Program" : "Tambah Program"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowProgramDialog(false);
                  setEditingId(null);
                  setSelectedSlot(null);
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
