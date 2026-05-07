import React from "react";
import { setRequestLocale } from "next-intl/server";
import Careers from "@/components/pages/nav-pages/Careers";

// تعريف الأنواع للـ Params
interface CareersPageProps {
  params: { locale: string };
}

const CareersPage = ({ params: { locale } }: CareersPageProps) => {
  // تفعيل دعم اللغة للسيرفر (Static Rendering) لضمان الأداء العالي
  setRequestLocale(locale);

  return (
    <>
      {/* عرض محتوى صفحة الوظائف */}
      <Careers />
    </>
  );
};

export default CareersPage;