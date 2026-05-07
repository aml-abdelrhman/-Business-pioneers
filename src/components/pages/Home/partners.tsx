"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import Image from "next/image";

const SuccessPartners = () => {
  const locale = useLocale() as string;
  const isRtl = locale === "ar";
  const { darkMode } = useAppStore();

  // قائمة الشركاء (يمكنك استبدال المسارات بصور حقيقية)
  const partners = [
    { id: 1, name: "Aramco", logo: "/logos/partner1.svg", industry: isRtl ? "طاقة" : "Energy" },
    { id: 2, name: "NEOM", logo: "/logos/partner2.svg", industry: isRtl ? "تطوير" : "Development" },
    { id: 3, name: "Sabic", logo: "/logos/partner3.svg", industry: isRtl ? "صناعة" : "Industrial" },
    { id: 4, name: "ROSHN", logo: "/logos/partner4.svg", industry: isRtl ? "عقارات" : "Real Estate" },
    { id: 5, name: "PIF", logo: "/logos/partner5.svg", industry: isRtl ? "استثمار" : "Investment" },
    { id: 6, name: "Red Sea", logo: "/logos/partner6.svg", industry: isRtl ? "سياحة" : "Tourism" },
  ];

  // مضاعفة المصفوفة لضمان دوران لا نهائي سلس
  const infinitePartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className={cn(
      "relative py-4 overflow-hidden border-y transition-colors duration-700",
      darkMode ? "bg-[#1a2b4b]  border-white/5" : "bg-slate-500 border-slate-200"
    )} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* نمط الخلفية المعماري */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: `radial-gradient(${darkMode ? '#f59e0b' : '#0a192f'} 0.5px, transparent 0.5px)`,
          backgroundSize: '30px 30px',
        }} 
      />

      <div className="container relative z-10 px-6 mx-auto mb-6 text-center">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "inline-flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4",
              darkMode ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-[#0a192f]/5 text-[#0a192f] border border-[#0a192f]/10"
            )}
          >
            <Compass size={14} className="animate-spin-slow" />
            {isRtl ? "تحالفات استراتيجية" : "Strategic Alliances"}
          </motion.div>

         <h2 className={cn(
           "text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4 uppercase",
           darkMode ? "text-white" : "text-[#0a192f]"
         )}>
           {isRtl ? "شركاء " : "Success "} 
           <span className="italic text-amber-500">{isRtl ? "المسيرة" : "Partners"}</span>
         </h2>
         <p className={cn("max-w-2xl mx-auto text-sm md:text-base opacity-60", darkMode ? "text-slate-300" : "text-blue-50/90")}>
           {isRtl ? "نفخر بالتعاون مع كبرى الشركات والمؤسسات لتحقيق رؤى استثنائية" : "We take pride in collaborating with major companies to achieve exceptional visions"}
         </p>
      </div>

      {/* الكاروسيل اللانهائي */}
      <div className="relative w-full py-4 overflow-hidden group">
        
        {/* Gradient Overlays */}
        <div className={cn(
          "absolute inset-y-0 left-0 w-32 md:w-64 z-20 pointer-events-none bg-gradient-to-r",
          darkMode ? "from-black to-transparent" : "from-slate-50 to-transparent"
        )} />
        <div className={cn(
          "absolute inset-y-0 right-0 w-32 md:w-64 z-20 pointer-events-none bg-gradient-to-l",
          darkMode ? "from-black to-transparent" : "from-slate-50 to-transparent"
        )} />

        <motion.div
          className="flex items-center gap-12 md:gap-24 whitespace-nowrap"
          animate={{
            x: isRtl ? ["0%", "-50%"] : ["-50%", "0%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25, 
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {infinitePartners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-6 px-4 py-2 cursor-pointer group/item"
            >
              {/* حاوية الشعار (Logo Container) */}
              <div className={cn(
                "relative w-32 h-20 md:w-48 md:h-28 flex items-center justify-center transition-all duration-500 grayscale group-hover/item:grayscale-0",
                "bg-transparent"
              )}>
                {/* هنا تضع صورة الشعار - وضعت div كعنصر نائب (Placeholder) */}
                <div className={cn(
                  "flex flex-col items-center justify-center transition-transform duration-500 group-hover/item:scale-110",
                  darkMode ? "text-slate-500 group-hover/item:text-white" : "text-slate-400 group-hover/item:text-[#0a192f]"
                )}>
                    {/* استبدل هذا بـ <Image /> عند توفر الصور */}
                    <div className="mb-1 text-2xl font-bold tracking-widest uppercase">
                        {partner.name}
                    </div>
                    <span className="text-[9px] tracking-[0.2em] font-medium opacity-0 group-hover/item:opacity-100 transition-opacity">
                        {partner.industry}
                    </span>
                </div>
              </div>

              {/* فاصل أنيق بين الشركاء */}
              <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* خط سفلي جمالي */}
      <div className="container px-6 mx-auto mt-6">
          <div className={cn("h-[1px] w-full", darkMode ? "bg-white/5" : "bg-slate-200")} />
      </div>
    </section>
  );
};

export default SuccessPartners;