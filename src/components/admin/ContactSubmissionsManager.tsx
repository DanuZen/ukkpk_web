import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Star, CheckCircle2, XCircle, Eye, Search, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

type ContactSubmission = {
  id: string;
  nama: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  is_testimonial: boolean;
  testimonial_rating: number;
  testimonial_order: number;
};

export const ContactSubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editOrder, setEditOrder] = useState(0);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchQuery, submissions]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      toast.error('Gagal memuat data saran');
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
        sub.message.toLowerCase().includes(query)
    );
    setFilteredSubmissions(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus saran ini?')) return;

    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);

      if (error) throw error;

      toast.success('Saran berhasil dihapus');
      fetchSubmissions();
    } catch (error) {
      toast.error('Gagal menghapus saran');
    }
  };

  const handleToggleTestimonial = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_testimonial: !currentValue })
        .eq('id', id);

      if (error) throw error;

      toast.success(!currentValue ? 'Ditambahkan ke testimoni' : 'Dihapus dari testimoni');
      fetchSubmissions();
    } catch (error) {
      toast.error('Gagal mengupdate status testimoni');
    }
  };

  const handleUpdateTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          testimonial_rating: editRating,
          testimonial_order: editOrder,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Testimoni berhasil diupdate');
      setEditingId(null);
      fetchSubmissions();
    } catch (error) {
      toast.error('Gagal mengupdate testimoni');
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

  const testimonialCount = submissions.filter((s) => s.is_testimonial).length;

  return (
    <>
      <div className="flex justify-between items-start gap-1 mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 animate-fade-in" />
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Saran & Masukan</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">
              Total: {submissions.length} saran | Testimoni: {testimonialCount}
            </p>
          </div>
        </div>
      </div>
      <Card className="shadow-xl">
        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 md:p-6">
          <CardTitle className="text-sm sm:text-base md:text-xl">Daftar Saran</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
          <div className="mb-3 sm:mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, email, atau pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nama</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Pesan</TableHead>
                  <TableHead className="text-xs">Tanggal</TableHead>
                  <TableHead className="text-center text-xs">Testimoni</TableHead>
                  <TableHead className="text-center text-xs">Rating</TableHead>
                  <TableHead className="text-right text-xs">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-sm">
                      {searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Belum ada saran masuk'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium text-sm">{submission.nama}</TableCell>
                      <TableCell className="text-sm">{submission.email}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm line-clamp-2">{submission.message}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(submission.created_at), 'dd MMM yyyy', {
                          locale: idLocale,
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() =>
                            handleToggleTestimonial(submission.id, submission.is_testimonial)
                          }
                          className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          {submission.is_testimonial ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        {submission.is_testimonial && (
                          <Dialog
                            open={editingId === submission.id}
                            onOpenChange={(open) => {
                              if (open) {
                                setEditingId(submission.id);
                                setEditRating(submission.testimonial_rating || 5);
                                setEditOrder(submission.testimonial_order || 0);
                              } else {
                                setEditingId(null);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <div className="flex items-center gap-1">
                                  {Array.from({
                                    length: submission.testimonial_rating || 5,
                                  }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Testimoni</DialogTitle>
                                <DialogDescription>
                                  Ubah rating dan urutan tampilan testimoni
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label>Rating (1-5)</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={editRating}
                                    onChange={(e) =>
                                      setEditRating(parseInt(e.target.value) || 5)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Urutan Tampilan</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editOrder}
                                    onChange={(e) =>
                                      setEditOrder(parseInt(e.target.value) || 0)
                                    }
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Semakin kecil angka, semakin awal ditampilkan
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleUpdateTestimonial(submission.id)}
                                  className="w-full"
                                >
                                  Simpan Perubahan
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(submission)}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(submission.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-3">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                {searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Belum ada saran masuk'}
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="p-3 sm:p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{submission.nama}</h4>
                        <p className="text-xs text-gray-600 truncate">{submission.email}</p>
                      </div>
                      <button
                        onClick={() =>
                          handleToggleTestimonial(submission.id, submission.is_testimonial)
                        }
                        className="flex-shrink-0"
                      >
                        {submission.is_testimonial ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">{submission.message}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(submission.created_at), 'dd MMM yyyy, HH:mm', {
                        locale: idLocale,
                      })}
                    </p>
                    <div className="flex gap-1 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex-1"
                        onClick={() => handleViewDetail(submission)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Detail
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(submission.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Saran</DialogTitle>
            <DialogDescription>
              {selectedSubmission &&
                format(new Date(selectedSubmission.created_at), 'dd MMMM yyyy, HH:mm', {
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pesan</p>
                <p className="text-base whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status Testimoni</p>
                <p className="text-base">
                  {selectedSubmission.is_testimonial ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Ditampilkan sebagai testimoni
                    </span>
                  ) : (
                    <span className="text-gray-500">Belum dijadikan testimoni</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
