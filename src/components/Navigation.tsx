import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import logoUkkpk from "@/assets/logo-ukkpk.png";

interface SearchResult {
  id: string;
  title: string;
  type: "article" | "news" | "event";
  category?: string;
  date?: string;
  location?: string;
}

const navItems = [
  { name: "HOME", path: "/" },
  { name: "ARTIKEL", path: "/artikel" },
  { name: "BERITA", path: "/berita" },
  { name: "RADIO", path: "/radio" },
  { name: "PROFIL UKKPK", path: "/profil-ukkpk" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast.success("Login berhasil!");
      setIsPopoverOpen(false);
      setEmail("");
      setPassword("");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    setIsPopoverOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const searchContent = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const searchTerm = `%${searchQuery}%`;

        const { data: articles } = await supabase
          .from("articles")
          .select("id, title, category, created_at")
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .limit(5);

        const { data: news } = await supabase
          .from("news")
          .select("id, title, created_at")
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .limit(5);

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
          })),
          ...(news || []).map((n) => ({
            id: n.id,
            title: n.title,
            type: "news" as const,
            date: n.created_at,
          })),
          ...(events || []).map((e) => ({
            id: e.id,
            title: e.name,
            type: "event" as const,
            date: e.event_date,
            location: e.location,
          })),
        ];

        setSearchResults(allResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchContent, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logoUkkpk} 
              alt="Logo UKKPK" 
              className="h-10 w-10 transition-all duration-300 group-hover:scale-105"
            />
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
              UKKPK
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {!isSearchOpen ? (
              <>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`px-4 py-5 text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        isActive 
                          ? "bg-gradient-primary text-primary-foreground shadow-primary" 
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {!isActive && (
                        <span className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      )}
                    </Link>
                  );
                })}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-1 relative">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari artikel, berita, atau event..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                    autoFocus
                  />
                  {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                      {searchLoading && (
                        <p className="text-center text-muted-foreground py-8">Mencari...</p>
                      )}
                      
                      {!searchLoading && searchResults.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          Tidak ada hasil ditemukan
                        </p>
                      )}

                      {!searchLoading && searchResults.length > 0 && (
                        <div className="p-2 space-y-1">
                          {searchResults.map((result) => (
                            <Link
                              key={`${result.type}-${result.id}`}
                              to={result.type === "event" ? "/berita" : result.type === "news" ? "/berita" : "/artikel"}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="block p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <h3 className="font-medium text-sm line-clamp-2">{result.title}</h3>
                                  {result.date && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(result.date).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                  )}
                                </div>
                                <Badge 
                                  variant={
                                    result.type === "article" ? "default" : 
                                    result.type === "event" ? "destructive" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {result.type === "article" ? "Artikel" : 
                                   result.type === "event" ? "Event" : "Berita"}
                                </Badge>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            {/* Profile Icon with Login/Logout */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <User className={`h-5 w-5 ${user ? "fill-primary" : ""}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                {!user ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Login Admin</h3>
                      <p className="text-sm text-muted-foreground">
                        Masukkan email dan password Anda
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@ukkpk.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Memproses..." : "Login"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <div className="pb-2 border-b border-border">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/admin");
                        setIsPopoverOpen(false);
                      }}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard Admin
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-secondary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block mx-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </nav>
  );
};
