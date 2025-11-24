import { User } from "@supabase/supabase-js";
import { Search, Bell, LogOut, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-white shadow-sm px-3 sm:px-6">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="text-gray-700 hover:bg-primary hover:text-white transition-colors rounded-md flex-shrink-0" />
      
      {/* Search Bar - Now prominently positioned */}
      <div className="relative flex-1 max-w-xs sm:max-w-md">
        <Search className="absolute left-2 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Cari..." 
          className="w-full pl-7 sm:pl-9 pr-2 sm:pr-3 h-8 sm:h-9 md:h-10 text-xs sm:text-sm bg-gray-50 border-gray-200 focus:bg-white" 
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
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