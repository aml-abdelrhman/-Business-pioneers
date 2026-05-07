"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import CountUp from "react-countup";
import { MoveUpRight, ShieldCheck, Zap, Globe, ChevronLeft, ChevronRight, Target, Award, Rocket, Building2, History, Maximize, FileText } from "lucide-react";

// استيراد Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import dynamic from "next/dynamic";
import { CompanyProfilePDF } from "@/components/pdf/CompanyProfilePDF";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// يجب تعريف المكون الديناميكي خارج المكون الأساسي لضمان استقرار الحالة ومنع إعادة الإنشاء عند كل رندر
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink), { ssr: false });

const AboutPage = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { darkMode } = useAppStore();
  const swiperRef = useRef<any>(null);
  const swiperRef2 = useRef<any>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: isAr ? "مشروعاً منجزاً" : "Completed Projects", value: 150, icon: Building2 },
    { label: isAr ? "جوائز عالمية" : "Global Awards", value: 12, icon: Award },
    { label: isAr ? "عاماً من الخبرة" : "Years of Experience", value: 25, icon: History },
    { label: isAr ? "مساحات تطويرية" : "Developed Area", value: 2000, suffix: "M", icon: Maximize },
  ];

  const visionMission = [
    {
      title: isAr ? "رؤيتنا" : "Our Vision",
      desc: isAr ? "أن نكون الرواد في تطوير مجتمعات عمرانية مستدامة تعكس الهوية السعودية وتلبي تطلعات المستقبل." : "To be the pioneers in developing sustainable urban communities that reflect the Saudi identity and meet future aspirations.",
      icon: Target,
    },
    {
      title: isAr ? "رسالتنا" : "Our Mission",
      desc: isAr ? "تقديم حلول عقارية وهندسية مبتكرة تضمن أعلى معايير الجودة وتحقق القيمة المضافة لعملائنا." : "Providing innovative real estate and engineering solutions that ensure the highest quality standards.",
      icon: Rocket,
    }
  ];
  const methodologySlides2 = [
    {
      title: isAr ? "الابتكار المعماري" : "Architectural Innovation",
      description: isAr 
        ? "نتبنى أحدث تقنيات البناء والنمذجة الذكية لخلق أيقونات معمارية تجمع بين الهوية السعودية العريقة والحداثة العالمية." 
        : "We adopt the latest construction techs to create architectural icons blending Saudi identity with global modernity.",
      icon: <Rocket className="text-amber-500" size={24} />,
    },
    {
      title: isAr ? "التنمية المستدامة" : "Sustainable Development",
      description: isAr 
        ? "نلتزم بمعايير الأبنية الخضراء وتقليل الأثر الكربوني عبر دمج حلول الطاقة المتجددة في كافة مشاريعنا العقارية." 
        : "We are committed to green building standards by integrating renewable energy solutions in our projects.",
      icon: <Target className="text-amber-500" size={24} />,
    },
    {
      title: isAr ? "حوكمة الجودة" : "Quality Governance",
      description: isAr 
        ? "نطبق أنظمة رقابة صارمة تتوافق مع المعايير الدولية لضمان تنفيذ أدق التفاصيل الهندسية بأعلى جودة." 
        : "We apply strict oversight systems to ensure precision in engineering details and top-tier quality.",
      icon: <Award className="text-amber-500" size={24} />,
    }
  ];
  // بيانات الكاروسيل (منهجية العمل)
  const methodologySlides = [
    {
      title: isAr ? "الابتكار المعماري" : "Architectural Innovation",
      description: isAr ? "نتبع نهجاً يدمج بين الأصالة والتقنيات الحديثة لخلق فضاءات تتجاوز التوقعات." : "Integrating heritage with modern tech to create spaces that exceed expectations.",
      icon: <Rocket className="text-amber-500" size={32} />,
      tag: "01"
    },
    {
      title: isAr ? "الاستدامة والذكاء" : "Smart Sustainability",
      description: isAr ? "تعتمد منهجيتنا على حلول ذكية تقلل الانبعاثات وتعزز كفاءة الطاقة في كل مشروع." : "Our methodology relies on smart solutions that reduce emissions and enhance energy efficiency.",
      icon: <Target className="text-amber-500" size={32} />,
      tag: "02"
    },
    {
      title: isAr ? "الجودة الشاملة" : "Total Quality",
      description: isAr ? "نطبق معايير عالمية في الرقابة والتنفيذ لضمان تسليم مشاريع تتسم بالدقة والكمال." : "Applying global standards in oversight to ensure projects delivered with precision and perfection.",
      icon: <Award className="text-amber-500" size={32} />,
      tag: "03"
    }
  ];

  return (
    <main className={cn(
      "min-h-screen pt-32 relative overflow-hidden transition-colors duration-700",
      darkMode ? "bg-black" : "bg-slate-950"
    )} dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. Background Layer */}
      <div className="fixed inset-x-0 top-0 bottom-0 z-0">
        <Image 
          src="/images/hero1.png" 
          alt="Background Heritage"
          fill
          className="object-cover opacity-50 grayscale-[20%]" 
          priority
        />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10">
        {/* 2. Hero & Methodology Carousel Section */}
        <section className="container flex flex-col justify-center min-h-screen px-6 py-20 mx-auto md:px-16">
          <div className={cn(
            "relative overflow-hidden border rounded-[4rem] border-white/10 backdrop-blur-md shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)]",
            "bg-gradient-to-br from-white/[0.07] to-transparent p-10 lg:p-20"
          )}>
            
            <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
              
              {/* Left Side: Static Content */}
              <motion.div
                initial={{ opacity: 0, x: isAr ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-amber-600" />
                  <span className="text-amber-500 text-[12px] font-black uppercase tracking-[0.6em]">
                    {isAr ? "رواد الأعمال القابضة" : "B.P. HOLDING"}
                  </span>
                </div>

                <h1 className="text-5xl leading-tight tracking-tighter text-white md:text-7xl font-extralight">
                  {isAr ? "نصيغ المستقبل" : "Shaping The Future"} <br/>
                  <span className="font-bold text-amber-500">{isAr ? "بلمسة إبداع" : "With Creativity"}</span>
                </h1>

                <p className="max-w-md text-lg font-light leading-relaxed text-slate-300/80">
                  {isAr 
                    ? "نحن لا نبني جدراناً، بل نشيد صروحاً تحكي قصة نجاح المملكة وتطلعاتها العالمية."
                    : "We don't just build walls; we construct landmarks that tell the story of the Kingdom's success."}
                </p>

                {/* المميزات السريعة */}
                <div className="flex gap-6 opacity-50">
                   <ShieldCheck size={20} className="text-white" />
                   <Zap size={20} className="text-white" />
                   <Globe size={20} className="text-white" />
                </div>
              </motion.div>

              {/* Right Side: Methodology Carousel */}
              <div className="relative group">
                <Swiper
                  onSwiper={(s) => (swiperRef.current = s)}
                  modules={[Navigation, Autoplay, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 4000 }}
                  loop={true}
                  className="w-full h-[450px]" // تم زيادة الارتفاع لاستيعاب الزر الجديد
                >
                  {methodologySlides.map((slide, i) => (
                    <SwiperSlide key={i}>
                      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl min-h-[450px] flex flex-col justify-between group-hover:border-amber-500/30 transition-all duration-500">
                        <div className="space-y-6">
                           <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10">
                              {slide.icon}
                           </div>
                           <h3 className="text-3xl font-bold text-white">{slide.title}</h3>
                           <p className="font-light leading-relaxed text-slate-400">{slide.description}</p>
                        </div>
                        
                        {/* تم نقل زر تحميل ملف PDF إلى هنا */}
                        {mounted && (
                          <div className="relative z-50 mt-8 swiper-no-swiping" onClick={(e) => e.stopPropagation()}>
                            <PDFDownloadLink
                              document={<CompanyProfilePDF locale={locale as "en" | "ar"} />}
                              fileName="Business_Pioneers_Profile.pdf"
                              className="block w-full"
                            >
                              {({ loading }) => (
                                <div className={cn(
                                  "flex items-center justify-between w-full px-8 py-5 text-white transition-all duration-500 shadow-lg bg-amber-600 hover:bg-amber-500 rounded-2xl group/btn shadow-amber-600/10",
                                  loading ? "opacity-70 cursor-wait pointer-events-none" : "cursor-pointer"
                                )}>
                                  <span className="text-sm font-bold tracking-widest uppercase">
                                    {loading 
                                      ? (isAr ? "جاري التجهيز..." : "PREPARING...") 
                                      : (isAr ? "ملف بي دي اف (محتوى الشركة)" : "PDF FILE (COMPANY CONTENT)")}
                                  </span>
                                  <div className="p-2 transition-transform rounded-lg bg-white/20 group-hover/btn:translate-x-2">
                                    <FileText size={20} />
                                  </div>
                                </div>
                              )}
                            </PDFDownloadLink>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Arrows Navigation */}
                <div className="absolute z-20 flex gap-4 -bottom-16">
                  <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="p-4 text-white transition-all border rounded-full border-white/10 hover:bg-amber-600 hover:border-amber-600"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    className="p-4 text-white transition-all border rounded-full border-white/10 hover:bg-amber-600 hover:border-amber-600"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Stats Section */}
        <section className="py-32">
          <div className="container px-6 mx-auto md:px-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="relative p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-3xl hover:border-amber-600/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-4 transition-transform duration-500 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white">
                      <stat.icon size={32} />
                    </div>
                  </div>
                  <h2 className="mb-4 text-6xl font-black tracking-tighter text-white md:text-7xl">
                    <CountUp end={stat.value} duration={4} enableScrollSpy />
                    <span className="ml-1 text-amber-600">+</span>
                    {stat.suffix && <span className="ml-1 text-xl font-medium text-slate-500">{stat.suffix}</span>}
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.5em] text-slate-500 font-black transition-colors group-hover:text-white">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Secondary Swiper Section with stats2 */}
        <section className="container flex flex-col justify-center px-6 py-20 mx-auto md:px-16">
          <div className={cn(
            "relative overflow-hidden border rounded-[4rem] border-white/10 backdrop-blur-md shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)]",
            "bg-gradient-to-br from-white/[0.07] to-transparent p-10 lg:p-20"
          )}>
            <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
              
              {/* Left Side: stats2 Grid */}
              <motion.div
                initial={{ opacity: 0, x: isAr ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-amber-600" />
                  <span className="text-amber-500 text-[12px] font-black uppercase tracking-[0.6em]">
                    {isAr ? "الرؤية والرسالة" : "VISION & MISSION"}
                  </span>
                </div>

                <div className="space-y-6">
                  {visionMission.map((item, idx) => (
                    <div key={idx} className="p-8 transition-all duration-500 border rounded-[2.5rem] border-white/5 bg-white/5 hover:border-amber-500/30 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 transition-colors rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white">
                          <item.icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-sm font-light leading-relaxed transition-colors text-slate-400 group-hover:text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side: methodologySlides2 Swiper */}
              <div className="relative group">
                <Swiper
                  onSwiper={(s) => (swiperRef2.current = s)}
                  modules={[Navigation, Autoplay, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 5000 }}
                  loop={true}
                  className="w-full h-[450px]"
                >
                  {methodologySlides2.map((slide, i) => (
                    <SwiperSlide key={i}>
                      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl min-h-[450px] flex flex-col justify-between group-hover:border-amber-500/30 transition-all duration-500">
                        <div className="space-y-6">
                           <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10">
                              {slide.icon}
                           </div>
                           <h3 className="text-3xl font-bold text-white">{slide.title}</h3>
                           <p className="font-light leading-relaxed text-slate-400">{slide.description}</p>
                        </div>

                        {/* تم نقل زر منهجية العمل إلى هنا */}
                        <button className="flex items-center justify-between w-full px-8 py-5 mt-8 text-white transition-all duration-500 bg-amber-600 hover:bg-amber-500 rounded-2xl group/btn">
                          <span className="text-sm font-bold tracking-widest uppercase">
                            {isAr ? "منهجية عملنا" : "OUR METHODOLOGY"}
                          </span>
                          <div className="p-2 transition-transform rounded-lg bg-white/20 group-hover/btn:translate-x-2">
                            <MoveUpRight size={20} />
                          </div>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Arrows Navigation for the second Swiper */}
                <div className="absolute z-20 flex gap-4 -bottom-16">
                  <button onClick={() => swiperRef2.current?.slidePrev()} className="p-4 text-white transition-all border rounded-full border-white/10 hover:bg-amber-600 hover:border-amber-600">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => swiperRef2.current?.slideNext()} className="p-4 text-white transition-all border rounded-full border-white/10 hover:bg-amber-600 hover:border-amber-600">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Footer Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden py-60">
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/40 to-transparent backdrop-blur-xl z-[-1]" />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex flex-col items-center gap-10">
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
            <h2 className="text-white/20 text-4xl md:text-6xl font-thin tracking-[0.5em] uppercase">B.P. Holding</h2>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;