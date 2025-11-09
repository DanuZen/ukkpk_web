import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  type: "article" | "news" | "event";
  category?: string;
  date?: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchContent = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchTerm = `%${query}%`;

        // Search articles
        const { data: articles } = await supabase
          .from("articles")
          .select("id, title, category, created_at")
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .limit(5);

        // Search news
        const { data: news } = await supabase
          .from("news")
          .select("id, title, created_at")
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .limit(5);

        const allResults: SearchResult[] = [
          ...(articles || []).map((a) => ({
            id: a.id,
            title: a.title,
            type: "article" as const,
            category: a.category,
            date: a.created_at,
          })),
          ...(news || []).map((n) => ({
            id: n.id,
            title: n.title,
            type: "news" as const,
            date: n.created_at,
          })),
        ];

        setResults(allResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchContent, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cari Konten</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari artikel, berita, atau event..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
          {loading && (
            <p className="text-center text-muted-foreground py-8">Mencari...</p>
          )}
          
          {!loading && query && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada hasil ditemukan
            </p>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={`/artikel`}
                  onClick={() => onOpenChange(false)}
                  className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{result.title}</h3>
                      {result.date && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(result.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <Badge variant={result.type === "article" ? "default" : "secondary"}>
                      {result.type === "article" ? "Artikel" : "Berita"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
