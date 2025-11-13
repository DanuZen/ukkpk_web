import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio as RadioIcon, Play, Clock, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RadioProgram {
  id: string;
  name: string;
  description: string;
  air_time: string;
  day_of_week: number;
  host: string;
}

interface RadioSettings {
  streaming_url: string;
}

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const getCurrentProgram = (programs: RadioProgram[]) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);

  return programs.find(
    (p) => p.day_of_week === currentDay && p.air_time <= currentTime
  );
};

const Radio = () => {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [settings, setSettings] = useState<RadioSettings | null>(null);
  const [currentProgram, setCurrentProgram] = useState<RadioProgram | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: programsData } = await supabase
          .from("radio_programs")
          .select("*")
          .order("day_of_week", { ascending: true })
          .order("air_time", { ascending: true });

        const { data: settingsData } = await supabase
          .from("radio_settings")
          .select("streaming_url")
          .single();

        setPrograms(programsData || []);
        setSettings(settingsData);

        if (programsData) {
          setCurrentProgram(getCurrentProgram(programsData));
        }
      } catch (error) {
        console.error("Error fetching radio data:", error);
      }
    };

    fetchData();

    // Update current program every minute
    const interval = setInterval(() => {
      if (programs.length > 0) {
        setCurrentProgram(getCurrentProgram(programs));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [programs]);

  const handleListen = () => {
    if (settings?.streaming_url) {
      window.open(settings.streaming_url, "_blank");
    }
  };
  return (
    <Layout>
      {/* Hero Section - HostPro Style */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full mb-6">
              <RadioIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Radio #1 Kampus UNP</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              SIGMA RADIO
              <br />
              UKKPK UNP
            </h1>
            
            {/* Subtitle */}
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Platform radio kampus yang menghubungkan Anda dengan berbagai program menarik, 
              berita terkini, dan hiburan berkualitas dari UKKPK UNP.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base"
                onClick={handleListen}
              >
                <Play className="h-5 w-5 mr-2" />
                Dengar Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white px-8 py-6 text-base"
              >
                <Clock className="h-5 w-5 mr-2" />
                Lihat Jadwal
              </Button>
            </div>

            {/* Current Program Info */}
            {currentProgram && (
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/90 text-sm">LIVE NOW:</span>
                </div>
                <span className="text-white font-medium">{currentProgram.name}</span>
                <span className="text-white/60 text-sm">• {currentProgram.host}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">

        {/* Schedule */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Jadwal Program</h2>
          {programs.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada jadwal program</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <Card
                  key={program.id}
                  className="hover-scale border-border/50 hover:border-secondary/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Mic className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{program.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {DAYS[program.day_of_week]} • {program.air_time}
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Radio;
