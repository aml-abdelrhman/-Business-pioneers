"use client";
import { Link } from "@/i18n/navigation";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-3xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
          <BadgeCheck size={40} />
        </div>
        
        <h1 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          {t("description")}
        </p>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("loginNow")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
