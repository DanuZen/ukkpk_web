import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  image?: string;
  link: string;
}

const categoryColors: Record<string, string> = {
  KEGIATAN: "bg-[hsl(var(--badge-kegiatan))] hover:bg-[hsl(var(--badge-kegiatan))]/90",
  BERITA: "bg-[hsl(var(--badge-berita))] hover:bg-[hsl(var(--badge-berita))]/90",
  EVENT: "bg-[hsl(var(--badge-event))] hover:bg-[hsl(var(--badge-event))]/90",
  UNCATEGORIZED: "bg-[hsl(var(--badge-uncategorized))] hover:bg-[hsl(var(--badge-uncategorized))]/90",
};

export const ArticleCard = ({ title, category, image, link }: ArticleCardProps) => {
  return (
    <Link to={link} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col animate-fade-up">
        {/* Image */}
        <div className="relative h-56 bg-gradient-to-br from-muted to-muted-foreground/10 overflow-hidden">
          {image ? (
            <>
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/5 to-muted relative">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-shimmer" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className={`${categoryColors[category] || categoryColors.UNCATEGORIZED} text-white font-semibold px-4 py-1.5 shadow-lg backdrop-blur-sm border-0 transition-transform duration-300 group-hover:scale-110`}>
              {category}
            </Badge>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40" />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex items-center bg-gradient-to-b from-card to-card/50">
          <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-3 leading-relaxed">
            {title}
          </h3>
        </div>

        {/* Hover effect line */}
        <div className="h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </Link>
  );
};
