import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Newspaper,
  Radio,
  MessageSquare,
  Images,
  Map,
  Palette,
  Users,
  MonitorPlay,
  LogOut,
  ChevronUp,
  User2,
  MapPin
} from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoUKKPK from "@/assets/logo-ukkpk.png";

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userRole?: string;
}

export function AppSidebar({ activePage, onNavigate, userRole }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-full w-full flex-col bg-[#D31027] text-white">
        <SidebarHeader className="border-b border-white/10 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="hover:bg-white/10 active:bg-white/20 data-[state=open]:bg-white/10 text-white hover:text-white"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-white">
                  <img src={logoUKKPK} alt="UKKPK Logo" className="size-8 object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-base">UKKPK</span>
                  <span className="truncate text-xs text-white/80">Admin Panel</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        
        <SidebarContent className="px-2 py-4">
          {menuItems.map((group) => (
            <SidebarGroup key={group.title} className="mb-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="hover:bg-white/10 data-[state=open]:bg-white/10 text-white hover:text-white"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white">
                      <User2 className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold">{user?.email?.split('@')[0] || 'Admin'}</span>
                      <span className="truncate text-xs text-white/70">{userRole || "Administrator"}</span>
                    </div>
                    <ChevronUp className="ml-auto text-white/70 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-white text-gray-900 border-gray-200"
                >
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
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
