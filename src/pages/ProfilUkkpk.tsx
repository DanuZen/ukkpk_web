import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, Eye, Megaphone, FileText, Radio, Briefcase, ClipboardList, Users2, Handshake } from 'lucide-react';
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
const ProfilUkkpk = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);

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
  const features = [{
    icon: <Megaphone className="h-8 w-8" />,
    title: 'MC & Public Speaking',
    description: 'Membina keterampilan berbicara di depan umum dan menjadi pembawa acara profesional'
  }, {
    icon: <FileText className="h-8 w-8" />,
    title: 'Jurnalistik',
    description: 'Mengembangkan kemampuan menulis berita, artikel, dan liputan mendalam'
  }, {
    icon: <Radio className="h-8 w-8" />,
    title: 'Penyiaran Radio',
    description: 'Melatih kemampuan penyiaran, produksi audio, dan manajemen program radio'
  }, {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Kewirausahaan',
    description: 'Mengembangkan jiwa entrepreneurship dan keterampilan bisnis di bidang komunikasi'
  }, {
    icon: <ClipboardList className="h-8 w-8" />,
    title: 'Kesekretariatan',
    description: 'Melatih kemampuan administrasi, manajemen dokumen, dan koordinasi organisasi'
  }, {
    icon: <Users2 className="h-8 w-8" />,
    title: 'Human Resource Development',
    description: 'Mengembangkan potensi SDM melalui pelatihan dan pengembangan anggota'
  }, {
    icon: <Handshake className="h-8 w-8" />,
    title: 'Public Relation',
    description: 'Membangun dan memelihara hubungan baik dengan stakeholder internal maupun eksternal'
  }];
  const values = [{
    icon: <Users className="h-6 w-6" />,
    title: 'Kekeluargaan',
    description: 'Membangun solidaritas dan kebersamaan antar anggota'
  }, {
    icon: <Target className="h-6 w-6" />,
    title: 'Profesionalisme',
    description: 'Mengutamakan kualitas dan dedikasi dalam setiap karya'
  }, {
    icon: <Eye className="h-6 w-6" />,
    title: 'Kreativitas',
    description: 'Mendorong inovasi dan ide-ide segar dalam komunikasi'
  }];
  return <Layout>
      {/* Banner Section */}
      {profile?.banner_url && <section className="relative w-full h-64 md:h-96 overflow-hidden">
          <img src={profile.banner_url} alt="UKKPK Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Profil UKKPK
            </h1>
          </div>
        </section>}

      {/* Hero Section (if no banner) */}
      {!profile?.banner_url && <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Unit Kegiatan Komunikasi dan Penyiaran Kampus</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Unit Kegiatan Komunikasi dan Penyiaran Kampus</p>
          </div>
        </section>}

      {/* Tentang UKKPK */}
      <section className="py-20 px-4 relative overflow-hidden bg-white">
        {/* Curved geometric background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large curved shapes */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full border-[50px] border-gray-100/70" />
          <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full border-[35px] border-gray-50" />
          <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] rounded-full border-[70px] border-gray-100/50" />
          
          {/* Small accent circles */}
          <div className="absolute top-20 right-1/4 w-32 h-32 rounded-full border-[15px] border-primary/10" />
          <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full border-[12px] border-primary/8" />
          
          {/* Dotted mesh patterns - multiple areas */}
          <div className="absolute top-0 right-0 w-1/3 h-1/2 opacity-30">
            <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          </div>
          <div className="absolute bottom-0 left-1/4 w-1/4 h-1/3 opacity-20">
            <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '15px 15px'
          }} />
          </div>
          
          {/* Curved wave lines - multiple positions */}
          <div className="absolute top-1/4 left-0 w-80 h-80">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
              <path d="M 0,80 Q 50,40 100,80 T 200,80" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,100 Q 50,60 100,100 T 200,100" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,120 Q 50,80 100,120 T 200,120" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,140 Q 50,100 100,140 T 200,140" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 right-10 w-64 h-64 rotate-180">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-15">
              <path d="M 0,100 Q 50,50 100,100 T 200,100" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,120 Q 50,70 100,120 T 200,120" stroke="#dc2626" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-3 animate-fade-in">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Tentang Kami</span>
              </div>
              
              
            </div>

            {/* Description Card */}
            <Card className="mb-16 bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 animate-fade-in">
              <CardContent className="pt-8 pb-8 relative">
                <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  {profile?.description || 'Unit Kegiatan Komunikasi dan Penyiaran Kampus (UKKPK) adalah organisasi mahasiswa yang fokus pada pengembangan keterampilan komunikasi, jurnalistik, dan penyiaran. Kami berkomitmen untuk menghasilkan komunikator handal dan profesional yang siap berkontribusi dalam dunia media dan komunikasi.'}
                </p>
              </CardContent>
            </Card>

            {/* Visi & Misi */}
            <div className="grid md:grid-cols-2 gap-8 mb-24">
              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
                <CardContent className="pt-8 pb-8 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Visi</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    UKKPK UNP dibentuk untuk membina, mendidik mental, spiritual, dan intelektual dalam rangka membentuk pribadi yang jujur, berani, disiplin, pantang menyerah, bertanggung jawab, dan mendarmabaktikan diri serta kemampuan
                    untuk kemajuan dan keberhasilan bangsa dan negara sesuai dengan Tri Darma Perguruan Tinggi.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden transition-all duration-500 animate-fade-in" style={{
              animationDelay: '100ms'
            }}>
                <CardContent className="pt-8 pb-8 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Misi</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    UKKPK UNP membekali keterampilan komunikasi untuk meningkatkan intelektualitas, kepemimpinan, penalaran, minat, kegemaran, dan kesejahteraan untuk mahasiswa UNP dan umum, terutama anggota UKKPK UNP.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sejarah Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Perjalanan Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Sejarah UKKPK
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>

            {/* Timeline Cards */}
            <div className="space-y-8">
              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 animate-fade-in">
                <CardContent className="pt-6 pb-6 relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary mb-3">Awal Terbentuk (1993)</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        UKKPK (Unit Kegiatan Komunikasi dan Penyiaran Kampus) merupakan salah satu unit kegiatan mahasiswa (UKM) yang ada di Universitas Negeri Padang (UNP). UKM ini merupakan fusi tiga UKM, yaitu UK MC, UK Radio, dan UK Penerbitan
                        Kampus, yang telah ada sebelumnya di IKIP Padang. Pada tahun 1993 ketiga tersebut bergabung dan membentuk satu kesatuan dengan nama Unit Kegiatan Komunikasi dan Penerbitan Kampus (UKKPK) IKIP Padang. Namun seiring
                        perkembangan dan kondisi waktu, pada tahun 2000 dalam MUBES III UKKPK UNP berganti nama menjadi Unit Kegiatan Komunikasi dan Penyiaran Kampus namun tetap menggunakan akronim UKKPK.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 animate-fade-in" style={{
              animationDelay: '100ms'
            }}>
                <CardContent className="pt-6 pb-6 relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary mb-3">Fokus Komunikasi & Penyiaran</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Pergantian nama ini mengingat UKKPK bukanlah UKM yang bergerak dibidang penerbitan, karena sudah ada Lembaga Pers Mahasiswa (LPM) yang menerbitkan SKK Ganto, tapi UKKPK adalah UKM yang melahirkan insan-insan yang aktif dalam
                        kegiatan yang berhubungan dengan komunikasi (jurnalis, penulis, MC/pewara, presenter, penyiar dan juga humas/PR. Lebih lanjut, sejak tahun 1999 UKKPK telah kembali mengaktifkan radio kampus sebagai satu-satunya lembaga
                        penyiaran kampus yang ada di UNP, Kiara AM. Seiring perkembangan teknologi frekuensinya digeser ke gelombang FM dan berganti nama menjadi RKM FM (Radio Komunikasi Mahasiswa). Oleh sebab itu, UKKPK lebih memfokuskan diri pada
                        pengembangan anggota dan pengaplikasian keterampilan yang berhungan dengan komunikasi dan bidang penyiaran.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 animate-fade-in" style={{
              animationDelay: '200ms'
            }}>
                <CardContent className="pt-6 pb-6 relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary mb-3">Lahirnya SIGMA FM</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Selanjutnya dalam perkembangannya radio kampus ini terus bergerak maju. Dari hanya bermodalkan sebuah tape tua hingga akhirnya memiliki tip yang cukup bagus dan dengan 'dibidani' teknisi radio yang sangat ulet, Joni Mariko,
                        RKM bisa mengudara dengan kekuatan range yang cukup luas hingga akhirnya juga memanfaatkan komputer. Seiring pergantian nama UKKPK, RKM FM juga sempat diganti menjadi Rama FM (Radio Mahasiswa) saat TM Deska K menjadi
                        koordinator radio, tapi nama ini tidak bertahan lama karena mirip dengan nama radio lain di Kota Padang. Dalam suatu rapat anggota salah seorang anggota (Havid Ardi) yang berikutnya menjadi Ketua Umum UKKPK mengusulkan nama
                        SIGMA FM. Akhirnya dalam MUBES III UKKPK, nama radio akhirnya ditetapkan menjadi SIGMA FM (Suara Intelektual Gema Mahasiswa). Nama ini tidak langsung muncul begitu saja tentunya juga mendapat saran, perbaikan, dan masukan
                        dari anggota lainnya. Awalnya Havid mengusulkan Suara Indah Gema Mahasiswa, namun diperbaiki oleh Dulfendra menjadi Suara Intelektual Gema Mahasiswa.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 animate-fade-in" style={{
              animationDelay: '300ms'
            }}>
                <CardContent className="pt-6 pb-6 relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary mb-3">Menghadapi Tantangan</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Sebagai organisasi mahasiswa UKKPK tak luput dari pasang surut dan tantangan. Seiring hadirnya zaman reformasi, pada tahun 1998 UKKPK juga mengalami dampak langsung. Pengaruh dan perubahan juga terjadi karena banyaknya
                        aktivis reformasi lahir dari UKKPK, salah satu diantaranya Gun Sugianto, mantan ketua UKKPK (berikutnya menjadi anggota DPRD Kota Padang setelah era reformasi). Namun karena hampir semua anggota juga ikut terjun dalam
                        memperjuangkan reformasi kegiatan dan kaderisasi di UKKPK juga sempat mengalami kemandegan. Pasang surut anggota, pengurus, kegiatan dan juga tantangan yang berhubungan dengan kebijakan pemerintah yang belum mengakomodir
                        radio komunitas pada saat awal berdirinya. Tak urung, pada tahun 2000 perangkat siar radio juga sempat disita aparat dengan dalih menggangu frekuensi publik. Perangkat ini sempat tertahan di tangan aparat sehingga
                        menimbulkan kevakuman di UKKPK.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-primary/20 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 animate-fade-in" style={{
              animationDelay: '400ms'
            }}>
                <CardContent className="pt-6 pb-6 relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        5
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary mb-3">Menuju Masa Depan</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        UKKPK terus mengalami pendewasaan baik keanggotaan, kepengurusan, dan juga kegiatan yang disesuaikan dengan perkembangan zaman. Diharapkan kedepan UKKPK dapat ikut aktif dalam era teknologi informasi. Sehingga UKKPK dapat
                        melahirkan komunikator sejati yang mampu berkomunikasi dengan baik dan menguasai teknologi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bidang Kegiatan */}
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        {/* Curved geometric background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full border-[40px] border-gray-100/70" />
          <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full border-[30px] border-gray-50" />
          <div className="absolute -bottom-20 right-1/3 w-[500px] h-[500px] rounded-full border-[60px] border-gray-100/50" />
          <div className="absolute top-40 left-1/4 w-28 h-28 rounded-full border-[12px] border-primary/10" />
          
          <div className="absolute top-0 left-0 w-1/4 h-1/2 opacity-25">
            <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '18px 18px'
          }} />
          </div>
          
          <div className="absolute bottom-1/4 right-0 w-72 h-72">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
              <path d="M 0,90 Q 50,50 100,90 T 200,90" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,110 Q 50,70 100,110 T 200,110" stroke="#dc2626" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center">Bidang Kegiatan</h2>
          <div className="max-w-7xl mx-auto">
            {/* Logo MICU & Bidang */}
            <div className="max-w-4xl mx-auto mb-16">
              {/* Logo MICU - Centered and Larger */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-col items-center group">
                  <div className="w-80 h-80 mb-4 p-10 transition-all duration-300 hover:scale-110 hover:rotate-3">
                    <img src={logoMicu} alt="MICU" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-lg font-semibold text-center">MICU</p>
                </div>
              </div>

              {/* 3 Logo Bidang - Grid 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {divisionLogos.map((logo, index) => <div key={index} className="flex flex-col items-center group">
                    <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden bg-muted/50 p-4 transition-all duration-300 hover:scale-110 hover:rotate-3">
                      <img src={logo.image} alt={logo.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm font-medium text-center">{logo.name}</p>
                  </div>)}
              </div>
            </div>

            {/* Baris pertama: 4 card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {features.slice(0, 4).map((feature, index) => <Card key={index} className="group transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>)}
            </div>
            
            {/* Baris kedua: 3 card centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.slice(4, 7).map((feature, index) => <Card key={index + 4} className="group transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center justify-center">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai */}
      <section className="py-16 px-4 bg-background relative overflow-hidden">
        {/* Curved geometric background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border-[35px] border-gray-100/60" />
          <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full border-[28px] border-gray-50" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full border-[45px] border-gray-100/50" />
          <div className="absolute top-32 right-1/3 w-24 h-24 rounded-full border-[10px] border-primary/10" />
          
          <div className="absolute top-0 right-0 w-1/4 h-1/3 opacity-25">
            <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '18px 18px'
          }} />
          </div>
          
          <div className="absolute bottom-1/3 left-0 w-64 h-64">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
              <path d="M 0,90 Q 50,50 100,90 T 200,90" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,110 Q 50,70 100,110 T 200,110" stroke="#dc2626" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center">Nilai-Nilai Kami</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => <Card key={index} className="text-center transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">{value.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* DPH & Pengurus per Tahun */}
      <StrukturOrganisasiSection />
    </Layout>;
};

// Component untuk menampilkan struktur organisasi per tahun
const StrukturOrganisasiSection = () => {
  const [structures, setStructures] = useState<Array<{
    id: string;
    angkatan: string;
    foto_url: string;
  }>>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  useEffect(() => {
    fetchStructures();
  }, []);
  const fetchStructures = async () => {
    const {
      data
    } = await supabase.from('struktur_organisasi').select('*').order('angkatan', {
      ascending: true
    });
    if (data && data.length > 0) {
      setStructures(data);
      setSelectedYear(data[0].angkatan);
    }
  };
  if (structures.length === 0) return null;
  const selectedStructure = structures.find(s => s.angkatan === selectedYear);
  return <section className="py-16 px-4 bg-background relative overflow-hidden">
      {/* Curved geometric background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border-[40px] border-gray-100/60" />
        <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full border-[30px] border-gray-50" />
        <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] rounded-full border-[60px] border-gray-100/50" />
        <div className="absolute top-20 left-1/3 w-28 h-28 rounded-full border-[12px] border-primary/10" />
        
        <div className="absolute top-0 left-0 w-1/4 h-1/2 opacity-25">
          <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '18px 18px'
        }} />
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-72 h-72">
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
            <path d="M 0,90 Q 50,50 100,90 T 200,90" stroke="#dc2626" strokeWidth="2" fill="none" />
            <path d="M 0,110 Q 50,70 100,110 T 200,110" stroke="#dc2626" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center">DPH & Pengurus UKKPK</h2>
        
        {structures.length > 1 && <div className="flex justify-center mb-8">
            <div className="flex gap-2 flex-wrap justify-center">
              {structures.map(structure => <Button key={structure.id} variant={selectedYear === structure.angkatan ? "default" : "outline"} onClick={() => setSelectedYear(structure.angkatan)} className="min-w-[150px]">
                  {structure.angkatan}
                </Button>)}
            </div>
          </div>}

        {selectedStructure && <div className="max-w-5xl mx-auto animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6 text-center text-primary">
              {selectedStructure.angkatan}
            </h3>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img src={selectedStructure.foto_url} alt={`Struktur ${selectedStructure.angkatan}`} className="w-full h-auto" />
            </div>
          </div>}
      </div>
    </section>;
};
export default ProfilUkkpk;