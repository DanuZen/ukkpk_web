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
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 text-primary mb-4 animate-pulse">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm font-semibold uppercase tracking-wide">LIVE NOW</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3">
            SIGMA RADIO UKKPK
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-8">
            Dengarkan siaran langsung radio kampus kami
          </p>

          {/* Now Playing Card */}
          <Card className="max-w-lg mx-auto mb-8 border-2">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <RadioIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Now Playing: {currentProgram ? currentProgram.name : "Tidak Ada Program"}
                </h2>
              </div>
              
              {currentProgram && (
                <p className="text-sm text-muted-foreground mb-4">
                  Hosted by {currentProgram.host}
                </p>
              )}
              
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={handleListen}
                disabled={!settings?.streaming_url}
              >
                <Play className="h-5 w-5 mr-2" />
                Dengarkan Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Jadwal Program</h2>
          
          {programs.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada jadwal program</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-2">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mic className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                          {program.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{program.air_time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {program.description}
                        </p>
                        <p className="text-sm font-semibold">Host: {program.host}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Radio;
