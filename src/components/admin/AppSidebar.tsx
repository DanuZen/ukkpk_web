import { useState, useEffect } from "react";
import { Home, FileText, Newspaper, Radio, Settings, Users, Map, MessageSquare, TrendingUp, Image, Palette, LayoutDashboard, FileStack, SettingsIcon, ChevronDown } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userRole?: string | null;
}

const menuItems = [
  {
    group: "DASHBOARD",
    icon: LayoutDashboard,
    items: [
      { id: "dashboard", title: "Dashboard Utama", icon: Home },
      { id: "analytics", title: "Analitik", icon: TrendingUp },
      { id: "contact", title: "Pesan & Saran", icon: MessageSquare },
    ],
  },
  {
    group: "KONTEN",
    icon: FileStack,
    items: [
      { id: "articles", title: "Artikel", icon: FileText },
      { id: "news", title: "Berita", icon: Newspaper },
      { id: "radio", title: "Program Radio", icon: Radio },
    ],
  },
  {
    group: "PENGATURAN",
    icon: SettingsIcon,
    items: [
      { id: "popup", title: "Popup Welcome", icon: Image },
      { id: "slideshow", title: "Galeri Beranda", icon: Settings },
      { id: "banner", title: "Banner Profil", icon: Image },
      { id: "structure", title: "Struktur Organisasi", icon: Users },
      { id: "maps", title: "Lokasi & Peta", icon: Map },
      { id: "theme", title: "Tema Website", icon: Palette },
    ],
  },
];

export function AppSidebar({ activePage, onNavigate, userRole }: AppSidebarProps) {
  const { open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();
  
  // Filter menu items based on role
  const getFilteredMenuItems = () => {
    // Admin sees everything
    if (!userRole || userRole === 'admin') return menuItems;

    return menuItems.map(group => {
      // Filter items based on role
      const filteredItems = group.items.filter(item => {
        if (userRole === 'admin_jurnalistik') {
          // Jurnalistik: Dashboard, Analytics, Articles, News
          return ['dashboard', 'analytics', 'articles', 'news'].includes(item.id);
        }
        if (userRole === 'admin_radio') {
          // Radio: Dashboard, Analytics, Radio
          return ['dashboard', 'analytics', 'radio'].includes(item.id);
        }
        return false;
      });

      return {
        ...group,
        items: filteredItems
      };
    }).filter(group => group.items.length > 0); // Remove empty groups
  };

  const filteredMenuItems = getFilteredMenuItems();
  
  // Find which group contains the active page
  const getActiveGroup = () => {
    for (const section of filteredMenuItems) {
      if (section.items.some(item => item.id === activePage)) {
        return section.group;
      }
    }
    return null;
  };

  // Initialize with the active group open
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const activeGroup = getActiveGroup();
    return activeGroup ? [activeGroup] : ["DASHBOARD"];
  });

  // Update open groups when active page changes
  useEffect(() => {
    const activeGroup = getActiveGroup();
    if (activeGroup && !openGroups.includes(activeGroup)) {
      setOpenGroups(prev => [...prev, activeGroup]);
    }
  }, [activePage]);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

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

        <SidebarContent className="px-3 py-2 bg-transparent scrollbar-hide">
          {filteredMenuItems.map((section, index) => (
            <Collapsible
              key={section.group}
              open={openGroups.includes(section.group)}
              onOpenChange={() => toggleGroup(section.group)}
              className={index > 0 ? "mt-2" : ""}
            >
              <SidebarGroup>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 group">
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-white/80" />
                    {shouldShowText && (
                      <span className="text-white/80 text-xs font-semibold uppercase">
                        {section.group}
                      </span>
                    )}
                  </div>
                  {shouldShowText && (
                    <ChevronDown 
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                        openGroups.includes(section.group) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-1">
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
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
                                  ? "bg-white/20 !text-white font-semibold shadow-md"
                                  : "text-white hover:bg-white/10 hover:text-white"
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
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
