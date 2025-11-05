export const BreakingNews = () => {
  return (
    <div className="bg-muted border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="text-primary font-bold text-sm whitespace-nowrap">
            BREAKING NEWS
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm text-muted-foreground">
                Unit Komunikasi menggelar pelatihan jurnalistik digital untuk meningkatkan kualitas konten multimedia
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
