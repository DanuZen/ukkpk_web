import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, MessageCircle, Copy, Eye, Heart } from 'lucide-react';
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
  view_count: number;
  likes_count: number;
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
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchArticle();
      incrementViewCount();
    }
  }, [id]);

  useEffect(() => {
    // Trigger entrance animation
    setIsEntering(false);
  }, []);
  useEffect(() => {
    if (article) {
      fetchRelatedArticles();
      checkIfLiked();
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

  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user_identifier');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_identifier', identifier);
    }
    return identifier;
  };

  const incrementViewCount = async () => {
    try {
      const { data: currentData } = await supabase
        .from('articles')
        .select('view_count')
        .eq('id', id)
        .single();
      
      if (currentData) {
        await supabase
          .from('articles')
          .update({ view_count: (currentData.view_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!article) return;
    
    try {
      const userIdentifier = getUserIdentifier();
      const { data } = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', article.id)
        .eq('content_type', 'article')
        .eq('user_identifier', userIdentifier)
        .maybeSingle();
      
      setHasLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!article || isLiking) return;
    
    setIsLiking(true);
    try {
      const userIdentifier = getUserIdentifier();
      
      if (hasLiked) {
        // Unlike
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', article.id)
          .eq('content_type', 'article')
          .eq('user_identifier', userIdentifier);
        
        await supabase
          .from('articles')
          .update({ likes_count: Math.max(0, article.likes_count - 1) })
          .eq('id', article.id);
        
        setArticle({ ...article, likes_count: Math.max(0, article.likes_count - 1) });
        setHasLiked(false);
      } else {
        // Like
        await supabase
          .from('content_likes')
          .insert({
            content_id: article.id,
            content_type: 'article',
            user_identifier: userIdentifier
          });
        
        await supabase
          .from('articles')
          .update({ likes_count: article.likes_count + 1 })
          .eq('id', article.id);
        
        setArticle({ ...article, likes_count: article.likes_count + 1 });
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Gagal memproses like');
    } finally {
      setIsLiking(false);
    }
  };
  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/artikel');
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${dateStr} - ${timeStr} WIB`;
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
      <article className={`py-8 px-4 transition-all duration-500 ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} ${isEntering ? 'opacity-0 translate-y-8' : ''}`}>
        <div className="container mx-auto max-w-7xl">
          <Button variant="ghost" className="hidden md:inline-flex mb-6" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Title */}
              <div className="mt-8 md:mt-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  {article.title}
                </h1>
              </div>

              {/* Featured Image */}
              {article.image_url && <div className="mb-4">
                  <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <p className="text-sm text-muted-foreground italic mt-3">
                    {article.title}
                  </p>
                </div>}

              {/* Article Metadata */}
              <div className="mb-6 pb-4 border-b border-border space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{article.view_count || 0}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-1 ${hasLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}
                    >
                      <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{article.likes_count || 0}</span>
                    </Button>
                  </div>
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