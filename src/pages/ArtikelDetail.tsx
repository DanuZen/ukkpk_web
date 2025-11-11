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
  category?: string | null;
  image_url: string | null;
  created_at: string;
}
const ArtikelDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
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
      const {
        data,
        error
      } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
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
      const {
        data,
        error
      } = await supabase.from('news').select('*').order('created_at', {
        ascending: false
      }).limit(5);
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
      year: 'numeric'
    });
  };
  if (loading) {
    return <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        </div>
      </Layout>;
  }
  if (!article) {
    return null;
  }
  return <Layout>
      <article className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-primary">
                {article.title}
              </h1>

              {/* Featured Image */}
              {article.image_url && <div className="mb-4">
                  <div className="relative w-full h-[400px] mb-2 overflow-hidden">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    {article.title}
                  </p>
                </div>}

              {/* Article Metadata */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDate(article.created_at)}</span>
                  <span>Penulis: Redaksi</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {article.category || 'ARTIKEL'}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>98</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div 
                  className="text-foreground/90 leading-relaxed article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Bottom Navigation */}
              <div className="mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => navigate('/artikel')}>
                  Lihat Artikel Lainnya
                </Button>
              </div>
            </div>

            {/* Sidebar - Related Articles */}
            <div className="lg:col-span-1">
              <div>
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">
                  Berita Terpopuler
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map(relatedArticle => <div key={relatedArticle.id} className="group cursor-pointer" onClick={() => {
                  navigate(`/berita/${relatedArticle.id}`);
                  window.scrollTo(0, 0);
                }}>
                      <div className="flex gap-3">
                        {relatedArticle.image_url && <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                            <img src={relatedArticle.image_url} alt={relatedArticle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {relatedArticle.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(relatedArticle.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>;
};
export default ArtikelDetail;