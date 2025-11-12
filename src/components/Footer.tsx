import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialLink {
  id: string;
  platform: string;
  organization: string;
  url: string;
}

export const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    const { data, error } = await supabase
      .from('social_media_links')
      .select('*')
      .order('organization', { ascending: true })
      .order('platform', { ascending: true });

    if (!error && data) {
      setSocialLinks(data);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'facebook':
        return Facebook;
      case 'tiktok':
        return Music2;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'hover:text-pink-500';
      case 'youtube':
        return 'hover:text-red-500';
      case 'facebook':
        return 'hover:text-blue-500';
      case 'tiktok':
        return 'hover:text-foreground';
      default:
        return 'hover:text-primary';
    }
  };
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl mb-3 bg-gradient-primary bg-clip-text text-transparent">UKKPK</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Unit Kegiatan Komunikasi dan Penyiaran Kampus</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
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
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
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
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            
            {/* UKKPK Social Media */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground/80">UKKPK</p>
              <div className="flex gap-3 flex-wrap">
                {socialLinks
                  .filter(link => link.organization === 'UKKPK')
                  .map((link) => {
                    const Icon = getPlatformIcon(link.platform);
                    if (!Icon) return null;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 ${getPlatformColor(link.platform)}`}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
              </div>
            </div>

            {/* SIGMA Social Media */}
            <div className="space-y-3 mt-6">
              <p className="text-sm font-medium text-foreground/80">SIGMA</p>
              <div className="flex gap-3 flex-wrap">
                {socialLinks
                  .filter(link => link.organization === 'SIGMA')
                  .map((link) => {
                    const Icon = getPlatformIcon(link.platform);
                    if (!Icon) return null;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 ${getPlatformColor(link.platform)}`}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
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
