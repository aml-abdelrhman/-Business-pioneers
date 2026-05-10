"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { MapPin, Ruler, Building2, Compass, LayoutGrid, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ProjectDetailsPage = () => {
  const params = useParams();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { darkMode } = useAppStore();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // استخراج الـ slug من الرابط
  const slug = params?.slug as string;

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;

      const currentParam = decodeURIComponent(slug);
      
      // فحص: هل الرابط رقم (ID) أم نص (Slug)؟
      const isNumber = !isNaN(Number(currentParam));
      console.log(`[PAGE-DEBUG] Slug Param: ${currentParam} | isNumber: ${isNumber}`);

      let query = supabase.from('projects').select('*');

      if (isNumber) {
        query = query.eq('id', Number(currentParam));
      } else {
        query = query.ilike('slug', currentParam);
      }

      const { data, error } = await query.maybeSingle();
      console.log(`[PAGE-DEBUG] Supabase Result:`, { data, error });

      if (!error && data) {
        setProject(data);
      } else {
        console.error("Project not found:", error);
      }
      setLoading(false);
    }
    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
       <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
        <h1 className="text-4xl font-black text-amber-500">404</h1>
        <p className="text-xl opacity-70">{isRtl ? "المشروع غير موجود في قاعدة البيانات" : "Project not found in database"}</p>
        <Button asChild variant="outline" className="rounded-full">
            <Link href={`/${locale}/projects`}>
                {isRtl ? "العودة للمشاريع" : "Back to Projects"}
            </Link>
        </Button>
      </div>
    );
  }

  // تجهيز البيانات بناءً على اللغة
  const title = isRtl ? project.title_ar : project.title_en;
  const details = isRtl ? project.details_ar?.[0] : project.details_en?.[0];
  const locationName = isRtl ? project.description_ar?.[0]?.[1] : project.description_en?.[0]?.[1];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 pb-20",
      darkMode ? "bg-[#0b0f1a] text-white" : "bg-white text-slate-900"
    )} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex items-end pb-16 overflow-hidden">
        <Image
          src={project.image || "/placeholder-project.jpg"}
          alt={title}
          fill
          className="absolute inset-0 object-cover"
          priority
          unoptimized
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/40 to-transparent",
          !darkMode && "from-white via-white/20"
        )} />
        
        <div className="container relative z-10 px-6 mx-auto max-w-7xl">
          <div className="max-w-4xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-tighter"
            >
              <Compass size={14} />
              {isRtl ? "مشروع متميز" : "Featured Project"}
            </motion.div>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              {title}
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex gap-10 border-t border-white/10 pt-8 overflow-x-auto no-scrollbar"
          >
            <StatItem icon={Ruler} label={isRtl ? "المساحة" : "Area"} value={`${project.area || '—'} m²`} />
            <StatItem icon={MapPin} label={isRtl ? "الموقع" : "Location"} value={locationName || (isRtl ? "الرياض" : "Riyadh")} />
            <StatItem icon={LayoutGrid} label={isRtl ? "الوحدات" : "Units"} value={project.units || '—'} />
          </motion.div>
        </div>
      </section>

      {/* 2. Project Details Content */}
      <section className="container px-6 py-24 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
                <h2 className="text-amber-500 font-bold uppercase tracking-widest text-sm">
                    {isRtl ? "عن المشروع" : "About Project"}
                </h2>
                <p className="text-2xl md:text-3xl leading-relaxed font-medium opacity-80">
                    {details}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <FeatureCard 
                    icon={Building2} 
                    title={isRtl ? "التصميم المعماري" : "Architecture"} 
                    desc={isRtl ? "هوية بصرية فريدة تدمج بين الأصالة والحداثة" : "Unique visual identity merging tradition and modernity"}
                    darkMode={darkMode}
                />
                <FeatureCard 
                    icon={Compass} 
                    title={isRtl ? "التخطيط الذكي" : "Smart Planning"} 
                    desc={isRtl ? "استغلال مثالي للمساحات لتوفير أقصى درجات الراحة" : "Perfect space utilization for maximum comfort"}
                    darkMode={darkMode}
                />
            </div>
          </div>

          <div className="lg:col-span-4">
             <div className={cn(
                 "p-8 rounded-[2.5rem] sticky top-24 border transition-all",
                 darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
             )}>
                <h3 className="text-xl font-black mb-6">{isRtl ? "معلومات التواصل" : "Contact Info"}</h3>
                <div className="space-y-4">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl py-6">
                        {isRtl ? "طلب بروشور المشروع" : "Request Brochure"}
                    </Button>
                    <Button variant="outline" className="w-full rounded-2xl py-6 border-amber-500/30 text-amber-500">
                        {isRtl ? "تحدث مع مستشار" : "Talk to Advisor"}
                    </Button>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// مكونات فرعية صغيرة لتنظيم الكود
const StatItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex flex-col gap-1 min-w-fit">
    <div className="flex items-center gap-2 text-amber-500 mb-1">
        <Icon size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
    </div>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, darkMode }: any) => (
    <div className={cn(
        "p-8 rounded-[2rem] border transition-all hover:scale-[1.02]",
        darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm"
    )}>
        <Icon className="text-amber-500 mb-4" size={32} />
        <h4 className="text-lg font-black mb-2">{title}</h4>
        <p className="text-sm opacity-60 leading-relaxed">{desc}</p>
    </div>
);

export default ProjectDetailsPage;