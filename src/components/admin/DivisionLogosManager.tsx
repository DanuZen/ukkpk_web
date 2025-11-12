import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DivisionLogo {
  id: string;
  division_name: string;
  logo_url: string;
  order_index: number | null;
}

export const DivisionLogosManager = () => {
  const [logos, setLogos] = useState<DivisionLogo[]>([]);
  const [formData, setFormData] = useState({
    division_name: "",
    logo_url: "",
    order_index: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    const { data, error } = await supabase
      .from("division_logos")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Gagal memuat data");
      return;
    }

    setLogos(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.division_name) {
      toast.error("Nama divisi harus diisi");
      return;
    }

    if (!editingId && !imageFile && !formData.logo_url) {
      toast.error("Logo harus diupload");
      return;
    }

    setUploading(true);

    try {
      let logoUrl = formData.logo_url;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `division-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const dataToSave = { ...formData, logo_url: logoUrl };

      if (editingId) {
        const { error } = await supabase
          .from("division_logos")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Logo berhasil diperbarui");
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from("division_logos")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Logo berhasil ditambahkan");
      }

      setFormData({ division_name: "", logo_url: "", order_index: 0 });
      setImageFile(null);
      fetchLogos();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (logo: DivisionLogo) => {
    setFormData({
      division_name: logo.division_name,
      logo_url: logo.logo_url,
      order_index: logo.order_index || 0,
    });
    setEditingId(logo.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus logo ini?")) return;

    const { error } = await supabase
      .from("division_logos")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus logo");
      return;
    }

    toast.success("Logo berhasil dihapus");
    fetchLogos();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Logo Bidang & MICU</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Divisi</Label>
            <Input
              placeholder="Contoh: Jurnalistik, Penyiaran, Kreatif Media, MICU"
              value={formData.division_name}
              onChange={(e) =>
                setFormData({ ...formData, division_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <ImageUpload
              id="logo-upload"
              label="Logo"
              currentImageUrl={formData.logo_url}
              onFileSelect={(file) => setImageFile(file)}
              onRemove={() => setFormData({ ...formData, logo_url: "" })}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label>Urutan Tampilan</Label>
            <Input
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {uploading ? "Mengupload..." : editingId ? "Update Logo" : "Tambah Logo"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setImageFile(null);
                  setFormData({ division_name: "", logo_url: "", order_index: 0 });
                }}
              >
                Batal
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          <h3 className="font-semibold">Logo yang Ada</h3>
          {logos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada logo</p>
          ) : (
            <div className="grid gap-3">
              {logos.map((logo) => (
                <Card key={logo.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={logo.logo_url}
                        alt={logo.division_name}
                        className="w-16 h-16 object-contain rounded-lg border border-border"
                      />
                      <div>
                        <p className="font-medium">{logo.division_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Urutan: {logo.order_index}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(logo)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(logo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
