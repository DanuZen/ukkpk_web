import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Search, Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  student_id: string;
  department: string;
  reason: string;
  created_at: string;
}

export const RegistrationManager = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("registrations" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      toast.error("Gagal memuat data pendaftaran");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("registrations" as any)
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setRegistrations(registrations.filter((r) => r.id !== deleteId));
      toast.success("Data pendaftaran berhasil dihapus");
    } catch (error: any) {
      console.error("Error deleting registration:", error);
      toast.error("Gagal menghapus data pendaftaran");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = [
      ["Nama Lengkap", "Email", "No. HP", "NIM", "Jurusan", "Alasan", "Tanggal Daftar"],
      ...filteredRegistrations.map((r) => [
        `"${r.full_name}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.student_id}"`,
        `"${r.department}"`,
        `"${r.reason.replace(/"/g, '""')}"`,
        `"${new Date(r.created_at).toLocaleString()}"`,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pendaftaran_ukkpk_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Data Pendaftaran ({filteredRegistrations.length})</CardTitle>
          <Button variant="outline" onClick={handleExport} disabled={filteredRegistrations.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, NIM, atau jurusan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NIM / Jurusan</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada data pendaftaran ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">
                        <div>{reg.full_name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={reg.reason}>
                          {reg.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{reg.student_id}</div>
                        <div className="text-xs text-muted-foreground">{reg.department}</div>
                      </TableCell>
                      <TableCell>
                        <div>{reg.email}</div>
                        <div className="text-xs text-muted-foreground">{reg.phone}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteId(reg.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data pendaftaran dari <strong>{reg.full_name}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
