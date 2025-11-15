import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logoUkkpk from "@/assets/logo-ukkpk.png";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "ARTIKEL", path: "/artikel" },
  { name: "BERITA", path: "/berita" },
  { name: "RADIO", path: "/radio" },
  { name: "PROFIL UKKPK", path: "/profil-ukkpk" }
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
    try {
      await signOut();
      toast.success("Logout berhasil!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Logout gagal");
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsPopoverOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logoUkkpk} alt="UKKPK" className="h-14" />
            <span className="font-bold text-xl text-foreground hidden sm:inline">UKKPK</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-foreground/80 transition-all duration-300 hover:text-foreground font-medium pb-1 ${
                  location.pathname === item.path
                    ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                    Login / Daftar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Loading..." : "Login"}
                    </Button>
                  </form>
                </PopoverContent>
              </Popover>
            ) : (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split('@')[0]}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Halo, {user.email}!</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleNavigate('/admin')}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard Admin
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/80 hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {!user ? (
                <div className="space-y-3 p-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    onClick={(e) => handleLogin(e as any)}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  <p className="text-sm font-medium">Halo, {user.email}!</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleNavigate('/admin');
                      setIsOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard Admin
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
