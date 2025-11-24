import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Newspaper, MessageSquare, Radio, Eye, Heart, TrendingUp, TrendingDown, Users, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState<{ day: number; views: number }[]>([]);
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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);
        
        // Fetch articles and news for selected month/year
        const { data: articlesData } = await supabase
          .from('articles')
          .select('published_at, view_count')
          .gte('published_at', startDate.toISOString())
          .lte('published_at', endDate.toISOString());

        const { data: newsData } = await supabase
          .from('news')
          .select('published_at, view_count')
          .gte('published_at', startDate.toISOString())
          .lte('published_at', endDate.toISOString());

        // Calculate days in month
        const daysInMonth = endDate.getDate();
        
        // Initialize array with zeros for each day
        const dailyViews = Array.from({ length: daysInMonth }, (_, i) => ({
          day: i + 1,
          views: 0
        }));

        // Aggregate views by day from articles
        articlesData?.forEach(article => {
          if (article.published_at) {
            const day = new Date(article.published_at).getDate();
            dailyViews[day - 1].views += article.view_count || 0;
          }
        });

        // Aggregate views by day from news
        newsData?.forEach(news => {
          if (news.published_at) {
            const day = new Date(news.published_at).getDate();
            dailyViews[day - 1].views += news.view_count || 0;
          }
        });

        setChartData(dailyViews);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [selectedMonth, selectedYear]);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const statCards = [
    {
      title: "Total Artikel",
      value: stats.articles.toLocaleString(),
      icon: FileText,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+8.5%",
      trendUp: true,
      trendLabel: "Up from yesterday"
    },
    {
      title: "Total Berita",
      value: stats.news.toLocaleString(),
      icon: Newspaper,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      trend: "+1.3%",
      trendUp: true,
      trendLabel: "Up from past week"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      trend: "-4.3%",
      trendUp: false,
      trendLabel: "Down from yesterday"
    },
    {
      title: "Saran Masuk",
      value: stats.submissions.toLocaleString(),
      icon: MessageSquare,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "+1.8%",
      trendUp: true,
      trendLabel: "Up from yesterday"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
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
                    {stat.trendUp ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {stat.trendLabel}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Details Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Statistik Views</CardTitle>
          <div className="flex gap-2">
            <select 
              className="text-sm border rounded-md px-3 py-1 bg-white hover:bg-gray-50 cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select 
              className="text-sm border rounded-md px-3 py-1 bg-white hover:bg-gray-50 cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                stroke="#999"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#999"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
