import React from "react";
import Services from "@/components/pages/nav-pages/servics";
import { setRequestLocale } from "next-intl/server";

// تعريف الأنواع للـ Metadata أو الـ Params إذا لزم الأمر
interface ServicesPageProps {
  params: { locale: string };
}

const ServicesPage = ({ params: { locale } }: ServicesPageProps) => {
  // تفعيل دعم اللغة للسيرفر (Static Rendering)
  setRequestLocale(locale);

  return (
    <>
      {/* عرض مكون الخدمات الشاملة */}
      <Services />
    </>
  );
};

export default ServicesPage;