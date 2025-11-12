import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";

interface ProfileSettings {
  id: string;
  banner_url: string | null;
  description: string | null;
  organization_image_url: string | null;
}

interface SlideshowImage {
  id: string;
  image_url: string;
  order_index: number | null;
}

interface StrukturOrganisasi {
  id: string;
  angkatan: string;
  foto_url: string;
  created_at: string;
}

export const ProfileManager = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="profile">Profil UKKPK</TabsTrigger>
        <TabsTrigger value="slideshow">Slideshow Home</TabsTrigger>
        <TabsTrigger value="structure">Struktur Organisasi</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileSettingsSection />
      </TabsContent>

      <TabsContent value="slideshow">
        <SlideshowSection />
      </TabsContent>

      <TabsContent value="structure">
        <StructureSection />
      </TabsContent>
    </Tabs>
  );
};

// Profile Settings Section
const ProfileSettingsSection = () => {
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [formData, setFormData] = useState({
    banner_url: "",
    description: "",
    organization_image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [orgImageFile, setOrgImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profile_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        banner_url: data.banner_url || "",
        description: data.description || "",
        organization_image_url: data.organization_image_url || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let bannerUrl = formData.banner_url;
      let organizationImageUrl = formData.organization_image_url;

      // Upload banner image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `profile/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        bannerUrl = publicUrl;
      }

      // Upload organization image if new file selected
      if (orgImageFile) {
        const fileExt = orgImageFile.name.split('.').pop();
        const fileName = `org_${Math.random()}.${fileExt}`;
        const filePath = `profile/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, orgImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        organizationImageUrl = publicUrl;
      }

      const dataToSave = { 
        ...formData, 
        banner_url: bannerUrl,
        organization_image_url: organizationImageUrl
      };

      if (profile) {
        const { error } = await supabase
          .from("profile_settings")
          .update(dataToSave)
          .eq("id", profile.id);

        if (error) throw error;
        toast.success("Profil berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("profile_settings")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Profil berhasil dibuat");
      }

      setImageFile(null);
      setOrgImageFile(null);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Profil UKKPK</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            id="banner-upload"
            label="Banner Profil"
            currentImageUrl={formData.banner_url}
            onFileSelect={(file) => setImageFile(file)}
            onRemove={() => setFormData({ ...formData, banner_url: "" })}
            disabled={uploading}
          />

          <ImageUpload
            id="organization-upload"
            label="Foto Struktur Organisasi"
            currentImageUrl={formData.organization_image_url}
            onFileSelect={(file) => setOrgImageFile(file)}
            onRemove={() => setFormData({ ...formData, organization_image_url: "" })}
            disabled={uploading}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi UKKPK</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi tentang UKKPK"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Simpan Perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Slideshow Section
const SlideshowSection = () => {
  const [images, setImages] = useState<SlideshowImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase
      .from('home_slideshow')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) setImages(data);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error('Pilih gambar terlebih dahulu');
      return;
    }

    if (images.length >= 10) {
      toast.error('Maksimal 10 foto di slideshow');
      return;
    }

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `slideshow/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const nextOrder = images.length > 0 
        ? Math.max(...images.map(img => img.order_index || 0)) + 1 
        : 0;

      const { error: insertError } = await supabase
        .from('home_slideshow')
        .insert([{ image_url: publicUrl, order_index: nextOrder }]);

      if (insertError) throw insertError;

      toast.success('Foto berhasil ditambahkan');
      setImageFile(null);
      fetchImages();
    } catch (error) {
      toast.error('Gagal upload foto');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Hapus foto ini dari slideshow?')) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('home_slideshow')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete from storage
      const path = imageUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('uploads').remove([path]);

      toast.success('Foto berhasil dihapus');
      fetchImages();
    } catch (error) {
      toast.error('Gagal menghapus foto');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Slideshow Home</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <ImageUpload
            id="slideshow-upload"
            label={`Upload Foto Slideshow (${images.length}/10)`}
            onFileSelect={(file) => setImageFile(file)}
            disabled={uploading || images.length >= 10}
          />
          <Button 
            onClick={handleUpload} 
            disabled={uploading || !imageFile || images.length >= 10}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Tambah Foto ke Slideshow'}
          </Button>
        </div>

        {/* Images Grid */}
        <div className="space-y-2">
          <Label>Foto di Slideshow</Label>
          {images.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Belum ada foto. Upload foto pertama untuk memulai slideshow.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt="Slideshow"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image.id, image.image_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    #{(image.order_index || 0) + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Structure Section
const StructureSection = () => {
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
