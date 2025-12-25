import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Image as ImageIcon, Users, Settings } from "lucide-react";
import { DashboardPageHeader } from "@/components/admin/DashboardPageHeader";

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
interface ProfileManagerProps {
  activeTab?: "slideshow" | "structure" | "banner";
}
export const ProfileManager = ({
  activeTab = "slideshow"
}: ProfileManagerProps) => {
  return (
    <div className="space-y-4">
      {activeTab === "slideshow" && <SlideshowSection />}
      {activeTab === "banner" && <BannerSection />}
      {activeTab === "structure" && <StructureSection />}
    </div>
  );
};

// Banner Section
const BannerSection = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchBanner();
  }, []);
  const fetchBanner = async () => {
    setLoading(true);
    const {
      data
    } = await supabase.from('profile_settings').select('banner_url').maybeSingle();
    if (data) setBannerUrl(data.banner_url);
    setLoading(false);
  };
  const handleUpload = async () => {
    if (!imageFile) {
      toast.error('Pilih gambar terlebih dahulu');
      return;
    }
    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from('uploads').upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('uploads').getPublicUrl(filePath);

      // Check if profile settings exist
      const {
        data: existing
      } = await supabase.from('profile_settings').select('id').maybeSingle();
      if (existing) {
        const {
          error
        } = await supabase.from('profile_settings').update({
          banner_url: publicUrl
        }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from('profile_settings').insert([{
          banner_url: publicUrl
        }]);
        if (error) throw error;
      }
      toast.success('Banner berhasil diupload');
      setImageFile(null);
      fetchBanner();
    } catch (error) {
      toast.error('Gagal upload banner');
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm('Hapus banner Profil UKKPK?')) return;
    try {
      const {
        data: existing
      } = await supabase.from('profile_settings').select('id').maybeSingle();
      if (existing) {
        const {
          error
        } = await supabase.from('profile_settings').update({
          banner_url: null
        }).eq('id', existing.id);
        if (error) throw error;
      }
      if (bannerUrl) {
        const path = bannerUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('uploads').remove([path]);
      }
      toast.success('Banner berhasil dihapus');
      fetchBanner();
    } catch (error) {
      toast.error('Gagal menghapus banner');
    }
  };
  return <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <DashboardPageHeader 
        title="Banner Profil UKKPK" 
        subtitle="Upload dan kelola banner untuk halaman Profil UKKPK" 
        icon={ImageIcon} 
        className="mb-0" 
      />
      <Card className="shadow-xl">
        <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 md:p-6 md:pb-4">
          <CardTitle className="text-base sm:text-lg md:text-xl">Form Upload Banner</CardTitle>
        </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
        <p className="text-sm text-muted-foreground">
          Upload banner yang akan ditampilkan di halaman Profil UKKPK. Rekomendasi ukuran: 1920x1080px atau rasio 16:9.
        </p>

        {/* Current Banner Preview */}
        {loading ? <div className="w-full h-64 bg-muted animate-pulse rounded-lg" /> : bannerUrl ? <div className="relative group">
            <img src={bannerUrl} alt="Banner Profil UKKPK" className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div> : <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <p className="text-muted-foreground">Belum ada banner. Upload banner pertama.</p>
          </div>}

        {/* Upload Section */}
        <div className="space-y-4">
          <ImageUpload id="banner-upload" label="Upload Banner Baru" onFileSelect={file => setImageFile(file)} disabled={uploading} />
          <Button onClick={handleUpload} disabled={uploading || !imageFile} className="w-full">
            {uploading ? 'Uploading...' : bannerUrl ? 'Ganti Banner' : 'Upload Banner'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>;
};

// Slideshow Section
const SlideshowSection = () => {
  const [images, setImages] = useState<SlideshowImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000);
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    fetchImages();
    fetchSettings();
  }, []);
  const fetchImages = async () => {
    const {
      data
    } = await supabase.from('home_slideshow').select('*').order('order_index', {
      ascending: true
    });
    if (data) setImages(data);
  };
  const fetchSettings = async () => {
    const {
      data
    } = await supabase.from('slideshow_settings').select('auto_play_speed').maybeSingle();
    if (data) setAutoPlaySpeed(data.auto_play_speed);
  };
  const handleUpdateSpeed = async () => {
    if (autoPlaySpeed < 1000 || autoPlaySpeed > 30000) {
      toast.error('Kecepatan harus antara 1000ms (1 detik) hingga 30000ms (30 detik)');
      return;
    }
    setUpdating(true);
    try {
      const {
        data: existing
      } = await supabase.from('slideshow_settings').select('id').maybeSingle();
      if (existing) {
        const {
          error
        } = await supabase.from('slideshow_settings').update({
          auto_play_speed: autoPlaySpeed
        }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from('slideshow_settings').insert([{
          auto_play_speed: autoPlaySpeed
        }]);
        if (error) throw error;
      }
      toast.success('Kecepatan slideshow berhasil diubah');
    } catch (error) {
      toast.error('Gagal mengubah kecepatan slideshow');
    } finally {
      setUpdating(false);
    }
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
      const {
        error: uploadError
      } = await supabase.storage.from('uploads').upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('uploads').getPublicUrl(filePath);
      const nextOrder = images.length > 0 ? Math.max(...images.map(img => img.order_index || 0)) + 1 : 0;
      const {
        error: insertError
      } = await supabase.from('home_slideshow').insert([{
        image_url: publicUrl,
        order_index: nextOrder
      }]);
      if (insertError) throw insertError;
      toast.success('Foto berhasil ditambahkan');
      setImageFile(null);
      fetchImages();
    } catch (error) {
      toast.error('Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Hapus foto ini dari slideshow?')) return;
    try {
      // Delete from database
      const {
        error
      } = await supabase.from('home_slideshow').delete().eq('id', id);
      if (error) throw error;

      // Delete from storage
      const path = imageUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('uploads').remove([path]);
      toast.success('Foto berhasil dihapus');
      fetchImages();
    } catch (error) {
      toast.error('Gagal menghapus foto');
    }
  };
  return <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <DashboardPageHeader 
        title="Kelola Slideshow Home" 
        subtitle="Upload dan atur kecepatan slideshow di halaman Home" 
        icon={Settings} 
        className="mb-0" 
      />
      <Card className="shadow-xl">
        <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 md:p-6 md:pb-4">
          <CardTitle className="text-base sm:text-lg md:text-xl">Form Slideshow</CardTitle>
        </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
        {/* Speed Control Section */}
        <div className="space-y-3 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border">
          <div className="space-y-2">
            <Label htmlFor="speed" className="text-sm sm:text-base">Kecepatan Auto-Rotation (milliseconds)</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Atur berapa lama setiap foto ditampilkan sebelum berganti otomatis (1000ms = 1 detik)
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input id="speed" type="number" min="1000" max="30000" step="500" value={autoPlaySpeed} onChange={e => setAutoPlaySpeed(Number(e.target.value))} className="w-full sm:max-w-xs" />
              <Button onClick={handleUpdateSpeed} disabled={updating} variant="outline" className="w-full sm:w-auto">
                {updating ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Rekomendasi: 3000-7000ms untuk pengalaman terbaik
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <ImageUpload id="slideshow-upload" label={`Upload Foto Slideshow (${images.length}/10)`} onFileSelect={file => setImageFile(file)} disabled={uploading || images.length >= 10} />
          <Button onClick={handleUpload} disabled={uploading || !imageFile || images.length >= 10} className="w-full">
            {uploading ? 'Uploading...' : 'Tambah Foto ke Slideshow'}
          </Button>
        </div>

        {/* Images Grid */}
        <div className="space-y-2">
          <Label>Foto di Slideshow</Label>
          {images.length === 0 ? <p className="text-muted-foreground text-center py-8">
              Belum ada foto. Upload foto pertama untuk memulai slideshow.
            </p> : <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map(image => <div key={image.id} className="relative group">
                  <img src={image.image_url} alt="Slideshow" className="w-full h-40 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(image.id, image.image_url)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    #{(image.order_index || 0) + 1}
                  </div>
                </div>)}
            </div>}
        </div>
      </CardContent>
    </Card>
    </div>;
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
    const {
      data,
      error
    } = await supabase.from("struktur_organisasi").select("*").order("angkatan", {
      ascending: true
    });
    if (error) {
      toast.error("Gagal memuat data struktur organisasi");
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
        const {
          error: uploadError
        } = await supabase.storage.from('uploads').upload(filePath, imageFile);
        if (uploadError) {
          throw uploadError;
        }
        const {
          data: {
            publicUrl
          }
        } = supabase.storage.from('uploads').getPublicUrl(filePath);
        foto_url = publicUrl;
      }
      const structureData = {
        angkatan: angkatan.trim(),
        foto_url
      };
      if (editingId) {
        const {
          error
        } = await supabase.from("struktur_organisasi").update(structureData).eq("id", editingId);
        if (error) throw error;
        toast.success("Struktur organisasi berhasil diperbarui");
      } else {
        const {
          error
        } = await supabase.from("struktur_organisasi").insert([structureData]);
        if (error) throw error;
        toast.success("Struktur organisasi berhasil ditambahkan");
      }
      resetForm();
      fetchStructures();
    } catch (error) {
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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus struktur organisasi ini?")) {
      return;
    }
    const {
      error
    } = await supabase.from("struktur_organisasi").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus struktur organisasi");
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
  return <div className="space-y-2 sm:space-y-3 md:space-y-6">
      <DashboardPageHeader 
        title={editingId ? "Edit Struktur" : "Struktur Organisasi"} 
        subtitle={editingId ? "Perbarui struktur organisasi yang ada" : "Tambah dan kelola struktur DPH pengurus per tahun"} 
        icon={Users} 
      />
      <Card className="shadow-xl">
        <CardHeader className="p-2 sm:p-3 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-xl">
            {editingId ? "Form Edit Struktur" : "Form Tambah Struktur"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="angkatan">Nama Angkatan</Label>
              <Input id="angkatan" placeholder="Contoh: DPH Pengurus 2025" value={angkatan} onChange={e => setAngkatan(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <ImageUpload id="struktur-image" label="Foto Struktur Organisasi" currentImageUrl={imagePreview} onFileSelect={handleFileSelect} onRemove={handleRemoveImage} disabled={uploading} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>
                <Plus className="mr-2 h-4 w-4" />
                {uploading ? "Menyimpan..." : editingId ? "Perbarui" : "Tambah"}
              </Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Daftar Struktur Organisasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground">Memuat...</p> : structures.length === 0 ? <p className="text-center text-muted-foreground">
              Belum ada struktur organisasi
            </p> : <div className="space-y-4">
              {structures.map(structure => <div key={structure.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img src={structure.foto_url} alt={structure.angkatan} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{structure.angkatan}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(structure.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(structure)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(structure.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>)}
            </div>}
        </CardContent>
      </Card>
    </div>;
};