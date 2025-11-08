import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    fetchArticles();
    fetchNews();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) setArticles(data);
  };

  const fetchNews = async () => {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) setNews(data);
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
      <section className="relative min-h-[600px] flex items-center justify-center px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Unit Kegiatan Komunikasi dan Penyiaran Kampus
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Wadah pengembangan keterampilan komunikasi, jurnalistik, dan penyiaran untuk mahasiswa
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/profil-ukkpk"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Tentang Kami
            </a>
            <a
              href="/artikel"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Lihat Artikel
            </a>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Artikel Terbaru</h2>
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {article.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    {article.category && (
                      <span className="text-xs font-semibold text-primary mb-2 uppercase">
                        {article.category}
                      </span>
                    )}
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.content}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Belum ada artikel</p>
          )}
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Berita Terbaru</h2>
          {news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {item.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Belum ada berita</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
