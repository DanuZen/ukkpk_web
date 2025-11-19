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
        console.error('Error fetching top content:', error);
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
        console.error('Error fetching recent activity:', error);
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Selamat Datang, Admin!</h2>
        <p className="text-sm sm:text-base text-gray-600">Ringkasan aktivitas dashboard UKKPK UNP</p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-xl font-semibold">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-6 sm:py-8 text-sm">Belum ada aktivitas</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-2 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0">
                  <div className="flex-shrink-0">
                    <Badge variant={activity.type === 'article' ? 'default' : 'secondary'} className="text-xs">
                      {activity.type === 'article' ? 'Artikel' : 'Berita'}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{activity.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">
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
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Top 5 Articles */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Top 5 Artikel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {topArticles.length === 0 ? (
                <p className="text-center text-gray-500 py-6 sm:py-8 text-sm">Belum ada artikel</p>
              ) : (
                topArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start gap-2 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{article.title}</h4>
                      <div className="flex items-center gap-3 sm:gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{article.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
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
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center gap-2">
              <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Top 5 Berita
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {topNews.length === 0 ? (
                <p className="text-center text-gray-500 py-6 sm:py-8 text-sm">Belum ada berita</p>
              ) : (
                topNews.map((newsItem, index) => (
                  <div key={newsItem.id} className="flex items-start gap-2 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{newsItem.title}</h4>
                      <div className="flex items-center gap-3 sm:gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{newsItem.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
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
