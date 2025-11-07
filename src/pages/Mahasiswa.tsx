import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Calendar, BookOpen } from "lucide-react";

const Mahasiswa = () => {
  const programs = [
    {
      icon: Users,
      title: "Rekrutmen Anggota",
      description: "Buka setiap tahun untuk mahasiswa baru yang ingin bergabung dengan UKKPK",
    },
    {
      icon: Award,
      title: "Program Pelatihan",
      description: "Workshop dan pelatihan untuk meningkatkan skill komunikasi dan penyiaran",
    },
    {
      icon: Calendar,
      title: "Kegiatan Rutin",
      description: "Meeting rutin, siaran radio, dan produksi konten media kampus",
    },
    {
      icon: BookOpen,
      title: "Pengembangan Diri",
      description: "Kesempatan untuk belajar dan berkembang di berbagai divisi",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Untuk Mahasiswa
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bergabunglah dengan UKKPK dan kembangkan kemampuan komunikasi dan penyiaran Anda
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card
                key={index}
                className="hover-scale border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Kenapa Bergabung dengan UKKPK?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-muted-foreground">Anggota Aktif</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Event per Tahun</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Divisi</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mahasiswa;
