export const BreakingNews = () => {
  return (
    <div className="bg-gradient-primary text-white border-b border-primary/20 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="font-bold text-sm whitespace-nowrap px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
            🔥 BREAKING NEWS
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm font-medium">
                UKKPK menggelar pelatihan jurnalistik digital untuk meningkatkan kualitas konten multimedia • Workshop Photography & Videography dibuka untuk seluruh mahasiswa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
