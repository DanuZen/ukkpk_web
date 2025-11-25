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
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Eye, Edit3, FileText } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().trim().min(1, "Judul harus diisi").max(200, "Judul maksimal 200 karakter"),
  content: z.string().trim().min(1, "Konten harus diisi").max(50000, "Konten maksimal 50000 karakter"),
  category: z.string().trim().max(50, "Kategori maksimal 50 karakter").optional(),
  author: z.string().trim().max(100, "Nama author maksimal 100 karakter").optional(),
  editor: z.string().trim().max(100, "Nama editor maksimal 100 karakter").optional(),
});

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
  author: string | null;
  editor: string | null;
  published_at: string | null;
}

export const ArticlesManager = () => {
  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    editor: "",
    image_url: "",
    publish_date: "",
    publish_time: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      articleSchema.parse({
        title: formData.title,
        content: formData.content,
        category: formData.category || undefined,
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
        const filePath = `articles/${fileName}`;

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
        category: formData.category.trim() || null,
        author: formData.author.trim() || null,
        editor: formData.editor.trim() || null,
        image_url: imageUrl,
        published_at: publishedAt
      };

      if (editingId) {
        const { error } = await supabase
          .from("articles")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Artikel berhasil diupdate");
      } else {
        const { error } = await supabase.from("articles").insert([dataToSave]);

        if (error) throw error;
        toast.success("Artikel berhasil ditambahkan");
      }

      setFormData({ title: "", content: "", category: "", author: "", editor: "", image_url: "", publish_date: "", publish_time: "" });
      setEditingId(null);
      setImageFile(null);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    
    // Parse published_at to date and time if exists
    let publishDate = "";
    let publishTime = "";
    if (article.published_at) {
      const date = new Date(article.published_at);
      publishDate = date.toISOString().split('T')[0];
      publishTime = date.toTimeString().slice(0, 5);
    }
    
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category || "",
      author: article.author || "",
      editor: article.editor || "",
      image_url: article.image_url || "",
      publish_date: publishDate,
      publish_time: publishTime,
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex justify-between items-start gap-2 mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary flex-shrink-0 animate-fade-in" />
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? "Edit Artikel" : "Kelola Artikel"}
            </h2>
            <p className="text-gray-600 mt-1">
              {editingId ? "Perbarui artikel yang sudah ada" : "Buat dan kelola konten artikel"}
            </p>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            {editingId ? "Form Edit Artikel" : "Form Tambah Artikel"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2 md:space-y-4">
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="title" className="text-xs sm:text-sm">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Masukkan judul artikel"
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="category" className="text-xs sm:text-sm">Kategori</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Contoh: Teknologi"
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="author" className="text-xs sm:text-sm">Penulis</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Nama penulis"
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="editor" className="text-xs sm:text-sm">Penyunting</Label>
              <Input
                id="editor"
                value={formData.editor}
                onChange={(e) =>
                  setFormData({ ...formData, editor: e.target.value })
                }
                placeholder="Nama penyunting"
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4">
              <div className="space-y-0.5 sm:space-y-1">
                <Label htmlFor="publish_date" className="text-xs sm:text-sm">Tanggal</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_date: e.target.value })
                  }
                  className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <Label htmlFor="publish_time" className="text-xs sm:text-sm">Waktu</Label>
                <Input
                  id="publish_time"
                  type="time"
                  value={formData.publish_time}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_time: e.target.value })
                  }
                  className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                />
              </div>
            </div>
            <ImageUpload
              id="image-upload"
              label="Upload Gambar"
              currentImageUrl={formData.image_url}
              onFileSelect={(file) => setImageFile(file)}
              onRemove={() => setFormData({ ...formData, image_url: "" })}
              disabled={uploading}
            />
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="content" className="text-xs sm:text-sm">Konten</Label>
              <Tabs defaultValue="edit" className="w-full mt-1 sm:mt-2">
                <TabsList className="grid w-full grid-cols-2 h-7 sm:h-8 md:h-10 text-xs sm:text-sm">
                  <TabsTrigger value="edit" className="flex items-center gap-1 text-xs sm:text-sm">
                    <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1 text-xs sm:text-sm">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-1.5 sm:mt-2 md:mt-4">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                    placeholder="Tulis isi artikel di sini..."
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-1.5 sm:mt-2 md:mt-4">
                  <Card>
                    <CardContent className="p-2 sm:p-3 md:p-6">
                      {/* Preview Header */}
                      <div className="mb-2 sm:mb-3 md:mb-6">
                        <h1 className="text-base sm:text-xl md:text-3xl font-bold mb-1.5 sm:mb-2 md:mb-4 text-primary line-clamp-2">
                          {formData.title || "Judul Artikel"}
                        </h1>
                        
                        {formData.image_url && (
                          <div className="mb-1.5 sm:mb-2 md:mb-4">
                            <img 
                              src={formData.image_url} 
                              alt={formData.title} 
                              className="w-full h-[150px] sm:h-[250px] md:h-[400px] object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-6 pb-1.5 sm:pb-2 md:pb-4 border-b">
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                            <span>{new Date().toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}</span>
                            {formData.author && <span>Penulis: {formData.author}</span>}
                          </div>
                          {formData.category && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] sm:text-xs">
                              {formData.category}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="prose prose-sm sm:prose md:prose-lg max-w-none">
                        {formData.content ? (
                          <div 
                            className="text-foreground/90 leading-relaxed article-content text-xs sm:text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData.content) }}
                          />
                        ) : (
                          <p className="text-muted-foreground italic text-xs sm:text-sm md:text-base">
                            Konten artikel akan ditampilkan di sini...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <Button type="submit" disabled={uploading} className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm flex-1">
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
                      publish_date: "",
                      publish_time: "",
                    });
                  }}
                  className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-1.5 sm:space-y-2 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base md:text-xl font-semibold">Daftar Artikel yang Terupload</h3>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">{articles.length} Artikel</Badge>
        </div>
        
        {articles.length === 0 ? (
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="text-center py-4 sm:py-6 md:py-8">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-muted-foreground" />
                </div>
                <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-1.5 md:mb-2">Belum Ada Artikel</h4>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Mulai tambahkan artikel pertama Anda menggunakan form di atas
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-2.5 sm:p-3 md:p-6">
                <div className="flex justify-between items-start gap-2 sm:gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2 leading-snug">{article.title}</h3>
                    {article.category && (
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5">
                        {article.category}
                      </p>
                    )}
                    <p className="mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">{stripHtml(article.content)}</p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(article)}
                      className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 hover:bg-primary hover:text-white hover:border-primary active:bg-primary active:text-white transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(article.id)}
                      className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 active:scale-95 transition-transform"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
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
