"use client";
// ============================================================
// src/app/[locale]/auth/register/page.tsx — Register Page
// ============================================================

import { useActionState, useState, useEffect } from "react";
import { motion, AnimatePresence }  from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { cn }                       from "@/lib/utils";
import { useAppStore }              from "@/store/useStore";
import { registerAction, type ActionResult } from "@/actions/auth.actions";
import { Link, useRouter }          from "@/i18n/navigation";
import { Button }                   from "@/components/ui/button";
import { Input }                    from "@/components/ui/input";
import { Label }                    from "@/components/ui/label";
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowLeft, ArrowRight, AlertCircle,
  CheckCircle2, Loader2, Check, X,
} from "lucide-react";

const initialState: ActionResult = { success: false, message: "" };

// ── Password strength checker ─────────────────────────────────
function getPasswordStrength(password: string) {
  const checks = [
    { label: "8 أحرف على الأقل",        pass: password.length >= 8       },
    { label: "حرف كبير (A-Z)",           pass: /[A-Z]/.test(password)     },
    { label: "رقم (0-9)",                pass: /[0-9]/.test(password)     },
    { label: "رمز خاص (!@#$)",           pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  return { checks, score };
}

const STRENGTH_LABELS = ["ضعيفة جداً", "ضعيفة", "متوسطة", "قوية"];
const STRENGTH_COLORS = ["bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500"];

export default function RegisterPage() {
  const t            = useTranslations("login"); // استخدام ترجمات اللوجن للاتساق أو إضافة مفاتيح جديدة
  const { darkMode } = useAppStore();
  const locale       = useLocale();
  const isRTL        = locale === "ar";
  const router       = useRouter();
  const BackArrow    = isRTL ? ArrowRight : ArrowLeft;

  const [showPassword, setShowPassword]  = useState(false);
  const [showConfirm,  setShowConfirm]   = useState(false);
  const [password,     setPassword]      = useState("");
  const [role,         setRole]          = useState<"user" | "agent">("user");

  const { checks, score } = getPasswordStrength(password);
  const [state, action, isPending] = useActionState(registerAction, initialState);

  // التوجيه التلقائي بعد النجاح
  useEffect(() => {
    if (state.success) {
      router.push("/auth/login");
    }
  }, [state.success, router]);

  return (
    <div className="flex min-h-screen bg-[#0f172a] overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* الجزء الأيسر: الجانب البصري المعماري (مطابق للوجن) */}
      <motion.div 
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative hidden w-1/2 lg:block"
      >
        <div className={cn("absolute inset-0 z-10 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/40", isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r')} />
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Modern Architecture"
          className="object-cover w-full h-full grayscale-[0.2] brightness-[0.6]"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-16 lg:p-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className={cn("mb-6 text-4xl font-light tracking-tight text-white md:text-5xl")}>
              {isRTL ? "انضم إلى" : "Join"} <span className="font-bold text-blue-600">{isRTL ? "رواد الأعمال القابضة" : "Business Pioneers Holding"}</span>
              <span className="block mt-2 text-xl text-slate-400 font-extralight uppercase tracking-[0.2em]">
                {isRTL ? "مستقبل العقار بين يديك" : "The Future of Real Estate"}
              </span>
            </h2>
            <div className="w-16 h-1 mb-8 bg-blue-600 rounded-full" />
          </motion.div>
        </div>
      </motion.div>

      {/* الجزء الأيمن: الفورم (قابل للتمرير) */}
      <div className="flex flex-col justify-start w-full lg:w-1/2 px-8 md:px-16 lg:px-24 bg-[#0f172a] relative py-20 overflow-y-auto custom-scrollbar">
        
        {/* زر العودة */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-10 text-sm transition-colors text-slate-400 hover:text-white group"
        >
          <BackArrow size={18} className={cn("transition-transform", isRTL ? "group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
          {t("backToHome")}
        </Link>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto">
          <div className="mb-10 text-start">
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {isRTL ? "إنشاء حساب جديد" : "Create Account"}
            </h1>
            <p className="text-sm font-light leading-relaxed text-slate-400/80">
              {isRTL ? "اختر نوع الحساب وابدأ رحلتك معنا" : "Choose account type and start your journey"}
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex gap-2 p-1 mb-8 border bg-white/5 border-slate-700 rounded-2xl">
            {([
              { id: "user",  label: isRTL ? "عميل" : "Client" },
              { id: "agent", label: isRTL ? "وكيل/مطور" : "Agent/Dev" },
            ] as const).map(tab => (
              <button
                key={tab.id} type="button" onClick={() => setRole(tab.id)}
                className={cn(
                  "flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                  role === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {state.message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-4 mb-6 text-sm backdrop-blur-md border",
                  state.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                )}
              >
                {state.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{state.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form action={action} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="locale" value={locale} />

            {/* Full name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label={isRTL ? "الاسم الكامل" : "Full Name"} error={state.errors?.full_name?.[0]}>
                <input name="full_name" placeholder={isRTL ? "محمد الأحمد" : "John Doe"} required className="auth-input" />
              </Field>
              <Field label={isRTL ? "رقم الجوال" : "Phone"} error={state.errors?.phone?.[0]}>
                <input name="phone" type="tel" placeholder="05xxxxxxxx" className="auth-input" dir="ltr" />
              </Field>
            </div>

            <Field label={isRTL ? "البريد الإلكتروني" : "Email"} error={state.errors?.email?.[0]}>
              <input name="email" type="email" placeholder="name@example.com" required className="auth-input" dir="ltr" />
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label={isRTL ? "كلمة المرور" : "Password"} error={state.errors?.password?.[0]}>
                <div className="relative">
                  <input
                    name="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    required placeholder="••••••••" className="auth-input"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label={isRTL ? "تأكيد المرور" : "Confirm"} error={state.errors?.confirm_password?.[0]}>
                <div className="relative">
                  <input
                    name="confirm_password" type={showConfirm ? "text" : "password"}
                    required placeholder="••••••••" className="auth-input"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-4 text-slate-500 hover:text-slate-300">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
            </div>

            {/* Password Strength */}
            <div className="px-1">
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i < score ? STRENGTH_COLORS[score - 1] : "bg-slate-700")} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 px-1">
              <input type="checkbox" name="agree_terms" id="agree_terms" required className="w-4 h-4 mt-1 rounded accent-blue-600" />
              <label htmlFor="agree_terms" className="text-xs leading-relaxed text-slate-400">
                {isRTL ? "أوافق على" : "I agree to"} <Link href="/terms" className="text-blue-400 underline underline-offset-4">{isRTL ? "الشروط والأحكام" : "Terms & Conditions"}</Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || score < 2}
              className="flex w-full justify-center items-center rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? <Loader2 size={20} className="animate-spin" /> : (isRTL ? "إنشاء الحساب" : "Create Account")}
            </button>
          </form>

          <p className="mt-8 font-light text-center text-slate-400">
            {isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link href="/auth/login" className="font-semibold text-blue-400 underline underline-offset-4">
              {isRTL ? "تسجيل الدخول" : "Login"}
            </Link>
          </p>
        </motion.div>
      </div>
      
      <style jsx global>{`
        .auth-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #334155;
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
          transition: all 0.2s;
          outline: none;
        }
        .auth-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block px-1 text-[10px] font-bold tracking-widest uppercase text-slate-500">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}