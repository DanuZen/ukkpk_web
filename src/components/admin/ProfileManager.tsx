import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileSettings {
  id: string;
  banner_url: string | null;
  description: string | null;
  organization_image_url: string | null;
}

export const ProfileManager = () => {
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [formData, setFormData] = useState({
    banner_url: "",
    description: "",
    organization_image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [orgImageFile, setOrgImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profile_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        banner_url: data.banner_url || "",
        description: data.description || "",
        organization_image_url: data.organization_image_url || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let bannerUrl = formData.banner_url;
      let organizationImageUrl = formData.organization_image_url;

      // Upload banner image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `profile/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        bannerUrl = publicUrl;
      }

      // Upload organization image if new file selected
      if (orgImageFile) {
        const fileExt = orgImageFile.name.split('.').pop();
        const fileName = `org_${Math.random()}.${fileExt}`;
        const filePath = `profile/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, orgImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        organizationImageUrl = publicUrl;
      }

      const dataToSave = { 
        ...formData, 
        banner_url: bannerUrl,
        organization_image_url: organizationImageUrl
      };

      if (profile) {
        const { error } = await supabase
          .from("profile_settings")
          .update(dataToSave)
          .eq("id", profile.id);

        if (error) throw error;
        toast.success("Profil berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("profile_settings")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Profil berhasil dibuat");
      }

      setImageFile(null);
      setOrgImageFile(null);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Profil UKKPK</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            id="banner-upload"
            label="Banner Profil"
            currentImageUrl={formData.banner_url}
            onFileSelect={(file) => setImageFile(file)}
            onRemove={() => setFormData({ ...formData, banner_url: "" })}
            disabled={uploading}
          />

          <ImageUpload
            id="organization-upload"
            label="Foto Struktur Organisasi"
            currentImageUrl={formData.organization_image_url}
            onFileSelect={(file) => setOrgImageFile(file)}
            onRemove={() => setFormData({ ...formData, organization_image_url: "" })}
            disabled={uploading}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi UKKPK</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi tentang UKKPK"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Simpan Perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
