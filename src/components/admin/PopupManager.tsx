import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { Eye, Save, Loader2, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DashboardPageHeader } from '@/components/admin/DashboardPageHeader';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface PopupSettings {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  button_text: string;
  button_link: string | null;
  is_enabled: boolean;
  show_button: boolean;
  button_type: 'link' | 'form';
  show_title: boolean;
  show_content: boolean;
  show_image: boolean;
}

export const PopupManager = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [popupSettings, setPopupSettings] = useState<PopupSettings>({
    id: '',
    title: '',
    content: '',
    image_url: '',
    button_text: 'Tutup',
    button_link: '',
    is_enabled: false,
    show_button: true,
    button_type: 'link',
    show_title: true,
    show_content: true,
    show_image: true,
  });

  useEffect(() => {
    fetchPopupSettings();
  }, []);

  const fetchPopupSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('popup_settings' as any)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const fetchedData = data as any;
        setPopupSettings({
          ...popupSettings, // Keep defaults
          ...fetchedData,
          // Ensure new fields have defaults if missing/null
          show_button: fetchedData.show_button ?? true,
          button_type: fetchedData.button_type ?? 'link',
          show_title: fetchedData.show_title ?? true,
          show_content: fetchedData.show_content ?? true,
          show_image: fetchedData.show_image ?? true,
        });
      }
    } catch (error: any) {
      console.error('Error fetching popup settings:', error);
      toast.error('Gagal memuat pengaturan popup');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `popup-${Date.now()}.${fileExt}`;
      const filePath = `popup/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setPopupSettings({ ...popupSettings, image_url: publicUrl });
      toast.success('Gambar berhasil diupload');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Gagal mengupload gambar');
    } finally {
      setUploading(false);
    }
  };



  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('popup_settings' as any)
        .update({
          title: popupSettings.title,
          content: popupSettings.content,
          image_url: popupSettings.image_url,
          button_text: popupSettings.button_text,
          button_link: popupSettings.button_link,
          is_enabled: popupSettings.is_enabled,
          show_button: popupSettings.show_button,
          button_type: popupSettings.button_type,
          show_title: popupSettings.show_title,
          show_content: popupSettings.show_content,
          show_image: popupSettings.show_image,
        })
        .eq('id', popupSettings.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Gagal menyimpan. Pastikan Anda memiliki akses admin.');
      }

      toast.success('Pengaturan popup berhasil disimpan');
    } catch (error: any) {
      console.error('Error saving popup settings:', error);
      toast.error(`Gagal menyimpan: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!popupSettings.image_url) return;
    
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) return;

    setUploading(true);
    try {
      // Extract filename from URL
      const urlParts = popupSettings.image_url.split('/');
      const filename = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('uploads')
        .remove([filename]);

      if (deleteError) {
        console.error('Error deleting from storage:', deleteError);
        // Continue anyway to update database
      }

      // Update database
      setPopupSettings({ ...popupSettings, image_url: null });
      toast.success('Gambar berhasil dihapus');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error('Gagal menghapus gambar');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Outside Card */}
      <DashboardPageHeader 
        title="Pengaturan Popup Welcome" 
        subtitle="Kelola popup informasi yang muncul saat pengunjung membuka website" 
        icon={Image} 
      />

      <Card className="shadow-xl">
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <CardTitle className="text-sm sm:text-lg md:text-xl font-semibold">Form Pengaturan</CardTitle>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg border flex-1 sm:flex-none justify-center sm:justify-start">
                <Label htmlFor="popup-enabled" className="text-xs sm:text-sm font-medium cursor-pointer">
                  {popupSettings.is_enabled ? 'Popup Aktif' : 'Popup Nonaktif'}
                </Label>
                <Switch
                  id="popup-enabled"
                  checked={popupSettings.is_enabled}
                  onCheckedChange={(checked) =>
                    setPopupSettings({ ...popupSettings, is_enabled: checked })
                  }
                  className="scale-75 sm:scale-100"
                />
              </div>
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-4"
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Preview
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="popup-image">Gambar Popup</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="show_image" className="text-xs font-normal text-muted-foreground">Tampilkan</Label>
                <Switch
                  id="show_image"
                  checked={popupSettings.show_image}
                  onCheckedChange={(checked) =>
                    setPopupSettings({ ...popupSettings, show_image: checked })
                  }
                />
              </div>
            </div>
            <ImageUpload 
              id="popup-image" 
              label="" 
              currentImageUrl={popupSettings.image_url || undefined} 
              onFileSelect={(file) => uploadImage(file)} 
              onRemove={handleDeleteImage} 
              disabled={uploading} 
            />
          </div>

          {/* Button Settings */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show_button" className="text-base font-medium">Tombol Aksi</Label>
                <p className="text-[10px] text-muted-foreground">Tombol akan tetap muncul di pojok kanan bawah meskipun popup dimatikan</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="show_button" className="text-xs font-normal text-muted-foreground">Tampilkan</Label>
                <Switch
                  id="show_button"
                  checked={popupSettings.show_button}
                  onCheckedChange={(checked) =>
                    setPopupSettings({ ...popupSettings, show_button: checked })
                  }
                />
              </div>
            </div>

            {popupSettings.show_button && (
              <div className="space-y-4 p-4 rounded-lg bg-gray-50 border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="popup-button-text">Teks Tombol</Label>
                    <Input
                      id="popup-button-text"
                      value={popupSettings.button_text}
                      onChange={(e) =>
                        setPopupSettings({ ...popupSettings, button_text: e.target.value })
                      }
                      placeholder="Contoh: Mulai Jelajahi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="popup-button-link">Link Tombol (Opsional)</Label>
                    <Input
                      id="popup-button-link"
                      value={popupSettings.button_link || ''}
                      onChange={(e) =>
                        setPopupSettings({ ...popupSettings, button_link: e.target.value })
                      }
                      placeholder="Contoh: /profil-ukkpk atau https://google.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Kosongkan jika tombol hanya untuk menutup popup
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 gap-0">
          {popupSettings.image_url && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
              <img
                src={popupSettings.image_url}
                alt={popupSettings.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <DialogHeader className="space-y-3 text-center">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                {popupSettings.title}
              </DialogTitle>
              {popupSettings.content && (
                <DialogDescription className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {popupSettings.content}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="mt-6 flex justify-center">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                {popupSettings.button_text}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
