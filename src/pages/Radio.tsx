import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio as RadioIcon, Play, Clock, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedSection } from "@/components/AnimatedSection";

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
  banner_image_url?: string;
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
          .select("streaming_url, banner_image_url")
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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${settings?.banner_image_url || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070'})`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <AnimatedSection animation="fade-up">
            <div className="max-w-3xl mx-auto text-center">
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

            {/* Current Program Info - Prominent Display */}
            {currentProgram ? (
              <div className="mb-8 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <RadioIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white/90 text-sm font-medium uppercase tracking-wide">SEDANG TAYANG</span>
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-1">{currentProgram.name}</h3>
                    <p className="text-white/80 text-sm mb-2">{currentProgram.description}</p>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        <span>Host: {currentProgram.host}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{DAYS[currentProgram.day_of_week]} • {currentProgram.air_time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <RadioIcon className="h-6 w-6 text-white/50" />
                  <span className="text-white/70 text-sm">Tidak ada program yang sedang tayang saat ini</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-4 justify-center items-center">
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
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Curved geometric background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-[35px] border-gray-100/60" />
          <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full border-[28px] border-gray-50" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full border-[45px] border-gray-100/50" />
          <div className="absolute top-40 right-1/4 w-24 h-24 rounded-full border-[10px] border-primary/10" />
          
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

        {/* Schedule */}
        <div className="mb-12 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
          
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <RadioIcon className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Program Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Jadwal Program
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>
          
          {programs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <RadioIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Belum ada jadwal program</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                <AnimatedSection key={program.id} animation="fade-up" delay={index * 100}>
                  <Card
                    className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
                  >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Mic className="h-7 w-7 text-primary group-hover:animate-pulse" />
                        </div>
                        {/* Live indicator if it's the current program */}
                        {currentProgram?.id === program.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                          {program.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{DAYS[program.day_of_week]}</span>
                          <span className="text-xs">•</span>
                          <span>{program.air_time}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{program.host.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Host</p>
                        <p className="text-sm font-medium">{program.host}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Radio;
