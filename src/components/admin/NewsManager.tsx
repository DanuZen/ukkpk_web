import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, Edit3, Plus, X } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { z } from "zod";

const newsSchema = z.object({
  title: z.string().trim().min(1, "Judul harus diisi").max(200, "Judul maksimal 200 karakter"),
  content: z.string().trim().min(1, "Konten harus diisi").max(50000, "Konten maksimal 50000 karakter"),
  author: z.string().trim().max(100, "Nama author maksimal 100 karakter").optional(),
  editor: z.string().trim().max(100, "Nama editor maksimal 100 karakter").optional(),
  cameraman: z.string().trim().max(100, "Nama cameraman maksimal 100 karakter").optional(),
});

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  cameraman: string[] | null;
  category: string | null;
}

export const NewsManager = () => {
  const [news, setNews] = useState<News[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    editor: "",
    category: "",
    image_url: "",
    publish_date: "",
    publish_time: "",
  });
  const [cameramen, setCameramen] = useState<string[]>([]);
  const [currentCameraman, setCurrentCameraman] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      newsSchema.parse({
        title: formData.title,
        content: formData.content,
        author: formData.author || undefined,
        editor: formData.editor || undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Prepare published_at timestamp
      let publishedAt = new Date().toISOString();
      if (formData.publish_date && formData.publish_time) {
        publishedAt = new Date(`${formData.publish_date}T${formData.publish_time}`).toISOString();
      } else if (formData.publish_date) {
        publishedAt = new Date(formData.publish_date).toISOString();
      }

      const dataToSave = { 
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || null,
        editor: formData.editor.trim() || null,
        category: formData.category.trim() || null,
        cameraman: cameramen.length > 0 ? cameramen : null,
        image_url: imageUrl,
        published_at: publishedAt
      };

      if (editingId) {
        const { error } = await supabase
          .from("news")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Berita berhasil diupdate");
      } else {
        const { error } = await supabase.from("news").insert([dataToSave]);

        if (error) throw error;
        toast.success("Berita berhasil ditambahkan");
      }

      setFormData({ title: "", content: "", author: "", editor: "", category: "", image_url: "", publish_date: "", publish_time: "" });
      setCameramen([]);
      setCurrentCameraman("");
      setEditingId(null);
      setImageFile(null);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      author: item.author || "",
      editor: item.editor || "",
      category: item.category || "",
      image_url: item.image_url || "",
      publish_date: "",
      publish_time: "",
    });
    setCameramen(Array.isArray(item.cameraman) ? item.cameraman : []);
  };

  const handleAddCameraman = () => {
    if (currentCameraman.trim()) {
      setCameramen([...cameramen, currentCameraman.trim()]);
      setCurrentCameraman("");
    }
  };

  const handleRemoveCameraman = (index: number) => {
    setCameramen(cameramen.filter((_, i) => i !== index));
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
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori berita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kampus">Kampus</SelectItem>
                  <SelectItem value="organisasi">Organisasi</SelectItem>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cameraman">Kameramen</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="cameraman"
                    value={currentCameraman}
                    onChange={(e) => setCurrentCameraman(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCameraman())}
                    placeholder="Nama kameramen"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCameraman}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {cameramen.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cameramen.map((name, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {name}
                        <button
                          type="button"
                          onClick={() => handleRemoveCameraman(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publish_date">Tanggal Publikasi</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="publish_time">Waktu Publikasi</Label>
                <Input
                  id="publish_time"
                  type="time"
                  value={formData.publish_time}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_time: e.target.value })
                  }
                />
              </div>
            </div>
            <ImageUpload
              id="news-image-upload"
              label="Upload Gambar"
              currentImageUrl={formData.image_url}
              onFileSelect={(file) => setImageFile(file)}
              onRemove={() => setFormData({ ...formData, image_url: "" })}
              disabled={uploading}
            />
            <div>
              <Label htmlFor="content">Konten</Label>
              <Tabs defaultValue="edit" className="w-full mt-2">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                    placeholder="Tulis isi berita di sini..."
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      {/* Preview Header */}
                      <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-4 text-primary">
                          {formData.title || "Judul Berita"}
                        </h1>
                        
                        {formData.image_url && (
                          <div className="mb-4">
                            <img 
                              src={formData.image_url} 
                              alt={formData.title} 
                              className="w-full h-[400px] object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-6 pb-4 border-b">
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <span>{new Date().toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.author && <span>Penulis: {formData.author}</span>}
                              {formData.editor && <span>• Penyunting: {formData.editor}</span>}
                              {cameramen.length > 0 && <span>• Kameramen: {cameramen.join(", ")}</span>}
                            </div>
                            {formData.category && (
                              <Badge variant="outline" className="mt-2">
                                {formData.category}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            BERITA
                          </Badge>
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="prose prose-lg max-w-none">
                        {formData.content ? (
                          <div 
                            className="text-foreground/90 leading-relaxed article-content"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData.content) }}
                          />
                        ) : (
                          <p className="text-muted-foreground italic">
                            Konten berita akan ditampilkan di sini...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                    setCameramen([]);
                    setCurrentCameraman("");
                    setFormData({ title: "", content: "", author: "", editor: "", category: "", image_url: "", publish_date: "", publish_time: "" });
                  }}
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Daftar Berita yang Terupload</h3>
          <Badge variant="secondary">{news.length} Berita</Badge>
        </div>
        
        {news.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Pencil className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Belum Ada Berita</h4>
                <p className="text-muted-foreground">
                  Mulai tambahkan berita pertama Anda menggunakan form di atas
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          news.map((item) => (
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
          ))
        )}
      </div>
    </div>
  );
};
