import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfilUkkpk from "./pages/ProfilUkkpk";
import Artikel from "./pages/Artikel";
import ArtikelDetail from "./pages/ArtikelDetail";
import Berita from "./pages/Berita";
import BeritaDetail from "./pages/BeritaDetail";
import Radio from "./pages/Radio";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Pendaftaran from "./pages/Pendaftaran";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/artikel/:id" element={<ArtikelDetail />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<BeritaDetail />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/profil-ukkpk" element={<ProfilUkkpk />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pendaftaran" element={<Pendaftaran />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
