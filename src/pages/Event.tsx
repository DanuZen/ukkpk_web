import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
}

const getEventStatus = (eventDate: string, eventTime: string) => {
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);
  const now = new Date();
  return eventDateTime > now ? "Mendatang" : "Selesai";
};

const Event = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-red-500/20 via-background to-red-600/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
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
          {loading ? (
            <p className="text-center text-muted-foreground">Memuat event...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada event yang tersedia</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event) => {
                const status = getEventStatus(event.event_date, event.event_time);
                return (
                  <Card 
                    key={event.id} 
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-red-500/50"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl group-hover:text-red-600 transition-colors">
                          {event.name}
                        </CardTitle>
                        <Badge 
                          variant={status === "Mendatang" ? "default" : "secondary"}
                          className="text-xs px-3 py-1"
                        >
                          {status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span className="font-medium">
                          {new Date(event.event_date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{event.event_time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{event.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Event;
