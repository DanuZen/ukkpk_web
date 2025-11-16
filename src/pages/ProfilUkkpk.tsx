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
        'Mengembangkan kemampuan menulis berita, artikel, dan liputan mendalam',
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
      {/* Hero Section with Profile Banner */}
      <AnimatedSection animation="fade-in">
        <div className="relative w-full h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: profile?.banner_url
                ? `url(${profile.banner_url})`
                : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/95"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10 px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
                Profil UKKPK
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto drop-shadow-lg">
                Unit Kegiatan Pers dan Komunikasi
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Deskripsi UKKPK - Clean White Background */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection animation="fade-up">
            <Card className="shadow-xl overflow-hidden border-none bg-card">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    {profile?.description ||
                      'Unit Kegiatan Pers dan Komunikasi (UKKPK) merupakan unit kegiatan mahasiswa yang bergerak di bidang pers, komunikasi, dan penyiaran. UKKPK menjadi wadah bagi mahasiswa untuk mengembangkan kemampuan jurnalistik, public speaking, penyiaran, dan berbagai keterampilan komunikasi lainnya.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Visi & Misi - Subtle Gradient Background */}
      <section className="py-20 px-4 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: 'var(--gradient-mesh)' }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Visi & Misi
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection animation="slide-right" delay={100}>
              <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-primary bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Eye className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">Visi</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    Menjadi unit kegiatan mahasiswa yang unggul dalam mengembangkan
                    kreativitas, profesionalisme, dan integritas di bidang pers,
                    komunikasi, dan penyiaran, serta berkontribusi aktif dalam
                    membangun karakter mahasiswa yang berwawasan luas dan
                    bertanggung jawab.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-left" delay={200}>
              <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-secondary bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-secondary/10 rounded-xl">
                      <Target className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">Misi</h3>
                  </div>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-secondary flex-shrink-0"></div>
                      <span className="text-justify">
                        Menyelenggarakan program pengembangan keterampilan
                        komunikasi dan pers secara berkelanjutan
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-secondary flex-shrink-0"></div>
                      <span className="text-justify">
                        Memfasilitasi mahasiswa dalam mengaktualisasikan potensi
                        di bidang jurnalistik dan penyiaran
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-secondary flex-shrink-0"></div>
                      <span className="text-justify">
                        Membangun jejaring komunikasi dengan berbagai pihak untuk
                        pengembangan organisasi
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat - Clean Background with Pattern */}
      <section className="py-20 px-4 bg-background relative">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'var(--bg-pattern)' }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sejarah Singkat
            </h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2"></div>

            {[
              {
                year: '2010',
                title: 'Berdirinya UKKPK',
                description:
                  'UKKPK didirikan sebagai wadah mahasiswa yang peduli terhadap pengembangan komunikasi dan pers kampus',
              },
              {
                year: '2015',
                title: 'Pengembangan Bidang',
                description:
                  'Perluasan bidang kegiatan dengan menambahkan penyiaran radio dan public speaking',
              },
              {
                year: '2020',
                title: 'Era Digital',
                description:
                  'Transformasi digital dengan fokus pada media sosial dan konten multimedia',
              },
            ].map((item, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <div
                  className={`mb-12 flex ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  } items-center gap-8`}
                >
                  <div className="flex-1">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold mt-2 mb-3 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background shadow-md z-10"></div>
                  <div className="flex-1"></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Divisi/Bidang Section - Gradient Background */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-muted/40 via-background to-muted/30">
        <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-mesh)' }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Bidang UKKPK
            </h2>
            <p className="text-center text-muted-foreground mb-16 text-lg">
              Wadah pengembangan keterampilan komunikasi mahasiswa
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {divisionLogos.map((division, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-none bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6 flex items-center justify-center h-32">
                      <img
                        src={division.image}
                        alt={division.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {division.name}
                    </h3>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Program Unggulan - White Background */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Program Unggulan
            </h2>
            <p className="text-center text-muted-foreground mb-16 text-lg">
              Kegiatan rutin yang dirancang untuk mengembangkan potensi anggota
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-none bg-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi - Subtle Muted Background */}
      <section className="py-20 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ background: 'var(--gradient-mesh)' }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Struktur Organisasi
            </h2>
            <p className="text-center text-muted-foreground mb-16 text-lg">
              Pengurus aktif UKKPK
            </p>
          </AnimatedSection>

          {profile?.organization_image_url && (
            <AnimatedSection animation="scale-in">
              <div className="mb-12 flex justify-center">
                <Card className="overflow-hidden shadow-2xl border-none max-w-4xl bg-card/90 backdrop-blur-sm">
                  <img
                    src={profile.organization_image_url}
                    alt="Struktur Organisasi"
                    className="w-full h-auto"
                  />
                </Card>
              </div>
            </AnimatedSection>
          )}

          {members.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <AnimatedSection key={member.id} animation="fade-up" delay={index * 50}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <div className="relative mb-4 rounded-lg overflow-hidden aspect-square">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Users className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nilai-Nilai UKKPK - Modern Gradient Background */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'var(--bg-pattern)' }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Nilai-Nilai UKKPK
            </h2>
            <p className="text-center text-muted-foreground mb-16 text-lg">
              Prinsip yang menjadi fondasi setiap kegiatan
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                <Card className="group h-full hover:shadow-2xl transition-all duration-300 border-none bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:rotate-6 transition-all">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilUkkpk;
