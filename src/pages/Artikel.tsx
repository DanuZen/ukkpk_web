import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                Artikel UKKPK
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Kumpulan artikel, berita, dan informasi terkini seputar kegiatan kampus
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="scale-in" delay={100}>
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
          </AnimatedSection>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-background relative overflow-hidden">
        {/* Curved geometric background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border-[40px] border-gray-100/60" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full border-[30px] border-gray-50" />
          <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] rounded-full border-[60px] border-gray-100/50" />
          <div className="absolute top-20 right-1/3 w-28 h-28 rounded-full border-[12px] border-primary/10" />
          
          <div className="absolute top-0 right-0 w-1/4 h-1/2 opacity-25">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '18px 18px'
            }} />
          </div>
          
          <div className="absolute bottom-1/4 left-0 w-72 h-72">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
              <path d="M 0,90 Q 50,50 100,90 T 200,90" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,110 Q 50,70 100,110 T 200,110" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,130 Q 50,90 100,130 T 200,130" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <AnimatedSection key={article.id} animation="fade-up" delay={index * 100}>
                  <Card 
                    className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
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
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-4 leading-relaxed">
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
