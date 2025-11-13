import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, MessageCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/sanitize';

interface Article {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
  author: string | null;
  editor: string | null;
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
              <div className="mb-6 pb-4 border-b border-border space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at || article.created_at)}</span>
                </div>
                <div className="text-sm space-y-1">
                  {article.author && (
                    <p>
                      <span className="text-muted-foreground">Penulis : </span>
                      <span className="font-medium text-foreground">{article.author}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div 
                  className="text-foreground/90 leading-relaxed article-content"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
                />
              </div>

              {/* Editor Info */}
              {article.editor && (
                <div className="mb-6 pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    Penyunting: <span className="font-medium text-foreground">{article.editor}</span>
                  </p>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Bagikan:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                    }}
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
                    onClick={() => {
                      const url = window.location.href;
                      const text = article.title;
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
                    }}
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                    onClick={() => {
                      const url = window.location.href;
                      const text = article.title;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    onClick={() => {
                      const url = window.location.href;
                      navigator.clipboard.writeText(url).then(() => {
                        toast.success('Link berhasil disalin!');
                      }).catch(() => {
                        toast.error('Gagal menyalin link');
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Salin URL
                  </Button>
                </div>
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
                            {formatDate(relatedArticle.published_at || relatedArticle.created_at)}
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