import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const formSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  student_id: z.string().min(5, "NIM minimal 5 karakter"),
  department: z.string().min(3, "Jurusan minimal 3 karakter"),
  reason: z.string().min(10, "Alasan minimal 10 karakter"),
});

const Pendaftaran = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      student_id: "",
      department: "",
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("registrations" as any)
        .insert([values]);

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Pendaftaran berhasil dikirim!");
      form.reset();
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      toast.error("Gagal mengirim pendaftaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Form Pendaftaran
              </h1>
              <p className="text-gray-600">
                Bergabunglah bersama kami di UKKPK UNP. Silakan isi formulir di bawah ini dengan data yang benar.
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Terima Kasih!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Data pendaftaran Anda telah kami terima. Tim kami akan segera menghubungi Anda melalui kontak yang telah diberikan.
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  variant="outline" 
                  className="mt-6"
                >
                  Daftar Lagi
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contoh@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. HP / WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="08xxxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="student_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIM</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan NIM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurusan</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan Jurusan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alasan Bergabung</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ceritakan alasan Anda ingin bergabung dengan UKKPK..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Pendaftaran"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pendaftaran;
