import { Home, FileText, Newspaper, Radio, Settings, Users, Map, MessageSquare, TrendingUp } from "lucide-react";
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
      { id: "testimonials", title: "Testimoni", icon: MessageSquare },
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

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r-0">
      <div className="flex h-full flex-col bg-gradient-to-b from-primary via-primary to-primary/90">
        <SidebarHeader className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-10 w-10" />
            {open && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">UKKPK UNP</span>
                <span className="text-xs text-white/80">Admin Dashboard</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          {menuItems.map((section) => (
            <SidebarGroup key={section.group}>
              <SidebarGroupLabel className="text-white/60 text-xs font-semibold px-3 mb-1">
                {section.group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onNavigate(item.id)}
                        className={`
                          transition-all duration-200 cursor-pointer
                          ${
                            activePage === item.id
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/90 hover:bg-white/10"
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
