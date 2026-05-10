"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { X, ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, Building2, ChevronDown, Loader2, MessageSquare, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const projectTypes = [
  { id: 'residential', ar: 'تصميم سكني', en: 'Residential Design' },
  { id: 'commercial', ar: 'مشاريع تجارية', en: 'Commercial Projects' },
  { id: 'interior', ar: 'تصميم داخلي', en: 'Interior Design' },
  { id: 'masterplan', ar: 'تخطيط عمراني', en: 'Master Planning' },
  { id: 'other', ar: 'أخرى', en: 'Other' },
];

const getInterestFormSchema = (isRtl: boolean) => z.object({
  fullName: z.string().min(3, isRtl ? "الاسم يجب أن يكون 3 أحرف على الأقل" : "Name must be at least 3 characters"),
  phone: z.string()
    .min(10, isRtl ? "رقم الجوال غير صحيح" : "Invalid phone number")
    .regex(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|7|8)([0-9]{7})$/, isRtl ? "يرجى إدخال رقم جوال سعودي صحيح" : "Please enter a valid Saudi phone number"), 
  email: z.string().email(isRtl ? "البريد الإلكتروني غير صحيح" : "Invalid email address"),
  city: z.string().min(2, isRtl ? "يرجى تحديد المدينة" : "City is required"),
  projectType: z.string().min(1, isRtl ? "يرجى اختيار نوع المشروع" : "Project type is required"),
  message: z.string().optional(),
});

type InterestFormData = z.infer<ReturnType<typeof getInterestFormSchema>>;

const ArchitecturalInterestForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const locale = useLocale();
  const t = useTranslations("JoinForm");
  const isRtl = locale === "ar";
  const { darkMode } = useAppStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InterestFormData>({
    resolver: zodResolver(getInterestFormSchema(isRtl)),
  });

  const onSubmit = async (data: InterestFormData) => {
    setStatus('loading');
    const toastId = toast.loading(isRtl ? "جاري إرسال طلبك..." : "Sending your request...");
    
    // تحديد النص الذي سيظهر في قاعدة البيانات بناءً على الاختيار واللغة
    const selectedProject = projectTypes.find(type => type.id === data.projectType);
    const finalProjectLabel = selectedProject ? (isRtl ? selectedProject.ar : selectedProject.en) : data.projectType;

    try {
      const { error: supabaseError } = await (supabase.from("leads") as any).insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          project_type: finalProjectLabel,
          message: data.message || "",
        },
      ]);

      if (supabaseError) throw supabaseError;

      setStatus('success');
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">{isRtl ? "تم استلام طلبك بنجاح" : "Request Received Successfully"}</span>
          <span className="text-xs opacity-80">
            {isRtl ? "سيقوم فريقنا الهندسي بمراجعة التفاصيل والتواصل معك." : "Our engineering team will review the details and contact you."}
          </span>
        </div>, 
        { id: toastId, duration: 5000 });
      reset();
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 3000); 
    } catch (error) {
      setStatus('error');
      console.group("❌ فشل إرسال الطلب");
      console.error("تفاصيل الخطأ:", error);
      console.groupEnd();
      toast.error(isRtl ? "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى" : "Error sending request", { id: toastId });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020202]/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative w-full max-w-5xl h-full md:h-[85vh] overflow-hidden flex flex-col md:flex-row",
              darkMode ? "bg-[#0a0a0a] text-white" : "bg-white text-slate-900",
              "shadow-[0_0_100px_rgba(0,0,0,0.8)] border-t md:border border-white/5"
            )}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <button 
              onClick={onClose}
              className={cn("absolute z-30 transition-transform duration-500 top-8 mix-blend-difference hover:rotate-90", isRtl ? "left-8" : "right-8")}
            > 
              <X size={30} strokeWidth={1} className="text-white" />
            </button>

            {/* الجانب الجمالي */}
            <div className="relative hidden md:block md:w-5/12 overflow-hidden border-e border-white/5">
               <img 
                 src="/images/about.jpg" 
                 className="absolute inset-0 object-cover w-full h-full transition-all duration-1000"
                 alt="Architectural vision"
               />
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               <div className="absolute bottom-10 inset-x-10">
                  <p className="mb-2 font-mono text-xs tracking-widest uppercase text-amber-600">Since 2026</p>
                  <p className="text-xs leading-relaxed text-white/40">Crafting architectural excellence through innovative design and sustainable solutions.</p>
               </div>
            </div>

            {/* محتوى الفورم */}
            <div className="relative flex flex-col flex-1 p-8 overflow-y-auto md:p-20">
               <div className={cn("max-w-md w-full mx-auto my-auto py-12 md:py-4", isRtl ? "font-cairo" : "font-inter")}>
                  <header className="relative mb-16">
                    <div className="flex items-start gap-8">
                      <div className="hidden md:block w-[1px] h-32 bg-gradient-to-b from-amber-600 via-amber-600/30 to-transparent" />
                      <div className="space-y-4">
                        <span className="text-amber-600 text-[12px] font-black uppercase tracking-[0.6em] block">
                          {isRtl ? "سجل اهتمامك" : "Register Your Interest"}
                        </span>
                        <h3 className="text-5xl md:text-7xl font-extralight tracking-tighter leading-[1.05]">
                          {isRtl ? <>نصمم <span className="font-bold text-amber-600">إرثك</span> <br /> المعماري</> : <>Designing Your <br /> Next <span className="italic font-bold text-amber-600">Legacy</span></>}
                        </h3>
                      </div>
                    </div>
                  </header>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <ArchInput 
                      label={isRtl ? "الاسم الكامل" : "Full Name"} 
                      placeholder={isRtl ? "اكتب اسمك هنا" : "Enter your full name"} 
                      darkMode={darkMode} 
                      icon={User}
                      {...register("fullName")}
                      error={errors.fullName?.message}
                      isRtl={isRtl}
                    />
                    
                    <ArchInput 
                      label={isRtl ? "البريد الإلكتروني" : "Email"} 
                      placeholder="example@mail.com" 
                      darkMode={darkMode} 
                      icon={Mail}
                      {...register("email")}
                      error={errors.email?.message}
                      isRtl={isRtl}
                    />

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                       <ArchInput 
                         label={isRtl ? "رقم الجوال" : "Phone Number"} 
                         placeholder="05XXXXXXXX" 
                         darkMode={darkMode} 
                         icon={Phone}
                         {...register("phone")}
                         error={errors.phone?.message}
                         isRtl={isRtl}
                       />
                       <ArchInput 
                         label={isRtl ? "المدينة" : "City"} 
                         placeholder={isRtl ? "الرياض" : "Riyadh"} 
                         darkMode={darkMode} 
                         icon={MapPin}
                         {...register("city")}
                         error={errors.city?.message}
                         isRtl={isRtl}
                       />
                    </div>
                    
                    <div className="relative flex flex-col gap-2 group">
                      <label className="text-[13px] uppercase font-bold tracking-[0.2em] opacity-60 group-focus-within:text-amber-600 group-focus-within:opacity-100 transition-all">
                        {isRtl ? "تصنيف المشروع" : "Project Classification"}
                      </label>
                      <div className="relative">
                        <Building2 className={cn("absolute top-1/2 -translate-y-1/2 text-amber-600 opacity-50", isRtl ? "right-0" : "left-0")} size={18} />
                        <select 
                          className={cn(
                            "w-full bg-transparent border-b py-4 outline-none text-xl font-light transition-all appearance-none cursor-pointer",
                            darkMode ? "border-white/10 focus:border-amber-600 text-white" : "border-slate-200 focus:border-amber-600 text-slate-900",
                            isRtl ? "pr-10" : "pl-10",
                            errors.projectType ? "border-red-500" : ""
                          )}
                          {...register("projectType")}
                          defaultValue=""
                        >
                          <option value="" disabled>{isRtl ? "اختر نوع المشروع" : "Select Project Type"}</option>
                          {projectTypes.map(type => (
                            <option key={type.id} value={type.id} className="text-slate-900">
                              {isRtl ? type.ar : type.en}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className={cn("absolute top-1/2 -translate-y-1/2 text-amber-600 opacity-50 pointer-events-none", isRtl ? "left-1" : "right-1")} size={18} />
                        {errors.projectType && <p className="text-red-500 text-[10px] mt-1">{errors.projectType.message}</p>}
                      </div>
                    </div>

                    <ArchTextArea 
                      label={isRtl ? "تفاصيل المشروع" : "Project Details"} 
                      placeholder={isRtl ? "أخبرنا المزيد عن رؤيتك أو متطلباتك الخاصة..." : "Tell us more about your vision or specific requirements..."} 
                      darkMode={darkMode} 
                      icon={MessageSquare}
                      {...register("message")}
                      error={errors.message?.message}
                      isRtl={isRtl}
                    />

                    <motion.button
                      type="submit"
                      disabled={status !== 'idle'}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "relative flex items-center justify-center w-full py-6 mt-8 overflow-hidden border-b group transition-all duration-500",
                        status === 'idle' && "border-amber-600",
                        status === 'loading' && "border-amber-600/50 opacity-50",
                        status === 'success' && "border-emerald-500 bg-emerald-500/5",
                        status === 'error' && "border-red-500 bg-red-500/5"
                      )}
                    >
                      <span className="text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.5em] z-10 flex items-center gap-3">
                        {status === 'loading' && <Loader2 className="animate-spin" />}
                        {status === 'success' && (
                          <>
                            <Check size={20} className="text-emerald-500" />
                            {isRtl ? "تم الإرسال بنجاح" : "Sent Successfully"}
                          </>
                        )}
                        {status === 'error' && (
                          <>
                            <AlertCircle size={20} className="text-red-500" />
                            {isRtl ? "فشل الإرسال - حاول ثانية" : "Failed - Try Again"}
                          </>
                        )}
                        {status === 'idle' && (isRtl ? "تأكيد الطلب" : "Confirm Request")}
                      </span>
                      {status === 'idle' && (isRtl ? <ArrowLeft size={20} className="absolute left-0 transition-transform group-hover:-translate-x-2 text-amber-600" /> 
                                     : <ArrowRight size={20} className="absolute right-0 transition-transform group-hover:translate-x-2" />)}
                      {status === 'idle' && <div className="absolute inset-0 transition-transform duration-500 -translate-x-full bg-amber-600/10 group-hover:translate-x-0" />}
                    </motion.button>
                  </form>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ArchInput = React.forwardRef<HTMLInputElement, { label: string; placeholder: string; darkMode: boolean; icon: React.ElementType; error?: string; isRtl: boolean }>(
  ({ label, placeholder, darkMode, icon: Icon, error, isRtl, ...props }, ref) => (
    <div className="relative flex flex-col gap-2 group">
      <label className="text-[13px] uppercase font-bold tracking-[0.2em] opacity-60 group-focus-within:text-amber-600 group-focus-within:opacity-100 transition-all">
        {label}
      </label>
      <div className="relative">
        <Icon className={cn("absolute top-1/2 -translate-y-1/2 text-amber-600 opacity-50", isRtl ? "right-0" : "left-0")} size={18} />
        <input 
          ref={ref}
          className={cn(
            "w-full bg-transparent border-b py-3 outline-none text-lg font-light transition-all",
            darkMode ? "border-white/10 focus:border-amber-600" : "border-slate-200 focus:border-amber-600",
            isRtl ? "pr-8" : "pl-8",
            error ? "border-red-500" : ""
          )}
          placeholder={placeholder}
          {...props}
        />
        {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
      </div>
    </div>
  )
);
ArchInput.displayName = "ArchInput";

const ArchTextArea = React.forwardRef<HTMLTextAreaElement, { label: string; placeholder: string; darkMode: boolean; icon: React.ElementType; error?: string; isRtl: boolean }>(
  ({ label, placeholder, darkMode, icon: Icon, error, isRtl, ...props }, ref) => (
    <div className="relative flex flex-col gap-2 group">
      <label className="text-[13px] uppercase font-bold tracking-[0.2em] opacity-60 group-focus-within:text-amber-600 group-focus-within:opacity-100 transition-all">
        {label}
      </label>
      <div className="relative">
        <Icon className={cn("absolute top-4 text-amber-600 opacity-50", isRtl ? "right-0" : "left-0")} size={18} />
        <textarea 
          ref={ref}
          rows={3}
          className={cn(
            "w-full bg-transparent border-b py-3 outline-none text-lg font-light transition-all resize-none",
            darkMode ? "border-white/10 focus:border-amber-600" : "border-slate-200 focus:border-amber-600",
            isRtl ? "pr-8" : "pl-8",
            error ? "border-red-500" : ""
          )}
          placeholder={placeholder}
          {...props}
        />
        {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
      </div>
    </div>
  )
);
ArchTextArea.displayName = "ArchTextArea";

export default ArchitecturalInterestForm;