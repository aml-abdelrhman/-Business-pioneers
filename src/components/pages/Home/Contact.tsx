'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { Compass, Send, Phone, Mail, MapPin, Layers, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useStore';
import { toast } from 'sonner'; // أو أي مكتبة Toast تستخدمينها
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// تعريف المخطط (Schema) - يفضل وضعه في ملف خارجي للمشاركة
const createContactSchema = (isAr: boolean) => z.object({
  firstName: z.string().min(2, isAr ? 'الاسم الأول قصير جداً' : 'First name is too short'),
  lastName: z.string().min(2, isAr ? 'اسم العائلة قصير جداً' : 'Last name is too short'),
  email: z.string()
    .email(isAr ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address')
    .trim(),
  phone: z.string()
    .regex(/^\+?[0-9\s\-()]{8,20}$/, isAr ? "رقم الهاتف غير صحيح" : "Invalid phone number")
    .optional().or(z.literal('')),
  subject: z.string().min(3, isAr ? 'الموضوع مطلوب' : 'Subject is required'),
  message: z.string().min(5, isAr ? 'الرسالة قصيرة جداً (٥ أحرف على الأقل)' : 'Message is too short (min 5 chars)'),
});

// تعريف نوع البيانات بناءً على المخطط
type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

const ContactPage = () => {
  const locale = useLocale();
  const t = useTranslations('contact');
  const isRtl = locale === 'ar';
  const { darkMode } = useAppStore();

  const [isSuccess, setIsSuccess] = useState(false);

  // إعداد React Hook Form مع Zod
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactSchema(isRtl)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      phone: '',
      message: '',
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // تحسين شكل الـ Toast الخاص بجاري الإرسال
      const validationToast = toast.loading(
        isRtl ? "جاري إرسال رؤيتك للإبداع..." : "Sending your vision...",
        {
          className: cn(
            "p-5 rounded-[1.5rem] border-2 font-cairo shadow-2xl",
            darkMode ? "bg-slate-900 text-white border-amber-500/40" : "bg-white text-slate-900 border-slate-200"
          ),
        }
      );

      const response = await fetch('/api/send-email', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let result;
      const contentType = response.headers.get("content-type");

      toast.dismiss(validationToast); // إغلاق لودينج التحقق

      // التحقق مما إذا كانت الاستجابة JSON أم HTML (صفحة خطأ)
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const statusText = response.statusText || (response.status === 404 ? "Not Found" : "Server Error");
        throw new Error(isRtl 
          ? `خطأ في الخادم (${response.status}: ${statusText}). يرجى التأكد من مسار الرابط أو المحاولة لاحقاً.` 
          : `Server Error (${response.status}: ${statusText}). Please check the API path or try again later.`);
      }

      if (response.ok) {
        setIsSuccess(true);
        reset();
        toast.success(isRtl ? "تم التحقق والإرسال بنجاح!" : "Verified & Sent!", {
          className: cn(
            "text-xl p-6 rounded-[2rem] border-2",
            darkMode 
              ? "bg-slate-900 text-white border-amber-500/50 font-cairo" 
              : "bg-white text-slate-900 border-amber-500/20 font-cairo"
          ),
          duration: 5000,
        });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(result.error || 'Server error');
      }
    } catch (error: any) {
      toast.error(isRtl ? `خطأ: ${error.message}` : `Error: ${error.message}`, {
        className: "text-xl p-6 rounded-[2rem] font-cairo border-2 border-red-500",
      });
    }
  };

  const contactMethods = [
    {
      id: 1,
      icon: Mail,
      title: isRtl ? "البريد الإلكتروني" : "Email Us",
      value: "info@the1stavenue.com",
      href: "mailto:info@the1stavenue.com",
    },
    {
      id: 2,
      icon: Phone,
      title: isRtl ? "رقم الهاتف" : "Call Us",
      value: "+966442362009",
      href: "tel:+966112362009",
    },
    {
      id: 3,
      icon: FaWhatsapp,
      title: isRtl ? "واتساب" : "WhatsApp",
      value: "+966574112009",
      href: "https://wa.me/966571112009",
    }
  ];

  return (
    <div className={cn(
      "py-32 relative overflow-hidden transition-colors duration-1000",
      darkMode ? "bg-[#030303]" : "bg-white"
    )} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Dark Header Backdrop */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[600px] md:h-[750px] transition-all duration-1000 z-0",
        !darkMode ? "bg-[#0a192f]" : "bg-[#030303]"
      )} />

      {/* Architectural Background Patterns */}
      <div className="absolute top-0 left-0 right-0 h-[600px] md:h-[750px] z-[1] overflow-hidden pointer-events-none opacity-20">
        <div className={cn(
          "absolute inset-0",
          darkMode 
            ? "bg-[radial-gradient(theme(colors.amber.500)_1px,transparent_1px)]" 
            : "bg-[radial-gradient(#ffffff_1px,transparent_1px)]"
        )} style={{ backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303] dark:to-black" />
      </div>
    
      <section className="container relative z-10 px-6 mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-32 text-center">
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
              {isRtl ? "تواصل هندسي مبدع" : "CREATIVE ARCHITECTURAL CONTACT"}
            </span>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-10 text-4xl font-thin leading-none tracking-tighter text-white md:text-7xl"
          >
            {isRtl ? "لنصمم " : "Designing "} 
            <span className="italic font-bold text-amber-500">
              {isRtl ? "رؤيتك القادمة" : "Your Next Vision"}
            </span>
          </motion.h3>
          
          <p className="max-w-xl mx-auto text-sm font-medium leading-relaxed text-white md:text-base opacity-90">
            {isRtl 
              ? "نحن هنا للإجابة على تساؤلاتكم ومناقشة مشاريعكم الطموحة. تواصلوا معنا لنبدأ رحلة الإبداع المعماري."
              : "We are here to answer your questions and discuss your ambitious projects. Contact us to start the architectural creative journey."
            }
          </p>

          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-1 mx-auto mt-12 rounded-full bg-amber-500/50"
          />
        </div>

        {/* Main Frame */}
        <div className={cn(
          "relative p-8 md:p-16 rounded-[3.5rem] border backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-500",
          darkMode 
            ? "bg-slate-900/40 border-white/5 shadow-blue-900/10" 
            : "bg-white/80 border-slate-200 shadow-slate-200"
        )}>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

          <div className="relative z-10 space-y-12">
            
            {/* Contact Methods Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {contactMethods.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "group p-8 rounded-[2.5rem] border transition-all flex flex-col items-center text-center gap-4",
                    darkMode ? "bg-slate-800/20 border-white/5 hover:bg-amber-500/10" : "bg-slate-50 border-slate-100 hover:bg-amber-500/5"
                  )}
                >
                  <div className="flex items-center justify-center w-16 h-16 transition-transform shadow-lg rounded-3xl bg-amber-500 text-slate-950 shadow-amber-500/20 group-hover:scale-110">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{item.title}</h3>
                    <p className={cn(
                      "text-xl font-black transition-colors",
                      darkMode ? "text-white" : "text-slate-900"
                    )}>{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Location Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={cn(
                "p-8 md:p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-8",
                darkMode ? "bg-blue-900/10 border-blue-900/20" : "bg-blue-50/50 border-blue-100"
              )}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-16 h-16 shadow-inner rounded-3xl bg-amber-500/10 text-amber-500">
                  <MapPin size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-amber-600">
                    {isRtl ? "المملكة العربية السعودية" : "Saudi Arabia"}
                  </h4>
                  <p className={cn("text-xl md:text-2xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
                    {isRtl ? "الرياض، طريق الأمير تركي الأول" : "Riyadh, Prince Turki Al-Awal Road"}
                  </p>
                </div>
              </div>

              <div className="hidden w-px h-12 md:block bg-slate-500/20" />

              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-16 h-16 text-blue-500 shadow-inner rounded-3xl bg-blue-500/10">
                  <Compass size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
                    {isRtl ? "موقع الشركة" : "Company HQ"}
                  </h4>
                  <p className={cn("text-xl md:text-2xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
                    {isRtl ? "حي حطين، مجمع رواد الأعمال" : "Hittin Dist, Pioneers Hub"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <div className="w-full max-w-5xl pt-4 mx-auto">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                  >
                    <div className="p-6 rounded-full bg-green-500/10 text-green-500">
                      <CheckCircle2 size={80} />
                    </div>
                    <h2 className={cn("text-3xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
                      {isRtl ? "تم استلام رسالتك!" : "Message Received!"}
                    </h2>
                    <p className="text-slate-500 max-w-md">
                      {isRtl 
                        ? "شكراً لتواصلك معنا. سيقوم فريقنا الهندسي بالرد عليك عبر البريد الإلكتروني في أقرب وقت ممكن."
                        : "Thank you for reaching out. Our architectural team will get back to you via email as soon as possible."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
                  >
                    <div className="space-y-1.5">
                      <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الاسم الأول" : "First Name"}</label>
                      <input 
                        {...register('firstName')}
                        className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                        placeholder={isRtl ? "الاسم الأول" : "First Name"}
                      />
                      {errors.firstName && <p className="px-2 text-xs font-bold text-red-500">{errors.firstName.message}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "اسم العائلة" : "Last Name"}</label>
                      <input 
                        {...register('lastName')}
                        className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                        placeholder={isRtl ? "اسم العائلة" : "Last Name"}
                      />
                      {errors.lastName && <p className="px-2 text-xs font-bold text-red-500">{errors.lastName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "البريد الإلكتروني" : "Email Address"}</label>
                      <input 
                        {...register('email')}
                        className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                        placeholder="example@mail.com"
                      />
                      {errors.email && <p className="px-2 text-xs font-bold text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الجوال" : "Phone"}</label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            international
                            defaultCountry="SA"
                            placeholder={isRtl ? "05xxxxxxxx" : "+966xxxxxxxx"}
                            className={cn(
                              "w-full rounded-2xl p-4 text-lg font-medium transition-all flex items-center gap-4 group border-2 border-transparent",
                              darkMode 
                                ? "bg-white/5 text-white focus-within:border-amber-500/30 focus-within:bg-white/10" 
                                : "bg-slate-100 text-slate-900 focus-within:border-amber-500/20 focus-within:bg-slate-200",
                              // تحسينات متقدمة للدروب داون والعلم عبر CSS Selectors
                              "[&_select]:cursor-pointer [&_select]:bg-transparent [&_select]:outline-none [&_select]:w-full [&_select]:h-full [&_select]:absolute [&_select]:opacity-0",
                              "[&_.PhoneInputCountry]:relative [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1",
                              "[&_select_option]:text-slate-900 [&_select_option]:bg-white",
                              "[&_input]:bg-transparent [&_input]:border-none [&_input]:outline-none [&_input]:flex-1"
                            )}
                          />
                        )}
                      />
                      {errors.phone && <p className="px-2 text-xs font-bold text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الموضوع" : "Subject"}</label>
                      <input 
                        {...register('subject')}
                        className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                        placeholder={isRtl ? "ما هو موضوع استفسارك؟" : "What is your inquiry about?"}
                      />
                      {errors.subject && <p className="px-2 text-xs font-bold text-red-500">{errors.subject.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الرسالة" : "Message"}</label>
                      <textarea 
                        {...register('message')}
                        rows={4}
                        className={cn(
                          "w-full border-none rounded-3xl p-5 text-lg font-medium outline-none transition-all resize-none",
                          darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200"
                        )}
                        placeholder={isRtl ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
                      />
                      {errors.message && <p className="px-2 text-xs font-bold text-red-500">{errors.message.message}</p>}
                    </div>
                    
                    <div className="pt-4 md:col-span-2">
                      <Button 
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center w-full gap-3 py-8 text-xl font-black tracking-widest uppercase transition-all shadow-xl md:w-auto px-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <>
                            {isRtl ? "إرسال الطلب" : "Send Request"}
                            <Send size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;