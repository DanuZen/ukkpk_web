import { Navigation } from "@/components/Navigation";
import { Users, Target, Eye, Award, Newspaper, Radio, Camera } from "lucide-react";

const ProfilUkkpk = () => {
  const features = [
    {
      icon: Newspaper,
      title: "Jurnalistik",
      description: "Meliput dan menyajikan berita kampus dengan standar jurnalistik profesional"
    },
    {
      icon: Camera,
      title: "Multimedia",
      description: "Produksi konten foto dan video berkualitas untuk dokumentasi kegiatan"
    },
    {
      icon: Radio,
      title: "Broadcasting",
      description: "Mengelola radio kampus dan produksi program audio yang edukatif"
    },
    {
      icon: Users,
      title: "Public Relations",
      description: "Membangun dan menjaga citra positif institusi melalui komunikasi efektif"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Profesionalisme",
      description: "Menjalankan tugas dengan standar profesional dan etika jurnalistik"
    },
    {
      icon: Eye,
      title: "Transparansi",
      description: "Menyampaikan informasi secara jujur, akurat, dan berimbang"
    },
    {
      icon: Award,
      title: "Inovasi",
      description: "Terus berinovasi dalam penyajian konten dan pengelolaan media"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-fade-up">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                Profil UKKPK
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-lg">
                Unit Kegiatan Pers Kampus & Komunikasi
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                Tentang UKKPK
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Unit Kegiatan Pers Kampus & Komunikasi (UKKPK) adalah organisasi mahasiswa yang bergerak dalam bidang jurnalistik, 
                komunikasi, dan media. Kami berkomitmen untuk menyajikan informasi yang akurat, berimbang, dan bermanfaat bagi 
                seluruh sivitas akademika.
              </p>
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-muted/50 border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-up">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Visi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi unit kegiatan mahasiswa yang profesional dalam bidang jurnalistik dan komunikasi, 
                  serta menjadi wadah pengembangan kompetensi mahasiswa di bidang media dan pers kampus.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-muted/50 border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Misi</h3>
                <ul className="text-muted-foreground space-y-2 leading-relaxed">
                  <li>• Menyediakan informasi kampus yang akurat dan terpercaya</li>
                  <li>• Mengembangkan kompetensi jurnalistik mahasiswa</li>
                  <li>• Membangun komunikasi efektif antar sivitas akademika</li>
                  <li>• Mengelola media kampus secara profesional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Bidang Kegiatan
            </h2>
            <p className="text-muted-foreground text-lg">
              Berbagai bidang yang kami kelola untuk menghasilkan konten berkualitas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Nilai-Nilai Kami
            </h2>
            <p className="text-muted-foreground text-lg">
              Prinsip yang kami pegang dalam setiap kegiatan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-gradient-to-br from-card to-muted/50 border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-4xl font-bold mb-6">Bergabung Bersama Kami</h2>
            <p className="text-xl mb-8 text-white/90">
              Tertarik untuk mengembangkan kemampuan jurnalistik dan komunikasi Anda? 
              Kami membuka kesempatan bagi mahasiswa untuk bergabung dengan UKKPK.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/mahasiswa"
                className="px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Info Pendaftaran
              </a>
              <a
                href="#kontak"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 UKKPK - Unit Kegiatan Pers Kampus & Komunikasi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProfilUkkpk;
