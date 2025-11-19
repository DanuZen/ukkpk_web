import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2, Mic, Shield, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoUkkpk from "@/assets/logo-ukkpk.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const Footer = () => {
  // Hardcoded social media links
  const socialLinks = {
    ukkpk: {
      facebook: "https://web.facebook.com/p/UKKPK-UNP-100063495233989/",
      instagram: "https://www.instagram.com/ukkpk_unp/",
      youtube: "https://www.youtube.com/@UKKPKUNP",
      tiktok: "#"
    },
    sigma: {
      facebook: "#",
      instagram: "#",
      youtube: "#",
      tiktok: "#"
    }
  };
  return <footer className="bg-gradient-to-br from-primary via-primary to-black/90 mt-16 text-white text-sm relative overflow-hidden">
      {/* Animated Wave Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3">
                  <animate attributeName="d" values="M0 50 Q 25 25, 50 50 T 100 50;M0 50 Q 25 75, 50 50 T 100 50;M0 50 Q 25 25, 50 50 T 100 50" dur="8s" repeatCount="indefinite" />
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-pattern)" />
          </svg>
        </div>
        
        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/10 animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full border border-white/10 animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full border border-white/10 animate-[pulse_5s_ease-in-out_infinite]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-20">
          {/* About / Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUkkpk} alt="Logo UKKPK" className="h-14 w-14" />
              <h3 className="font-bold text-xl text-white">UKKPK UNP</h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed text-justify">
              Organisasi Dan Platform Media kampus untuk pengembangan Ilmu di bidang komunikasi dan penyiaran yang dikembangkan oleh Unit Kegiatan Komunikasi dan Penyiaran Kampus Universitas Negeri Padang.
            </p>
            
            {/* Social Media Icons */}
            <div className="pt-4">
              <TooltipProvider>
                <div className="flex gap-2 flex-wrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={socialLinks.ukkpk.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
                        <Facebook className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Facebook UKKPK UNP</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={socialLinks.ukkpk.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Instagram UKKPK UNP</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={socialLinks.sigma.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Instagram SIGMA Radio</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={socialLinks.ukkpk.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
                        <Youtube className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>YouTube UKKPK UNP</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={socialLinks.ukkpk.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
                        <Music2 className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>TikTok UKKPK UNP</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Layanan Kami */}
          <div className="space-y-4 hidden md:block">
            <h4 className="font-semibold text-lg mb-4 text-white">Layanan Kami</h4>
            <ul className="space-y-3 text-xs sm:text-sm md:text-base">
              <li className="flex items-center gap-2">
                <Mic className="h-4 w-4 flex-shrink-0" />
                <span className="text-white/80">Master Of Ceremony</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="text-white/80">Keprotokolan</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <Link to="/berita" className="text-white/80 hover:text-white transition-colors">
                  Jurnalistik
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Music2 className="h-4 w-4 flex-shrink-0" />
                <Link to="/radio" className="text-white/80 hover:text-white transition-colors">
                  Radio
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Camera className="h-4 w-4 flex-shrink-0" />
                <span className="text-white/80">Penyiaran</span>
              </li>
            </ul>
          </div>

          {/* Menu Cepat */}
          <div className="space-y-4 hidden md:block">
            <h4 className="font-semibold text-lg mb-4 text-white">Menu Cepat</h4>
            <ul className="space-y-3 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/profil-ukkpk" className="text-white/80 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/artikel" className="text-white/80 hover:text-white transition-colors">
                  Artikel
                </Link>
              </li>
              <li>
                <Link to="/berita" className="text-white/80 hover:text-white transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/radio" className="text-white/80 hover:text-white transition-colors">
                  Radio
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4 text-white">Kontak</h4>
            <ul className="space-y-4 text-xs sm:text-sm md:text-base">
              <li className="flex items-start gap-3 text-white/90">
                <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white mb-1">Email</p>
                  <a href="mailto:Ukkpk.office@gmail.com" className="text-white/80 hover:text-white transition-colors">
                    Ukkpk.office@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white mb-1">Telepon</p>
                  <a href="tel:+6282388235091" className="text-white/80 hover:text-white transition-colors">
                    +62 823 8823 5091
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white mb-1">Alamat</p>
                  <span className="text-white/80">Kampus Utama UNP</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm md:text-base text-white/90">
            © {new Date().getFullYear()} UKKPK UNP. Semua hak dilindungi.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm md:text-base">
            <span className="text-white/80 hover:text-white transition-colors cursor-pointer">
              Kebijakan Privasi
            </span>
            <span className="text-white/80 hover:text-white transition-colors cursor-pointer">
              Syarat & Ketentuan
            </span>
          </div>
        </div>
      </div>
    </footer>;
};