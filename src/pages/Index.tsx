import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { HomeSlideshow } from '@/components/HomeSlideshow';
import { GoogleMap } from '@/components/GoogleMap';
import { ContactSection } from '@/components/ContactSection';
import { AnimatedSection } from '@/components/AnimatedSection';
import { stripHtml } from '@/lib/utils';
import { FileText, MessageSquare, MapPin } from 'lucide-react';
interface Article {
  id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
}
interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
}
const Index = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<News[]>([]);
  useEffect(() => {
    fetchArticles();
    fetchNews();
  }, []);
  const fetchArticles = async () => {
    const {
      data
    } = await supabase.from('articles').select('*').order('created_at', {
      ascending: false
    }).limit(6);
    if (data) setArticles(data);
  };
  const fetchNews = async () => {
    const {
      data
    } = await supabase.from('news').select('*').order('created_at', {
      ascending: false
    }).limit(6);
    if (data) setNews(data);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  return <Layout>
      {/* Hero Slideshow Section */}
      <HomeSlideshow />

      {/* Artikel & Berita Section - Gabungan */}
      <section className="py-12 bg-background relative overflow-hidden">
        {/* Curved geometric background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border-[40px] border-gray-100/60" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full border-[30px] border-gray-50" />
          <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] rounded-full border-[60px] border-gray-100/50" />
          <div className="absolute top-20 right-1/3 w-28 h-28 rounded-full border-[12px] border-primary/10" />
          
          <div className="absolute top-0 right-0 w-1/4 h-1/2 opacity-25">
            <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '18px 18px'
          }} />
          </div>
          
          <div className="absolute bottom-1/4 left-0 w-72 h-72">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
              <path d="M 0,90 Q 50,50 100,90 T 200,90" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,110 Q 50,70 100,110 T 200,110" stroke="#dc2626" strokeWidth="2" fill="none" />
              <path d="M 0,130 Q 50,90 100,130 T 200,130" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Konten Terbaru
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Artikel & Berita Terbaru
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          {articles.length === 0 && news.length === 0 ? <p className="text-center text-muted-foreground">Belum ada konten tersedia.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Artikel Cards */}
              {articles.map((article, index) => <AnimatedSection key={`article-${article.id}`} animation="fade-up" delay={index * 100}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/artikel/${article.id}`)}>
                    {article.image_url && <div className="relative overflow-hidden h-40 sm:h-48">
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">Artikel</Badge>
                        </div>
                      </div>}
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{stripHtml(article.content)}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>)}

              {/* News Cards */}
              {news.map((item, newsIndex) => <AnimatedSection key={`news-${item.id}`} animation="fade-up" delay={(articles.length + newsIndex) * 100}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/berita/${item.id}`)}>
                    {item.image_url && <div className="relative overflow-hidden h-40 sm:h-48">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <Badge className="bg-secondary text-secondary-foreground shadow-lg text-xs">Berita</Badge>
                        </div>
                      </div>}
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">{formatDate(item.published_at || item.created_at)}</span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{stripHtml(item.content)}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>)}
            </div>}
        </div>
      </section>

      {/* Thank You Section */}
      <section className="relative py-40 px-4 bg-gradient-to-b from-primary/90 via-primary to-primary/90 overflow-hidden">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-0" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <AnimatedSection animation="fade-up">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Terima Kasih Telah Mengunjungi
              </h2>
              
              <div className="w-32 h-1 bg-white/50 mx-auto mb-8" />
              
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Kami sangat menghargai kunjungan Anda. Semoga informasi yang kami sajikan bermanfaat 
                untuk Anda. Jangan ragu untuk menghubungi kami jika ada pertanyaan atau saran.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale-in" delay={200}>
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Button size="lg" onClick={() => navigate('/profil-ukkpk')} className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
                Tentang Kami
              </Button>
              
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Map Section with Location Details */}
      <section className="relative py-12 px-4 bg-muted/20 overflow-hidden">
        {/* Green/Emerald Background Pattern */}
        <AnimatedSection animation="fade-in">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Circle - Top Left */}
          <div className="absolute -top-40 -left-40 w-96 h-96 border-[3px] border-green-100/50 rounded-full" />
          
          {/* Grid Pattern - Right Side */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-15">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map Pin Shapes */}
          <div className="absolute top-20 right-1/4 w-8 h-8 opacity-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="absolute bottom-32 left-1/4 w-6 h-6 opacity-15">
            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          {/* Curved Lines */}
          <svg className="absolute top-1/2 left-0 w-64 h-64 text-emerald-100/25 -translate-y-1/2" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0,100 Q50,50 100,100 T200,100" />
            <path d="M0,120 Q50,70 100,120 T200,120" />
          </svg>
        </div>
        </AnimatedSection>
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Lokasi Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Lokasi Sekretariatan UKKPK
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Map */}
            <AnimatedSection animation="scale-in" delay={100}>
              <GoogleMap />
            </AnimatedSection>

            {/* Location Details */}
            <AnimatedSection animation="fade-up" delay={200}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Informasi Lokasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Alamat Lengkap</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Gedung PKM Pusat Universitas Negeri Padang<br />
                      Jl. Air Tawar Barat, Kec. Padang Utara, Kota Padang, Sumatera Barat
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Kontak</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <p>Telepon: +6282388235091</p>
                        <a 
                          href="https://wa.me/6282388235091" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                          aria-label="WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Email: Ukkpk.office@gmail.com</p>
                        <a 
                          href="mailto:Ukkpk.office@gmail.com"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          aria-label="Email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Jam Operasional</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Senin - Jumat: 08:00 - 17:00 WIB</p>
                      <p>Sabtu - Minggu: Tutup</p>
                    </div>
                  </div>

                  

                  <div className="pt-4 border-t">
                    <a href="https://maps.app.goo.gl/EdRi73gdkcyNDZy88" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-md font-medium w-full justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      View maps
                    </a>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section Heading */}
      <section className="py-8 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Hubungi Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Kritik dan Saran
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-8 px-4 bg-muted/20 overflow-hidden">
        {/* Blue/Teal Background Pattern */}
        <AnimatedSection animation="fade-in">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Circle - Top Right */}
          <div className="absolute -top-32 -right-32 w-96 h-96 border-[3px] border-blue-100/50 rounded-full" />
          
          {/* Dots Pattern - Bottom Left */}
          <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20">
            <div className="grid grid-cols-8 gap-4 p-8">
              {[...Array(64)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300" />)}
            </div>
          </div>

          {/* Geometric Shapes */}
          <div className="absolute top-1/4 left-10 w-16 h-16 border-2 border-cyan-200/30 rounded-lg rotate-12" />
          <div className="absolute bottom-1/4 right-20 w-12 h-12 bg-blue-100/20 rounded-full" />

          {/* Wave SVG - Blue */}
          <svg className="absolute bottom-0 left-0 w-full h-32 text-blue-50/30" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
        </AnimatedSection>
        
        <div id="contact" className="relative z-10 container mx-auto max-w-5xl">
          <AnimatedSection animation="scale-in" delay={100}>
            <ContactSection />
          </AnimatedSection>
        </div>
      </section>

    </Layout>;
};
export default Index;