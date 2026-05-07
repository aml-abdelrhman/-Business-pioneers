import { Navbar } from "@/components/common/navbar";
import { cn } from "@/lib/utils";
import Footer from "@/components/common/footer";
import { PropsWithChildren } from "react";
import BreadcrumbWrapper from "@/components/common/BreadcrumbWrapper";

const MainLayout = async ({ children }: PropsWithChildren) => {
  // const locale = useLocale();
  return (
    <div
      className="transition-colors bg-white min-h-svh dark:bg-zinc-900 max-w-screen"
      // dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Navbar />
      {/* <BreadcrumbWrapper /> */}
      <main
        className={cn(
          "relative z-10 min-h-[70svh] transition-colors overflow-x-hidden",
        )}
      >
        {children}
      </main>
      <Footer />
      {/* 1. THE HIDDEN SVG FILTER */}
      <svg className="hidden">
        <filter id="liquid-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
        </filter>
      </svg>
    </div>
  );
};

export default MainLayout;
