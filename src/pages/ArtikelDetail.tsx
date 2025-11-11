import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

const ArtikelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    if (article) {
      fetchRelatedArticles();
    }
  }, [article]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error('Artikel tidak ditemukan');
        navigate('/artikel');
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRelatedArticles(data || []);
    } catch (error) {
      console.error('Error fetching related articles:', error);
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
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
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
              {/* Article Header */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-primary">
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.created_at)}
                  </div>
                  {article.category && (
                    <Badge variant="secondary">
                      {article.category}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {article.image_url && (
                <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-justify">
                  {article.content}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate('/artikel')}
                >
                  Lihat Artikel Lainnya
                </Button>
              </div>
            </div>

            {/* Sidebar - Related Articles */}
            <div className="lg:col-span-1">
              <div>
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">
                  Artikel Terpopuler
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <div
                      key={relatedArticle.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        navigate(`/artikel/${relatedArticle.id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="flex gap-3">
                        {relatedArticle.image_url && (
                          <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={relatedArticle.image_url}
                              alt={relatedArticle.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {relatedArticle.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(relatedArticle.created_at)}
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

export default ArtikelDetail;
