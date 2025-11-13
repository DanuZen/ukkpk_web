import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';

export const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: '',
    program: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nama || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to a backend
    console.log('Form submitted:', formData);
    
    toast({
      title: "Berhasil!",
      description: "Pesan Anda telah terkirim. Terima kasih!"
    });

    // Reset form
    setFormData({
      nama: '',
      program: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const socialLinks = {
    facebook: "https://web.facebook.com/p/UKKPK-UNP-100063495233989/",
    instagram: "https://www.instagram.com/ukkpk_unp/",
    youtube: "https://www.youtube.com/@UKKPKUNP",
    tiktok: "#"
  };

  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Alamat</h3>
                  <p className="text-muted-foreground text-sm">
                    Jl. Teknik Kimia, Kapuluh, Sukolilo, Surabaya, East Java 60111
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Kontak</h3>
                  <p className="text-muted-foreground text-sm">+6282388235091</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">Ukkpk.office@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Follow Akun Sosmed Kami</h3>
              <div className="flex gap-3">
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href={socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href={socialLinks.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <Music2 className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-card rounded-lg shadow-lg p-6 lg:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">
              Berikan Saran dan masukanmu untuk UKKPK UNP
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama</label>
                  <Input
                    placeholder="Nama kamu"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Program Studi</label>
                  <Input
                    placeholder="Asal Prodi Kamu"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nomor Telepon</label>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  placeholder="Tulis Siapa Pesan ini ditujukan"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  placeholder="Tulis kritikan maupun saran untuk BEM PPNS Kabinet Nakhoda Akselerasi Ex. &quot;Tetap Semangat !!&quot;"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-6"
              >
                Submit Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
