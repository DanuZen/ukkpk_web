import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Radio } from "lucide-react";
import { subDays } from "date-fns";

export const BreakingNews = () => {
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        // Calculate date 7 days ago
        const oneWeekAgo = subDays(new Date(), 7).toISOString();
        
        // Fetch latest articles from the last week
        const { data: articles } = await supabase
          .from("articles")
          .select("title")
          .gte("created_at", oneWeekAgo)
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch latest news from the last week
        const { data: news } = await supabase
          .from("news")
          .select("title")
          .gte("created_at", oneWeekAgo)
          .order("created_at", { ascending: false })
          .limit(5);

        // Always include UKKPK text as the first item
        const defaultText = "UKKPK UNP : Unit Kegiatan Komunikasi Dan Penyiaran Kampus";
        
        const allHeadlines = [
          defaultText,
          ...(articles || []).map((a) => a.title),
          ...(news || []).map((n) => n.title),
        ];

        setHeadlines(allHeadlines);
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setHeadlines(["UKKPK UNP : Unit Kegiatan Komunikasi Dan Penyiaran Kampus"]);
      }
    };

    fetchLatestContent();
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-primary via-primary to-black/90 text-white border-b border-black/30 shadow-lg shadow-black/20 h-12">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center gap-3 overflow-hidden h-full">
          <span className="font-bold text-[10px] whitespace-nowrap pl-2 pr-3 py-1 bg-black/30 rounded-full backdrop-blur-sm animate-pulse flex items-center gap-1.5">
            <Radio className="h-3 w-3 animate-pulse" />
            BREAKING NEWS
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-xs font-medium">
                {headlines.join(" • ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
