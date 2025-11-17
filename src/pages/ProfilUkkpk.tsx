import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, Eye, Megaphone, FileText, Radio, Briefcase, ClipboardList, Users2, Handshake, Sparkles, Waves, Shield, Rocket, Mic } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import logoReporter from '@/assets/logo-reporter.png';
import logoMicu from '@/assets/logo-micu.png';
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

// Animated Section Wrapper Component
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';
  delay?: number;
  className?: string;
}> = ({ children, animation = 'fade-up', delay = 0, className = '' }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const animationClasses = {
    'fade-up': isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-10',
    'fade-in': isVisible ? 'opacity-100' : 'opacity-0',
    'scale-in': isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    'slide-left': isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 -translate-x-10',
    'slide-right': isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 translate-x-10',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${animationClasses[animation]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ProfilUkkpk = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);

  // Logo bidang hardcoded
  const divisionLogos = [
    { name: 'Jurnalistik', image: logoReporter },
    { name: 'Penyiaran', image: logoSigmaRadio },
    { name: 'Kreatif Media', image: logoMc },
  ];

  useEffect(() => {
    fetchMembers();
    fetchProfile();
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

  const features = [
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: 'MC & Public Speaking',
      description:
        'Membina keterampilan berbicara di depan umum dan menjadi pembawa acara profesional',
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Jurnalistik',
      description:
        'Mengembangkan kemampuan menulis berita, artikel, dan melakukan liputan yang mendalam',
    },
    {
      icon: <Radio className="h-8 w-8" />,
      title: 'Penyiaran Radio',
      description:
        'Melatih kemampuan penyiaran, produksi audio, dan manajemen program radio',
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: 'Kewirausahaan',
      description:
        'Mengembangkan jiwa entrepreneurship dan keterampilan bisnis di bidang komunikasi',
    },
    {
      icon: <ClipboardList className="h-8 w-8" />,
      title: 'Kesekretariatan',
      description:
        'Melatih kemampuan administrasi, manajemen dokumen, dan koordinasi organisasi',
    },
    {
      icon: <Users2 className="h-8 w-8" />,
      title: 'Human Resource Development',
      description:
        'Mengembangkan potensi SDM melalui pelatihan dan pengembangan anggota',
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: 'Public Relation',
      description:
        'Membangun dan memelihara hubungan baik dengan stakeholder internal maupun eksternal',
    },
  ];

  const values = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Kekeluargaan',
      description: 'Membangun solidaritas dan kebersamaan antar anggota',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Profesionalisme',
      description: 'Mengutamakan kualitas dan dedikasi dalam setiap karya',
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Kreativitas',
      description: 'Mendorong inovasi dan ide-ide segar dalam komunikasi',
    },
  ];

  return (
    <Layout>
      <div className="scroll-smooth">
        {/* Banner Section */}
      {profile?.banner_url && (
        <section className="relative w-full min-h-[60vh] overflow-hidden flex items-center">
          <img
            src={profile.banner_url}
            alt="UKKPK Banner"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Profil UKKPK
            </h1>
          </div>
        </section>
      )}

      {/* Hero Section (if no banner) */}
      {!profile?.banner_url && (
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
          <div className="container mx-auto text-center relative z-10">
            <AnimatedSection animation="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                UKKPK UNP
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unit Kegiatan Komunikasi dan Penyiaran Kampus Universitas Negeri Padang
              </p>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Tentang UKKPK */}
      <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden bg-background scroll-mt-20">

        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Tentang Kami
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Profil UKKPK
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            {/* Description Card */}
            <AnimatedSection animation="scale-in" delay={100}>
              <Card className="mb-16 bg-white border-primary/20 shadow-2xl overflow-hidden">
                <CardContent className="pt-10 pb-10 px-8 md:px-12 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-[100px]" />
                  <div className="relative z-10">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                      Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang bergerak dalam pengembangan bidang komunikasi dan media di lingkungan kampus. UKKPK memiliki tiga bidang utama, yaitu Jurnalistik, Master of Ceremony (MC), dan Radio. Melalui bidang Jurnalistik, UKKPK melakukan peliputan dan penyajian informasi kampus secara akurat serta kreatif. Bidang MC berfokus pada peningkatan kemampuan public speaking dan pembawa acara, sehingga anggota mampu tampil profesional dalam berbagai kegiatan kampus. Sementara itu, bidang Radio menghadirkan program siaran, podcast, serta konten audio yang informatif dan menghibur. Ketiga bidang ini saling melengkapi untuk menjadikan UKKPK sebagai wadah pengembangan bakat mahasiswa dalam dunia komunikasi dan penyiaran.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Visi & Misi */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Visi & Misi
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Arah & Tujuan
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <AnimatedSection animation="slide-right" delay={200}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500">
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Visi
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
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
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                        <Rocket className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Misi
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
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
      <section className="min-h-screen flex items-center scroll-mt-20 py-32 md:py-40 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Perjalanan Kami
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Sejarah UKKPK
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>
            </AnimatedSection>

            {/* Timeline Cards */}
            <div className="space-y-8">
              <AnimatedSection animation="fade-up" delay={150}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500">
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-xl">
                          <Sparkles className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-3">
                          Awal Terbentuk (1993)
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={250}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500">
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl">
                          <Mic className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-3">
                          Perkembangan Organisasi (1993-2000)
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          Pada masa awal berdirinya, UKKPK fokus mengembangkan
                          tiga bidang utama: MC dan Public Speaking, Penerbitan
                          Kampus, dan Penyiaran Radio. Ketiga bidang ini menjadi
                          fondasi kuat bagi pengembangan keterampilan komunikasi
                          mahasiswa UNP dalam berbagai aspek.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={350}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500">
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-xl">
                          <Waves className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-3">
                          Transformasi Modern (2000-2015)
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          Memasuki era digital, UKKPK mulai mengadaptasi teknologi
                          modern dalam kegiatan penyiaran dan jurnalistik. Bidang
                          penerbitan bertransformasi menjadi jurnalistik digital,
                          dan radio kampus mulai mengadopsi teknologi streaming
                          online. Perubahan ini menandai era baru UKKPK dalam
                          menghadapi perkembangan zaman.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={450}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500">
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl">
                          <Shield className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-3">
                          Ekspansi Bidang (2015-2020)
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          UKKPK terus berkembang dengan menambah berbagai bidang
                          baru seperti Kewirausahaan, Kesekretariatan, Human
                          Resource Development, dan Public Relations. Ekspansi ini
                          bertujuan untuk memberikan pengalaman yang lebih
                          komprehensif kepada anggota dalam berbagai aspek
                          komunikasi dan organisasi.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={550}>
                <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500">
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shadow-xl">
                          <Rocket className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary mb-3">
                          Era Digital & Inovasi (2020-Sekarang)
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          Di era pandemi dan pasca pandemi, UKKPK semakin
                          memperkuat kehadiran digitalnya. Berbagai inovasi
                          seperti webinar, podcast, konten media sosial, dan
                          kolaborasi lintas platform menjadi fokus utama. UKKPK
                          terus beradaptasi dan berinovasi untuk tetap relevan di
                          tengah perkembangan teknologi komunikasi yang pesat.
                        </p>
                      </div>
                    </div>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Program Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
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
                <div className="flex justify-center mb-12">
                  <div className="flex flex-col items-center group">
                    <img
                      src={logoMicu}
                      alt="MICU"
                      className="w-80 h-80 mb-4 object-contain transition-all duration-300 hover:scale-110 hover:rotate-3"
                    />
                  </div>
                </div>
              </AnimatedSection>

              {/* 3 Logo Bidang - Grid 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {divisionLogos.map((logo, index) => (
                  <AnimatedSection
                    key={index}
                    animation="scale-in"
                    delay={200 + index * 100}
                  >
                    <div className="flex flex-col items-center group">
                      <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden bg-muted/50 p-4 transition-all duration-300 hover:scale-110 hover:rotate-3">
                        <img
                          src={logo.image}
                          alt={logo.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Baris pertama: 4 card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {features.slice(0, 4).map((feature, index) => (
                <AnimatedSection
                  key={index}
                  animation="fade-up"
                  delay={100 + index * 100}
                >
                  <Card className="group transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6 text-center flex flex-col items-center">
                      <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {/* Baris kedua: 3 card centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.slice(4, 7).map((feature, index) => (
                <AnimatedSection
                  key={index + 4}
                  animation="fade-up"
                  delay={500 + index * 100}
                >
                  <Card className="group transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6 text-center flex flex-col items-center">
                      <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
      <section className="min-h-[85vh] flex items-center py-32 md:py-40 px-4 relative overflow-hidden scroll-mt-20">
        {/* Light gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background" />

        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Nilai Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Nilai-Nilai
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <AnimatedSection
                key={index}
                animation="scale-in"
                delay={100 + index * 150}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Users2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Tim Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Struktur Organisasi
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          {profile?.organization_image_url && (
            <AnimatedSection animation="scale-in" delay={100}>
              <div className="max-w-4xl mx-auto mb-12">
                <img
                  src={profile.organization_image_url}
                  alt="Struktur Organisasi UKKPK"
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </AnimatedSection>
          )}

          {members.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {members.map((member, index) => (
                <AnimatedSection
                  key={member.id}
                  animation="fade-up"
                  delay={100 + (index % 3) * 100}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      {member.photo_url && (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                        />
                      )}
                      <h3 className="text-lg font-semibold mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-primary">{member.position}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection animation="fade-in" delay={100}>
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Users2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Belum ada data struktur organisasi
                </p>
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
