import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ArticleCard } from '@/components/ArticleCard';
import { supabase } from '@/integrations/supabase/client';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const Berita = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setNews(data);
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
      <section className="py-16 px-4 bg-gradient-to-br from-destructive/10 via-background to-destructive/5">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent">
            Berita Terkini
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
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
        </div>
      </section>
    </Layout>
  );
};

export default Berita;
