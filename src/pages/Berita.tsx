import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { stripHtml } from '@/lib/utils';
import { AnimatedSection } from '@/components/AnimatedSection';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
  cameraman: string[] | null;
  category: string | null;
}

const Berita = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchQuery, news]);

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setNews(data);
      setFilteredNews(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                Berita Terkini
              </h1>
              <AnimatedSection animation="fade-up" delay={50}>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-4">
                  Informasi dan berita terbaru seputar UKKPK dan kegiatan kampus. Dapatkan update terkini tentang acara, prestasi, dan perkembangan organisasi mahasiswa komunikasi dan penyiaran kampus.
                </p>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 sm:py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="scale-in" delay={100}>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
              {/* Mobile placeholder */}
              <Input
                type="text"
                placeholder="Cari Berita"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:hidden pl-10 py-2 text-sm shadow-lg"
              />
              {/* Tablet & Desktop placeholder */}
              <Input
                type="text"
                placeholder="Cari berita berdasarkan judul atau konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hidden sm:block pl-12 py-4 md:py-6 text-base md:text-lg shadow-lg"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <AnimatedSection key={item.id} animation="fade-up" delay={index * 100}>
                  <Card 
                    className="overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    onClick={() => navigate(`/berita/${item.id}`)}
                  >
                  {item.image_url && (
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        Berita
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.published_at || item.created_at)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg md:text-xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-4 leading-relaxed">
                      {stripHtml(item.content)}
                    </p>
                  </CardContent>
                </Card>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'Berita tidak ditemukan' : 'Belum ada berita'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Berita;
