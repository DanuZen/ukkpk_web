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
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  const topArticles = articles.slice(0, 5);
  const topNews = news.slice(0, 5);

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
        <p className="text-muted-foreground">Memuat data analytics...</p>
      </div>;
  }
  return <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{overallStats.engagementRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Likes per View
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Artikel</CardTitle>
            <Eye className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{overallStats.avgArticleViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per artikel
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Berita</CardTitle>
            <Eye className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{overallStats.avgNewsViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per berita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {Math.round((overallStats.avgArticleLikes + overallStats.avgNewsLikes) / 2).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Likes rata-rata
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Artikel: {overallStats.totalArticleViews.toLocaleString()} | Berita: {overallStats.totalNewsViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Artikel: {overallStats.totalArticleLikes.toLocaleString()} | Berita: {overallStats.totalNewsLikes.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallStats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Views: {overallStats.totalArticleViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
            <Newspaper className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.totalNews}</div>
            <p className="text-xs text-muted-foreground">
              Views: {overallStats.totalNewsViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Perbandingan Artikel vs Berita
            </CardTitle>
            <CardDescription>Statistik views, likes, dan jumlah konten</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Artikel" fill="#dc2626" />
                <Bar dataKey="Berita" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        
      </div>

      {/* Top Content Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Konten Paling Populer
          </CardTitle>
          <CardDescription>Top 8 artikel dan berita berdasarkan views dan likes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topContentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#dc2626" name="Views" />
              <Bar dataKey="likes" fill="#f43f5e" name="Likes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>;
};