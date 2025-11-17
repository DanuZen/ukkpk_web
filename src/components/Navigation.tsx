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
import logoUkkpk from "@/assets/logo-ukkpk.png";
interface SearchResult {
  id: string;
  title: string;
  type: 'article' | 'news' | 'event';
  created_at: string;
}
const navItems = [{
  name: "HOME",
  path: "/"
}, {
  name: "ARTIKEL",
  path: "/artikel"
}, {
  name: "BERITA",
  path: "/berita"
}, {
  name: "RADIO",
  path: "/radio"
}, {
  name: "PROFIL UKKPK",
  path: "/profil-ukkpk"
}];
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signIn,
    signOut
  } = useAuth();

  // Scroll listener for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Change navbar when scrolled past the text content in slideshow (centered text + its height)
      const textAreaEnd = window.innerHeight * 0.5 + 250; // Center of viewport + approximate text height
      setIsScrolled(scrollPosition > textAreaEnd);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const searchContent = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const [articlesRes, newsRes, eventsRes] = await Promise.all([supabase.from('articles').select('id, title, created_at').ilike('title', `%${searchQuery}%`).limit(3), supabase.from('news').select('id, title, created_at').ilike('title', `%${searchQuery}%`).limit(3), supabase.from('events').select('id, name, event_date').ilike('name', `%${searchQuery}%`).limit(3)]);
        const results: SearchResult[] = [...(articlesRes.data || []).map(a => ({
          id: a.id,
          title: a.title,
          type: 'article' as const,
          created_at: a.created_at
        })), ...(newsRes.data || []).map(n => ({
          id: n.id,
          title: n.title,
          type: 'news' as const,
          created_at: n.created_at
        })), ...(eventsRes.data || []).map(e => ({
          id: e.id,
          title: e.name,
          type: 'event' as const,
          created_at: e.event_date
        }))];
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    };
    const debounce = setTimeout(searchContent, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await signIn(email, password);
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
  const isHomePage = location.pathname === "/";
  const showTransparentNav = isHomePage && !isScrolled;
  return <nav className={`${showTransparentNav ? "bg-transparent" : "bg-white border-b border-border shadow-sm"} sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoUkkpk} alt="Logo UKKPK" className="h-10 w-10 transition-all duration-300 group-hover:scale-105" />
            <div className={`text-2xl font-bold transition-all duration-300 group-hover:scale-105 ${showTransparentNav ? "text-white" : "text-primary"}`}>
              UKKPK UNP  
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-end">
            {!isSearchOpen ? <>
                {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return <Link key={item.name} to={item.path} className={`px-4 py-5 text-sm transition-all duration-300 relative ${isActive ? (showTransparentNav ? "font-semibold text-white border-b-2 border-white" : "font-semibold text-primary border-b-2 border-primary") : (showTransparentNav ? "font-medium text-white hover:border-b-2 hover:border-white/50" : "font-medium text-foreground hover:text-primary hover:border-b-2 hover:border-primary/50")}`}>
                      {item.name}
                    </Link>;
            })}
                <Button variant="ghost" size="icon" className={`ml-2 transition-all duration-300 ${showTransparentNav ? "text-white hover:bg-white/10 hover:text-white" : "hover:bg-primary/10 hover:text-primary"}`} onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              </> : <div className="flex items-center gap-2 animate-fade-in flex-1 max-w-md relative">
                <Input type="text" placeholder="Cari artikel, berita, atau event..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1" autoFocus />
                <Button variant="ghost" size="icon" onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
              setSearchResults([]);
            }}>
                  <X className="h-5 w-5" />
                </Button>
                
                {searchResults.length > 0 && <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 animate-fade-in">
                    {searchResults.map(result => <Link key={`${result.type}-${result.id}`} to={`/${result.type === 'article' ? 'artikel' : result.type === 'news' ? 'berita' : 'event'}`} className="block px-4 py-3 hover:bg-secondary/10 transition-colors border-b border-border last:border-b-0" onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}>
                        <div className="font-medium">{result.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {result.type === 'article' ? 'Artikel' : result.type === 'news' ? 'Berita' : 'Event'}
                        </div>
                      </Link>)}
                  </div>}
              </div>}
            
            {/* Profile Icon with Login/Logout */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={`ml-2 transition-all duration-300 ${showTransparentNav ? "text-white hover:bg-white/10 hover:text-white" : "hover:bg-primary/10 hover:text-primary"}`}>
                  <User className={`h-5 w-5 ${user ? showTransparentNav ? "fill-white" : "fill-primary" : ""}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                {!user ? <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Login Admin</h3>
                      <p className="text-sm text-muted-foreground">
                        Masukkan email dan password Anda
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ukkpk.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Memproses..." : "Login"}
                    </Button>
                  </form> : <div className="space-y-2">
                    <div className="pb-2 border-b border-border">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => {
                  navigate("/admin");
                  setIsPopoverOpen(false);
                }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard Admin
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>}
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md hover:bg-secondary">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden py-4 border-t border-border space-y-2">
            {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return <Link key={item.name} to={item.path} className={`block mx-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${isActive ? "bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-secondary"}`} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>;
        })}
          </div>}
      </div>
    </nav>;
};