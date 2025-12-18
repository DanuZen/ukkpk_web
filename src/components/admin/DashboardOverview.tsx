import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Newspaper, MessageSquare, Eye, Heart, TrendingUp, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ArticleStats {
  id: string;
  title: string;
  view_count: number;
  likes_count: number;
  category: string | null;
  published_at: string | null;
}

interface NewsStats {
  id: string;
  title: string;
  view_count: number;
  likes_count: number;
  published_at: string | null;
}

interface RecentActivity {
  id: string;
  title: string;
  type: 'article' | 'news';
  created_at: string;
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    articles: 0,
    news: 0,
    submissions: 0,
    programs: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [topArticles, setTopArticles] = useState<ArticleStats[]>([]);
  const [topNews, setTopNews] = useState<NewsStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, newsRes, submissionsRes, programsRes] = await Promise.all([
        supabase.from("articles").select("id, view_count, likes_count", { count: "exact" }),
        supabase.from("news").select("id, view_count, likes_count", { count: "exact" }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("radio_programs").select("id", { count: "exact", head: true })
      ]);

      const totalArticleViews = (articlesRes.data || []).reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalArticleLikes = (articlesRes.data || []).reduce((sum, a) => sum + (a.likes_count || 0), 0);
      const totalNewsViews = (newsRes.data || []).reduce((sum, n) => sum + (n.view_count || 0), 0);
      const totalNewsLikes = (newsRes.data || []).reduce((sum, n) => sum + (n.likes_count || 0), 0);

      setStats({
        articles: articlesRes.count || 0,
        news: newsRes.count || 0,
        submissions: submissionsRes.count || 0,
        programs: programsRes.count || 0,
        totalViews: totalArticleViews + totalNewsViews,
        totalLikes: totalArticleLikes + totalNewsLikes
      });
    };

    const fetchTopContent = async () => {
      try {
        const { data: articlesData } = await supabase
          .from('articles')
          .select('id, title, view_count, likes_count, category, published_at')
          .order('view_count', { ascending: false })
          .limit(5);

        const { data: newsData } = await supabase
          .from('news')
          .select('id, title, view_count, likes_count, published_at')
          .order('view_count', { ascending: false })
          .limit(5);

        setTopArticles(articlesData || []);
        setTopNews(newsData || []);
      } catch (error) {
        // Error silently handled
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const { data: recentArticles } = await supabase
          .from('articles')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const { data: recentNews } = await supabase
          .from('news')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const combined: RecentActivity[] = [
          ...(recentArticles || []).map(a => ({ ...a, type: 'article' as const })),
          ...(recentNews || []).map(n => ({ ...n, type: 'news' as const }))
        ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

        setRecentActivity(combined);
      } catch (error) {
        // Error silently handled
      }
    };

    fetchStats();
    fetchTopContent();
    fetchRecentActivity();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-primary animate-fade-in" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">Ringkasan aktivitas dan performa website UKKPK</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Articles Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-blue-100">Total Artikel</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{stats.articles.toLocaleString()}</div>
            <div className="flex items-center text-blue-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <ArrowUpRight className="w-3 h-3" /> +8.5%
              </span>
              <span>vs bulan lalu</span>
            </div>
            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#fff" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Total News Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Newspaper className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-emerald-100">Total Berita</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{stats.news.toLocaleString()}</div>
            <div className="flex items-center text-emerald-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <TrendingUp className="w-3 h-3" /> +1.3%
              </span>
              <span>vs bulan lalu</span>
            </div>
            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#fff" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Total Views Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-purple-100">Total Views</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-purple-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <TrendingUp className="w-3 h-3" /> -4.3%
              </span>
              <span>vs bulan lalu</span>
            </div>
            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#fff" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageSquare className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-amber-100">Saran Masuk</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{stats.submissions.toLocaleString()}</div>
            <div className="flex items-center text-amber-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <ArrowUpRight className="w-3 h-3" /> +1.8%
              </span>
              <span>vs bulan lalu</span>
            </div>
            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#fff" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,133.3C672,128,768,160,864,170.7C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-xl">
        <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-xl font-semibold">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-4 sm:py-6 md:py-8 text-xs sm:text-sm">Belum ada aktivitas</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-2 sm:gap-3 md:gap-4 pb-2 sm:pb-3 md:pb-4 border-b last:border-0">
                  <div className="flex-shrink-0">
                    <Badge variant={activity.type === 'article' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                      {activity.type === 'article' ? 'Artikel' : 'Berita'}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">{activity.title}</h4>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5">
                      {format(new Date(activity.created_at), "d MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Articles and News */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
        {/* Top 5 Articles */}
        <Card className="shadow-xl">
          <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-xl font-semibold flex items-center gap-1.5 sm:gap-2">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span>Top 5 Artikel</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {topArticles.length === 0 ? (
                <p className="text-center text-gray-500 py-4 sm:py-6 md:py-8 text-xs sm:text-sm">Belum ada artikel</p>
              ) : (
                topArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] sm:text-xs md:text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">{article.title}</h4>
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-0.5 sm:mt-1">
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500">
                          <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span>{article.view_count}</span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500">
                          <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span>{article.likes_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top 5 News */}
        <Card className="shadow-xl">
          <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-xl font-semibold flex items-center gap-1.5 sm:gap-2">
              <Newspaper className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span>Top 5 Berita</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {topNews.length === 0 ? (
                <p className="text-center text-gray-500 py-4 sm:py-6 md:py-8 text-xs sm:text-sm">Belum ada berita</p>
              ) : (
                topNews.map((newsItem, index) => (
                  <div key={newsItem.id} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] sm:text-xs md:text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">{newsItem.title}</h4>
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-0.5 sm:mt-1">
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500">
                          <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span>{newsItem.view_count}</span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500">
                          <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span>{newsItem.likes_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};