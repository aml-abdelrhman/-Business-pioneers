import "../globals.css";
// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import MainLayout from "@/layouts/main-layout";
import { locales } from "@/i18n/config";
import { notFound } from "next/navigation";
import Providers from "@/components/Providers";
import { NextIntlClientProvider } from "next-intl";
import localFont from "next/font/local";
import { Inter, Cairo } from "next/font/google";
import { cn } from "@/lib/utils";
import { getTranslations, getMessages } from "next-intl/server";
import { SessionProvider } from "@/components/auth/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const handicrafts = localFont({
  src: [
    {
      path: "../fonts/ArbFonts.com-(2)/ArbFONTS-TheYearofHandicrafts-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ArbFonts.com-(2)/ArbFONTS-TheYearofHandicrafts-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-handicrafts",
});

const acumin = localFont({
  src: [
    {
      path: "../fonts/AcuminVariableConcept.otf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-acumin",
});

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale;
  const isAr = locale === "ar";

  return {
    title: isAr ? "رواد الأعمال القابضة | تميز معماري" : "Business Pioneers Holding | Architectural Excellence",
    description: isAr 
      ? "نصمم المستقبل برؤية معمارية فريدة تجمع بين الابتكار والاستدامة، لنخلق مجتمعاتٍ ذكية تعزز من جودة الحياة وتحقق تطلعات شركائنا." 
      : "Designing the future with a unique architectural vision that combines innovation and sustainability to create smart communities.",
    openGraph: {
      title: isAr ? "رواد الأعمال القابضة" : "Business Pioneers Holding",
      description: isAr 
        ? "حلول معمارية وهندسية متكاملة برؤية عصرية." 
        : "Integrated architectural and engineering solutions with a modern vision.",
      type: "website",
      siteName: "Business Pioneers Holding",
      locale: locale,
    },
    twitter: {
      title: isAr ? "رواد الأعمال القابضة" : "Business Pioneers Holding",
      card: "summary_large_image",
    },
    keywords: [
      "Architecture",
      "Business Pioneers Holding",
      "Construction",
      "Saudi Arabia",
      "Vision 2030",
      "Urban Development",
      "رواد الأعمال القابضة",
      "عمارة",
      "تصميم هندسي",
      "تطوير عقاري",
    ],
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/images/logo.png",
      shortcut: "/images/logo.png",
      apple: "/images/logo.png",
    },
  };
}

// Static params
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// RootLayout
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  if (!locales.includes(locale as any)) {
    return notFound();
  }

  const messages = await getMessages();

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
    >
      <head />
      <body
        className={cn(
          "antialiased",
          locale === "ar" ? cairo.className : inter.className,
          inter.variable,
          cairo.variable,
          handicrafts.variable,
          acumin.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>

            <SessionProvider>
              <MainLayout>{children}</MainLayout>
            </SessionProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}