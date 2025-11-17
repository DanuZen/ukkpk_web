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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch articles with views and likes
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, view_count, likes_count, category, published_at')
        .order('view_count', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch news with views and likes
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('id, title, view_count, likes_count, published_at')
        .order('view_count', { ascending: false });

      if (newsError) throw newsError;

      setArticles(articlesData || []);
      setNews(newsData || []);

      // Calculate overall stats
      const totalArticleViews = (articlesData || []).reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalArticleLikes = (articlesData || []).reduce((sum, a) => sum + (a.likes_count || 0), 0);
      const totalNewsViews = (newsData || []).reduce((sum, n) => sum + (n.view_count || 0), 0);
      const totalNewsLikes = (newsData || []).reduce((sum, n) => sum + (n.likes_count || 0), 0);

      setOverallStats({
        totalArticles: articlesData?.length || 0,
        totalNews: newsData?.length || 0,
        totalArticleViews,
        totalNewsViews,
        totalArticleLikes,
        totalNewsLikes,
        totalViews: totalArticleViews + totalNewsViews,
        totalLikes: totalArticleLikes + totalNewsLikes,
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
  const comparisonData = [
    {
      name: 'Total Views',
      Artikel: overallStats.totalArticleViews,
      Berita: overallStats.totalNewsViews,
    },
    {
      name: 'Total Likes',
      Artikel: overallStats.totalArticleLikes,
      Berita: overallStats.totalNewsLikes,
    },
    {
      name: 'Total Konten',
      Artikel: overallStats.totalArticles,
      Berita: overallStats.totalNews,
    },
  ];

  // Prepare data for category distribution (articles only)
  const categoryData = articles.reduce((acc: { [key: string]: number }, article) => {
    const category = article.category || 'Tanpa Kategori';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare top content data for bar chart
  const topContentData = [
    ...topArticles.map(a => ({
      title: a.title.length > 30 ? a.title.substring(0, 30) + '...' : a.title,
      views: a.view_count || 0,
      likes: a.likes_count || 0,
      type: 'Artikel',
    })),
    ...topNews.slice(0, 3).map(n => ({
      title: n.title.length > 30 ? n.title.substring(0, 30) + '...' : n.title,
      views: n.view_count || 0,
      likes: n.likes_count || 0,
      type: 'Berita',
    })),
  ].sort((a, b) => b.views - a.views).slice(0, 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Distribusi Kategori Artikel
            </CardTitle>
            <CardDescription>Jumlah artikel per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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

      {/* Top Articles and News Tables */}
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
