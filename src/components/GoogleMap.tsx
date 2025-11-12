export const GoogleMap = () => {
  // Ganti URL ini dengan Google Maps embed URL lokasi UKKPK
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.3047156447396!2d100.35404!3d-0.91394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTQnNTAuMiJTIDEwMMKwMjEnMTQuNSJF!5e0!3m2!1sid!2sid!4v1234567890";

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Lokasi UKKPK</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
