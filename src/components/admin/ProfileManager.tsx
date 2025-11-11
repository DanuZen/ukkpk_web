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
}

export const ProfileManager = () => {
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [formData, setFormData] = useState({
    banner_url: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, banner_url: publicUrl }));
      toast.success("Banner berhasil diupload");
    } catch (error) {
      toast.error("Gagal upload banner");
      console.error(error);
    } finally {
      setUploading(false);
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image if selected
    if (imageFile) {
      await handleImageUpload(imageFile);
      return;
    }

    if (profile) {
      const { error } = await supabase
        .from("profile_settings")
        .update(formData)
        .eq("id", profile.id);

      if (error) {
        toast.error("Gagal mengupdate profil");
        return;
      }
      toast.success("Profil berhasil diupdate");
    } else {
      const { error } = await supabase
        .from("profile_settings")
        .insert([formData]);

      if (error) {
        toast.error("Gagal membuat profil");
        return;
      }
      toast.success("Profil berhasil dibuat");
    }

    fetchProfile();
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
