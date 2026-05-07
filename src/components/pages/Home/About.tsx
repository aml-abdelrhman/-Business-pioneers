'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Building2, Compass, PencilRuler } from 'lucide-react';

export const About = () => {
  const t = useTranslations('about');
  const locale = useLocale();

  const archLabels = [
    { id: 1, ar: "تصميم دقيق", en: "Precision Design", icon: Compass },
    { id: 2, ar: "بناء مستدام", en: "Sustainable Build", icon: Building2 },
    { id: 3, ar: "رؤية إبداعية", en: "Creative Vision", icon: PencilRuler },
  ];

  const isAr = locale === 'ar';

  return (
    <section className="relative py-24 md:py-40 bg-slate-50/50 dark:bg-[#1a2b4b] overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
      {/* عناصر ديكورية خلفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12)_0%,_transparent_70%)] opacity-70 pointer-events-none" />
      
      <div className="container px-4 mx-auto max-w-7xl md:px-10">
        
        {/* الجزء العلوي: النصوص في المنتصف */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-900/5 dark:bg-amber-900/10 text-blue-900 dark:text-amber-500 font-bold text-xs tracking-[0.3em] uppercase",
              isAr ? "font-cairo" : "font-inter"
            )}
          >
            {t('sub_title')}
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn(
              "text-4xl md:text-6xl font-black text-blue-900 dark:text-slate-100 leading-[1.2]",
              isAr ? "font-cairo" : "font-inter"
            )}
          >
            {t('main_heading')}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-lg md:text-xl text-slate-600 dark:text-blue-100/80 max-w-2xl mx-auto leading-relaxed",
              isAr ? "font-cairo" : "font-inter"
            )}
          >
            {t('text')}
          </motion.p>
        </div>

        {/* الجزء الأوسط: الصورة الكاملة المركزية */}
        <motion.div 
          className="relative w-full max-w-6xl mx-auto mb-24 group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="relative h-[400px] md:h-[600px] w-full rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] border-[12px] border-white dark:border-[#1e293b]/50">
            <Image
              src="/images/hero7.png"
              alt="About Business Pioneers"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            
            {/* القوس المنحني المدمج */}
            <div className={cn(
              "absolute top-0 p-10 md:p-14 bg-white dark:bg-[#1a2b4b] z-20 hidden md:flex items-center gap-6",
              isAr ? "right-0 rounded-bl-[100px]" : "left-0 rounded-br-[100px]"
            )}>
              <h2 className={cn(
                "text-2xl md:text-4xl font-bold text-blue-900 dark:text-slate-100 leading-tight",
                isAr ? "font-cairo" : "font-inter"
              )}>
                {t('overlayFirst')} <br />
                <span className="text-amber-500">{t('overlaySecond')}</span>
              </h2>
              <div className="flex items-center justify-center rounded-full shadow-inner w-14 h-14 bg-slate-50 dark:bg-slate-900">
                <Building2 className="w-7 h-7 text-amber-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* شبكة المفاهيم المعمارية - تصميم معماري فاخر (Blueprint Style) */}
        {/* 
        <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
          {archLabels.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className={cn(
                "relative h-40 md:h-44 p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
                "bg-white dark:bg-[#0f172a]/40 backdrop-blur-xl",
                "border-slate-200 dark:border-white/5",
                "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] dark:shadow-none dark:hover:bg-amber-500/5",
                "flex flex-col justify-between items-start"
              )}>
                <span className="absolute -top-4 -right-2 text-8xl font-black opacity-[0.03] dark:opacity-[0.07] select-none group-hover:opacity-10 transition-opacity">
                  0{item.id}
                </span>

                <div className="flex items-center justify-center transition-all duration-500 shadow-inner w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-amber-500 group-hover:bg-amber-500 group-hover:text-white">
                  <item.icon size={28} strokeWidth={1.2} />
                </div>

                <div className="relative z-10 space-y-1 text-start">
                  <span className={cn(
                    "text-xl md:text-2xl font-black tracking-tighter text-blue-950 dark:text-white",
                    isAr ? "font-cairo" : "font-inter"
                  )}>
                    {isAr ? item.ar : item.en}
                  </span>
                  <div className="w-10 h-1 transition-all duration-700 rounded-full bg-amber-500/30 group-hover:w-full group-hover:bg-amber-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        */}
      </div>
    </section>
  );
};

export default About;