"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useActionState } from "react";
import { loginAction, loginWithGoogle, type ActionResult } from "@/actions/auth.actions";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const initialState: ActionResult = { success: false, message: "" };

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [state, action, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen bg-[#0f172a] overflow-hidden" dir={locale === "ar" ? "rtl" : "ltr"}>
      
      {/* الجزء الأيسر: الصورة والجانب المعماري (يختفي في الشاشات الصغيرة) */}
      <motion.div 
        initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative hidden w-1/2 lg:block"
      >
        <div className={cn("absolute inset-0 z-10 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/40", locale === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r')} />
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Architectural Luxury"
          className="object-cover w-full h-full grayscale-[0.3] brightness-[0.7]"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-16 lg:p-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={cn("mb-6 text-4xl font-light tracking-tight text-white md:text-5xl", locale === 'en' && "uppercase")}>
              {t("hero_title_prefix")} <span className="font-bold text-blue-600">{t("hero_title_highlight")}</span>
              <span className={cn("block mt-2 text-xl text-slate-400 font-extralight", locale === 'en' ? "tracking-[0.4em]" : "tracking-wider")}>{t("hero_title_suffix")}</span>
            </h2>
            <div className="w-16 h-1 mb-8 bg-blue-600 rounded-full" />
            <p className="max-w-lg text-xl italic font-light leading-relaxed text-slate-200/90">
              {t.rich("hero_description", {
                br: () => <br />,
                span: (chunks) => <span className="font-medium text-white underline underline-offset-8 decoration-blue-500/50">{chunks}</span>
              })}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* الجزء الأيمن: الفورم */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 lg:px-24 bg-[#0f172a] relative py-40 overflow-y-auto">
        
        {/* زر العودة للخلف بتصميم زجاجي */}
        <Link 
          href="/" 
          className="absolute flex items-center gap-2 text-sm transition-colors top-35 md:top-28 text-slate-400 hover:text-white group"
        >
          <ArrowLeft size={18} className={cn("transition-transform", locale === "ar" ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
          {t("backToHome")}
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-start">
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t("title")}
            </h1>
            <p className="text-sm font-light leading-relaxed text-slate-400/80">
               {t("subtitle")}
            </p>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {state.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-4 mb-6 text-sm backdrop-blur-md border",
                  state.success 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                )}
              >
                {state.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{state.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form action={action} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input type="hidden" name="locale" value={locale} />
            
            <div className="space-y-2">
              <label className="block px-1 text-xs font-bold tracking-widest uppercase text-slate-500">{t("email")}</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-5 py-3.5 bg-white/5 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold tracking-widest uppercase text-slate-500">{t("password")}</label>
                <Link href="/auth/forgot-password" className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300">
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-white/5 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-auto flex items-center right-4 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center items-center rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : t("loginButton")}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-4 bg-[#0f172a] text-slate-500 tracking-widest">{t("orWith")}</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => loginWithGoogle(callbackUrl || "/")}
            className="flex items-center justify-center w-full gap-3 px-4 py-3.5 text-sm font-medium transition-all border border-slate-700 rounded-xl hover:bg-white/5 text-slate-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.31l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t("googleLogin")}
          </button>

          <p className="mt-8 font-light text-center text-slate-400">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-blue-400 underline transition-colors hover:text-blue-300 underline-offset-4"
            >
              {t("createAccount")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}