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
}

const BeritaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

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
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          {/* Featured Image */}
          {news.image_url && (
            <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* News Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-secondary text-secondary-foreground">
                Berita
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(news.created_at)}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {news.title}
            </h1>
          </div>

          {/* News Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {news.content}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/berita')}
            >
              Lihat Berita Lainnya
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BeritaDetail;
