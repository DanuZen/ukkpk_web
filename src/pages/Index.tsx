import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { HomeSlideshow } from '@/components/HomeSlideshow';
import { GoogleMap } from '@/components/GoogleMap';
import { ContactSection } from '@/components/ContactSection';
import { stripHtml } from '@/lib/utils';
import { FileText, MessageSquare, MapPin } from 'lucide-react';
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
    const {
      data
    } = await supabase.from('articles').select('*').order('created_at', {
      ascending: false
    }).limit(6);
    if (data) setArticles(data);
  };
  const fetchNews = async () => {
    const {
      data
    } = await supabase.from('news').select('*').order('created_at', {
      ascending: false
    }).limit(6);
    if (data) setNews(data);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  return <Layout>
      {/* Hero Slideshow Section */}
      <HomeSlideshow />

      {/* Artikel & Berita Section - Gabungan */}
      <section className="py-8 sm:py-12 md:py-16 bg-background relative overflow-hidden">
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
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Konten Terbaru
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Artikel & Berita Terbaru
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>

          {articles.length === 0 && news.length === 0 ? <p className="text-center text-muted-foreground">Belum ada konten tersedia.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Artikel Cards */}
              {articles.map(article => <Card key={`article-${article.id}`} className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in" onClick={() => navigate(`/artikel/${article.id}`)}>
                  {article.image_url && <div className="relative overflow-hidden h-40 sm:h-48">
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">Artikel</Badge>
                      </div>
                    </div>}
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
                </Card>)}

              {/* News Cards */}
              {news.map(item => <Card key={`news-${item.id}`} className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in" onClick={() => navigate(`/berita/${item.id}`)}>
                  {item.image_url && <div className="relative overflow-hidden h-40 sm:h-48">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <Badge className="bg-secondary text-secondary-foreground shadow-lg text-xs">Berita</Badge>
                      </div>
                    </div>}
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{formatDate(item.published_at || item.created_at)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{stripHtml(item.content)}</p>
                  </CardContent>
                </Card>)}
            </div>}
        </div>
      </section>

      {/* Contact Section Heading */}
      <section className="py-8 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Hubungi Kami
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Kritik dan Saran
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-8 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <ContactSection />
        </div>
      </section>

      {/* Map Section Heading */}
      <section className="py-8 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Lokasi Kami
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Lokasi Sekretariatan UKKPK
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <GoogleMap />
        </div>
      </section>

      {/* CTA Section */}
      
    </Layout>;
};
export default Index;