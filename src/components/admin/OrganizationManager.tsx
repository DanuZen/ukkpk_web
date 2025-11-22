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
      <div className="flex justify-between items-start gap-2">
        <div>
          <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900">
            {editingId ? "Edit Struktur" : "Kelola Struktur Organisasi"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {editingId ? "Perbarui data anggota organisasi" : "Kelola data pengurus dan struktur UKKPK"}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-xl">
            {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="name" className="text-[10px] sm:text-xs md:text-sm">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="position" className="text-[10px] sm:text-xs md:text-sm">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="photo_url" className="text-[10px] sm:text-xs md:text-sm">URL Foto</Label>
              <Input
                id="photo_url"
                value={formData.photo_url}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
                className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="order_index" className="text-[10px] sm:text-xs md:text-sm">Urutan</Label>
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
                className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <Button type="submit" className="h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm flex-1">
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
                className="h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm"
              >
                Batal
              </Button>
            )}
          </div>
        </form>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 md:space-y-3">
                {member.photo_url && (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full object-cover"
                  />
                )}
                      <div>
                        <p className="font-medium text-[10px] sm:text-xs md:text-sm line-clamp-1">{member.name}</p>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground line-clamp-1">
                          {member.position}
                        </p>
                      </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 mt-1 sm:mt-2 md:mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0"
                  >
                    <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(member.id)}
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
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
