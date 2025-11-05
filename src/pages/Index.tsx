import { Navigation } from "@/components/Navigation";
import { BreakingNews } from "@/components/BreakingNews";
import { ArticleCard } from "@/components/ArticleCard";
import heroImage from "@/assets/hero-communication.jpg";

const articles = [
  {
    id: "1",
    title: "UNP BEKALI 5.051 MAHASISWA JELANG KKN PERIODE JULI-DESEMBER 2025",
    category: "KEGIATAN",
    link: "/artikel/1",
  },
  {
    id: "2",
    title: "UKBA UNP GELAR TRAINING DASAR ORGANISASI 2025 WUJUDKAN MAHASISWA YANG SOLID DAN PROFESIONAL",
    category: "KEGIATAN",
    link: "/artikel/2",
  },
  {
    id: "3",
    title: "API MELALAP PABRIK KARET DI PADANG, ASAP MENJULANG HINGGA 10 KILOMETER",
    category: "BERITA",
    link: "/artikel/3",
  },
  {
    id: "4",
    title: "EXHIBITION GLAM 2025 USUNG SEMANGAT KREANOVA: WADAH INOVASI MAHASISWA DALAM LITERASI DAN INFORMASI",
    category: "EVENT",
    link: "/artikel/4",
  },
  {
    id: "5",
    title: "SOSIALISASI PKM DAN PPK ORMAWA UNIVERSITAS NEGERI PADANG",
    category: "KEGIATAN",
    link: "/artikel/5",
  },
  {
    id: "6",
    title: "DONOR DARAH, DONOR NYAWA: AKSI KEMANUSIAAN MAHASISWA UNTUK SESAMA",
    category: "KEGIATAN",
    link: "/artikel/6",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BreakingNews />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Unit Komunikasi Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Unit Komunikasi
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Portal Informasi Resmi - Menyampaikan Berita Terkini dan Kegiatan Organisasi
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Unit Komunikasi</h3>
              <p className="text-sm text-muted-foreground">
                Menyampaikan informasi terkini dan membangun komunikasi yang efektif
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Menu</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/profil" className="hover:text-primary transition-colors">Profil</a></li>
                <li><a href="/artikel" className="hover:text-primary transition-colors">Artikel</a></li>
                <li><a href="/event" className="hover:text-primary transition-colors">Event</a></li>
                <li><a href="/kontak" className="hover:text-primary transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <p className="text-sm text-muted-foreground">
                Email: info@unitkom.org<br />
                Telepon: (021) 1234-5678
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Unit Komunikasi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
