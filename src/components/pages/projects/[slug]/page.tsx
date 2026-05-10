"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // استخدام useParams أضمن في Client Components
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { MapPin, Ruler, Building2, Compass, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const ProjectDetailsPage = () => {
  const params = useParams();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { darkMode } = useAppStore();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const slug = params?.slug as string;

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        console.log("No slug found in params");
        return;
      }

      // فك التشفير للتعامل مع أي حروف خاصة في الرابط
      const currentSlug = decodeURIComponent(slug);
      console.log("Fetching project with slug:", currentSlug);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .ilike('slug', currentSlug) // استخدام ilike بدلاً من eq يجعل البحث غير حساس لحالة الأحرف
        .maybeSingle(); // maybeSingle تمنع حدوث خطأ إذا لم يوجد سجل وتكتفي بإرجاع null

      if (!error && data) {
        setProject(data);
      } else {
        console.error("Supabase error or empty data:", error);
      }
      setLoading(false);
    }
    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
       <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="opacity-50">Slug: {slug}</p>
      </div>
    );
  }

  const title = isRtl ? project.title_ar : project.title_en;
  const details = isRtl ? project.details_ar?.[0] : project.details_en?.[0];
  const locationName = isRtl ? project.description_ar?.[0]?.[1] : project.description_en?.[0]?.[1];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 selection:bg-amber-500 selection:text-white pb-20",
      darkMode ? "bg-[#0b0f1a] text-white" : "bg-slate-50 text-slate-900"
    )} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05] z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='${darkMode ? '%23f59e0b' : '%231e3a8a'}' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} 
      />

      {/* 1. Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-end pb-20 overflow-hidden">
        <Image
          src={project.image}
          alt={title}
          fill
          unoptimized 
          className="absolute inset-0 object-cover w-full h-full"
          priority
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
          darkMode ? "from-[#0b0f1a]" : "from-white/90"
        )} />
        
        <div className="container relative z-10 px-6 mx-auto max-w-7xl">
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
              {title}
            </motion.h1>
          </div>

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
            <StatItem icon={MapPin} label={isRtl ? "الموقع" : "Location"} value={locationName || (isRtl ? "المملكة العربية السعودية" : "Saudi Arabia")} darkMode={darkMode} />
            <StatItem icon={LayoutGrid} label={isRtl ? "الوحدات" : "Units"} value={project.units || '—'} darkMode={darkMode} />
          </motion.div>
        </div>
      </section>

      {/* 2. Content Section */}
      <section className="container relative z-10 px-6 py-32 mx-auto max-w-7xl">
        <div className="grid items-start gap-20 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
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
              {details}
            </p>
            
            <div className="grid gap-8 pt-10 md:grid-cols-2">
               <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-900/5">
                  <Building2 className="mb-4 text-amber-500" size={32} />
                  <h4 className="mb-2 text-lg font-black">{isRtl ? "هوية معمارية" : "Architectural Identity"}</h4>
                  <p className="text-sm leading-relaxed opacity-60">{isRtl ? "تصميم يحاكي المستقبل بلمسات كلاسيكية تضمن الفخامة." : "A design that mimics the future."}</p>
               </div>
               <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-900/5">
                  <Compass className="mb-4 text-amber-500" size={32} />
                  <h4 className="mb-2 text-lg font-black">{isRtl ? "استدامة ذكية" : "Smart Sustainability"}</h4>
                  <p className="text-sm leading-relaxed opacity-60">{isRtl ? "استخدام تقنيات بناء صديقة للبيئة لضمان جودة الحياة." : "Using eco-friendly building technologies."}</p>
               </div>
            </div>
          </div>
          
          <div className="sticky lg:col-span-4 top-32">
            <div className={cn(
              "relative group overflow-hidden rounded-[2.5rem] aspect-square border shadow-2xl transition-all duration-700 hover:scale-[1.02]",
              darkMode ? "bg-slate-900 border-white/5 shadow-blue-900/10" : "bg-white border-slate-200 shadow-slate-200/50"
            )}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 space-y-4 text-center bg-slate-500/10">
                <MapPin size={40} className="text-amber-500 animate-bounce" />
                <span className="text-xs font-black tracking-widest uppercase opacity-40">Location Details</span>
                <Button variant="outline" className="rounded-full border-amber-500/20 text-amber-500">{isRtl ? "فتح في الخرائط" : "Open in Maps"}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Image Gallery */}
      <section className={cn(
        "py-32 border-t",
        darkMode ? "bg-[#0f172a]/50 border-white/5" : "bg-slate-100/50 border-slate-200"
      )}>
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 mb-16 md:flex-row md:items-end">
            <div className="space-y-4">
              <h2 className={cn("text-4xl md:text-6xl font-black tracking-tighter", isRtl ? "font-cairo" : "font-inter")}>
                {isRtl ? "معرض الصور" : "Project Gallery"}
              </h2>
              <div className="h-1.5 w-20 bg-amber-500 rounded-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[project.image, project.image, project.image].map((img, i) => (
              <motion.div 
                whileHover={{ y: -15 }}
                key={i} 
                className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl"
              >
                <img src={img} className="object-cover w-full h-full transition-all duration-700 grayscale hover:grayscale-0" alt="gallery" />
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

export default ProjectDetailsPage;