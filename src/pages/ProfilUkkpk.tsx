import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, Eye, Megaphone, FileText, Radio, Briefcase, ClipboardList, Users2, Handshake } from 'lucide-react';

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
}

const ProfilUkkpk = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);

  useEffect(() => {
    fetchMembers();
    fetchProfile();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from('organization').select('*').order('order_index', { ascending: true });
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
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: 'Kewirausahaan',
      description: 'Mengembangkan jiwa entrepreneurship dan keterampilan bisnis di bidang komunikasi',
    },
    {
      icon: <ClipboardList className="h-8 w-8" />,
      title: 'Kesekretariatan',
      description: 'Melatih kemampuan administrasi, manajemen dokumen, dan koordinasi organisasi',
    },
    {
      icon: <Users2 className="h-8 w-8" />,
      title: 'Human Resource Development',
      description: 'Mengembangkan potensi SDM melalui pelatihan dan pengembangan anggota',
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: 'Public Relation',
      description: 'Membangun dan memelihara hubungan baik dengan stakeholder internal maupun eksternal',
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
      {/* Banner Section */}
      {profile?.banner_url && (
        <section className="relative w-full h-64 md:h-96 overflow-hidden">
          <img 
            src={profile.banner_url} 
            alt="UKKPK Banner" 
            className="w-full h-full object-cover"
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
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Profil UKKPK</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Unit Kegiatan Komunikasi dan Penyiaran Kampus</p>
          </div>
        </section>
      )}

      {/* Tentang UKKPK */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Tentang UKKPK</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-justify">
              {profile?.description || 'Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang fokus pada pengembangan keterampilan komunikasi, jurnalistik, dan penyiaran. Kami berkomitmen untuk menghasilkan komunikator handal dan profesional yang siap berkontribusi dalam dunia media dan komunikasi.'}
            </p>

            {/* Visi & Misi */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold">Visi</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    UKKPK UNP dibentuk untuk membina, mendidik mental, spiritual, dan intelektual dalam rangka membentuk pribadi yang jujur, berani, disiplin, pantang menyerah, bertanggung jawab, dan mendarmabaktikan diri serta kemampuan
                    untuk kemajuan dan keberhasilan bangsa dan negara sesuai dengan Tri Darma Perguruan Tinggi.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold">Misi</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    UKKPK UNP membekali keterampilan komunikasi untuk meningkatkan intelektualitas, kepemimpinan, penalaran, minat, kegemaran, dan kesejahteraan untuk mahasiswa UNP dan umum, terutama anggota UKKPK UNP.
                  </p>
                </CardContent>
              </Card>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-center mt-20">Sejarah UKKPK</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-justify">
              <p className="mb-4">
                UKKPK (Unit Kegiatan Komunikasi dan Penyiaran Kampus) merupakan salah satu unit kegiatan mahasiswa (UKM) yang ada di Universitas Negeri Padang (UNP). UKM ini merupakan fusi tiga UKM, yaitu UK MC, UK Radio, dan UK Penerbitan
                Kampus, yang telah ada sebelumnya di IKIP Padang. Pada tahun 1993 ketiga tersebut bergabung dan membentuk satu kesatuan dengan nama Unit Kegiatan Komunikasi dan Penerbitan Kampus (UKKPK) IKIP Padang. Namun seiring
                perkembangan dan kondisi waktu, pada tahun 2000 dalam MUBES III UKKPK UNP berganti nama menjadi Unit Kegiatan Komunikasi dan Penyiaran Kampus namun tetap menggunakan akronim UKKPK.
              </p>

              <p className="mb-4">
                Pergantian nama ini mengingat UKKPK bukanlah UKM yang bergerak dibidang penerbitan, karena sudah ada Lembaga Pers Mahasiswa (LPM) yang menerbitkan SKK Ganto, tapi UKKPK adalah UKM yang melahirkan insan-insan yang aktif dalam
                kegiatan yang berhubungan dengan komunikasi (jurnalis, penulis, MC/pewara, presenter, penyiar dan juga humas/PR. Lebih lanjut, sejak tahun 1999 UKKPK telah kembali mengaktifkan radio kampus sebagai satu-satunya lembaga
                penyiaran kampus yang ada di UNP, Kiara AM. Seiring perkembangan teknologi frekuensinya digeser ke gelombang FM dan berganti nama menjadi RKM FM (Radio Komunikasi Mahasiswa). Oleh sebab itu, UKKPK lebih memfokuskan diri pada
                pengembangan anggota dan pengaplikasian keterampilan yang berhungan dengan komunikasi dan bidang penyiaran.
              </p>

              <p className="mb-4">
                Selanjutnya dalam perkembangannya radio kampus ini terus bergerak maju. Dari hanya bermodalkan sebuah tape tua hingga akhirnya memiliki tip yang cukup bagus dan dengan 'dibidani' teknisi radio yang sangat ulet, Joni Mariko,
                RKM bisa mengudara dengan kekuatan range yang cukup luas hingga akhirnya juga memanfaatkan komputer. Seiring pergantian nama UKKPK, RKM FM juga sempat diganti menjadi Rama FM (Radio Mahasiswa) saat TM Deska K menjadi
                koordinator radio, tapi nama ini tidak bertahan lama karena mirip dengan nama radio lain di Kota Padang. Dalam suatu rapat anggota salah seorang anggota (Havid Ardi) yang berikutnya menjadi Ketua Umum UKKPK mengusulkan nama
                SIGMA FM. Akhirnya dalam MUBES III UKKPK, nama radio akhirnya ditetapkan menjadi SIGMA FM (Suara Intelektual Gema Mahasiswa). Nama ini tidak langsung muncul begitu saja tentunya juga mendapat saran, perbaikan, dan masukan
                dari anggota lainnya. Awalnya Havid mengusulkan Suara Indah Gema Mahasiswa, namun diperbaiki oleh Dulfendra menjadi Suara Intelektual Gema Mahasiswa.
              </p>

              <p className="mb-4">
                Sebagai organisasi mahasiswa UKKPK tak luput dari pasang surut dan tantangan. Seiring hadirnya zaman reformasi, pada tahun 1998 UKKPK juga mengalami dampak langsung. Pengaruh dan perubahan juga terjadi karena banyaknya
                aktivis reformasi lahir dari UKKPK, salah satu diantaranya Gun Sugianto, mantan ketua UKKPK (berikutnya menjadi anggota DPRD Kota Padang setelah era reformasi). Namun karena hampir semua anggota juga ikut terjun dalam
                memperjuangkan reformasi kegiatan dan kaderisasi di UKKPK juga sempat mengalami kemandegan. Pasang surut anggota, pengurus, kegiatan dan juga tantangan yang berhubungan dengan kebijakan pemerintah yang belum mengakomodir
                radio komunitas pada saat awal berdirinya. Tak urung, pada tahun 2000 perangkat siar radio juga sempat disita aparat dengan dalih menggangu frekuensi publik. Perangkat ini sempat tertahan di tangan aparat sehingga
                menimbulkan kevakuman di UKKPK.
              </p>

              <p className="mb-4">
                UKKPK terus mengalami pendewasaan baik keanggotaan, kepengurusan, dan juga kegiatan yang disesuaikan dengan perkembangan zaman. Diharapkan kedepan UKKPK dapat ikut aktif dalam era teknologi informasi. Sehingga UKKPK dapat
                melahir komunikator sejati yang mampu berkomunikasi dengan baik dan menguasai teknologi.
              </p>
            </p>
          </div>
        </div>
      </section>

      {/* Bidang Kegiatan */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Bidang Kegiatan</h2>
          <div className="max-w-7xl mx-auto">
            {/* Baris pertama: 4 card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {features.slice(0, 4).map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Baris kedua: 3 card centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.slice(4, 7).map((feature, index) => (
                <Card key={index + 4} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              Struktur organisasi DPH Dan Pengurus UKKPK 2025
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
