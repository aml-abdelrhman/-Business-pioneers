"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { 
  MapPin, Ruler, Building2, Compass, LayoutGrid, 
  ArrowUpRight, ChevronRight, ChevronLeft, Target, ChevronDown, ArrowDownLeft,
  MessageSquare, Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const ProjectDetailsPage = () => {
  const params = useParams();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { darkMode } = useAppStore();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const gallery = project?.images_gallery || (project?.image ? [project.image] : []);

  // تحريك الكاروسيل تلقائياً
  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const rawSlug = params?.slug;

  useEffect(() => {
    async function fetchProject() {
      if (!rawSlug) return;
      setLoading(true);
      try {
        const currentParam = decodeURIComponent(rawSlug as string);
        const isNumber = !isNaN(Number(currentParam)) && /^\d+$/.test(currentParam);
        let query = supabase.from('projects').select('*');
        if (isNumber) query = query.eq('id', parseInt(currentParam));
        else query = query.eq('slug', currentParam);

        const { data } = await query.maybeSingle();
        if (data) setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [rawSlug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
       <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!project) return null;

  // استخراج البيانات المتقدم (المتوافق مع هيكلة الداتابيز الجديدة)
  const title = isRtl ? (project.title_ar || project.title) : (project.title_en || project.title);
  const description = isRtl ? project.description_ar : project.description_en;
  
  // التعامل مع الوصف سواء كان مصفوفة أو نص عادي
  const descriptionText = Array.isArray(description) 
    ? description.map(item => Array.isArray(item) ? item[1] : item).join(" ") 
    : (typeof description === 'string' ? description : "");

  const detailsList = isRtl ? project.details_ar : project.details_en;
  
  const displayArea = isRtl ? (project.area_ar || project.area) : (project.area_en || project.area);
  const displayUnits = isRtl ? (project.units_ar || project.units) : (project.units_en || project.units);
  const location = Array.isArray(description) ? description?.[0]?.[1] : (isRtl ? project.location_ar : project.location_en);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 pb-20",
      darkMode ? "bg-[#0b0f1a] text-white" : "bg-white text-slate-900"
    )} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Hero Section - نصوص مفرودة في الأسفل */}
      <section className="relative h-[90vh] w-full overflow-hidden flex flex-col justify-end">
        <Image
          src={project.image || gallery[0]}
          alt={title}
          fill
          className="absolute inset-0 object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/20 to-transparent" />
        
        <div className="container relative z-10 mx-auto max-w-7xl px-6 pb-16">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-10 text-white leading-tight">
              {title}
            </h1>
            
            {/* إحصائيات سريعة مفرودة */}
            <div className="flex flex-wrap gap-8 md:gap-16 border-t border-white/20 pt-10">
              <QuickStatInline icon={Ruler} label={isRtl ? "المساحة" : "Area"} value={displayArea} />
              <QuickStatInline icon={LayoutGrid} label={isRtl ? "الوحدات" : "Units"} value={displayUnits} />
              <QuickStatInline 
                icon={MapPin} 
                label={isRtl ? "الموقع" : "Location"} 
                value={`${location || (isRtl ? "الخبر" : "Al Khobar")} (${descriptionText})`} 
              />
              {project.completion_rate && (
                <QuickStatInline icon={Target} label={isRtl ? "نسبة الإنجاز" : "Completion"} value={`${project.completion_rate}%`} />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Content Section - تفاصيل مفرودة */}
      <section className="container px-6 py-20 mx-auto max-w-7xl">
        <div className="grid gap-20 lg:grid-cols-12 items-start">
          
          <div className="lg:col-span-8">
            <div className="space-y-4 mb-10">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                darkMode ? "bg-amber-900/30 text-amber-500" : "bg-amber-100 text-amber-600"
              )}>
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                {isRtl ? "نظرة عامة" : "Overview"}
              </div>

              <h2 className={cn(
                "flex items-center gap-4 text-3xl md:text-4xl font-bold tracking-[0.1em] uppercase",
                darkMode ? "text-white" : "text-slate-900"
              )}>
                {isRtl ? "عن المشروع" : "About Project"}
                <ArrowDownLeft className="text-amber-500" size={33} />
              </h2>
            </div>

            {/* تفاصيل المشروع (Details List) */}
            {detailsList && Array.isArray(detailsList) && (
               <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-white/5">
                 {detailsList.map((detail: string, idx: number) => (
                   <motion.p 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn("text-lg leading-relaxed", darkMode ? "text-white/70" : "text-slate-600")}
                   >
                     {detail}
                   </motion.p>
                 ))}
               </div>
            )}

            {/* قسم التواصل والاهتمام - تصميم معماري بروفشنال */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "mt-16 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden border",
                darkMode 
                  ? "bg-gradient-to-br from-slate-900 to-[#0b0f1a] border-white/5" 
                  : "bg-gradient-to-br from-slate-50 to-white border-slate-100 shadow-xl shadow-slate-200/50"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-start">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-amber-500">
                    <MessageSquare size={24} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">{isRtl ? "تواصل معنا" : "Get in Touch"}</span>
                  </div>
                  <h3 className={cn("text-2xl md:text-3xl font-bold leading-snug max-w-md", darkMode ? "text-white" : "text-slate-900")}>
                    {isRtl ? "أريد الاستفسار أكثر أو تسجيل إعجابك بالمشروع" : "I want to inquire more or register my interest in this project"}
                  </h3>
                </div>

                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-black font-black px-10 py-8 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 group shadow-lg shadow-amber-500/20"
                >
                  <span>{isRtl ? "تسجيل اهتمامك" : "Register Your Interest"}</span>
                  <Send size={20} className={cn("transition-transform group-hover:translate-x-1", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - الأكشن */}
         
        </div>
      </section>

      {/* 3. Advanced Gallery - المعرض المركزي */}
      <section className="py-20 bg-slate-50 dark:bg-white/5 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6 mb-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4 text-start">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                darkMode ? "bg-amber-900/30 text-amber-500" : "bg-amber-100 text-amber-600"
              )}>
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                {isRtl ? "التغطية البصرية" : "Visual Coverage"}
              </div>
              <h2 className={cn(
                "text-2xl md:text-4xl font-semibold leading-tight tracking-tight flex items-center gap-4",
                darkMode ? "text-white" : "text-slate-900"
              )}>
                {isRtl ? "معرض الصور" : "Project Gallery"}
                <ArrowDownLeft className="w-8 h-8 text-amber-500 md:w-10 md:h-10 opacity-50" />
              </h2>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setActivePhotoIndex(prev => (prev - 1 + gallery.length) % gallery.length)}
                className="transition-all rounded-full w-14 h-14 border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white backdrop-blur-md active:scale-90"
              >
                {isRtl ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setActivePhotoIndex(prev => (prev + 1) % gallery.length)}
                className="transition-all rounded-full w-14 h-14 border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white backdrop-blur-md active:scale-90"
              >
                {isRtl ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative h-[320px] md:h-[480px] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {gallery.map((img: string, idx: number) => {
              const isActive = idx === activePhotoIndex;
              // إظهار فقط الصورة الحالية، السابقة، والتالية
              const isVisible = idx === activePhotoIndex || 
                                idx === (activePhotoIndex + 1) % gallery.length || 
                                idx === (activePhotoIndex - 1 + gallery.length) % gallery.length;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, x: isRtl ? "100%" : "-100%" }}
                  animate={{
                    opacity: isActive ? 1 : 0.35,
                    scale: isActive ? 1 : 0.8,
                    x: isRtl ? (activePhotoIndex - idx) * 90 + "%" : (idx - activePhotoIndex) * 90 + "%",
                    zIndex: isActive ? 20 : 10,
                    filter: isActive ? "blur(0px)" : "blur(3px)"
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: isRtl ? "-100%" : "100%" }}
                  transition={{ type: "spring", stiffness: 45, damping: 25, mass: 1.2 }}
                  className="absolute w-[85%] md:w-[50%] h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                >
                  <Image src={img} fill className="object-cover" alt="Gallery" unoptimized />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

// مكونات فرعية محسنة
const QuickStatInline = ({ icon: Icon, label, value }: any) => {
  const { darkMode } = useAppStore();
  
  // دالة لتقسيم النص وتلوين ما بين الأقواس بشكل خفيف للوضوح
  const renderValue = (val: string) => {
    const parts = val.split(/(\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('(') && part.endsWith(')')) {
        return (
          <span key={i} className="text-[0.85em] font-medium ml-1 rtl:mr-1 text-white/60">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-amber-500">
         <Icon size={18} strokeWidth={2.5} />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{label}</span>
      </div>
      <p className="text-xl font-bold tracking-tight text-white">
        {renderValue(value)}
      </p>
    </div>
  );
};

const NavButton = ({ icon: Icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-14 h-14 rounded-full border border-amber-500/30 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all active:scale-90"
  >
    <Icon size={24} />
  </button>
);

export default ProjectDetailsPage;