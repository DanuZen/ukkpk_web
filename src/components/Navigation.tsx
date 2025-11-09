import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "ARTIKEL", path: "/artikel" },
  { name: "EVENT", path: "/event" },
  { name: "RADIO", path: "/radio" },
  { name: "PROFIL UKKPK", path: "/profil-ukkpk" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
              UKKPK
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
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
            <Button variant="ghost" size="icon" className="ml-2 hover:bg-primary/10 hover:text-primary transition-all duration-300">
              <Search className="h-5 w-5" />
            </Button>
            
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
