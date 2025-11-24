import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Newspaper, MessageSquare, Radio, Eye, Heart, TrendingUp, Calendar } from "lucide-react";
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
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Total tampilan konten"
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Total suka konten"
    },
    {
      title: "Total Artikel",
      value: stats.articles,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${stats.articles} artikel tersedia`
    },
    {
      title: "Total Berita",
      value: stats.news,
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: `${stats.news} berita tersedia`
    },
    {
      title: "Program Radio",
      value: stats.programs,
      icon: Radio,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Program aktif"
    },
    {
      title: "Saran Masuk",
      value: stats.submissions,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Menunggu review"
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="px-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Selamat Datang, Admin!</h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">Ringkasan aktivitas dashboard UKKPK UNP</p>
      </div>

      <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 leading-tight">
                {stat.title}
              </CardTitle>
              <div className={`p-1 sm:p-1.5 md:p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">{stat.description}</p>
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
