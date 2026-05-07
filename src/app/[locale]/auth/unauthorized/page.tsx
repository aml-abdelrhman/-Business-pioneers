"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, ArrowRight, Home } from "lucide-react";

// تم إضافة كلمة default هنا - هذا هو حل المشكلة الأساسي
export default function UnauthorizedPage() {
  const { darkMode } = useAppStore();
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  // في الـ RTL السهم الذي يشير لليسار (ArrowLeft) هو العودة منطقياً
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-5",
        darkMode ? "bg-slate-950" : "bg-slate-50"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-full max-w-md rounded-2xl border p-8 shadow-xl text-center",
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        )}
      >
        {/* Big 403 */}
        <div className={cn("text-7xl font-black mb-3 leading-none",
          darkMode ? "text-slate-800" : "text-slate-100")}>
          403
        </div>

        <div className="flex justify-center mb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500">
            <ShieldX size={26} />
          </div>
        </div>

        <h1 className={cn("text-xl font-black mb-2", darkMode ? "text-white" : "text-slate-900")}>
          {isRTL ? "غير مصرح بالدخول" : "Unauthorized Access"}
        </h1>
        <p className={cn("text-sm mb-7 leading-relaxed", darkMode ? "text-slate-400" : "text-slate-500")}>
          {isRTL 
            ? "ليس لديك صلاحية للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، تواصل مع مدير النظام."
            : "You don't have permission to access this page. If you believe this is an error, please contact the admin."}
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full gap-2 font-bold text-white transition-opacity h-11 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 hover:opacity-90">
              <Home size={15} />
              {isRTL ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className={cn(
              "w-full h-11 rounded-xl font-bold gap-2",
              darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
            )}>
              <BackIcon size={15} />
              {isRTL ? "تسجيل الدخول بحساب آخر" : "Login with another account"}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}