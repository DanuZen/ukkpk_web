import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import logoUkkpk from "@/assets/logo-ukkpk.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast.success("Login berhasil!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full border-2 border-primary/20"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-2 border-primary/20"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src={logoUkkpk} alt="UKKPK Logo" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Login</h1>
            <p className="text-muted-foreground">Masuk ke Dashboard Admin UKKPK</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="h-12 text-base"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember Me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast.info("Hubungi administrator untuk reset password")}
              >
                Forgot Your Password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" 
              disabled={loading}
            >
              {loading ? "Memproses..." : "Log In"}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Hanya untuk Admin UKKPK UNP</p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 relative overflow-hidden">
        {/* Animated Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-32 left-32 w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 400" className="w-full h-auto">
            <path d="M0,300 L200,100 L400,250 L600,150 L800,280 L1000,200 L1200,320 L1200,400 L0,400 Z" 
                  fill="rgba(0,0,0,0.1)" />
            <path d="M0,350 L150,200 L350,300 L550,220 L750,320 L950,260 L1200,350 L1200,400 L0,400 Z" 
                  fill="rgba(0,0,0,0.15)" />
          </svg>
        </div>

        {/* Clouds */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-20 bg-white/20 rounded-full blur-xl animate-float delay-200"></div>
        <div className="absolute top-60 left-1/3 w-36 h-18 bg-white/20 rounded-full blur-xl animate-float delay-100"></div>

        {/* Rocket */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float-slow">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="drop-shadow-2xl">
            <path d="M12 2L4 10L8 10L8 22L16 22L16 10L20 10L12 2Z" fill="white" opacity="0.9"/>
            <circle cx="12" cy="14" r="2" fill="#dc2626"/>
            <path d="M8 22L6 24L10 24L8 22Z" fill="#f87171"/>
            <path d="M16 22L14 24L18 24L16 22Z" fill="#f87171"/>
          </svg>
        </div>

        {/* Shooting Stars */}
        <div className="absolute top-1/4 right-1/4 w-16 h-0.5 bg-white/60 rounded-full animate-shooting-star"></div>
        <div className="absolute top-2/3 left-1/3 w-12 h-0.5 bg-white/60 rounded-full animate-shooting-star delay-300"></div>

        {/* Welcome Text */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center text-white z-10">
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">Selamat Datang Admin!</h2>
          <p className="text-lg opacity-90 drop-shadow">Unit Kegiatan Komunikasi & Penyiaran Kampus</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-30px); }
        }
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          100% { transform: translateX(-200px) translateY(200px); opacity: 0; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-shooting-star {
          animation: shooting-star 3s ease-in infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default Auth;
