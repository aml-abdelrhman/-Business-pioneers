"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { 
  InstagramIcon, 
  SnapchatIcon, 
  TikTokIcon, 
  XTwitterIcon, 
  YoutubeIcon 
} from "@/icons";
import { 
  Building2, 
  Info, 
  PhoneCall,
  LayoutGrid,
  MapPin
} from "lucide-react"; 
import { useAppStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import InterestForm from "../pages/InterestForm";

const Footer = () => {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const { darkMode } = useAppStore();
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const isAr = locale === "ar";

  const navigationLinks = [
    { label: navT("works"), href: "/", Icon: LayoutGrid },
    { label: navT("about"), href: "/nav-pages/about-nav", Icon: Info },
    { label: navT("contact"), href: "/our-projects", Icon: Building2 },
    { label: navT("last"), href: "/contact", Icon: PhoneCall },
  ];

  const socialIcons = [
    { Icon: InstagramIcon, href: "https://instagram.com" },
    { Icon: XTwitterIcon, href: "https://twitter.com" },
    { Icon: YoutubeIcon, href: "https://youtube.com" },
    { Icon: SnapchatIcon, href: "https://snapchat.com" },
    { Icon: TikTokIcon, href: "https://tiktok.com" },
  ];

  return (
    <footer
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "relative overflow-hidden antialiased border-t",
        darkMode ? "bg-[#0b0f1a] text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"
      )}
    >
      <div className="container relative z-10 grid gap-12 px-6 py-16 mx-auto md:px-16 lg:py-24 lg:grid-cols-3">
        
        {/* Logo Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-16 h-16 overflow-hidden bg-white border-2 rounded-full shadow-xl border-amber-500">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-cover p-1"
              />
            </div>
            <div className="flex flex-col">
              <div className={cn(
                "font-inter text-xs md:text-[13px] font-black flex justify-between w-full tracking-widest",
                darkMode ? "text-white" : "text-blue-900"
              )}>
                <span>BUSINESS</span>
                <span className="mx-1">PIONEERS</span>
                <span>HOLDING</span>
              </div>
              <div className="pt-1 mt-1 border-t border-amber-500/40">
                <span className="block text-xl font-bold leading-none md:text-2xl text-amber-500 font-cairo">
                  رواد الأعمال القابضة
                </span>
              </div>
            </div>
          </div>

          <p className={cn(
            "text-base md:text-lg leading-relaxed opacity-70 max-w-md",
            isAr ? "font-cairo" : "font-inter"
          )}>
            {isAr 
              ? "نصمم المستقبل برؤية معمارية فريدة تجمع بين الابتكار والاستدامة، لنخلق مجتمعاتٍ ذكية تعزز من جودة الحياة وتحقق تطلعات شركائنا."
              : "Designing the future with a unique architectural vision that combines innovation and sustainability."
            }
          </p>
          <Button
            onClick={() => setIsInterestOpen(true)}
            className={cn(
              "px-10 py-7 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest",
              "bg-blue-900 text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20 w-fit"
            )}
          >
            {t("registerYourInterest")}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 mt-6 lg:mt-0 lg:items-center">
          <div>
            <h3 className="mb-8 text-sm font-black tracking-[0.3em] text-amber-500 uppercase">
              {isAr ? "خريطة الموقع" : "Site Map"}
            </h3>
            <div className="flex flex-col gap-4">
              {navigationLinks.map((link, index) => (
                <Link 
                  key={index} 
                  href={link.href as any} 
                  className="flex items-center gap-3 text-base font-bold transition-colors hover:text-amber-500 group"
                >
                  <link.Icon size={16} className="transition-colors text-slate-400 group-hover:text-amber-500" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col gap-8 lg:items-end">
          <div className={cn("flex flex-col gap-6", isAr ? "lg:items-start" : "lg:items-end")}>
            <h3 className="text-sm font-black tracking-[0.3em] text-amber-500 uppercase">
              {isAr ? "قنوات التواصل" : "Connect With Us"}
            </h3>
            <div className="flex gap-4">
              {socialIcons.map(({ Icon, href }, idx) => (
                <Link key={idx} href={href} target="_blank" rel="noopener noreferrer" className="p-3 transition-all rounded-xl bg-slate-500/5 hover:bg-amber-500/10 hover:-translate-y-1">
                  <Icon
                    className={cn(
                      "w-6 h-6",
                      darkMode ? "text-slate-400 hover:text-amber-500" : "text-slate-600 hover:text-blue-900"
                    )}
                  />
                </Link>
              ))}
            </div>
            
            <div className={cn("space-y-3 mt-2", isAr ? "text-right" : "text-left")}>
              <div className="flex items-center gap-3 text-lg font-black opacity-90">
                <PhoneCall size={18} className="text-amber-500" />
                <span>920014659</span>
              </div>
              <div className="flex flex-wrap gap-6 text-xs font-black tracking-widest uppercase opacity-60">
                <Link href="/privacy-policy" className="transition-colors hover:text-amber-500">{t("privacyPolicy")}</Link>
                <Link href="/terms-and-conditions" className="transition-colors hover:text-amber-500">{t("termsAndConditions")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className={cn(
        "border-t py-10 text-center",
        darkMode ? "border-white/5 bg-slate-950/50" : "border-slate-100 bg-slate-50"
      )}>
        <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">
          © 2018 - 2024 BUSINESS PIONEERS HOLDING. ALL RIGHTS RESERVED
        </p>
      </div>

      <InterestForm 
        isOpen={isInterestOpen} 
        onClose={() => setIsInterestOpen(false)} 
      />
    </footer>
  );
};

export default Footer;