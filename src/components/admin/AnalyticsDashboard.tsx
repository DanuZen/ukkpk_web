import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Heart, FileText, Newspaper, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
interface OverallStats {
  totalArticles: number;
  totalNews: number;
  totalArticleViews: number;
  totalNewsViews: number;
  totalArticleLikes: number;
  totalNewsLikes: number;
  totalViews: number;
  totalLikes: number;
  avgArticleViews: number;
  avgNewsViews: number;
  avgArticleLikes: number;
  avgNewsLikes: number;
  engagementRate: number;
}
const COLORS = ['#dc2626', '#ea580c', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4'];
export const AnalyticsDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState<{ day: number; views: number }[]>([]);
  const [articles, setArticles] = useState<ArticleStats[]>([]);
  const [news, setNews] = useState<NewsStats[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalArticles: 0,
    totalNews: 0,
    totalArticleViews: 0,
    totalNewsViews: 0,
    totalArticleLikes: 0,
    totalNewsLikes: 0,
    totalViews: 0,
    totalLikes: 0,
    avgArticleViews: 0,
    avgNewsViews: 0,
    avgArticleLikes: 0,
    avgNewsLikes: 0,
    engagementRate: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAnalytics();
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
  const fetchAnalytics = async () => {
    try {
      // Fetch articles with views and likes
      const {
        data: articlesData,
        error: articlesError
      } = await supabase.from('articles').select('id, title, view_count, likes_count, category, published_at').order('view_count', {
        ascending: false
      });
      if (articlesError) throw articlesError;

      // Fetch news with views and likes
      const {
        data: newsData,
        error: newsError
      } = await supabase.from('news').select('id, title, view_count, likes_count, published_at').order('view_count', {
        ascending: false
      });
      if (newsError) throw newsError;
      setArticles(articlesData || []);
      setNews(newsData || []);

      // Calculate overall stats
      const totalArticleViews = (articlesData || []).reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalArticleLikes = (articlesData || []).reduce((sum, a) => sum + (a.likes_count || 0), 0);
      const totalNewsViews = (newsData || []).reduce((sum, n) => sum + (n.view_count || 0), 0);
      const totalNewsLikes = (newsData || []).reduce((sum, n) => sum + (n.likes_count || 0), 0);
      const totalArticles = articlesData?.length || 0;
      const totalNews = newsData?.length || 0;
      const totalContent = totalArticles + totalNews;
      const totalViews = totalArticleViews + totalNewsViews;
      const totalLikes = totalArticleLikes + totalNewsLikes;
      const avgArticleViews = totalArticles > 0 ? Math.round(totalArticleViews / totalArticles) : 0;
      const avgNewsViews = totalNews > 0 ? Math.round(totalNewsViews / totalNews) : 0;
      const avgArticleLikes = totalArticles > 0 ? Math.round(totalArticleLikes / totalArticles) : 0;
      const avgNewsLikes = totalNews > 0 ? Math.round(totalNewsLikes / totalNews) : 0;
      const engagementRate = totalViews > 0 ? totalLikes / totalViews * 100 : 0;
      setOverallStats({
        totalArticles,
        totalNews,
        totalArticleViews,
        totalNewsViews,
        totalArticleLikes,
        totalNewsLikes,
        totalViews,
        totalLikes,
        avgArticleViews,
        avgNewsViews,
        avgArticleLikes,
        avgNewsLikes,
        engagementRate
      });
    } catch (error) {
      // Error logged for debugging purposes only in development
    } finally {
      setLoading(false);
    }
  };
  const topArticles = articles.slice(0, 5);
  const topNews = news.slice(0, 5);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Prepare data for comparison chart
  const comparisonData = [{
    name: 'Total Views',
    Artikel: overallStats.totalArticleViews,
    Berita: overallStats.totalNewsViews
  }, {
    name: 'Total Likes',
    Artikel: overallStats.totalArticleLikes,
    Berita: overallStats.totalNewsLikes
  }, {
    name: 'Total Konten',
    Artikel: overallStats.totalArticles,
    Berita: overallStats.totalNews
  }];

  // Prepare data for category distribution (articles only)
  const categoryData = articles.reduce((acc: {
    [key: string]: number;
  }, article) => {
    const category = article.category || 'Tanpa Kategori';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare top content data for bar chart
  const topContentData = [...topArticles.map(a => ({
    title: a.title.length > 30 ? a.title.substring(0, 30) + '...' : a.title,
    views: a.view_count || 0,
    likes: a.likes_count || 0,
    type: 'Artikel'
  })), ...topNews.slice(0, 3).map(n => ({
    title: n.title.length > 30 ? n.title.substring(0, 30) + '...' : n.title,
    views: n.view_count || 0,
    likes: n.likes_count || 0,
    type: 'Berita'
  }))].sort((a, b) => b.views - a.views).slice(0, 8);
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-xs sm:text-sm">Memuat data analytics...</p>
      </div>;
  }
  return <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="px-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Analytics & Statistik</h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">Data performa konten website UKKPK</p>
      </div>

      {/* Overview Stats - First Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Engagement Rate</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{overallStats.engagementRate.toFixed(2)}%</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Likes per View
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Avg Views/Artikel</CardTitle>
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{overallStats.avgArticleViews.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Per artikel
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Avg Views/Berita</CardTitle>
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-cyan-600">{overallStats.avgNewsViews.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Per berita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Avg Engagement</CardTitle>
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-pink-600">
              {Math.round((overallStats.avgArticleLikes + overallStats.avgNewsLikes) / 2).toLocaleString()}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Likes rata-rata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Stats - Second Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Total Views</CardTitle>
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-primary">{overallStats.totalViews.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              A: {overallStats.totalArticleViews.toLocaleString()} | B: {overallStats.totalNewsViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Total Likes</CardTitle>
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{overallStats.totalLikes.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              A: {overallStats.totalArticleLikes.toLocaleString()} | B: {overallStats.totalNewsLikes.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Total Artikel</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{overallStats.totalArticles.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Artikel dipublikasi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">Total Berita</CardTitle>
            <Newspaper className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{overallStats.totalNews.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Berita dipublikasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistik Views Chart */}
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

      {/* Charts */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-xl">Perbandingan Artikel vs Berita</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Artikel" fill="#dc2626" />
                <Bar dataKey="Berita" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-xl">Top 8 Konten Terpopuler</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topContentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis dataKey="title" type="category" width={60} tick={{ fontSize: 8 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="views" fill="#dc2626" name="Views" />
                <Bar dataKey="likes" fill="#f59e0b" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>;
};