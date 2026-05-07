"use client";
import { Toaster } from "sonner";
import { useLocale } from "next-intl";
import { PropsWithChildren, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";
import { DirectionProvider } from "./ui/direction";
import moment from "moment";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/ThemeProvider";

moment.locale("ar");

const Providers = ({ children }: PropsWithChildren) => {
  const locale = useLocale();
  const queryClient = getQueryClient();
  moment.locale(locale);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DirectionProvider
          dir={locale === "ar" ? "rtl" : "ltr"}
          direction={locale === "ar" ? "rtl" : "ltr"}
        >
          <NextTopLoader
            color="#683c21"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3.1}
            crawl
            showSpinner
            easing="ease"
            speed={200}
            shadow="0 0 10px #eadec6,0 0 5px #eadec6"
            template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
          />
          <Suspense>
            <Toaster
              closeButton
              richColors
              position="top-center"
              style={{
                fontFamily:
                  locale === "ar"
                    ? "var(--font-ge-dinar-two)"
                    : "var(--font-inter)",
              }}
            />
          </Suspense>
          {children}
        </DirectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default Providers;
