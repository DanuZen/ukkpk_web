import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, Eye, Megaphone, FileText, Radio } from 'lucide-react';

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  order_index: number | null;
}

const ProfilUkkpk = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from('organization').select('*').order('order_index', { ascending: true });

    if (data) setMembers(data);
  };

  const features = [
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: 'MC & Public Speaking',
      description: 'Membina keterampilan berbicara di depan umum dan menjadi pembawa acara profesional',
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Jurnalistik',
      description: 'Mengembangkan kemampuan menulis berita, artikel, dan liputan mendalam',
    },
    {
      icon: <Radio className="h-8 w-8" />,
      title: 'Penyiaran Radio',
      description: 'Melatih kemampuan penyiaran, produksi audio, dan manajemen program radio',
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
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Profil UKKPK</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Unit Kegiatan Komunikasi dan Penyiaran Kampus</p>
        </div>
      </section>

      {/* Tentang UKKPK */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Tentang UKKPK</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang fokus pada pengembangan keterampilan komunikasi, jurnalistik, dan penyiaran. Kami berkomitmen untuk menghasilkan komunikator handal dan
              profesional yang siap berkontribusi dalam dunia media dan komunikasi.
            </p>

            {/* Visi & Misi */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold">Visi</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">Menjadi wadah pengembangan komunikator yang kreatif, inovatif, dan profesional dalam bidang komunikasi dan penyiaran kampus.</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold">Misi</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Mengembangkan keterampilan komunikasi mahasiswa</li>
                    <li>• Menciptakan karya jurnalistik berkualitas</li>
                    <li>• Mengelola media kampus yang informatif</li>
                    <li>• Membangun jaringan komunikasi yang solid</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bidang Kegiatan */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Bidang Kegiatan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai-Nilai */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Nilai-Nilai Kami</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">{value.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Struktur Organisasi</h2>
          {members.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {members.map((member) => (
                <Card key={member.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4 mx-auto w-24 h-24 rounded-full overflow-hidden bg-muted group-hover:scale-105 transition-transform">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Struktur organisasi akan segera diperbarui
              <div className="mt-8 max-w-4xl mx-auto">
                <img src="/images/struktur.jpg" alt="Struktur Organisasi UKKPK 2025" className="w-full h-auto rounded-lg shadow-lg" />
              </div>
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Bergabung Bersama Kami</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Kembangkan potensimu di bidang komunikasi dan penyiaran bersama UKKPK</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/event" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Lihat Event
            </a>
            <a href="/artikel" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
              Baca Artikel
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilUkkpk;
