"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { 
  LayoutGrid, 
  ArrowUpRight, 
  User,
  Workflow,
  Building2, 
  HardHat, 
  ClipboardCheck, 
  DraftingCompass, 
  Paintbrush, 
  Settings,
  Layers
} from "lucide-react";
import Image from "next/image";

const Services = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { darkMode } = useAppStore();
  const containerRef = useRef(null);

  const services = [
    {
      id: "01",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500", 
      title: isAr ? "التطوير العقاري" : "Real Estate Development",
      architect: isAr ? "م. فهد السديري" : "Arch. Fahad Al-Sudairi",
      desc: isAr 
        ? "نبتكر مجتمعات سكنية وتجارية ذكية تتماشى مع رؤية المملكة 2030، مع التركيز على جودة الحياة والاستدامة."
        : "Creating smart residential and commercial communities aligned with Vision 2030, focusing on quality of life.",
    },
    {
      id: "02",
      icon: HardHat,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800",
      title: isAr ? "المقاولات العامة" : "General Contracting",
      architect: isAr ? "م. خالد المنصور" : "Arch. Khalid Al-Mansour",
      desc: isAr 
        ? "تنفيذ المشاريع الإنشائية الكبرى بدقة هندسية متناهية، مع الالتزام بأعلى معايير السلامة والجودة العالمية."
        : "Executing major construction projects with extreme precision, adhering to global safety and quality standards.",
    },
    {
      id: "03",
      icon: ClipboardCheck,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=500",
      title: isAr ? "إدارة المشاريع" : "Project Management",
      architect: isAr ? "م. سلطان القحطاني" : "Arch. Sultan Al-Qahtani",
      desc: isAr 
        ? "إدارة متكاملة لدورة حياة المشروع من التخطيط إلى التسليم، لضمان الكفاءة الزمنية والمالية."
        : "Integrated management of the project lifecycle from planning to delivery, ensuring time and cost efficiency.",
    },
    {
      id: "04",
      icon: DraftingCompass,
      image: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?q=80&w=500",
      title: isAr ? "الاستشارات الهندسية" : "Engineering Consultancy",
      architect: isAr ? "م. نورة الشهري" : "Arch. Nora Al-Shehri",
      desc: isAr 
        ? "تقديم حلول هندسية مبتكرة ودراسات جدوى فنية للمشاريع العقارية المعقدة."
        : "Providing innovative engineering solutions and technical feasibility studies for complex real estate projects.",
    },
    {
      id: "05",
      icon: Paintbrush,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500",
      title: isAr ? "التصميم الداخلي" : "Interior Design",
      architect: isAr ? "م. فيصل بن علي" : "Arch. Faisal Bin Ali",
      desc: isAr 
        ? "خلق فضاءات داخلية تجمع بين الفخامة المعاصرة والأصالة السعودية، لتعزيز تجربة المستخدم."
        : "Creating interior spaces that blend contemporary luxury with Saudi heritage to enhance user experience.",
    },
    {
      id: "06",
      icon: Settings,
      image: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=800",
      title: isAr ? "إدارة المرافق" : "Facility Management",
      architect: isAr ? "م. عبدالله الرويلي" : "Arch. Abdullah Al-Ruwaili",
      desc: isAr 
        ? "حلول تشغيلية ذكية تضمن استدامة الأصول العقارية ورفع كفاءة أدائها التشغيلي."
        : "Smart operational solutions ensuring the sustainability of real estate assets and operational efficiency.",
    },
  ];

  return (
    <section 
      ref={containerRef}
      className={cn(
        "pt-40 pb-24 relative overflow-hidden transition-colors duration-1000",
        darkMode ? "bg-[#030303]" : "bg-white"
      )} dir={isAr ? "rtl" : "ltr"}>

      {/* Dark Header Backdrop for Visual Impact */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[600px] md:h-[750px] transition-all duration-1000 z-0",
        !darkMode ? "bg-[#0a192f]" : "bg-[#030303]"
      )} />

      {/* Architectural Background Patterns */}
      <div className="absolute top-0 left-0 right-0 h-[600px] md:h-[750px] z-[1] overflow-hidden pointer-events-none opacity-20">
        <div className={cn(
          "absolute inset-0",
          darkMode 
            ? "bg-[radial-gradient(#amber-500_1px,transparent_1px)]" 
            : "bg-[radial-gradient(#ffffff_1px,transparent_1px)]"
        )} style={{ backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303] dark:to-black" />
      </div>
      
      <div className="container relative z-10 px-6 mx-auto md:px-16">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8",
              darkMode ? "border-amber-500/20 bg-amber-500/5" : "border-white/10 bg-white/5 backdrop-blur-xl"
            )}
          >
            <Layers size={14} className="text-amber-500" />
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">
              {isAr ? "حلول عقارية متكاملة" : "INTEGRATED REAL ESTATE SOLUTIONS"}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-10 text-4xl font-thin leading-none tracking-tighter text-white md:text-7xl"
          >
            {isAr ? "نصيغ " : "Crafting "} 
            <span className="italic font-bold text-amber-500">{isAr ? "مستقبل العقار" : "Real Estate Future"}</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-sm font-light leading-relaxed md:text-lg text-slate-300"
          >
            {isAr 
              ? "نقدم منظومة خدمات متكاملة تهدف إلى رفع قيمة الأصول العقارية وتحقيق الاستدامة العمرانية من خلال حلول هندسية وإدارية مبتكرة."
              : "Providing a holistic ecosystem of services aimed at elevating real estate asset value and ensuring urban sustainability through innovative engineering."}
          </motion.p>

          {/* Decorative Divider */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-1 mx-auto mt-12 rounded-full bg-amber-500/50"
          />
        </div>

        {/* Services Grid - كاردات بصورة جانبية */}
        <div className="grid gap-8 mb-24 lg:grid-cols-2">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: isAr ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={cn(
                "group flex flex-col md:flex-row overflow-hidden rounded-[2rem] border transition-all duration-500",
                darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200 hover:shadow-2xl"
              )}
            >
              {/* Image Side */}
              <div className="relative w-full h-64 overflow-hidden md:w-48 md:h-auto">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content Side */}
              <div className="flex-1 p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#0a192f]">{service.title}</h3>
                  <ArrowUpRight className="transition-all opacity-0 text-amber-600 group-hover:opacity-100" />
                </div>
                
                <p className="mb-6 text-sm leading-relaxed text-slate-500">{service.desc}</p>
                
                {/* Architect Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-700">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">{isAr ? "المعماري المسؤول" : "Lead Architect"}</p>
                    <p className="text-xs font-bold text-[#0a192f]">{service.architect}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Description Wide Image - صورة الوصف العريضة */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" 
            alt="About Company"
            className="object-cover w-full h-full brightness-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-gradient-to-t from-[#0a192f]/80 to-transparent">
            <h3 className="mb-6 text-3xl font-bold text-white md:text-5xl">
              {isAr ? "رؤية تتجاوز الحدود" : "Vision Beyond Boundaries"}
            </h3>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-200 md:text-lg">
              {isAr 
                ? "نحن في شركة Business Pioneers Holding نجمع بين الخبرة العميقة والابتكار التكنولوجي لنحول المساحات الصامتة إلى مجتمعات تنبض بالحياة، ملتزمين بأعلى معايير الحوكمة والجودة العالمية."
                : "We blend deep expertise with technological innovation to transform silent spaces into vibrant communities, committed to the highest global standards of governance and quality."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;