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
import { Upload, Eye, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
        });
      }
    } catch (error: any) {
      console.error('Error fetching popup settings:', error);
      toast.error('Gagal memuat pengaturan popup');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    if (!popupSettings.title.trim()) {
      toast.error('Judul tidak boleh kosong');
      return;
    }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pengaturan Popup Welcome</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="popup-enabled" className="text-sm font-normal">
                  {popupSettings.is_enabled ? 'Aktif' : 'Nonaktif'}
                </Label>
                <Switch
                  id="popup-enabled"
                  checked={popupSettings.is_enabled}
                  onCheckedChange={(checked) =>
                    setPopupSettings({ ...popupSettings, is_enabled: checked })
                  }
                />
              </div>
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="popup-image">Gambar Popup</Label>
            <div className="flex items-center gap-4">
              <Input
                id="popup-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            {popupSettings.image_url && (
              <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                <img
                  src={popupSettings.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="popup-title">Judul *</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="show_title" className="text-xs font-normal text-muted-foreground">Tampilkan</Label>
                <Switch
                  id="show_title"
                  checked={popupSettings.show_title}
                  onCheckedChange={(checked) =>
                    setPopupSettings({ ...popupSettings, show_title: checked })
                  }
                />
              </div>
            </div>
            {popupSettings.show_title && (
              <Input
                id="popup-title"
                value={popupSettings.title}
                onChange={(e) =>
                  setPopupSettings({ ...popupSettings, title: e.target.value })
                }
                placeholder="Selamat Datang di UKKPK!"
              />
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="popup-content">Konten</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="show_content" className="text-xs font-normal text-muted-foreground">Tampilkan</Label>
                <Switch
                  id="show_content"
                  checked={popupSettings.show_content}
                  onCheckedChange={(checked) =>
                    setPopupSettings({ ...popupSettings, show_content: checked })
                  }
                />
              </div>
            </div>
            {popupSettings.show_content && (
              <Textarea
                id="popup-content"
                value={popupSettings.content || ''}
                onChange={(e) =>
                  setPopupSettings({ ...popupSettings, content: e.target.value })
                }
                placeholder="Deskripsi atau pesan sambutan..."
                rows={4}
              />
            )}
          </div>

          {/* Button Settings */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="show_button" className="text-base font-medium">Tombol Aksi</Label>
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
