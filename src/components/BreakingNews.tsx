import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const BreakingNews = () => {
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        // Fetch latest articles
        const { data: articles } = await supabase
          .from("articles")
          .select("title")
          .order("created_at", { ascending: false })
          .limit(3);

        // Fetch latest news
        const { data: news } = await supabase
          .from("news")
          .select("title")
          .order("created_at", { ascending: false })
          .limit(3);

        const allHeadlines = [
          ...(articles || []).map((a) => a.title),
          ...(news || []).map((n) => n.title),
        ];

        if (allHeadlines.length > 0) {
          setHeadlines(allHeadlines);
        } else {
          setHeadlines(["UKKPK : Unit Kegiatan Komunikasi dan Penyiaran Kampus"]);
        }
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setHeadlines(["UKKPK : Unit Kegiatan Komunikasi dan Penyiaran Kampus"]);
      }
    };

    fetchLatestContent();
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-gradient-primary text-white border-b border-primary/20 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="font-bold text-sm whitespace-nowrap px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
            🔥 BREAKING NEWS
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm font-medium">
                {headlines.join(" • ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
