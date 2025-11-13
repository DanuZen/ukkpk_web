import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
export const ContactSection = () => {
  const {
    toast
  } = useToast();
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
  return <section className="py-16 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Contact Info */}
          

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
                  <Input placeholder="Nama kamu" value={formData.nama} onChange={e => setFormData({
                  ...formData,
                  nama: e.target.value
                })} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Program Studi</label>
                  <Input placeholder="Asal Prodi Kamu" value={formData.program} onChange={e => setFormData({
                  ...formData,
                  program: e.target.value
                })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nomor Telepon</label>
                  <Input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input placeholder="Tulis Siapa Pesan ini ditujukan" value={formData.subject} onChange={e => setFormData({
                ...formData,
                subject: e.target.value
              })} />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea placeholder="Tulis kritikan maupun saran untuk BEM PPNS Kabinet Nakhoda Akselerasi Ex. &quot;Tetap Semangat !!&quot;" value={formData.message} onChange={e => setFormData({
                ...formData,
                message: e.target.value
              })} rows={5} required />
              </div>

              <Button type="submit" className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-6">
                Submit Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>;
};