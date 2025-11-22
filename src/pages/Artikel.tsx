import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar, BookOpen } from "lucide-react";
import { stripHtml } from "@/lib/utils";
import { AnimatedSection } from "@/components/AnimatedSection";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
}

const Artikel = () => {
  const navigate = useNavigate();
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
      .order("published_at", { ascending: false, nullsFirst: false })
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
      <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 mb-4">
                <span className="text-xs sm:text-sm uppercase font-semibold text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 animate-pulse" />
                  Publikasi Artikel
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Artikel <span className="text-primary">UKKPK</span>
              </h1>
              <AnimatedSection animation="fade-up" delay={50}>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-4">
                  Kumpulan artikel, berita, dan informasi terkini seputar kegiatan kampus. Temukan berbagai tulisan inspiratif, opini mendalam, dan liputan eksklusif dari UKKPK UNP.
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="scale-in" delay={100}>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
              {/* Mobile placeholder */}
              <Input
                type="text"
                placeholder="Cari Artikel"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:hidden pl-10 py-2 text-sm shadow-lg"
              />
              {/* Tablet & Desktop placeholder */}
              <Input
                type="text"
                placeholder="Cari artikel berdasarkan judul, kategori, atau konten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hidden sm:block pl-12 py-4 md:py-6 text-base md:text-lg shadow-lg"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <AnimatedSection key={article.id} animation="fade-up" delay={index * 100}>
                  <Card 
                    className="overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    onClick={() => navigate(`/artikel/${article.id}`)}
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
                        {formatDate(article.published_at || article.created_at)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg md:text-xl">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-4 leading-relaxed">
                      {stripHtml(article.content)}
                    </p>
                  </CardContent>
                </Card>
                </AnimatedSection>
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
