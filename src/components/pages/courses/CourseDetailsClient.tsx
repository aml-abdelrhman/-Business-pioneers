"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { MapPin, Ruler, Building2, ChevronLeft, ChevronRight, Compass, ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// استيراد البيانات الحقيقية للمشاريع
import { lastProjectsEn } from '@/components/pages/courses/lastProjectsEn';
import { lastProjectsAr } from '@/components/pages/courses/lastProjectsAr';

const ProjectDetails = ({ params }: { params: { id: string } }) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { darkMode } = useAppStore();

  // جلب بيانات المشروع بناءً على المعرف واللغة
  const projectsArray = Object.values(isRtl ? lastProjectsAr : lastProjectsEn);
  
  // البحث عن المشروع بمطابقة الـ ID الرقمي بدلاً من مفتاح الكائن
  const projectId = params?.id;
  const project = projectsArray.find((p: any) => p.id.toString() === projectId);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project Not Found</div>;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 selection:bg-amber-500 selection:text-white",
      darkMode ? "bg-[#0b0f1a] text-white" : "bg-slate-50 text-slate-900"
    )} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* نقش السدو المعماري كخلفية خفيفة */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05] z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='${darkMode ? '%23f59e0b' : '%231e3a8a'}' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} 
      />

      {/* 1. Hero Section - صورة المشروع كاملة الخلفية */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-end pb-20 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
          darkMode ? "from-[#0b0f1a]" : "from-white/90"
        )} />
        
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/20"
            >
              <Compass size={14} className="animate-spin-slow" />
              {isRtl ? "تفاصيل المشروع المعماري" : "Architectural Project Details"}
            </motion.div>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "text-5xl md:text-8xl font-black tracking-tighter leading-tight drop-shadow-sm",
                darkMode ? "text-white" : "text-blue-950",
                isRtl ? "font-cairo" : "font-inter"
              )}
            >
              {project.title}
            </motion.h1>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "mt-12 flex gap-8 md:gap-16 border-t pt-10 flex-wrap",
              darkMode ? "border-white/10" : "border-slate-200"
            )}
          >
            <StatItem icon={Ruler} label={isRtl ? "المساحة" : "Total Area"} value={`${project.area || '—'} م²`} darkMode={darkMode} />
            {/* <StatItem icon={MapPin} label={isRtl ? "الموقع" : "Location"} value={project.description?.[0]?.[1] || project.location} darkMode={darkMode} /> */}
            <StatItem icon={LayoutGrid} label={isRtl ? "الوحدات" : "Units"} value={project.units || '—'} darkMode={darkMode} />
          </motion.div>
        </div>
      </section>

      {/* 2. Content Section - تفاصيل المشروع */}
      <section className="relative z-10 py-32 container max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-8 space-y-8">
            <h2 className={cn(
              "text-xs font-black uppercase tracking-[0.4em] text-amber-500 flex items-center gap-3",
              isRtl ? "font-cairo" : "font-inter"
            )}>
              <span className="w-8 h-[1px] bg-amber-500" />
              {isRtl ? "نظرة عامة على الإبداع" : "Creative Overview"}
            </h2>
            <p className={cn(
              "text-xl md:text-3xl font-medium leading-[1.6] text-slate-500 dark:text-slate-400",
              isRtl ? "font-cairo" : "font-inter"
            )}>
              {project.details?.[0] || project.description}
            </p>
            
            <div className="pt-10 grid md:grid-cols-2 gap-8">
               {/* بطاقات إضافية للميزات إذا وجدت */}
               <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-900/5">
                  <Building2 className="text-amber-500 mb-4" size={32} />
                  <h4 className="font-black text-lg mb-2">{isRtl ? "هوية معمارية" : "Architectural Identity"}</h4>
                  <p className="text-sm opacity-60 leading-relaxed">{isRtl ? "تصميم يحاكي المستقبل بلمسات كلاسيكية تضمن الفخامة." : "A design that mimics the future with classic touches."}</p>
               </div>
               <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-900/5">
                  <Compass className="text-amber-500 mb-4" size={32} />
                  <h4 className="font-black text-lg mb-2">{isRtl ? "استدامة ذكية" : "Smart Sustainability"}</h4>
                  <p className="text-sm opacity-60 leading-relaxed">{isRtl ? "استخدام تقنيات بناء صديقة للبيئة لضمان جودة الحياة." : "Using eco-friendly building technologies to ensure quality of life."}</p>
               </div>
            </div>
          </div>
          
          {/* Map Placeholder - الخريطة */}
          <div className="lg:col-span-4 sticky top-32">
            <div className={cn(
              "relative group overflow-hidden rounded-[2.5rem] aspect-square border shadow-2xl transition-all duration-700 hover:scale-[1.02]",
              darkMode ? "bg-slate-900 border-white/5 shadow-blue-900/10" : "bg-white border-slate-200 shadow-slate-200/50"
            )}>
              <div className="absolute inset-0 bg-slate-500/10 flex flex-col items-center justify-center p-10 text-center space-y-4">
                <MapPin size={40} className="text-amber-500 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-widest opacity-40">Google Maps Integration</span>
                <Button variant="outline" className="rounded-full border-amber-500/20 text-amber-500">{isRtl ? "فتح في الخرائط" : "Open in Maps"}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Image Gallery - معرض الصور */}
      <section className={cn(
        "py-32 border-t",
        darkMode ? "bg-[#0f172a]/50 border-white/5" : "bg-slate-100/50 border-slate-200"
      )}>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className={cn("text-4xl md:text-6xl font-black tracking-tighter", isRtl ? "font-cairo" : "font-inter")}>
                {isRtl ? "معرض الصور" : "Project Gallery"}
              </h2>
              <div className="h-1.5 w-20 bg-amber-500 rounded-full" />
            </div>
            <div className="flex gap-4">
              <NavButton icon={isRtl ? ChevronRight : ChevronLeft} darkMode={darkMode} />
              <NavButton icon={isRtl ? ChevronLeft : ChevronRight} darkMode={darkMode} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div 
                whileHover={{ y: -15 }}
                key={i} 
                className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl"
              >
                <img src={project.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="gallery" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, darkMode }: any) => (
  <div className="flex items-center gap-6 group">
    <div className={cn(
      "p-4 rounded-2xl transition-all duration-500 group-hover:bg-amber-500 group-hover:text-slate-950",
      darkMode ? "bg-white/5 text-amber-500" : "bg-blue-900/5 text-blue-900"
    )}>
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
      <p className="text-lg font-black tracking-tight">{value}</p>
    </div>
  </div>
);

const NavButton = ({ icon: Icon, darkMode }: any) => (
  <button className={cn(
    "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95",
    darkMode 
      ? "border-white/10 text-white hover:bg-amber-500 hover:border-amber-500 hover:text-slate-950" 
      : "border-slate-200 text-blue-950 hover:bg-blue-950 hover:border-blue-950 hover:text-white"
  )}>
    <Icon size={24} />
  </button>
);

export default ProjectDetails;