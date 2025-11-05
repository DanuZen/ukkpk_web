import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "PROFIL", path: "/profil" },
  { name: "ARTIKEL", path: "/artikel" },
  { name: "MAHASISWA", path: "/mahasiswa" },
  { name: "EVENT", path: "/event" },
  { name: "BEASISWA", path: "/beasiswa" },
  { name: "KARIR", path: "/karir" },
  { name: "RADIO", path: "/radio" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">KOMINFO</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-6 py-5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground ${
                  index === 0 ? "bg-primary text-primary-foreground" : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" size="icon" className="ml-2">
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
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                  index === 0 ? "bg-primary text-primary-foreground" : "text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
