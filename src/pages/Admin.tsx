import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { toast } from "sonner";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { NewsManager } from "@/components/admin/NewsManager";
import { RadioManager } from "@/components/admin/RadioManager";
import { ProfileManager } from "@/components/admin/ProfileManager";
import { MapManager } from "@/components/admin/MapManager";
import { ContactSubmissionsManager } from "@/components/admin/ContactSubmissionsManager";
import { ThemeManager } from "@/components/admin/ThemeManager";

const Admin = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && !isAdmin) {
      toast.error("Anda tidak memiliki akses admin");
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Berhasil logout");
    navigate("/");
  };

  const getPageTitle = (page: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard Utama",
      analytics: "Analytics & Statistik",
      articles: "Kelola Artikel",
      news: "Kelola Berita",
      radio: "Kelola Radio",
      slideshow: "Slideshow Home",
      banner: "Banner Profil UKKPK",
      structure: "Struktur Organisasi",
      maps: "Peta Lokasi",
      contact: "Saran Masuk & Testimoni",
      theme: "Tema Website",
    };
    return titles[page] || "Dashboard";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-600">Memuat...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <AppSidebar activePage={activePage} onNavigate={setActivePage} />
          
          <main className="flex-1 flex flex-col">
            <DashboardHeader 
              title={getPageTitle(activePage)} 
              user={user}
              onSignOut={handleSignOut}
              activePage={activePage}
              onNavigate={setActivePage}
            />
            
            <div className="flex-1 p-4 sm:p-6 bg-gray-100">
              {activePage === "dashboard" && <DashboardOverview />}
              {activePage === "analytics" && <AnalyticsDashboard />}
              {activePage === "articles" && <ArticlesManager />}
              {activePage === "news" && <NewsManager />}
              {activePage === "radio" && <RadioManager />}
              {activePage === "slideshow" && <ProfileManager activeTab="slideshow" />}
              {activePage === "banner" && <ProfileManager activeTab="banner" />}
              {activePage === "structure" && <ProfileManager activeTab="structure" />}
              {activePage === "maps" && <MapManager />}
              {activePage === "contact" && <ContactSubmissionsManager />}
              {activePage === "theme" && <ThemeManager />}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AdminLayout>
  );
};

export default Admin;
