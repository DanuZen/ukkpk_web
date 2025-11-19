import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio as RadioIcon, Play, Clock, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedSection } from "@/components/AnimatedSection";
import logoSigmaRadio from "@/assets/logo-sigma-radio.png";
interface RadioProgram {
  id: string;
  name: string;
  description: string;
  air_time: string;
  end_time?: string;
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
  return programs.find(p => p.day_of_week === currentDay && p.air_time <= currentTime);
};
const Radio = () => {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [settings, setSettings] = useState<RadioSettings | null>(null);
  const [currentProgram, setCurrentProgram] = useState<RadioProgram | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const filteredPrograms = programs.filter(p => p.day_of_week === selectedDay);
  const handlePreviousDay = () => {
    setSelectedDay(prev => prev === 0 ? 6 : prev - 1);
  };
  const handleNextDay = () => {
    setSelectedDay(prev => prev === 6 ? 0 : prev + 1);
  };
  const handleToday = () => {
    setSelectedDay(new Date().getDay());
  };
  const calculateTimeRemaining = (program: RadioProgram) => {
    const now = new Date();
    
    // If program has end_time, use it; otherwise assume 1 hour duration
    let endTime = new Date();
    if (program.end_time) {
      const [endHours, endMinutes] = program.end_time.split(':').map(Number);
      endTime.setHours(endHours, endMinutes, 0, 0);
    } else {
      const [hours, minutes] = program.air_time.split(':').map(Number);
      const endHour = (hours + 1) % 24;
      endTime.setHours(endHour, minutes, 0, 0);
    }

    // If end time is before current time, it means program has ended
    if (endTime < now) {
      return "Program telah berakhir";
    }
    const diff = endTime.getTime() - now.getTime();
    const minutesLeft = Math.floor(diff / 60000);
    const secondsLeft = Math.floor(diff % 60000 / 1000);
    if (minutesLeft > 0) {
      return `${minutesLeft} menit ${secondsLeft} detik tersisa`;
    } else {
      return `${secondsLeft} detik tersisa`;
    }
  };
  useEffect(() => {
    if (currentProgram) {
      // Update countdown every second
      const countdownInterval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(currentProgram));
      }, 1000);

      // Initial calculation
      setTimeRemaining(calculateTimeRemaining(currentProgram));
      return () => clearInterval(countdownInterval);
    }
  }, [currentProgram]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: programsData
        } = await supabase.from("radio_programs").select("*").order("day_of_week", {
          ascending: true
        }).order("air_time", {
          ascending: true
        });
        const {
          data: settingsData
        } = await supabase.from("radio_settings").select("streaming_url, banner_image_url").single();
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
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 bg-gradient-to-br from-primary/20 to-background overflow-hidden">
        {/* Background Image with Dark Overlay - Only if set by admin */}
        {settings?.banner_image_url && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{
              backgroundImage: `url(${settings.banner_image_url})`
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
          </>
        )}
        
        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-5 lg:py-2.5 rounded-full">
                  <RadioIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  <span className="text-xs sm:text-sm md:text-base lg:text-sm font-medium">Radio #1 Kampus UNP</span>
                </div>
              </div>
              
              <div className="overflow-hidden inline-block max-w-full">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white whitespace-nowrap inline-block drop-shadow-2xl typewriter-text">
                  SIGMA RADIO
                </h1>
              </div>
              <style>{`
                .typewriter-text {
                  width: 0;
                  overflow: hidden;
                  border-right: 4px solid white;
                  animation: 
                    typing 2s steps(11) 0.5s forwards,
                    blink 0.75s step-end infinite;
                  animation-delay: 0.5s, 0.5s;
                }
                
                @keyframes typing {
                  from { width: 0; }
                  to { width: 100%; }
                }
                
                @keyframes blink {
                  50% { border-color: transparent; }
                }
                
                .typewriter-text {
                  animation: 
                    typing 2s steps(11) 0.5s forwards,
                    blink 0.75s step-end 0.5s 4,
                    remove-border 0.01s 3.5s forwards;
                }
                
                @keyframes remove-border {
                  to { border-right-color: transparent; }
                }
              `}</style>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground px-4">
                Platform radio kampus yang menghubungkan Anda dengan berbagai program menarik, 
                berita terkini, dan hiburan berkualitas dari UKKPK UNP.
              </p>

            {/* Current Program Info - Prominent Display */}
            {currentProgram ? <div className="mb-8 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-green-500/50">
                      <img src={logoSigmaRadio} alt="SIGMA Radio" className="h-7 w-7 object-contain brightness-0 invert" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white/90 text-sm font-medium uppercase tracking-wide">SEDANG TAYANG</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold mb-2">
                      {currentProgram.name} <span className="text-white/80 font-normal">By</span> {currentProgram.host}
                    </h3>
                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 mt-3 bg-white/5 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-fit">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white/70" />
                      <span className="text-white/90 text-xs sm:text-sm font-medium">{timeRemaining}</span>
                    </div>
                  </div>
                </div>
              </div> : <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <RadioIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white/50" />
                  <span className="text-white/70 text-xs sm:text-sm">Tidak ada program yang sedang tayang saat ini</span>
                </div>
              </div>}

            {/* Buttons */}
            <div className="flex flex-col gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 text-xs sm:text-sm md:text-base" onClick={handleListen}>
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Dengar Sekarang
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 text-xs sm:text-sm md:text-base" onClick={() => document.getElementById('jadwal-program')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })}>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Lihat Jadwal
              </Button>
            </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      {/* Now Playing & Schedule Section */}
      <section className="flex items-center py-8 md:py-32 lg:py-40 scroll-mt-20 relative bg-background overflow-hidden">
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

        <div className="container mx-auto px-4 relative z-10">
          {/* Schedule */}
          <div id="jadwal-program" className="relative scroll-mt-20">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
          
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <RadioIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                <span className="text-[10px] sm:text-sm font-medium text-primary">Program Kami</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-black/80 bg-clip-text text-transparent">
                Jadwal Program
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />
              
              {/* Day Navigation */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button variant="outline" size="sm" onClick={handlePreviousDay} className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Sebelumnya
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleToday} className="font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  Hari Ini
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleNextDay} className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  Berikutnya
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </AnimatedSection>
          
          {filteredPrograms.length === 0 ? <div className="text-center py-12">
              
              <p className="text-muted-foreground">Belum ada jadwal program</p>
            </div> : <div className="grid md:grid-cols-2 gap-6">
              {filteredPrograms.map((program, index) => <AnimatedSection key={program.id} animation="fade-up" delay={index * 100}>
                  <Card className="group relative overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10 bg-white dark:bg-gray-900">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  </div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                          <RadioIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        {/* Live indicator if it's the current program */}
                        {currentProgram?.id === program.id && <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                          </div>}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                          {program.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="font-semibold">{DAYS[program.day_of_week]}</span>
                          <span className="text-xs">•</span>
                          <span className="font-medium">{program.air_time}{program.end_time ? ` - ${program.end_time}` : ''}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                      {program.description}
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mic className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium text-foreground">{program.host}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </AnimatedSection>)}
        </div>}
          </div>
        </div>
      </section>
    </Layout>;
};
export default Radio;