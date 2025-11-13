export const GoogleMap = () => {
  // Using embed URL format for Google Maps - pointing to UKKPK UNP Secretariat
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.304715644741!2d100.3540397!3d-0.9139400000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b7f1f1c8e5e5%3A0x8f5c9e5e5e5e5e5e!2sUKKPK%20UNP!5e0!3m2!1sen!2sid!4v1234567890123";
  const mapsLink = "https://maps.app.goo.gl/EdRi73gdkcyNDZy88";

  return (
    <div className="h-full flex flex-col">
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-md border border-border/50">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi Sekretariat UKKPK UNP"
        />
      </div>
      <div className="text-center mt-6">
        <a 
          href={mapsLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-md font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          View maps
        </a>
      </div>
    </div>
  );
};
