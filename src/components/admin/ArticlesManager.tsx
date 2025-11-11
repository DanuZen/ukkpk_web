import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

export const ArticlesManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    editor: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat artikel");
      return;
    }
    setArticles(data || []);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

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
          .from("articles")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Artikel berhasil diupdate");
      } else {
        const { error } = await supabase.from("articles").insert([formData]);

        if (error) throw error;
        toast.success("Artikel berhasil ditambahkan");
      }

      setFormData({ title: "", content: "", category: "", author: "", editor: "", image_url: "" });
      setEditingId(null);
      setImageFile(null);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category || "",
      author: "",
      editor: "",
      image_url: article.image_url || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus artikel");
      return;
    }

    toast.success("Artikel berhasil dihapus");
    fetchArticles();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Artikel" : "Tambah Artikel Baru"}
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
                placeholder="Masukkan judul artikel"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Contoh: Teknologi, Olahraga, Pendidikan"
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
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Gambar</Label>
              <div className="flex gap-2">
                <Input
                  id="image-upload"
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
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder="Tulis isi artikel di sini..."
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
                    setFormData({
                      title: "",
                      content: "",
                      category: "",
                      author: "",
                      editor: "",
                      image_url: "",
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

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  {article.category && (
                    <p className="text-sm text-muted-foreground">
                      {article.category}
                    </p>
                  )}
                  <p className="mt-2 text-sm line-clamp-2">{article.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(article)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(article.id)}
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
