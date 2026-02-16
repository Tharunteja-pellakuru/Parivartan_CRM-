import React, { useState, useMemo } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Leaf,
} from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@parivartan.crm");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const isEmailValid = useMemo(() => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }, [email]);

  const isPasswordValid = useMemo(() => {
    return password.length >= 6;
  }, [password]);

  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    // Simulate Auth API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "admin@parivartan.crm" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid Email or Password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-slate-900/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-slate-400/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md md:max-w-[420px] lg:max-w-md mx-auto animate-fade-in relative z-10 flex flex-col items-center justify-center h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
          {!imgError ? (
            <img
              src="./Logo.png"
              alt="Logo"
              className="w-10 h-10 md:w-12 lg:w-16 object-contain drop-shadow-xl"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
              {/* Fixed: Removed md:size and lg:size as they are not valid Lucide props. Used responsive classes instead. */}
              <Leaf
                size={24}
                className="md:w-8 md:h-8 lg:w-10 lg:h-10"
                fill="currentColor"
              />
            </div>
          )}
          <div className="flex flex-col border-l-2 border-primary/10 pl-4">
            <h1 className="text-lg md:text-xl lg:text-2xl font-black text-primary tracking-tighter leading-none">
              Parivartan
            </h1>
            <p className="text-[8px] md:text-[9px] lg:text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
              CRM Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-2xl shadow-xl border border-slate-200 w-full">
          <div className="mb-3 md:mb-4 lg:mb-6 text-center">
            <h2 className="text-base md:text-lg lg:text-xl font-black text-primary tracking-tighter">
              Welcome Back
            </h2>
            <p className="text-[9px] md:text-[10px] lg:text-xs text-textMuted font-bold uppercase tracking-widest mt-1">
              Please sign in to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-3 lg:space-y-4"
          >
            <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                Email ID
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-2.5 md:py-3 lg:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-900 transition-all font-bold placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@parivartan.crm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-2.5 md:py-3 lg:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-900 transition-all font-bold placeholder:text-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 md:p-4 bg-error/5 border border-error/10 rounded-xl flex items-center gap-3 text-error animate-fade-in">
                <AlertCircle size={16} className="shrink-0" />
                <p className="text-[9px] font-black tracking-tight leading-tight uppercase">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-2.5 md:py-3 lg:py-3.5 rounded-xl md:rounded-xl lg:rounded-xl font-black text-[9px] lg:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.97] ${
                isFormValid && !isLoading
                  ? "bg-slate-900 text-white hover:bg-black"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={16} strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 md:mb-2 text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
          © Copyright 2026 Parivartan. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
