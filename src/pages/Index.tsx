import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { HomeSlideshow } from '@/components/HomeSlideshow';
import { stripHtml } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
}

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
}

const Index = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    fetchArticles();
    fetchNews();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6);

    if (data) setArticles(data);
  };

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(6);

    if (data) setNews(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      {/* Hero Slideshow Section */}
      <HomeSlideshow />

      {/* Artikel & Berita Section - Gabungan */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center bg-gradient-primary bg-clip-text text-transparent animate-fade-in">Artikel & Berita Terbaru</h2>

          {articles.length === 0 && news.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada konten tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Artikel Cards */}
              {articles.map((article) => (
                <Card 
                  key={`article-${article.id}`} 
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in"
                  onClick={() => navigate(`/artikel/${article.id}`)}
                >
                  {article.image_url && (
                    <div className="relative overflow-hidden h-40 sm:h-48">
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">Artikel</Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{stripHtml(article.content)}</p>
                  </CardContent>
                </Card>
              ))}

              {/* News Cards */}
              {news.map((item) => (
                <Card 
                  key={`news-${item.id}`} 
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in"
                  onClick={() => navigate(`/berita/${item.id}`)}
                >
                  {item.image_url && (
                    <div className="relative overflow-hidden h-40 sm:h-48">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <Badge className="bg-secondary text-secondary-foreground shadow-lg text-xs">Berita</Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{formatDate(item.published_at || item.created_at)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{stripHtml(item.content)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10 animate-fade-in">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Bergabung Bersama Kami</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">Kembangkan potensimu di bidang komunikasi dan penyiaran bersama UKKPK</p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
            <a href="/berita" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto max-w-[200px]">
              Lihat Berita
            </a>
            <a href="/artikel" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto max-w-[200px]">
              Baca Artikel
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
