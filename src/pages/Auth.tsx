import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logoUkkpk from "@/assets/logo-ukkpk.png";
import logoMicuMascot from "@/assets/logo-micu-mascot.png";
import { Loader2, Mail, Lock, Eye, EyeOff, Check, ArrowRight, ArrowLeft } from "lucide-react";
const REMEMBER_ME_KEY = 'ukkpk_remember_me';
const SAVED_EMAIL_KEY = 'ukkpk_saved_email';
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    signIn
  } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY);
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    if (savedRememberMe === 'true' && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await signIn(email, password);
      if (error) throw error;

      // Save or clear credentials based on rememberMe
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        localStorage.setItem(SAVED_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }
      toast.success("Login berhasil!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Brand/Info (Desktop only) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary to-primary/80 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-xl font-bold">UKKPK UNP</h1>
              
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <img src={logoMicuMascot} alt="MICU Mascot" className="h-64 w-auto mb-6 ml-16 animate-float" style={{
              filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 90px rgba(255, 255, 255, 0.3))'
            }} />
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Kelola Media Kampus<br />Lebih Mudah & Efisien
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Platform digital terintegrasi untuk mengelola konten artikel, berita, radio, dan kegiatan kampus dalam satu dashboard
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-white/20 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Manajemen konten lengkap</p>
                  <p className="text-sm text-white/80">Kelola artikel, berita, dan radio dalam satu platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-white/20 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Editor teks yang canggih</p>
                  <p className="text-sm text-white/80">Buat konten menarik dengan rich text editor profesional</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-white/20 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Analytics & laporan</p>
                  <p className="text-sm text-white/80">Pantau performa konten dengan dashboard analytics real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-white/70">© 2025 UKKPK UNP. All          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50">
        <div className="w-full max-w-md px-4 sm:px-0">
          {/* Logo & Brand - Mobile/Tablet Only */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="text-lg sm:text-xl font-bold text-primary">UKKPK UNP</h1>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Header */}
            <div className="text-center space-y-1.5 sm:space-y-2">
              <p className="text-primary font-medium flex items-center justify-center gap-2 text-[10px] sm:text-xs">
                 Selamat Datang Kembali
              </p>
              <h1 className="font-bold text-gray-900 text-xl sm:text-2xl">Login ke Akun Anda</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Masuk untuk mengakses dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="admin@ukkpk.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-10 sm:h-11 md:h-12 pl-9 sm:pl-10 text-sm" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-10 sm:h-11 md:h-12 pl-9 sm:pl-10 pr-9 sm:pr-10 text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} className="h-4 w-4" />
                  <Label htmlFor="remember" className="text-xs sm:text-sm cursor-pointer">
                    Ingat saya
                  </Label>
                </div>
                <button type="button" onClick={() => toast.info("Hubungi administrator untuk reset password")} className="text-primary hover:underline text-[10px] sm:text-xs">
                  Lupa password?
                </button>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-semibold" disabled={loading}>
                {loading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </> : <>
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center">
              <Link to="/" className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>;
};
export default Auth;