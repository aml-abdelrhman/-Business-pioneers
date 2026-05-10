'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { MapPin, ChevronRight, ChevronLeft, ArrowUpRight, ArrowDownLeft, Ruler, LayoutGrid } from 'lucide-react';

// استيراد الأدوات الموحدة
import { Link } from '@/i18n/routing';
import { useAppStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase'; // تأكدي من مسار ملف السوبابيز عندك

import 'swiper/css';

export default function LatestProjects() {
  const swiperRef = useRef<SwiperType | null>(null);
  const locale = useLocale();
  const t = useTranslations('LatestProjects');
  const { darkMode } = useAppStore();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات من سوبابيز
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);

  if (loading) return null; // أو ضعي Skeleton Screen بسيط

  return (
    <section className={cn(
      "relative py-20 overflow-hidden transition-colors duration-500",
      darkMode ? "bg-slate-950" : "bg-slate-50"
    )}>
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* البار العلوي - التصميم الموحد */}
        <div className="flex flex-col items-end justify-between gap-6 mb-12 md:flex-row">
          <div className="space-y-4 text-start">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
              darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
            )}>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              {t('sub_title')}
            </div>
            <h6 className={cn(
              "text-2xl md:text-4xl font-bold leading-tight tracking-tighter flex items-center gap-4",
              darkMode ? "text-white" : "text-slate-900"
            )}>
               {t('main_title')}
               <ArrowDownLeft className="w-8 h-8 text-amber-500 md:w-12 md:h-12" />
            </h6>
          </div>

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

        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          loop={projects.length > 1}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          breakpoints={{
            1024: { slidesPerView: 1.5 },
          }}
          className="!overflow-visible"
        >
          {projects.map((project) => {
            // استخراج البيانات بناءً على اللغة الحالية
            const title = locale === 'ar' ? project.title_ar : project.title_en;
            const details = locale === 'ar' ? project.details_ar : project.details_en;
            const description = locale === 'ar' ? project.description_ar : project.description_en;
            // الموقع غالباً يكون أول عنصر في الـ JSON اللي عملناه
            const location = description?.[0]?.[1] || ''; 
            
            const displayArea = locale === 'ar' ? (project.area_ar || project.area) : (project.area_en || project.area);
            const displayUnits = locale === 'ar' ? (project.units_ar || project.units) : (project.units_en || project.units);

            return (
              <SwiperSlide key={project.id}>
                {({ isActive }) => (
                  <Link href={`/projects/${project.slug || project.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={cn(
                        "relative rounded-[3rem] overflow-hidden transition-all duration-700",
                        darkMode ? "bg-slate-900" : "bg-white shadow-2xl shadow-slate-200",
                        !isActive && "opacity-40 scale-90 blur-[2px] grayscale"
                      )}
                    >
                      <div className="relative h-[200px] md:h-[350px] w-full group overflow-hidden">
                        <Image
                          src={project.image}
                          alt={title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute z-20 top-8 right-8">
                          <Button size="icon" className="text-white transition-all rounded-full w-14 h-14 bg-white/10 backdrop-blur-lg hover:bg-amber-500 border-white/20 group/btn">
                             <ArrowUpRight className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6 p-8 md:p-10">
                        <div className="grid items-start grid-cols-1 gap-8 pt-6 border-t md:grid-cols-2 border-slate-100 dark:border-white/5">
                          <div className="space-y-2 text-start">
                            <h4 className={cn(
                              "text-lg md:text-xl font-black tracking-tight",
                              darkMode ? "text-white" : "text-slate-900"
                            )}>
                              {title}
                            </h4>
                            <p className="text-xs font-bold tracking-wider uppercase text-amber-500">
                              {locale === 'ar' ? 'في المملكة العربية السعودية' : 'In Saudi Arabia'}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                                <MapPin size={16} className="text-amber-500" />
                                <span>{location}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                                  <Ruler size={13} className="text-amber-500" />
                                  <span>{locale === 'ar' ? 'المساحة:' : 'Area:'} {displayArea}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                                  <LayoutGrid size={13} className="text-amber-500" />
                                  <span>{locale === 'ar' ? 'الوحدات:' : 'Units:'} {displayUnits}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 text-start">
                            <p className={cn(
                              "text-xs leading-relaxed opacity-70 font-medium line-clamp-3",
                              darkMode ? "text-slate-400" : "text-slate-600"
                            )}>
                              {details?.[0]}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-blue-600" 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${project.completion_rate}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-blue-500">{project.completion_rate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}