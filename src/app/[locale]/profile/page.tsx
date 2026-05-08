"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useAppStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Camera,
  Edit3,
  ArrowLeft, 
  ArrowRight,
  Briefcase,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, Link } from "@/i18n/navigation";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session, status } = useSession({ required: false });
  const locale = useLocale();
  const isAr = locale === "ar";
  const { darkMode } = useAppStore();
  const router = useRouter();

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // أو أي spinner تفضلينه
  }

  if (!session) return null; // أو عرض صفحة Loading

  const user = session.user;

  return (
    <div className={cn(
      "min-h-screen pb-20 transition-colors duration-500 font-medium",
      darkMode ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-slate-900",
      isAr ? "font-cairo" : "font-inter"
    )}>
      {/* Dark Header / Banner Area */}
      <div className="relative h-64 md:h-80 bg-[#0b0f1a] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        
        <div className="relative z-10 max-w-6xl px-4 mx-auto pt-36 md:px-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className={cn(
                "text-3xl md:text-5xl font-black mb-2",
                isAr ? "font-cairo tracking-tight" : "font-inter tracking-tighter"
              )}>
                {isAr ? "الملف الشخصي" : "Profile Settings"}
              </h1>
              <p className="max-w-md text-sm text-white/60 md:text-base">
                {isAr 
                  ? "إدارة معلوماتك الشخصية وإعدادات الحساب الخاصة بك" 
                  : "Manage your personal information and account settings"}
              </p>
            </div>
            <Link href="/">
              <Button 
                variant="ghost" 
                className="flex gap-2 text-white rounded-full bg-white/10 hover:bg-white/20 border-white/10 backdrop-blur-md"
              >
                {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                {isAr ? "الرئيسية" : "Home"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl px-4 mx-auto -mt-16 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Sidebar / Avatar */}
          <div className={cn(
            "p-8 rounded-[2.5rem] flex flex-col items-center border shadow-xl backdrop-blur-sm",
            darkMode ? "bg-slate-900/80 border-white/5" : "bg-white/90 border-blue-100 shadow-blue-900/5"
          )}>
            <div className="relative cursor-pointer group">
              <div className="w-40 h-40 overflow-hidden border-[6px] rounded-full shadow-2xl border-white dark:border-slate-800">
                <Image 
                  src={user.image || "/images/logo.png"} 
                  alt={user.name || "Avatar"} 
                  fill 
                  className="object-cover"
                />
              </div>
              <Button size="icon" className="absolute w-10 h-10 border-4 border-white rounded-full bottom-1 right-1 bg-amber-500 hover:bg-amber-600 dark:border-slate-800">
                <Camera className="w-4 h-4 text-white" />
              </Button>
            </div>
            <h2 className="mt-6 text-2xl font-black text-center">{user.name}</h2>
            <span className="px-4 py-1 mt-1 text-xs font-bold tracking-widest uppercase rounded-full bg-amber-500/10 text-amber-500">
              {user.role || "Member"}
            </span>
            
            <div className="w-full mt-10 space-y-4">
              <Button 
                className="w-full gap-3 text-sm font-bold text-white bg-blue-900 shadow-lg py-7 hover:bg-blue-800 rounded-2xl shadow-blue-900/20"
                onClick={() => router.push(`/dashboard/${user.role}`)}
              >
                <LayoutDashboard size={18} />
                {isAr ? "لوحة التحكم" : "Dashboard"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full gap-3 text-sm font-bold border-dashed py-7 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => router.push("/servics")}
              >
                <Briefcase size={18} className="text-amber-500" />
                {isAr ? "تصفح المشاريع" : "Browse Projects"}
              </Button>

              <Button variant="ghost" className="w-full gap-3 py-6 text-xs rounded-2xl opacity-60 hover:opacity-100">
                <Edit3 size={18} />
                {isAr ? "تحديث البيانات" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Main Info */}
          <div className="space-y-6 md:col-span-2">
            <div className={cn(
              "p-8 md:p-12 rounded-[2.5rem] border shadow-sm transition-all",
              darkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-blue-50 shadow-blue-900/5"
            )}>
              <h3 className="flex items-center gap-3 mb-10 text-2xl font-black">
                <div className="w-2.5 h-10 rounded-full bg-blue-900 dark:bg-amber-500" />
                {isAr ? "المعلومات الأساسية" : "General Information"}
              </h3>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                <InfoRow icon={<User className="text-blue-600" />} label={isAr ? "الاسم الكامل" : "Full Name"} value={user.name} darkMode={darkMode} />
                <InfoRow icon={<Mail className="text-blue-500" />} label={isAr ? "البريد الإلكتروني" : "Email Address"} value={user.email} darkMode={darkMode} />
                <InfoRow icon={<ShieldCheck className="text-blue-500" />} label={isAr ? "نوع الحساب" : "Account Type"} value={user.role} darkMode={darkMode} />
                <InfoRow icon={<Calendar className="text-blue-500" />} label={isAr ? "تاريخ الانضمام" : "Join Date"} value="2024" darkMode={darkMode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
};

const InfoRow = ({ icon, label, value, darkMode }: any) => (
  <div className="flex items-start gap-5 p-4 transition-colors rounded-3xl hover:bg-slate-500/5 group">
    <div className={cn("p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110", darkMode ? "bg-slate-800" : "bg-blue-50/50")}>{icon}</div>
    <div>
      <p className="text-[11px] font-black tracking-widest uppercase opacity-40 mb-1.5">{label}</p>
      <p className="text-lg font-bold tracking-tight text-blue-950 dark:text-white/90">{value || "---"}</p>
    </div>
  </div>
);

export default ProfilePage;