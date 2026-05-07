"use client";
import { Link } from "@/i18n/navigation";
import { MailCheck, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function VerifyRequestPage() {
  const t = useTranslations("verifyRequest");

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-3xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30">
          <MailCheck size={40} />
        </div>
        
        <h1 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          {t("description")}
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://mail.google.com"
            target="_blank"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-900 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("openGmail")} <ExternalLink size={16} />
          </a>
          
          <Link
            href="/auth/login"
            className="flex items-center justify-center h-12 gap-2 font-bold transition-colors border rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t("backToLogin")} <ArrowRight size={16} className="rotate-180" />
          </Link>
        </div>

        <div className="pt-6 mt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            {t("spamMessage")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
