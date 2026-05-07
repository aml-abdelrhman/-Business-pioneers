'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';

const slidesData = [
  { bg: '/images/hero1.png', titleKey: 'title_1', descKey: 'desc_1' },
  { bg: '/images/hero7.png', titleKey: 'title_2', descKey: 'desc_2' },
  { bg: '/images/hero2.png', titleKey: 'title_3', descKey: 'desc_3' },
];

export const Hero = () => {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const { darkMode } = useAppStore();
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slidesData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = slidesData[current];

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      
      {/* الخلفية مع تأثير الزووم */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src={slide.bg}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay متدرج يعطي وضوحاً للنصوص في الموبايل */}
          <div className={cn(
            "absolute inset-0 transition-colors duration-700",
            darkMode 
              ? "bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/90" 
              : "bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/80"
          )} />
        </motion.div>
      </AnimatePresence>

      {/* حاوية المحتوى الرئيسية */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12 md:pb-20 px-4 md:px-20">
        <div className="container max-w-7xl w-full">
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            
            {/* نصوص الهيرو */}
            <div className="w-full md:flex-1 text-white text-center md:text-start">
              <motion.div
                key={`content-${current}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className={cn(
                  "text-3xl md:text-7xl font-bold leading-[1.1] mb-4 md:mb-6 tracking-tighter",
                  locale === 'ar' ? "font-cairo" : "font-inter"
                )}>
                  {t(slide.titleKey)}
                </h3>
                
                <p className="text-base md:text-xl opacity-80 mb-8 max-w-4xl mx-auto md:mx-0 line-clamp-3 md:line-clamp-none leading-relaxed">
                  {t(slide.descKey)}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <Link href="/courses" className="w-full sm:w-auto">
                    <Button 
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold bg-amber-500 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 group shadow-lg shadow-amber-500/20"
                    >
                      {t('Explore_Courses')}
                      <ArrowUpRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* التحكم والأسهم - في الموبايل تظهر بشكل متناسق أسفل النص */}
            <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto pt-6 md:pt-0 border-t border-white/10 md:border-none">
              
          

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-blue-900 backdrop-blur-md transition-all active:scale-90"
                >
                  {locale === 'ar' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-blue-900 backdrop-blur-md transition-all active:scale-90"
                >
                  {locale === 'ar' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;