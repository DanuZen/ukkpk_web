import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, Eye, Megaphone, FileText, Radio, Briefcase, ClipboardList, Users2, Handshake, Sparkles, Waves, Shield, Rocket, Mic, Building2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
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

// Animated Section Wrapper Component
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';
  delay?: number;
  className?: string;
}> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className = ''
}) => {
  const {
    ref,
    isVisible
  } = useScrollAnimation({
    threshold: 0.1
  });
  const animationClasses = {
    'fade-up': isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
    'fade-in': isVisible ? 'opacity-100' : 'opacity-0',
    'scale-in': isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    'slide-left': isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10',
    'slide-right': isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
  };
  return <div ref={ref} className={`transition-all duration-700 ease-out ${animationClasses[animation]} ${className}`} style={{
    transitionDelay: `${delay}ms`
  }}>
      {children}
    </div>;
};
const ProfilUkkpk = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [strukturData, setStrukturData] = useState<StrukturOrganisasi[]>([]);
  const [selectedYear, setSelectedYear] = useState(0);

  // Logo bidang hardcoded
  const divisionLogos = [{
    name: 'Jurnalistik',
    image: logoReporter
  }, {
    name: 'Penyiaran',
    image: logoSigmaRadio
  }, {
    name: 'Kreatif Media',
    image: logoMc
  }];
  useEffect(() => {
    fetchMembers();
    fetchProfile();
    fetchStrukturOrganisasi();
  }, []);
  const fetchMembers = async () => {
    const {
      data
    } = await supabase.from('organization').select('*').order('order_index', {
      ascending: true
    });
    if (data) setMembers(data);
  };
  const fetchProfile = async () => {
    const {
      data
    } = await supabase.from('profile_settings').select('*').limit(1).maybeSingle();
    if (data) setProfile(data);
  };
  const fetchStrukturOrganisasi = async () => {
    const {
      data
    } = await supabase.from('struktur_organisasi').select('*').order('created_at', {
      ascending: true
    });
    if (data) setStrukturData(data);
  };
  const features = [{
    icon: <Megaphone className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'MC Dan Keprotokolan',
    description: 'Membina keterampilan berbicara di depan umum dan menjadi pembawa acara profesional'
  }, {
    icon: <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'Jurnalistik & Penyiaran',
    description: 'Mengembangkan kemampuan menulis berita, artikel, dan melakukan liputan yang mendalam'
  }, {
    icon: <Radio className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'Radio & Penyiaran',
    description: 'Melatih kemampuan penyiaran, produksi audio, dan manajemen program radio'
  }, {
    icon: <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'Biro Kewirausahaan',
    description: 'Mengembangkan jiwa entrepreneurship dan keterampilan bisnis di bidang komunikasi'
  }, {
    icon: <ClipboardList className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'Biro Kesekretariatan',
    description: 'Melatih kemampuan administrasi, manajemen dokumen, dan koordinasi organisasi'
  }, {
    icon: <Users2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'Human Resource Development',
    description: 'Mengembangkan potensi SDM melalui pelatihan dan pengembangan anggota'
  }, {
    icon: <Handshake className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: 'Public Relation',
    description: 'Membangun dan memelihara hubungan baik dengan stakeholder internal maupun eksternal'
  }];
  const values = [{
    icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: 'Kekeluargaan',
    description: 'Membangun solidaritas dan kebersamaan antar anggota'
  }, {
    icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: 'Profesionalisme',
    description: 'Mengutamakan kualitas dan dedikasi dalam setiap karya'
  }, {
    icon: <Eye className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: 'Kreativitas',
    description: 'Mendorong inovasi dan ide-ide segar dalam komunikasi'
  }];
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

  return <Layout>
      <div className="scroll-smooth">
        {/* Hero Section with Banner */}
        <section className="relative h-screen flex items-center px-4 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
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
            <div className="absolute inset-0 bg-cover bg-center" style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d)`
            }}></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
          
          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                {/* Badge */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-5 md:py-2.5 lg:px-5 lg:py-2.5 rounded-full">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 text-white" />
                    <span className="text-xs sm:text-sm md:text-sm lg:text-sm font-medium">Unit Kegiatan Kampus UNP</span>
                  </div>
                </div>
                
                {/* Heading with Typewriter Animation */}
                <div className="overflow-hidden inline-block max-w-full">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white whitespace-nowrap inline-block drop-shadow-2xl typewriter-text-profil">
                    UKKPK UNP
                  </h1>
                </div>
                <style>{`
                  .typewriter-text-profil {
                    width: 0;
                    overflow: hidden;
                    border-right: 4px solid white;
                    animation: 
                      typing-profil 2s steps(9) 0.5s forwards,
                      blink-profil 0.75s step-end infinite;
                    animation-delay: 0.5s, 0.5s;
                  }
                  
                  @keyframes typing-profil {
                    from { width: 0; }
                    to { width: 100%; }
                  }
                  
                  @keyframes blink-profil {
                    50% { border-color: transparent; }
                  }
                  
                  .typewriter-text-profil {
                    animation: 
                      typing-profil 2s steps(9) 0.5s forwards,
                      blink-profil 0.75s step-end 0.5s 4,
                      remove-border-profil 0.01s 3.5s forwards;
                  }
                  
                  @keyframes remove-border-profil {
                    to { border-right-color: transparent; }
                  }
                `}</style>
                
                {/* Subtitle */}
                <AnimatedSection animation="fade-up" delay={50}>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/80 px-4">
                    Unit Kegiatan Komunikasi dan Penyiaran Kampus Universitas Negeri Padang
                  </p>
                </AnimatedSection>

                
              </div>
            </AnimatedSection>
          </div>
        </section>

      {/* Tentang UKKPK */}
      <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden bg-background scroll-mt-20">
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 animate-pulse" />
                  TENTANG KAMI
                </span>
              </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Profil <span className="text-primary">UKKPK</span>
                </h2>
                <AnimatedSection animation="fade-up" delay={50}>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                    Kenali lebih dekat Unit Kegiatan Komunikasi dan Penyiaran Kampus, wadah pengembangan talenta mahasiswa di bidang komunikasi dan media kampus.
                  </p>
                </AnimatedSection>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            {/* Description Card */}
            <AnimatedSection animation="scale-in" delay={100}>
              <Card className="bg-white border-primary/20 shadow-2xl overflow-hidden">
                <CardContent className="pt-10 pb-10 px-8 md:px-12 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-[100px]" />
                  <div className="relative z-10">
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-justify">
                      Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang bergerak dalam pengembangan bidang komunikasi dan media di lingkungan kampus. UKKPK memiliki tiga bidang utama, yaitu Jurnalistik, Master of Ceremony (MC), dan Radio. Melalui bidang Jurnalistik, UKKPK melakukan peliputan dan penyajian informasi kampus secara akurat serta kreatif. Bidang MC berfokus pada peningkatan kemampuan public speaking dan pembawa acara, sehingga anggota mampu tampil profesional dalam berbagai kegiatan kampus. Sementara itu, bidang Radio menghadirkan program siaran, podcast, serta konten audio yang informatif dan menghibur. Ketiga bidang ini saling melengkapi untuk menjadikan UKKPK sebagai wadah pengembangan bakat mahasiswa dalam dunia komunikasi dan penyiaran.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden bg-background scroll-mt-20">
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-block mb-4">
                  <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
                    <Eye className="w-4 h-4 animate-pulse" />
                    VISI & MISI
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Arah & <span className="text-primary">Tujuan</span>
                </h2>
                <AnimatedSection animation="fade-up" delay={50}>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                    Visi dan misi UKKPK dalam mencetak generasi mahasiswa yang kompeten, inovatif, dan profesional di bidang komunikasi dan penyiaran kampus.
                  </p>
                </AnimatedSection>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <AnimatedSection animation="slide-right" delay={200}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Visi
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      Menjadikan UKKPK UNP sebagai wadah yang disiplin, inovatif,
                      dan kreatif dalam mewujudkan mahasiswa yang berintelektual
                      dan berkompeten di bidang komunikasi dan penyiaran yang
                      berbudi luhur.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-left" delay={300}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Rocket className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Misi
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      UKKPK UNP membekali keterampilan komunikasi untuk
                      meningkatkan intelektualitas, kepemimpinan, penalaran,
                      minat, kegemaran, dan kesejahteraan untuk mahasiswa UNP dan
                      umum, terutama anggota UKKPK UNP.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="min-h-screen flex items-center scroll-mt-20 py-32 md:py-40 px-4 bg-gray-100">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="text-center mb-12">
                <div className="inline-block mb-4">
                  <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 animate-pulse" />
                    PERJALANAN KAMI
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Sejarah <span className="text-primary">UKKPK</span>
                </h2>
                <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                  Perjalanan panjang UKKPK dari masa ke masa dalam mengembangkan komunikasi dan penyiaran kampus
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            {/* Timeline Cards */}
            <div className="flex flex-col gap-8 mb-16 max-w-4xl mx-auto">
              <AnimatedSection animation="fade-up" delay={150}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Awal Terbentuk (1993)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      UKKPK (Unit Kegiatan Komunikasi dan Penyiaran Kampus)
                      merupakan salah satu unit kegiatan mahasiswa (UKM) yang
                      ada di Universitas Negeri Padang (UNP). UKM ini
                      merupakan fusi tiga UKM, yaitu UK MC, UK Radio, dan UK
                      Penerbitan Kampus, yang telah ada sebelumnya di IKIP
                      Padang. Pada tahun 1993 ketiga tersebut bergabung dan
                      membentuk satu kesatuan dengan nama Unit Kegiatan
                      Komunikasi dan Penerbitan Kampus (UKKPK) IKIP Padang.
                      Namun seiring perkembangan dan kondisi waktu, pada tahun
                      2000 dalam MUBES III UKKPK UNP berganti nama menjadi
                      Unit Kegiatan Komunikasi dan Penyiaran Kampus namun
                      tetap menggunakan akronim UKKPK.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Mic className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Perkembangan Organisasi (1993-2000)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      Pada masa awal berdirinya, UKKPK fokus mengembangkan tiga
                      bidang utama: MC dan Public Speaking, Penerbitan Kampus,
                      dan Penyiaran Radio. Ketiga bidang ini menjadi fondasi
                      kuat bagi pengembangan keterampilan komunikasi mahasiswa
                      UNP dalam berbagai aspek.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={250}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Waves className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Transformasi Modern (2000-2015)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      Memasuki era digital, UKKPK mulai mengadaptasi teknologi
                      modern dalam kegiatan penyiaran dan jurnalistik. Bidang
                      penerbitan bertransformasi menjadi jurnalistik digital,
                      dan radio kampus mulai mengadopsi teknologi streaming
                      online. Perubahan ini menandai era baru UKKPK dalam
                      menghadapi perkembangan zaman.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={300}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Rocket className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Ekspansi Bidang (2015-2020)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      UKKPK terus berkembang dengan menambah berbagai bidang
                      baru seperti Kewirausahaan, Kesekretariatan, Human
                      Resource Development, dan Public Relations. Ekspansi ini
                      bertujuan untuk memberikan pengalaman yang lebih
                      komprehensif kepada anggota dalam berbagai aspek
                      komunikasi dan organisasi.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={350}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Shield className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Era Digital & Inovasi (2020-Sekarang)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                      Di era pandemi dan pasca pandemi, UKKPK semakin memperkuat
                      kehadiran digitalnya. Berbagai inovasi seperti webinar,
                      podcast, konten media sosial, dan kolaborasi lintas
                      platform menjadi fokus utama. UKKPK terus beradaptasi dan
                      berinovasi untuk tetap relevan di tengah perkembangan
                      teknologi komunikasi yang pesat.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Bidang Kegiatan */}
      <section className="min-h-screen flex items-center py-32 md:py-40 px-4 relative overflow-hidden bg-background scroll-mt-20">
        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4 animate-pulse" />
                  PROGRAM KAMI
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Bidang <span className="text-primary">Kegiatan</span>
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                Berbagai bidang kegiatan yang menjadi wadah pengembangan skill dan bakat mahasiswa di dunia komunikasi
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          <div className="max-w-7xl mx-auto">
            {/* Logo MICU & Bidang */}
            <div className="max-w-4xl mx-auto mb-16">
              {/* Logo MICU - Centered and Larger */}
              <AnimatedSection animation="scale-in" delay={100}>
                <div className="flex justify-center mb-4">
                  <div className="flex flex-col items-center group">
                    <img src={logoMicu} alt="MICU" className="w-80 h-80 mb-4 object-contain transition-all duration-300 hover:scale-110 hover:rotate-3 bg-transparent drop-shadow-2xl" />
                  </div>
                </div>
              </AnimatedSection>

              {/* 3 Logo Bidang - Grid 3 Columns */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
                {divisionLogos.map((logo, index) => <AnimatedSection key={index} animation="scale-in" delay={200 + index * 100}>
                    <div className="flex flex-col items-center group">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-lg overflow-hidden p-4 transition-all duration-300 hover:scale-110 hover:rotate-3 bg-transparent">
                        <img src={logo.image} alt={logo.name} className="w-full h-full object-contain drop-shadow-xl" />
                      </div>
                    </div>
                  </AnimatedSection>)}
              </div>
            </div>

            {/* Baris pertama: 4 card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {features.slice(0, 4).map((feature, index) => <AnimatedSection key={index} animation="fade-up" delay={100 + index * 100}>
                  <Card className="group transition-all duration-300 hover:-translate-y-1 shadow-lg">
                    <CardContent className="pt-6 text-center flex flex-col items-center">
                      <div className="inline-flex p-3 sm:p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
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
                </AnimatedSection>)}
            </div>

            {/* Baris kedua: 3 card centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.slice(4, 7).map((feature, index) => <AnimatedSection key={index + 4} animation="fade-up" delay={500 + index * 100}>
                  <Card className="group transition-all duration-300 hover:-translate-y-1 shadow-lg">
                    <CardContent className="pt-6 text-center flex flex-col items-center">
                      <div className="inline-flex p-3 sm:p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
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
                </AnimatedSection>)}
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai */}
      <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20 bg-gray-100">
        {/* Light gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />

        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  NILAI KAMI
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Nilai-<span className="text-primary">Nilai</span>
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                Prinsip dan nilai-nilai yang menjadi landasan dalam setiap kegiatan dan karya UKKPK
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => <AnimatedSection key={index} animation="scale-in" delay={100 + index * 150}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shadow-lg">
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
              </AnimatedSection>)}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-20 px-4 relative overflow-hidden bg-background">
        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-2">
                  <Users2 className="w-4 h-4 animate-pulse" />
                  TIM KAMI
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Struktur <span className="text-primary">Organisasi</span>
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                Kenali tim pengurus dan struktur organisasi UKKPK yang solid dan profesional
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          {strukturData.length > 0 ? <AnimatedSection animation="fade-in" delay={100}>
              <div className="max-w-5xl mx-auto mb-8">
                {strukturData.length > 1 && <div className="flex justify-center gap-3 mb-8">
                    {strukturData.map((struktur, index) => <Button key={struktur.id} variant={selectedYear === index ? "default" : "outline"} onClick={() => setSelectedYear(index)} className="min-w-[140px] transition-all duration-300 hover:scale-105" size="lg">
                        {struktur.angkatan}
                      </Button>)}
                  </div>}
                <div className="text-center mb-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    {strukturData[selectedYear]?.angkatan}
                  </h3>
                </div>
                <div className="transition-opacity duration-300">
                  <img src={strukturData[selectedYear]?.foto_url} alt={`Struktur Organisasi ${strukturData[selectedYear]?.angkatan}`} className="w-full rounded-lg shadow-xl" />
                </div>
              </div>
            </AnimatedSection> : null}

          {members.length > 0 && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {members.map((member, index) => <AnimatedSection key={member.id} animation="fade-up" delay={100 + index % 3 * 100}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      {member.photo_url && <img src={member.photo_url} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />}
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-primary">{member.position}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>)}
            </div>}
        </div>
      </section>
      </div>
    </Layout>;
};
export default ProfilUkkpk;