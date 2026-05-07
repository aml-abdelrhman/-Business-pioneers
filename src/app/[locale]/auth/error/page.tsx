"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl"; // أضفنا useTranslations لدعم تعدد اللغات بشكل ديناميكي
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Suspense } from "react"; // ضروري جداً عند استخدام useSearchParams في Next.js 13+

// نقلنا الرسائل لتكون مرنة، ويفضل لاحقاً وضعها في ملف JSON الخاص بالترجمة
const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  AccountDisabled: { title: "الحساب موقوف", desc: "تواصل مع فريق الدعم لإعادة تفعيل حسابك." },
  OAuthAccountNotLinked: { title: "الحساب غير مرتبط", desc: "يُرجى تسجيل الدخول بالطريقة التي استخدمتها عند التسجيل." },
  OAuthSignin: { title: "خطأ في Google", desc: "حدث خطأ أثناء تسجيل الدخول بحساب Google. حاول مرة أخرى." },
  CredentialsSignin: { title: "بيانات غير صحيحة", desc: "البريد الإلكتروني أو كلمة المرور غير صحيحة." },
  EmailSignin: { title: "خطأ في البريد", desc: "تعذّر إرسال رابط تسجيل الدخول. حاول مرة أخرى." },
  SessionRequired: { title: "يجب تسجيل الدخول", desc: "هذه الصفحة تتطلب تسجيل الدخول أولاً." },
  Default: { title: "حدث خطأ", desc: "حدث خطأ غير متوقع أثناء المصادقة. يُرجى المحاولة مرة أخرى." },
};

function ErrorContent() {
  const { darkMode } = useAppStore();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const params = useSearchParams();
  
  const errorKey = params.get("error") ?? "Default";
  const error = ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.Default;
  const BackArrow = isRTL ? ArrowLeft : ArrowRight; // في الـ RTL السهم لليسار يعني "عودة"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full max-w-md rounded-2xl border p-8 shadow-xl text-center",
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      )}
    >
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-500">
          <AlertTriangle size={28} />
        </div>
      </div>

      <h1 className={cn("text-xl font-black mb-2", darkMode ? "text-white" : "text-slate-900")}>
        {error.title}
      </h1>
      <p className={cn("text-sm mb-7 leading-relaxed", darkMode ? "text-slate-400" : "text-slate-500")}>
        {error.desc}
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/auth/login">
          <Button className="w-full gap-2 font-bold text-white h-11 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700">
            <RefreshCw size={15} />
            {isRTL ? "حاول مرة أخرى" : "Try Again"}
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className={cn(
            "w-full h-11 rounded-xl font-bold gap-2",
            darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
          )}>
            <BackArrow size={15} />
            {isRTL ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// الصفحة الأساسية يجب أن تغلف بـ Suspense عند استخدام useSearchParams لتجنب أخطاء الـ Build
export default function AuthErrorPage() {
  const { darkMode } = useAppStore();
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className={cn("min-h-screen flex items-center justify-center p-5",
        darkMode ? "bg-slate-950" : "bg-slate-50")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Suspense fallback={<div className="text-blue-600 animate-pulse">Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}