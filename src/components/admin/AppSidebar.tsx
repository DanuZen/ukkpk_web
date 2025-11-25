import { Home, FileText, Newspaper, Radio, Settings, Users, Map, MessageSquare, TrendingUp, Image, Palette } from "lucide-react";
import logoUkkpk from "@/assets/logo-ukkpk.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  {
    group: "DASHBOARD",
    items: [
      { id: "dashboard", title: "Dashboard Utama", icon: Home },
      { id: "analytics", title: "Analitik", icon: TrendingUp },
      { id: "contact", title: "Pesan & Saran", icon: MessageSquare },
    ],
  },
  {
    group: "KONTEN",
    items: [
      { id: "articles", title: "Artikel", icon: FileText },
      { id: "news", title: "Berita", icon: Newspaper },
      { id: "radio", title: "Program Radio", icon: Radio },
    ],
  },
  {
    group: "PENGATURAN",
    items: [
      { id: "slideshow", title: "Galeri Beranda", icon: Settings },
      { id: "banner", title: "Banner Profil", icon: Image },
      { id: "structure", title: "Struktur Organisasi", icon: Users },
      { id: "maps", title: "Lokasi & Peta", icon: Map },
      { id: "theme", title: "Tema Website", icon: Palette },
    ],
  },
];

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  const { open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    // Auto-close sidebar on mobile after navigation
    if (isMobile && openMobile) {
      setOpenMobile(false);
    } else if (isMobile) {
      setOpen(false);
    }
  };

  // Show text when sidebar is open OR when on mobile (offcanvas always shows text)
  const shouldShowText = open || isMobile || openMobile;

  return (
    <Sidebar className="border-r border-primary/20 transition-all duration-300 ease-in-out" collapsible="offcanvas">
      <div className="flex h-full flex-col bg-gradient-to-b from-primary via-primary to-primary/90 animate-fade-in">
        <SidebarHeader className="px-3 py-3 bg-transparent border-b border-white/10">
          <div className="flex items-center gap-2.5 ml-2">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-9 w-9 transition-transform duration-200 hover:scale-110" />
            {shouldShowText && (
              <div className="flex flex-col animate-fade-in">
                <span className="text-base font-bold text-white">UKKPK</span>
                <span className="text-xs text-white/70">Admin Panel</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 bg-transparent">
          {menuItems.map((section, index) => (
            <SidebarGroup key={section.group} className={index > 0 ? "mt-6" : ""}>
              {shouldShowText && (
                <SidebarGroupLabel className="text-white/60 text-xs font-semibold px-3 mb-3 uppercase animate-fade-in">
                  {section.group}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1.5">
                  {section.items.map((item, itemIndex) => (
                    <SidebarMenuItem 
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${itemIndex * 50}ms` }}
                    >
                        <SidebarMenuButton
                        onClick={() => handleNavigate(item.id)}
                        className={`
                          transition-all duration-200 cursor-pointer rounded-lg py-2.5
                          hover:translate-x-1 hover:shadow-sm
                          ${
                            activePage === item.id
                              ? "bg-white/20 text-white font-semibold shadow-md"
                              : "text-white/90 hover:bg-white/10"
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200" />
                        {shouldShowText && <span className="ml-3">{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
