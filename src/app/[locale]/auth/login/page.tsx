"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createBrowserClient } from "@supabase/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ar";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. تسجيل الدخول في نظام Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. جلب الـ Role من جدول profiles لتحديد التوجيه
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      // 3. التوجيه الذكي بناءً على الرتبة
      setMessage({ 
        type: "success", 
        text: isRtl ? "تم تسجيل الدخول بنجاح! جاري التحويل..." : "Login successful! Redirecting..." 
      });

      setTimeout(() => {
        if (profile.role === "admin") {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}/profile`);
        }
      }, 1500);

    } catch (error: any) {
      // تعريب رسائل الخطأ الشائعة
      let errorText = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorText = isRtl ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password";
      }
      setMessage({ type: "error", text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            {isRtl ? "مرحباً بعودتك" : "Welcome Back"}
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide opacity-80 uppercase">
            Business Pioneers Holding
          </p>
        </div>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 p-4 rounded-2xl mb-6 text-sm border ${
                message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 px-1 tracking-[0.2em]">
              {isRtl ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <div className="relative group">
              <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors`} size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full bg-slate-950/50 border border-slate-800 py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-700`}
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">
                {isRtl ? "كلمة المرور" : "Password"}
              </label>
              <Link href="#" className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">
                {isRtl ? "نسيت الكلمة؟" : "Forgot?"}
              </Link>
            </div>
            <div className="relative group">
              <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors`} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`w-full bg-slate-950/50 border border-slate-800 py-4 ${isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-700`}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-3 mt-6"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isRtl ? "دخول إلى الحساب" : "Sign In to Account"}
                {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            {isRtl ? "ليس لديك حساب؟" : "Don't have an account?"} {" "}
            <Link href="/auth/register" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors underline-offset-4 hover:underline">
              {isRtl ? "أنشئ حسابك الآن" : "Create Account"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// أيقونة بسيطة للنجاح لم تكن مستوردة
function CheckCircle2({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}