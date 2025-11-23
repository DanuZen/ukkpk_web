import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, Eye, Megaphone, FileText, Radio, Briefcase, ClipboardList, Users2, Handshake, Sparkles, Waves, Shield, Rocket, Mic, Building2 } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import logoReporter from '@/assets/logo-reporter.png';
import logoMicu from '@/assets/logo-micu-new.png';
import logoMc from '@/assets/logo-mc.png';
import logoSigmaRadio from '@/assets/logo-sigma-radio.png';

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  order_index: number | null;
}

interface ProfileSettings {
  id: string;
  banner_url: string | null;
  description: string | null;
  organization_image_url: string | null;
}

interface StrukturOrganisasi {
  id: string;
  angkatan: string;
  foto_url: string;
  created_at: string;
}

const ProfilUkkpk = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [strukturData, setStrukturData] = useState<StrukturOrganisasi[]>([]);
  const [selectedYear, setSelectedYear] = useState(0);

  // Logo bidang hardcoded
  const divisionLogos = [
    { name: 'Jurnalistik', image: logoReporter },
    { name: 'Penyiaran', image: logoSigmaRadio },
    { name: 'Kreatif Media', image: logoMc }
  ];

  useEffect(() => {
    fetchMembers();
    fetchProfile();
    fetchStrukturOrganisasi();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('organization')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) setMembers(data);
  };

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profile_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) setProfile(data);
  };

  const fetchStrukturOrganisasi = async () => {
    const { data } = await supabase
      .from('struktur_organisasi')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) setStrukturData(data);
  };

  const features = [
    {
      icon: <Megaphone className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
      title: 'Master Of Ceremony',
      description: 'Membina keterampilan berbicara di depan umum dan menjadi pembawa acara profesional'
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
      title: 'Keprotokolan',
      description: 'Mengatur tata cara dan protokol acara dengan standar profesional'
    },
    {
      icon: <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
      title: 'Jurnalistik',
      description: 'Mengembangkan kemampuan menulis berita, artikel, dan melakukan liputan yang mendalam'
    },
    {
      icon: <Radio className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
      title: 'Radio',
      description: 'Melatih kemampuan penyiaran, produksi audio, dan manajemen program radio'
    },
    {
      icon: <Building2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
      title: 'Penyiaran',
      description: 'Menghasilkan konten multimedia berkualitas untuk berbagai platform media'
    }
  ];

  const values = [
    {
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Kekeluargaan',
      description: 'Membangun solidaritas dan kebersamaan antar anggota'
    },
    {
      icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Profesionalisme',
      description: 'Mengutamakan kualitas dan dedikasi dalam setiap karya'
    },
    {
      icon: <Eye className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: 'Kreativitas',
      description: 'Mendorong inovasi dan ide-ide segar dalam komunikasi'
    }
  ];

  // Preload banner image for faster loading
  useEffect(() => {
    if (profile?.banner_url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = profile.banner_url;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [profile?.banner_url]);

  return (
    <Layout>
      <div className="scroll-smooth">
        {/* Hero Section with Banner */}
        <section className="relative h-screen flex items-center px-2 sm:px-4 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
          {/* Background Image with Dark Overlay */}
          {profile?.banner_url ? (
            <img 
              src={profile.banner_url} 
              alt="UKKPK Banner" 
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d)` }}
            ></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
          
          {/* Content */}
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="max-w-4xl mx-auto text-center text-white">
                <div className="mb-6">
                  <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/20">
                    Unit Kegiatan Mahasiswa
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="typewriter inline-block">
                    Unit Kegiatan Komunikasi dan Penyiaran Kampus
                  </span>
                </h1>
                <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                  Organisasi dan Platform Media Kampus untuk pengembangan ilmu di bidang komunikasi dan penyiaran yang dikembangkan oleh Unit Kegiatan Komunikasi dan Penyiaran Kampus Universitas Negeri Padang
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Profil UKKPK Section */}
        <section className="min-h-screen flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20">
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-[10px] sm:text-sm font-medium text-primary">Profil Kami</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  Tentang UKKPK
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100}>
              <Card className="max-w-4xl mx-auto bg-white border-primary/20 shadow-xl overflow-hidden">
                <CardContent className="pt-8 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-8 md:pt-12 md:pb-12 md:px-12">
                  <div className="space-y-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                    <p>
                      Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang bergerak dalam pengembangan bidang komunikasi dan media di lingkungan kampus.
                    </p>
                    <p>
                      UKKPK memiliki tiga bidang utama, yaitu Jurnalistik & Penyiaran, MC Dan Keprotokolan, dan Radio & Penyiaran. Melalui bidang Jurnalistik & Penyiaran, UKKPK melakukan peliputan dan penyajian informasi kampus secara akurat serta kreatif.
                    </p>
                    <p>
                      Bidang MC Dan Keprotokolan berfokus pada peningkatan kemampuan public speaking dan pembawa acara, sehingga anggota mampu tampil profesional dalam berbagai kegiatan kampus.
                    </p>
                    <p>
                      Sementara itu, bidang Radio & Penyiaran menghadirkan program siaran, podcast, serta konten audio yang informatif dan menghibur. Ketiga bidang ini saling melengkapi untuk menjadikan UKKPK sebagai wadah pengembangan bakat mahasiswa dalam dunia komunikasi dan penyiaran.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Arah & Tujuan (Visi & Misi) Section - Separate from Profil */}
        <section className="min-h-screen flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20 bg-gray-100">
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-[10px] sm:text-sm font-medium text-primary">Arah Kami</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  Visi & Misi
                </h2>
                <AnimatedSection animation="fade-up" delay={50}>
                  <p className="sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 text-xs">
                    Visi dan misi UKKPK dalam mencetak generasi mahasiswa yang kompeten, inovatif, dan profesional di bidang komunikasi dan penyiaran kampus.
                  </p>
                </AnimatedSection>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <AnimatedSection animation="slide-right" delay={200}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-8 md:pt-10 md:pb-10 md:px-10 relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px]" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-[100px]" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary shadow-xl">
                        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                        Visi
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                      Menjadi unit kegiatan yang unggul dalam menghasilkan karya komunikasi dan penyiaran yang profesional, inovatif, dan bermanfaat bagi kampus dan masyarakat.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-left" delay={300}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-8 md:pt-10 md:pb-10 md:px-10 relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px]" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-[100px]" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary shadow-xl">
                        <Rocket className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                        Misi
                      </h3>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm md:text-base text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>Mengembangkan kompetensi mahasiswa di bidang komunikasi dan penyiaran</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>Menghasilkan konten media yang berkualitas dan mendidik</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>Membangun jaringan dan kolaborasi dengan berbagai pihak</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Sejarah UKKPK */}
        <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20 bg-gray-100">
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Waves className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-[10px] sm:text-sm font-medium text-primary">Perjalanan Kami</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  Sejarah UKKPK
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="fade-up" delay={100}>
                <Card className="bg-white border-primary/20 shadow-xl">
                  <CardContent className="pt-8 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-8 md:pt-12 md:pb-12 md:px-12">
                    <div className="space-y-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                      <p>
                        UKKPK didirikan sebagai wadah bagi mahasiswa yang memiliki minat dan bakat di bidang komunikasi dan penyiaran. Sejak awal berdirinya, UKKPK telah berkomitmen untuk mengembangkan potensi mahasiswa melalui berbagai program dan kegiatan.
                      </p>
                      <p>
                        Sepanjang perjalanannya, UKKPK terus berinovasi dan berkembang mengikuti perkembangan teknologi media dan komunikasi. Dari yang awalnya fokus pada penerbitan bulletin kampus, kini UKKPK telah merambah ke berbagai platform digital.
                      </p>
                      <p>
                        Prestasi demi prestasi telah diraih oleh anggota UKKPK, baik di tingkat kampus maupun nasional. Ini membuktikan bahwa UKKPK telah berhasil mencetak mahasiswa yang kompeten dan profesional di bidangnya.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Bidang Kegiatan */}
        <section className="min-h-screen flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20">
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-[10px] sm:text-sm font-medium text-primary">Program Kami</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  Bidang Kegiatan
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="max-w-7xl mx-auto">
              {/* Logo MICU & Bidang */}
              <div className="max-w-4xl mx-auto mb-16">
                {/* Logo MICU - Centered and Larger */}
                <AnimatedSection animation="scale-in" delay={100}>
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center group">
                      <img 
                        src={logoMicu} 
                        alt="MICU" 
                        className="w-80 h-80 object-contain transition-all duration-300 hover:scale-110 hover:rotate-3 bg-transparent drop-shadow-2xl" 
                      />
                    </div>
                  </div>
                </AnimatedSection>

                {/* 3 Division Logos - Horizontal Row Below MICU */}
                <AnimatedSection animation="scale-in" delay={150}>
                  <div className="grid grid-cols-3 gap-4 mt-0">
                    {divisionLogos.map((logo, index) => (
                      <div key={index} className="flex flex-col items-center group">
                        <img 
                          src={logo.image} 
                          alt={logo.name} 
                          className="w-32 h-32 object-contain transition-all duration-300 hover:scale-110 bg-transparent drop-shadow-xl" 
                        />
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <AnimatedSection key={index} animation="fade-up" delay={200 + index * 100}>
                    <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shadow-xl group">
                      <CardContent className="pt-8 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-6">
                        <div className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Nilai-Nilai */}
        <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20 bg-gray-100">
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-[10px] sm:text-sm font-medium text-primary">Nilai Kami</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  Nilai-Nilai
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <AnimatedSection key={index} animation="scale-in" delay={100 + index * 150}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shadow-xl">
                    <CardContent className="pt-6">
                      <div className="inline-flex p-2.5 sm:p-3 rounded-full bg-primary/10 text-primary mb-4">
                        {value.icon}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                        {value.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="py-20 px-4 relative overflow-hidden bg-background">
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-[10px] sm:text-sm font-medium text-primary">Organisasi</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                  DPH & Pengurus {strukturData[selectedYear]?.angkatan || ''}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            {strukturData.length > 1 && (
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="flex justify-center gap-2 mb-12 flex-wrap">
                  {strukturData.map((item, index) => (
                    <Button
                      key={item.id}
                      variant={selectedYear === index ? "default" : "outline"}
                      onClick={() => setSelectedYear(index)}
                      className="min-w-[100px]"
                    >
                      {item.angkatan}
                    </Button>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {strukturData.length > 0 && strukturData[selectedYear] && (
              <AnimatedSection animation="fade-up" delay={200}>
                <div className="transition-opacity duration-300">
                  <img 
                    src={strukturData[selectedYear]?.foto_url} 
                    alt={`Struktur Organisasi ${strukturData[selectedYear]?.angkatan}`}
                    className="w-full rounded-lg shadow-xl"
                  />
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilUkkpk;
