import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoUkkpk from "@/assets/logo-ukkpk.png";

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
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={logoUkkpk} alt="Logo UKKPK" className="h-12 w-12" />
              <h3 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">UKKPK UNP</h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">Unit Kegiatan Komunikasi dan Penyiaran Kampus</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-4 bg-gradient-primary bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profil-ukkpk" className="text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Profil UKKPK
                </Link>
              </li>
              <li>
                <Link to="/artikel" className="text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Artikel
                </Link>
              </li>
              <li>
                <Link to="/berita" className="text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Berita
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-4 bg-gradient-primary bg-clip-text text-transparent">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group">
                <Mail className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>Ukkpk.office@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group">
                <Phone className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>+6282388235091</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group">
                <MapPin className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>Kampus Utama UNP</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-4 bg-gradient-primary bg-clip-text text-transparent">Follow Us</h4>
            
            {/* UKKPK Social Media */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground/80">UKKPK</p>
              <div className="flex gap-3 flex-wrap">
                <a href={socialLinks.ukkpk.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:text-blue-500">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={socialLinks.ukkpk.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:text-pink-500">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={socialLinks.ukkpk.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:text-red-500">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href={socialLinks.ukkpk.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110">
                  <Music2 className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* SIGMA Social Media */}
            <div className="space-y-3 mt-6">
              <p className="text-sm font-medium text-foreground/80">SIGMA</p>
              <div className="flex gap-3 flex-wrap">
                <a href={socialLinks.sigma.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:text-blue-500">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={socialLinks.sigma.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:text-pink-500">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={socialLinks.sigma.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:text-red-500">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href={socialLinks.sigma.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110">
                  <Music2 className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-8 text-center">
          <p className="text-sm text-foreground/60">&copy; {new Date().getFullYear()} UKKPK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
