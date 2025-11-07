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
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Event UKKPK
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ikuti berbagai kegiatan dan event menarik dari UKKPK
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <Card
              key={index}
              className="hover-scale border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Badge
                    variant={event.status === "Upcoming" ? "default" : "secondary"}
                  >
                    {event.status}
                  </Badge>
                </div>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Event;
