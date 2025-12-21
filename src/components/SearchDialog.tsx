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
  location?: string;
  author?: string | null;
  editor?: string | null;
  cameraman?: string[] | null;
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
          .select("id, title, category, created_at, author, editor")
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},author.ilike.${searchTerm},editor.ilike.${searchTerm}`)
          .limit(5);

        // Search news
        const { data: news } = await supabase
          .from("news")
          .select("id, title, created_at, author, editor, cameraman")
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},author.ilike.${searchTerm},editor.ilike.${searchTerm}`)
          .limit(5);

        // Search events
        const { data: events } = await supabase
          .from("events")
          .select("id, name, event_date, location")
          .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .limit(5);

        const allResults: SearchResult[] = [
          ...(articles || []).map((a) => ({
            id: a.id,
            title: a.title,
            type: "article" as const,
            category: a.category,
            date: a.created_at,
            author: a.author,
            editor: a.editor,
          })),
          ...(news || []).map((n) => ({
            id: n.id,
            title: n.title,
            type: "news" as const,
            date: n.created_at,
            author: n.author,
            editor: n.editor,
            cameraman: n.cameraman,
          })),
          ...(events || []).map((e) => ({
            id: e.id,
            title: e.name,
            type: "event" as const,
            date: e.event_date,
            location: e.location,
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
        <div className="relative group">
          <Input
            placeholder="Cari artikel, berita, atau event..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-primary focus-visible:ring-0 focus-visible:border-primary bg-white transition-all duration-300 shadow-sm group-hover:shadow-md text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
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
                  to={
                    result.type === "article" ? `/artikel/${result.id}` :
                    result.type === "news" ? `/berita/${result.id}` :
                    "/event"
                  }
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
                      {(result.author || result.editor || (result.cameraman && result.cameraman.length > 0)) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                          {result.author && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-primary/70">Penulis:</span> {result.author}
                            </p>
                          )}
                          {result.editor && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-primary/70">Editor:</span> {result.editor}
                            </p>
                          )}
                          {result.cameraman && result.cameraman.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-primary/70">Cameraman:</span> {result.cameraman.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                      {result.location && (
                        <p className="text-sm text-muted-foreground mt-1">
                          📍 {result.location}
                        </p>
                      )}
                    </div>
                    <Badge variant={
                      result.type === "article" ? "default" : 
                      result.type === "event" ? "destructive" : "secondary"
                    }>
                      {result.type === "article" ? "Artikel" : 
                       result.type === "event" ? "Event" : "Berita"}
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
