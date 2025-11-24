import { User } from "@supabase/supabase-js";
import { Search, Bell, LogOut, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface DashboardHeaderProps {
  title: string;
  user: User | null;
  onSignOut: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const DashboardHeader = ({
  title,
  user,
  onSignOut,
  activePage,
  onNavigate
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-white shadow-sm px-3 sm:px-6">
      {/* Sidebar Trigger - All screen sizes */}
      <SidebarTrigger className="text-gray-700" />
      
      {/* Title - Hidden when search is open on mobile */}
      <h1 className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 truncate flex-1 min-w-0 ${searchOpen ? 'hidden lg:block' : ''}`}>{title}</h1>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* Mobile/Tablet Search Toggle Button */}
        {!searchOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
            className="lg:hidden text-gray-600 hover:bg-primary hover:text-white transition-colors h-8 w-8 sm:h-9 sm:w-9"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        {/* Mobile/Tablet Search Input - Inline */}
        {searchOpen && (
          <div className="relative flex-1 lg:hidden flex items-center gap-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search..." className="w-full pl-9 pr-2 h-8 sm:h-9 text-xs sm:text-sm bg-gray-50 border-gray-200" />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSearchOpen(false)}
              className="text-gray-600 hover:bg-primary hover:text-white transition-colors h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Desktop Search Bar - Always Visible */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search..." className="w-48 xl:w-64 pl-9 bg-gray-50 border-gray-200" />
        </div>

        {!searchOpen && (
          <>
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
          </>
        )}

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