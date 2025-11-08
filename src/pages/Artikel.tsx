import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

const Artikel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.category &&
          article.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setArticles(data);
      setFilteredArticles(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Artikel</h1>
          <p className="text-muted-foreground mb-6">
            Jelajahi berbagai artikel menarik dari UKKPK
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {article.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    {article.category && (
                      <span className="text-xs font-semibold text-primary mb-2 uppercase">
                        {article.category}
                      </span>
                    )}
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.content}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Artikel tidak ditemukan" : "Belum ada artikel"}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Artikel;
