import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface StrukturOrganisasi {
  id: string;
  angkatan: string;
  foto_url: string;
  created_at: string;
}

export const OrganizationStructureManager = () => {
  const [structures, setStructures] = useState<StrukturOrganisasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [angkatan, setAngkatan] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("struktur_organisasi")
      .select("*")
      .order("angkatan", { ascending: true });

    if (error) {
      toast.error("Gagal memuat data struktur organisasi");
      console.error(error);
    } else {
      setStructures(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!angkatan.trim()) {
      toast.error("Mohon isi nama angkatan");
      return;
    }

    if (!editingId && !imageFile) {
      toast.error("Mohon upload foto struktur organisasi");
      return;
    }

    setUploading(true);

    try {
      let foto_url = imagePreview;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `struktur/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        foto_url = publicUrl;
      }

      const structureData = {
        angkatan: angkatan.trim(),
        foto_url,
      };

      if (editingId) {
        const { error } = await supabase
          .from("struktur_organisasi")
          .update(structureData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Struktur organisasi berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("struktur_organisasi")
          .insert([structureData]);

        if (error) throw error;
        toast.success("Struktur organisasi berhasil ditambahkan");
      }

      resetForm();
      fetchStructures();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan struktur organisasi");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (structure: StrukturOrganisasi) => {
    setEditingId(structure.id);
    setAngkatan(structure.angkatan);
    setImagePreview(structure.foto_url);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus struktur organisasi ini?")) {
      return;
    }

    const { error } = await supabase
      .from("struktur_organisasi")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus struktur organisasi");
      console.error(error);
    } else {
      toast.success("Struktur organisasi berhasil dihapus");
      fetchStructures();
    }
  };

  const resetForm = () => {
    setAngkatan("");
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Struktur Organisasi" : "Tambah Struktur Organisasi"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="angkatan">Nama Angkatan</Label>
              <Input
                id="angkatan"
                placeholder="Contoh: DPH Pengurus 2025"
                value={angkatan}
                onChange={(e) => setAngkatan(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <ImageUpload
                id="struktur-image"
                label="Foto Struktur Organisasi"
                currentImageUrl={imagePreview}
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveImage}
                disabled={uploading}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>
                <Plus className="mr-2 h-4 w-4" />
                {uploading ? "Menyimpan..." : editingId ? "Perbarui" : "Tambah"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Struktur Organisasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Memuat...</p>
          ) : structures.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Belum ada struktur organisasi
            </p>
          ) : (
            <div className="space-y-4">
              {structures.map((structure) => (
                <div
                  key={structure.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <img
                    src={structure.foto_url}
                    alt={structure.angkatan}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{structure.angkatan}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(structure.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(structure)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(structure.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
