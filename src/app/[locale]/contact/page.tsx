import React from "react";
import { setRequestLocale } from "next-intl/server";
// استيراد مكون الخدمات الجديد
import Contact from "@/components/pages/Home/Contact";
interface ContactPageProps {
  params: { locale: string };
}

const ContactPage = ({ params: { locale } }: ContactPageProps) => {
  // تفعيل دعم اللغة للسيرفر لضمان سرعة الاستجابة (Static Rendering)
  setRequestLocale(locale);

  return (
    <>
      <Contact />
    </>
  );
};

export default ContactPage;