import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

const Artikel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.category &&
          article.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setArticles(data);
      setFilteredArticles(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Artikel UKKPK
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Kumpulan artikel, berita, dan informasi terkini seputar kegiatan kampus
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari artikel berdasarkan judul, kategori, atau konten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  {article.image_url && (
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {article.category && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {article.category}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(article.created_at)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                      {article.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Artikel tidak ditemukan" : "Belum ada artikel"}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Artikel;
