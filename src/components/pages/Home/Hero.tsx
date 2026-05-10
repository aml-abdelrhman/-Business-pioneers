'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import InterestForm from '@/components/pages/InterestForm';

const slidesData = [
  { bg: '/images/hero1.png', titleKey: 'title_1', descKey: 'desc_1' },
  { bg: '/images/hero7.png', titleKey: 'title_2', descKey: 'desc_2' },
  { bg: '/images/hero2.png', titleKey: 'title_3', descKey: 'desc_3' },
];

export const Hero = () => {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const { darkMode } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

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
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 pb-12 md:pb-20 md:px-20">
        <div className="container w-full max-w-7xl">
          
          <div className="flex flex-col items-end justify-between gap-8 md:flex-row">
            
            {/* نصوص الهيرو */}
            <div className="w-full text-center text-white md:flex-1 md:text-start">
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
                
                <p className="max-w-4xl mx-auto mb-8 text-base leading-relaxed md:text-xl opacity-80 md:mx-0 line-clamp-3 md:line-clamp-none">
                  {t(slide.descKey)}
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
                  <Button 
                    size="lg"
                    onClick={() => setIsInterestModalOpen(true)}
                    className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold bg-[#D4AF37] text-white hover:bg-white hover:text-[#D4AF37] border-2 border-[#D4AF37] transition-all duration-300 group shadow-lg shadow-[#D4AF37]/20"
                  >
                    {isAr ? "سجل اهتمامك" : "Register Interest"}
                    <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* التحكم والأسهم - في الموبايل تظهر بشكل متناسق أسفل النص */}
            <div className="flex items-center justify-center w-full gap-3 pt-6 border-t md:justify-end md:w-auto md:pt-0 border-white/10 md:border-none">
              
          

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="w-12 h-12 text-white transition-all rounded-full md:w-16 md:h-16 border-white/20 bg-white/5 hover:bg-white hover:text-blue-900 backdrop-blur-md active:scale-90"
                >
                  {locale === 'ar' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="w-12 h-12 text-white transition-all rounded-full md:w-16 md:h-16 border-white/20 bg-white/5 hover:bg-white hover:text-blue-900 backdrop-blur-md active:scale-90"
                >
                  {locale === 'ar' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <InterestForm 
        isOpen={isInterestModalOpen} 
        onClose={() => setIsInterestModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;