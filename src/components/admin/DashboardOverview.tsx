import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Newspaper, MessageSquare, Eye, Heart } from "lucide-react";
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
    totalLikes: 0,
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
        supabase.from("radio_programs").select("id", { count: "exact", head: true }),
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
        totalLikes: totalArticleLikes + totalNewsLikes,
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
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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

  const statCards = [
    {
      title: "Total Artikel",
      value: stats.articles.toLocaleString(),
      icon: FileText,
      iconBgColor: "bg-blue-500",
      iconColor: "text-white",
      trend: "+8.5%",
      trendUp: true,
      trendLabel: "vs bulan lalu"
    },
    {
      title: "Total Berita",
      value: stats.news.toLocaleString(),
      icon: Newspaper,
      iconBgColor: "bg-green-500",
      iconColor: "text-white",
      trend: "+1.3%",
      trendUp: true,
      trendLabel: "vs bulan lalu"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      iconBgColor: "bg-purple-500",
      iconColor: "text-white",
      trend: "-4.3%",
      trendUp: false,
      trendLabel: "vs bulan lalu"
    },
    {
      title: "Saran Masuk",
      value: stats.submissions.toLocaleString(),
      icon: MessageSquare,
      iconBgColor: "bg-orange-500",
      iconColor: "text-white",
      trend: "+1.8%",
      trendUp: true,
      trendLabel: "vs bulan lalu"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 rounded-xl p-6 sm:p-8 text-white shadow-lg animate-fade-in">
        <div className="flex items-start gap-3">
          <span className="text-3xl sm:text-4xl">👋</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Selamat Datang!</h2>
            <p className="text-white/90 text-sm sm:text-base">Berikut ringkasan data sistem UKKPK hari ini</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trendUp ? '↑' : '↓'} {stat.trend}
                    </span>
                    <span className="text-xs text-gray-500">
                      {stat.trendLabel}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${stat.iconBgColor} shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
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
        <Card>
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
        <Card>
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
