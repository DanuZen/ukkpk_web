import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  FileText,
  Newspaper,
  Radio,
  Images,
  MonitorPlay,
  Users,
  MapPin,
  Palette,
  LogOut,
  UserPlus,
  User2,
  Play,
  Pause,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoUKKPK from "@/assets/logo-ukkpk.png";

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userRole?: string | null;
}

export function AppSidebar({ activePage, onNavigate, userRole }: AppSidebarProps) {
  const { user, signOut, addAccount, switchAccount, availableAccounts } = useAuth();
  const navigate = useNavigate();
  const { isMobile, state, setOpen } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAddAccount = async () => {
    await addAccount();
    navigate("/auth");
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Theme song URL (replace with actual URL)
  const themeSong = "/theme-song.mp3"; 

  const handleInteraction = () => {
    setShowIcon(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowIcon(false), 2000);
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(themeSong);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    handleInteraction();
  };

  const menuItems = [
    {
      title: "DASHBOARD",
      items: [
        {
          title: "Dashboard Utama",
          icon: LayoutDashboard,
          id: "dashboard",
        },
        {
          title: "Analitik",
          icon: BarChart3,
          id: "analytics",
        },
        {
          title: "Pesan & Saran",
          icon: MessageSquare,
          id: "contact",
        },
      ],
    },
    {
      title: "KONTEN",
      items: [
        {
          title: "Artikel",
          icon: FileText,
          id: "articles",
        },
        {
          title: "Berita",
          icon: Newspaper,
          id: "news",
        },
        {
          title: "Program Radio",
          icon: Radio,
          id: "radio",
        },
      ],
    },
    {
      title: "PENGATURAN",
      items: [
        {
          title: "Popup Welcome",
          icon: MessageSquare,
          id: "popup",
        },
        {
          title: "Galeri Beranda",
          icon: Images,
          id: "slideshow",
        },
        {
          title: "Banner Profil",
          icon: MonitorPlay,
          id: "banner",
        },
        {
          title: "Struktur Organisasi",
          icon: Users,
          id: "structure",
        },
        {
          title: "Lokasi & Peta",
          icon: MapPin,
          id: "maps",
        },
        {
          title: "Tema Website",
          icon: Palette,
          id: "theme",
        },
      ],
    },
  ];

  // Filter menu items based on role
  const filteredMenuItems = menuItems.map(group => {
    // If admin_jurnalistik, only show Dashboard, Analytics, Content (Articles/News), and Theme
    if (userRole === 'admin_jurnalistik') {
      if (group.title === 'DASHBOARD') {
        return {
          ...group,
          items: group.items.filter(item => ['dashboard', 'analytics'].includes(item.id))
        };
      }
      if (group.title === 'KONTEN') {
        return {
          ...group,
          items: group.items.filter(item => ['articles', 'news'].includes(item.id))
        };
      }
      if (group.title === 'PENGATURAN') {
        return {
          ...group,
          items: group.items.filter(item => item.id === 'theme')
        };
      }
      return null;
    }
    
    // If admin_radio, only show Dashboard, Analytics, Content (Radio), and Theme
    if (userRole === 'admin_radio') {
      if (group.title === 'DASHBOARD') {
        return {
          ...group,
          items: group.items.filter(item => ['dashboard', 'analytics'].includes(item.id))
        };
      }
      if (group.title === 'KONTEN') {
        return {
          ...group,
          items: group.items.filter(item => item.id === 'radio')
        };
      }
      if (group.title === 'PENGATURAN') {
        return {
          ...group,
          items: group.items.filter(item => item.id === 'theme')
        };
      }
      return null;
    }

    // Default (admin/superadmin) sees everything
    return group;
  }).filter(Boolean) as typeof menuItems;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-full w-full flex-col bg-[#D31027] text-white">
        <SidebarHeader className="border-b border-white/10 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                onClick={togglePlay}
                onMouseEnter={() => setShowIcon(true)}
                onMouseLeave={() => setShowIcon(false)}
                className="hover:bg-white/10 active:bg-white/20 data-[state=open]:bg-white/10 text-white hover:text-white cursor-pointer transition-all duration-300"
              >
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg text-white relative">
                  <img src={logoUKKPK} alt="UKKPK Logo" className={`size-12 object-contain transition-opacity duration-300 ${showIcon ? 'opacity-50' : 'opacity-100'}`} />
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showIcon ? 'opacity-100' : 'opacity-0'}`}>
                    {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-xl">UKKPK</span>
                  <span className="truncate text-sm text-white/80">Admin Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        
        <SidebarContent className="px-2 py-2">
          {filteredMenuItems.map((group) => (
            <SidebarGroup key={group.title} className="mb-0">
              <SidebarGroupLabel className="text-xs font-bold text-white/60 uppercase tracking-wider px-2 mb-1 group-data-[collapsible=icon]:hidden">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onNavigate(item.id)}
                        tooltip={item.title}
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                          "hover:bg-white/10 hover:text-white",
                          activePage === item.id 
                            ? "bg-white text-[#D31027] hover:bg-white hover:text-[#D31027] font-medium shadow-sm" 
                            : "text-white/90"
                        )}
                      >
                        <item.icon className={cn("size-5 group-data-[collapsible=icon]:size-4", activePage === item.id ? "text-[#D31027]" : "text-white/80")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu 
                open={isDropdownOpen} 
                onOpenChange={(open) => {
                  if (open && state === "collapsed") {
                    setOpen(true);
                    // Wait for sidebar expansion animation to finish before opening dropdown
                    setTimeout(() => setIsDropdownOpen(true), 300);
                  } else {
                    setIsDropdownOpen(open);
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="hover:bg-white/10 data-[state=open]:bg-white/10 text-white hover:text-white"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white">
                      <User2 className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold">{user?.email?.split('@')[0] || 'User'}</span>
                      <span className="truncate text-xs text-white/70">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={isMobile ? "bottom" : (state === "collapsed" ? "right" : "top")}
                  sideOffset={0}
                  className="min-w-56 bg-[#D31027] text-white border-none shadow-none mb-2 rounded-b-none p-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-5 duration-300"
                >
                  {availableAccounts.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs text-white/60 pt-0 pl-4 pb-1">GANTI AKUN</DropdownMenuLabel>
                      {availableAccounts.map((acc) => (
                        <DropdownMenuItem 
                          key={acc.user.email} 
                          onClick={() => switchAccount(acc.user.email!)} 
                          className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white group pl-4"
                        >
                          <User2 className="mr-2 h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{acc.user.email?.split('@')[0]}</span>
                            <span className="text-[10px] text-white/60 group-focus:text-white/80">{acc.user.email}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="bg-white/10" />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleAddAccount} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white pl-4">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Tambah Akun</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-white/90 hover:text-white focus:text-white focus:bg-white/10 pl-4">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
      <SidebarRail className="hover:after:bg-white/20" />
    </Sidebar>
  );
}
