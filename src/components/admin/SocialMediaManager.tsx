import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Instagram, Youtube, Facebook } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  organization: string;
  url: string;
}

export const SocialMediaManager = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({
    platform: "instagram",
    organization: "UKKPK",
    url: "",
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from("social_media_links")
      .select("*")
      .order("organization", { ascending: true })
      .order("platform", { ascending: true });

    if (error) {
      toast.error("Gagal memuat data");
      return;
    }

    setLinks(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url) {
      toast.error("URL tidak boleh kosong");
      return;
    }

    const { error } = await supabase
      .from("social_media_links")
      .insert([formData]);

    if (error) {
      toast.error("Gagal menambahkan link");
      return;
    }

    toast.success("Link berhasil ditambahkan");
    setFormData({ platform: "instagram", organization: "UKKPK", url: "" });
    fetchLinks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus link ini?")) return;

    const { error } = await supabase
      .from("social_media_links")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus link");
      return;
    }

    toast.success("Link berhasil dihapus");
    fetchLinks();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Media Sosial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Organisasi</Label>
              <Select
                value={formData.organization}
                onValueChange={(value) =>
                  setFormData({ ...formData, organization: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UKKPK">UKKPK</SelectItem>
                  <SelectItem value="SIGMA">SIGMA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://..."
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Tambah Link
          </Button>
        </form>

        <div className="space-y-3">
          <h3 className="font-semibold">Link yang Ada</h3>
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada link</p>
          ) : (
            <div className="grid gap-3">
              {links.map((link) => (
                <Card key={link.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(link.platform)}
                      <div>
                        <p className="font-medium capitalize">
                          {link.platform} - {link.organization}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
