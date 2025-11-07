import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import heroImage from "@/assets/hero-communication.jpg";

const articles = [{
  id: "1",
  title: "UNP BEKALI 5.051 MAHASISWA JELANG KKN PERIODE JULI-DESEMBER 2025",
  category: "KEGIATAN",
  link: "/artikel/1"
}, {
  id: "2",
  title: "UKBA UNP GELAR TRAINING DASAR ORGANISASI 2025 WUJUDKAN MAHASISWA YANG SOLID DAN PROFESIONAL",
  category: "KEGIATAN",
  link: "/artikel/2"
}, {
  id: "3",
  title: "API MELALAP PABRIK KARET DI PADANG, ASAP MENJULANG HINGGA 10 KILOMETER",
  category: "BERITA",
  link: "/artikel/3"
}, {
  id: "4",
  title: "EXHIBITION GLAM 2025 USUNG SEMANGAT KREANOVA: WADAH INOVASI MAHASISWA DALAM LITERASI DAN INFORMASI",
  category: "EVENT",
  link: "/artikel/4"
}, {
  id: "5",
  title: "SOSIALISASI PKM DAN PPK ORMAWA UNIVERSITAS NEGERI PADANG",
  category: "KEGIATAN",
  link: "/artikel/5"
}, {
  id: "6",
  title: "DONOR DARAH, DONOR NYAWA: AKSI KEMANUSIAAN MAHASISWA UNTUK SESAMA",
  category: "KEGIATAN",
  link: "/artikel/6"
}];

const Index = () => {
  return (
    <Layout>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="UKKPK Hero" className="w-full h-full object-cover scale-105 animate-[scale-in_1.5s_ease-out]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent mix-blend-multiply" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-fade-up">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                <span className="block">Unit Kegiatan</span>
                <span className="block mt-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Komunikasi dan Penyiaran Kampus</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/95 max-w-3xl mx-auto mb-8 drop-shadow-lg font-medium">
                Portal Informasi Resmi - Menyampaikan Berita Terkini dan Kegiatan Organisasi
              </p>
              <div className="flex gap-4 justify-center">
                <a href="#artikel" className="px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl">
                  Baca Artikel
                </a>
                <a href="/profil-ukkpk" className="px-8 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                  Tentang UKKPK
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </section>

      {/* Articles Section */}
      <section id="artikel" className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Berita & Artikel Terkini
            </h2>
            <p className="text-muted-foreground text-lg">
              Informasi terbaru seputar kegiatan dan event UKKPK
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={article.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Index;