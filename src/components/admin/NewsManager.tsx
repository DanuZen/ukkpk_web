import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export const NewsManager = () => {
  const [news, setNews] = useState<News[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    editor: "",
    cameraman: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat berita");
      return;
    }
    setNews(data || []);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      toast.error("Gagal upload gambar");
      console.error(error);
    } finally {
      setUploading(false);
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image if selected
    if (imageFile) {
      await handleImageUpload(imageFile);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("news")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Berita berhasil diupdate");
      } else {
        const { error } = await supabase.from("news").insert([formData]);

        if (error) throw error;
        toast.success("Berita berhasil ditambahkan");
      }

      setFormData({ title: "", content: "", author: "", editor: "", cameraman: "", image_url: "" });
      setEditingId(null);
      setImageFile(null);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (item: News) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      author: "",
      editor: "",
      cameraman: "",
      image_url: item.image_url || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus berita");
      return;
    }

    toast.success("Berita berhasil dihapus");
    fetchNews();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Berita" : "Tambah Berita Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Masukkan judul berita"
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Penulis</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Nama penulis"
              />
            </div>
            <div>
              <Label htmlFor="editor">Penyunting</Label>
              <Input
                id="editor"
                value={formData.editor}
                onChange={(e) =>
                  setFormData({ ...formData, editor: e.target.value })
                }
                placeholder="Nama penyunting"
              />
            </div>
            <div>
              <Label htmlFor="cameraman">Kameramen</Label>
              <Input
                id="cameraman"
                value={formData.cameraman}
                onChange={(e) =>
                  setFormData({ ...formData, cameraman: e.target.value })
                }
                placeholder="Nama kameramen"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-image-upload">Upload Gambar</Label>
              <div className="flex gap-2">
                <Input
                  id="news-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
                {formData.image_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                  >
                    Hapus
                  </Button>
                )}
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
              )}
            </div>
            <div>
              <Label htmlFor="content">Konten</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Tulis isi berita di sini..."
                rows={6}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : editingId ? "Update" : "Tambah"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setImageFile(null);
                    setFormData({ title: "", content: "", author: "", editor: "", cameraman: "", image_url: "" });
                  }}
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm line-clamp-2">{item.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
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
