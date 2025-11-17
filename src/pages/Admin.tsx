import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { toast } from "sonner";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { NewsManager } from "@/components/admin/NewsManager";
import { RadioManager } from "@/components/admin/RadioManager";
import { ProfileManager } from "@/components/admin/ProfileManager";
import { MapManager } from "@/components/admin/MapManager";
import { ContactSubmissionsManager } from "@/components/admin/ContactSubmissionsManager";

const Admin = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

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
      articles: "Kelola Artikel",
      news: "Kelola Berita",
      radio: "Kelola Radio",
      slideshow: "Slideshow Home",
      structure: "Struktur Organisasi",
      maps: "Peta Lokasi",
      contact: "Saran Masuk",
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
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar activePage={activePage} onNavigate={setActivePage} />
          
          <main className="flex-1 flex flex-col">
            <DashboardHeader 
              title={getPageTitle(activePage)} 
              user={user}
              onSignOut={handleSignOut}
            />
            
            <div className="flex-1 p-6">
              {activePage === "dashboard" && <DashboardOverview />}
              {activePage === "articles" && <ArticlesManager />}
              {activePage === "news" && <NewsManager />}
              {activePage === "radio" && <RadioManager />}
              {activePage === "slideshow" && <ProfileManager activeTab="slideshow" />}
              {activePage === "structure" && <ProfileManager activeTab="structure" />}
              {activePage === "maps" && <MapManager />}
              {activePage === "contact" && <ContactSubmissionsManager />}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AdminLayout>
  );
};

export default Admin;
