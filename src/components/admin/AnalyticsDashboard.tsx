import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Heart, FileText, Newspaper, TrendingUp, Users, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardPageHeader } from "@/components/admin/DashboardPageHeader";

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
  const [chartData, setChartData] = useState<{
    day: number;
    views: number;
  }[]>([]);
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
        const {
          data: articlesData
        } = await supabase.from('articles').select('published_at, view_count').gte('published_at', startDate.toISOString()).lte('published_at', endDate.toISOString());
        const {
          data: newsData
        } = await supabase.from('news').select('published_at, view_count').gte('published_at', startDate.toISOString()).lte('published_at', endDate.toISOString());

        // Calculate days in month
        const daysInMonth = endDate.getDate();

        // Initialize array with zeros for each day
        const dailyViews = Array.from({
          length: daysInMonth
        }, (_, i) => ({
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
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = Array.from({
    length: 10
  }, (_, i) => new Date().getFullYear() - i);

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
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-xs sm:text-sm">Memuat data analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader 
        title="Analytics & Statistik" 
        subtitle="Data performa konten website UKKPK" 
        icon={TrendingUp} 
      />

      {/* New Styled Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Views Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-emerald-100">Total Views</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{overallStats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-emerald-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
              <span>Last Month</span>
            </div>
            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#fff" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Total Likes Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Heart className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-purple-100">Total Likes</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{overallStats.totalLikes.toLocaleString()}</div>
            <div className="flex items-center text-purple-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <TrendingUp className="w-3 h-3" /> +8.2%
              </span>
              <span>Last Month</span>
            </div>
            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#fff" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

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
            <div className="text-4xl font-bold mb-2">{overallStats.totalArticles.toLocaleString()}</div>
            <div className="flex items-center text-blue-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <ArrowUpRight className="w-3 h-3" /> +5
              </span>
              <span>Added this month</span>
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
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 border-0 shadow-xl text-white group hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Newspaper className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-amber-100">Total Berita</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-100 hover:text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold mb-2">{overallStats.totalNews.toLocaleString()}</div>
            <div className="flex items-center text-amber-100 text-xs">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white flex items-center gap-1 mr-2">
                <ArrowUpRight className="w-3 h-3" /> +3
              </span>
              <span>Added this month</span>
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Statistik Views</CardTitle>
            <div className="flex gap-2">
              <select className="text-sm border rounded-md px-3 py-1 bg-white hover:bg-gray-50 cursor-pointer" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                {months.map((month, index) => <option key={index} value={index}>{month}</option>)}
              </select>
              <select className="text-sm border rounded-md px-3 py-1 bg-white hover:bg-gray-50 cursor-pointer" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-lg font-semibold">Perbandingan Artikel vs Berita</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
            <ResponsiveContainer width="100%" height={300}>
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
      </div>
    </div>
  );
};