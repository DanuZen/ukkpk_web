import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ArticleCard } from '@/components/ArticleCard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const Berita = () => {
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
      <section className="py-16 px-4 bg-gradient-to-br from-red-50/50 via-background to-red-50/30">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Berita Terkini
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berita berdasarkan judul atau isi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>
          </div>

          {/* News Grid */}
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? 'Tidak ada berita yang cocok dengan pencarian.' : 'Belum ada berita.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <ArticleCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.content.substring(0, 150) + '...'}
                  image={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'}
                  category="Berita"
                  date={formatDate(item.created_at)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Berita;
