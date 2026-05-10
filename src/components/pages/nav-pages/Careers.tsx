"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; 
import { useLocale } from "next-intl";
import { ImageKitProvider, IKUpload, IKImage } from 'imagekitio-next';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import CountUp from "react-countup";
import { 
  MoveUpRight, 
  Users, 
  Briefcase, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Coffee,
  CheckCircle2,
  Send,
  X,
  FileUp,
  MapPin,
  Clock
} from "lucide-react";

// استيراد Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// تعريف الهيكل لضمان توافق البيانات مع قاعدة البيانات
interface JobApplication {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  cv_url: string;
  cv_filename: string;
  is_general: boolean;
}

const CareersPage = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { darkMode } = useAppStore();
  const swiperRef = useRef<any>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  
  const [isGeneralCvSubmissionActive, setIsGeneralCvSubmissionActive] = useState(false); // New state for general CV
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // حالات النموذج
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    message: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedFileUrl(null);
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch('/api/imagekit-auth');
      if (!response.ok) throw new Error(`Failed to fetch auth params: ${response.statusText}`);
      
      const data = await response.json();
      const { signature, token, expire } = data;
      return { signature, token, expire };
    } catch (error) {
      console.error("ImageKit Authentication Error:", error);
      throw error;
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileUrl) {
      alert(isAr ? "يرجى رفع السيرة الذاتية أولاً" : "Please upload your CV first");
      return;
    }

    setIsSubmitting(true);

    try {
      const cvUrl = uploadedFileUrl;
      console.log("✅ Success: CV URL obtained:", cvUrl);

      // تحديد المسمى الوظيفي
      const jobTitle = selectedJob === "general" 
        ? formData.position
        : openJobs.find(j => j.id === selectedJob)?.title || "Unknown";

      // 3. تجهيز البيانات للإرسال لجدول job_applications
      const applicationData: JobApplication = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: jobTitle,
        message: formData.message,
        cv_url: cvUrl,
        cv_filename: uploadedFile?.name || "cv.pdf",
        is_general: selectedJob === "general"
      };

      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([applicationData] as any);

      if (insertError) throw insertError;

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error Log:", error);
      alert(isAr ? "❌ حدث خطأ أثناء إرسال الطلب" : "❌ Error sending application");
    } finally {
      setIsSubmitting(false);
    }

    // تصفير وإغلاق بعد النجاح
    setTimeout(() => {
      setSelectedJob(null);
      setIsSuccess(false);
      setUploadedFile(null);
      setUploadedFileUrl(null);
      setIsGeneralCvSubmissionActive(false); // Reset general CV mode
      setFormData({ fullName: "", email: "", phone: "", position: "", message: "" });
    }, 3000);
  };

  // إحصائيات التوظيف والثقافة
  const careerStats = [
    { label: isAr ? "موظف مبدع" : "Creative Members", value: 250, icon: Users },
    { label: isAr ? "جنسيات مختلفة" : "Nationalities", value: 15, icon: Globe },
    { label: isAr ? "ساعة تدريبية" : "Training Hours", value: 5000, suffix: "+", icon: GraduationCap },
    { label: isAr ? "فرص نمو" : "Growth Rate", value: 45, suffix: "%", icon: Sparkles },
  ];

  // ثقافة العمل (Carousel 1)
  const cultureSlides = [
    {
      title: isAr ? "بيئة عمل ملهمة" : "Inspiring Environment",
      description: isAr 
        ? "نوفر مساحات عمل محفزة للإبداع تدمج بين الرفاهية والإنتاجية." 
        : "We provide creative workspaces blending luxury and productivity.",
      icon: <Coffee className="text-amber-500" size={32} />,
    },
    {
      title: isAr ? "التطور المهني" : "Professional Growth",
      description: isAr 
        ? "نستثمر في كفاءاتنا عبر برامج تدريبية مكثفة ومسارات وظيفية واضحة." 
        : "Investing in our talents through intensive training and clear career paths.",
      icon: <GraduationCap className="text-amber-500" size={32} />,
    },
    {
      title: isAr ? "التوازن والحياة" : "Work-Life Balance",
      description: isAr 
        ? "نؤمن بأن الإبداع يتطلب صفاء الذهن، لذا نحرص على مرونة العمل ورفاهية الفريق." 
        : "Creative minds need clarity; we prioritize flexibility and team well-being.",
      icon: <Heart className="text-amber-500" size={32} />,
    }
  ];

  // خطوات التوظيف (Process)
  const recruitmentSteps = [
    {
      title: isAr ? "التقديم الإلكتروني" : "Online Application",
      desc: isAr ? "إرسال سيرتك الذاتية ومحفظة أعمالك عبر منصتنا." : "Submit your CV and portfolio through our platform.",
      icon: Send,
    },
    {
      title: isAr ? "المقابلة التقنية" : "Technical Interview",
      desc: isAr ? "نقاش معمق حول مهاراتك وخبراتك السابقة." : "In-depth discussion about your skills and experiences.",
      icon: Briefcase,
    },
    {
      title: isAr ? "الانضمام للفريق" : "Onboarding",
      desc: isAr ? "مرحلة التعريف بالثقافة وبدء رحلة النجاح معنا." : "Induction into our culture and starting the journey.",
      icon: CheckCircle2,
    }
  ];

  // الوظائف المتاحة
  const openJobs = [
    { id: "1", title: isAr ? "مهندس معماري أول" : "Senior Architect", dept: isAr ? "قسم التصميم" : "Design Dept", location: isAr ? "الرياض" : "Riyadh", type: isAr ? "دوام كامل" : "Full Time" },
    { id: "2", title: isAr ? "مدير مشاريع" : "Project Manager", dept: isAr ? "إدارة العمليات" : "Operations", location: isAr ? "جدة" : "Jeddah", type: isAr ? "دوام كامل" : "Full Time" },
    { id: "3", title: isAr ? "محلل بيانات عقارية" : "Real Estate Analyst", dept: isAr ? "الاستثمار" : "Investment", location: isAr ? "الرياض" : "Riyadh", type: isAr ? "هجين" : "Hybrid" },
  ];

  return (
    <main className={cn(
      "min-h-screen relative overflow-hidden pt-22 transition-colors duration-700",
      darkMode ? "bg-black" : "bg-slate-950"
    )} dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. Background Layer */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/hero1.png" // يمكنك تغييرها لصورة تعبر عن فريق العمل
          alt="Careers Background"
          fill
          className="object-cover opacity-30 grayscale-[30%]" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className="relative z-10">
        
        {/* 2. Hero & Culture Section */}
        <section className="container flex flex-col justify-center min-h-screen px-6 py-20 mx-auto md:px-16">
          <div className={cn(
            "relative overflow-hidden border rounded-[4rem] border-white/10 backdrop-blur-md shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)]",
            "bg-gradient-to-br from-white/[0.07] to-transparent p-10 lg:p-20"
          )}>
            
            <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
              
              {/* Left Side: Text Content */}
              <motion.div
                initial={{ opacity: 0, x: isAr ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-amber-600" />
                  <span className="text-amber-500 text-[12px] font-black uppercase tracking-[0.6em]">
                    {isAr ? "انضم إلى النخبة" : "JOIN THE ELITE"}
                  </span>
                </div>

                <h1 className="text-5xl leading-tight tracking-tighter text-white md:text-7xl font-extralight">
                  {isAr ? "ابنِ مسارك" : "Build Your Career"} <br/>
                  <span className="font-bold text-amber-500">{isAr ? "مع الرواد" : "With Pioneers"}</span>
                </h1>

                <p className="max-w-md text-lg font-light leading-relaxed text-slate-300/80">
                  {isAr 
                    ? "نحن لا نبحث عن موظفين، بل عن شركاء في الإبداع يطمحون لترك بصمة خالدة في أفق المعمار السعودي."
                    : "We don't look for employees; we look for creative partners aspiring to leave a lasting mark on the Saudi skyline."}
                </p>

                <div className="flex gap-6 opacity-50">
                   <Users size={20} className="text-white" />
                   <Sparkles size={20} className="text-white" />
                   <Briefcase size={20} className="text-white" />
                </div>
              </motion.div>

              {/* Right Side: Culture Swiper */}
              <div className="relative group">
                <Swiper
                  onSwiper={(s) => (swiperRef.current = s)}
                  modules={[Navigation, Autoplay, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 4000 }}
                  loop={true}
                  className="w-full h-[400px]"
                >
                  {cultureSlides.map((slide, i) => (
                    <SwiperSlide key={i}>
                      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl h-full flex flex-col justify-between group-hover:border-amber-500/30 transition-all duration-500">
                        <div className="space-y-6">
                           <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10">
                              {slide.icon}
                           </div>
                           <h3 className="text-3xl font-bold text-white">{slide.title}</h3>
                           <p className="font-light leading-relaxed text-slate-400">{slide.description}</p>
                        </div>
                        
                        <div className="self-end text-6xl font-black text-amber-500/20">0{i+1}</div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Arrows Navigation */}
                <div className="absolute z-20 flex gap-4 -bottom-16">
                  <button onClick={() => swiperRef.current?.slidePrev()} className="p-4 text-white transition-all border rounded-full border-white/10 hover:bg-amber-600 hover:border-amber-600">
                    <ChevronLeft size={20} className={cn(!isAr && "rotate-180")} />
                  </button>
                  <button onClick={() => swiperRef.current?.slideNext()} className="p-4 text-white transition-all border rounded-full border-white/10 hover:bg-amber-600 hover:border-amber-600">
                    <ChevronRight size={20} className={cn(!isAr && "rotate-180")} />
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
              {careerStats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="relative p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-3xl hover:border-amber-600/30 transition-all group"
                >
                  <div className="p-4 mb-8 transition-transform duration-500 rounded-2xl bg-amber-500/10 text-amber-500 w-fit group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white">
                    <stat.icon size={32} />
                  </div>
                  <h2 className="mb-4 text-6xl font-black tracking-tighter text-white">
                    <CountUp end={stat.value} duration={3} enableScrollSpy />
                    {stat.suffix && <span className="ml-1 text-amber-600">{stat.suffix}</span>}
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500 font-black group-hover:text-white transition-colors">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Open Positions & Process */}
        <section className="container px-6 py-20 mx-auto md:px-16">
          <div className={cn(
            "relative overflow-hidden border rounded-[4rem] border-white/10 backdrop-blur-md",
            "bg-gradient-to-br from-white/[0.05] to-transparent p-10 lg:p-20"
          )}>
            <div className="grid items-start grid-cols-1 gap-16 lg:grid-cols-2">
              
              {/* Left Side: Recruitment Process */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <span className="text-amber-500 text-[12px] font-black uppercase tracking-[0.6em]">
                    {isAr ? "كيف ننضم؟" : "HOW WE JOIN?"}
                  </span>
                  <h2 className="text-4xl text-white font-extralight">{isAr ? "رحلة التوظيف" : "Recruitment Journey"}</h2>
                </div>

                <div className="space-y-8">
                  {recruitmentSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 transition-all border rounded-xl bg-white/5 border-white/10 text-amber-500 group-hover:bg-amber-600 group-hover:text-white">
                        <step.icon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white">{step.title}</h4>
                        <p className="text-sm font-light text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Open Vacancies List */}
              <div className="space-y-8">
                 <h3 className="mb-8 text-2xl font-bold text-amber-500">{isAr ? "الفرص المتاحة الآن" : "OPEN OPPORTUNITIES"}</h3>
                 <div className="space-y-4">
                    {openJobs.map((job) => (
                      <div 
                        key={job.id}
                        className="flex flex-col items-center justify-between gap-4 p-6 transition-all border rounded-3xl bg-white/5 border-white/10 md:flex-row hover:border-amber-500/50 group"
                      >
                        <div className="space-y-2 text-center md:text-start">
                           <h4 className="text-xl font-bold text-white transition-colors group-hover:text-amber-500">{job.title}</h4>
                           <div className="flex gap-4 font-mono text-xs text-slate-500">
                              <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                              <span className="flex items-center gap-1"><Clock size={12}/> {job.type}</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => setSelectedJob(job.id)}
                          className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white transition-all bg-amber-600 rounded-xl hover:bg-amber-500 group/btn"
                        >
                          {isAr ? "تقدم الآن" : "Apply Now"}
                          <MoveUpRight size={14} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"/>
                        </button>
                      </div>
                    ))}
                 </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Spontaneous Application CTA */}
        <section className="container px-6 py-40 mx-auto text-center">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="max-w-2xl mx-auto space-y-8"
           >
              <h2 className="text-4xl font-thin text-white md:text-6xl">
                {isAr ? "لم تجد تخصصك؟" : "Didn't find your match?"}
              </h2>
              <p className="font-light text-slate-400">
                {isAr 
                  ? "نحن دائماً في بحث عن المبدعين، أرسل سيرتك الذاتية بشكل مباشر وسنتواصل معك." 
                  : "We are always looking for creatives. Send your CV directly and we will contact you."}
              </p>
              <button
                onClick={() => {
                  setIsGeneralCvSubmissionActive(true); // Activate general CV mode
                  setSelectedJob("general"); // Open the modal
                }}
                className="px-10 py-5 font-black tracking-widest text-black uppercase transition-all bg-white rounded-full shadow-2xl hover:bg-amber-600 hover:text-white shadow-white/5"
              >
                {isAr ? "إرسال سيرة ذاتية عامة" : "Send General CV"}
              </button>
           </motion.div>
        </section>

      </div>

      {/* 6. Recruitment Modal (The Form) */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-[#3d4427]/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-[3rem] relative overflow-hidden max-h-[92vh] flex flex-col shadow-2xl shadow-black/30"
            >
              <button onClick={() => {
                setSelectedJob(null);
                setIsGeneralCvSubmissionActive(false); // Reset general CV mode on close
              }}
              className="absolute z-[60] p-3 md:p-4 transition-all rounded-full top-26 left-6 md:top-20 md:left-10 text-slate-400 hover:text-amber-600 bg-slate-50 dark:bg-white/5 backdrop-blur-xl border border-slate-100 dark:border-white/5 group">
                <X size={26} className="transition-transform group-hover:rotate-90" />
              </button>
              
              <div className="p-8 pb-10 overflow-y-auto pt-26 md:pt-12 scrollbar-hide">
                <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="py-10 space-y-4 text-center"
                  >
                    <div className="flex items-center justify-center w-20 h-20 mx-auto text-green-500 rounded-full bg-green-500/10">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{isAr ? "تم إرسال طلبك بنجاح!" : "Application Sent!"}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">{isAr ? "سيتواصل معك فريق التوظيف لدينا قريباً." : "Our recruitment team will contact you soon."}</p>
                    <button
                      onClick={() => {
                        setSelectedJob(null);
                        setIsSuccess(false);
                        setUploadedFile(null);
                        setIsGeneralCvSubmissionActive(false);
                        setFormData({ fullName: "", email: "", phone: "", position: "", message: "" });
                      }}
                      className="mt-8 px-10 py-4 font-black tracking-widest uppercase transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                      {isAr ? "إغلاق" : "Close"}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="relative pt-8 space-y-4 md:pt-20">
                      <h3 className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-white md:text-6xl">{isAr ? "نموذج التقديم" : "Application Form"}</h3>
                      <p className="font-black text-[10px] tracking-[0.4em] uppercase text-amber-500 bg-amber-500/10 w-fit px-5 py-2 rounded-full border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                        {selectedJob === "general" 
                          ? (isAr ? "سيرة ذاتية عامة" : "General CV Submission")
                          : openJobs.find(j => j.id === selectedJob)?.title}
                      </p>
                    </div>

                    <form onSubmit={handleApplySubmit} className="space-y-6">
                       <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 px-3">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                            <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full p-4 text-base font-medium text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-white/5 outline-none rounded-2xl bg-white dark:bg-white/[0.03] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50" placeholder="..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 px-3">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                            <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full p-4 text-base font-medium text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-white/5 outline-none rounded-2xl bg-white dark:bg-white/[0.03] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50" placeholder="example@mail.com" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 px-3">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
                            <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full p-4 text-base font-medium text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-white/5 outline-none rounded-2xl bg-white dark:bg-white/[0.03] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50" placeholder="05xxxxxxxx" />
                          </div>

                          {selectedJob === "general" && (
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 px-3">{isAr ? "الوظيفة المستهدفة" : "Target Job"}</label>
                              <input required name="position" value={formData.position} onChange={handleInputChange} type="text" className="w-full p-4 text-base font-medium text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-white/5 outline-none rounded-2xl bg-white dark:bg-white/[0.03] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50" placeholder={isAr ? "مثال: مطور واجهات" : "e.g. Frontend Developer"} />
                            </div>
                          )}
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 px-3">{isAr ? "السيرة الذاتية" : "CV / Resume"}</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                              "p-8 text-center transition-all border-2 border-dashed cursor-pointer rounded-3xl group",
                              uploadedFileUrl ? "border-amber-500 bg-amber-500/5" : "border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-amber-500/30 shadow-sm"
                            )}
                          >
                              <ImageKitProvider 
                                publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""} 
                                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""} 
                                authenticator={authenticator}
                              >
                                <IKUpload
                                  ref={fileInputRef}
                                  className="hidden"
                                  fileName="application_cv.pdf"
                                  accept=".pdf"
                                  useUniqueFileName={true}
                                  folder="/cv_applications"
                                  onUploadStart={() => setIsUploading(true)}
                                  onChange={handleFileChange}
                                  onError={(err: any) => {
                                    console.error("ImageKit Upload Error:", err);
                                    setIsUploading(false);
                                  }}
                                  onSuccess={(res: any) => {
                                    console.log("رابط الملف الجديد:", res.url);
                                    setUploadedFileUrl(res.url);
                                    setIsUploading(false);
                                  }}
                                />
                              </ImageKitProvider>
                              <FileUp size={32} className={cn("mx-auto mb-3 transition-colors", uploadedFileUrl ? "text-amber-500" : "text-slate-300 dark:text-white/20 group-hover:text-amber-500")} />
                              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                                {uploadedFile ? uploadedFile.name : (isAr ? "ارفع السيرة الذاتية (PDF)" : "Upload your CV (PDF)")}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">{isAr ? "الحد الأقصى 5 ميجابايت" : "Max size 5MB"}</p>
                          </div>
                       </div>
                       
                       {!isGeneralCvSubmissionActive && ( // Only show this if NOT general submission
                         <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 px-3">{isAr ? "رسالة إضافية" : "Additional Message"}</label>
                          <textarea 
                            name="message" 
                            value={formData.message} 
                            onChange={handleInputChange} 
                            rows={4} 
                            className="w-full p-5 text-base font-medium text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-white/5 outline-none resize-none rounded-2xl bg-white dark:bg-white/[0.03] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50" 
                            placeholder={isAr ? "نبذة قصيرة عنك..." : "Tell us about yourself..."} 
                          />
                         </div>
                       )}

                       <button 
                        disabled={isSubmitting || isUploading}
                        className="flex items-center justify-center w-full gap-3 py-6 text-sm font-black tracking-widest uppercase transition-all bg-amber-600 text-slate-950 rounded-2xl hover:bg-amber-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-amber-600/20"
                       >
                          {isSubmitting || isUploading ? (
                            <div className="w-5 h-5 border-2 rounded-full border-slate-950/30 border-t-slate-950 animate-spin" />
                          ) : <Send size={18} />}
                          {isSubmitting 
                            ? (isAr ? "جاري الإرسال..." : "Sending...") 
                            : isUploading 
                              ? (isAr ? "جاري الرفع..." : "Uploading...")
                              : (isAr ? "إرسال الطلب الآن" : "Submit Application Now")}
                       </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default CareersPage;