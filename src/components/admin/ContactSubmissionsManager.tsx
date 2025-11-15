import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type ContactSubmission = {
  id: string;
  nama: string;
  email: string;
  phone: string | null;
  program: string | null;
  subject: string | null;
  message: string;
  created_at: string;
};

export const ContactSubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchQuery, submissions]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Gagal memuat data saran");
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    if (!searchQuery) {
      setFilteredSubmissions(submissions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = submissions.filter(
      (sub) =>
        sub.nama.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.subject?.toLowerCase().includes(query) ||
        sub.message.toLowerCase().includes(query)
    );
    setFilteredSubmissions(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus saran ini?")) return;

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Saran berhasil dihapus");
      fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Gagal menghapus saran");
    }
  };

  const handleViewDetail = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p>Memuat data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saran & Masukan</CardTitle>
          <CardDescription>
            Total: {submissions.length} saran masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, email, atau pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchQuery
                        ? "Tidak ada hasil yang ditemukan"
                        : "Belum ada saran masuk"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.nama}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.subject || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(submission.created_at), "dd MMM yyyy, HH:mm", {
                          locale: idLocale,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(submission.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Saran</DialogTitle>
            <DialogDescription>
              {selectedSubmission &&
                format(new Date(selectedSubmission.created_at), "dd MMMM yyyy, HH:mm", {
                  locale: idLocale,
                })}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama</p>
                <p className="text-base">{selectedSubmission.nama}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{selectedSubmission.email}</p>
              </div>
              {selectedSubmission.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                  <p className="text-base">{selectedSubmission.phone}</p>
                </div>
              )}
              {selectedSubmission.program && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Program</p>
                  <p className="text-base">{selectedSubmission.program}</p>
                </div>
              )}
              {selectedSubmission.subject && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-base">{selectedSubmission.subject}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pesan</p>
                <p className="text-base whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
