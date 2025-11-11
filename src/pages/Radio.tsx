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
      {/* Hero Section with Gradient */}
      <section className="relative py-20 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] opacity-5 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full mb-4">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">LIVE NOW</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              SIGMA RADIO UKKPK
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Dengarkan siaran langsung radio kampus kami
            </p>

            {/* Live Player Card */}
            <Card className="max-w-2xl mx-auto border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <RadioIcon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">
                    Now Playing: {currentProgram?.name || "Off Air"}
                  </CardTitle>
                </div>
                {currentProgram && (
                  <CardDescription>Hosted by {currentProgram.host}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full max-w-xs mx-auto"
                  onClick={handleListen}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Dengarkan Sekarang
                </Button>
              </CardContent>
            </Card>
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
