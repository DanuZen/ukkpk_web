import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, GripVertical } from 'lucide-react';

interface SlideshowImage {
  id: string;
  image_url: string;
  order_index: number | null;
}

export const HomeSlideshowManager = () => {
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
          <div className="space-y-2">
            <Label htmlFor="slideshow-upload">Upload Foto (Maks. 10)</Label>
            <div className="flex gap-2">
              <Input
                id="slideshow-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                disabled={uploading || images.length >= 10}
              />
              <Button 
                onClick={handleUpload} 
                disabled={uploading || !imageFile || images.length >= 10}
              >
                {uploading ? 'Uploading...' : 'Tambah Foto'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Jumlah foto saat ini: {images.length}/10
            </p>
          </div>
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
