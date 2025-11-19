import { User } from "@supabase/supabase-js";
import { Search, Bell, Grid3x3, LogOut, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
interface DashboardHeaderProps {
  title: string;
  user: User | null;
  onSignOut: () => void;
}
export const DashboardHeader = ({
  title,
  user,
  onSignOut
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-white px-3 sm:px-6">
      <SidebarTrigger className="text-gray-700" />
      
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Desktop Search Bar */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search..." className="w-48 xl:w-64 pl-9 bg-gray-50 border-gray-200" />
        </div>

        {/* Mobile/Tablet Search Dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-gray-600 hover:bg-primary hover:text-white transition-colors h-9 w-9 sm:h-10 sm:w-10">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
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

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")} 
          className="text-gray-600 hover:bg-primary hover:text-white transition-colors h-9 w-9 sm:h-10 sm:w-10" 
          title="Kembali ke Website"
        >
          <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden sm:flex text-gray-600 hover:bg-primary hover:text-white transition-colors h-9 w-9 sm:h-10 sm:w-10"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                <AvatarFallback className="bg-primary text-white text-xs sm:text-sm">
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