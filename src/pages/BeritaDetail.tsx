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
interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
  author: string | null;
  editor: string | null;
  cameraman: string[] | null;
  category: string | null;
  view_count: number;
  likes_count: number;
}
const BeritaDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [otherNews, setOtherNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  useEffect(() => {
    if (id) {
      fetchNews();
      incrementViewCount();
    }
  }, [id]);
  useEffect(() => {
    if (news) {
      fetchRelatedNews();
      checkIfLiked();
    }
  }, [news]);
  const fetchNews = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
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
      const {
        data,
        error
      } = await supabase.from('news').select('*').neq('id', id).order('created_at', {
        ascending: false
      }).limit(8);
      if (error) throw error;

      // First 3 for bottom section, rest for sidebar
      setOtherNews((data || []).slice(0, 3));
      setRelatedNews((data || []).slice(3, 8));
    } catch (error) {
      console.error('Error fetching related news:', error);
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
      const {
        data: currentData
      } = await supabase.from('news').select('view_count').eq('id', id).single();
      if (currentData) {
        await supabase.from('news').update({
          view_count: (currentData.view_count || 0) + 1
        }).eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };
  const checkIfLiked = async () => {
    if (!news) return;
    try {
      const userIdentifier = getUserIdentifier();
      const {
        data
      } = await supabase.from('content_likes').select('id').eq('content_id', news.id).eq('content_type', 'news').eq('user_identifier', userIdentifier).maybeSingle();
      setHasLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };
  const handleLike = async () => {
    if (!news || isLiking) return;
    setIsLiking(true);
    try {
      const userIdentifier = getUserIdentifier();
      if (hasLiked) {
        // Unlike
        await supabase.from('content_likes').delete().eq('content_id', news.id).eq('content_type', 'news').eq('user_identifier', userIdentifier);
        await supabase.from('news').update({
          likes_count: Math.max(0, news.likes_count - 1)
        }).eq('id', news.id);
        setNews({
          ...news,
          likes_count: Math.max(0, news.likes_count - 1)
        });
        setHasLiked(false);
      } else {
        // Like
        await supabase.from('content_likes').insert({
          content_id: news.id,
          content_type: 'news',
          user_identifier: userIdentifier
        });
        await supabase.from('news').update({
          likes_count: news.likes_count + 1
        }).eq('id', news.id);
        setNews({
          ...news,
          likes_count: news.likes_count + 1
        });
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Gagal memproses like');
    } finally {
      setIsLiking(false);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
            <p className="text-muted-foreground">Memuat berita...</p>
          </div>
        </div>
      </Layout>;
  }
  if (!news) {
    return null;
  }
  return <Layout>
      <article className="py-4 md:py-8 px-3 md:px-4">
        <div className="container mx-auto max-w-7xl">
          <Button variant="ghost" className="mb-3 md:mb-6 text-xs md:text-sm bg-transparent hover:bg-muted/50 hover:text-foreground" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* News Title */}
              <div className="mb-3 md:mb-6">
                <h1 className="text-lg md:text-4xl font-bold mb-2 md:mb-3 leading-tight bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  {news.title}
                </h1>
                {news.category && <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] md:text-xs px-2 py-0.5">
                    {news.category.toUpperCase()}
                  </Badge>}
              </div>

              {/* Featured Image */}
              {news.image_url && <div className="mb-3 md:mb-4">
                  <AspectRatio ratio={16 / 9} className="rounded-md md:rounded-lg overflow-hidden bg-muted">
                    <img src={news.image_url} alt={news.title} loading="eager" className="w-full h-full object-cover" />
                  </AspectRatio>
                  <p className="text-muted-foreground italic mt-2 md:mt-3 text-[10px] md:text-xs">
                    {news.title}
                  </p>
                </div>}

              {/* News Metadata */}
              <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-border space-y-1.5 md:space-y-2">
                <div className="flex items-center justify-between mb-1.5 md:mb-2">
                  <div className="flex items-center gap-1.5 md:gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-[10px] md:text-xs">{formatDate(news.published_at || news.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-0.5 md:gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-[10px] md:text-xs">{news.view_count || 0}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking} className={`flex items-center gap-0.5 md:gap-1 p-1 md:p-2 ${hasLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
                      <Heart className={`h-3 w-3 md:h-4 md:w-4 ${hasLiked ? 'fill-current' : ''}`} />
                      <span className="text-[10px] md:text-xs">{news.likes_count || 0}</span>
                    </Button>
                  </div>
                </div>
                <div className="text-[11px] md:text-sm space-y-0.5 md:space-y-1">
                  {news.author && <p>
                      <span className="text-muted-foreground">Reporter : </span>
                      <span className="font-medium text-foreground">{news.author}</span>
                    </p>}
                  {news.cameraman && news.cameraman.length > 0 && <p>
                      <span className="text-muted-foreground">Kameraman : </span>
                      <span className="font-medium text-foreground">{news.cameraman.join(", ")}</span>
                    </p>}
                </div>
              </div>

              {/* News Content */}
              <div className="prose prose-sm md:prose-lg max-w-none mb-4 md:mb-8">
                <div className="text-foreground/90 leading-relaxed article-content text-xs md:text-base" dangerouslySetInnerHTML={{
                __html: sanitizeHtml(news.content)
              }} />
              </div>

              {/* Editor Info */}
              {news.editor && <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-border">
                  <p className="text-[11px] md:text-sm text-muted-foreground">
                    Penyunting: <span className="font-medium text-foreground">{news.editor}</span>
                  </p>
                </div>}

              {/* Share Buttons */}
              <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-border">
                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                  <Share2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">Bagikan:</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-2" onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                }}>
                    <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-2" onClick={() => {
                  const url = window.location.href;
                  const text = news.title;
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
                }}>
                    <Twitter className="h-3 w-3 md:h-4 md:w-4" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-2" onClick={() => {
                  const url = window.location.href;
                  const text = news.title;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                }}>
                    <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-2" onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url).then(() => {
                    toast.success('Link berhasil disalin!');
                  }).catch(() => {
                    toast.error('Gagal menyalin link');
                  });
                }}>
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                    Salin URL
                  </Button>
                </div>
              </div>

              {/* Other News Section */}
              {otherNews.length > 0 && <div className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-border">
                  <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">Berita Lainnya</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                    {otherNews.map(item => <div key={item.id} className="group cursor-pointer bg-card rounded-md md:rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300" onClick={() => {
                  navigate(`/berita/${item.id}`);
                  window.scrollTo(0, 0);
                }}>
                        {item.image_url && <div className="relative w-full h-28 md:h-40 overflow-hidden">
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>}
                        <div className="p-2.5 md:p-4">
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1.5 md:mb-2 text-xs md:text-base">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                            <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span>{formatDate(item.published_at || item.created_at)}</span>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>}

              {/* Bottom Navigation */}
              <div className="mt-4 md:mt-8 pt-3 md:pt-6 border-t border-border">
                <Button variant="outline" onClick={() => navigate('/berita')} className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
                  Lihat Berita Lainnya
                </Button>
              </div>
            </div>

            {/* Sidebar - Related News */}
            <div className="lg:col-span-1">
              <div>
                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 pb-2 border-b border-border">
                  Berita Terpopuler
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {relatedNews.map(relatedItem => <div key={relatedItem.id} className="group cursor-pointer" onClick={() => {
                  navigate(`/berita/${relatedItem.id}`);
                  window.scrollTo(0, 0);
                }}>
                      <div className="flex gap-2 md:gap-3">
                        {relatedItem.image_url && <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded overflow-hidden">
                            <img src={relatedItem.image_url} alt={relatedItem.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-0.5 md:mb-1">
                            {relatedItem.title}
                          </h4>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {formatDate(relatedItem.published_at || relatedItem.created_at)}
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
export default BeritaDetail;