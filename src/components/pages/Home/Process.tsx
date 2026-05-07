// @/components/Home/Process.tsx
"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Process = () => {
  const t = useTranslations("home.process");
  const locale = useLocale();
  const isAr = locale === "ar";

  const steps = [
    { num: "01", title: t("step1") },
    { num: "02", title: t("step2") },
    { num: "03", title: t("step3") },
    { num: "04", title: t("step4") }
  ];

  return (
    <section className="container px-5 py-24 mx-auto lg:px-16">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-4xl font-bold text-white uppercase">{t("title")}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-800 to-purple-400" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.num} className="bg-[#302C42] p-8 rounded-[40px] border border-purple-800 flex flex-col items-center text-center gap-6 group hover:border-purple-400 transition-colors">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-700/50 blur-xl group-hover:blur-2xl" />
              <div className="relative w-24 h-24 rounded-full border-[10px] border-[#211E2E] flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400">
                <span className="text-5xl font-bold text-white/90">{step.num}</span>
              </div>
            </div>
            
            <h3 className="flex items-center gap-3 text-xl font-bold text-white">
              {isAr ? <ChevronLeft size={20} className="text-purple-400" /> : <ChevronRight size={20} className="text-purple-400" />}
              {step.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;