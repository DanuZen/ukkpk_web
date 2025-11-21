import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  photo_url: string | null;
  rating: number;
  order_index: number | null;
  is_active: boolean;
}

export const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    photo_url: '',
    rating: 5,
    order_index: 0,
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat testimoni',
        variant: 'destructive',
      });
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        toast({
          title: 'Error',
          description: 'Gagal mengupload gambar',
          variant: 'destructive',
        });
        return;
      }

      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);

      setFormData({ ...formData, photo_url: urlData.publicUrl });
      toast({
        title: 'Berhasil',
        description: 'Gambar berhasil diupload',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, photo_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('testimonials')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Gagal mengupdate testimoni',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Berhasil',
          description: 'Testimoni berhasil diupdate',
        });
        resetForm();
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from('testimonials').insert([formData]);

      if (error) {
        toast({
          title: 'Error',
          description: 'Gagal menambahkan testimoni',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Berhasil',
          description: 'Testimoni berhasil ditambahkan',
        });
        resetForm();
        fetchTestimonials();
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      photo_url: testimonial.photo_url || '',
      rating: testimonial.rating,
      order_index: testimonial.order_index || 0,
      is_active: testimonial.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus testimoni',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Berhasil',
        description: 'Testimoni berhasil dihapus',
      });
      fetchTestimonials();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      content: '',
      photo_url: '',
      rating: 5,
      order_index: 0,
      is_active: true,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nama</Label>
              <Input
                placeholder="Nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Jabatan / Role</Label>
              <Input
                placeholder="Contoh: Mahasiswa, Alumni, dll"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Testimoni</Label>
            <Textarea
              placeholder="Tulis testimoni disini"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })
                }
                required
              />
            </div>
            <div>
              <Label>Urutan</Label>
              <Input
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is-active">Tampilkan</Label>
            </div>
          </div>

          <div>
            <ImageUpload
              id="testimonial-photo"
              label="Foto Profil"
              currentImageUrl={formData.photo_url}
              onFileSelect={handleImageUpload}
              onRemove={handleRemoveImage}
              disabled={uploading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update Testimoni' : 'Tambah Testimoni'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Daftar Testimoni</h2>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    {testimonial.photo_url && (
                      <img
                        src={testimonial.photo_url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Urutan: {testimonial.order_index || 0}</span>
                    <span>•</span>
                    <span className={testimonial.is_active ? 'text-green-600' : 'text-red-600'}>
                      {testimonial.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {testimonials.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Belum ada testimoni. Tambahkan testimoni pertama!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
