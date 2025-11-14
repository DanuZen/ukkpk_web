import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { z } from 'zod';
const contactSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  program: z.string().trim().max(100, "Program studi maksimal 100 karakter").optional(),
  phone: z.string().trim().regex(/^[0-9+\-\s()]*$/, "Format nomor telepon tidak valid").max(20, "Nomor telepon maksimal 20 karakter").optional().or(z.literal('')),
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid").max(255, "Email maksimal 255 karakter"),
  subject: z.string().trim().max(200, "Subject maksimal 200 karakter").optional(),
  message: z.string().trim().min(1, "Pesan wajib diisi").max(1000, "Pesan maksimal 1000 karakter")
});

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

    // Validate with Zod schema
    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error Validasi",
          description: error.errors[0].message,
          variant: "destructive"
        });
        return;
      }
    }

    // Here you would typically send the data to a backend
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
  return <div className="bg-card rounded-lg shadow-lg p-6 lg:p-8 h-full">
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
              onChange={e => setFormData({
                ...formData,
                nama: e.target.value
              })} 
              maxLength={100}
              required 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Program Studi</label>
            <Input 
              placeholder="Asal Prodi Kamu" 
              value={formData.program} 
              onChange={e => setFormData({
                ...formData,
                program: e.target.value
              })} 
              maxLength={100}
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
              onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} 
              maxLength={20}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} 
              maxLength={255}
              required 
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Subject</label>
          <Input 
            placeholder="Tulis Siapa Pesan ini ditujukan" 
            value={formData.subject} 
            onChange={e => setFormData({
              ...formData,
              subject: e.target.value
            })} 
            maxLength={200}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Message</label>
          <Textarea 
            placeholder="Tulis kritikan maupun saran untuk BEM PPNS Kabinet Nakhoda Akselerasi Ex. &quot;Tetap Semangat !!&quot;" 
            value={formData.message} 
            onChange={e => setFormData({
              ...formData,
              message: e.target.value
            })} 
            rows={5} 
            maxLength={1000}
            required 
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
          Submit Now
        </Button>
      </form>
    </div>;
};