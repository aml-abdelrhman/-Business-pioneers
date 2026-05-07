'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Compass, Maximize2, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useStore';

const ProjectsMap = () => {
  const t = useTranslations('home.introduction');
  const locale = useLocale();
  const { darkMode } = useAppStore();
  const isAr = locale === 'ar';

  return (
    <section className={cn(
      "relative py-20 overflow-hidden transition-colors duration-500",
      darkMode ? "bg-[#1a2b4b]" : "bg-slate-50"
    )} dir={isAr ? 'rtl' : 'ltr'}>
      
      <div className="container px-6 mx-auto max-w-7xl">
        
        {/* الرأس: نفس ستايل المشاريع والأبوت */}
        <div className="max-w-3xl mb-16 space-y-4 text-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
              darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"
            )}
          >
            <Compass size={14} className="animate-spin-slow" />
            {t('title')}
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "text-2xl md:text-4xl font-black tracking-tighter leading-tight flex items-center gap-4",
              darkMode ? "text-white" : "text-slate-900"
            )}
          >
            {isAr ? 'بصمتنا المعمارية في أنحاء المملكة' : 'Our Architectural Presence Across the Kingdom'}
            <ArrowDownLeft className="w-8 h-8 text-amber-500" />
          </motion.h3>
          
          <p className={cn(
            "text-xs md:text-sm font-medium opacity-70 leading-relaxed max-w-xl",
            darkMode ? "text-slate-400" : "text-slate-600"
          )}>
            {t('description')}
          </p>
        </div>

        {/* حاوية الخريطة التفاعلية */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl shadow-blue-900/10"
        >
          {/* طبقات الخلفية الفاخرة */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            
            {/* 1. التوهج الذهبي الشعاعي (Luxury Glow) */}
            <div className={cn(
              "absolute inset-0 opacity-40",
              darkMode 
                ? "bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.15)_0%,_transparent_70%)]" 
                : "bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.05)_0%,_transparent_70%)]"
            )} />

            {/* طبقة الضباب الزجاجي (Frosted Glass Effect) */}
            <div className={cn(
              "absolute inset-0 backdrop-blur-[2px] transition-colors duration-500",
              darkMode ? "bg-blue-900/20" : "bg-white/20"
            )} />

            {/* 2. نقش السدو المعماري السعودي (Architectural Sadu Pattern) */}
            <motion.div 
              animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='${darkMode ? '%23f59e0b' : '%231e3a8a'}' stroke-width='0.5'/%3E%3Cpath d='M0 0 L15 15 M45 45 L60 60 M60 0 L45 15 M15 45 L0 60' stroke='${darkMode ? '%23f59e0b' : '%231e3a8a'}' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }} 
            />

            {/* 3. شعار المملكة الفاخر (Elegant National Emblem) */}
            <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 120'%3E%3Cg fill='none' stroke='${darkMode ? '%23f59e0b' : '%231e3a8a'}' stroke-width='0.3'%3E%3Cpath d='M50 55V30M50 30c-8 0-15 5-18 15M50 30c8 0 15 5 18 15'/%3E%3Cpath d='M30 75l40 0M35 85l30 0'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '300px 300px',
              backgroundPosition: 'center',
            }} />
          </div>

          <Image
            src="/images/mapp.webp"
            alt="Projects Map"
            fill
            className={cn(
              "object-contain transition-transform duration-1000",
              darkMode ? "opacity-40 grayscale brightness-50" : "opacity-90"
            )}
            priority
          />

          {/* نقاط المشاريع (Pings) */}
          <div className="absolute inset-0">
            {/* مثال لنقطة مشروع في الرياض */}
            <MapPoint top="45%" left="55%" label={isAr ? "الرياض" : "Riyadh"} />
            {/* مثال لنقطة مشروع في جدة */}
            <MapPoint top="60%" left="35%" label={isAr ? "جدة" : "Jeddah"} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MapPoint = ({ top, left, label }: { top: string, left: string, label: string }) => (
  <div className="absolute group" style={{ top, left }}>
    <div className="relative">
      {/* النبض الخارجي */}
      <div className="absolute rounded-full -inset-4 bg-amber-500/20 animate-ping" />
      {/* النقطة الأساسية */}
      <button className="relative w-4 h-4 transition-transform border-2 border-white rounded-full shadow-lg bg-amber-500 dark:border-slate-900 group-hover:scale-125">
        <MapPin size={10} className="absolute inset-0 m-auto text-white" />
      </button>
      
      {/* الليبل (Label) */}
      <div className="absolute px-3 py-1 mt-2 transition-opacity -translate-x-1/2 bg-white border rounded-lg shadow-xl opacity-0 pointer-events-none top-full left-1/2 dark:bg-slate-900 border-slate-200 dark:border-white/10 group-hover:opacity-100 whitespace-nowrap">
        <span className="text-[10px] font-black text-blue-950 dark:text-white uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  </div>
);

export default ProjectsMap;