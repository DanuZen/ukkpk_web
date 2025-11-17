import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Newspaper, MessageSquare, Radio, Eye, Heart } from "lucide-react";

interface ArticleStats {
  id: string;
  title: string;
  view_count: number;
  likes_count: number;
  category: string | null;
}

interface NewsStats {
  id: string;
  title: string;
  view_count: number;
  likes_count: number;
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    articles: 0,
    news: 0,
    submissions: 0,
    programs: 0,
  });
  const [topArticles, setTopArticles] = useState<ArticleStats[]>([]);
  const [topNews, setTopNews] = useState<NewsStats[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, newsRes, submissionsRes, programsRes] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("radio_programs").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        articles: articlesRes.count || 0,
        news: newsRes.count || 0,
        submissions: submissionsRes.count || 0,
        programs: programsRes.count || 0,
      });
    };

    const fetchTopContent = async () => {
      try {
        const { data: articlesData } = await supabase
          .from('articles')
          .select('id, title, view_count, likes_count, category')
          .order('view_count', { ascending: false })
          .limit(5);

        const { data: newsData } = await supabase
          .from('news')
          .select('id, title, view_count, likes_count')
          .order('view_count', { ascending: false })
          .limit(5);

        setTopArticles(articlesData || []);
        setTopNews(newsData || []);
      } catch (error) {
        console.error('Error fetching top content:', error);
      }
    };

    fetchStats();
    fetchTopContent();
  }, []);

  const statCards = [
    {
      title: "Total Artikel",
      value: stats.articles,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Berita",
      value: stats.news,
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Program Radio",
      value: stats.programs,
      icon: Radio,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Saran Masuk",
      value: stats.submissions,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang, Admin!</h2>
        <p className="text-gray-600">Ringkasan aktivitas dashboard UKKPK UNP</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p>Gunakan menu di sidebar untuk mengelola konten website UKKPK UNP.</p>
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
