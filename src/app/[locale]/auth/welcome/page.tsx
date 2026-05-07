"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PartyPopper, ArrowLeft, ArrowRight, Search, Building2 } from "lucide-react";

// تم تغييرها إلى export default لتجنب خطأ الـ Build
export default function WelcomePage() {
  const { darkMode } = useAppStore();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user } = useAuth();
  
  // في الـ RTL، السهم الذي يشير لليسار (ArrowLeft) هو الذي يعبر عن "للأمام/التالي"
  const NextArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div
      className={cn("min-h-screen flex items-center justify-center p-5",
        darkMode ? "bg-slate-950" : "bg-slate-50")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "w-full max-w-md rounded-2xl border p-8 shadow-xl text-center",
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        )}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center mb-5"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-500">
            <PartyPopper size={28} />
          </div>
        </motion.div>

        <h1 className={cn("text-2xl font-black mb-2", darkMode ? "text-white" : "text-slate-900")}>
          {isRTL ? "أهلاً وسهلاً" : "Welcome"}
          {user?.name ? `، ${user.name.split(" ")[0]}` : ""}! 🎉
        </h1>
        
        <p className={cn("text-sm mb-8 leading-relaxed", darkMode ? "text-slate-400" : "text-slate-500")}>
          {isRTL 
            ? "انضممت بنجاح إلى رواد للعقارات. ابدأ رحلتك الآن للعثور على عقارك المثالي."
            : "You have successfully joined Pioneers Real Estate. Start your journey now."}
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/properties">
            <Button className="w-full gap-2 font-bold text-white transition-opacity h-11 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 hover:opacity-90">
              <Search size={15} />
              {isRTL ? "ابحث عن عقار" : "Search Properties"}
              <NextArrow size={15} />
            </Button>
          </Link>
          
          <Link href="/profile">
            <Button variant="outline" className={cn(
              "w-full h-11 rounded-xl font-bold gap-2",
              darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
            )}>
              <Building2 size={15} />
              {isRTL ? "أكمل بياناتك الشخصية" : "Complete your profile"}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}