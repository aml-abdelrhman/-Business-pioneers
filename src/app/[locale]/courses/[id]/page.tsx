'use client';

import React, { use, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { 
  MapPin, Ruler, LayoutGrid, ArrowDownLeft, 
  ChevronRight, ChevronLeft, Sparkles, MoveLeft, MoveRight, Activity 
} from 'lucide-react';

import { lastProjectsAr } from "@/components/pages/courses/lastProjectsAr";
import { lastProjectsEn } from "@/components/pages/courses/lastProjectsEn";
import { Link } from "@/i18n/routing";
import { useAppStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import 'swiper/css';
import 'swiper/css/pagination';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function CourseDetailsPage({ params }: PageProps) {
  const { id, locale } = use(params);
  const { darkMode } = useAppStore();
  const swiperRef = useRef<SwiperType | null>(null);
  
  const isRTL = locale === 'ar';
  const dataSource = isRTL ? lastProjectsAr : lastProjectsEn;
  
  const project = Object.values(dataSource).find(
    (item: any) => String(item.id) === id
  ) as any;

  if (!project) notFound();

  const galleryImages = project.galleryImages?.length > 0 
    ? project.galleryImages 
    : [project.image, project.image, project.image];

  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);

  // مصفوفة عناوين افتراضية للفقرات (يمكنك تخصيصها من الداتا لاحقاً)
  const paragraphTitles = isRTL 
    ? ["الرؤية العامة", "التفاصيل الإنشائية", "اللمسات النهائية"] 
    : ["General Vision", "Structural Details", "Final Touches"];

  return (
    <main className={cn(
      "min-h-screen pb-20 transition-colors duration-500",
      darkMode ? "bg-[#0f0a05] text-stone-100" : "bg-[#fffaf5] text-stone-900"
    )} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t",
          darkMode ? "from-[#0f0a05] via-[#0f0a05]/40 to-transparent" : "from-[#fffaf5] via-[#fffaf5]/20 to-transparent"
        )} />
        
        <div className="container relative flex flex-col justify-end h-full px-6 pb-12 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Link href="/projects" className="inline-flex items-center gap-2 transition-all text-amber-600 hover:text-amber-500">
              {isRTL ? <MoveRight size={16} /> : <MoveLeft size={16} />}
              <span className="text-xs font-bold tracking-wider uppercase">{isRTL ? "العودة للمشاريع" : "Back to Projects"}</span>
            </Link>
            
            <h1 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
              {project.title}
            </h1>

            {/* شريط المعلومات المحدث: بدون إطارات، مسافات واسعة، نسبة الإنجاز مدمجة */}
            <div className="flex flex-wrap items-center pt-4 gap-x-12 gap-y-6">
              <div className="flex items-center gap-2.5">
                <MapPin className="text-amber-500" size={20} />
                <span className="text-sm font-semibold md:text-base">{project.description[0][1]}</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Ruler className="text-amber-500" size={20} />
                <span className="text-sm font-semibold md:text-base">{project.area || "---"}</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="text-amber-500" size={20} />
                <span className="text-sm font-semibold md:text-base">{project.units || "---"}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Activity className="text-amber-500" size={20} />
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-amber-600/70 font-bold leading-none mb-1">
                     {isRTL ? "الإنجاز" : "Progress"}
                   </span>
                   <span className="text-sm font-black leading-none md:text-base">
                     {project.description[1][3]}
                   </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* تفاصيل المشروع */}
      <section className="container max-w-5xl px-6 py-16 mx-auto">
        <div className="flex flex-col gap-12">
          
          <div className="max-w-2xl">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] mb-4",
              darkMode ? "bg-amber-900/20 text-amber-500" : "bg-amber-100 text-amber-700"
            )}>
              <Sparkles size={12} />
              {isRTL ? "مفهوم التصميم" : "Design Concept"}
            </div>
            
            <div className="flex items-center gap-3 mb-10">
              <h2 className="text-2xl font-black md:text-3xl">
                {isRTL ? "الفلسفة المعمارية" : "Architectural Philosophy"}
              </h2>
              <ArrowDownLeft className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          {/* فقرات الشرح مع عناوين فرعية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {project.details.map((text: string, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase text-amber-600">
                  <span className="w-6 h-[2px] bg-amber-500/30"></span>
                  {paragraphTitles[index] || paragraphTitles[0]}
                </h3>
                <p className={cn(
                  "text-lg leading-relaxed font-medium opacity-80",
                  darkMode ? "text-stone-300" : "text-stone-700"
                )}>
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* معرض الصور - كاروسيل أصغر في العرض */}
      <section className="py-16 overflow-hidden">
        <div className="container flex items-end justify-between max-w-5xl px-6 mx-auto mb-10">
          <div className="space-y-2">
            <h3 className="text-xl font-black md:text-2xl">{isRTL ? "معرض الصور" : "Project Gallery"}</h3>
            <div className="w-12 h-1 rounded-full bg-amber-500"></div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrev} className="w-10 h-10 transition-all border rounded-full border-stone-200 dark:border-stone-800 hover:bg-amber-500 hover:text-white">
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} className="w-10 h-10 transition-all border rounded-full border-stone-200 dark:border-stone-800 hover:bg-amber-500 hover:text-white">
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 4000 }}
            spaceBetween={20}
            slidesPerView={1.2} // تقليل العرض ليظهر محتوى جانبي أكثر
            centeredSlides={true}
            loop={true}
            onSwiper={(s) => (swiperRef.current = s)}
            breakpoints={{
              768: { slidesPerView: 1.8 }, // عرض أصغر للصورة النشطة
              1024: { slidesPerView: 2.2 }, 
            }}
            className="!overflow-visible"
          >
            {galleryImages.map((img: string, idx: number) => (
              <SwiperSlide key={idx}>
                {({ isActive }) => (
                  <div className={cn(
                    "relative aspect-[16/10] md:aspect-video rounded-[2rem] overflow-hidden transition-all duration-700",
                    !isActive ? "opacity-30 scale-90 blur-[1px] grayscale" : "shadow-2xl shadow-amber-900/10"
                  )}>
                    <Image
                      src={img}
                      alt={`Gallery ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

    </main>
  );
}