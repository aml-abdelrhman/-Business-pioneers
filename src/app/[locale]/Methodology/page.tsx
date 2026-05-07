import React from "react";
import AboutPageContent from "@/components/pages/nav-pages/Methodology"; // استيراد المكون الأساسي
import { setRequestLocale } from "next-intl/server";

// تعريف الأنواع للـ Metadata أو الـ Params إذا لزم الأمر
interface MethodologyPageProps {
  params: { locale: string };
}

const MethodologyPage = ({ params: { locale } }: MethodologyPageProps) => {
  // تفعيل دعم اللغة للسيرفر (Static Rendering)
  setRequestLocale(locale);

  return (
    <>
      {/* عرض محتوى الصفحة الذي صممناه بنمط معماري، وهو المكون المستورد */}
      <AboutPageContent />
    </>
  );
};

export default MethodologyPage;