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
    <Sidebar className="border-r border-gray-200 bg-white transition-all duration-300 ease-in-out" collapsible="offcanvas">
      <div className="flex h-full flex-col animate-fade-in">
        <SidebarHeader className="px-3 py-3 bg-white">
          <div className="flex items-center gap-2.5 ml-2">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-9 w-9 transition-transform duration-200 hover:scale-110" />
            {shouldShowText && (
              <div className="flex flex-col animate-fade-in">
                <span className="text-base font-bold text-primary">UKKPK</span>
                <span className="text-xs text-gray-500">Admin Panel</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 bg-white">
          {menuItems.map((section, index) => (
            <SidebarGroup key={section.group} className={index > 0 ? "mt-6" : ""}>
              {shouldShowText && (
                <SidebarGroupLabel className="text-gray-400 text-xs font-semibold px-3 mb-3 uppercase animate-fade-in">
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
                              ? "bg-primary text-white font-medium hover:bg-primary/90 shadow-md"
                              : "text-gray-700 hover:bg-gray-100"
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
