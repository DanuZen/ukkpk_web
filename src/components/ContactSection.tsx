import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2, MessageSquare, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
const contactSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  phone: z.string().trim().regex(/^[0-9+\-\s()]*$/, "Format nomor telepon tidak valid").max(20, "Nomor telepon maksimal 20 karakter").optional().or(z.literal('')),
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid").max(255, "Email maksimal 255 karakter"),
  message: z.string().trim().min(1, "Pesan wajib diisi").max(1000, "Pesan maksimal 1000 karakter"),
  testimonial_rating: z.number().min(1, "Rating wajib dipilih").max(5)
});

export const ContactSection = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    nama: '',
    phone: '',
    email: '',
    message: '',
    testimonial_rating: 0
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const handleSubmit = async (e: React.FormEvent) => {
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

    // Save to database
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Pesan Anda telah terkirim. Terima kasih!"
      });

      // Reset form
      setFormData({
        nama: '',
        phone: '',
        email: '',
        message: '',
        testimonial_rating: 0
      });
      setHoveredStar(0);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Gagal mengirim",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };
  const socialLinks = {
    facebook: "https://web.facebook.com/p/UKKPK-UNP-100063495233989/",
    instagram: "https://www.instagram.com/ukkpk_unp/",
    youtube: "https://www.youtube.com/@UKKPKUNP",
    tiktok: "#"
  };
  return <div className="bg-card rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 h-full">

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="text-sm"
          />
        </div>

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
            className="text-sm"
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
            className="text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Pesan</label>
          <Textarea 
            placeholder="Tuliskan Kritikan maupun saran anda untuk UKKPK UNP"
            value={formData.message} 
            onChange={e => setFormData({
              ...formData,
              message: e.target.value
            })} 
            rows={5} 
            maxLength={1000}
            required
            className="text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, testimonial_rating: star })}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="transition-transform hover:scale-110 active:scale-125"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredStar || formData.testimonial_rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {formData.testimonial_rating > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Anda memberikan {formData.testimonial_rating} bintang
            </p>
          )}
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base">
          Kirim Pesan
        </Button>
      </form>
    </div>;
};