import { User } from "@supabase/supabase-js";
import { Search, Bell, LogOut, ExternalLink, Menu, X as CloseIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import logoUkkpk from "@/assets/logo-ukkpk.png";
import { Home, FileText, Newspaper, Radio, Settings, Users, Map, MessageSquare, TrendingUp } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  user: User | null;
  onSignOut: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}
const menuItems = [
  {
    group: "DASHBOARD",
    items: [
      { id: "dashboard", title: "Dashboard Utama", icon: Home },
      { id: "analytics", title: "Analytics", icon: TrendingUp },
      { id: "contact", title: "Saran Masuk", icon: MessageSquare },
    ],
  },
  {
    group: "KONTEN",
    items: [
      { id: "articles", title: "Artikel", icon: FileText },
      { id: "news", title: "Berita", icon: Newspaper },
      { id: "radio", title: "Radio", icon: Radio },
    ],
  },
  {
    group: "PENGATURAN",
    items: [
      { id: "slideshow", title: "Slideshow Home", icon: Settings },
      { id: "structure", title: "Struktur Organisasi", icon: Users },
      { id: "maps", title: "Peta Lokasi", icon: Map },
    ],
  },
];

export const DashboardHeader = ({
  title,
  user,
  onSignOut,
  activePage,
  onNavigate
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-white px-3 sm:px-6">
      {/* Desktop Sidebar Trigger */}
      <div className="hidden lg:block">
        <SidebarTrigger className="text-gray-700" />
      </div>

      {/* Mobile/Tablet Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-700">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-gradient-to-b from-primary via-primary to-primary/90">
            <SheetHeader className="border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <img src={logoUkkpk} alt="UKKPK Logo" className="h-10 w-10" />
                <div className="flex flex-col text-left">
                  <SheetTitle className="text-lg font-bold text-white">UKKPK UNP</SheetTitle>
                  <span className="text-xs text-white/80">Admin Dashboard</span>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-2 py-4">
              {menuItems.map((section) => (
                <div key={section.group} className="mb-6">
                  <h3 className="text-white/60 text-xs font-semibold px-3 mb-2">{section.group}</h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                          ${
                            activePage === item.id
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/90 hover:bg-white/10"
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 truncate flex-1 min-w-0">{title}</h1>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* Mobile/Tablet Search Dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-gray-600 hover:bg-primary hover:text-white transition-colors h-8 w-8 sm:h-9 sm:w-9">
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Dashboard</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search..." className="pl-9 bg-gray-50 border-gray-200" />
            </div>
          </DialogContent>
        </Dialog>

        {/* Desktop Search Bar */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search..." className="w-48 xl:w-64 pl-9 bg-gray-50 border-gray-200" />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")} 
          className="text-gray-600 hover:bg-primary hover:text-white transition-colors h-8 w-8 sm:h-9 sm:w-9" 
          title="Kembali ke Website"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden sm:flex text-gray-600 hover:bg-primary hover:text-white transition-colors h-9 w-9"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {user?.email ? getInitials(user.email) : "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin Account</span>
                <span className="text-xs text-gray-500 truncate">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};