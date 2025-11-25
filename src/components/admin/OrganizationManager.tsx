import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  order_index: number | null;
}

export const OrganizationManager = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photo_url: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("organization")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Gagal memuat struktur organisasi");
      return;
    }
    setMembers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("organization")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Data berhasil diupdate");
      } else {
        const { error } = await supabase.from("organization").insert([formData]);

        if (error) throw error;
        toast.success("Data berhasil ditambahkan");
      }

      setFormData({ name: "", position: "", photo_url: "", order_index: 0 });
      setEditingId(null);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (member: OrgMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      position: member.position,
      photo_url: member.photo_url || "",
      order_index: member.order_index || 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    const { error } = await supabase.from("organization").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus data");
      return;
    }

    toast.success("Data berhasil dihapus");
    fetchMembers();
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          {editingId ? "Edit Struktur" : "Kelola Struktur Organisasi"}
        </h2>
        <p className="text-sm sm:text-sm text-gray-600 mt-1">
          {editingId ? "Perbarui data anggota organisasi" : "Kelola data pengurus dan struktur UKKPK"}
        </p>
      </div>
      <Card className="shadow-xl">
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-10 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm sm:text-base">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="h-10 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo_url" className="text-sm sm:text-base">URL Foto</Label>
              <Input
                id="photo_url"
                value={formData.photo_url}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_index" className="text-sm sm:text-base">Urutan</Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="h-10 text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="h-10 text-sm flex-1">
                {editingId ? "Update" : "Tambah"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                  setFormData({
                    name: "",
                    position: "",
                    photo_url: "",
                    order_index: 0,
                  });
                }}
                className="h-10 text-sm sm:w-auto"
              >
                Batal
              </Button>
            )}
          </div>
        </form>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="shadow-xl">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                {member.photo_url && (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
                  />
                )}
                      <div>
                        <p className="font-medium text-xs sm:text-sm md:text-base line-clamp-1">{member.name}</p>
                        <p className="text-xs sm:text-xs md:text-sm text-muted-foreground line-clamp-1">
                          {member.position}
                        </p>
                      </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(member.id)}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
