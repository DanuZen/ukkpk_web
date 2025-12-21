import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, MessageCircle, Copy, Heart, User } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/sanitize';

interface Article {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  image_url: string | null;
  image_caption: string | null;
  created_at: string;
  published_at: string | null;
  author: string | null;
  editor: string | null;
  source: string | null;
  view_count: number;
  likes_count: number;
}

const ArtikelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
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
    setIsEntering(false);
  }, []);

  useEffect(() => {
    if (article) {
      fetchSidebarNews();
      fetchOtherArticles();
      checkIfLiked();
    }
  }, [article]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error('Artikel tidak ditemukan');
        navigate('/artikel');
        return;
      }
      setArticle(data as unknown as Article);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarNews = async () => {
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      setRelatedArticles((data || []) as unknown as Article[]);
    } catch (error) {
      console.error('Error fetching sidebar news:', error);
    }
  };

  const fetchOtherArticles = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').neq('id', id).order('created_at', { ascending: false }).limit(3);
      if (error) throw error;
      setOtherArticles((data || []) as unknown as Article[]);
    } catch (error) {
      console.error('Error fetching other articles:', error);
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
      const { data: currentData } = await supabase.from('articles').select('view_count').eq('id', id).single();
      if (currentData) {
        await supabase.from('articles').update({ view_count: (currentData.view_count || 0) + 1 }).eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!article) return;
    try {
      const userIdentifier = getUserIdentifier();
      const { data } = await supabase.from('content_likes').select('id').eq('content_id', article.id).eq('content_type', 'article').eq('user_identifier', userIdentifier).maybeSingle();
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
        await supabase.from('content_likes').delete().eq('content_id', article.id).eq('content_type', 'article').eq('user_identifier', userIdentifier);
        await supabase.from('articles').update({ likes_count: Math.max(0, article.likes_count - 1) }).eq('id', article.id);
        setArticle({ ...article, likes_count: Math.max(0, article.likes_count - 1) });
        setHasLiked(false);
      } else {
        await supabase.from('content_likes').insert({ content_id: article.id, content_type: 'article', user_identifier: userIdentifier });
        await supabase.from('articles').update({ likes_count: article.likes_count + 1 }).eq('id', article.id);
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
    setTimeout(() => navigate('/artikel'), 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${dateStr} - ${timeStr} WIB`;
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

  if (!article) return null;

  return (
    <Layout>
      <article className={`py-2 md:py-12 px-2 md:px-4 transition-all duration-500 ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} ${isEntering ? 'opacity-0 translate-y-8' : ''}`}>
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" className="hidden md:inline-flex mb-6 bg-transparent hover:bg-muted/50 hover:text-foreground" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="mt-8 md:mt-0">
<<<<<<< HEAD
                <h1 className="text-xl md:text-4xl font-bold mb-6 leading-tight text-foreground">
=======
                <h1 className="text-lg md:text-4xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
>>>>>>> d8b849af252fccf09a2be50e95913ef3afc83844
                  {article.title}
                </h1>
              </div>

              {article.image_url && (
                <div className="mb-4">
                  <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden bg-muted">
                    <img src={article.image_url} alt={article.title} loading="eager" className="w-full h-full object-cover" />
                  </AspectRatio>
                  <p className="text-[10px] md:text-sm text-muted-foreground italic mt-2 md:mt-3">{article.image_caption || article.title}</p>
                </div>
              )}

              {/* Article Metadata */}
              <div className="mb-6 pb-4 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
                  {/* Mobile: Calendar and Like button on first row */}
                  {/* Desktop: Calendar, Author, and Like button all on one row */}
                  <div className="flex items-center justify-between md:justify-start gap-2 md:gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-muted/50 px-2 py-1 md:px-3 md:py-1.5 rounded-md flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                      {article.author && (
                        <div className="hidden md:flex bg-muted/50 px-2 py-1 md:px-3 md:py-1.5 rounded-md items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{article.author}</span>
                        </div>
                      )}
                    </div>
                    <div className="md:hidden flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking} className={`flex items-center gap-1 ${hasLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary hover:bg-transparent transition-colors h-auto py-1 px-2`}>
                        <Heart className={`h-3 w-3 ${hasLiked ? 'fill-current' : ''}`} />
                        <span className="text-[10px]">{article.likes_count || 0}</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Second row on mobile: Author */}
                  {/* Desktop: Like button only (Editor moved to bottom) */}
                  <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      {article.author && (
                        <div className="md:hidden bg-muted/50 px-2 py-1 md:px-3 md:py-1.5 rounded-md flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{article.author}</span>
                        </div>
                      )}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking} className={`flex items-center gap-1 ${hasLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary hover:bg-transparent transition-colors h-auto py-1 px-2`}>
                        <Heart className={`h-3 w-3 md:h-4 md:w-4 ${hasLiked ? 'fill-current' : ''}`} />
                        <span className="text-xs">{article.likes_count || 0}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-sm md:prose-lg max-w-4xl mb-12 overflow-hidden break-words">
                <div 
                  className="text-foreground/90 leading-relaxed article-content text-xs sm:text-sm md:text-base [&_ul]:!list-disc [&_ul]:!pl-5 [&_ol]:!list-decimal [&_ol]:!pl-5 [&_li]:!pl-1 [&_li>p]:!m-0 [&_li>p]:!inline"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} 
                />
                
                {article.editor && (
                  <div className="mt-8 text-xs md:text-sm text-muted-foreground italic">
                    <span>Penyunting: {article.editor}</span>
                  </div>
                )}
              </div>

<<<<<<< HEAD
              {article.source && (
                <div className="mt-8 pt-4 border-t border-border">
                  <p className="text-xs md:text-sm font-semibold mb-2">Sumber:</p>
                  <div className="flex flex-col gap-1.5">
                    {(() => {
                      try {
                        const sources = JSON.parse(article.source);
                        if (Array.isArray(sources)) {
                          return sources.map((src, i) => (
                            <div key={i} className="text-[10px] md:text-xs text-muted-foreground break-words">
                              {src.startsWith('http') ? (
                                <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                  {src}
                                </a>
                              ) : src}
                            </div>
                          ));
                        }
                      } catch (e) {}
                      return <div className="text-[10px] md:text-xs text-muted-foreground break-words">{article.source}</div>;
                    })()}
=======
              {/* Editor Info - All Screens (after content) */}
              {article.editor && (
                <div className="mb-6 pb-4 border-b border-border">
                  <div className="bg-muted/50 px-2 py-1 md:px-3 md:py-1.5 rounded-md flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm text-muted-foreground w-fit">
                    <FileEdit className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Penyunting: {article.editor}</span>
>>>>>>> d8b849af252fccf09a2be50e95913ef3afc83844
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                  <Share2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="text-[10px] md:text-sm font-medium text-muted-foreground">Bagikan:</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors text-[10px] md:text-sm h-7 md:h-9 px-2 md:px-3" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400')}>
                    <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors text-[10px] md:text-sm h-7 md:h-9 px-2 md:px-3" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank', 'width=600,height=400')}>
                    <Twitter className="h-3 w-3 md:h-4 md:w-4" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors text-[10px] md:text-sm h-7 md:h-9 px-2 md:px-3" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}>
                    <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 md:gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors text-[10px] md:text-sm h-7 md:h-9 px-2 md:px-3" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link berhasil disalin!')).catch(() => toast.error('Gagal menyalin link'))}>
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                    Salin URL
                  </Button>
                </div>
              </div>

              {otherArticles.length > 0 && (
                <div className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-border">
                  <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">Artikel Lainnya</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                    {otherArticles.map(item => (
                      <div key={item.id} className="group cursor-pointer bg-card rounded-md md:rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300" onClick={() => { navigate(`/artikel/${item.id}`); window.scrollTo(0, 0); }}>
                        {item.image_url && <div className="relative w-full h-28 md:h-40 overflow-hidden"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /></div>}
                        <div className="p-2.5 md:p-4">
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1.5 md:mb-2 text-xs md:text-base">{item.title}</h4>
                          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                            <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span>{formatDate(item.published_at || item.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <Button variant="ghost" onClick={() => navigate('/artikel')} className="bg-transparent hover:bg-muted/50 hover:text-foreground">
                  Lihat Artikel Lainnya
                </Button>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Berita Terkait</h3>
                  <div className="h-1 w-12 bg-orange-500"></div>
                </div>
                <div className="space-y-6">
                  {relatedArticles.map((relatedArticle, index) => (
                    <div key={relatedArticle.id} className={`group cursor-pointer ${index !== relatedArticles.length - 1 ? 'border-b border-border pb-6' : ''}`} onClick={() => { navigate(`/berita/${relatedArticle.id}`); window.scrollTo(0, 0); }}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(relatedArticle.published_at || relatedArticle.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <h4 className="text-base font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline transition-colors leading-snug">
                        {relatedArticle.title}
                      </h4>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <Button variant="ghost" className="w-full bg-transparent hover:bg-muted/50 hover:text-foreground" onClick={() => navigate('/berita')}>
                    Lihat Berita Lainnya
                  </Button>
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