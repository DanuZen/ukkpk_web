import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const articles = [
  {
    id: "1",
    title: "Tips Menjadi Presenter Radio yang Baik",
    category: "Radio",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop",
    link: "/artikel/1",
  },
  {
    id: "2",
    title: "Teknik Fotografi untuk Pemula",
    category: "Fotografi",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop",
    link: "/artikel/2",
  },
  {
    id: "3",
    title: "Cara Membuat Konten Video yang Menarik",
    category: "Videografi",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop",
    link: "/artikel/3",
  },
  {
    id: "4",
    title: "Strategi Media Sosial untuk Organisasi",
    category: "Media Sosial",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&auto=format&fit=crop",
    link: "/artikel/4",
  },
  {
    id: "5",
    title: "Menulis Berita yang Efektif",
    category: "Jurnalistik",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop",
    link: "/artikel/5",
  },
  {
    id: "6",
    title: "Desain Grafis untuk Media Kampus",
    category: "Desain",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop",
    link: "/artikel/6",
  },
];

const Artikel = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Artikel UKKPK
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kumpulan artikel, tips, dan panduan seputar komunikasi dan penyiaran kampus
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <div
              key={article.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ArticleCard {...article} />
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Tidak ada artikel yang ditemukan
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Artikel;
