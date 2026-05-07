'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { Compass, Send, Phone, Mail, MapPin, ArrowRight, ArrowLeft, ArrowDownLeft, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useStore';


const ContactPage = () => {
  const locale = useLocale();
  const t = useTranslations('contact'); // تأكدي من وجود ملف json للترجمة
  const isRtl = locale === 'ar';
  const { darkMode } = useAppStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    phone: '',
    message: '',
  });

  const [messageError, setMessageError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setMessageError(isRtl ? 'الرسالة مطلوبة' : 'Message is required');
      return;
    }
    // Logic الارسال هنا
    console.log(formData);
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

          {/* Decorative Divider */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-1 mx-auto mt-12 rounded-full bg-amber-500/50"
          />
        </div>

        {/* الإطار الرئيسي (The Main Frame) */}
        <div className={cn(
          "relative p-8 md:p-16 rounded-[3.5rem] border backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-500",
          darkMode 
            ? "bg-slate-900/40 border-white/5 shadow-blue-900/10" 
            : "bg-white/80 border-slate-200 shadow-slate-200"
        )}>
          
          {/* عناصر زخرفية داخل الإطار */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

          <div className="relative z-10 space-y-12">
            
            {/* 1. وسائل التواصل - مربعات جمب بعض */}
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

            {/* 2. مستطيل الموقع العريض (المقر الرئيسي) */}
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

           
            {/* 3. الفورم الموسعة */}
            <div className="w-full max-w-5xl pt-4 mx-auto">
              <motion.form 
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
              >
                {/* الاسم الأول */}
                <div className="space-y-1.5">
                  <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الاسم الأول" : "First Name"}</label>
                  <input 
                    name="firstName"
                    onChange={handleChange}
                    className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                    placeholder={isRtl ? "الاسم الأول" : "First Name"}
                  />
                </div>
                
                {/* الاسم الأخير */}
                <div className="space-y-1.5">
                  <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "اسم العائلة" : "Last Name"}</label>
                  <input 
                    name="lastName"
                    onChange={handleChange}
                    className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                    placeholder={isRtl ? "اسم العائلة" : "Last Name"}
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-1.5">
                  <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "البريد الإلكتروني" : "Email Address"}</label>
                  <input 
                    name="email"
                    type="email"
                    onChange={handleChange}
                    className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                    placeholder="example@mail.com"
                  />
                </div>

                {/* رقم الجوال */}
                <div className="space-y-1.5">
                  <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الجوال" : "Phone"}</label>
                  <input 
                    name="phone"
                    onChange={handleChange}
                    className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                    placeholder="+966"
                  />
                </div>

                {/* موضوع الرسالة */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الموضوع" : "Subject"}</label>
                  <input 
                    name="subject"
                    onChange={handleChange}
                    className={cn("w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all", darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200")}
                    placeholder={isRtl ? "ما هو موضوع استفسارك؟" : "What is your inquiry about?"}
                  />
                </div>

                {/* الرسالة */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="px-2 text-sm font-bold tracking-widest uppercase text-slate-500">{isRtl ? "الرسالة" : "Message"}</label>
                  <textarea 
                    name="message"
                    onChange={handleChange}
                    rows={4}
                    className={cn(
                      "w-full border-none rounded-3xl p-5 text-lg font-medium outline-none transition-all resize-none",
                      darkMode ? "bg-white/5 text-white focus:bg-white/10" : "bg-slate-100 text-slate-900 focus:bg-slate-200"
                    )}
                    placeholder={isRtl ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
                  />
                  {messageError && <p className="px-2 text-xs font-bold text-red-500">{messageError}</p>}
                </div>
                
                <div className="pt-4 md:col-span-2">
                  <Button 
                    type="submit"
                    className="flex items-center w-full gap-3 py-8 text-xl font-black tracking-widest uppercase transition-all shadow-xl md:w-auto px-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20"
                  >
                    {isRtl ? "إرسال الطلب" : "Send Request"}
                    <Send size={16} />
                  </Button>
                </div>
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;