import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio as RadioIcon, Play, Clock, Mic } from "lucide-react";

const programs = [
  {
    title: "Morning Vibes",
    time: "07:00 - 09:00",
    host: "Tim Pagi UKKPK",
    description: "Mulai hari dengan musik ceria dan berita kampus terkini",
  },
  {
    title: "Campus Talk",
    time: "12:00 - 14:00",
    host: "Angga & Siti",
    description: "Diskusi santai tentang kehidupan kampus dan isu mahasiswa",
  },
  {
    title: "Music Live",
    time: "19:00 - 21:00",
    host: "DJ Reza",
    description: "Request lagu favorit dan live performance dari musisi kampus",
  },
  {
    title: "Night Stories",
    time: "21:00 - 23:00",
    host: "Dini & Friends",
    description: "Cerita menarik dan sharing pengalaman mahasiswa",
  },
];

const Radio = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header with Live Player */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-sm font-medium">LIVE NOW</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Radio UKKPK
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Dengarkan siaran langsung radio kampus kami
          </p>

          {/* Live Player Card */}
          <Card className="max-w-2xl mx-auto border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-center gap-3 mb-2">
                <RadioIcon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Now Playing: Campus Talk</CardTitle>
              </div>
              <CardDescription>Hosted by Angga & Siti</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full max-w-xs mx-auto">
                <Play className="h-5 w-5 mr-2" />
                Dengarkan Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Jadwal Program</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="hover-scale border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mic className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{program.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {program.time}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                  <p className="text-sm font-medium">Host: {program.host}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Jadi Penyiar?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Bergabunglah dengan tim radio UKKPK dan wujudkan impian menjadi penyiar radio profesional
          </p>
          <Button size="lg">Daftar Sekarang</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Radio;
