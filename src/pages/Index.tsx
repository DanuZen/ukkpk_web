import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { HomeSlideshow } from '@/components/HomeSlideshow';

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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent">Artikel & Berita Terbaru</h2>

          {articles.length === 0 && news.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada konten tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Artikel Cards */}
              {articles.map((article) => (
                <Card 
                  key={`article-${article.id}`} 
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/artikel/${article.id}`)}
                >
                  {article.image_url && (
                    <div className="relative overflow-hidden">
                      <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground shadow-lg">Artikel</Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 text-sm">{article.content}</p>
                  </CardContent>
                </Card>
              ))}

              {/* News Cards */}
              {news.map((item) => (
                <Card 
                  key={`news-${item.id}`} 
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/berita/${item.id}`)}
                >
                  {item.image_url && (
                    <div className="relative overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-secondary text-secondary-foreground shadow-lg">Berita</Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{formatDate(item.published_at || item.created_at)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 text-sm">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
