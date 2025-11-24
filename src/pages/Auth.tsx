import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/AnimatedSection";
import logoUkkpk from "@/assets/logo-ukkpk.png";
import logoMicuMascot from "@/assets/logo-micu-mascot.png";

const REMEMBER_ME_KEY = 'ukkpk_remember_me';
const SAVED_EMAIL_KEY = 'ukkpk_saved_email';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
  return <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <AnimatedSection animation="fade-in" delay={100}>
            <div className="mb-8 flex justify-center">
              <img 
                src={logoUkkpk} 
                alt="UKKPK Logo" 
                className="h-16 w-auto animate-scale-in"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </AnimatedSection>

          {/* Title */}
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">Login</h1>
              <p className="text-muted-foreground">Masuk ke Dashboard Admin UKKPK UNP</p>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection animation="fade-up" delay={300}>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address" className="h-12 text-base" />
            </div>

            <div className="space-y-2">
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className="h-12 text-base" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} />
                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                  Remember Me
                </label>
              </div>
              <button type="button" className="text-sm text-primary hover:underline" onClick={() => toast.info("Hubungi administrator untuk reset password")}>
                Forgot Your Password?
              </button>
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" disabled={loading}>
              {loading ? "Memproses..." : "Log In"}
            </Button>
            </form>
          </AnimatedSection>

          {/* Footer Note */}
          <AnimatedSection animation="fade-in" delay={400}>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Hanya untuk Admin UKKPK UNP</p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-red-600 relative overflow-hidden items-center justify-center animate-fade-in">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          }}></div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* MICU Logo & Welcome Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
          <img 
            src={logoMicuMascot} 
            alt="MICU Mascot" 
            loading="eager"
            className="h-64 w-auto mx-auto mb-6 drop-shadow-2xl"
            style={{
              animation: 'float 3s ease-in-out infinite 0.5s backwards',
              filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 80px rgba(255, 255, 255, 0.4))',
              willChange: 'transform'
            }}
          />
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">Selamat Datang Intelektual Muda!</h2>
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>;
};
export default Auth;