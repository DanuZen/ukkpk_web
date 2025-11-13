import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { stripHtml } from '@/lib/utils';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
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
      <section className="relative py-20 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Berita Terkini
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Informasi dan berita terbaru seputar UKKPK dan kegiatan kampus
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
              placeholder="Cari berita berdasarkan judul atau konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* News Grid */}
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
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
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
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                      {stripHtml(item.content)}
                    </p>
                  </CardContent>
                </Card>
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
