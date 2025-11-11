import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: string | null;
  editor: string | null;
  cameraman: string | null;
}

const BeritaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  useEffect(() => {
    if (news) {
      fetchRelatedNews();
    }
  }, [news]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error('Berita tidak ditemukan');
        navigate('/berita');
        return;
      }

      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRelatedNews(data || []);
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Memuat berita...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <Layout>
      <article className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* News Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-primary">
                {news.title}
              </h1>

              {/* Featured Image */}
              {news.image_url && (
                <div className="mb-4">
                  <div className="relative w-full h-[400px] mb-2 overflow-hidden">
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    {news.title}
                  </p>
                </div>
              )}

              {/* News Metadata */}
              <div className="mb-6 pb-4 border-b border-border space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(news.created_at)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {news.author && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Reporter:</span>
                      <span className="font-medium text-foreground">{news.author}</span>
                    </div>
                  )}
                  {news.cameraman && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Kameramen:</span>
                      <span className="font-medium text-foreground">{news.cameraman}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* News Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div 
                  className="text-foreground/90 leading-relaxed article-content"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>

              {/* Editor Info */}
              {news.editor && (
                <div className="mb-6 pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    Penyunting: <span className="font-medium text-foreground">{news.editor}</span>
                  </p>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate('/berita')}
                >
                  Lihat Berita Lainnya
                </Button>
              </div>
            </div>

            {/* Sidebar - Related News */}
            <div className="lg:col-span-1">
              <div>
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">
                  Berita Terpopuler
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((relatedItem) => (
                    <div
                      key={relatedItem.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        navigate(`/berita/${relatedItem.id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="flex gap-3">
                        {relatedItem.image_url && (
                          <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={relatedItem.image_url}
                              alt={relatedItem.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {relatedItem.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(relatedItem.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BeritaDetail;
