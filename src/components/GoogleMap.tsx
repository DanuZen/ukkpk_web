export const GoogleMap = () => {
  // Using embed URL format for Google Maps
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.304715644741!2d100.3540397!3d-0.9139400000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b7f1f1c8e5e5%3A0x8f5c9e5e5e5e5e5e!2sUKKPK%20UNP!5e0!3m2!1sen!2sid!4v1234567890123";
  const mapsLink = "https://maps.app.goo.gl/EdRi73gdkcyNDZy88";

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-primary bg-clip-text text-transparent">Lokasi Sekretariat UKKPK UNP</h2>
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
          <div className="text-center mt-4">
            <a 
              href={mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
