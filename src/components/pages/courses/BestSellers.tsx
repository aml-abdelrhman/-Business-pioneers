'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { MapPin, ChevronRight, ChevronLeft, ArrowUpRight, ArrowDownLeft, Ruler, LayoutGrid, Sparkles } from 'lucide-react';

// استيراد الأدوات الموحدة
import { Link } from '@/i18n/routing';
import { useAppStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// استيراد البيانات (تأكد من وجود ملفات البيانات الخاصة بالأكثر مبيعاً أو استخدم نفس بيانات المشاريع للتجربة)
import { lastProjectsEn } from '@/components/pages/courses/lastProjectsEn';
import { lastProjectsAr } from '@/components/pages/courses/lastProjectsAr';

import 'swiper/css';

export default function BestSellers() {
  const swiperRef = useRef<SwiperType | null>(null);
  const locale = useLocale();
  const t = useTranslations('BestSellers'); // تأكد من إضافة الترجمة في ملفات الـ JSON
  const { darkMode } = useAppStore();
  
  const [activeIndex, setActiveIndex] = useState(0);

  // جلب البيانات (يمكنك تغيير مصدر البيانات هنا ليكون خاصاً بالأكثر مبيعاً)
  const items = locale === 'ar' 
    ? Object.values(lastProjectsAr) 
    : Object.values(lastProjectsEn);

  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);

  return (
    <section className={cn(
      "relative py-24 overflow-hidden transition-colors duration-500",
      darkMode ? "bg-slate-950" : "bg-slate-50"
    )}>
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* الهيدر العلوي - نفس الروح */}
        <div className="flex flex-col items-end justify-between gap-6 mb-16 md:flex-row">
          <div className="space-y-4 text-start">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
              darkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-600"
            )}>
              <Sparkles size={14} className="animate-pulse" />
              {locale === 'ar' ? 'الأكثر طلباً' : 'Top Choice'}
            </div>
            <h2 className={cn(
              "text-3xl md:text-5xl font-black leading-tight tracking-tighter flex items-center gap-4",
              darkMode ? "text-white" : "text-slate-900"
            )}>
               {locale === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}
               <ArrowDownLeft className="w-8 h-8 text-amber-500 md:w-12 md:h-12" />
            </h2>
          </div>

          {/* أزرار التنقل */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="transition-all rounded-full w-14 h-14 border-slate-200 dark:border-slate-800 backdrop-blur-md active:scale-90"
            >
              {locale === 'ar' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="transition-all rounded-full w-14 h-14 border-slate-200 dark:border-slate-800 backdrop-blur-md active:scale-90"
            >
              {locale === 'ar' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
            </Button>
          </div>
        </div>

        {/* السلايدر */}
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          spaceBetween={40}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          breakpoints={{
            1024: { slidesPerView: 1.6 },
          }}
          className="!overflow-visible"
        >
          {items.map((item, idx) => (
            <SwiperSlide key={item.id}>
              {({ isActive }) => (
                <Link href={`/projects/${item.id}`} className="block cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative rounded-[3.5rem] overflow-hidden transition-all duration-1000 ease-in-out",
                      darkMode ? "bg-slate-900 border border-white/5" : "bg-white shadow-2xl shadow-slate-200",
                      !isActive && "opacity-30 scale-90 blur-[4px] grayscale"
                    )}
                  >
                    {/* الصورة */}
                    <div className="relative h-[250px] md:h-[420px] w-full group overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      {/* السهم العائم */}
                      <div className="absolute z-20 top-8 right-8">
                        <div className="flex items-center justify-center w-16 h-16 transition-all border rounded-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-amber-500 group/btn">
                           <ArrowUpRight className="text-white transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        </div>
                      </div>

                      {/* شارة السعر أو التميز */}
                      <div className="absolute bottom-8 left-8">
                        <div className="px-6 py-2 font-black text-white bg-blue-600 rounded-full text-md">
                           {locale === 'ar' ? 'عرض خاص' : 'Special Offer'}
                        </div>
                      </div>
                    </div>

                    {/* المحتوى السفلي */}
                    <div className="p-10 md:p-12">
                      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className={cn(
                            "text-2xl md:text-3xl font-black tracking-tighter",
                            darkMode ? "text-white" : "text-slate-900"
                          )}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 text-amber-500">
                             <MapPin size={18} />
                             <span className="text-sm font-bold tracking-widest uppercase">
                               {item.description[0][1]}
                             </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-5">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-60">
                            <span>{locale === 'ar' ? 'نسبة المبيعات' : 'Sales Ratio'}</span>
                            <span className="text-blue-500">{item.description[1][3]}</span>
                          </div>
                          <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500" 
                              initial={{ width: 0 }}
                              whileInView={{ width: item.description[1][3] }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                              <Ruler size={16} className="text-slate-400" />
                              <span className="text-xs font-bold">{item.area}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <LayoutGrid size={16} className="text-slate-400" />
                              <span className="text-xs font-bold">{item.units}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}