import { Home, FileText, Newspaper, Radio, Settings, Users, Map, MessageSquare, TrendingUp, Image } from "lucide-react";
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
    ],
  },
];

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  const { open, setOpen, isMobile } = useSidebar();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    // Auto-close sidebar on mobile after navigation
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white" collapsible="offcanvas">
      <div className="flex h-full flex-col">
        <SidebarHeader className="border-b border-gray-200 px-3 py-3 bg-white">
          <div className="flex items-center gap-2.5">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-9 w-9" />
            {open && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-primary">UKKPK</span>
                <span className="text-xs text-gray-500">Admin Panel</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 bg-white">
          {menuItems.map((section) => (
            <SidebarGroup key={section.group}>
              {open && (
                <SidebarGroupLabel className="text-gray-400 text-xs font-semibold px-3 mb-2 uppercase">
                  {section.group}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => handleNavigate(item.id)}
                        className={`
                          transition-all duration-200 cursor-pointer rounded-lg
                          ${
                            activePage === item.id
                              ? "bg-primary text-white font-medium hover:bg-primary/90"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                        {open && <span>{item.title}</span>}
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
