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
    <div className="space-y-2 sm:space-y-3 md:space-y-6">
      <Card>
        <CardHeader className="p-2 sm:p-3 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-2xl">
            {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2 md:space-y-4">
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="name" className="text-xs sm:text-sm">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="position" className="text-xs sm:text-sm">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
                required
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="photo_url" className="text-xs sm:text-sm">URL Foto</Label>
              <Input
                id="photo_url"
                value={formData.photo_url}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <Label htmlFor="order_index" className="text-xs sm:text-sm">Urutan</Label>
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
                className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm"
              />
            </div>
            <div className="flex gap-1 sm:gap-2">
              <Button type="submit" className="h-7 sm:h-8 md:h-10 text-xs sm:text-sm flex-1">
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
              >
                Batal
              </Button>
            )}
          </div>
        </form>
        </CardContent>
      </Card>

      <div className="grid gap-1.5 sm:gap-2 md:gap-4 grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-2 sm:p-3 md:p-6">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-1.5 md:space-y-2">
                {member.photo_url && (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full object-cover"
                  />
                )}
                      <div>
                        <p className="font-medium text-xs sm:text-sm md:text-base line-clamp-1">{member.name}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-1">
                          {member.position}
                        </p>
                      </div>
                <div className="flex gap-0.5 sm:gap-1 md:gap-2 mt-1 sm:mt-2 md:mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 p-0"
                  >
                    <Pencil className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(member.id)}
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 p-0"
                  >
                    <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
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
