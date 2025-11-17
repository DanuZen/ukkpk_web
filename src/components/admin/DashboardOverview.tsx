import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang, Admin!</h2>
        <p className="text-gray-600">Ringkasan aktivitas dashboard UKKPK UNP</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Aktivitas Terbaru
          </CardTitle>
          <CardDescription>Konten yang baru saja ditambahkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${activity.type === 'article' ? 'bg-green-50' : 'bg-blue-50'}`}>
                  {activity.type === 'article' ? (
                    <FileText className="h-4 w-4 text-green-600" />
                  ) : (
                    <Newspaper className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(activity.created_at), "dd MMM yyyy, HH:mm", { locale: id })}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      activity.type === 'article' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.type === 'article' ? 'Artikel' : 'Berita'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Belum ada aktivitas</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Articles and News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Top 5 Artikel
            </CardTitle>
            <CardDescription>Artikel dengan views tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate mb-1">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likes_count || 0}
                      </span>
                      {article.category && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {article.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {topArticles.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Belum ada artikel</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-green-500" />
              Top 5 Berita
            </CardTitle>
            <CardDescription>Berita dengan views tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topNews.map((newsItem, index) => (
                <div key={newsItem.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate mb-1">
                      {newsItem.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {newsItem.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {newsItem.likes_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {topNews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Belum ada berita</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
