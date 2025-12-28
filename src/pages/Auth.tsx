import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import logoUkkpk from "@/assets/logo-ukkpk.png";
import logoMicuMascot from "@/assets/logo-micu-mascot.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error("Email atau password salah");
      } else {
        toast.success("Login berhasil!");
        handleNavigation("/admin");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Red Background with Micu Mascot */}
      <div className={`hidden lg:flex lg:w-3/5 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden transition-transform duration-500 ease-in-out ${isExiting ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          {/* Logo and Title */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <img
                src={logoUkkpk}
                alt="UKKPK UNP Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold">UKKPK UNP</h1>
            </div>

            <h2 className="text-8xl font-bold mb-5 leading-tight mt-48">
              Website Resmi<br />UKKPK UNP
            </h2>

            <p className="text-base mb-10 max-w-lg leading-relaxed opacity-95 text-justify">
              
            </p>

            {/* Features List */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl">Menyediakan Informasi Seputar UNP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl">Artikel dan Berita Terbaru</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl">Laman Radio Kampus</span>
              </div>
            </div>
          </div>

          {/* Micu Mascot - Behind with opacity and rotation */}
          <div className="absolute -bottom-24 left-[80%] -translate-x-1/2 w-[700px] h-[700px] -rotate-12 opacity-100 z-0">
            <img
              src={logoMicuMascot}
              alt="Micu Mascot"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Copyright */}
          <div className="relative z-10">
            <p className="text-sm opacity-80">© 2025 UKKPK UNP</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={`w-full lg:w-2/5 flex items-center justify-center p-8 bg-white transition-opacity duration-500 ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img
              src={logoUkkpk}
              alt="UKKPK UNP Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-lg font-bold text-red-600">UKKPK UNP</h1>
          </div>

          {/* Login Form Container */}
          <div className="w-full">
            <div className="mb-8 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Login ke Akun Anda</h2>
              <p className="text-sm lg:text-base text-gray-500">Selamat Datang Intelektual Muda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Masukkan email anda"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Lupa password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? "Memproses..." : "Login"}
              </button>
            </form>

            <div className="mt-8 text-center">
               <button
                onClick={() => handleNavigation("/")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft size={16} />
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;