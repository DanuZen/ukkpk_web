import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

const events = [
  {
    title: "Workshop Fotografi",
    date: "15 Desember 2024",
    time: "14:00 - 17:00",
    location: "Lab Multimedia",
    status: "Upcoming",
    description: "Belajar teknik fotografi dasar dan editing foto",
  },
  {
    title: "Live Radio Show",
    date: "20 Desember 2024",
    time: "19:00 - 21:00",
    location: "Studio Radio UKKPK",
    status: "Upcoming",
    description: "Siaran langsung dengan tema musik dan budaya kampus",
  },
  {
    title: "Pelatihan Jurnalistik",
    date: "10 Desember 2024",
    time: "13:00 - 16:00",
    location: "Ruang Seminar",
    status: "Completed",
    description: "Workshop menulis berita dan wawancara",
  },
  {
    title: "Video Production Workshop",
    date: "22 Desember 2024",
    time: "10:00 - 15:00",
    location: "Studio Produksi",
    status: "Upcoming",
    description: "Belajar produksi video dari konsep hingga editing",
  },
];

const Event = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-secondary/20 via-background to-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Event & Kegiatan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Ikuti berbagai kegiatan dan acara yang diselenggarakan oleh UKKPK
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <Badge 
                      variant={event.status === "Upcoming" ? "default" : "secondary"}
                      className="text-xs px-3 py-1"
                    >
                      {event.status === "Upcoming" ? "Mendatang" : "Selesai"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Event;
