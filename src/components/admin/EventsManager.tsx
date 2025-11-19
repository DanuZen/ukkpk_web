import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().trim().min(1, "Nama event harus diisi").max(200, "Nama event maksimal 200 karakter"),
  description: z.string().trim().min(1, "Deskripsi harus diisi").max(2000, "Deskripsi maksimal 2000 karakter"),
  event_date: z.string().min(1, "Tanggal event harus diisi"),
  event_time: z.string().min(1, "Waktu event harus diisi"),
  location: z.string().trim().min(1, "Lokasi harus diisi").max(200, "Lokasi maksimal 200 karakter"),
});

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  created_at: string;
}

export const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Gagal memuat event");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      eventSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    try {
      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        event_date: formData.event_date,
        event_time: formData.event_time,
        location: formData.location.trim(),
      };
      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Event berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("events")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Event berhasil ditambahkan");
      }

      setFormData({
        name: "",
        description: "",
        event_date: "",
        event_time: "",
        location: "",
      });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Gagal menyimpan event");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      name: event.name,
      description: event.description,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus event ini?")) return;

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Event berhasil dihapus");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Gagal menghapus event");
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-8">
      <Card>
        <CardHeader className="p-2 sm:p-3 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-2xl">{editingId ? "Edit Event" : "Tambah Event Baru"}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2 md:space-y-4">
            <div className="space-y-0.5 sm:space-y-1">
              <label className="text-xs sm:text-sm font-medium block">Nama Event</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama event"
                maxLength={200}
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <label className="text-xs sm:text-sm font-medium block">Deskripsi</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi event"
                rows={3}
                maxLength={2000}
                className="text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4">
              <div className="space-y-0.5 sm:space-y-1">
                <label className="text-xs sm:text-sm font-medium block">Tanggal</label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <label className="text-xs sm:text-sm font-medium block">Waktu</label>
                <Input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <label className="text-xs sm:text-sm font-medium block">Lokasi</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Masukkan lokasi event"
                maxLength={200}
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="flex gap-1 sm:gap-2">
              <Button type="submit" className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm flex-1">
                {editingId ? "Update Event" : "Tambah Event"}
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
                      event_date: "",
                      event_time: "",
                      location: "",
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

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Daftar Event</h3>
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">{event.name}</h4>
                  <p className="text-muted-foreground mb-2">{event.description}</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📅 {new Date(event.event_date).toLocaleDateString("id-ID")}</p>
                    <p>🕐 {event.event_time}</p>
                    <p>📍 {event.location}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(event)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
