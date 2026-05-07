'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Compass, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useStore';
import Image from 'next/image';

const Mastery = () => {
  const locale = useLocale();
  const { darkMode } = useAppStore();
  const isAr = locale === 'ar';

  return (
    <section className={cn(
      "relative py-24 overflow-hidden transition-colors duration-1000",
      darkMode ? "bg-[#030303]" : "bg-blue-50/40" 
    )} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* طبقات الخلفية الفاخرة */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(245,158,11,0.15)_0%,_transparent_50%)]",
          darkMode ? "opacity-20" : "opacity-10"
        )} />
        
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '120px 120px'] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23f59e0b' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} 
        />
      </div>

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* الجزء الأول: العنوان العريض في الأعلى */}
        <div className="mb-16 text-center md:text-start">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border mb-6",
                    darkMode 
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-xl shadow-amber-950/20" 
                    : "bg-blue-100/50 text-blue-600 border-blue-200"
                )}
            >
                <Compass size={14} className="animate-spin-slow text-amber-500" />
                {isAr ? 'منهجية الأثر والقيمة' : 'METHODOLOGY OF IMPACT & VALUE'}
            </motion.div>

            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={cn(
                    "text-4xl md:text-4xl font-black leading-tight tracking-tighter max-w-4xl",
                    darkMode ? "text-white" : "text-slate-900"
                )}
            >
                {isAr 
                    ? 'نصمم الفراغ، لنصنع القيمة والمعنى' 
                    : 'Designing Space to Create Value and Meaning'}
                <span className="inline-block ml-4 align-middle">
                    <ArrowDownLeft className="w-10 h-10 md:w-16 md:h-16 text-amber-500" />
                </span>
            </motion.h3>
        </div>

        {/* الجزء الثاني: تقسيم العمودين */}
        <div className="grid items-start grid-cols-1 gap-16 lg:grid-cols-2">
          
          {/* العمود الأول: الفقرة النصية الكبيرة */}
          <motion.div 
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <p className={cn(
              "text-lg md:text-2xl font-light leading-relaxed",
              darkMode ? "text-slate-300" : "text-slate-600"
            )}>
              {isAr 
                ? 'نلتزم في ريادة الأعمال بتحويل المساحات الصامتة إلى بيئات حيوية تنبض بالقيمة والمعنى. نحن لا نبني جدراناً، بل نشيد تجارباً إنسانية متكاملة مستلهمين من عراقة التصاميم الإسلامية وتوظيف الهندسة الرقمية الحديثة لتقديم حلول تتجاوز التوقعات، مما يضمن أثراً مستداماً يعزز من جودة الحياة ويرفع من القيمة الاستثمارية لكل مشروع.'
                : 'At Business Pioneers, we are committed to transforming silent spaces into vibrant environments pulsing with value and meaning. We don’t just build walls; we construct integrated human experiences inspired by the nobility of Islamic designs and the utilization of modern digital engineering to provide solutions that exceed expectations, ensuring a sustainable impact that enhances quality of life.'}
            </p>
            
            {/* زخرفة جانبية للنص */}
            <div className={cn(
                "absolute -top-4 -bottom-4 w-1 bg-amber-500/20 rounded-full",
                isAr ? "-right-6" : "-left-6"
            )} />
          </motion.div>

          {/* العمود الثاني: الصورة كاملة */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              "relative w-full overflow-hidden rounded-3xl transition-all duration-700",
              darkMode ? "shadow-2xl shadow-amber-950/10" : "shadow-xl shadow-slate-200"
            )}
          >
            <div className="relative w-full h-auto">
              <Image 
                src="/images/mastry.png"
                alt="Business Pioneers Mastery"
                width={800} // عرض الصورة الأصلي
                height={600} // طول الصورة الأصلي
                className="object-cover w-full h-auto rounded-3xl"
                priority
              />
            </div>
          </motion.div>

        </div>       
      </div>
    </section>
  );
};

export default Mastery;