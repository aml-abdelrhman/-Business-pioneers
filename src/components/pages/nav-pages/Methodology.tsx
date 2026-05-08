"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { 
  PenTool, Cpu, Search, ShieldCheck, Zap, Compass, Hexagon, BarChart3, Building2, Workflow, FileText, Download, ArrowRight, Maximize2
} from "lucide-react";

const Methodology = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { darkMode } = useAppStore();
  const containerRef = useRef(null);

  const steps = [
    {
      id: "01",
      icon: BarChart3,
      title: isAr ? "تحليل الجدوى الاستراتيجية" : "Strategic Feasibility",
      desc: isAr 
        ? "نعتمد على البيانات الضخمة لتحليل اتجاهات السوق وتقدير عائد الاستثمار لضمان نجاح المشروع قبل التنفيذ."
        : "Leveraging big data to analyze market trends and ROI estimates, ensuring project viability before breaking ground.",
    },
    {
      id: "02",
      icon: Building2,
      title: isAr ? "التخطيط المعماري المتكامل" : "Architectural Master-Planning",
      desc: isAr 
        ? "تصميم مخططات ذكية تستغل المساحات بأقصى كفاءة، مع دمج فلسفة الاستدامة في كل ركن."
        : "Designing smart blueprints that maximize spatial efficiency while integrating sustainability into every corner.",
    },
    {
      id: "03",
      icon: PenTool,
      title: isAr ? "النمذجة الرقمية المتقدمة" : "Advanced Digital Modeling",
      desc: isAr 
        ? "تحويل الرؤية إلى واقع افتراضي عبر تقنيات BIM و نماذج 3D تتيح لك معاينة التفاصيل بدقة متناهية."
        : "Transforming vision into virtual reality via BIM technologies and 3D models for hyper-detailed walkthroughs.",
    },
    {
      id: "04",
      icon: Cpu,
      title: isAr ? "الهندسة التقنية والأتمتة" : "Tech Engineering & Automation",
      desc: isAr 
        ? "دمج أنظمة المباني الذكية (IoT) لضمان تجربة سكنية وعملية فائقة الحداثة وسهلة التحكم."
        : "Integrating Smart Building systems (IoT) to ensure an ultra-modern, seamless, and controllable living experience.",
    },
    {
      id: "05",
      icon: ShieldCheck,
      title: isAr ? "حوكمة الجودة والمعايير" : "Quality Governance & Standards",
      desc: isAr 
        ? "تطبيق بروتوكولات تدقيق صارمة تتوافق مع الأكواد الهندسية العالمية لضمان سلامة واستدامة المنشأة."
        : "Applying rigorous auditing protocols aligned with global engineering codes for structural safety and longevity.",
    },
    {
      id: "06",
      icon: Zap,
      title: isAr ? "التسليم والدعم التشغيلي" : "Delivery & Operational Support",
      desc: isAr 
        ? "نقل سلس للملكية مع توفير دليل تشغيل ذكي ودعم فني مستمر لضمان استمرارية كفاءة المرافق."
        : "Seamless asset transfer with smart operation manuals and ongoing technical support for facility efficiency.",
    }
  ];

  return (
    <section 
      ref={containerRef}
      className={cn(
        "py-32 relative overflow-hidden transition-colors duration-1000",
        darkMode ? "bg-[#030303] text-white" : "bg-white text-slate-900"
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
            ? "bg-[radial-gradient(#f59e0b_1px,transparent_1px)]" 
            : "bg-[radial-gradient(#ffffff_1px,transparent_1px)]"
        )} style={{ backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303] dark:to-black" />
      </div>

      <div className="container relative z-[10] px-6 mx-auto md:px-16">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-32 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8",
              darkMode ? "border-amber-500/20 bg-amber-500/5" : "border-white/10 bg-white/5 backdrop-blur-xl"
            )}
          >
            <Workflow size={14} className="text-amber-500" />
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">
              {isAr ? "بروتوكول التنفيذ" : "EXECUTION PROTOCOL"}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-10 text-4xl font-thin leading-none tracking-tighter text-white md:text-7xl"
          >
            {isAr ? "منهجية " : "Proven "} 
            <span className="italic font-bold text-amber-500">{isAr ? "التميز" : "Framework"}</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-sm font-light leading-relaxed md:text-lg text-slate-300"
          >
            {isAr 
              ? "نجمع بين الإبداع المعماري والذكاء الاصطناعي لنقدم حلولاً هندسية تتجاوز التوقعات، مع الالتزام بأدق المعايير الزمنية والتقنية."
              : "Blending architectural creativity with AI-driven intelligence to deliver engineering solutions that exceed expectations with precise timelines."}
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={cn(
                "group relative p-12 rounded-[3rem] border transition-all duration-700",
                darkMode 
                  ? "bg-white/[0.02] border-white/5 hover:border-amber-500/30 hover:bg-white/[0.04]" 
                  : "bg-white border-slate-200 hover:border-amber-500/40 shadow-xl shadow-slate-900/5"
              )}
            >
              {/* Giant Phase ID */}
              <span className={cn(
                "absolute top-6 right-8 text-7xl font-black italic opacity-5 transition-all duration-700 group-hover:opacity-10 group-hover:scale-110",
                darkMode ? "text-white" : "text-slate-900"
              )}>
                {step.id}
              </span>

              <div className="relative z-10">
                <div className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-2xl mb-12 shadow-2xl transition-transform duration-500 group-hover:-rotate-12",
                  darkMode ? "bg-amber-600/10" : "bg-slate-50 border border-slate-100"
                )}>
                  <step.icon size={28} className="text-amber-500" />
                </div>
                
                <h3 className="mb-5 text-2xl font-bold tracking-tight">
                  {step.title}
                </h3>
                
                <p className={cn(
                  "text-sm font-light leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>
                  {step.desc}
                </p>

                <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-amber-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategic Execution Framework Presentation Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className={cn(
            "mt-40 p-8 md:p-16 rounded-[4rem] border relative overflow-hidden group transition-all duration-700",
            darkMode 
              ? "bg-gradient-to-br from-amber-600/10 to-transparent border-white/5" 
              : "bg-[#0a192f] border-blue-900/20 shadow-2xl shadow-blue-900/30"
          )}
        >
          {/* Decorative Background Icon */}
          <FileText className="absolute bottom-[-20px] left-[-20px] text-white/5 w-64 h-64 -rotate-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="max-w-2xl text-center lg:text-start">
              <div className="flex items-center justify-center gap-3 mb-6 lg:justify-start">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Workflow size={20} className="text-amber-500" />
                </div>
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">
                  {isAr ? "المستند الاستراتيجي" : "STRATEGIC DOCUMENT"}
                </span>
              </div>
              
              <h2 className="mb-6 text-4xl font-bold tracking-tighter text-white md:text-5xl">
                {isAr ? "إطار التنفيذ الاستراتيجي" : "Strategic Execution Framework"}
              </h2>
              
              <p className="text-lg font-light leading-relaxed text-slate-300">
                {isAr 
                  ? "عرض تقديمي مفصل يستعرض خارطة الطريق التقنية والمنهجية المتبعة في إدارة المشاريع الكبرى لضمان أعلى مستويات الجودة."
                  : "A detailed presentation outlining the technical roadmap and methodology used in managing major projects to ensure top-tier quality."}
              </p>
            </div>

            <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/images/Strategic-Execution-Framework.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full gap-6 p-2 pr-8 transition-all duration-500 border-2 shadow-2xl md:w-fit bg-white/5 hover:bg-amber-500/5 border-white/20 hover:border-amber-500 rounded-3xl group/btn backdrop-blur-md"
              >
                <span className="text-sm font-black tracking-widest text-white uppercase transition-colors group-hover/btn:text-amber-500">
                  {isAr ? "عرض الاستراتيجية" : "VIEW STRATEGY"}
                </span>
                <div className="relative p-5 transition-all duration-500 rounded-2xl bg-white/10 text-white group-hover/btn:bg-amber-500 group-hover/btn:text-slate-950 group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_30px_-5px_rgba(245,158,11,0.8)]">
                  <Maximize2 size={24} strokeWidth={2.5} />
                  <div className="absolute inset-0 transition-opacity opacity-0 rounded-2xl bg-gradient-to-tr from-white/30 to-transparent group-hover/btn:opacity-100" />
                </div>
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/images/Strategic-Execution-Framework.pdf" 
                download
                className="flex items-center justify-between w-full gap-6 p-2 pr-8 transition-all duration-500 shadow-xl md:w-fit bg-amber-600 hover:bg-amber-500 rounded-3xl group/btn shadow-amber-600/40"
              >
                <span className="text-sm font-black tracking-widest uppercase text-slate-950">
                  {isAr ? "تحميل الملف" : "DOWNLOAD PDF"}
                </span>
                <div className="p-5 transition-all duration-500 rounded-2xl bg-slate-950 text-amber-500 group-hover/btn:scale-110">
                  <Download size={24} strokeWidth={2.5} />
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Methodology;