import React from "react";
import AboutPageContent from "@/components/pages/nav-pages/about-nav"; // استيراد المكون الأساسي
import { setRequestLocale } from "next-intl/server";

// تعريف الأنواع للـ Metadata أو الـ Params إذا لزم الأمر
interface AboutPageProps {
  params: { locale: string };
}

const AboutNavPage = ({ params: { locale } }: AboutPageProps) => {
  // تفعيل دعم اللغة للسيرفر (Static Rendering)
  setRequestLocale(locale);

  return (
    <>
      {/* عرض محتوى الصفحة الذي صممناه بنمط معماري */}
      <AboutPageContent />
    </>
  );
};

export default AboutNavPage;