'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { MapPin, ChevronRight, ChevronLeft, ArrowUpRight, ArrowDownLeft, Ruler, LayoutGrid, Sparkles, Loader2 } from 'lucide-react';

// الأدوات الموحدة
import { Link } from '@/i18n/routing';
import { useAppStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

import 'swiper/css';

export default function BestSellers() {
  const swiperRef = useRef<SwiperType | null>(null);
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { darkMode } = useAppStore();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. جلب البيانات من سوبابيز مع الحفاظ على الفلتر
  useEffect(() => {
    async function fetchBestSellers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_best_seller', true) 
          .limit(6);

        if (error) throw error;
        if (data) setItems(data);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBestSellers();
  }, []);

  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);

  // حالة التحميل (نفس روح التصميم)
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      <p className={cn("text-sm font-medium", darkMode ? "text-white/50" : "text-slate-500")}>
        {isRtl ? "جاري تحميل العروض الخاصة..." : "Loading special offers..."}
      </p>
    </div>
  );

  if (items.length === 0) return null;

  return (
    <section className={cn(
      "relative py-24 overflow-hidden transition-colors duration-500",
      darkMode ? "bg-slate-950" : "bg-slate-50"
    )}>
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* الهيدر العلوي - التصميم الأصلي */}
        <div className="flex flex-col items-end justify-between gap-6 mb-16 md:flex-row">
          <div className="space-y-4 text-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                darkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-600"
              )}
            >
              <Sparkles size={14} className="animate-pulse" />
              {isRtl ? 'الأكثر طلباً' : 'Top Choice'}
            </motion.div>
            <h2 className={cn(
              "text-2xl md:text-4xl font-black leading-tight tracking-tighter flex items-center gap-4",
              darkMode ? "text-white" : "text-slate-900"
            )}>
               {isRtl ? 'الأكثر مبيعاً' : 'Best Sellers'}
               <ArrowDownLeft className="w-8 h-8 text-amber-500 md:w-12 md:h-12" />
            </h2>
          </div>

          {/* أزرار التنقل - التصميم الأصلي */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="transition-all rounded-full w-14 h-14 border-slate-200 dark:border-slate-800 backdrop-blur-md hover:bg-amber-500 hover:text-black active:scale-90"
            >
              {isRtl ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="transition-all rounded-full w-14 h-14 border-slate-200 dark:border-slate-800 backdrop-blur-md hover:bg-amber-500 hover:text-black active:scale-90"
            >
              {isRtl ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
            </Button>
          </div>
        </div>

        {/* السلايدر - ضبط الإعدادات لضمان الفخامة البصرية */}
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          grabCursor={true}
          speed={1200}
          loop={items.length > 1}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          breakpoints={{
            1024: { slidesPerView: 1.5 },
          }}
          className="!overflow-visible"
        >
          {items.map((item) => {
             // 2. معالجة البيانات ديناميكياً
             const title = isRtl ? (item.title_ar || item.title) : (item.title_en || item.title);
             const location = isRtl ? (item.location_ar || "الرياض") : (item.location_en || "Riyadh");
             const descData = isRtl ? item.description_ar : item.description_en;
             const descText = Array.isArray(descData) 
               ? descData.map((d: any) => Array.isArray(d) ? d[1] : d).join(" ") 
               : (typeof descData === 'string' ? descData : "");

             const salesRatio = item.sales_ratio || "90%"; 
             const area = isRtl ? (item.area_ar || item.area) : (item.area_en || item.area);
             const units = isRtl ? (item.units_ar || item.units) : (item.units_en || item.units);

             return (
                <SwiperSlide key={item.id}>
                  {({ isActive }: { isActive: boolean }) => (
                    <Link href={`/projects/${item.slug || item.id}`} className="block cursor-pointer">
                      <motion.div
                        animate={{ 
                          opacity: isActive ? 1 : 0.4,
                          scale: isActive ? 1.05 : 0.85,
                          filter: isActive ? "blur(0px) grayscale(0%)" : "blur(4px) grayscale(100%)"
                        }}
                        transition={{ type: "spring", stiffness: 45, damping: 25, mass: 1.2 }}
                        className={cn(
                          "relative rounded-[3.5rem] overflow-hidden",
                          darkMode ? "bg-slate-900 border border-white/5" : "bg-white shadow-2xl shadow-slate-200"
                        )}
                      >
                        {/* الصورة - مع تدرج لضمان وضوح الشارات */}
                        <div className="relative h-[200px] md:h-[350px] w-full group overflow-hidden">
                          <Image
                            src={item.image}
                            alt={title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          
                          {/* السهم العائم */}
                          <div className="absolute z-20 top-8 right-8">
                            <div className="flex items-center justify-center w-16 h-16 transition-all border rounded-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-amber-500 group/btn text-white hover:text-black">
                               <ArrowUpRight className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                            </div>
                          </div>

                          {/* شارة "عرض خاص" */}
                          <div className="absolute bottom-8 left-8">
                            <div className="px-6 py-2 font-black text-white bg-blue-600 rounded-full text-sm shadow-xl flex items-center gap-2">
                               <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                               {isRtl ? 'عرض خاص' : 'Special Offer'}
                            </div>
                          </div>
                        </div>

                        {/* المحتوى السفلي - نفس التقسيم الشبكي */}
                        <div className="p-8 md:p-10">
                          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                            <div className="space-y-4">
                              <h2 className={cn(
                                "text-xl md:text-xl font-black tracking-tighter leading-tight",
                                darkMode ? "text-white" : "text-slate-900"
                              )}>
                                {title}
                              </h2>
                              <div className="flex items-center gap-3 text-amber-500">
                                 <MapPin size={20} />
                                 <span className="text-sm font-bold tracking-widest uppercase">
                                   {location} ({descText})
                                 </span>
                              </div>
                            </div>

                            <div className="flex flex-col justify-center space-y-6">
                              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                                <span>{isRtl ? 'نسبة المبيعات' : 'Sales Ratio'}</span>
                                <span className="text-blue-500 font-black">{salesRatio}</span>
                              </div>
                              
                              {/* شريط التقدم - Progress Bar */}
                              <div className="w-full h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: salesRatio }}
                                  transition={{ duration: 2, ease: "circOut" }}
                                />
                              </div>

                              {/* المواصفات السريعة */}
                              <div className="flex gap-8 pt-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-lg bg-slate-400/10">
                                    <Ruler size={18} className="text-slate-400" />
                                  </div>
                                  <span className="text-sm font-black tracking-tight">{area}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-lg bg-slate-400/10">
                                    <LayoutGrid size={18} className="text-slate-400" />
                                  </div>
                                  <span className="text-sm font-black tracking-tight">{units}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )}
                </SwiperSlide>
             )
          })}
        </Swiper>
      </div>
    </section>
  );
}