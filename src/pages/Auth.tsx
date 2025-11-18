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
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 relative overflow-hidden items-center justify-center">
        {/* Animated Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-32 left-32 w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Clouds */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-20 bg-white/20 rounded-full blur-xl animate-float delay-200"></div>

        {/* Person Working at Desk Illustration */}
        <div className="relative z-10 animate-float-slow">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="drop-shadow-2xl">
            {/* Desk */}
            <rect x="80" y="240" width="240" height="12" rx="6" fill="white" opacity="0.9"/>
            <rect x="90" y="252" width="8" height="80" rx="4" fill="white" opacity="0.8"/>
            <rect x="302" y="252" width="8" height="80" rx="4" fill="white" opacity="0.8"/>
            
            {/* Laptop */}
            <rect x="150" y="200" width="100" height="70" rx="4" fill="#334155" opacity="0.9"/>
            <rect x="155" y="205" width="90" height="50" fill="#60a5fa" opacity="0.8"/>
            <rect x="145" y="270" width="110" height="4" rx="2" fill="#334155" opacity="0.9"/>
            
            {/* Person - Body */}
            <ellipse cx="200" cy="140" rx="30" ry="35" fill="#dc2626" opacity="0.9"/>
            
            {/* Person - Head */}
            <circle cx="200" cy="100" r="25" fill="#fbbf24" opacity="0.9"/>
            <path d="M185 95 Q200 85 215 95" stroke="#334155" strokeWidth="2" fill="none"/>
            <circle cx="192" cy="100" r="3" fill="#334155"/>
            <circle cx="208" cy="100" r="3" fill="#334155"/>
            <path d="M195 110 Q200 113 205 110" stroke="#334155" strokeWidth="2" fill="none"/>
            
            {/* Person - Arms */}
            <path d="M175 150 L160 180 L165 185" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.9"/>
            <path d="M225 150 L240 180 L235 185" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.9"/>
            
            {/* Hands on keyboard */}
            <ellipse cx="165" cy="220" rx="12" ry="8" fill="#fbbf24" opacity="0.9"/>
            <ellipse cx="235" cy="220" rx="12" ry="8" fill="#fbbf24" opacity="0.9"/>
            
            {/* Plant Pot */}
            <path d="M290 220 L310 220 L315 250 L285 250 Z" fill="#dc2626" opacity="0.8"/>
            
            {/* Plant Leaves */}
            <ellipse cx="295" cy="200" rx="8" ry="15" fill="#10b981" opacity="0.9" transform="rotate(-20 295 200)"/>
            <ellipse cx="305" cy="200" rx="8" ry="15" fill="#10b981" opacity="0.9" transform="rotate(20 305 200)"/>
            <ellipse cx="300" cy="190" rx="8" ry="15" fill="#059669" opacity="0.9"/>
            
            {/* Coffee Cup */}
            <rect x="110" y="220" width="20" height="25" rx="2" fill="white" opacity="0.9"/>
            <ellipse cx="120" cy="220" rx="10" ry="3" fill="white" opacity="0.9"/>
            <path d="M130 225 Q138 225 138 232 Q138 239 130 239" stroke="white" strokeWidth="2" fill="none" opacity="0.8"/>
            
            {/* Decorative Elements - Floating Icons */}
            <circle cx="80" cy="120" r="6" fill="white" opacity="0.6" className="animate-pulse"/>
            <circle cx="320" cy="160" r="8" fill="white" opacity="0.5" className="animate-pulse delay-100"/>
          </svg>
        </div>

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
