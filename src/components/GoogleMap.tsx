export const GoogleMap = () => {
  const embedUrl = "https://maps.app.goo.gl/EdRi73gdkcyNDZy88";

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Lokasi Sekretariat UKKPK UNP</h2>
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
