import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "ARTIKEL", path: "/artikel" },
  { name: "EVENT", path: "/event" },
  { name: "RADIO", path: "/radio" },
  { name: "PROFIL UKKPK", path: "/profil-ukkpk" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
