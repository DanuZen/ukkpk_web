import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { NewsManager } from "@/components/admin/NewsManager";
import { RadioManager } from "@/components/admin/RadioManager";
import { ProfileManager } from "@/components/admin/ProfileManager";
import { HomeSlideshowManager } from "@/components/admin/HomeSlideshowManager";
import { OrganizationManager } from "@/components/admin/OrganizationManager";
import { SocialMediaManager } from "@/components/admin/SocialMediaManager";
import { MapManager } from "@/components/admin/MapManager";
import { DivisionLogosManager } from "@/components/admin/DivisionLogosManager";

const Admin = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <p>Memuat...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-2">
            <TabsTrigger value="articles">Artikel</TabsTrigger>
            <TabsTrigger value="news">Berita</TabsTrigger>
            <TabsTrigger value="radio">Radio</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="slideshow">Slideshow</TabsTrigger>
            <TabsTrigger value="organization">Organisasi</TabsTrigger>
            <TabsTrigger value="social">Media Sosial</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="logos">Logo Bidang</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <ArticlesManager />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="radio">
            <RadioManager />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManager />
          </TabsContent>

          <TabsContent value="slideshow">
            <HomeSlideshowManager />
          </TabsContent>

          <TabsContent value="organization">
            <OrganizationManager />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaManager />
          </TabsContent>

          <TabsContent value="map">
            <MapManager />
          </TabsContent>

          <TabsContent value="logos">
            <DivisionLogosManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
