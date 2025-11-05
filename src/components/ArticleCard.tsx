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
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`${categoryColors[category] || categoryColors.UNCATEGORIZED} text-white font-semibold px-3 py-1`}>
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex items-center">
          <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-3">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
